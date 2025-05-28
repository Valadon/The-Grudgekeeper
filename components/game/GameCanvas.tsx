'use client'

import { useRef } from 'react'
import { useRenderer } from '@/lib/game/useRenderer'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useRenderer(canvasRef)
  
  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}