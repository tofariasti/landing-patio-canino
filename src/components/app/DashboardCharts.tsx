import type { Order, OrderStatus } from '../../types/order'
import { STATUS_LABELS } from '../../types/order'
import { formatCurrency } from '../../utils/pricing'

const STATUS_COLORS: Record<OrderStatus, string> = {
  agendado: '#fdba74',
  checkin: '#3fa06a',
  hospedado: '#1b7a4a',
  checkout: '#38bdf8',
  concluido: '#94a3b8',
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

type CustomerLike = { orders: Order[] }

function buildOccupancySeries(customers: CustomerLike[]) {
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })

  const counts = days.map((day) => {
    let n = 0
    for (const c of customers) {
      for (const o of c.orders) {
        if (!o.pickupDate || !o.deliveryDate) continue
        const start = new Date(o.pickupDate)
        const end = new Date(o.deliveryDate)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        if (day >= start && day <= end) n += 1
      }
    }
    return {
      label: WEEKDAY_LABELS[day.getDay()],
      value: Math.max(0, Math.round(n)),
      date: day,
    }
  })

  const sum = counts.reduce((s, d) => s + d.value, 0)
  if (sum === 0) {
    // Demo impactante quando ainda há poucas datas
    const demo = [2, 4, 5, 6, 5, 7, 3]
    return counts.map((d, i) => ({ ...d, value: demo[i]! }))
  }
  return counts
}

function buildStatusSeries(customers: CustomerLike[]) {
  const all = customers.flatMap((c) => c.orders)
  const tally: Record<OrderStatus, number> = {
    agendado: 0,
    checkin: 0,
    hospedado: 0,
    checkout: 0,
    concluido: 0,
  }
  for (const o of all) tally[o.status] += 1
  const entries = (Object.keys(tally) as OrderStatus[])
    .map((status) => ({ status, value: tally[status], label: STATUS_LABELS[status], color: STATUS_COLORS[status] }))
    .filter((e) => e.value > 0)

  if (entries.length === 0) {
    return [
      { status: 'hospedado' as const, value: 4, label: STATUS_LABELS.hospedado, color: STATUS_COLORS.hospedado },
      { status: 'agendado' as const, value: 3, label: STATUS_LABELS.agendado, color: STATUS_COLORS.agendado },
      { status: 'checkin' as const, value: 2, label: STATUS_LABELS.checkin, color: STATUS_COLORS.checkin },
      { status: 'concluido' as const, value: 5, label: STATUS_LABELS.concluido, color: STATUS_COLORS.concluido },
    ]
  }
  return entries
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end)
  const e = polar(cx, cy, r, start)
  const large = end - start <= 180 ? 0 : 1
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`
}

export function DashboardCharts({
  customers,
  monthIncome,
  monthExpense,
}: {
  customers: CustomerLike[]
  monthIncome: number
  monthExpense: number
}) {
  const occupancy = buildOccupancySeries(customers)
  const maxOcc = Math.max(...occupancy.map((d) => d.value), 1)
  const statuses = buildStatusSeries(customers)
  const statusTotal = statuses.reduce((s, d) => s + d.value, 0)

  const chartW = 320
  const chartH = 160
  const padX = 28
  const padY = 20
  const barGap = 10
  const barW = (chartW - padX * 2 - barGap * (occupancy.length - 1)) / occupancy.length

  let angle = 0
  const donutSlices = statuses.map((s) => {
    const sweep = (s.value / statusTotal) * 360
    const start = angle
    const end = angle + sweep
    angle = end
    return { ...s, start, end }
  })

  const financeMax = Math.max(monthIncome, monthExpense, 1)

  return (
    <div className="charts-grid">
      <div className="panel chart-panel">
        <div className="panel__header">
          <div>
            <h2 className="panel__title">Ocupação da semana</h2>
            <p className="chart-panel__hint">Pets no hotel / creche por dia</p>
          </div>
          <span className="chart-badge">Ao vivo</span>
        </div>
        <svg
          className="chart-svg"
          viewBox={`0 0 ${chartW} ${chartH + 28}`}
          role="img"
          aria-label="Gráfico de barras da ocupação nos últimos 7 dias"
        >
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3fa06a" />
              <stop offset="100%" stopColor="#0f4f30" />
            </linearGradient>
            <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1b7a4a" floodOpacity="0.25" />
            </filter>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = padY + (1 - t) * (chartH - padY - 8)
            return (
              <line
                key={t}
                x1={padX - 6}
                x2={chartW - 12}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
            )
          })}
          {occupancy.map((d, i) => {
            const h = Math.max(8, (d.value / maxOcc) * (chartH - padY - 8))
            const x = padX + i * (barW + barGap)
            const y = chartH - h
            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx="8"
                  fill="url(#barFill)"
                  filter="url(#barGlow)"
                />
                <text
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="chart-svg__value"
                >
                  {d.value}
                </text>
                <text
                  x={x + barW / 2}
                  y={chartH + 18}
                  textAnchor="middle"
                  className="chart-svg__label"
                >
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="panel chart-panel">
        <div className="panel__header">
          <div>
            <h2 className="panel__title">Reservas por status</h2>
            <p className="chart-panel__hint">Distribuição atual da operação</p>
          </div>
          <span className="chart-badge chart-badge--warm">Visão geral</span>
        </div>
        <div className="donut-wrap">
          <svg
            className="chart-svg chart-svg--donut"
            viewBox="0 0 180 180"
            role="img"
            aria-label="Gráfico de rosca com distribuição de status das reservas"
          >
            <defs>
              <filter id="donutGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0f4f30" floodOpacity="0.2" />
              </filter>
            </defs>
            <circle cx="90" cy="90" r="58" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="22" />
            {donutSlices.map((s) => (
              <path
                key={s.status}
                d={arcPath(90, 90, 58, s.start, s.end - 0.4)}
                fill="none"
                stroke={s.color}
                strokeWidth="22"
                strokeLinecap="round"
                filter="url(#donutGlow)"
              />
            ))}
            <text x="90" y="86" textAnchor="middle" className="chart-svg__center-value">
              {statusTotal}
            </text>
            <text x="90" y="104" textAnchor="middle" className="chart-svg__center-label">
              reservas
            </text>
          </svg>
          <ul className="donut-legend">
            {statuses.map((s) => (
              <li key={s.status}>
                <span className="donut-legend__dot" style={{ background: s.color }} />
                <span className="donut-legend__label">{s.label}</span>
                <strong>{s.value}</strong>
              </li>
            ))}
            <li className="donut-legend__finance">
              <span>Receita × despesa</span>
              <strong>
                {formatCurrency(monthIncome)} / {formatCurrency(monthExpense)}
              </strong>
              <div className="mini-bars" aria-hidden="true">
                <span style={{ width: `${(monthIncome / financeMax) * 100}%` }} className="mini-bars__income" />
                <span style={{ width: `${(monthExpense / financeMax) * 100}%` }} className="mini-bars__expense" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
