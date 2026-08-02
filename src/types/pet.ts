export type PetSize = 'pequeno' | 'medio' | 'grande'
export type PetSex = 'macho' | 'femea'

export interface Pet {
  id: string
  customerId: string
  name: string
  breed: string
  size: PetSize
  sex: PetSex
  ageYears: number
  weightKg: number
  vaccinesOk: boolean
  neutered: boolean
  medications: string
  temperament: string
  notes: string
  photoDataUrl?: string
  createdAt: string
}

export type PetInput = Omit<Pet, 'id' | 'createdAt'>

export const PET_SIZE_LABELS: Record<PetSize, string> = {
  pequeno: 'Pequeno',
  medio: 'Médio',
  grande: 'Grande',
}

export const PET_SEX_LABELS: Record<PetSex, string> = {
  macho: 'Macho',
  femea: 'Fêmea',
}
