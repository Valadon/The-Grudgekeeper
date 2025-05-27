import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GameState } from './types'
import { ROOM_WIDTH, ROOM_HEIGHT, TILES } from './constants'

interface GameStore extends GameState {
  movePlayer: (dx: number, dy: number) => void
  initializeGame: () => void
}

// Hardcoded test room
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

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    player: { x: 5, y: 5 },
    currentRoom: TEST_ROOM,
    
    movePlayer: (dx, dy) => set((state) => {
      const newX = state.player.x + dx
      const newY = state.player.y + dy
      
      // Bounds check
      if (newX < 0 || newX >= ROOM_WIDTH || 
          newY < 0 || newY >= ROOM_HEIGHT) {
        return
      }
      
      // Collision check
      if (state.currentRoom[newY][newX] === TILES.WALL) {
        return
      }
      
      state.player.x = newX
      state.player.y = newY
    }),
    
    initializeGame: () => set((state) => {
      state.player = { x: 5, y: 5 }
      state.currentRoom = TEST_ROOM
    }),
  }))
)