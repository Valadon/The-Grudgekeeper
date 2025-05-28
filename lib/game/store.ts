import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GameState, Enemy, Room } from './types'
import { ROOM_WIDTH, ROOM_HEIGHT, TILES, ENEMY_STATS, PLAYER_STATS, TURN_DELAY } from './constants'
import { generateDungeon, getCurrentRoom } from './dungeonGenerator'
import { getRandomMessage } from './shipMessages'

interface GameStore extends GameState {
  movePlayer: (dx: number, dy: number) => void
  processTurn: () => void
  initializeGame: () => void
  flashDamage: boolean
  skipEnemyTurn: boolean  // Add flag to skip enemy movement
  addMessage: (message: string) => void
}


// Helper to check if a position is occupied by an enemy
const isEnemyAt = (enemies: Enemy[], x: number, y: number): Enemy | undefined => {
  return enemies.find(e => e.position.x === x && e.position.y === y)
}

// Simple enemy AI - move toward player
const moveEnemyTowardPlayer = (enemy: Enemy, playerPos: { x: number, y: number }, enemies: Enemy[], room: Room): { x: number, y: number } => {
  const dx = Math.sign(playerPos.x - enemy.position.x)
  const dy = Math.sign(playerPos.y - enemy.position.y)
  
  // Try to move horizontally first, then vertically
  const moves = [
    { x: enemy.position.x + dx, y: enemy.position.y },
    { x: enemy.position.x, y: enemy.position.y + dy },
  ]
  
  for (const move of moves) {
    // Check bounds
    if (move.x < 0 || move.x >= ROOM_WIDTH || move.y < 0 || move.y >= ROOM_HEIGHT) {
      continue
    }
    
    // Check walls and doors
    const tile = room.layout[move.y][move.x]
    if (tile === TILES.WALL || tile === TILES.DOOR_CLOSED) {
      continue
    }
    
    // Check other enemies
    if (isEnemyAt(enemies, move.x, move.y)) {
      continue
    }
    
    // Don't move into player space (will be handled by combat)
    if (move.x === playerPos.x && move.y === playerPos.y) {
      continue
    }
    
    return move
  }
  
  // Can't move, stay in place
  return enemy.position
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    player: { x: 5, y: 5 },
    playerHp: PLAYER_STATS.MAX_HP,
    playerMaxHp: PLAYER_STATS.MAX_HP,
    dungeon: generateDungeon(),
    turnCount: 0,
    isProcessingTurn: false,
    gameStatus: 'playing',
    flashDamage: false,
    skipEnemyTurn: false,
    messages: [],
    
    movePlayer: (dx, dy) => {
      const state = get()
      if (state.isProcessingTurn || state.gameStatus !== 'playing') return
      
      let shouldProcessTurn = false
      
      set((state) => {
        const newX = state.player.x + dx
        const newY = state.player.y + dy
        
        // Reset skip flag
        state.skipEnemyTurn = false
        
        // Handle wait action (no movement)
        if (dx === 0 && dy === 0) {
          state.isProcessingTurn = true
          shouldProcessTurn = true
          return
        }
        
        // Bounds check
        if (newX < 0 || newX >= ROOM_WIDTH || 
            newY < 0 || newY >= ROOM_HEIGHT) {
          return
        }
        
        // Get current room
        const currentRoom = getCurrentRoom(state.dungeon)
        const targetTile = currentRoom.layout[newY][newX]
        
        // Wall collision check
        if (targetTile === TILES.WALL) {
          return
        }
        
        // Door interaction
        if (targetTile === TILES.DOOR_CLOSED) {
          // Open the door
          currentRoom.layout[newY][newX] = TILES.DOOR_OPEN
          
          // Update door state based on position and open the corresponding door in adjacent room
          if (newY === 0 && currentRoom.doors.north) {
            currentRoom.doors.north.isOpen = true
            // Open south door in room above
            if (state.dungeon.currentY > 0) {
              const northRoom = state.dungeon.rooms[state.dungeon.currentY - 1][state.dungeon.currentX]
              northRoom.layout[ROOM_HEIGHT - 1][Math.floor(ROOM_WIDTH / 2)] = TILES.DOOR_OPEN
              if (northRoom.doors.south) northRoom.doors.south.isOpen = true
            }
          } else if (newY === ROOM_HEIGHT - 1 && currentRoom.doors.south) {
            currentRoom.doors.south.isOpen = true
            // Open north door in room below
            if (state.dungeon.currentY < 2) {
              const southRoom = state.dungeon.rooms[state.dungeon.currentY + 1][state.dungeon.currentX]
              southRoom.layout[0][Math.floor(ROOM_WIDTH / 2)] = TILES.DOOR_OPEN
              if (southRoom.doors.north) southRoom.doors.north.isOpen = true
            }
          } else if (newX === 0 && currentRoom.doors.west) {
            currentRoom.doors.west.isOpen = true
            // Open east door in room to the left
            if (state.dungeon.currentX > 0) {
              const westRoom = state.dungeon.rooms[state.dungeon.currentY][state.dungeon.currentX - 1]
              westRoom.layout[Math.floor(ROOM_HEIGHT / 2)][ROOM_WIDTH - 1] = TILES.DOOR_OPEN
              if (westRoom.doors.east) westRoom.doors.east.isOpen = true
            }
          } else if (newX === ROOM_WIDTH - 1 && currentRoom.doors.east) {
            currentRoom.doors.east.isOpen = true
            // Open west door in room to the right
            if (state.dungeon.currentX < 2) {
              const eastRoom = state.dungeon.rooms[state.dungeon.currentY][state.dungeon.currentX + 1]
              eastRoom.layout[Math.floor(ROOM_HEIGHT / 2)][0] = TILES.DOOR_OPEN
              if (eastRoom.doors.west) eastRoom.doors.west.isOpen = true
            }
          }
          
          // Opening a door counts as a turn
          state.isProcessingTurn = true
          shouldProcessTurn = true
          // Add door message
          state.messages.push(getRandomMessage('doorOpen'))
          return
        }
        
        // Check for enemy at target position
        const targetEnemy = isEnemyAt(currentRoom.enemies, newX, newY)
        if (targetEnemy) {
          // Attack the enemy!
          const enemyIndex = currentRoom.enemies.findIndex(e => e.id === targetEnemy.id)
          currentRoom.enemies[enemyIndex].hp -= PLAYER_STATS.DAMAGE
          
          // Remove dead enemies
          if (currentRoom.enemies[enemyIndex].hp <= 0) {
            currentRoom.enemies.splice(enemyIndex, 1)
            // Add kill message
            state.messages.push(getRandomMessage('enemyKill'))
          }
          
          // Attack counts as a turn but don't move
          state.isProcessingTurn = true
          shouldProcessTurn = true
          return
        }
        
        // Check for room transitions through open doors
        if (targetTile === TILES.DOOR_OPEN) {
          // North door
          if (newY === 0 && state.dungeon.currentY > 0) {
            state.dungeon.currentY--
            state.player.y = ROOM_HEIGHT - 2
            getCurrentRoom(state.dungeon).visited = true
          }
          // South door
          else if (newY === ROOM_HEIGHT - 1 && state.dungeon.currentY < 2) {
            state.dungeon.currentY++
            state.player.y = 1
            getCurrentRoom(state.dungeon).visited = true
          }
          // West door
          else if (newX === 0 && state.dungeon.currentX > 0) {
            state.dungeon.currentX--
            state.player.x = ROOM_WIDTH - 2
            getCurrentRoom(state.dungeon).visited = true
          }
          // East door
          else if (newX === ROOM_WIDTH - 1 && state.dungeon.currentX < 2) {
            state.dungeon.currentX++
            state.player.x = 1
            getCurrentRoom(state.dungeon).visited = true
          }
          
          // Room transition - skip enemy movement
          state.turnCount++
          state.skipEnemyTurn = true
          // Add room entry message
          state.messages.push(getRandomMessage('roomEntry'))
          return
        }
        
        // Check for stairs (floor complete)
        if (targetTile === TILES.STAIRS) {
          state.gameStatus = 'floor_complete'
          state.messages.push(getRandomMessage('findExit'))
          return
        }
        
        // Move player
        state.player.x = newX
        state.player.y = newY
        
        // Player moved, process turn
        state.isProcessingTurn = true
        shouldProcessTurn = true
      })
      
      // Process turn after a delay for visual feedback if needed
      if (shouldProcessTurn) {
        setTimeout(() => {
          get().processTurn()
        }, TURN_DELAY)
      }
    },
    
    processTurn: () => set((state) => {
      const currentRoom = getCurrentRoom(state.dungeon)
      
      // Skip enemy movement if we just entered a room
      if (!state.skipEnemyTurn) {
        // Move all enemies and check for attacks
        currentRoom.enemies.forEach((enemy, index) => {
          // Check if enemy is adjacent to player
          const dx = Math.abs(enemy.position.x - state.player.x)
          const dy = Math.abs(enemy.position.y - state.player.y)
          
          if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Enemy is adjacent, attack!
            state.playerHp -= ENEMY_STATS.GOBLIN.damage
            state.flashDamage = true
            // Add damage message
            state.messages.push(getRandomMessage('takeDamage'))
            
            // Check for player death
            if (state.playerHp <= 0) {
              state.playerHp = 0
              state.gameStatus = 'dead'
              state.messages.push(getRandomMessage('death'))
            }
            
            // Set timeout to remove flash
            setTimeout(() => {
              set((state) => {
                state.flashDamage = false
              })
            }, 200)
          } else {
            // Not adjacent, move toward player
            const newPos = moveEnemyTowardPlayer(
              enemy,
              state.player,
              currentRoom.enemies,
              currentRoom
            )
            currentRoom.enemies[index].position = newPos
          }
        })
      }
      
      // Increment turn counter
      state.turnCount++
      
      // Turn processing complete
      state.isProcessingTurn = false
      state.skipEnemyTurn = false
    }),
    
    initializeGame: () => set((state) => {
      state.player = { x: 5, y: 5 }
      state.playerHp = PLAYER_STATS.MAX_HP
      state.playerMaxHp = PLAYER_STATS.MAX_HP
      state.dungeon = generateDungeon()
      state.turnCount = 0
      state.isProcessingTurn = false
      state.gameStatus = 'playing'
      state.flashDamage = false
      state.skipEnemyTurn = false
      state.messages = []
    }),
    
    addMessage: (message) => set((state) => {
      state.messages.push(message)
      // Keep only last 10 messages
      if (state.messages.length > 10) {
        state.messages = state.messages.slice(-10)
      }
    }),
  }))
)