import { createContext, useContext } from 'react'
import type { SiteSettingsContextValue } from '../hooks/useSiteSettings'

export const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)

export function useSiteSettingsContext() {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettingsContext must be used within SiteSettingsProvider')
  }
  return ctx
}
