import { useCallback, useEffect, useMemo, useState } from 'react'
import { GALLERY_ITEMS, type GalleryItem } from '../data/gallery'
import { STORAGE_KEYS } from '../config/constants'

export type ManagedGalleryItem = GalleryItem & {
  source: 'seed' | 'upload'
  hidden?: boolean
}

type StoredGallery = {
  uploads: GalleryItem[]
  hiddenIds: string[]
}

function loadStored(): StoredGallery {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.gallery)
    if (!raw) return { uploads: [], hiddenIds: [] }
    const parsed = JSON.parse(raw) as StoredGallery
    return {
      uploads: Array.isArray(parsed.uploads) ? parsed.uploads : [],
      hiddenIds: Array.isArray(parsed.hiddenIds) ? parsed.hiddenIds : [],
    }
  } catch {
    return { uploads: [], hiddenIds: [] }
  }
}

export function useGalleryManager() {
  const [uploads, setUploads] = useState<GalleryItem[]>(() => loadStored().uploads)
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => loadStored().hiddenIds)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.gallery,
      JSON.stringify({ uploads, hiddenIds } satisfies StoredGallery),
    )
  }, [uploads, hiddenIds])

  const items = useMemo<ManagedGalleryItem[]>(() => {
    const seed = GALLERY_ITEMS.map((item) => ({
      ...item,
      source: 'seed' as const,
      hidden: hiddenIds.includes(item.id),
    }))
    const custom = uploads.map((item) => ({
      ...item,
      source: 'upload' as const,
      hidden: hiddenIds.includes(item.id),
    }))
    return [...custom, ...seed]
  }, [uploads, hiddenIds])

  const visibleItems = useMemo(
    () => items.filter((item) => !item.hidden),
    [items],
  )

  const addItem = useCallback((item: Omit<GalleryItem, 'id'> & { id?: string }) => {
    const full: GalleryItem = {
      ...item,
      id: item.id ?? crypto.randomUUID(),
    }
    setUploads((prev) => [full, ...prev])
    return full
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<GalleryItem>) => {
    setUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setUploads((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id)
      }
      return prev
    })
    setHiddenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const restoreItem = useCallback((id: string) => {
    setHiddenIds((prev) => prev.filter((hid) => hid !== id))
  }, [])

  const resetGallery = useCallback(() => {
    setUploads([])
    setHiddenIds([])
  }, [])

  return {
    items,
    visibleItems,
    addItem,
    updateItem,
    removeItem,
    restoreItem,
    resetGallery,
  }
}

export type GalleryContextValue = ReturnType<typeof useGalleryManager>
