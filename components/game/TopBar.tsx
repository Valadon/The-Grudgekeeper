'use client'

import { useGameStore } from '@/lib/game/store'
import { HealthDisplay } from './HealthDisplay'

export function TopBar() {
  const turnCount = useGameStore((state) => state.turnCount)
  const dungeon = useGameStore((state) => state.dungeon)
  
  // Room position display (1-indexed for user friendliness)
  const roomX = dungeon.currentX + 1
  const roomY = dungeon.currentY + 1
  
  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between text-gray-300">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Ship:</span>
            <span className="text-yellow-500 font-bold">[Grumpy]</span>
          </div>
          <HealthDisplay />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Room:</span>
            <span className="text-cyan-500">{roomX}-{roomY}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Turns:</span>
            <span className="text-green-500">{turnCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}