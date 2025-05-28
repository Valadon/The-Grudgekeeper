'use client'

import { useGameStore } from '@/lib/game/store'

export function HealthDisplay() {
  const playerHp = useGameStore((state) => state.playerHp)
  const playerMaxHp = useGameStore((state) => state.playerMaxHp)
  
  return (
    <div className="text-xl font-bold">
      {Array.from({ length: playerMaxHp }, (_, i) => (
        <span key={i} className={i < playerHp ? 'text-red-500' : 'text-gray-700'}>
          {i < playerHp ? '♥' : '♡'}
        </span>
      ))}
    </div>
  )
}