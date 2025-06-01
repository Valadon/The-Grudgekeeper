import { GameState, EnemyType } from './types'

export function calculateGrudgePoints(state: GameState): number {
  const base = 50
  const killBonus = state.totalKills * 10
  const roomBonus = state.roomsCleared * 20
  const rankBonus = state.expeditionRank * 50
  const turnBonus = state.turnCount * 1
  
  return base + killBonus + roomBonus + rankBonus + turnBonus
}

export function generateDeathMessage(
  killedBy: EnemyType | 'projectile' | null,
  turnCount: number,
  roomNumber: number
): string {
  if (!killedBy) {
    return `Mysteriously perished after ${turnCount} turns`
  }
  
  const deathMessages = {
    goblin: [
      `Stabbed by a goblin after ${turnCount} turns`,
      `Overwhelmed by goblins in room ${roomNumber}`,
      `A goblin's rusty blade found its mark`
    ],
    archer: [
      `Perforated by a goblin archer after ${turnCount} turns`,
      `Shot down by an archer in room ${roomNumber}`,
      `An archer's arrow pierced your beard`
    ],
    rust_beast: [
      `Crushed by a Rust Beast while fleeing`,
      `A Rust Beast's claws ended your journey`,
      `Torn apart by a Rust Beast after ${turnCount} turns`
    ],
    projectile: [
      `Turned into a pincushion after ${turnCount} turns`,
      `An arrow found a gap in your armor`,
      `Shot from afar like a coward's target`
    ]
  }
  
  const messages = deathMessages[killedBy]
  return messages[Math.floor(Math.random() * messages.length)]
}

// localStorage helpers
export function getTotalGrudgePoints(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem('totalGrudgePoints')
  return stored ? parseInt(stored, 10) : 0
}

export function addGrudgePoints(points: number): void {
  if (typeof window === 'undefined') return
  const current = getTotalGrudgePoints()
  localStorage.setItem('totalGrudgePoints', (current + points).toString())
}