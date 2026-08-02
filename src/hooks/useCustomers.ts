import { useCallback, useEffect, useState } from 'react'
import { SEED_CUSTOMERS } from '../data/seedCustomers'
import { STORAGE_KEYS } from '../config/constants'
import type { Customer, CustomerInput } from '../types/customer'
import type { Order, OrderInput } from '../types/order'
import type { Service } from '../types/service'
import { calculateOrderTotal } from '../utils/pricing'

function loadCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.customers)
    if (!raw) return SEED_CUSTOMERS
    const parsed = JSON.parse(raw) as Customer[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CUSTOMERS
  } catch {
    return SEED_CUSTOMERS
  }
}

function persistCustomers(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers))
}

function resolveTotal(
  order: OrderInput,
  getService: (id: string) => Service | undefined,
): number {
  if (order.total != null) return order.total
  const service = getService(order.serviceId)
  if (!service) return 0
  return calculateOrderTotal(
    service,
    order.weightKg,
    order.quantity,
    order.extras,
  )
}

export function useCustomers(getService: (id: string) => Service | undefined) {
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomers())

  useEffect(() => {
    persistCustomers(customers)
  }, [customers])

  const addCustomer = useCallback((input: CustomerInput) => {
    const customer: Customer = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      orders: input.orders ?? [],
    }
    setCustomers((prev) => [...prev, customer])
    return customer
  }, [])

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    )
  }, [])

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getCustomer = useCallback(
    (id: string) => customers.find((c) => c.id === id),
    [customers],
  )

  const addOrder = useCallback(
    (customerId: string, order: OrderInput) => {
      const newOrder: Order = {
        ...order,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        total: resolveTotal(order, getService),
      }
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId ? { ...c, orders: [...c.orders, newOrder] } : c,
        ),
      )
      return newOrder
    },
    [getService],
  )

  const updateOrder = useCallback(
    (customerId: string, order: Order) => {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== customerId) return c
          const orders = c.orders.some((o) => o.id === order.id)
            ? c.orders.map((o) => (o.id === order.id ? order : o))
            : [...c.orders, order]
          return { ...c, orders }
        }),
      )
    },
    [],
  )

  const deleteOrder = useCallback((customerId: string, orderId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, orders: c.orders.filter((o) => o.id !== orderId) }
          : c,
      ),
    )
  }, [])

  const resetCustomers = useCallback(() => {
    setCustomers(SEED_CUSTOMERS)
  }, [])

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    addOrder,
    updateOrder,
    deleteOrder,
    resetCustomers,
  }
}

export type CustomersContextValue = ReturnType<typeof useCustomers>
