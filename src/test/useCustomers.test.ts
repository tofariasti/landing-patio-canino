import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCustomers } from '../hooks/useCustomers'
import { useServices } from '../hooks/useServices'
import { STORAGE_KEYS } from '../config/constants'
import { createDefaultExtras } from '../types/order'

function useCustomersWithServices() {
  const services = useServices()
  return useCustomers(services.getService)
}

describe('useCustomers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads seed customers', () => {
    const { result } = renderHook(() => useCustomersWithServices())
    expect(result.current.customers.length).toBeGreaterThan(0)
  })

  it('adds customer with order', () => {
    const { result } = renderHook(() => useCustomersWithServices())
    let customerId = ''
    act(() => {
      const c = result.current.addCustomer({
        name: 'Test User',
        email: 't@test.demo',
        phone: '51999999999',
        address: 'Rua Teste',
        notes: '',
      })
      customerId = c.id
      result.current.addOrder(customerId, {
        serviceId: 'svc-1',
        weightKg: 2,
        quantity: 1,
        extras: createDefaultExtras(),
        status: 'agendado',
        notes: '',
      })
    })
    const customer = result.current.getCustomer(customerId)
    expect(customer?.orders.length).toBe(1)
    expect(customer?.orders[0].total).toBeGreaterThan(0)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers)!)
    expect(stored.length).toBeGreaterThan(0)
  })
})
