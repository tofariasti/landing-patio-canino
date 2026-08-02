import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { DemoBanner } from '../ui/DemoBanner'
import { STORE } from '../../config/constants'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: '◉', end: true },
  { to: '/app/clientes', label: 'Tutores', icon: '◎' },
  { to: '/app/servicos', label: 'Serviços', icon: '◈' },
  { to: '/app/configuracoes', label: 'Config', icon: '◌' },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <DemoBanner />
      <div className="app-layout">
        <aside className={`app-sidebar${sidebarOpen ? ' is-open' : ''}`} aria-label="Menu do painel">
          <Link to="/" className="app-sidebar__brand">
            Pátio Panel
            <small>{STORE.name}</small>
          </Link>
          <nav className="app-nav" aria-label="Navegação do painel">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
                onClick={() => setSidebarOpen(false)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="app-sidebar__footer">
            <Link to="/" className="btn btn--outline btn--sm sidebar-back-btn">
              ← Voltar ao site
            </Link>
          </div>
        </aside>

        <div className="app-main">
          <button
            type="button"
            className="app-mobile-toggle"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <Outlet />
        </div>
      </div>
    </>
  )
}
