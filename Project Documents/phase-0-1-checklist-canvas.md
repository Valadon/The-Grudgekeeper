# Phase 0-1 Technical Checklist (Canvas Version)

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

/* Canvas specific styles */
canvas {
  @apply border border-gray-800;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
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
```
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
### 3. Create Canvas Renderer Hook
```typescript
/* lib/game/useRenderer.ts */
import { useEffect, useRef } from 'react'
import { useGameStore } from './store'
import { TILE_SIZE, TILE_DISPLAY, COLORS, ROOM_WIDTH, ROOM_HEIGHT, TILES } from './constants'

export function useRenderer(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const { currentRoom, player } = useGameStore()
  const animationFrameId = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = ROOM_WIDTH * TILE_SIZE
    canvas.height = ROOM_HEIGHT * TILE_SIZE
    
    // Configure text rendering
    ctx.font = `${TILE_SIZE * 0.8}px 'Space Mono', monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw room
      for (let y = 0; y < ROOM_HEIGHT; y++) {
        for (let x = 0; x < ROOM_WIDTH; x++) {
          const tile = currentRoom[y][x]
          const centerX = x * TILE_SIZE + TILE_SIZE / 2
          const centerY = y * TILE_SIZE + TILE_SIZE / 2
          
          // Set color based on tile type
          if (tile === TILES.WALL) {
            ctx.fillStyle = COLORS.WALL
            ctx.fillText(TILE_DISPLAY[TILES.WALL], centerX, centerY)
          } else {
            ctx.fillStyle = COLORS.FLOOR
            ctx.fillText(TILE_DISPLAY[TILES.FLOOR], centerX, centerY)
          }
        }
      }
```      
      // Draw player
      const playerCenterX = player.x * TILE_SIZE + TILE_SIZE / 2
      const playerCenterY = player.y * TILE_SIZE + TILE_SIZE / 2
      ctx.fillStyle = COLORS.PLAYER
      ctx.fillText(TILE_DISPLAY.PLAYER, playerCenterX, playerCenterY)
    }
    
    // Initial render
    render()
    
    // Clean up
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [currentRoom, player, canvasRef])
}
```

### 4. Create Game Canvas Component
```tsx
/* components/game/GameCanvas.tsx */
'use client'

import { useRef } from 'react'
import { useRenderer } from '@/lib/game/useRenderer'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useRenderer(canvasRef)
  
  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
```
### 5. Create Debug Info Component
```tsx
/* components/game/DebugInfo.tsx */
'use client'

import { useGameStore } from '@/lib/game/store'

export function DebugInfo() {
  const player = useGameStore((state) => state.player)
  
  return (
    <div className="text-sm text-gray-500 mt-4 font-mono">
      Player Position: ({player.x}, {player.y})
    </div>
  )
}
```

### 6. Create Game Page
```tsx
/* app/game/page.tsx */
'use client'

import { useEffect } from 'react'
import { GameCanvas } from '@/components/game/GameCanvas'
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
```      
      <GameCanvas />
      
      <DebugInfo />
      
      <div className="mt-8 text-sm text-gray-600">
        Use WASD or Arrow Keys to move
      </div>
    </div>
  )
}
```

### 7. Update Tailwind Config
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
      colors: {
        'game-green': '#66ff00',
        'game-wall': '#666666',
        'game-floor': '#333333',
      },
    },
  },
  plugins: [],
}
export default config
```
### 8. Test Everything
- [ ] Run `npm run dev`
- [ ] Navigate to http://localhost:3000/game
- [ ] Verify you see a 10x10 room with walls (█ characters)
- [ ] Verify @ symbol appears in center
- [ ] Test WASD movement
- [ ] Test arrow key movement
- [ ] Verify collision with walls works
- [ ] Check debug info updates
- [ ] Verify crisp pixel-perfect text rendering

### 9. Performance Check
- [ ] Movement feels instant (no lag)
- [ ] No console errors
- [ ] Text is sharp and monospaced
- [ ] Canvas renders cleanly

### 10. Git Commit
```bash
git add .
git commit -m "feat: implement walking skeleton with canvas renderer"
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
- [ ] Canvas renders ASCII clearly
- [ ] No lag or performance issues
- [ ] Code is organized and typed
- [ ] Debug info shows position
## Why Canvas Over CSS Grid?

### Performance
- **Canvas**: 1 draw call per frame
- **CSS Grid**: 100+ DOM updates per move

### Future Features
- **Smooth movement**: Trivial with canvas
- **Particles**: Just draw more stuff
- **Layering**: Multiple entities per tile
- **Animations**: requestAnimationFrame built-in

### Simplicity
- **No CSS wrestling**: x,y coordinates just work
- **Consistent spacing**: Font metrics are predictable
- **Easy scaling**: Just multiply TILE_SIZE

---

## Common Issues & Fixes

### Blurry Text?
Make sure:
- Canvas size matches pixel dimensions
- CSS doesn't scale the canvas
- `image-rendering: pixelated` is set

### Movement feels laggy?
- Check for console errors
- Ensure no heavy computations in render
- Verify requestAnimationFrame is used

### Fonts not loading?
- Check Space Mono import in globals.css
- Give font time to load before rendering
- Add font-display: swap to @import

---

## Ready for Phase 2? 

Before moving on:
1. Play for 5 minutes straight
2. Show someone else the controls
3. Make sure movement feels perfect

Remember: Good movement is the foundation of a good roguelike!