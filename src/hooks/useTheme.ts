import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../config/constants'

export type Theme = 'light' | 'dark'

/** Tema principal do painel — sempre inicia claro se não houver preferência. */
export const DEFAULT_THEME: Theme = 'light'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.theme)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, setTheme, toggleTheme }
}

export type ThemeContextValue = ReturnType<typeof useTheme>
