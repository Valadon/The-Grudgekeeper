'use client'

import { useGameStore } from '@/lib/game/store'
import { TILE_DISPLAY, TILES } from '@/lib/game/constants'

export function DungeonGrid() {
  const { currentRoom, player } = useGameStore()
  
  // Build each row as colored HTML
  const rows = currentRoom.map((row, y) => {
    return row.map((tile, x) => {
      const isPlayer = player.x === x && player.y === y
      const char = isPlayer 
        ? TILE_DISPLAY.PLAYER 
        : tile === TILES.WALL 
          ? TILE_DISPLAY[TILES.WALL]
          : TILE_DISPLAY[TILES.FLOOR]
      
      const color = isPlayer ? '#4ade80' : tile === TILES.WALL ? '#9ca3af' : '#4b5563'
      
      return `<span style="color: ${color}">${char}</span>`
    }).join('')
  }).join('\n')
  
  return (
    <div className="bg-black p-4">
      <pre 
        style={{ 
          margin: 0, 
          fontSize: '16px', 
          lineHeight: '1',
          fontFamily: "'Space Mono', 'Courier New', monospace"
        }}
        dangerouslySetInnerHTML={{ __html: rows }}
      />
    </div>
  )
}