import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'

const PILLARS = [
  {
    title: 'Missão',
    text: 'Cuidar com carinho e respeito, unindo segurança, socialização e comodidade para as famílias.',
  },
  {
    title: 'Visão',
    text: 'Ser a escolha número um de tutores que não abrem mão de qualidade e de uma vida ativa para o pet.',
  },
  {
    title: 'Valores',
    text: 'Cada cão como parte da família — ambiente saudável, humano e dedicado ao bem-estar.',
  },
]

export function About() {
  const { settings, whatsappDigits } = useSiteSettingsContext()

  return (
    <AnimatedSection className="about section" id="sobre" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__media">
          <img
            src={IMAGES.about}
            alt="Cães brincando em gramado aberto ao ar livre"
            loading="lazy"
          />
        </div>
        <div className="about__content">
          <span className="section-label">Quem somos</span>
          <h2 className="section-title" id="about-title">
            Um pátio criado por e para tutores
          </h2>
          <p className="section-lead">
            Na {settings.name}, o bem-estar animal é regra: hospedagem sem gaiolas,
            estímulos naturais e profissionais que acompanham cada cão de perto —
            com a tranquilidade que você precisa.
          </p>
          <StaggerGroup className="about__pillars">
            {PILLARS.map((item) => (
              <StaggerItem key={item.title} as="article" className="about__pillar">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <a
            href={buildQuickWhatsAppUrl(
              `Olá! Quero conhecer o ${settings.name} e agendar um dia de avaliação.`,
              whatsappDigits,
            )}
            className="btn btn--lawn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar dia de avaliação
          </a>
        </div>
      </div>
    </AnimatedSection>
  )
}
