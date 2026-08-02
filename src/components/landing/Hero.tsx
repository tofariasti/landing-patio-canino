import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { IMAGES, VIDEOS } from '../../config/constants'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { handleSectionNav } from '../../utils/scroll'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reducedMotion = useReducedMotion()
  const { settings, whatsappDigits } = useSiteSettingsContext()

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
            initial={{ scale: 1.06, opacity: 0.55 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease }}
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
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
          >
            {settings.logoDataUrl ? (
              <img
                className="hero__brand-logo"
                src={settings.logoDataUrl}
                alt={settings.name}
              />
            ) : (
              settings.name
            )}
          </motion.p>
          <motion.h1
            className="hero__title"
            id="hero-title"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease }}
          >
            Segurança, bem-estar e diversão — <em>livre de gaiolas</em>
          </motion.h1>
          <motion.p
            className="hero__subtitle"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease }}
          >
            {settings.tagline} em {settings.city}.
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease }}
          >
            <a
              href={buildQuickWhatsAppUrl(
                `Olá! Quero agendar uma avaliação no ${settings.name}.`,
                whatsappDigits,
              )}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale conosco pelo WhatsApp
            </a>
            <a
              href="#servicos"
              className="btn btn--ghost"
              onClick={(e) => handleSectionNav(e, 'servicos')}
            >
              Ver serviços
            </a>
            <Link to="/app" className="btn btn--outline hero__demo-btn">
              Painel demo
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
