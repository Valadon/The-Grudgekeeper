'use client'

import { useGameStore } from '@/lib/game/store'
import { TILE_DISPLAY, TILES } from '@/lib/game/constants'

export function DungeonGrid() {
  const { currentRoom, player } = useGameStore()
  
  return (
    <div className="font-mono text-2xl leading-none">
      {currentRoom.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tile, x) => {
            const isPlayer = player.x === x && player.y === y
            
            return (
              <span
                key={`${x}-${y}`}
                className={`
                  w-8 h-8 flex items-center justify-center
                  ${isPlayer ? 'text-green-400' : ''}
                  ${tile === TILES.WALL ? 'text-gray-600' : 'text-gray-800'}
                `}
              >
                {isPlayer 
                  ? TILE_DISPLAY.PLAYER 
                  : tile === TILES.WALL 
                    ? TILE_DISPLAY[TILES.WALL]
                    : TILE_DISPLAY[TILES.FLOOR]
                }
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}