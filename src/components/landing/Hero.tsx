import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FadeIn } from '../ui/AnimatedSection'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { IMAGES, STORE } from '../../config/constants'
import { handleSectionNav } from '../../utils/scroll'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

export function Hero() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <img src={IMAGES.hero} alt="" loading="eager" />
        <div className="hero__overlay" />
        <div className="hero__grain" />
      </div>

      <div className="container hero__content">
        <FadeIn>
          <p className="hero__brand">{STORE.name}</p>
          <h1 className="hero__title" id="hero-title">
            Hospedagem e creche <em>livre de gaiolas</em>
          </h1>
          <p className="hero__subtitle">
            Ambiente seguro, gramado aberto e supervisão 24h para o seu cão se
            sentir em casa em {STORE.city}.
          </p>
          <div className="hero__ctas">
            <a
              href={buildQuickWhatsAppUrl(
                'Olá! Quero agendar uma avaliação no Pátio Canino.',
              )}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar avaliação
            </a>
            <a
              href="#orcamento"
              className="btn btn--ghost"
              onClick={(e) => handleSectionNav(e, 'orcamento')}
            >
              Simular estadia
            </a>
            <Link to="/app" className="btn btn--outline hero__demo-btn">
              Painel demo
            </Link>
          </div>
        </FadeIn>

        <motion.div
          className="hero__visual"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          aria-hidden="true"
        >
          <div className="hero__orb hero__orb--a" />
          <div className="hero__orb hero__orb--b" />
        </motion.div>
      </div>
    </section>
  )
}
