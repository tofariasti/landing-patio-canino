import { STORE } from '../../config/constants'
import { handleSectionNav } from '../../utils/scroll'

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="landing-footer__grid">
          <div>
            <div className="landing-footer__brand">{STORE.name}</div>
            <p>
              {STORE.tagline}
              <br />
              Hotel e creche para cães em {STORE.city}.
            </p>
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
                <a href="#contato" onClick={(e) => handleSectionNav(e, 'contato')}>
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <strong>Horário</strong>
            <p style={{ marginTop: '0.75rem' }}>{STORE.hours}</p>
          </div>
        </div>
        <div className="landing-footer__bottom">
          <span>
            © {new Date().getFullYear()} {STORE.name}. Demo fictícia.
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
