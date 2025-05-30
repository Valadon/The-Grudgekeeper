import { Room, Dungeon, Enemy, Position, EnemyType } from './types'
import { 
  DUNGEON_SIZE, 
  DUNGEON_CENTER, 
  TILES,
  ROOM_WIDTH,
  ROOM_HEIGHT,
  ENEMY_STATS
} from './constants'
import { getRandomRoomTemplate, TEMPLATE_EMPTY } from './roomTemplates'

// Find all reachable floor tiles from door positions using flood fill
function getReachableFloorTiles(layout: number[][]): Position[] {
  const reachable: Position[] = []
  const visited = new Set<string>()
  const toVisit: Position[] = []
  
  // Start from all door positions
  // North door
  if (layout[0][5] === TILES.DOOR_CLOSED || layout[0][5] === TILES.DOOR_OPEN) {
    toVisit.push({ x: 5, y: 1 })
  }
  // South door
  if (layout[9][5] === TILES.DOOR_CLOSED || layout[9][5] === TILES.DOOR_OPEN) {
    toVisit.push({ x: 5, y: 8 })
  }
  // West door
  if (layout[5][0] === TILES.DOOR_CLOSED || layout[5][0] === TILES.DOOR_OPEN) {
    toVisit.push({ x: 1, y: 5 })
  }
  // East door
  if (layout[5][9] === TILES.DOOR_CLOSED || layout[5][9] === TILES.DOOR_OPEN) {
    toVisit.push({ x: 8, y: 5 })
  }
  
  // If start room (no doors), start from center
  if (toVisit.length === 0) {
    toVisit.push({ x: 5, y: 5 })
  }
  
  // Flood fill to find all reachable floor tiles
  while (toVisit.length > 0) {
    const pos = toVisit.pop()!
    const key = `${pos.x},${pos.y}`
    
    if (visited.has(key)) continue
    visited.add(key)
    
    if (layout[pos.y][pos.x] === TILES.FLOOR) {
      reachable.push(pos)
      
      // Check adjacent tiles
      const adjacent = [
        { x: pos.x + 1, y: pos.y },
        { x: pos.x - 1, y: pos.y },
        { x: pos.x, y: pos.y + 1 },
        { x: pos.x, y: pos.y - 1 }
      ]
      
      for (const adj of adjacent) {
        if (adj.x >= 0 && adj.x < ROOM_WIDTH && 
            adj.y >= 0 && adj.y < ROOM_HEIGHT &&
            !visited.has(`${adj.x},${adj.y}`)) {
          toVisit.push(adj)
        }
      }
    }
  }
  
  return reachable
}

// Place doors in a room layout based on its position in the dungeon
function addDoorsToRoom(layout: number[][], x: number, y: number): void {
  // North door (top center)
  if (y > 0) {
    layout[0][Math.floor(ROOM_WIDTH / 2)] = TILES.DOOR_CLOSED
  }
  
  // South door (bottom center)
  if (y < DUNGEON_SIZE - 1) {
    layout[ROOM_HEIGHT - 1][Math.floor(ROOM_WIDTH / 2)] = TILES.DOOR_CLOSED
  }
  
  // West door (left center)
  if (x > 0) {
    layout[Math.floor(ROOM_HEIGHT / 2)][0] = TILES.DOOR_CLOSED
  }
  
  // East door (right center)
  if (x < DUNGEON_SIZE - 1) {
    layout[Math.floor(ROOM_HEIGHT / 2)][ROOM_WIDTH - 1] = TILES.DOOR_CLOSED
  }
}

// Calculate room number (0-8) from coordinates
function getRoomNumber(x: number, y: number): number {
  return y * DUNGEON_SIZE + x
}

// Determine if room layout is narrow (for archer placement)
function isNarrowRoom(layout: number[][]): boolean {
  let floorCount = 0
  for (let y = 1; y < ROOM_HEIGHT - 1; y++) {
    for (let x = 1; x < ROOM_WIDTH - 1; x++) {
      if (layout[y][x] === TILES.FLOOR) floorCount++
    }
  }
  return floorCount < 30  // Less than 30 floor tiles = narrow
}

