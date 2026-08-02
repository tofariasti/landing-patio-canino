import { describe, it, expect } from 'vitest'
import { SEED_SERVICES } from '../data/seedServices'
import {
  calculatePriceEstimate,
  calculateOrderTotal,
  formatCurrency,
  validatePriceInput,
  EXTRA_FEES,
} from '../utils/pricing'
import { createDefaultExtras } from '../types/order'
import { PICKUP_FEE } from '../config/constants'

describe('pricing', () => {
  const hospedagem = SEED_SERVICES[0]

  it('calculates per-day subtotal', () => {
    const result = calculatePriceEstimate(hospedagem, {
      serviceId: hospedagem.id,
      weightKg: 3,
      quantity: 1,
      extras: createDefaultExtras(),
    })
    expect(result.subtotal).toBe(285)
    expect(result.total).toBe(285)
  })

  it('applies priority multiplier', () => {
    const result = calculatePriceEstimate(hospedagem, {
      serviceId: hospedagem.id,
      weightKg: 2,
      quantity: 1,
      extras: { ...createDefaultExtras(), express: true },
    })
    expect(result.expressApplied).toBe(true)
    expect(result.total).toBe(285)
  })

  it('adds extras and pickup fee', () => {
    const result = calculatePriceEstimate(hospedagem, {
      serviceId: hospedagem.id,
      weightKg: 1,
      quantity: 1,
      extras: {
        express: false,
        perfume: true,
        stainRemoval: true,
        delivery: true,
      },
    })
    expect(result.extrasTotal).toBe(EXTRA_FEES.perfume + EXTRA_FEES.stainRemoval)
    expect(result.deliveryFee).toBe(PICKUP_FEE)
  })

  it('calculates per-session services', () => {
    const passeio = SEED_SERVICES[2]
    const total = calculateOrderTotal(passeio, 0, 2, createDefaultExtras())
    expect(total).toBe(90)
  })

  it('formats currency in pt-BR', () => {
    expect(formatCurrency(95)).toMatch(/R\$\s*95,00/)
  })

  it('validates price input', () => {
    expect(validatePriceInput(undefined, 5, 1)).toBe('Selecione um serviço.')
    expect(validatePriceInput(hospedagem, 0, 1)).toBe('Informe pelo menos 1 dia.')
    expect(validatePriceInput(hospedagem, 5, 1)).toBeNull()
  })
})
