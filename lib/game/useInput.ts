import { useEffect } from 'react'
import { useGameStore } from './store'

export function useInput() {
  const movePlayer = useGameStore((state) => state.movePlayer)
  const initializeGame = useGameStore((state) => state.initializeGame)
  const gameStatus = useGameStore((state) => state.gameStatus)
  const isProcessingTurn = useGameStore((state) => state.isProcessingTurn)
  const toggleGodMode = useGameStore((state) => state.toggleGodMode)
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Handle restart
      if (e.key.toLowerCase() === 'r' && gameStatus !== 'playing') {
        e.preventDefault()
        initializeGame()
        return
      }
      
      // Handle god mode toggle (G key)
      if (e.key.toLowerCase() === 'g') {
        e.preventDefault()
        toggleGodMode()
        return
      }
      
      // Handle spacebar wait (only when playing and not processing)
      if (e.key === ' ' && gameStatus === 'playing' && !isProcessingTurn) {
        e.preventDefault()
        // Wait a turn - move nowhere
        movePlayer(0, 0)
        return
      }
      
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
  }, [movePlayer, initializeGame, gameStatus, isProcessingTurn, toggleGodMode])
}