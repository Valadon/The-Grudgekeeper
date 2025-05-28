'use client'

import { useGameStore } from '@/lib/game/store'

export function RoomIndicator() {
  const { dungeon } = useGameStore()
  
  return (
    <div className="text-gray-300">
      Room: {dungeon.currentX}-{dungeon.currentY}
    </div>
  )
}