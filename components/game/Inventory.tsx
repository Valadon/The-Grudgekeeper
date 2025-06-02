'use client'

import { useGameStore } from '@/lib/game/store'
import { ITEM_DEFINITIONS } from '@/lib/game/constants'

export default function Inventory() {
  const inventory = useGameStore((state) => state.inventory)
  
  // Handle case where inventory hasn't been initialized yet
  if (!inventory) {
    return null
  }
  
  return (
    <div className="flex items-center gap-4 text-sm font-mono">
      <span className="text-gray-400">Items:</span>
      <div className="flex gap-3">
        {inventory.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1"
          >
            <span className="text-yellow-500">[{index + 1}]</span>
            {item ? (
              <span className="text-green-400">
                {ITEM_DEFINITIONS[item.type].name}
              </span>
            ) : (
              <span className="text-gray-600">Empty</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}