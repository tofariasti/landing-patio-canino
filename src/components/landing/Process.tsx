import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'

const STEPS = [
  {
    num: '01',
    title: 'Avaliação',
    description: 'Agende uma visita para conhecer o espaço e alinhar a rotina do seu cão.',
  },
  {
    num: '02',
    title: 'Check-in',
    description: 'Recebemos o pet com ficha de cuidados, medicamentos e preferências.',
  },
  {
    num: '03',
    title: 'Rotina diária',
    description: 'Brincadeiras, descanso, alimentação e enriquecimento sob supervisão.',
  },
  {
    num: '04',
    title: 'Atualizações',
    description: 'Enviamos fotos e vídeos; qualquer alteração é avisada na hora.',
  },
  {
    num: '05',
    title: 'Check-out',
    description: 'Devolvemos seu cão cansado de brincar e com o diário da estadia.',
  },
]

export function Process() {
  return (
    <AnimatedSection className="process section" id="processo" aria-labelledby="process-title">
      <div className="container process__grid">
        <div>
          <span className="section-label">Processo</span>
          <h2 className="section-title" id="process-title">
            Da avaliação ao reencontro
          </h2>
          <p className="section-lead">
            Fluxo transparente do primeiro contato até o check-out — com
            acompanhamento no painel demo ou pelo WhatsApp.
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
        </div>
        <div className="process__image">
          <img
            src={IMAGES.process}
            alt="Tutor recebendo o cão após o dia de creche"
            loading="lazy"
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
