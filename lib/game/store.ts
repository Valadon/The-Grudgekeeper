import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GameState, Enemy } from './types'
import { ROOM_WIDTH, ROOM_HEIGHT, TILES, ENEMY_STATS, TURN_DELAY } from './constants'

interface GameStore extends GameState {
  movePlayer: (dx: number, dy: number) => void
  processTurn: () => void
  initializeGame: () => void
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
const isEnemyAt = (enemies: Enemy[], x: number, y: number): boolean => {
  return enemies.some(e => e.position.x === x && e.position.y === y)
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
    
    // Check player collision (for now, just don't move into player)
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
    currentRoom: TEST_ROOM,
    enemies: [],
    turnCount: 0,
    isProcessingTurn: false,
    
    movePlayer: (dx, dy) => {
      const state = get()
      if (state.isProcessingTurn) return
      
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
        
        // Enemy collision check (for now, just block movement)
        if (isEnemyAt(state.enemies, newX, newY)) {
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
      // Move all enemies
      state.enemies.forEach((enemy, index) => {
        const newPos = moveEnemyTowardPlayer(
          enemy,
          state.player,
          state.enemies,
          state.currentRoom
        )
        state.enemies[index].position = newPos
      })
      
      // Increment turn counter
      state.turnCount++
      
      // Turn processing complete
      state.isProcessingTurn = false
    }),
    
    initializeGame: () => set((state) => {
      state.player = { x: 5, y: 5 }
      state.currentRoom = TEST_ROOM
      state.enemies = [
        createGoblin(2, 2),
        createGoblin(7, 7),
        createGoblin(2, 7),
      ]
      state.turnCount = 0
      state.isProcessingTurn = false
    }),
  }))
)