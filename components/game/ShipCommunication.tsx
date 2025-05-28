'use client'

import { useGameStore } from '@/lib/game/store'
import { useEffect, useState } from 'react'

export function ShipCommunication() {
  const messages = useGameStore((state) => state.messages)
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
  
  return (
    <div className="bg-gray-900 border border-gray-700 p-3 mb-2">
      <div className="text-xs text-gray-500 mb-2">
        ┌─ Ship Communication {'─'.repeat(20)}┐
      </div>
      <div className="space-y-1">
        {visibleMessages.map((msg) => (
          <div key={msg.id} className="text-sm text-yellow-500 italic">
            "{msg.text}"
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        └{'─'.repeat(36)}┘
      </div>
    </div>
  )
}