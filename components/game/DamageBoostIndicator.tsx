'use client'

import { useGameStore } from '@/lib/game/store'

export default function DamageBoostIndicator() {
  const damageBoost = useGameStore((state) => state.damageBoost)
  
  if (!damageBoost) {
    return null
  }
  
  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      <span className="text-yellow-500">⚔️ Damage Boost:</span>
      <span className="text-green-400">
        +{damageBoost.bonusDamage} damage ({damageBoost.turnsRemaining} attacks left)
      </span>
    </div>
  )
}