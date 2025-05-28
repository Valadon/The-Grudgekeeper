# Phase 2: Core Game Loop Checklist 🎮

## Overview
Transform our walking skeleton into an actual game with enemies, combat, and multiple rooms. Keep it simple but playable!

---

## 1. Turn-Based System ⏱️

### What to Build
- **Turn Queue**: Player acts → All enemies act → Repeat
- **Action System**: Moving = 1 turn, attacking = 1 turn
- **Visual Feedback**: Brief pause (100ms) after player acts to show enemy movement

### Architecture Notes
- Store `turnCount` in game state
- Create `processTurn()` function that:
  1. Processes player action
  2. Updates all enemies
  3. Checks win/lose conditions
  4. Increments turn counter

### Test It
- [x] Enemies only move after player moves
- [x] Standing still doesn't trigger enemy turns
- [x] Turn counter increments properly

---

## 2. Multi-Room Dungeon 🏰

### What to Build
- **Room Grid**: 3x3 grid of connected rooms
- **Room Types**: 
  - Start room (center)
  - Normal rooms (random layouts)
  - Exit room (stairs down >)
- **Doors**: + (closed) → / (open) when touched
- **Room Tracking**: Current room position (e.g., "1-1", "2-0")

### Architecture Notes
```typescript
// Suggested structure
interface Dungeon {
  rooms: Room[][]
  currentX: number
  currentY: number
}

interface Room {
  layout: number[][]
  enemies: Enemy[]
  visited: boolean
  doors: { north?: Door, south?: Door, east?: Door, west?: Door }
}
```

### Room Generation
- Start with hardcoded room templates (5-6 variations)
- Randomly pick template for each room
- Ensure doors align between rooms
- Place 0-3 enemies per room (except start room)

### Test It
- [ ] Can move between rooms via doors
- [ ] Door opens when touched
- [ ] Room position updates in UI
- [ ] Previous rooms remember their state

---

## 3. Basic Enemies 👾

### Enemy Types (Start Simple)
1. **Goblin** (g)
   - 1 HP
   - Moves toward player each turn
   - Damage: 1

