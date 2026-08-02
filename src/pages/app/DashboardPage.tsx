import { Link } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import { useServicesContext } from '../../context/ServicesContext'
import { STATUS_LABELS } from '../../types/order'
import { formatCurrency } from '../../utils/pricing'

export function DashboardPage() {
  const { customers } = useCustomersContext()
  const { services } = useServicesContext()

  const totalOrders = customers.reduce((sum, c) => sum + c.orders.length, 0)
  const revenue = customers
    .flatMap((c) => c.orders)
    .reduce((sum, o) => sum + o.total, 0)

  const inProgress = customers
    .flatMap((c) => c.orders.filter((o) => !['checkout', 'concluido'].includes(o.status)))
    .length

  const upcomingDeliveries = customers
    .flatMap((c) =>
      c.orders
        .filter((o) => o.deliveryDate && o.status !== 'concluido')
        .map((o) => ({ customer: c, order: o })),
    )
    .sort((a, b) => (a.order.deliveryDate! > b.order.deliveryDate! ? 1 : -1))
    .slice(0, 6)

  const activeServices = services.filter((s) => s.active).length

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Dashboard</h1>
          <p className="app-header__subtitle">Visão geral do Pátio Canino demo</p>
        </div>
        <Link to="/app/clientes" className="btn btn--primary btn--sm">
          + Novo tutor
        </Link>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{customers.length}</div>
          <div className="stat-card__label">Tutores ativos</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{totalOrders}</div>
          <div className="stat-card__label">Reservas cadastradas</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{activeServices}</div>
          <div className="stat-card__label">Serviços ativos</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{inProgress}</div>
          <div className="stat-card__label">Em andamento</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Faturamento demo</h2>
        </div>
        <p className="dashboard-revenue">{formatCurrency(revenue)}</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Soma das reservas cadastradas no localStorage.
        </p>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Próximos check-outs</h2>
        </div>
        {upcomingDeliveries.length === 0 ? (
          <p>Nenhum check-out agendado.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Check-out</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDeliveries.map(({ customer, order }) => (
                  <tr key={order.id}>
                    <td>{customer.name}</td>
                    <td>{STATUS_LABELS[order.status]}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{new Date(order.deliveryDate!).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link to={`/app/clientes/${customer.id}`} className="btn btn--outline btn--sm">
                        Ver reserva
                      </Link>
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
