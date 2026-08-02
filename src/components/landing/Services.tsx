import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'
import { handleSectionNav } from '../../utils/scroll'

const SERVICE_PANELS = [
  {
    title: 'Hospedagem',
    desc: 'Estadia livre de gaiolas com supervisão 24h e rotina familiar.',
    price: 'A partir de R$ 95/dia',
    image: IMAGES.gallery1,
    alt: 'Cão confortável em ambiente de hospedagem',
  },
  {
    title: 'Creche (day-care)',
    desc: 'Socialização, playground com grama e descanso durante o dia.',
    price: 'A partir de R$ 65/dia',
    image: IMAGES.services,
    alt: 'Cão correndo em área de creche ao ar livre',
  },
  {
    title: 'Enriquecimento',
    desc: 'Comandos, agilidade e estímulos que reforçam confiança.',
    price: 'A partir de R$ 55/sessão',
    image: IMAGES.gallery3,
    alt: 'Atividade de enriquecimento ambiental com cães',
  },
  {
    title: 'Passeios',
    desc: 'Caminhadas supervisionadas conforme a rotina do seu pet.',
    price: 'A partir de R$ 45/sessão',
    image: IMAGES.gallery2,
    alt: 'Cão em passeio supervisionado',
  },
]

export function Services() {
  return (
    <AnimatedSection
      className="services section section--alt"
      id="servicos"
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="services__intro">
          <span className="section-label">Serviços</span>
          <h2 className="section-title" id="services-title">
            O melhor para o seu melhor amigo
          </h2>
          <p className="section-lead">
            Cuidado individual, diversão em grupo e bem-estar em um só lugar —
            sem gaiolas, com estrutura pensada para cães.
          </p>
        </div>

        <StaggerGroup className="services__panels">
          {SERVICE_PANELS.map((panel) => (
            <StaggerItem key={panel.title} as="article" className="service-panel">
              <img src={panel.image} alt={panel.alt} loading="lazy" />
              <div className="service-panel__body">
                <h3>{panel.title}</h3>
                <p>{panel.desc}</p>
                <span>{panel.price}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="services__cta">
          <a
            href="#orcamento"
            className="btn btn--primary"
            onClick={(e) => handleSectionNav(e, 'orcamento')}
          >
            Simular estadia
          </a>
        </div>
      </div>
    </AnimatedSection>
  )
}
