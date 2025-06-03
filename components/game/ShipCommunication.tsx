'use client'

import { useGameStore } from '@/lib/game/store'
import { useEffect, useState } from 'react'
import { getShipMood, getMoodColor } from '@/lib/game/shipMessages'

export function ShipCommunication() {
  const messages = useGameStore((state) => state.messages)
  const expeditionRank = useGameStore((state) => state.expeditionRank)
  const [visibleMessages, setVisibleMessages] = useState<Array<{text: string, id: number}>>([])
  
  useEffect(() => {
    if (messages.length > 0) {
      // Get the last 3 messages
      const recent = messages.slice(-3).map((text, index) => ({
        text,
        id: Date.now() + index
      }))
      setVisibleMessages(recent)
    }
  }, [messages])
  
  if (visibleMessages.length === 0) return null
  
  const mood = getShipMood(expeditionRank)
  const moodColor = getMoodColor(mood)
  const moodText = mood === 'grumpy' ? 'GRUMPY' : mood === 'grudging' ? 'GRUDGING' : 'IMPRESSED'
  
  return (
    <div className="bg-gray-900 border border-gray-700 p-3 mb-2">
      <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
        <span>┌─ Ship Communication {'─'.repeat(20)}┐</span>
        <span style={{ color: moodColor }} className="text-xs font-bold">
          [{moodText}]
        </span>
      </div>
      <div className="space-y-1">
        {visibleMessages.map((msg) => (
          <div key={msg.id} className="text-sm italic" style={{ color: moodColor }}>
            &ldquo;{msg.text}&rdquo;
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        └{'─'.repeat(36)}┘
      </div>
    </div>
  )
}