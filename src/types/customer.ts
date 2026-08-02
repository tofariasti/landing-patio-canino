import type { Order } from './order'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  notes: string
  orders: Order[]
  createdAt: string
}

export type CustomerInput = Omit<Customer, 'id' | 'createdAt' | 'orders'> & {
  orders?: Order[]
}
