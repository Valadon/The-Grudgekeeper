import { TILES, ROOM_WIDTH, ROOM_HEIGHT } from './constants'

// Room template type
export type RoomTemplate = number[][]

// Helper to create a room with walls and floor
function createEmptyRoom(): RoomTemplate {
  const room: RoomTemplate = []
  for (let y = 0; y < ROOM_HEIGHT; y++) {
    const row: number[] = []
    for (let x = 0; x < ROOM_WIDTH; x++) {
      if (y === 0 || y === ROOM_HEIGHT - 1 || x === 0 || x === ROOM_WIDTH - 1) {
        row.push(TILES.WALL)
      } else {
        row.push(TILES.FLOOR)
      }
    }
    room.push(row)
  }
  return room
}

// Template 1: Empty room
export const TEMPLATE_EMPTY = createEmptyRoom()

// Template 2: Room with center pillar
export const TEMPLATE_PILLAR = (() => {
  const room = createEmptyRoom()
  room[4][4] = TILES.WALL
  room[4][5] = TILES.WALL
  room[5][4] = TILES.WALL
  room[5][5] = TILES.WALL
  return room
})()

// Template 3: Room with corners
export const TEMPLATE_CORNERS = (() => {
  const room = createEmptyRoom()
  // Top-left corner
  room[2][2] = TILES.WALL
  room[2][3] = TILES.WALL
  room[3][2] = TILES.WALL
  // Top-right corner
  room[2][7] = TILES.WALL
  room[2][6] = TILES.WALL
  room[3][7] = TILES.WALL
  // Bottom-left corner
  room[7][2] = TILES.WALL
  room[6][2] = TILES.WALL
  room[7][3] = TILES.WALL
  // Bottom-right corner
  room[7][7] = TILES.WALL
  room[7][6] = TILES.WALL
  room[6][7] = TILES.WALL
  return room
})()

// Template 4: Cross-shaped room (with door clearance)
export const TEMPLATE_CROSS = (() => {
  const room = createEmptyRoom()
  // Horizontal bars (avoiding middle row for east/west door access)
  for (let x = 1; x < ROOM_WIDTH - 1; x++) {
    if (x < 3 || x > 6) {
      room[3][x] = TILES.WALL  // Upper horizontal bar
      room[6][x] = TILES.WALL  // Lower horizontal bar
    }
  }
  // Vertical bars (avoiding door positions and middle positions)
  for (let y = 1; y < ROOM_HEIGHT - 1; y++) {
    if ((y < 3 || y > 6) && y !== 5) {  // Skip row 5 for door access
      room[y][3] = TILES.WALL  // Left vertical bar
      room[y][6] = TILES.WALL  // Right vertical bar
    }
  }
  return room
})()

// Template 5: L-shaped walls (avoiding door positions)
export const TEMPLATE_L_SHAPE = (() => {
  const room = createEmptyRoom()
  // Top-left L
  for (let i = 2; i <= 4; i++) {
    room[2][i] = TILES.WALL
    room[i][2] = TILES.WALL
  }
  // Bottom-right L (avoiding door at position 5)
  for (let i = 6; i <= 7; i++) {
    room[7][i] = TILES.WALL
    room[i][7] = TILES.WALL
  }
  // Add some extra walls to maintain the L shape
  room[6][6] = TILES.WALL
  return room
})()

// Template 6: Scattered pillars
export const TEMPLATE_SCATTERED = (() => {
  const room = createEmptyRoom()
  room[2][3] = TILES.WALL
  room[3][6] = TILES.WALL
  room[5][2] = TILES.WALL
  room[6][5] = TILES.WALL
  room[7][7] = TILES.WALL
  return room
})()

// All room templates
export const ROOM_TEMPLATES = [
  TEMPLATE_EMPTY,
  TEMPLATE_PILLAR,
  TEMPLATE_CORNERS,
  TEMPLATE_CROSS,
  TEMPLATE_L_SHAPE,
  TEMPLATE_SCATTERED,
]

// Get a random room template
export function getRandomRoomTemplate(): RoomTemplate {
  const template = ROOM_TEMPLATES[Math.floor(Math.random() * ROOM_TEMPLATES.length)]
  // Return a deep copy to avoid modifying the original
  return template.map(row => [...row])
}