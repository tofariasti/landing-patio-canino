import { useCallback, useEffect, useState } from 'react'
import { SEED_SERVICES } from '../data/seedServices'
import { STORAGE_KEYS } from '../config/constants'
import type { Service, ServiceInput } from '../types/service'

function loadServices(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.services)
    if (!raw) return SEED_SERVICES
    const parsed = JSON.parse(raw) as Service[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_SERVICES
  } catch {
    return SEED_SERVICES
  }
}

function persistServices(services: Service[]) {
  localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services))
}

export function useServices() {
  const [services, setServices] = useState<Service[]>(() => loadServices())

  useEffect(() => {
    persistServices(services)
  }, [services])

  const addService = useCallback((input: ServiceInput) => {
    const service: Service = { ...input, id: crypto.randomUUID() }
    setServices((prev) => [...prev, service])
    return service
  }, [])

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }, [])

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const getService = useCallback(
    (id: string) => services.find((s) => s.id === id),
    [services],
  )

  const resetServices = useCallback(() => {
    setServices(SEED_SERVICES)
  }, [])

  return {
    services,
    addService,
    updateService,
    deleteService,
    getService,
    resetServices,
  }
}

export type ServicesContextValue = ReturnType<typeof useServices>
