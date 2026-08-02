import { Link, useLocation } from 'react-router-dom'
import { handleSectionNav } from '../../utils/scroll'

const TABS = [
  { id: 'home', label: 'Início', icon: 'home', href: '#home' },
  { id: 'servicos', label: 'Serviços', icon: 'paw', href: '#servicos' },
  { id: 'orcamento', label: 'Simular', icon: 'calc', href: '#orcamento' },
  { id: 'contato', label: 'Contato', icon: 'chat', href: '#contato' },
  { id: 'app', label: 'Painel', icon: 'app', href: '/app', route: true },
] as const

function DockIcon({ name }: { name: string }) {
  if (name === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'paw') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="8" r="2.2" fill="currentColor" />
        <circle cx="16" cy="8" r="2.2" fill="currentColor" />
        <circle cx="6.5" cy="13" r="2" fill="currentColor" />
        <circle cx="17.5" cy="13" r="2" fill="currentColor" />
        <ellipse cx="12" cy="17.5" rx="4.2" ry="3.2" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'calc') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="5"
          y="3"
          width="14"
          height="18"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path d="M8 8h8M8 12h3M13 12h3M8 16h3M13 16h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'chat') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3.5V6.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function MobileDock() {
  const location = useLocation()
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''

  return (
    <nav className="mobile-dock" aria-label="Navegação rápida">
      {TABS.map((tab) => {
        if ('route' in tab && tab.route) {
          const active = location.pathname.startsWith('/app')
          return (
            <Link
              key={tab.id}
              to={tab.href}
              className={`mobile-dock__item${active ? ' is-active' : ''}`}
            >
              <DockIcon name={tab.icon} />
              <span>{tab.label}</span>
            </Link>
          )
        }

        const active = hash === tab.id || (!hash && tab.id === 'home')
        return (
          <a
            key={tab.id}
            href={tab.href}
            className={`mobile-dock__item${active ? ' is-active' : ''}`}
            onClick={(e) => handleSectionNav(e, tab.id)}
          >
            <DockIcon name={tab.icon} />
            <span>{tab.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
