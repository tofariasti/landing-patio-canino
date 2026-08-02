import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSiteSettings'
import { STORAGE_KEYS } from '../config/constants'
import type { SiteSettings } from '../types/siteSettings'

function normalizeSettings(raw: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...raw,
    socials: {
      ...DEFAULT_SITE_SETTINGS.socials,
      ...(raw?.socials ?? {}),
    },
  }
}

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.siteSettings)
    if (!raw) return DEFAULT_SITE_SETTINGS
    return normalizeSettings(JSON.parse(raw) as Partial<SiteSettings>)
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

/** Keep only digits for wa.me links */
export function sanitizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => loadSettings())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.siteSettings, JSON.stringify(settings))
  }, [settings])

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) =>
      normalizeSettings({
        ...prev,
        ...updates,
        socials: updates.socials
          ? { ...prev.socials, ...updates.socials }
          : prev.socials,
      }),
    )
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SITE_SETTINGS)
  }, [])

  return {
    settings,
    updateSettings,
    resetSettings,
    whatsappDigits: sanitizeWhatsAppNumber(settings.whatsappNumber),
  }
}

export type SiteSettingsContextValue = ReturnType<typeof useSiteSettings>
