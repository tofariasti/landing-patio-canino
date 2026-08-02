import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import { useFinanceContext } from '../../context/FinanceContext'
import { useServicesContext } from '../../context/ServicesContext'
import type {
  FinanceCategory,
  FinanceKind,
  FinanceTransactionInput,
  PaymentMethod,
} from '../../types/finance'
import {
  DESPESA_CATEGORIES,
  FINANCE_CATEGORY_LABELS,
  FINANCE_KIND_LABELS,
  PAYMENT_METHOD_LABELS,
  RECEITA_CATEGORIES,
} from '../../types/finance'
import { PAYMENT_STATUS_LABELS, resolvePaymentStatus } from '../../types/order'
import { formatCurrency } from '../../utils/pricing'

const EMPTY: FinanceTransactionInput = {
  kind: 'receita',
  category: 'hospedagem',
  amount: 0,
  method: 'pix',
  description: '',
  occurredAt: new Date().toISOString().slice(0, 16),
}

export function FinancePage() {
  const { transactions, summary, addTransaction, deleteTransaction } = useFinanceContext()
  const { customers, updateOrder } = useCustomersContext()
  const { services } = useServicesContext()

  const [kindFilter, setKindFilter] = useState<'all' | FinanceKind>('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FinanceTransactionInput>(EMPTY)
  const [error, setError] = useState('')
  const [payModal, setPayModal] = useState<{
    customerId: string
    orderId: string
  } | null>(null)
  const [payAmount, setPayAmount] = useState(0)
  const [payMethod, setPayMethod] = useState<PaymentMethod>('pix')

  const filtered = useMemo(() => {
    const list =
      kindFilter === 'all'
        ? transactions
        : transactions.filter((tx) => tx.kind === kindFilter)
    return [...list].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
  }, [transactions, kindFilter])

  const receivables = useMemo(() => {
    return customers
      .flatMap((c) =>
        c.orders
          .filter((o) => (o.paymentStatus ?? 'pendente') !== 'pago')
          .map((o) => ({
            customer: c,
            order: o,
            due: Math.max(0, o.total - (o.paidAmount ?? 0)),
            service: services.find((s) => s.id === o.serviceId),
          })),
      )
      .sort((a, b) => b.due - a.due)
  }, [customers, services])

  const toReceive = receivables.reduce((sum, r) => sum + r.due, 0)

  function openModal(kind: FinanceKind) {
    setForm({
      ...EMPTY,
      kind,
      category: kind === 'receita' ? 'hospedagem' : 'racao',
      occurredAt: new Date().toISOString().slice(0, 16),
    })
    setError('')
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description.trim()) {
      setError('Informe uma descrição.')
      return
    }
    if (form.amount <= 0) {
      setError('Informe um valor válido.')
      return
    }
    addTransaction({
      ...form,
      occurredAt: new Date(form.occurredAt).toISOString(),
    })
    setShowModal(false)
  }

  function openPayModal(customerId: string, orderId: string, due: number) {
    setPayModal({ customerId, orderId })
    setPayAmount(due)
    setPayMethod('pix')
    setError('')
  }

  function confirmPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!payModal) return
    const customer = customers.find((c) => c.id === payModal.customerId)
    const order = customer?.orders.find((o) => o.id === payModal.orderId)
    if (!customer || !order) return
    if (payAmount <= 0) {
      setError('Informe o valor pago.')
      return
    }

    const nextPaid = Math.min(order.total, (order.paidAmount ?? 0) + payAmount)
    const paymentStatus = resolvePaymentStatus(order.total, nextPaid)
    updateOrder(customer.id, {
      ...order,
      paidAmount: nextPaid,
      paymentStatus,
    })

    const svc = services.find((s) => s.id === order.serviceId)
    addTransaction({
      kind: 'receita',
      category:
        svc?.category === 'creche'
          ? 'creche'
          : svc?.category === 'passeio'
            ? 'passeio'
            : svc?.category === 'extra'
              ? 'extra'
              : 'hospedagem',
      amount: payAmount,
      method: payMethod,
      description: `Pagamento reserva — ${customer.name}${order.notes ? ` (${order.notes})` : ''}`,
      occurredAt: new Date().toISOString(),
      customerId: customer.id,
      orderId: order.id,
    })

    setPayModal(null)
  }

  const categories = form.kind === 'receita' ? RECEITA_CATEGORIES : DESPESA_CATEGORIES

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Financeiro</h1>
          <p className="app-header__subtitle">
            Receitas, despesas e pagamentos das reservas
          </p>
        </div>
        <div className="app-header__actions">
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => openModal('despesa')}
          >
            + Despesa
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => openModal('receita')}
          >
            + Receita
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{formatCurrency(summary.monthIncome)}</div>
          <div className="stat-card__label">Receitas do mês</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{formatCurrency(summary.monthExpense)}</div>
          <div className="stat-card__label">Despesas do mês</div>
        </div>
        <div className="stat-card">
          <div
            className={`stat-card__value${summary.monthBalance < 0 ? ' is-negative' : ''}`}
          >
            {formatCurrency(summary.monthBalance)}
          </div>
          <div className="stat-card__label">Saldo do mês</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{formatCurrency(toReceive)}</div>
          <div className="stat-card__label">A receber</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Contas a receber</h2>
        </div>
        {receivables.length === 0 ? (
          <p className="app-empty">Nenhuma reserva com pagamento pendente.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Reserva</th>
                  <th>Status pgto</th>
                  <th>Total</th>
                  <th>Em aberto</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {receivables.map(({ customer, order, due, service }) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/app/clientes/${customer.id}`}>{customer.name}</Link>
                    </td>
                    <td>
                      {service?.name ?? order.serviceId}
                      {order.notes && <div className="table-sub">{order.notes}</div>}
                    </td>
                    <td>
                      <span className={`status-pill status-pill--pay-${order.paymentStatus}`}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus ?? 'pendente']}
                      </span>
                    </td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>{formatCurrency(due)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--lawn btn--sm"
                        onClick={() => openPayModal(customer.id, order.id, due)}
                      >
                        Registrar pgto
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Lançamentos ({filtered.length})</h2>
          <div className="form-group" style={{ margin: 0, minWidth: 160 }}>
            <label htmlFor="fin-filter" className="sr-only">
              Filtrar
            </label>
            <select
              id="fin-filter"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as 'all' | FinanceKind)}
            >
              <option value="all">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="app-empty">Nenhum lançamento encontrado.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Método</th>
                  <th>Valor</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      {new Date(tx.occurredAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span className={`status-pill status-pill--${tx.kind}`}>
                        {FINANCE_KIND_LABELS[tx.kind]}
                      </span>
                    </td>
                    <td>{FINANCE_CATEGORY_LABELS[tx.category]}</td>
                    <td>{tx.description}</td>
                    <td>{PAYMENT_METHOD_LABELS[tx.method]}</td>
                    <td className={tx.kind === 'despesa' ? 'is-negative' : 'is-positive'}>
                      {tx.kind === 'despesa' ? '−' : '+'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => {
                          if (window.confirm('Excluir este lançamento?')) {
                            deleteTransaction(tx.id)
                          }
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="help-text">
          Saldo geral: {formatCurrency(summary.allBalance)} · Receitas{' '}
          {formatCurrency(summary.allIncome)} · Despesas {formatCurrency(summary.allExpense)}
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="fin-modal-title">
          <form className="modal modal--wide" onSubmit={handleSubmit}>
            <h2 id="fin-modal-title" className="modal__title">
              Nova {form.kind === 'receita' ? 'receita' : 'despesa'}
            </h2>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fin-kind">Tipo</label>
                <select
                  id="fin-kind"
                  value={form.kind}
                  onChange={(e) => {
                    const kind = e.target.value as FinanceKind
                    setForm({
                      ...form,
                      kind,
                      category: kind === 'receita' ? 'hospedagem' : 'racao',
                    })
                  }}
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fin-cat">Categoria</label>
                <select
                  id="fin-cat"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as FinanceCategory })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {FINANCE_CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="fin-desc">Descrição *</label>
              <input
                id="fin-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fin-amount">Valor (R$) *</label>
                <input
                  id="fin-amount"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={form.amount || ''}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fin-method">Método</label>
                <select
                  id="fin-method"
                  value={form.method}
                  onChange={(e) =>
                    setForm({ ...form, method: e.target.value as PaymentMethod })
                  }
                >
                  {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                    <option key={m} value={m}>
                      {PAYMENT_METHOD_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="fin-when">Data</label>
                <input
                  id="fin-when"
                  type="datetime-local"
                  value={form.occurredAt}
                  onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
                />
              </div>
            </div>
            <div className="modal__actions">
              <button type="button" className="btn btn--outline" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {payModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pay-modal-title">
          <form className="modal" onSubmit={confirmPayment}>
            <h2 id="pay-modal-title" className="modal__title">
              Registrar pagamento
            </h2>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-group">
              <label htmlFor="pay-amount">Valor recebido (R$)</label>
              <input
                id="pay-amount"
                type="number"
                min={0.01}
                step={0.01}
                value={payAmount || ''}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="pay-method">Método</label>
              <select
                id="pay-method"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
              >
                {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                  <option key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal__actions">
              <button type="button" className="btn btn--outline" onClick={() => setPayModal(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Confirmar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
