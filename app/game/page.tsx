'use client'

import { useEffect } from 'react'
import { GameCanvas } from '@/components/game/GameCanvas'
import { DebugInfo } from '@/components/game/DebugInfo'
import { GameOverScreen } from '@/components/game/GameOverScreen'
import { TopBar } from '@/components/game/TopBar'
import { ShipCommunication } from '@/components/game/ShipCommunication'
import { StatsPanel } from '@/components/game/StatsPanel'
import Inventory from '@/components/game/Inventory'
import DamageBoostIndicator from '@/components/game/DamageBoostIndicator'
import { DwarfNameDisplay } from '@/components/game/DwarfNameDisplay'
import { useGameStore } from '@/lib/game/store'
import { useInput } from '@/lib/game/useInput'

export default function GamePage() {
  const initializeGame = useGameStore((state) => state.initializeGame)
  const godMode = useGameStore((state) => state.godMode)
  
  // Initialize game on mount
  useEffect(() => {
    // One-time clear of old dwarf data format (remove this after testing)
    if (typeof window !== 'undefined' && !localStorage.getItem('dwarf_data_migrated_v2')) {
      localStorage.removeItem('currentDwarf')
      localStorage.removeItem('totalDeathCount')
      localStorage.removeItem('grudgekeeper_currentDwarf')
      localStorage.removeItem('grudgekeeper_dwarfUsed')
      localStorage.setItem('dwarf_data_migrated_v2', 'true')
    }
    
    initializeGame()
  }, [initializeGame])
  
  // Set up input handling
  useInput()
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <TopBar />
      
      <div className="p-8">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-2xl font-bold mb-4">
            The Grudgekeeper - Prototype
          </h1>
          
          <ShipCommunication />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <GameCanvas />
            <GameOverScreen />
            <div className="mt-4 space-y-2">
              <Inventory />
              <DamageBoostIndicator />
            </div>
          </div>
          
          <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DwarfNameDisplay />
            <StatsPanel />
            <DebugInfo />
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-8">
          <div className="text-sm text-gray-600">
            Use WASD or Arrow Keys to move • Bump into enemies to attack • Space to wait • R to restart when dead • G to toggle god mode
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Number keys 1-3 to use items • Walk over items to pick them up
          </div>
          
          {godMode && (
            <div className="mt-2 text-yellow-500 font-bold animate-pulse">
              🔱 GOD MODE ACTIVE 🔱
            </div>
          )}
        </div>
      </div>
    </div>
  )
}