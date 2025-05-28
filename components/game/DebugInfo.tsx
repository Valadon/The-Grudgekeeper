'use client'

import { useGameStore } from '@/lib/game/store'

export function DebugInfo() {
  const player = useGameStore((state) => state.player)
  const turnCount = useGameStore((state) => state.turnCount)
  const enemies = useGameStore((state) => state.enemies)
  
  return (
    <div className="text-sm text-gray-500 mt-4 font-mono">
      <div>Player Position: ({player.x}, {player.y})</div>
      <div>Turn: {turnCount}</div>
      <div>Enemies: {enemies.length}</div>
    </div>
  )
}