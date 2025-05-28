'use client'

import { useRef } from 'react'
import { useRenderer } from '@/lib/game/useRenderer'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useRenderer(canvasRef as React.RefObject<HTMLCanvasElement>)
  
  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}