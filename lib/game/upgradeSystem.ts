import { Upgrade, PlayerUpgrades, UpgradeType } from './types'

export const UPGRADE_DEFINITIONS: Record<UpgradeType, Upgrade> = {
  stubborn_constitution: {
    id: 'stubborn_constitution',
    name: 'Stubborn Constitution',
    description: 'Years of drinking toxic ale has toughened your internal organs.',
    cost: 100,
    maxLevel: 5,
    effect: (level) => `+${level} Max HP`
  },
  ancestral_fury: {
    id: 'ancestral_fury',
    name: 'Ancestral Fury',
    description: 'Channel the rage of your fallen ancestors into every swing.',
    cost: 150,
    maxLevel: 5,
    effect: (level) => `+${level * 0.5} Damage`
  },
  deep_pockets: {
    id: 'deep_pockets',
    name: 'Deep Pockets',
    description: 'You always seem to find something useful in your beard.',
    cost: 200,
    maxLevel: 3,
    effect: (level) => `Start with ${level} random item${level > 1 ? 's' : ''}`
  }
}

const UPGRADES_KEY = 'grudgekeeper_upgrades'

export function getPlayerUpgrades(): PlayerUpgrades {
  try {
    const saved = localStorage.getItem(UPGRADES_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load upgrades:', e)
  }
  
  return {
    stubborn_constitution: 0,
    ancestral_fury: 0,
    deep_pockets: 0
  }
}

export function savePlayerUpgrades(upgrades: PlayerUpgrades): void {
  try {
    localStorage.setItem(UPGRADES_KEY, JSON.stringify(upgrades))
  } catch (e) {
    console.error('Failed to save upgrades:', e)
  }
}

export function purchaseUpgrade(upgradeId: UpgradeType, currentGP: number): { success: boolean; newGP: number; upgrades: PlayerUpgrades } {
  const upgrades = getPlayerUpgrades()
  const upgrade = UPGRADE_DEFINITIONS[upgradeId]
  
  const currentLevel = upgrades[upgradeId]
  
  // Check if already at max level
  if (currentLevel >= upgrade.maxLevel) {
    return { success: false, newGP: currentGP, upgrades }
  }
  
  // Calculate cost for next level
  const cost = upgrade.cost * (currentLevel + 1)
  
  // Check if player has enough GP
  if (currentGP < cost) {
    return { success: false, newGP: currentGP, upgrades }
  }
  
  // Purchase upgrade
  upgrades[upgradeId] = currentLevel + 1
  savePlayerUpgrades(upgrades)
  
  return { success: true, newGP: currentGP - cost, upgrades }
}

export function getUpgradeCost(upgradeId: UpgradeType): number {
  const upgrades = getPlayerUpgrades()
  const upgrade = UPGRADE_DEFINITIONS[upgradeId]
  const currentLevel = upgrades[upgradeId]
  
  if (currentLevel >= upgrade.maxLevel) {
    return -1 // Max level reached
  }
  
  return upgrade.cost * (currentLevel + 1)
}

// Get random items for Deep Pockets upgrade
export function getStartingItems(deepPocketsLevel: number): string[] {
  if (deepPocketsLevel <= 0) return []
  
  const items = ['ale_flask', 'rusty_dagger', 'lucky_pebble']
  const result: string[] = []
  
  for (let i = 0; i < deepPocketsLevel; i++) {
    result.push(items[Math.floor(Math.random() * items.length)])
  }
  
  return result
}