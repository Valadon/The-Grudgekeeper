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
Currently in **Phase 2**: Core gameplay systems with combat and enemies.

Key phases:
1. **Phase 0**: Project setup ✓
2. **Phase 1**: Walking skeleton with movement ✓
3. **Phase 2**: Core gameplay systems (in progress)
   - Turn-based system ✓
   - Basic enemies (goblins) ✓
   - Combat system ✓
   - Multi-room dungeon (pending)
   - Ship personality (pending)
4. **Phase 3**: Ship personality integration
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
- **UI Components**: HealthDisplay (hearts), GameOverScreen, DebugInfo
- **Enemy System**: Goblins with 1 HP that chase the player
- **Death/Restart**: Game over screen with restart functionality

### Key Technical Details
- Room dimensions include walls (10x10 total = 8x8 playable area)
- Enemies stored in array, removed when killed
- Flash damage effect using canvas background color
- Turn processing prevents input during enemy moves
- Uses Zustand's immer middleware for immutable state updates