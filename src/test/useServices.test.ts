import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useServices } from '../hooks/useServices'
import { STORAGE_KEYS } from '../config/constants'

describe('useServices', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads seed services by default', () => {
    const { result } = renderHook(() => useServices())
    expect(result.current.services.length).toBeGreaterThan(0)
  })

  it('adds and persists a service', () => {
    const { result } = renderHook(() => useServices())
    act(() => {
      result.current.addService({
        name: 'Teste',
        category: 'hospedagem',
        price: 10,
        unit: 'dia',
        turnaroundHours: 24,
        description: 'Teste',
        active: true,
      })
    })
    expect(result.current.services.some((s) => s.name === 'Teste')).toBe(true)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.services)!)
    expect(stored.some((s: { name: string }) => s.name === 'Teste')).toBe(true)
  })

  it('resets to seed data', () => {
    const { result } = renderHook(() => useServices())
    const initialCount = result.current.services.length
    act(() => {
      result.current.addService({
        name: 'Extra',
        category: 'creche',
        price: 1,
        unit: 'dia',
        turnaroundHours: 24,
        description: '',
        active: true,
      })
    })
    act(() => result.current.resetServices())
    expect(result.current.services.length).toBe(initialCount)
  })
})
