import { createContext, useContext } from 'react'
import type { ThemeContextValue } from '../hooks/useTheme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider')
  return ctx
}
