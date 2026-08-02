import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'

const OPTIONS = [
  {
    title: 'Livre de gaiolas',
    desc: 'Seu cão circula pelo pátio e áreas internas com supervisão — sem boxes fechados.',
  },
  {
    title: 'Playground com grama',
    desc: 'Espaço amplo ao sol e à sombra, pensado para gasto de energia e socialização.',
  },
  {
    title: 'Ambiente familiar',
    desc: 'Rotina acolhedora com atenção individual, carinho e descanso quando precisa.',
  },
  {
    title: 'Aviso imediato',
    desc: 'Qualquer alteração de saúde ou comportamento é comunicada na hora pelo WhatsApp.',
  },
]

export function DeliveryOptions() {
  return (
    <AnimatedSection
      className="delivery section section--foam"
      id="diferenciais"
      aria-labelledby="delivery-title"
    >
      <div className="container delivery__grid">
        <div className="delivery__content">
          <span className="section-label">Nosso diferencial</span>
          <h2 className="section-title" id="delivery-title">
            Bem-estar animal como prioridade
          </h2>
          <p className="section-lead">
            Estrutura e rotina inspiradas no que tutores mais valorizam: liberdade,
            segurança e transparência.
          </p>
          <StaggerGroup as="ul" className="delivery__list">
            {OPTIONS.map((opt) => (
              <StaggerItem key={opt.title} as="li">
                <span className="delivery__icon" aria-hidden="true" />
                <div>
                  <strong>{opt.title}</strong>
                  <p>{opt.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
        <div className="delivery__media">
          <img
            src={IMAGES.delivery}
            alt="Área externa gramada preparada para cães"
            loading="lazy"
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
