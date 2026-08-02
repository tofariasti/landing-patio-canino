import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import { useServicesContext } from '../../context/ServicesContext'
import { STATUS_LABELS, STATUS_FLOW, type OrderStatus } from '../../types/order'
import { formatCurrency } from '../../utils/pricing'

export function ReservationsPage() {
  const { customers, updateOrder } = useCustomersContext()
  const { services } = useServicesContext()
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    return customers
      .flatMap((c) =>
        c.orders.map((order) => ({
          customer: c,
          order,
          service: services.find((s) => s.id === order.serviceId),
        })),
      )
      .sort((a, b) => (a.order.createdAt < b.order.createdAt ? 1 : -1))
  }, [customers, services])

  const filtered = rows.filter((row) => {
    if (statusFilter !== 'all' && row.order.status !== statusFilter) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      row.customer.name.toLowerCase().includes(q) ||
      (row.service?.name.toLowerCase().includes(q) ?? false) ||
      row.order.notes.toLowerCase().includes(q)
    )
  })

  function advanceStatus(customerId: string, orderId: string, current: OrderStatus) {
    const idx = STATUS_FLOW.indexOf(current)
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return
    const customer = customers.find((c) => c.id === customerId)
    const order = customer?.orders.find((o) => o.id === orderId)
    if (!order) return
    updateOrder(customerId, { ...order, status: STATUS_FLOW[idx + 1]! })
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Reservas</h1>
          <p className="app-header__subtitle">
            Hospedagens e creches em andamento
          </p>
        </div>
        <Link to="/app/clientes" className="btn btn--primary btn--sm">
          + Nova via tutor
        </Link>
      </header>

      <div className="panel">
        <div className="filters-bar">
          <div className="form-group app-search">
            <label htmlFor="search-reservas">Buscar</label>
            <input
              id="search-reservas"
              type="search"
              placeholder="Tutor, serviço ou pet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
            >
              <option value="all">Todos</option>
              {STATUS_FLOW.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="app-empty">Nenhuma reserva encontrada.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Serviço</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Check-out</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ customer, order, service }) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/app/clientes/${customer.id}`}>{customer.name}</Link>
                      {order.notes && (
                        <div className="table-sub">{order.notes}</div>
                      )}
                    </td>
                    <td>{service?.name ?? order.serviceId}</td>
                    <td>
                      <span className={`status-pill status-pill--${order.status}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/app/clientes/${customer.id}`}
                          className="btn btn--outline btn--sm"
                        >
                          Abrir
                        </Link>
                        {order.status !== 'concluido' && (
                          <button
                            type="button"
                            className="btn btn--lawn btn--sm"
                            onClick={() =>
                              advanceStatus(customer.id, order.id, order.status)
                            }
                          >
                            Avançar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
