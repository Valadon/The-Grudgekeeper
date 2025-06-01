'use client'

import { useGameStore } from '@/lib/game/store'
import { getCurrentRoom } from '@/lib/game/dungeonGenerator'

export function DebugInfo() {
  const player = useGameStore((state) => state.player)
  const turnCount = useGameStore((state) => state.turnCount)
  const dungeon = useGameStore((state) => state.dungeon)
  const currentRoom = getCurrentRoom(dungeon)
  
  return (
    <div className="text-sm text-gray-500 font-mono bg-gray-800 border border-gray-700 rounded p-4">
      <div>Player Position: ({player.x}, {player.y})</div>
      <div>Turn: {turnCount}</div>
      <div>Enemies: {currentRoom.enemies.length}</div>
    </div>
  )
}