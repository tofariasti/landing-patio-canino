import { PICKUP_FEE, PRIORITY_MULTIPLIER } from '../config/constants'
import type { OrderExtras } from '../types/order'
import type { Service } from '../types/service'

export interface PriceEstimateInput {
  serviceId: string
  weightKg: number
  quantity: number
  extras: OrderExtras
}

export interface PriceEstimate {
  subtotal: number
  extrasTotal: number
  deliveryFee: number
  total: number
  turnaroundHours: number
  expressApplied: boolean
}

export const EXTRA_FEES = {
  perfume: 12,
  stainRemoval: 28,
} as const

export function calculateSubtotal(
  service: Service,
  weightKg: number,
  quantity: number,
): number {
  if (service.unit === 'dia') {
    return Math.max(weightKg, 1) * service.price
  }
  return Math.max(quantity, 1) * service.price
}

export function calculateExtrasTotal(extras: OrderExtras): number {
  let total = 0
  if (extras.perfume) total += EXTRA_FEES.perfume
  if (extras.stainRemoval) total += EXTRA_FEES.stainRemoval
  return total
}

export function calculatePriceEstimate(
  service: Service,
  input: PriceEstimateInput,
): PriceEstimate {
  const days = Math.max(input.weightKg, service.unit === 'dia' ? 1 : 0)
  const quantity = Math.max(input.quantity, 1)
  const subtotal = calculateSubtotal(service, days, quantity)
  const extrasTotal = calculateExtrasTotal(input.extras)
  const deliveryFee = input.extras.delivery ? PICKUP_FEE : 0
  let total = subtotal + extrasTotal + deliveryFee
  const expressApplied = input.extras.express
  if (expressApplied) {
    total = (subtotal + extrasTotal) * PRIORITY_MULTIPLIER + deliveryFee
  }
  const turnaroundHours = expressApplied
    ? Math.max(Math.round(service.turnaroundHours / 2), 4)
    : service.turnaroundHours

  return {
    subtotal: roundCurrency(subtotal),
    extrasTotal: roundCurrency(extrasTotal),
    deliveryFee: roundCurrency(deliveryFee),
    total: roundCurrency(total),
    turnaroundHours,
    expressApplied,
  }
}

export function calculateOrderTotal(
  service: Service,
  weightKg: number,
  quantity: number,
  extras: OrderExtras,
): number {
  return calculatePriceEstimate(service, {
    serviceId: service.id,
    weightKg,
    quantity,
    extras,
  }).total
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

export function validatePriceInput(
  service: Service | undefined,
  weightKg: number,
  quantity: number,
): string | null {
  if (!service) return 'Selecione um serviço.'
  if (service.unit === 'dia' && weightKg < 1) {
    return 'Informe pelo menos 1 dia.'
  }
  if (service.unit !== 'dia' && quantity < 1) {
    return 'Informe a quantidade de sessões.'
  }
  return null
}
