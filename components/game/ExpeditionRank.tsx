'use client'

import { useGameStore } from '@/lib/game/store'
import { RANK_THRESHOLDS } from '@/lib/game/constants'

export function ExpeditionRank() {
  const expeditionRank = useGameStore((state) => state.expeditionRank)
  const roomsCleared = useGameStore((state) => state.roomsCleared)
  const totalKills = useGameStore((state) => state.totalKills)
  
  // Calculate progress to next rank
  let progress = 0
  let progressText = ''
  
  if (expeditionRank < RANK_THRESHOLDS.length) {
    const threshold = RANK_THRESHOLDS[expeditionRank]
    const roomProgress = Math.min(roomsCleared / threshold.rooms, 1)
    const killProgress = Math.min(totalKills / threshold.kills, 1)
    progress = Math.max(roomProgress, killProgress) * 100
    
    // Show the closest threshold
    if (killProgress >= roomProgress) {
      progressText = `${totalKills}/${threshold.kills} kills`
    } else {
      progressText = `${roomsCleared}/${threshold.rooms} rooms`
    }
  } else {
    progress = 100
    progressText = 'MAX RANK'
  }
  
  // Generate stars display
  const maxRank = 5
  const stars = []
  for (let i = 0; i < maxRank; i++) {
    if (i < expeditionRank) {
      stars.push('★')
    } else {
      stars.push('☆')
    }
  }
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">Expedition:</span>
        <span className="text-yellow-500 font-bold text-lg">{stars.join('')}</span>
      </div>
      
      {expeditionRank < RANK_THRESHOLDS.length && (
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{progressText}</span>
        </div>
      )}
    </div>
  )
}