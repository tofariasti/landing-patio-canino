import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { IMAGES, STORE, VIDEOS } from '../../config/constants'
import { handleSectionNav } from '../../utils/scroll'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        {!reducedMotion ? (
          <motion.video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={IMAGES.hero}
            initial={{ scale: 1.08, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease }}
          >
            <source src={VIDEOS.hero} type="video/mp4" />
          </motion.video>
        ) : null}
        <img className="hero__poster" src={IMAGES.hero} alt="" loading="eager" />
        <div className="hero__overlay" />
        <div className="hero__grain" />
      </div>

      <div className="container hero__content">
        <div className="hero__copy">
          <motion.p
            className="hero__brand"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
          >
            {STORE.name}
          </motion.p>
          <motion.h1
            className="hero__title"
            id="hero-title"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease }}
          >
            Hospedagem e creche <em>livre de gaiolas</em>
          </motion.h1>
          <motion.p
            className="hero__subtitle"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32, ease }}
          >
            Ambiente seguro, gramado aberto e supervisão 24h para o seu cão se
            sentir em casa em {STORE.city}.
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease }}
          >
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
          </motion.div>
        </div>

        <motion.div
          className="hero__visual"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          aria-hidden="true"
        >
          <div className="hero__orb hero__orb--a" />
          <div className="hero__orb hero__orb--b" />
        </motion.div>
      </div>
    </section>
  )
}
