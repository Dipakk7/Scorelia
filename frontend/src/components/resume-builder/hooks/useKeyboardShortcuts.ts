import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
  onSave?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts({ onSave, onEscape }: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S or Cmd + S -> Trigger Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSave?.()
      }

      // Escape -> Trigger Close / Cancel
      if (e.key === 'Escape') {
        onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSave, onEscape])
}
