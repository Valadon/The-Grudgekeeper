# Phase 3: Death is Progress Checklist 💀

## Overview
Transform our basic game into an addictive roguelike loop where death fuels progression and enemies provide actual challenge!

---

## 1. Rebalanced Expedition Rank System ⭐

### Rank Requirements
```
Rank 0→1: Clear 2 rooms OR kill 3 enemies
Rank 1→2: Clear 5 total rooms OR kill 7 total enemies  
Rank 2→3: Clear 9 total rooms OR kill 12 total enemies
Rank 3→4: Kill 18 total enemies
Rank 4→5: Kill 25 total enemies
```

### Implementation
- Track `roomsCleared` and `totalKills` in game state
- Each rank gives +5% health/damage to player
- Show rank as stars: "Expedition: ★★★☆☆"
- Add rank progress bar below stars

### Test It
- [ ] Rank increases at correct thresholds
- [ ] Damage/health bonuses apply correctly
- [ ] UI shows current rank and progress
- [ ] Bonuses feel noticeable but not OP

---

## 2. New Enemy Types 👾

### Goblin Archer (a)
```typescript
{
  symbol: 'a',
  color: '#ff9900', // orange
  hp: 1,
  damage: 1,
  behavior: 'archer',
  preferredDistance: 2-3
}
```

**AI Logic:**
- If 2-3 tiles away in straight line: Shoot projectile
- If 4+ tiles away: Move closer
- If adjacent: 50% flee, 50% weak melee (0.5 damage, round up)
- Cannot shoot diagonally

### Rust Beast (R)
```typescript
{
  symbol: 'R',
  color: '#8B4513', // rust brown
  hp: 3,
  damage: 2,
  behavior: 'slow',
  movePattern: 'everyOtherTurn',
  guaranteed_drop: true
}
```

**AI Logic:**
- Only moves on even turn numbers
- Always moves toward player when it does move
- Drops item 100% of the time

### Projectile System
- Show projectiles as `•` traveling from archer to target
- 50ms per tile animation
- Deal damage on impact
- Can only travel in straight lines

### Test It
- [ ] Archers maintain distance effectively
- [ ] Projectiles render and travel correctly
- [ ] Rust Beasts feel threatening but manageable
- [ ] Mixed enemy rooms create interesting tactics

---

## 3. Progressive Room Difficulty 📈

### Spawning Rules
```typescript
// Room 0 (start): No enemies
// Rooms 1-3: 1-2 goblins
// Rooms 4-6: 2-3 enemies (goblins + 0-1 archer)
// Rooms 7-9: 2-4 enemies (any type)
```

### Special Rules
- Never spawn archers in narrow hallways
- Rust Beasts prefer open areas
- Exit room always has 1 Rust Beast guarding stairs

### Test It
- [ ] Early rooms feel manageable
- [ ] Difficulty ramps up noticeably
- [ ] Enemy variety creates different challenges
- [ ] Exit room feels like mini-boss

---

## 4. Basic Grudge System 😤

### Earning Grudges
On run end, calculate:
```
Base: 50 GP
+ (enemies killed × 10)
+ (rooms cleared × 20)  
+ (expedition rank × 50)
+ (turns survived × 1)
= Total Grudge Points
```

### Death Messages
Generate flavorful death messages:
- "Perforated by a goblin archer after 127 turns"
- "Crushed by a Rust Beast while fleeing"
- "Overwhelmed by goblins in room 7"

### Persistence
- Store in localStorage: `totalGrudgePoints`
- Show total GP on main menu
- Display run earnings on death screen

### Test It
- [ ] GP calculates correctly
- [ ] Death messages are contextual
- [ ] GP persists between sessions
- [ ] Earning feels rewarding even on bad runs

---

## 5. Simple Upgrade Shop 📊

### Initial Upgrades
```typescript
const UPGRADES = [
  {
    id: 'stubborn_start',
    name: 'Stubborn Constitution',
    cost: 100,
    effect: '+1 starting HP',
    maxLevel: 3
  },
  {
    id: 'ancestral_fury',
    name: 'Ancestral Fury',  
    cost: 200,
    effect: '+10% base damage',
    maxLevel: 5
  },
  {
    id: 'deep_pockets',
    name: 'Deep Pockets',
    cost: 300,
    effect: 'Start with 1 random item',
    maxLevel: 1
  }
]
```

