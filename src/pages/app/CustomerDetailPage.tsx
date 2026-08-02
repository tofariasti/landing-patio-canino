import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import { useServicesContext } from '../../context/ServicesContext'
import type { Order, OrderStatus } from '../../types/order'
import { STATUS_LABELS, EXTRA_LABELS, createDefaultExtras } from '../../types/order'
import { calculateOrderTotal, formatCurrency } from '../../utils/pricing'

const EMPTY_ORDER = {
  serviceId: '',
  weightKg: 3,
  quantity: 1,
  extras: createDefaultExtras(),
  status: 'agendado' as OrderStatus,
  notes: '',
  deliveryDate: '',
  pickupDate: '',
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getCustomer, addOrder, updateOrder, deleteOrder } = useCustomersContext()
  const { services } = useServicesContext()
  const customer = id ? getCustomer(id) : undefined

  const [showOrderForm, setShowOrderForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!customer) {
    return (
      <div className="panel">
        <p>Tutor não encontrado.</p>
        <Link to="/app/clientes">← Voltar</Link>
      </div>
    )
  }

  const selectedService = services.find((s) => s.id === orderForm.serviceId)
  const previewTotal = selectedService
    ? calculateOrderTotal(
        selectedService,
        orderForm.weightKg,
        orderForm.quantity,
        orderForm.extras,
      )
    : 0

  function openOrderForm(order?: Order) {
    setShowOrderForm(true)
    setErrors({})
    if (order) {
      setEditingOrder(order)
      setOrderForm({
        serviceId: order.serviceId,
        weightKg: order.weightKg,
        quantity: order.quantity,
        extras: { ...order.extras },
        status: order.status,
        notes: order.notes,
        deliveryDate: order.deliveryDate ?? '',
        pickupDate: order.pickupDate ?? '',
      })
    } else {
      setEditingOrder(null)
      setOrderForm(EMPTY_ORDER)
    }
  }

  function closeOrderForm() {
    setShowOrderForm(false)
    setEditingOrder(null)
    setOrderForm(EMPTY_ORDER)
    setErrors({})
  }

  function saveOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!customer) return
    const newErrors: Record<string, string> = {}
    if (!orderForm.serviceId) newErrors.serviceId = 'Selecione um serviço.'
    const svc = services.find((s) => s.id === orderForm.serviceId)
    if (svc?.unit === 'dia' && orderForm.weightKg < 1) {
      newErrors.weightKg = 'Mínimo 1 dia.'
    }
    if (svc && svc.unit !== 'dia' && orderForm.quantity < 1) {
      newErrors.quantity = 'Informe a quantidade.'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload = {
      serviceId: orderForm.serviceId,
      weightKg: orderForm.weightKg,
      quantity: orderForm.quantity,
      extras: orderForm.extras,
      status: orderForm.status,
      notes: orderForm.notes,
      deliveryDate: orderForm.deliveryDate || undefined,
      pickupDate: orderForm.pickupDate || undefined,
    }

    if (editingOrder) {
      updateOrder(customer.id, {
        ...editingOrder,
        ...payload,
        total: calculateOrderTotal(
          svc!,
          orderForm.weightKg,
          orderForm.quantity,
          orderForm.extras,
        ),
      })
    } else {
      addOrder(customer.id, payload)
    }
    closeOrderForm()
  }

  function toggleExtra(key: keyof Order['extras']) {
    setOrderForm((prev) => ({
      ...prev,
      extras: { ...prev.extras, [key]: !prev.extras[key] },
    }))
  }

  return (
    <>
      <header className="app-header">
        <div>
          <Link to="/app/clientes" style={{ fontSize: '0.875rem' }}>
            ← Tutores
          </Link>
          <h1 className="app-header__title">{customer.name}</h1>
          <p className="app-header__subtitle">{customer.phone || customer.email || '—'}</p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => openOrderForm()}>
          + Nova reserva
        </button>
      </header>

      <div className="panel">
        <h2 className="panel__title">Dados do tutor</h2>
        <dl className="detail-list">
          <div>
            <dt>E-mail</dt>
            <dd>{customer.email || '—'}</dd>
          </div>
          <div>
            <dt>Telefone</dt>
            <dd>{customer.phone || '—'}</dd>
          </div>
          <div>
            <dt>Endereço</dt>
            <dd>{customer.address || '—'}</dd>
          </div>
          <div>
            <dt>Observações</dt>
            <dd>{customer.notes || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Reservas ({customer.orders.length})</h2>
        </div>
        {customer.orders.length === 0 ? (
          <p>Nenhuma reserva cadastrada.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Dias/Sessões</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Check-out</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order) => {
                  const svc = services.find((s) => s.id === order.serviceId)
                  return (
                    <tr key={order.id}>
                      <td>{svc?.name ?? order.serviceId}</td>
                      <td>
                        {svc?.unit === 'dia'
                          ? `${order.weightKg} dia(s)`
                          : `${order.quantity} sessão(ões)`}
                      </td>
                      <td>{STATUS_LABELS[order.status]}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        {order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            onClick={() => openOrderForm(order)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger btn--sm"
                            onClick={() => {
                              if (window.confirm('Excluir esta reserva?')) {
                                deleteOrder(customer.id, order.id)
                              }
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showOrderForm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
          <form className="modal modal--wide" onSubmit={saveOrder}>
            <h2 id="order-modal-title" className="modal__title">
              {editingOrder ? 'Editar reserva' : 'Nova reserva'}
            </h2>
            {Object.keys(errors).length > 0 && (
              <div className="form-alert" role="alert">
                {Object.values(errors).join(' ')}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="o-service">Serviço *</label>
              <select
                id="o-service"
                value={orderForm.serviceId}
                onChange={(e) => setOrderForm({ ...orderForm, serviceId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {services
                  .filter((s) => s.active)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
            {selectedService?.unit === 'dia' ? (
              <div className="form-group">
                <label htmlFor="o-weight">Dias</label>
                <input
                  id="o-weight"
                  type="number"
                  min="1"
                  max="30"
                  value={orderForm.weightKg}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, weightKg: parseFloat(e.target.value) || 1 })
                  }
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="o-qty">Sessões</label>
                <input
                  id="o-qty"
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, quantity: parseInt(e.target.value, 10) || 1 })
                  }
                />
              </div>
            )}
            <fieldset className="form-fieldset">
              <legend>Extras</legend>
              {(Object.keys(EXTRA_LABELS) as (keyof typeof EXTRA_LABELS)[]).map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={orderForm.extras[key]}
                    onChange={() => toggleExtra(key)}
                  />{' '}
                  {EXTRA_LABELS[key]}
                </label>
              ))}
            </fieldset>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="o-status">Status</label>
                <select
                  id="o-status"
                  value={orderForm.status}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, status: e.target.value as OrderStatus })
                  }
                >
                  {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((st) => (
                    <option key={st} value={st}>
                      {STATUS_LABELS[st]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="o-delivery">Data de check-out</label>
                <input
                  id="o-delivery"
                  type="date"
                  value={orderForm.deliveryDate}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="o-notes">Observações / nome do pet</label>
              <textarea
                id="o-notes"
                rows={2}
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              />
            </div>
            <p className="order-preview-total">
              Total estimado: <strong>{formatCurrency(previewTotal)}</strong>
            </p>
            <div className="modal__actions">
              <button type="button" className="btn btn--outline" onClick={closeOrderForm}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Salvar reserva
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
