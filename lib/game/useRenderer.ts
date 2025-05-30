import { useEffect } from 'react'
import { useGameStore } from './store'
import { TILE_SIZE, TILE_DISPLAY, COLORS, ROOM_WIDTH, ROOM_HEIGHT, TILES } from './constants'
import { getCurrentRoom } from './dungeonGenerator'

export function useRenderer(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const dungeon = useGameStore((state) => state.dungeon)
  const player = useGameStore((state) => state.player)
  const flashDamage = useGameStore((state) => state.flashDamage)
  const damageFlash = useGameStore((state) => state.damageFlash)
  const projectiles = useGameStore((state) => state.projectiles)
  const updateProjectiles = useGameStore((state) => state.updateProjectiles)
  
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
      // Clear canvas with damage flash effect
      if (flashDamage || damageFlash) {
        ctx.fillStyle = '#330000' // Dark red tint
      } else {
        ctx.fillStyle = '#000000'
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Get current room
      const currentRoom = getCurrentRoom(dungeon)
      
      // Draw room
      for (let y = 0; y < ROOM_HEIGHT; y++) {
        for (let x = 0; x < ROOM_WIDTH; x++) {
          const tile = currentRoom.layout[y][x]
          const centerX = x * TILE_SIZE + TILE_SIZE / 2
          const centerY = y * TILE_SIZE + TILE_SIZE / 2
          
          // Set color and display based on tile type
          switch (tile) {
            case TILES.WALL:
              ctx.fillStyle = COLORS.WALL
              ctx.fillText(TILE_DISPLAY[TILES.WALL], centerX, centerY)
              break
            case TILES.DOOR_CLOSED:
              ctx.fillStyle = COLORS.DOOR
              ctx.fillText(TILE_DISPLAY[TILES.DOOR_CLOSED], centerX, centerY)
              break
            case TILES.DOOR_OPEN:
              ctx.fillStyle = COLORS.DOOR
              ctx.fillText(TILE_DISPLAY[TILES.DOOR_OPEN], centerX, centerY)
              break
            case TILES.STAIRS:
              ctx.fillStyle = COLORS.STAIRS
              ctx.fillText(TILE_DISPLAY[TILES.STAIRS], centerX, centerY)
              break
            default:
              ctx.fillStyle = COLORS.FLOOR
              ctx.fillText(TILE_DISPLAY[TILES.FLOOR], centerX, centerY)
          }
        }
      }
      
      // Draw enemies
      currentRoom.enemies.forEach(enemy => {
        const enemyCenterX = enemy.position.x * TILE_SIZE + TILE_SIZE / 2
        const enemyCenterY = enemy.position.y * TILE_SIZE + TILE_SIZE / 2
        
        // Set color based on enemy type
        switch (enemy.type) {
          case 'archer':
            ctx.fillStyle = COLORS.ARCHER
            ctx.fillText(TILE_DISPLAY.ARCHER, enemyCenterX, enemyCenterY)
            break
          case 'rust_beast':
            ctx.fillStyle = COLORS.RUST_BEAST
            ctx.fillText(TILE_DISPLAY.RUST_BEAST, enemyCenterX, enemyCenterY)
            break
          default:
            ctx.fillStyle = COLORS.ENEMY
            ctx.fillText(TILE_DISPLAY.GOBLIN, enemyCenterX, enemyCenterY)
        }
      })
      
      // Draw projectiles
      projectiles.forEach(projectile => {
        const projCenterX = projectile.current.x * TILE_SIZE + TILE_SIZE / 2
        const projCenterY = projectile.current.y * TILE_SIZE + TILE_SIZE / 2
        ctx.fillStyle = COLORS.PROJECTILE
        ctx.fillText(TILE_DISPLAY.PROJECTILE, projCenterX, projCenterY)
      })
      
      // Draw player
      const playerCenterX = player.x * TILE_SIZE + TILE_SIZE / 2
      const playerCenterY = player.y * TILE_SIZE + TILE_SIZE / 2
      ctx.fillStyle = COLORS.PLAYER
      ctx.fillText(TILE_DISPLAY.PLAYER, playerCenterX, playerCenterY)
    }
    
    // Initial render
    render()
    
    // Set up projectile animation loop
    let animationId: number
    const animate = () => {
      if (projectiles.length > 0) {
        updateProjectiles()
        render()
      }
      animationId = requestAnimationFrame(animate)
    }
    
    if (projectiles.length > 0) {
      animationId = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [dungeon, player, flashDamage, damageFlash, projectiles, canvasRef, updateProjectiles])
}