import { AnimatedSection } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

const BANDS = [
  {
    title: 'Supervisão 24h',
    text: 'Monitoramento em tempo integral com profissionais qualificados, administração de medicamentos e cuidado individualizado.',
    image: IMAGES.process,
    alt: 'Cuidador acompanhando o cão de perto',
    cta: 'Quero me hospedar',
  },
  {
    title: 'Enriquecimento ambiental',
    text: 'Aulas de comandos, treinos de agilidade e gasto de energia física e mental — mais confiança e menos ansiedade.',
    image: IMAGES.gallery4,
    alt: 'Cães em atividade de enriquecimento',
    cta: 'Conhecer a rotina',
  },
  {
    title: 'Playground com grama',
    text: 'Amplo espaço gramado, sombra e estrutura completa para socialização segura ao ar livre.',
    image: IMAGES.delivery,
    alt: 'Área externa gramada para brincadeiras',
    cta: 'Ver o espaço',
  },
]

export function DeliveryOptions() {
  const { whatsappDigits } = useSiteSettingsContext()

  return (
    <AnimatedSection
      className="features-bands"
      id="diferenciais"
      aria-labelledby="delivery-title"
    >
      <div className="container features-bands__intro">
        <span className="section-label">Nosso diferencial</span>
        <h2 className="section-title" id="delivery-title">
          Hospedagem sem gaiolas e estímulos naturais
        </h2>
        <p className="section-lead">
          Ambiente agradável e seguro, com bem-estar animal como prioridade —
          qualidade como regra, sempre.
        </p>
      </div>

      {BANDS.map((band, index) => (
        <div
          key={band.title}
          className={`feature-band${index % 2 === 1 ? ' feature-band--flip' : ''}`}
        >
          <div className="feature-band__media">
            <img src={band.image} alt={band.alt} loading="lazy" />
          </div>
          <div className="feature-band__content">
            <h3>{band.title}</h3>
            <p>{band.text}</p>
            <a
              href={buildQuickWhatsAppUrl(
                `Olá! Quero saber mais sobre: ${band.title}`,
                whatsappDigits,
              )}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {band.cta}
            </a>
          </div>
        </div>
      ))}
    </AnimatedSection>
  )
}
