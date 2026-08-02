import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'

const SERVICE_CARDS = [
  {
    title: 'Hospedagem',
    desc: 'Estadia livre de gaiolas com supervisão 24h, caminhas confortáveis e rotina familiar.',
    price: 'A partir de R$ 95/dia',
  },
  {
    title: 'Creche (day-care)',
    desc: 'Socialização diária, playground com grama e descanso enquanto você trabalha.',
    price: 'A partir de R$ 65/dia',
  },
  {
    title: 'Passeios',
    desc: 'Caminhadas supervisionadas seguindo as orientações do tutor de cada pet.',
    price: 'A partir de R$ 45/sessão',
  },
  {
    title: 'Enriquecimento ambiental',
    desc: 'Comandos, agilidade e estímulos que reduzem ansiedade e reforçam confiança.',
    price: 'A partir de R$ 55/sessão',
  },
  {
    title: 'Supervisão & medicamentos',
    desc: 'Administração conforme receita, escovação e cuidados pontuais durante a estadia.',
    price: 'Sob consulta',
  },
  {
    title: 'Fotos e vídeos',
    desc: 'Registro da rotina diária enviado pelo WhatsApp para você acompanhar de perto.',
    price: 'Incluso no combo',
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
        <div className="services__header">
          <div>
            <span className="section-label">Serviços</span>
            <h2 className="section-title" id="services-title">
              Cuidado completo para o seu melhor amigo
            </h2>
            <p className="section-lead">
              Hospedagem, creche e passeios em um ambiente aberto, seguro e
              acolhedor — sem gaiolas.
            </p>
          </div>
          <div className="services__image">
            <img
              src={IMAGES.services}
              alt="Cão correndo em área gramada ensolarada"
              loading="lazy"
            />
          </div>
        </div>
        <StaggerGroup className="services__grid">
          {SERVICE_CARDS.map((card) => (
            <StaggerItem key={card.title} as="article" className="service-card">
              <span className="service-card__mark" aria-hidden="true" />
              <h3 className="service-card__title">{card.title}</h3>
              <p className="service-card__desc">{card.desc}</p>
              <p className="service-card__price">{card.price}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </AnimatedSection>
  )
}
