'use client'

import { useGameStore } from '@/lib/game/store'
import { getDeathCount } from '@/lib/game/dwarfNames'

export function DwarfNameDisplay() {
  const currentDwarfName = useGameStore((state) => state.currentDwarfName)
  const deathCount = getDeathCount()
  
  return (
    <div className="bg-gray-900 border border-gray-700 p-2 mb-2">
      <div className="text-xs text-gray-500 mb-1">Current Dwarf:</div>
      <div className="text-sm text-white font-bold">{currentDwarfName || 'Unknown Dwarf'}</div>
      {deathCount > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          Total Deaths: {deathCount}
        </div>
      )}
    </div>
  )
}