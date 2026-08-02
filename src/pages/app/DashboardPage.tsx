import { Link } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import { useServicesContext } from '../../context/ServicesContext'
import { usePetsContext } from '../../context/PetsContext'
import { useCareLogsContext } from '../../context/CareLogsContext'
import { useFinanceContext } from '../../context/FinanceContext'
import { DashboardCharts } from '../../components/app/DashboardCharts'
import { STATUS_LABELS } from '../../types/order'
import { formatCurrency } from '../../utils/pricing'

export function DashboardPage() {
  const { customers } = useCustomersContext()
  const { services } = useServicesContext()
  const { pets } = usePetsContext()
  const { logs } = useCareLogsContext()
  const { summary, transactions } = useFinanceContext()

  const totalOrders = customers.reduce((sum, c) => sum + c.orders.length, 0)
  const toReceive = customers
    .flatMap((c) => c.orders)
    .filter((o) => (o.paymentStatus ?? 'pendente') !== 'pago')
    .reduce((sum, o) => sum + Math.max(0, o.total - (o.paidAmount ?? 0)), 0)

  const inProgress = customers
    .flatMap((c) => c.orders.filter((o) => !['checkout', 'concluido'].includes(o.status)))
    .length

  const medsAlert = pets.filter((p) => p.medications.trim()).length
  const todayLogs = logs.filter((l) => {
    const d = new Date(l.occurredAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

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
          <p className="app-header__subtitle">Operação do hotel e creche</p>
        </div>
        <div className="app-header__actions">
          <Link to="/app/financeiro" className="btn btn--outline btn--sm">
            Financeiro
          </Link>
          <Link to="/app/clientes" className="btn btn--primary btn--sm">
            + Tutor
          </Link>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{pets.length}</div>
          <div className="stat-card__label">Pets cadastrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{inProgress}</div>
          <div className="stat-card__label">Estadias em andamento</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{formatCurrency(summary.monthBalance)}</div>
          <div className="stat-card__label">Saldo do mês</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{formatCurrency(toReceive)}</div>
          <div className="stat-card__label">A receber</div>
        </div>
      </div>

      <DashboardCharts
        customers={customers}
        monthIncome={summary.monthIncome}
        monthExpense={summary.monthExpense}
      />

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Financeiro do mês</h2>
            <Link to="/app/financeiro" className="btn btn--outline btn--sm">
              Abrir
            </Link>
          </div>
          <p className="dashboard-revenue">{formatCurrency(summary.monthIncome)}</p>
          <p className="help-text">
            Receitas · Despesas {formatCurrency(summary.monthExpense)} ·{' '}
            {transactions.length} lançamentos · {totalOrders} reservas ·{' '}
            {activeServices} serviços · {todayLogs || logs.length} rotina
          </p>
          <div className="quick-links">
            <Link to="/app/financeiro">Ver financeiro</Link>
            <Link to="/app/reservas">Ver reservas</Link>
            <Link to="/app/rotina">Ver rotina</Link>
          </div>
        </div>

        <div className="panel panel--alert">
          <div className="panel__header">
            <h2 className="panel__title">Atenção do dia</h2>
          </div>
          <ul className="alert-list">
            <li>{medsAlert} pet(s) com medicamento cadastrado</li>
            <li>{inProgress} estadia(s) em andamento</li>
            <li>{upcomingDeliveries.length} check-out(s) próximos</li>
            <li>{formatCurrency(toReceive)} em aberto com tutores</li>
          </ul>
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Próximos check-outs</h2>
          <Link to="/app/reservas" className="btn btn--outline btn--sm">
            Todas
          </Link>
        </div>
        {upcomingDeliveries.length === 0 ? (
          <p className="app-empty">Nenhum check-out agendado.</p>
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
                    <td>
                      <span className={`status-pill status-pill--${order.status}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{new Date(order.deliveryDate!).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link
                        to={`/app/clientes/${customer.id}`}
                        className="btn btn--outline btn--sm"
                      >
                        Ver
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
