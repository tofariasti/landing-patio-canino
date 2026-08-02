import { createContext, useContext } from 'react'
import type { CareLogsContextValue } from '../hooks/useCareLogs'

export const CareLogsContext = createContext<CareLogsContextValue | null>(null)

export function useCareLogsContext() {
  const ctx = useContext(CareLogsContext)
  if (!ctx) throw new Error('useCareLogsContext must be used within CareLogsProvider')
  return ctx
}