// Generate enemies for a room based on progressive difficulty
function generateEnemiesForRoom(x: number, y: number, layout: number[][]): Enemy[] {
  // Starting room has no enemies
  if (x === DUNGEON_CENTER && y === DUNGEON_CENTER) {
    return []
  }
  
  const roomNum = getRoomNumber(x, y)
  const isNarrow = isNarrowRoom(layout)
  const isExitRoom = layout.some(row => row.includes(TILES.STAIRS))
  
  // Get reachable floor tiles
  const reachableTiles = getReachableFloorTiles(layout)
  if (reachableTiles.length === 0) return []
  
  const enemies: Enemy[] = []
  const usedPositions = new Set<string>()
  
  let enemyCount: number
  let enemyTypes: EnemyType[] = []
  
  // Exit room always has 1 Rust Beast
  if (isExitRoom) {
    enemyCount = 1
    enemyTypes = ['rust_beast']
  } else {
    // Progressive difficulty based on room number
    if (roomNum <= 3) {
      // Rooms 1-3: 1-2 goblins
      enemyCount = 1 + Math.floor(Math.random() * 2)
      enemyTypes = Array(enemyCount).fill('goblin')
    } else if (roomNum <= 6) {
      // Rooms 4-6: 2-3 enemies (goblins + 0-1 archer)
      enemyCount = 2 + Math.floor(Math.random() * 2)
      enemyTypes = Array(enemyCount).fill('goblin')
      // Maybe add an archer if not narrow
      if (!isNarrow && Math.random() < 0.5) {
        enemyTypes[enemyTypes.length - 1] = 'archer'
      }
    } else {
      // Rooms 7-9: 2-4 enemies (any type)
      enemyCount = 2 + Math.floor(Math.random() * 3)
      enemyTypes = []
      for (let i = 0; i < enemyCount; i++) {
        const roll = Math.random()
        if (!isNarrow && roll < 0.3) {
          enemyTypes.push('archer')
        } else if (roll < 0.5) {
          enemyTypes.push('rust_beast')
        } else {
          enemyTypes.push('goblin')
        }
      }
    }
  }
  
  // Place enemies
  enemyCount = Math.min(enemyCount, reachableTiles.length)
  
  for (let i = 0; i < enemyCount && i < enemyTypes.length; i++) {
    // Find a random reachable floor position
    let position: Position | null = null
    let attempts = 0
    
    while (!position && attempts < 50) {
      const tile = reachableTiles[Math.floor(Math.random() * reachableTiles.length)]
      const key = `${tile.x},${tile.y}`
      
      if (!usedPositions.has(key)) {
        position = tile
        usedPositions.add(key)
      }
      attempts++
    }
    
    if (position) {
      const type = enemyTypes[i]
      const stats = type === 'goblin' ? ENEMY_STATS.GOBLIN : 
                   type === 'archer' ? ENEMY_STATS.ARCHER :
                   ENEMY_STATS.RUST_BEAST
      
      enemies.push({
        id: `enemy-${x}-${y}-${i}`,
        type,
        position,
        hp: stats.hp,
        maxHp: stats.hp,
        behavior: stats.behavior,
        damage: stats.damage,
        preferredDistance: type === 'archer' ? stats.preferredDistance : undefined,
        lastMoveTurn: undefined,
      })
    }
  }
  
  return enemies
}

// Create a single room
function createRoom(x: number, y: number, isStartRoom: boolean): Room {
  // Use empty template for start room, random for others
  const layout = isStartRoom ? 
    TEMPLATE_EMPTY.map(row => [...row]) : 
    getRandomRoomTemplate()
  
  // Add doors based on position
  addDoorsToRoom(layout, x, y)
  
  // Place stairs in a random room (not the start room)
  if (!isStartRoom && Math.random() < 0.15) { // 15% chance per room
    // Get reachable floor tiles
    const reachableTiles = getReachableFloorTiles(layout)
    if (reachableTiles.length > 0) {
      // Place stairs on a random reachable tile
      const stairTile = reachableTiles[Math.floor(Math.random() * reachableTiles.length)]
      layout[stairTile.y][stairTile.x] = TILES.STAIRS
    }
  }
  
  const enemies = generateEnemiesForRoom(x, y, layout)
  
  return {
    layout,
    enemies,
    visited: isStartRoom,
    doors: {
      north: y > 0 ? { isOpen: false } : undefined,
      south: y < DUNGEON_SIZE - 1 ? { isOpen: false } : undefined,
      west: x > 0 ? { isOpen: false } : undefined,
      east: x < DUNGEON_SIZE - 1 ? { isOpen: false } : undefined,
    }
  }
}

// Generate a complete dungeon
export function generateDungeon(): Dungeon {
  const rooms: Room[][] = []
  let hasStairs = false
  
  // Create all rooms
  for (let y = 0; y < DUNGEON_SIZE; y++) {
    const row: Room[] = []
    for (let x = 0; x < DUNGEON_SIZE; x++) {
      const isStartRoom = x === DUNGEON_CENTER && y === DUNGEON_CENTER
      const room = createRoom(x, y, isStartRoom)
      row.push(room)
      
      // Check if this room has stairs
      for (let ry = 0; ry < room.layout.length; ry++) {
        for (let rx = 0; rx < room.layout[ry].length; rx++) {
          if (room.layout[ry][rx] === TILES.STAIRS) {
            hasStairs = true
          }
        }
      }
    }
    rooms.push(row)
  }
  
  // Ensure at least one room has stairs (not the starting room)
  if (!hasStairs) {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 100) {
      const x = Math.floor(Math.random() * DUNGEON_SIZE)
      const y = Math.floor(Math.random() * DUNGEON_SIZE)
      
      // Don't place in starting room
      if (x === DUNGEON_CENTER && y === DUNGEON_CENTER) {
        attempts++
        continue
      }
      
      const room = rooms[y][x]
      // Get reachable floor tiles
      const reachableTiles = getReachableFloorTiles(room.layout)
      if (reachableTiles.length > 0) {
        // Place stairs on a random reachable tile
        const stairTile = reachableTiles[Math.floor(Math.random() * reachableTiles.length)]
        room.layout[stairTile.y][stairTile.x] = TILES.STAIRS
        placed = true
      }
      attempts++
    }
  }
  
  return {
    rooms,
    currentX: DUNGEON_CENTER,
    currentY: DUNGEON_CENTER,
  }
}

// Get the current room from the dungeon
export function getCurrentRoom(dungeon: Dungeon): Room {
  return dungeon.rooms[dungeon.currentY][dungeon.currentX]
}