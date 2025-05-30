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
  DOOR_CLOSED: 2,
  DOOR_OPEN: 3,
  STAIRS: 4,
} as const

export const TILE_DISPLAY = {
  [TILES.FLOOR]: '·',
  [TILES.WALL]: '█',
  [TILES.DOOR_CLOSED]: '+',
  [TILES.DOOR_OPEN]: '/',
  [TILES.STAIRS]: '>',
  PLAYER: '@',
  GOBLIN: 'g',
  ARCHER: 'a',
  RUST_BEAST: 'R',
  PROJECTILE: '•',
} as const

export const COLORS = {
  PLAYER: '#66ff00',
  WALL: '#666666',
  FLOOR: '#333333',
  TEXT: '#e0e0e0',
  ENEMY: '#ff6666',
  DAMAGE: '#ff0000',
  DOOR: '#8B7355',
  STAIRS: '#FFD700',
  ARCHER: '#ff9900',  // orange
  RUST_BEAST: '#8B4513',  // rust brown
  PROJECTILE: '#ffff00',  // yellow
} as const

export const PLAYER_STATS = {
  MAX_HP: 3,
  DAMAGE: 1,
} as const

export const ENEMY_STATS = {
  GOBLIN: {
    hp: 1,
    damage: 1,
    behavior: 'basic' as const,
  },
  ARCHER: {
    hp: 1,
    damage: 1,
    behavior: 'archer' as const,
    preferredDistance: 3,
  },
  RUST_BEAST: {
    hp: 3,
    damage: 2,
    behavior: 'slow' as const,
    guaranteedDrop: true,
  },
} as const

export const TURN_DELAY = 100 // ms delay for visual feedback
export const DAMAGE_FLASH_DURATION = 200 // ms for damage flash effect
export const PROJECTILE_SPEED = 50 // ms per tile for projectile animation

// Expedition rank thresholds
export const RANK_THRESHOLDS = [
  { rooms: 2, kills: 3 },    // Rank 0→1
  { rooms: 5, kills: 7 },    // Rank 1→2
  { rooms: 9, kills: 12 },   // Rank 2→3
  { rooms: 99, kills: 18 },  // Rank 3→4 (kills only)
  { rooms: 99, kills: 25 },  // Rank 4→5 (kills only)
] as const

export const RANK_BONUS = 0.05 // 5% health/damage per rank

export const DUNGEON_SIZE = 3 // 3x3 grid of rooms
export const DUNGEON_CENTER = 1 // Center room index (0-2)