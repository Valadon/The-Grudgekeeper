# Phase 0-1 Technical Checklist

## Phase 0: Project Setup ⚡

### 1. Create Next.js Project
```bash
npx create-next-app@latest the-grudgekeeper --typescript --tailwind --app --no-src-dir
cd the-grudgekeeper
```
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ App Router: Yes
- ❌ src/ directory: No
- ✅ Import alias: @ 

### 2. Install Essential Dependencies Only
```bash
npm install zustand immer
npm install -D @types/node
```

### 3. Clean Up Default Files
```bash
# Remove default Next.js cruft
rm -rf app/favicon.ico
rm app/globals.css
rm app/page.tsx
rm app/layout.tsx
```

### 4. Create New globals.css
```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-black text-green-500;
    font-family: 'Space Mono', monospace;
  }
}

/* Remove all animations for now */
* {
  animation: none !important;
  transition: none !important;
}
```

### 5. Create Minimal Root Layout
```tsx
/* app/layout.tsx */
import './globals.css'

export const metadata = {
  title: 'The Grudgekeeper',
  description: 'Space Dwarf Roguelike',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### 6. Create Landing Page
```tsx
/* app/page.tsx */
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">The Grudgekeeper</h1>
        <Link 
          href="/game"
          className="text-xl hover:text-white"
        >
          [ENTER THE SHIP]
        </Link>
      </div>
    </div>
  )
}
```

### 7. Create Folder Structure
```bash
mkdir -p app/game
mkdir -p lib/game
mkdir -p components/game
```

### 8. Create Game Types
```typescript
/* lib/game/types.ts */
export interface Position {
  x: number
  y: number
}

export interface GameState {
  player: Position
  currentRoom: number[][]
}

export type TileType = 'floor' | 'wall' | 'player'
```

### 9. Create Game Constants
```typescript
/* lib/game/constants.ts */
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
```

### 10. Verify Setup
```bash
npm run dev
# Visit http://localhost:3000
# Click "ENTER THE SHIP" - should 404 (that's fine!)
```

---

## Phase 1: Walking Skeleton 🦴

### 1. Create Game Store
```typescript
/* lib/game/store.ts */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Position, GameState } from './types'
import { ROOM_WIDTH, ROOM_HEIGHT, TILES } from './constants'

interface GameStore extends GameState {
  movePlayer: (dx: number, dy: number) => void
  initializeGame: () => void
}

// Hardcoded test room
const TEST_ROOM = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
]

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    player: { x: 5, y: 5 },
    currentRoom: TEST_ROOM,
    
    movePlayer: (dx, dy) => set((state) => {
      const newX = state.player.x + dx
      const newY = state.player.y + dy
      
      // Bounds check
      if (newX < 0 || newX >= ROOM_WIDTH || 
          newY < 0 || newY >= ROOM_HEIGHT) {
        return
      }
      
      // Collision check
      if (state.currentRoom[newY][newX] === TILES.WALL) {
        return
      }
      
      state.player.x = newX
      state.player.y = newY
    }),
    
    initializeGame: () => set((state) => {
      state.player = { x: 5, y: 5 }
      state.currentRoom = TEST_ROOM
    }),
  }))
)
```

### 2. Create Input Handler Hook
```typescript
/* lib/game/useInput.ts */
import { useEffect } from 'react'
import { useGameStore } from './store'

export function useInput() {
  const movePlayer = useGameStore((state) => state.movePlayer)
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault()
          movePlayer(0, -1)
          break
        case 's':
        case 'arrowdown':
          e.preventDefault()
          movePlayer(0, 1)
          break
        case 'a':
        case 'arrowleft':
          e.preventDefault()
          movePlayer(-1, 0)
          break
        case 'd':
        case 'arrowright':
          e.preventDefault()
          movePlayer(1, 0)
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [movePlayer])
}
```

### 3. Create Dungeon Grid Component
```tsx
/* components/game/DungeonGrid.tsx */
'use client'

