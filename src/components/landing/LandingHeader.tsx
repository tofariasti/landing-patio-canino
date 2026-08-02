import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { STORE } from '../../config/constants'
import { handleSectionNav } from '../../utils/scroll'

const NAV_LINKS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'orcamento', label: 'Simular' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'processo', label: 'Processo' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contato', label: 'Contato' },
]

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className={`landing-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container landing-header__inner">
        <a
          href="#home"
          className="landing-header__logo"
          onClick={(e) => {
            e.preventDefault()
            handleSectionNav(e, 'home')
          }}
        >
          Pátio <span>Canino</span>
        </a>

        <nav className="landing-header__nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSectionNav(e, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="landing-header__actions">
          <Link to="/app" className="btn btn--outline btn--sm">
            Painel demo
          </Link>
          <button
            type="button"
            className="landing-header__toggle"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="landing-header__toggle-bar" />
            <span className="landing-header__toggle-bar" />
            <span className="landing-header__toggle-bar" />
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`landing-header__mobile${mobileOpen ? ' is-open' : ''}`}
        aria-label="Menu mobile"
      >
        <p className="landing-header__mobile-brand">{STORE.name}</p>
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              handleSectionNav(e, link.id)
              closeMobile()
            }}
          >
            {link.label}
          </a>
        ))}
        <Link to="/app" className="btn btn--primary" onClick={closeMobile}>
          Painel demo
        </Link>
      </nav>
    </header>
  )
}
