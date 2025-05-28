'use client'

import { useGameStore } from '@/lib/game/store'

export function GameOverScreen() {
  const gameStatus = useGameStore((state) => state.gameStatus)
  const initializeGame = useGameStore((state) => state.initializeGame)
  const turnCount = useGameStore((state) => state.turnCount)
  
  if (gameStatus === 'playing') return null
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-red-500">
          YOU DIED
        </h2>
        <p className="text-gray-400 mb-2">
          Died to a goblin on floor 1
        </p>
        <p className="text-gray-400 mb-8">
          Survived {turnCount} turns
        </p>
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