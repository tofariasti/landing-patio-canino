export type CareLogType =
  | 'alimentacao'
  | 'passeio'
  | 'medicamento'
  | 'brincadeira'
  | 'higiene'
  | 'observacao'

export interface CareLog {
  id: string
  petId: string
  customerId: string
  type: CareLogType
  title: string
  notes: string
  occurredAt: string
  photoDataUrl?: string
  createdAt: string
}

export type CareLogInput = Omit<CareLog, 'id' | 'createdAt'>

export const CARE_LOG_LABELS: Record<CareLogType, string> = {
  alimentacao: 'Alimentação',
  passeio: 'Passeio',
  medicamento: 'Medicamento',
  brincadeira: 'Brincadeira',
  higiene: 'Higiene',
  observacao: 'Observação',
}
