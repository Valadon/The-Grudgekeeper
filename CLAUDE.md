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
Currently in **Phase 0-1**: Setting up the walking skeleton with basic movement and ASCII rendering.

Key phases:
1. **Phase 0**: Project setup ✓
2. **Phase 1**: Walking skeleton with movement (current)
3. **Phase 2**: Core gameplay systems
4. **Phase 3**: Ship personality integration
5. **Phase 4**: Full game loop

### Game State Architecture
- Client-side state management using Zustand
- Game state includes player position, current room layout, and game systems
- Movement system with collision detection
- Input handling via keyboard (WASD/Arrow keys)

### ASCII Rendering System
- Monospace font (Space Mono) for consistent display
- CSS Grid-based dungeon rendering
- Character set defined in ascii-reference-sheet.md
- Color palette using Tailwind classes

### Important Design Decisions
- **ASCII-First**: Game must be fully playable with ASCII graphics alone
- **Type Safety**: Full TypeScript coverage throughout
- **Performance**: No animations/transitions initially for instant feedback
- **Incremental Enhancement**: Visual improvements without breaking core gameplay