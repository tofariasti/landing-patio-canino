import { createContext, useContext } from 'react'
import type { PetsContextValue } from '../hooks/usePets'

export const PetsContext = createContext<PetsContextValue | null>(null)

export function usePetsContext() {
  const ctx = useContext(PetsContext)
  if (!ctx) throw new Error('usePetsContext must be used within PetsProvider')
  return ctx
}
