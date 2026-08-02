export type ServiceCategory = 'hospedagem' | 'creche' | 'passeio' | 'extra'

export type PricingUnit = 'dia' | 'sessao'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  price: number
  unit: PricingUnit
  turnaroundHours: number
  description: string
  active: boolean
}

export type ServiceInput = Omit<Service, 'id'>

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hospedagem: 'Hospedagem',
  creche: 'Creche',
  passeio: 'Passeio',
  extra: 'Extra',
}

export const UNIT_LABELS: Record<PricingUnit, string> = {
  dia: 'por dia',
  sessao: 'por sessão',
}
