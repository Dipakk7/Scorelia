import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  onReanalyze?: () => void
  onFocusSearch?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts({
  onReanalyze,
  onFocusSearch,
  onEscape,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key events when user is typing inside an input or textarea
      const target = event.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // ESC Key
      if (event.key === 'Escape') {
        onEscape?.()
        return
      }

      if (isInput) return

      // 'R' Key -> Reanalyze Resume
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        onReanalyze?.()
        return
      }

      // '/' Key -> Focus Search Bar
      if (event.key === '/') {
        event.preventDefault()
        onFocusSearch?.()
        const searchInput = document.getElementById('resume-search-bar') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onReanalyze, onFocusSearch, onEscape])
}

export default useKeyboardShortcuts
