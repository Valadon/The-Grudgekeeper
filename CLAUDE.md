# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
npm run dev           # Start development server with Turbopack
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

### Future Commands (not yet implemented)
```bash
npm run test          # Run tests with Vitest
npm run test:e2e      # Run Playwright E2E tests
npm run db:migrate    # Run Supabase migrations
npm run db:reset      # Reset Supabase database
```

## High-Level Architecture

### Project Overview
The Grudgekeeper is a web-based roguelike dungeon crawler featuring space dwarves managing a living bio-mechanical ship. Key mechanics include persistent progression through death ("Grudge Power"), a ship with AI-driven personality, and procedurally generated expeditions.

### Technology Stack
- **Frontend**: Next.js 14+ with App Router, TypeScript, React
- **State Management**: Zustand with Immer for immutable updates
- **Styling**: Tailwind CSS v4 + CSS Modules
- **Database**: Supabase (PostgreSQL with real-time) - not yet implemented
- **AI**: Anthropic Claude SDK for ship personality - not yet implemented
- **Graphics**: ASCII-Plus foundation, later transitioning to Pixi.js
- **Deployment**: Vercel

### Project Structure (Planned)
```
/app              # Next.js App Router pages
/lib/game         # Core game logic and systems
/components/game  # React components for game UI
/Project Documents # Game design documents and tech specs
```

### Development Phases
Currently in **Phase 3**: Death is Progress (Roguelike Progression).

Key phases:
1. **Phase 0**: Project setup ✓
2. **Phase 1**: Walking skeleton with movement ✓
3. **Phase 2**: Core gameplay systems ✓
4. **Phase 3**: Death is Progress (in progress)
   - Expedition Rank System ✓
   - New Enemy Types (Archer, Rust Beast) ✓
   - Projectile System ✓
   - Progressive Room Difficulty ✓
   - Basic Grudge System ✓
   - Basic Item System (pending)
   - Upgrade Shop (pending)
   - Ship Mood Evolution (pending)
   - Death & Replacement System (pending)
5. **Phase 4**: Full game loop

### Game State Architecture
- Client-side state management using Zustand with Immer
- Game state includes:
  - Player position, HP (3 max)
  - Current room layout (10x10 including walls, 8x8 playable)
  - Enemies array with position, HP, and type
  - Turn counter and turn processing state
  - Game status (playing/dead/floor_complete)
- Turn-based system: player moves → enemies move
- Combat: bump-to-attack (1 damage each)
- Input handling via keyboard (WASD/Arrow keys)

### Canvas Rendering System
- Canvas-based rendering (replaced CSS Grid for better performance)
- Monospace font (Space Mono) for consistent display
- 32x32 pixel tiles
- Character set:
  - @ = Player (green)
  - g = Goblin (red)
  - █ = Wall (gray)
  - · = Floor (dark gray)
- Damage flash effect (dark red background)
- Image rendering set to pixelated for crisp ASCII

### Important Design Decisions
- **ASCII-First**: Game must be fully playable with ASCII graphics alone
- **Type Safety**: Full TypeScript coverage throughout
- **Performance**: No animations/transitions initially for instant feedback
- **Incremental Enhancement**: Visual improvements without breaking core gameplay
- **Canvas over CSS**: Switched from CSS Grid to Canvas for better performance and future features
- **Simple AI**: Enemies use basic "move toward player" logic, no pathfinding yet

### Current Implementation Status
- **Turn System**: Complete with 100ms delay for visual feedback
- **Combat**: Bump-to-attack working, enemies attack when adjacent
- **UI Components**: HealthDisplay (hearts), GameOverScreen with Grudge Points, DebugInfo, ExpeditionRank, StatsPanel
- **Enemy System**: 
  - Goblins (g): 1 HP, basic chase AI
  - Archers (a): 1 HP, maintains distance, shoots projectiles
  - Rust Beasts (R): 3 HP, moves every other turn, guards exit
- **Projectile System**: Archers shoot bullets that travel and deal damage
- **Expedition Rank**: 5 ranks with kill/room requirements, +5% bonuses per rank
- **Grudge Points**: Death rewards GP based on performance, stored in localStorage
- **Death/Restart**: Contextual death messages, GP breakdown, seamless restart

### Key Technical Details
- Room dimensions include walls (10x10 total = 8x8 playable area)
- Enemies stored in array, removed when killed
- Flash damage effect using canvas background color
- Turn processing prevents input during enemy moves
- Uses Zustand's immer middleware for immutable state updates

### Memories
- dev server is already running in another terminal, you don't need to start it

### Phase 3 Progress
Completed features:
- ✅ Expedition Rank System with 5 ranks and progression tracking
- ✅ New Enemy Types: Archer (ranged AI), Rust Beast (slow but tough)
- ✅ Projectile System for archer attacks
- ✅ Progressive Room Difficulty based on room number
- ✅ Basic Grudge System with death tracking and GP rewards
- ✅ Basic Item System:
  - Ale Flask (heal 1 HP)
  - Rusty Dagger (+1 damage for 3 attacks, stackable)
  - Lucky Pebble (+1 expedition rank)
  - Drop rates: Goblin 20%, Archer 30%, Rust Beast 100%
  - 3-slot inventory with number keys 1-3
  - Damage boost indicator showing remaining attacks

### Phase 3 TODO (Remaining)
1. **Upgrade Shop** (Priority: High)
   - Access from death screen or main menu
   - Initial upgrades: Stubborn Constitution (+HP), Ancestral Fury (+damage), Deep Pockets (start with item)
   - Purchase with Grudge Points
   - Apply upgrades to next run

2. **Ship Mood Evolution** (Priority: Medium)
   - Change messages based on expedition rank
   - Rank 0-2: Grumpy (current), Rank 3-4: Grudging, Rank 5: Almost Impressed
   - Visual mood indicator changes color

3. **Death & Replacement System** (Priority: Low)
   - Generate new dwarf names on death
   - Keep expedition bonuses when respawning
   - Track death counter
   - Seamless transition maintaining progression