export type OrderStatus =
  | 'agendado'
  | 'checkin'
  | 'hospedado'
  | 'checkout'
  | 'concluido'

export type PaymentStatus = 'pendente' | 'parcial' | 'pago'

export interface OrderExtras {
  /** Avaliação/entrada prioritária (+50%) */
  express: boolean
  /** Fotos e vídeos diários */
  perfume: boolean
  /** Passeio extra */
  stainRemoval: boolean
  /** Busca/entrega do pet */
  delivery: boolean
}

export interface Order {
  id: string
  serviceId: string
  /** Dias (hospedagem/creche) — campo legado weightKg */
  weightKg: number
  quantity: number
  extras: OrderExtras
  status: OrderStatus
  notes: string
  total: number
  paymentStatus: PaymentStatus
  paidAmount: number
  createdAt: string
  pickupDate?: string
  deliveryDate?: string
}

export type OrderInput = Omit<
  Order,
  'id' | 'createdAt' | 'total' | 'paymentStatus' | 'paidAmount'
> & {
  total?: number
  paymentStatus?: PaymentStatus
  paidAmount?: number
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  agendado: 'Agendado',
  checkin: 'Check-in',
  hospedado: 'Hospedado',
  checkout: 'Check-out',
  concluido: 'Concluído',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendente: 'Pendente',
  parcial: 'Parcial',
  pago: 'Pago',
}

export const STATUS_FLOW: OrderStatus[] = [
  'agendado',
  'checkin',
  'hospedado',
  'checkout',
  'concluido',
]

export function createDefaultExtras(): OrderExtras {
  return { express: false, perfume: false, stainRemoval: false, delivery: false }
}

export function resolvePaymentStatus(total: number, paidAmount: number): PaymentStatus {
  if (paidAmount <= 0) return 'pendente'
  if (paidAmount + 0.009 >= total) return 'pago'
  return 'parcial'
}

export const EXTRA_LABELS = {
  express: 'Entrada prioritária (+50%)',
  perfume: 'Fotos e vídeos diários',
  stainRemoval: 'Passeio extra',
  delivery: 'Busca/entrega do pet',
} as const
