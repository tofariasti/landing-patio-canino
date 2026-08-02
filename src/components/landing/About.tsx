import { AnimatedSection } from '../ui/AnimatedSection'
import { IMAGES, STORE } from '../../config/constants'

export function About() {
  return (
    <AnimatedSection className="about section" id="sobre" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__media">
          <img
            src={IMAGES.about}
            alt="Cães brincando em gramado aberto ao ar livre"
            loading="lazy"
          />
          <div className="about__badge">
            <span>Bem-estar primeiro</span>
            <strong>Livre de gaiolas</strong>
            espaço aberto o dia todo
          </div>
        </div>
        <div className="about__content">
          <span className="section-label">Sobre nós</span>
          <h2 className="section-title" id="about-title">
            Um pátio pensado por e para tutores
          </h2>
          <p className="section-lead">
            Na {STORE.name}, o bem-estar animal é regra: hospedagem sem gaiolas,
            estímulos naturais e profissionais que acompanham cada cão de perto.
          </p>
          <ul className="about__features">
            <li>
              <strong>Supervisão 24h</strong> — monitoramento contínuo e cuidado
              individualizado
            </li>
            <li>
              <strong>Enriquecimento</strong> — energia física e mental com
              treinos e brincadeiras
            </li>
            <li>
              <strong>Comunicação clara</strong> — fotos, vídeos e aviso imediato
              de qualquer alteração
            </li>
            <li>
              <strong>Ambiente familiar</strong> — gramado, sombra e convivência
              supervisionada
            </li>
          </ul>
        </div>
      </div>
    </AnimatedSection>
  )
}
