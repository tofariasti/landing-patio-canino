import { useCallback, useEffect, useState } from 'react'
import { SEED_PETS } from '../data/seedPets'
import { STORAGE_KEYS } from '../config/constants'
import type { Pet, PetInput } from '../types/pet'

function loadPets(): Pet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.pets)
    if (!raw) return SEED_PETS
    const parsed = JSON.parse(raw) as Pet[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PETS
  } catch {
    return SEED_PETS
  }
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>(() => loadPets())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.pets, JSON.stringify(pets))
  }, [pets])

  const addPet = useCallback((input: PetInput) => {
    const pet: Pet = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setPets((prev) => [...prev, pet])
    return pet
  }, [])

  const updatePet = useCallback((id: string, updates: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deletePet = useCallback((id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getPet = useCallback((id: string) => pets.find((p) => p.id === id), [pets])

  const getPetsByCustomer = useCallback(
    (customerId: string) => pets.filter((p) => p.customerId === customerId),
    [pets],
  )

  const resetPets = useCallback(() => setPets(SEED_PETS), [])

  return {
    pets,
    addPet,
    updatePet,
    deletePet,
    getPet,
    getPetsByCustomer,
    resetPets,
  }
}

export type PetsContextValue = ReturnType<typeof usePets>
