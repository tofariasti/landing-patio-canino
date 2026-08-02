export type FinanceKind = 'receita' | 'despesa'

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao' | 'transferencia' | 'outro'

export type FinanceCategory =
  | 'hospedagem'
  | 'creche'
  | 'passeio'
  | 'extra'
  | 'racao'
  | 'veterinario'
  | 'manutencao'
  | 'salario'
  | 'utilidades'
  | 'marketing'
  | 'outro'

export interface FinanceTransaction {
  id: string
  kind: FinanceKind
  category: FinanceCategory
  amount: number
  method: PaymentMethod
  description: string
  occurredAt: string
  customerId?: string
  orderId?: string
  createdAt: string
}

export type FinanceTransactionInput = Omit<FinanceTransaction, 'id' | 'createdAt'>

export const FINANCE_KIND_LABELS: Record<FinanceKind, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  transferencia: 'Transferência',
  outro: 'Outro',
}

export const FINANCE_CATEGORY_LABELS: Record<FinanceCategory, string> = {
  hospedagem: 'Hospedagem',
  creche: 'Creche',
  passeio: 'Passeio',
  extra: 'Extra / serviço',
  racao: 'Ração e insumos',
  veterinario: 'Veterinário',
  manutencao: 'Manutenção',
  salario: 'Salários',
  utilidades: 'Água / luz / internet',
  marketing: 'Marketing',
  outro: 'Outro',
}

export const RECEITA_CATEGORIES: FinanceCategory[] = [
  'hospedagem',
  'creche',
  'passeio',
  'extra',
  'outro',
]

export const DESPESA_CATEGORIES: FinanceCategory[] = [
  'racao',
  'veterinario',
  'manutencao',
  'salario',
  'utilidades',
  'marketing',
  'outro',
]
