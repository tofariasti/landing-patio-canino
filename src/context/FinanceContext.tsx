import { createContext, useContext } from 'react'
import type { FinanceContextValue } from '../hooks/useFinance'

export const FinanceContext = createContext<FinanceContextValue | null>(null)

export function useFinanceContext() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinanceContext must be used within FinanceProvider')
  return ctx
}
