import { createContext, useContext } from 'react'
import type { CustomersContextValue } from '../hooks/useCustomers'

export const CustomersContext = createContext<CustomersContextValue | null>(null)

export function useCustomersContext() {
  const ctx = useContext(CustomersContext)
  if (!ctx) throw new Error('useCustomersContext must be used within CustomersProvider')
  return ctx
}
