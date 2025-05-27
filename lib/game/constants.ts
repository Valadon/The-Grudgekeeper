export const ROOM_WIDTH = 10
export const ROOM_HEIGHT = 10

export const TILES = {
  FLOOR: 0,
  WALL: 1,
} as const

export const TILE_DISPLAY = {
  [TILES.FLOOR]: '·',
  [TILES.WALL]: '█',
  PLAYER: '@',
} as const