import type { Customer } from '../types/customer'
import type { Order } from '../types/order'

function createOrder(
  serviceId: string,
  weightKg: number,
  quantity: number,
  status: Order['status'],
  total: number,
  notes: string,
  extras: Order['extras'] = {
    express: false,
    perfume: true,
    stainRemoval: false,
    delivery: false,
  },
  deliveryDate?: string,
): Order {
  return {
    id: crypto.randomUUID(),
    serviceId,
    weightKg,
    quantity,
    extras,
    status,
    notes,
    total,
    createdAt: '2026-05-10T10:00:00.000Z',
    deliveryDate,
  }
}

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Camila Ribeiro',
    email: 'camila.ribeiro@email.demo',
    phone: '(51) 99876-5432',
    address: 'Rua José do Patrocínio, 420 — Cidade Baixa',
    notes: 'Tutora do Thor (labrador). Vacinas em dia. Prefere fotos à tarde.',
    createdAt: '2026-04-01T09:00:00.000Z',
    orders: [
      createOrder(
        'svc-1',
        4,
        1,
        'hospedado',
        404,
        'Thor — hospedagem 4 dias',
        {
          express: false,
          perfume: true,
          stainRemoval: true,
          delivery: false,
        },
        '2026-08-12',
      ),
      createOrder(
        'svc-2',
        5,
        1,
        'concluido',
        325,
        'Creche semanal — maio',
        {
          express: false,
          perfume: true,
          stainRemoval: false,
          delivery: true,
        },
        '2026-05-20',
      ),
    ],
  },
  {
    id: 'cust-2',
    name: 'Rafael Mendes',
    email: 'rafael.mendes@email.demo',
    phone: '(51) 98765-4321',
    address: 'Av. Protásio Alves, 2100 — Petrópolis',
    notes: 'Mel (border collie). Alta energia — priorizar enriquecimento.',
    createdAt: '2026-05-12T14:00:00.000Z',
    orders: [
      createOrder(
        'svc-5',
        3,
        1,
        'checkin',
        396,
        'Combo hospedagem + creche',
        {
          express: true,
          perfume: true,
          stainRemoval: false,
          delivery: false,
        },
        '2026-08-08',
      ),
    ],
  },
  {
    id: 'cust-3',
    name: 'Helena Souza',
    email: 'helena.s@email.demo',
    phone: '(51) 97654-3210',
    address: 'Rua Dona Laura, 88 — Moinhos de Vento',
    notes: 'Nina (poodle). Medicamento 2x/dia conforme receita anexada.',
    createdAt: '2026-06-01T10:00:00.000Z',
    orders: [
      createOrder(
        'svc-1',
        2,
        1,
        'agendado',
        202,
        'Nina — fim de semana',
        {
          express: false,
          perfume: true,
          stainRemoval: false,
          delivery: true,
        },
        '2026-08-10',
      ),
    ],
  },
]
