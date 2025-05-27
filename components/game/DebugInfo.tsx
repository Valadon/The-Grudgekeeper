'use client'

import { useGameStore } from '@/lib/game/store'

export function DebugInfo() {
  const player = useGameStore((state) => state.player)
  
  return (
    <div className="text-sm text-gray-500 mt-4">
      Player Position: ({player.x}, {player.y})
    </div>
  )
}