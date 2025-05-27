export interface Position {
  x: number
  y: number
}

export interface GameState {
  player: Position
  currentRoom: number[][]
}

export type TileType = 'floor' | 'wall' | 'player'