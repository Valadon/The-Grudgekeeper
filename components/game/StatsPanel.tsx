'use client'

import { useGameStore } from '@/lib/game/store'
import { RANK_THRESHOLDS, RANK_BONUS, PLAYER_STATS } from '@/lib/game/constants'

export function StatsPanel() {
  const expeditionRank = useGameStore((state) => state.expeditionRank)
  const roomsCleared = useGameStore((state) => state.roomsCleared)
  const totalKills = useGameStore((state) => state.totalKills)
  const playerMaxHp = useGameStore((state) => state.playerMaxHp)
  
  // Calculate current stats
  const rankMultiplier = 1 + (expeditionRank * RANK_BONUS)
  const currentDamage = Math.ceil(PLAYER_STATS.DAMAGE * rankMultiplier)
  
  // Get current and next rank info
  const currentThreshold = expeditionRank > 0 ? RANK_THRESHOLDS[expeditionRank - 1] : null
  const nextThreshold = expeditionRank < RANK_THRESHOLDS.length ? RANK_THRESHOLDS[expeditionRank] : null
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-4 text-sm" style={{ minWidth: '350px' }}>
      <h3 className="text-yellow-500 font-bold mb-3">Expedition Stats</h3>
      
      {/* Current Stats */}
      <div className="mb-3">
        <div className="text-gray-400 mb-1">Current Stats:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Attack: </span>
            <span className="text-red-400 font-bold">{currentDamage}</span>
            {expeditionRank > 0 && <span className="text-gray-600"> (+{expeditionRank * 5}%)</span>}
          </div>
          <div>
            <span className="text-gray-500">Max HP: </span>
            <span className="text-green-400 font-bold">{playerMaxHp}</span>
            {expeditionRank > 0 && <span className="text-gray-600"> (+{expeditionRank * 5}%)</span>}
          </div>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-3">
        <div className="text-gray-400 mb-1">Progress:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Rooms: </span>
            <span className="text-cyan-400">{roomsCleared}</span>
          </div>
          <div>
            <span className="text-gray-500">Kills: </span>
            <span className="text-orange-400">{totalKills}</span>
          </div>
        </div>
      </div>
      
      {/* Current Rank Requirements */}
      {currentThreshold && (
        <div className="mb-3">
          <div className="text-gray-400 mb-1">Rank {expeditionRank} Achieved:</div>
          <div className="text-xs text-gray-500">
            Required: {currentThreshold.rooms} rooms OR {currentThreshold.kills} kills
          </div>
        </div>
      )}
      
      {/* Next Rank Requirements */}
      {nextThreshold && (
        <div className="mb-3">
          <div className="text-gray-400 mb-1">Next Rank ({expeditionRank + 1}):</div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Need:</span>
              {nextThreshold.rooms < 99 ? (
                <>
                  <span className={roomsCleared >= nextThreshold.rooms ? 'text-green-400' : 'text-gray-300'}>
                    {nextThreshold.rooms} rooms
                  </span>
                  <span className="text-gray-600">OR</span>
                </>
              ) : null}
              <span className={totalKills >= nextThreshold.kills ? 'text-green-400' : 'text-gray-300'}>
                {nextThreshold.kills} kills
              </span>
            </div>
            <div className="text-gray-500 mt-1">
              Reward: +5% damage & health
            </div>
          </div>
        </div>
      )}
      
      {/* Max Rank */}
      {expeditionRank >= RANK_THRESHOLDS.length && (
        <div className="text-center text-yellow-500 font-bold">
          MAX RANK ACHIEVED!
        </div>
      )}
      
      {/* All Ranks Overview */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-gray-400 mb-2">All Ranks:</div>
        <div className="space-y-1 text-xs">
          {RANK_THRESHOLDS.map((threshold, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 ${
                index < expeditionRank ? 'text-gray-600' : 
                index === expeditionRank ? 'text-yellow-400' : 
                'text-gray-500'
              }`}
            >
              <span>{index === expeditionRank ? '→' : ' '}</span>
              <span>Rank {index + 1}:</span>
              {threshold.rooms < 99 ? (
                <span>{threshold.rooms} rooms OR {threshold.kills} kills</span>
              ) : (
                <span>{threshold.kills} kills only</span>
              )}
              {index < expeditionRank && <span className="text-green-600">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}