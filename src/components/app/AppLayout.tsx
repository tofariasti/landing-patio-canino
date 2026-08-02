import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { DemoBanner } from '../ui/DemoBanner'
import { BrandLogo } from '../ui/BrandLogo'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'

const NAV = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/clientes', label: 'Tutores' },
  { to: '/app/pets', label: 'Pets' },
  { to: '/app/reservas', label: 'Reservas' },
  { to: '/app/rotina', label: 'Rotina' },
  { to: '/app/galeria', label: 'Galeria' },
  { to: '/app/servicos', label: 'Serviços' },
  { to: '/app/configuracoes', label: 'Config' },
]

const MOBILE_TABS = [
  { to: '/app', label: 'Início', end: true },
  { to: '/app/pets', label: 'Pets' },
  { to: '/app/reservas', label: 'Reservas' },
  { to: '/app/galeria', label: 'Galeria' },
  { to: '/app/rotina', label: 'Rotina' },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { settings } = useSiteSettingsContext()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <DemoBanner />
      <div className="app-layout">
        {sidebarOpen && (
          <button
            type="button"
            className="app-backdrop"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`app-sidebar${sidebarOpen ? ' is-open' : ''}`}
          aria-label="Menu do painel"
        >
          <Link to="/" className="app-sidebar__brand">
            {settings.logoDataUrl ? (
              <img
                className="app-sidebar__logo"
                src={settings.logoDataUrl}
                alt={settings.name}
              />
            ) : (
              <>
                Pátio Panel
                <small>{settings.name}</small>
              </>
            )}
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
          <div className="app-topbar">
            <button
              type="button"
              className="app-mobile-toggle"
              aria-label="Abrir menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
            <p className="app-topbar__title">
              <BrandLogo variant="plain" />
            </p>
            <Link to="/app/configuracoes" className="app-topbar__link">
              Config
            </Link>
          </div>
          <div className="app-content">
            <Outlet />
          </div>
        </div>
      </div>

      <nav className="app-bottom-nav" aria-label="Atalhos mobile">
        {MOBILE_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `app-bottom-nav__item${isActive ? ' is-active' : ''}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
