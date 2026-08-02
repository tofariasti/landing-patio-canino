import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

const STEPS = [
  {
    num: '01',
    title: 'Avaliação',
    description: 'Visita ao espaço para alinhar temperamento, rotina e necessidades do seu cão.',
  },
  {
    num: '02',
    title: 'Check-in',
    description: 'Recebemos com ficha de cuidados, medicamentos e preferências alimentares.',
  },
  {
    num: '03',
    title: 'Rotina diária',
    description: 'Brincadeiras, descanso, alimentação e enriquecimento sob supervisão.',
  },
  {
    num: '04',
    title: 'Atualizações',
    description: 'Fotos e vídeos pelo WhatsApp; qualquer alteração é avisada na hora.',
  },
]

export function Process() {
  const { settings, whatsappDigits } = useSiteSettingsContext()

  return (
    <AnimatedSection
      className="process section section--lawn"
      id="processo"
      aria-labelledby="process-title"
    >
      <div className="container process__grid">
        <div>
          <span className="section-label">Como funciona</span>
          <h2 className="section-title" id="process-title">
            Da avaliação ao reencontro
          </h2>
          <p className="section-lead">
            Fluxo transparente do primeiro contato ao check-out — com
            acompanhamento próximo e comunicação clara.
          </p>
          <StaggerGroup as="ol" className="process__steps">
            {STEPS.map((step) => (
              <StaggerItem key={step.num} as="li" className="process__step">
                <span className="process__num" aria-hidden="true">
                  {step.num}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <a
            href={buildQuickWhatsAppUrl(
              `Olá! Quero agendar a avaliação no ${settings.name}.`,
              whatsappDigits,
            )}
            className="btn btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar avaliação
          </a>
        </div>
        <div className="process__image">
          <img
            src={IMAGES.heroCard}
            alt="Cão feliz após o dia de creche"
            loading="lazy"
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
