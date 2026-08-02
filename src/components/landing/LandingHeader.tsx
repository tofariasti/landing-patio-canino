import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '../ui/BrandLogo'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { handleSectionNav } from '../../utils/scroll'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

const NAV_LINKS = [
  { id: 'sobre', label: 'Quem somos' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'contato', label: 'Contato' },
]

export function LandingHeader() {
  const { settings, whatsappDigits } = useSiteSettingsContext()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)
  const waUrl = buildQuickWhatsAppUrl(
    `Olá! Quero informações sobre o ${settings.name}.`,
    whatsappDigits,
  )

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
          <BrandLogo variant="header" />
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
          <Link to="/app" className="btn btn--outline btn--sm landing-header__demo">
            Painel
          </Link>
          <a
            href={waUrl}
            className="btn btn--primary btn--sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
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
        <p className="landing-header__mobile-brand">{settings.name}</p>
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
        <a
          href={waUrl}
          className="btn btn--primary"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
        >
          Falar no WhatsApp
        </a>
        <Link to="/app" className="btn btn--outline" onClick={closeMobile}>
          Painel demo
        </Link>
      </nav>
    </header>
  )
}
