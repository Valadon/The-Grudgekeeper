import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GameState, Enemy } from './types'
import { ROOM_WIDTH, ROOM_HEIGHT, TILES, ENEMY_STATS, PLAYER_STATS, TURN_DELAY } from './constants'

interface GameStore extends GameState {
  movePlayer: (dx: number, dy: number) => void
  processTurn: () => void
  initializeGame: () => void
  flashDamage: boolean
}

// Hardcoded test room (10x10 total, 8x8 playable)
const TEST_ROOM = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
]

// Helper to create a test enemy
const createGoblin = (x: number, y: number): Enemy => ({
  id: `goblin-${x}-${y}-${Date.now()}`,
  type: 'goblin',
  position: { x, y },
  hp: ENEMY_STATS.GOBLIN.hp,
  maxHp: ENEMY_STATS.GOBLIN.hp,
})

// Helper to check if a position is occupied by an enemy
const isEnemyAt = (enemies: Enemy[], x: number, y: number): Enemy | undefined => {
  return enemies.find(e => e.position.x === x && e.position.y === y)
}

// Simple enemy AI - move toward player
const moveEnemyTowardPlayer = (enemy: Enemy, playerPos: { x: number, y: number }, enemies: Enemy[], room: number[][]): { x: number, y: number } => {
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
    
    // Check walls
    if (room[move.y][move.x] === TILES.WALL) {
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
    currentRoom: TEST_ROOM,
    enemies: [],
    turnCount: 0,
    isProcessingTurn: false,
    gameStatus: 'playing',
    flashDamage: false,
    
    movePlayer: (dx, dy) => {
      const state = get()
      if (state.isProcessingTurn || state.gameStatus !== 'playing') return
      
      set((state) => {
        const newX = state.player.x + dx
        const newY = state.player.y + dy
        
        // Bounds check
        if (newX < 0 || newX >= ROOM_WIDTH || 
            newY < 0 || newY >= ROOM_HEIGHT) {
          return
        }
        
        // Wall collision check
        if (state.currentRoom[newY][newX] === TILES.WALL) {
          return
        }
        
        // Check for enemy at target position
        const targetEnemy = isEnemyAt(state.enemies, newX, newY)
        if (targetEnemy) {
          // Attack the enemy!
          const enemyIndex = state.enemies.findIndex(e => e.id === targetEnemy.id)
          state.enemies[enemyIndex].hp -= PLAYER_STATS.DAMAGE
          
          // Remove dead enemies
          if (state.enemies[enemyIndex].hp <= 0) {
            state.enemies.splice(enemyIndex, 1)
          }
          
          // Attack counts as a turn but don't move
          state.isProcessingTurn = true
          return
        }
        
        // Move player
        state.player.x = newX
        state.player.y = newY
        
        // Player moved, process turn
        state.isProcessingTurn = true
      })
      
      // Process turn after a delay for visual feedback
      setTimeout(() => {
        get().processTurn()
      }, TURN_DELAY)
    },
    
    processTurn: () => set((state) => {
      // Move all enemies and check for attacks
      state.enemies.forEach((enemy, index) => {
        // Check if enemy is adjacent to player
        const dx = Math.abs(enemy.position.x - state.player.x)
        const dy = Math.abs(enemy.position.y - state.player.y)
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
          // Enemy is adjacent, attack!
          state.playerHp -= ENEMY_STATS.GOBLIN.damage
          state.flashDamage = true
          
          // Check for player death
          if (state.playerHp <= 0) {
            state.playerHp = 0
            state.gameStatus = 'dead'
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
            state.enemies,
            state.currentRoom
          )
          state.enemies[index].position = newPos
        }
      })
      
      // Increment turn counter
      state.turnCount++
      
      // Turn processing complete
      state.isProcessingTurn = false
    }),
    
    initializeGame: () => set((state) => {
      state.player = { x: 5, y: 5 }
      state.playerHp = PLAYER_STATS.MAX_HP
      state.playerMaxHp = PLAYER_STATS.MAX_HP
      state.currentRoom = TEST_ROOM
      state.enemies = [
        createGoblin(2, 2),
        createGoblin(7, 7),
        createGoblin(2, 7),
      ]
      state.turnCount = 0
      state.isProcessingTurn = false
      state.gameStatus = 'playing'
      state.flashDamage = false
    }),
  }))
)