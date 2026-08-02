import { createContext, useContext } from 'react'
import type { ServicesContextValue } from '../hooks/useServices'

export const ServicesContext = createContext<ServicesContextValue | null>(null)

export function useServicesContext(): ServicesContextValue {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServicesContext must be used within ServicesContext')
  return ctx
}