### Shop UI
- Access from death screen or main menu
- Show owned upgrades with level indicators
- Gray out if insufficient GP
- Purchased upgrades apply immediately to next run

### Test It
- [ ] Can purchase upgrades with GP
- [ ] Effects apply on next run
- [ ] Can't exceed max levels
- [ ] UI clearly shows what you own

---

## 6. Basic Item System 🎒

### Items
```typescript
const ITEMS = [
  {
    id: 'ale_flask',
    symbol: '!',
    name: 'Ale Flask',
    color: '#00ff00',
    effect: 'Restore 1 HP',
    useKey: '1'
  },
  {
    id: 'rusty_dagger',
    symbol: '†',
    name: 'Rusty Dagger',
    color: '#cccccc',
    effect: '+1 damage for 3 attacks',
    useKey: '2'
  },
  {
    id: 'lucky_pebble',
    symbol: '◊',
    name: 'Lucky Pebble',
    color: '#00ccff',
    effect: '+1 expedition rank',
    useKey: '3'
  }
]
```

### Drop Rates
- Goblin: 20% chance
- Archer: 30% chance
- Rust Beast: 100% chance

### Inventory UI
Show at bottom of screen:
```
Items: [1] Ale Flask  [2] Rusty Dagger  [3] Empty
```

### Test It
- [ ] Items drop at correct rates
- [ ] Can pick up by walking over
- [ ] Number keys use items
- [ ] Effects work as described
- [ ] Max 3 items (for now)

---

## 7. Ship Mood Evolution 🚀

### Mood Thresholds
- **Rank 0-2**: Grumpy (current messages)
- **Rank 3-4**: Grudging 
  - "I suppose that was adequate."
  - "You're slightly less pathetic than usual."
  - "Don't let it go to your beard."
- **Rank 5**: Almost Impressed
  - "...well fought. For a meatbag."
  - "The carnage was almost beautiful."
  - "Perhaps you'll survive after all."

### Visual Changes
- Mood indicator color shifts (red → orange → yellow)
- Ship messages get less hostile
- Maybe add ♪ symbol at high ranks?

### Test It
- [ ] Messages change with rank
- [ ] Tone shift feels rewarding
- [ ] Visual indicators update
- [ ] Ship still feels grumpy even when "happy"

---

## 8. Death & Replacement System 👥

### On Death
1. Flash screen red
2. Show death message
3. Generate new dwarf name
4. Spawn at room entrance
5. Keep all expedition bonuses
6. Increment death counter

### Dwarf Name Generator
Simple combinations:
```
First: [Urist, Thorin, Gimli, Durin, Balin]
Last: [McBraveson, Ironbeard, Stoutheart, Grudgeborn]
```

### Test It
- [ ] Seamless transition on death
- [ ] New dwarf keeps expedition bonuses
- [ ] Death counter tracks correctly
- [ ] Names are sufficiently dwarfy

---

## 9. Testing Checklist ✅

### Core Loop
- [ ] Can earn GP from runs
- [ ] Can spend GP on upgrades
- [ ] Upgrades affect next run
- [ ] Death leads to progression
- [ ] Want to do "one more run"

### Balance
- [ ] Archers are challenging but fair
- [ ] Rust Beasts are scary but killable
- [ ] Items feel useful but not required
- [ ] Expedition ranks matter
- [ ] GP earnings feel reasonable

### Polish
- [ ] All new enemies have colors
- [ ] Death messages are varied
- [ ] Ship mood evolution is noticeable
- [ ] No crashes or soft locks
- [ ] Performance stays smooth

---

## Implementation Order 📝

1. **New enemies** - Get combat interesting first
2. **Room difficulty** - Test balance with enemy variety
3. **Expedition ranks** - Add the power progression
4. **Grudge system** - Make death rewarding
5. **Basic items** - Add tactical options
6. **Upgrade shop** - Close the progression loop
7. **Ship mood** - Polish and personality
8. **Death system** - Smooth out the experience

---

## Notes 📌

- Keep localStorage simple - just `{totalGP, purchasedUpgrades}`
- Don't worry about save-scumming for now
- Focus on the core loop feeling good
- We can add more items/upgrades/enemies later
- Test with fresh localStorage occasionally

Remember: The goal is to make players think "I died, but I got stronger, let me try again!" That's the magic we're after.

*Rock and Stone!* ⛏️