### Enemy AI
- **Dumb AI First**: If player.x > enemy.x, move right (etc.)
- **No Pathfinding**: They can get stuck behind walls (that's fine!)
- **No Diagonal Movement**: Keep it cardinal directions only

### Architecture Notes
```typescript
interface Enemy {
  type: 'goblin'
  position: Position
  hp: number
  maxHp: number
}
```

### Test It
- [x] Enemies appear as 'g' characters
- [x] Enemies move toward player each turn
- [x] Enemies can't move through walls
- [x] Multiple enemies move independently

---

## 4. Combat System ⚔️

### Basic Rules
- **Bump to Attack**: Move into enemy = attack
- **Damage**: Player deals 1, enemies deal 1
- **Death**: 0 HP = removed from room
- **Player HP**: Start with 3

### Visual Feedback
- Flash enemy red when hit (or use * symbol briefly)
- Flash screen edges red when player takes damage
- Show floating damage numbers (optional but fun)

### Architecture Notes
- Add `hp` and `maxHp` to player state
- Create `handleCombat(attacker, defender)` function
- Remove dead enemies from room

### Test It
- [x] Can attack by walking into enemies
- [x] Enemies disappear at 0 HP
- [x] Player takes damage from enemy bumps
- [x] HP displays correctly

---

## 5. Basic UI 🖼️

### Top Bar
```
Ship: [Grumpy] ♥♥♥     Room: 2-1     Turns: 42
```

### Ship Messages Area
```
┌─ Ship Communication ──────────────┐
│ "Another goblin? How original..."  │
└────────────────────────────────────┘
```

### Components Needed
- **HealthDisplay**: Shows hearts (♥ = full, ♡ = empty) ✓
- **ShipMood**: Just shows "Grumpy" for now
- **RoomIndicator**: Current room in grid
- **MessageLog**: 3-4 most recent messages

---

## 6. Ship Personality (Hardcoded) 🚀

### Message Triggers
Create arrays of sarcastic messages for:
- **Room Entry**: ["Oh good, more goblins.", "This room smells worse than the last."]
- **Combat**: ["Violence. How predictable.", "Try not to bleed on my floors."]
- **Taking Damage**: ["That's coming out of your ale ration.", "Pathetic."]
- **Enemy Kills**: ["Finally.", "One down, countless to go."]
- **Finding Exit**: ["Leaving already?", "The next floor is probably worse."]

### Implementation
- Simple random selection from arrays
- Display for 3-4 seconds then fade
- Store last 3 messages in state

### Test It
- [ ] Messages appear for events
- [ ] Messages are randomly selected
- [ ] Text fits in message area
- [ ] Messages feel appropriately grumpy

---

## 7. Win/Lose Conditions 🏆

### Lose Condition ✓
- Player HP reaches 0 ✓
- Show "YOU DIED" screen ✓
- Display grudge earned: "Died to a goblin on floor 1" ✓
- [RESTART] button ✓

### Win Condition (Floor Complete)
- Reach stairs (>) in any room
- Show "FLOOR COMPLETE" 
- Display: Turns taken, enemies killed
- [CONTINUE] button (just restart for now)

---

## 8. State Management Updates 🗄️

### Additional State Needed
```typescript
// Add to GameState
dungeon: Dungeon
playerHP: number
playerMaxHP: number
turnCount: number
messages: string[]
enemiesKilled: number
gameStatus: 'playing' | 'dead' | 'floor_complete'
```

### Save Points
- Save state when entering new room
- Save state after combat
- Use localStorage for now (Supabase later)

---

## 9. Quality of Life 🎯

### Controls
- **Spacebar**: Wait a turn (enemies still move)
- **R**: Restart when dead
- **Enter**: Open doors (alternative to bumping)

### Performance
- Only render current room
- Limit message log to 10 entries
- Clear old enemy references

### Polish
- Add 1-2 second delay on floor start
- Smooth color transitions
- Maybe a subtle grid pattern on floor?

---

## 10. Testing Checklist ✅

### Core Loop
- [ ] Start in center room with 3 HP
- [ ] Can explore all 9 rooms
- [ ] Enemies move after player
- [ ] Combat works both ways
- [ ] Can die and restart
- [ ] Can complete floor via stairs

### Edge Cases
- [ ] Can't walk off map edges
- [ ] Doors work from both sides
- [ ] Multiple enemies don't overlap
- [ ] Dead enemies stay dead
- [ ] HP can't go below 0 or above max

### Feel
- [ ] Movement feels responsive
- [ ] Combat has impact
- [ ] Ship messages add personality
- [ ] Death doesn't feel unfair
- [ ] Want to play "just one more floor"

---

## Implementation Order 📝

1. **Turn system** - Foundation for everything
2. **Basic enemies** - Just movement first
3. **Combat** - Now they can hurt each other
4. **Multi-room** - Expand the play space
5. **UI elements** - See what's happening
6. **Ship messages** - Add personality
7. **Win/lose** - Complete the loop
8. **Polish** - Make it feel good

---

## Success Metrics 🎉

You know Phase 2 is complete when:
- You can play a complete "run" from start to death/exit
- The game feels like a game, not a tech demo
- Someone else can play without you explaining controls
- The ship has insulted you at least 10 different ways
- You think "maybe just one more room..." at least once

---

## Notes for Claude Code 📝

- Keep the canvas renderer from Phase 1
- Add new tiles to the TILE_DISPLAY constant (door, stairs, etc.)
- Use the same color scheme but add red for damage
- State updates should use immer for immutability
- Keep all magic numbers in constants.ts
- Test frequently - roguelikes have lots of edge cases!

Remember: We're building the foundation for grudges, expedition momentum, and ship personality. Keep it simple but solid!

*Rock and Stone!* ⛏️