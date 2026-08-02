import { BrandLogo } from '../ui/BrandLogo'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { handleSectionNav } from '../../utils/scroll'

export function LandingFooter() {
  const { settings } = useSiteSettingsContext()
  const socialEntries = [
    { key: 'instagram', label: 'Instagram', href: settings.socials.instagram },
    { key: 'facebook', label: 'Facebook', href: settings.socials.facebook },
    { key: 'tiktok', label: 'TikTok', href: settings.socials.tiktok },
    { key: 'youtube', label: 'YouTube', href: settings.socials.youtube },
  ].filter((item) => item.href.trim())

  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="landing-footer__grid">
          <div>
            <div className="landing-footer__brand">
              <BrandLogo variant="footer" />
            </div>
            <p>
              {settings.tagline}
              <br />
              Hotel e creche livre de gaiolas em {settings.city}.
            </p>
            {socialEntries.length > 0 && (
              <ul className="footer-socials">
                {socialEntries.map((item) => (
                  <li key={item.key}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <strong>Links rápidos</strong>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem' }}>
              <li>
                <a href="#sobre" onClick={(e) => handleSectionNav(e, 'sobre')}>
                  Sobre
                </a>
              </li>
              <li>
                <a href="#orcamento" onClick={(e) => handleSectionNav(e, 'orcamento')}>
                  Simular estadia
                </a>
              </li>
              <li>
                <a href="#galeria" onClick={(e) => handleSectionNav(e, 'galeria')}>
                  Galeria
                </a>
              </li>
              <li>
                <a href="#contato" onClick={(e) => handleSectionNav(e, 'contato')}>
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <strong>Horário</strong>
            <p style={{ marginTop: '0.75rem' }}>{settings.hours}</p>
            <p style={{ marginTop: '0.5rem' }}>{settings.phone}</p>
            <p style={{ marginTop: '0.35rem' }}>{settings.email}</p>
          </div>
        </div>
        <div className="landing-footer__bottom">
          <span>
            © {new Date().getFullYear()} {settings.name}. Demo fictícia.
          </span>
          <span>
            Desenvolvido por{' '}
            <a href="https://fariasdigital.com.br/" target="_blank" rel="noopener noreferrer">
              Farias Digital
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
