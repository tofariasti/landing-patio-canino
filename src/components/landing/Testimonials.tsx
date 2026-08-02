import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'

const TESTIMONIALS = [
  {
    name: 'Patrícia Lima',
    role: 'Tutora do Max · Tristeza',
    text: 'Hospedei o Max por 5 dias sem gaiola. Recebi fotos todos os dias e ele voltou feliz.',
    rating: 5,
  },
  {
    name: 'Diego Martins',
    role: 'Tutor da Luna · Hípica',
    text: 'A creche salvou minha rotina de trabalho. Ambiente limpo, gramado e equipe atenta.',
    rating: 5,
  },
  {
    name: 'Ana Beatriz',
    role: 'Tutora do Bob · Cristal',
    text: 'Bob precisa de medicamento e eles seguiram a receita à risca. Confiança total.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <AnimatedSection
      className="testimonials section section--alt"
      id="depoimentos"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-label">Depoimentos</span>
          <h2 className="section-title" id="testimonials-title">
            Semeamos amor — e os tutores comprovam
          </h2>
        </div>
        <StaggerGroup className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name} as="blockquote" className="testimonial-card">
              <div
                className="testimonial-card__stars"
                aria-label={`${t.rating} de 5 estrelas`}
              >
                {'★'.repeat(t.rating)}
              </div>
              <p>&ldquo;{t.text}&rdquo;</p>
              <footer>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </footer>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </AnimatedSection>
  )
}
