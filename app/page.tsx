'use client'

import Link from 'next/link'
import { getTotalGrudgePoints } from '@/lib/game/grudgeSystem'
import { useEffect, useState } from 'react'

export default function Home() {
  const [totalGP, setTotalGP] = useState(0)
  
  useEffect(() => {
    setTotalGP(getTotalGrudgePoints())
  }, [])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">The Grudgekeeper</h1>
        {totalGP > 0 && (
          <p className="text-yellow-500 mb-6">
            Total Grudge Points: {totalGP} GP
          </p>
        )}
        <Link 
          href="/game"
          className="text-xl hover:text-white"
        >
          [ENTER THE SHIP]
        </Link>
      </div>
    </div>
  )
}