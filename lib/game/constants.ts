// Room dimensions (including walls)
export const ROOM_WIDTH = 10  // Total width including walls
export const ROOM_HEIGHT = 10 // Total height including walls
export const PLAYABLE_WIDTH = 8  // Actual playable area
export const PLAYABLE_HEIGHT = 8 // Actual playable area
export const WALL_THICKNESS = 1  // Wall thickness on each side

export const TILE_SIZE = 32 // pixels per tile

export const TILES = {
  FLOOR: 0,
  WALL: 1,
} as const

export const TILE_DISPLAY = {
  [TILES.FLOOR]: '·',
  [TILES.WALL]: '█',
  PLAYER: '@',
} as const

export const COLORS = {
  PLAYER: '#66ff00',
  WALL: '#666666',
  FLOOR: '#333333',
  TEXT: '#e0e0e0',
} as const