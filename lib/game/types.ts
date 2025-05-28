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

export interface GameState {
  player: Position
  currentRoom: number[][]
  enemies: Enemy[]
  turnCount: number
  isProcessingTurn: boolean
}

export type TileType = 'floor' | 'wall' | 'player' | 'goblin'