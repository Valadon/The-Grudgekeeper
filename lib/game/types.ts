export interface Position {
  x: number
  y: number
}

export type EnemyType = 'goblin' | 'archer' | 'rust_beast'

export type EnemyBehavior = 'basic' | 'archer' | 'slow'

export interface Enemy {
  id: string
  type: EnemyType
  position: Position
  hp: number
  maxHp: number
  behavior: EnemyBehavior
  damage: number
  preferredDistance?: number  // For archer AI
  lastMoveTurn?: number      // For rust beast movement pattern
}

export interface Projectile {
  id: string
  start: Position
  end: Position
  current: Position
  damage: number
  progress: number  // 0-1 animation progress
}

export interface Door {
  isOpen: boolean
}

export interface Room {
  layout: number[][]
  enemies: Enemy[]
  visited: boolean
  doors: {
    north?: Door
    south?: Door
    east?: Door
    west?: Door
  }
}

export interface Dungeon {
  rooms: Room[][]
  currentX: number
  currentY: number
}

export interface DamageNumber {
  id: string
  x: number
  y: number
  damage: number
  color: string
  progress: number  // 0-1 for animation
}

export interface GameState {
  player: Position
  playerHp: number
  playerMaxHp: number
  dungeon: Dungeon
  turnCount: number
  isProcessingTurn: boolean
  gameStatus: 'playing' | 'dead' | 'floor_complete'
  messages: string[]
  projectiles: Projectile[]
  expeditionRank: number
  roomsCleared: number
  totalKills: number
  damageFlash: boolean
  godMode: boolean
  damageNumbers: DamageNumber[]
  lastDeathCause?: string  // For death messages
  lastRunGrudgePoints?: number  // GP earned in last run
}

export type TileType = 'floor' | 'wall' | 'player' | 'goblin' | 'archer' | 'rust_beast' | 'door_closed' | 'door_open' | 'stairs' | 'projectile'