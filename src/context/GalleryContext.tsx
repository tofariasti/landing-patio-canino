import { createContext, useContext } from 'react'
import type { GalleryContextValue } from '../hooks/useGalleryManager'

export const GalleryContext = createContext<GalleryContextValue | null>(null)

export function useGalleryContext() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('useGalleryContext must be used within GalleryProvider')
  return ctx
}