import { useGameStore } from '@/lib/game/store'
import { TILE_DISPLAY, TILES } from '@/lib/game/constants'

export function DungeonGrid() {
  const { currentRoom, player } = useGameStore()
  
  return (
    <div className="font-mono text-2xl leading-none">
      {currentRoom.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tile, x) => {
            const isPlayer = player.x === x && player.y === y
            
            return (
              <span
                key={`${x}-${y}`}
                className={`
                  w-8 h-8 flex items-center justify-center
                  ${isPlayer ? 'text-green-400' : ''}
                  ${tile === TILES.WALL ? 'text-gray-600' : 'text-gray-800'}
                `}
              >
                {isPlayer 
                  ? TILE_DISPLAY.PLAYER 
                  : tile === TILES.WALL 
                    ? TILE_DISPLAY[TILES.WALL]
                    : TILE_DISPLAY[TILES.FLOOR]
                }
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
```

### 4. Create Debug Info Component
```tsx
/* components/game/DebugInfo.tsx */
'use client'

import { useGameStore } from '@/lib/game/store'

export function DebugInfo() {
  const player = useGameStore((state) => state.player)
  
  return (
    <div className="text-sm text-gray-500 mt-4">
      Player Position: ({player.x}, {player.y})
    </div>
  )
}
```

### 5. Create Game Page
```tsx
/* app/game/page.tsx */
'use client'

import { useEffect } from 'react'
import { DungeonGrid } from '@/components/game/DungeonGrid'
import { DebugInfo } from '@/components/game/DebugInfo'
import { useGameStore } from '@/lib/game/store'
import { useInput } from '@/lib/game/useInput'

export default function GamePage() {
  const initializeGame = useGameStore((state) => state.initializeGame)
  
  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])
  
  // Set up input handling
  useInput()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">
        The Grudgekeeper - Prototype
      </h1>
      
      <div className="border border-gray-800 p-4">
        <DungeonGrid />
      </div>
      
      <DebugInfo />
      
      <div className="mt-8 text-sm text-gray-600">
        Use WASD or Arrow Keys to move
      </div>
    </div>
  )
}
```

### 6. Update Tailwind Config
```javascript
/* tailwind.config.ts */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

### 7. Test Everything
- [ ] Run `npm run dev`
- [ ] Navigate to http://localhost:3000/game
- [ ] Verify you see a 10x10 room with walls
- [ ] Verify @ symbol appears in center
- [ ] Test WASD movement
- [ ] Test arrow key movement
- [ ] Verify collision with walls works
- [ ] Check debug info updates

### 8. Performance Check
- [ ] Movement feels instant (no lag)
- [ ] No console errors
- [ ] Page doesn't flicker on movement

### 9. Code Organization Check
- [ ] All game logic in `/lib/game`
- [ ] All components in `/components/game`
- [ ] Types properly defined
- [ ] Constants extracted

### 10. Git Commit
```bash
git add .
git commit -m "feat: implement walking skeleton with basic movement"
```

---

## Success Criteria Checklist

### Phase 0 ✓
- [ ] Project runs without errors
- [ ] Space Mono font loads correctly
- [ ] Basic route structure works
- [ ] All unnecessary files removed

### Phase 1 ✓
- [ ] Player can move with WASD/arrows
- [ ] Walls block movement correctly
- [ ] No lag or performance issues
- [ ] Code is organized and typed
- [ ] Debug info shows position

## Common Issues & Fixes

### Font not loading?
Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your config here
}
module.exports = nextConfig
```

### TypeScript errors?
Make sure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Movement feels laggy?
- Check React DevTools for unnecessary re-renders
- Ensure no animations/transitions in CSS
- Verify immer is working correctly

---

## Ready for Phase 2? 

Before moving on:
1. Play for 5 minutes straight
2. Have someone else try the controls
3. Make sure it "feels" right

Remember: If this isn't fun to move around in, nothing else matters!