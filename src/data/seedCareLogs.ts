import type { CareLog } from '../types/careLog'

export const SEED_CARE_LOGS: CareLog[] = [
  {
    id: 'log-1',
    petId: 'pet-1',
    customerId: 'cust-1',
    type: 'alimentacao',
    title: 'Almoço',
    notes: 'Ração premium 250g + água filtrada.',
    occurredAt: '2026-08-02T12:10:00.000Z',
    createdAt: '2026-08-02T12:12:00.000Z',
  },
  {
    id: 'log-2',
    petId: 'pet-1',
    customerId: 'cust-1',
    type: 'brincadeira',
    title: 'Gramado',
    notes: '45 min de socialização com o grupo.',
    occurredAt: '2026-08-02T15:00:00.000Z',
    createdAt: '2026-08-02T15:05:00.000Z',
  },
  {
    id: 'log-3',
    petId: 'pet-2',
    customerId: 'cust-2',
    type: 'passeio',
    title: 'Passeio matinal',
    notes: 'Rota curta + comandos básicos.',
    occurredAt: '2026-08-02T09:20:00.000Z',
    createdAt: '2026-08-02T09:25:00.000Z',
  },
  {
    id: 'log-4',
    petId: 'pet-3',
    customerId: 'cust-3',
    type: 'medicamento',
    title: 'Dose da manhã',
    notes: 'Medicamento administrado conforme receita.',
    occurredAt: '2026-08-02T08:05:00.000Z',
    createdAt: '2026-08-02T08:06:00.000Z',
  },
]
