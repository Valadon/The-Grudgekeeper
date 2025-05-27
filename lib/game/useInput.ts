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