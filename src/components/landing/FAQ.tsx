import { useState } from 'react'
import { AnimatedSection } from '../ui/AnimatedSection'

const FAQ_ITEMS = [
  {
    q: 'A hospedagem é realmente livre de gaiolas?',
    a: 'Sim. Os cães ficam em áreas abertas e internas supervisionadas, com espaços de descanso — sem boxes fechados como regra.',
  },
  {
    q: 'É obrigatória a avaliação antes da primeira estadia?',
    a: 'Sim. A visita de adaptação permite conhecer o temperamento do pet e alinhar rotina, alimentação e cuidados especiais.',
  },
  {
    q: 'Quais vacinas são exigidas?',
    a: 'Vacinas em dia (V10/V8, antirrábica) e controle de pulgas/carrapatos. Enviamos a checklist completa no agendamento.',
  },
  {
    q: 'Vocês administram medicamentos?',
    a: 'Sim, conforme receita e orientações do tutor. Registramos horários e avisamos qualquer alteração.',
  },
  {
    q: 'Como acompanho meu cão durante a estadia?',
    a: 'Enviamos fotos e vídeos da rotina pelo WhatsApp. No painel demo deste site você também visualiza o status da reserva.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <AnimatedSection className="faq section" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-label">FAQ</span>
          <h2 className="section-title" id="faq-title">
            Perguntas frequentes
          </h2>
        </div>
        <div className="faq__list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-panel-${i}`
            return (
              <div key={item.q} className={`faq__item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="faq__icon" aria-hidden="true">
                    +
                  </span>
                </button>
                {isOpen && (
                  <div id={panelId} className="faq__answer" role="region">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}
