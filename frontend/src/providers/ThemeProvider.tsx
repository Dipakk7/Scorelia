/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'scorelia-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    const applyTheme = (targetTheme: Theme) => {
      let resolvedTheme: 'dark' | 'light' = 'dark'

      if (targetTheme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      } else {
        resolvedTheme = targetTheme
      }

      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
      root.setAttribute('data-theme', resolvedTheme)
      root.style.colorScheme = resolvedTheme
    }

    applyTheme(theme)

    // Listen to system theme preference changes if theme === 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = () => {
        applyTheme('system')
      }

      mediaQuery.addEventListener('change', handleSystemThemeChange)
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

export default ThemeProvider
