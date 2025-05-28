import { useEffect, useRef } from 'react'
import { useGameStore } from './store'
import { TILE_SIZE, TILE_DISPLAY, COLORS, ROOM_WIDTH, ROOM_HEIGHT, TILES } from './constants'

export function useRenderer(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const { currentRoom, player } = useGameStore()
  const animationFrameId = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = ROOM_WIDTH * TILE_SIZE
    canvas.height = ROOM_HEIGHT * TILE_SIZE
    
    // Configure text rendering
    ctx.font = `${TILE_SIZE * 0.8}px 'Space Mono', monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw room
      for (let y = 0; y < ROOM_HEIGHT; y++) {
        for (let x = 0; x < ROOM_WIDTH; x++) {
          const tile = currentRoom[y][x]
          const centerX = x * TILE_SIZE + TILE_SIZE / 2
          const centerY = y * TILE_SIZE + TILE_SIZE / 2
          
          // Set color based on tile type
          if (tile === TILES.WALL) {
            ctx.fillStyle = COLORS.WALL
            ctx.fillText(TILE_DISPLAY[TILES.WALL], centerX, centerY)
          } else {
            ctx.fillStyle = COLORS.FLOOR
            ctx.fillText(TILE_DISPLAY[TILES.FLOOR], centerX, centerY)
          }
        }
      }
      
      // Draw player
      const playerCenterX = player.x * TILE_SIZE + TILE_SIZE / 2
      const playerCenterY = player.y * TILE_SIZE + TILE_SIZE / 2
      ctx.fillStyle = COLORS.PLAYER
      ctx.fillText(TILE_DISPLAY.PLAYER, playerCenterX, playerCenterY)
    }
    
    // Initial render
    render()
    
    // Clean up
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [currentRoom, player, canvasRef])
}