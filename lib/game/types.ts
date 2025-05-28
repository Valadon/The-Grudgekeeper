export interface Position {
  x: number
  y: number
}

export interface Enemy {
  id: string
  type: 'goblin'
  position: Position
  hp: number
  maxHp: number
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

export interface GameState {
  player: Position
  playerHp: number
  playerMaxHp: number
  dungeon: Dungeon
  turnCount: number
  isProcessingTurn: boolean
  gameStatus: 'playing' | 'dead' | 'floor_complete'
}

export type TileType = 'floor' | 'wall' | 'player' | 'goblin' | 'door_closed' | 'door_open' | 'stairs'