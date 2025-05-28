'use client'

import { useEffect } from 'react'
import { GameCanvas } from '@/components/game/GameCanvas'
import { DebugInfo } from '@/components/game/DebugInfo'
import { useGameStore } from '@/lib/game/store'
import { useInput } from '@/lib/game/useInput'

export default function GamePage() {
  const initializeGame = useGameStore((state) => state.initializeGame)
  
  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])
  
  // Set up input handling
  useInput()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">
        The Grudgekeeper - Prototype
      </h1>
      
      <GameCanvas />
      
      <DebugInfo />
      
      <div className="mt-8 text-sm text-gray-600">
        Use WASD or Arrow Keys to move
      </div>
    </div>
  )
}