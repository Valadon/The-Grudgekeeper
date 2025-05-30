'use client'

import { useEffect } from 'react'
import { GameCanvas } from '@/components/game/GameCanvas'
import { DebugInfo } from '@/components/game/DebugInfo'
import { GameOverScreen } from '@/components/game/GameOverScreen'
import { TopBar } from '@/components/game/TopBar'
import { ShipCommunication } from '@/components/game/ShipCommunication'
import { useGameStore } from '@/lib/game/store'
import { useInput } from '@/lib/game/useInput'

export default function GamePage() {
  const initializeGame = useGameStore((state) => state.initializeGame)
  const godMode = useGameStore((state) => state.godMode)
  
  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])
  
  // Set up input handling
  useInput()
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <TopBar />
      
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4">
          The Grudgekeeper - Prototype
        </h1>
        
        <ShipCommunication />
        
        <div className="relative">
          <GameCanvas />
          <GameOverScreen />
        </div>
        
        <DebugInfo />
        
        <div className="mt-8 text-sm text-gray-600">
          Use WASD or Arrow Keys to move • Bump into enemies to attack • Space to wait • R to restart when dead • G to toggle god mode
        </div>
        
        {godMode && (
          <div className="mt-2 text-yellow-500 font-bold animate-pulse">
            🔱 GOD MODE ACTIVE 🔱
          </div>
        )}
      </div>
    </div>
  )
}