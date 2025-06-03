'use client'

import { useState } from 'react'
import { getTotalGrudgePoints, spendGrudgePoints } from '@/lib/game/grudgeSystem'
import { UPGRADE_DEFINITIONS, getPlayerUpgrades, purchaseUpgrade, getUpgradeCost } from '@/lib/game/upgradeSystem'
import { UpgradeType } from '@/lib/game/types'

interface UpgradeShopProps {
  onClose: () => void
  onRestart: () => void
}

export function UpgradeShop({ onClose, onRestart }: UpgradeShopProps) {
  const [grudgePoints, setGrudgePoints] = useState(getTotalGrudgePoints())
  const [upgrades, setUpgrades] = useState(getPlayerUpgrades())
  
  const handlePurchase = (upgradeId: UpgradeType) => {
    const result = purchaseUpgrade(upgradeId, grudgePoints)
    if (result.success) {
      setGrudgePoints(result.newGP)
      setUpgrades(result.upgrades)
      spendGrudgePoints(grudgePoints - result.newGP)
    }
  }
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-gray-600 p-6 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-2 text-yellow-500 text-center">
          THE SHIP&apos;S ARMORY
        </h2>
        <p className="text-gray-400 text-center mb-4">
          &quot;Your grudges manifest as power. Choose wisely, dwarf.&quot;
        </p>
        <div className="text-yellow-400 text-center mb-6">
          Grudge Points: {grudgePoints} GP
        </div>
        
        <div className="space-y-4 mb-6">
          {Object.values(UPGRADE_DEFINITIONS).map((upgrade) => {
            const currentLevel = upgrades[upgrade.id]
            const isMaxLevel = currentLevel >= upgrade.maxLevel
            const cost = getUpgradeCost(upgrade.id)
            const canAfford = cost > 0 && grudgePoints >= cost
            
            return (
              <div key={upgrade.id} className="border border-gray-700 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {upgrade.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {upgrade.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      Level {currentLevel}/{upgrade.maxLevel}
                    </p>
                    <p className="text-sm text-yellow-400">
                      {upgrade.effect(currentLevel || 1)}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  {isMaxLevel ? (
                    <span className="text-green-400">MAX LEVEL</span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(upgrade.id)}
                      disabled={!canAfford}
                      className={`px-4 py-2 border ${
                        canAfford
                          ? 'border-yellow-500 text-yellow-500 hover:border-white hover:text-white'
                          : 'border-gray-600 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      UPGRADE ({cost} GP)
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="text-lg text-gray-400 hover:text-white border border-gray-600 px-6 py-2 hover:border-white"
          >
            [CONTINUE SHOPPING]
          </button>
          <button
            onClick={onRestart}
            className="text-lg text-green-500 hover:text-white border border-green-500 px-6 py-2 hover:border-white"
          >
            [BEGIN EXPEDITION]
          </button>
        </div>
      </div>
    </div>
  )
}