'use client'

import { useGameStore } from '@/lib/game/store'
import { getTotalGrudgePoints } from '@/lib/game/grudgeSystem'

export function GameOverScreen() {
  const gameStatus = useGameStore((state) => state.gameStatus)
  const initializeGame = useGameStore((state) => state.initializeGame)
  const turnCount = useGameStore((state) => state.turnCount)
  const dungeon = useGameStore((state) => state.dungeon)
  const lastDeathCause = useGameStore((state) => state.lastDeathCause)
  const lastRunGrudgePoints = useGameStore((state) => state.lastRunGrudgePoints)
  const expeditionRank = useGameStore((state) => state.expeditionRank)
  const totalKills = useGameStore((state) => state.totalKills)
  const roomsCleared = useGameStore((state) => state.roomsCleared)
  
  if (gameStatus === 'playing') return null
  
  if (gameStatus === 'floor_complete') {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-yellow-500">
            FLOOR COMPLETE
          </h2>
          <p className="text-gray-400 mb-2">
            Completed floor 1
          </p>
          <p className="text-gray-400 mb-2">
            Turns taken: {turnCount}
          </p>
          <p className="text-gray-400 mb-8">
            Rooms explored: {dungeon.rooms.flat().filter(r => r.visited).length} / 9
          </p>
          <button
            onClick={initializeGame}
            className="text-xl text-green-500 hover:text-white border border-green-500 px-6 py-2 hover:border-white"
          >
            [CONTINUE]
          </button>
        </div>
      </div>
    )
  }
  
  // Dead state
  const totalGP = getTotalGrudgePoints()
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-red-500">
          YOU DIED
        </h2>
        <p className="text-gray-400 mb-2">
          {lastDeathCause || 'Died to a goblin on floor 1'}
        </p>
        <p className="text-gray-400 mb-4">
          Survived {turnCount} turns
        </p>
        
        {lastRunGrudgePoints && (
          <div className="mb-6 border border-gray-600 p-4">
            <h3 className="text-xl text-yellow-500 mb-2">GRUDGE POINTS EARNED</h3>
            <div className="text-sm text-gray-400 mb-2 text-left">
              <p>Base: 50 GP</p>
              <p>Enemies killed: {totalKills} × 10 = {totalKills * 10} GP</p>
              <p>Rooms cleared: {roomsCleared} × 20 = {roomsCleared * 20} GP</p>
              <p>Expedition rank: {expeditionRank} × 50 = {expeditionRank * 50} GP</p>
              <p>Turns survived: {turnCount} × 1 = {turnCount} GP</p>
            </div>
            <div className="border-t border-gray-600 pt-2 mt-2">
              <p className="text-2xl text-white mb-1">+{lastRunGrudgePoints} GP</p>
              <p className="text-sm text-gray-500">Total: {totalGP} GP</p>
            </div>
          </div>
        )}
        
        <button
          onClick={initializeGame}
          className="text-xl text-green-500 hover:text-white border border-green-500 px-6 py-2 hover:border-white"
        >
          [RESTART]
        </button>
      </div>
    </div>
  )
}