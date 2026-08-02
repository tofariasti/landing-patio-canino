import { useState } from 'react'
import { AnimatedSection } from '../ui/AnimatedSection'
import { IMAGES } from '../../config/constants'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import {
  buildQuickWhatsAppUrl,
  buildWhatsAppUrl,
  validateContactForm,
  type ContactFormData,
} from '../../utils/whatsapp'

const INITIAL: ContactFormData = {
  nome: '',
  telefone: '',
  email: '',
  servico: '',
  preferencia: '',
  mensagem: '',
}

export function Contact() {
  const { settings, whatsappDigits } = useSiteSettingsContext()
  const [form, setForm] = useState<ContactFormData>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validateContactForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSuccess(false)
      return
    }
    window.open(
      buildWhatsAppUrl(form, {
        whatsappNumber: whatsappDigits,
        storeName: settings.name,
      }),
      '_blank',
      'noopener,noreferrer',
    )
    setSuccess(true)
    setForm(INITIAL)
  }

  const floatSrc = settings.whatsappFloatDataUrl || IMAGES.whatsappFloat
  const floatHref = buildQuickWhatsAppUrl(
    `Olá! Gostaria de informações sobre hospedagem/creche no ${settings.name}.`,
    whatsappDigits,
  )

  return (
    <AnimatedSection className="contact section" id="contato" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div>
          <span className="section-label">Contato</span>
          <h2 className="section-title" id="contact-title">
            Agende sua avaliação e hospedagem
          </h2>
          <p className="section-lead">
            Fale conosco pelo formulário — a mensagem abre direto no WhatsApp.
          </p>

          <div className="contact__info-item">
            <div className="contact__info-icon" aria-hidden="true">
              <span className="contact__pin" />
            </div>
            <div>
              <strong>Endereço</strong>
              <p>
                {settings.address} — {settings.city}
              </p>
            </div>
          </div>
          <div className="contact__info-item">
            <div className="contact__info-icon" aria-hidden="true">
              <span className="contact__phone" />
            </div>
            <div>
              <strong>Telefone</strong>
              <p>{settings.phone}</p>
            </div>
          </div>
          <div className="contact__info-item">
            <div className="contact__info-icon" aria-hidden="true">
              <span className="contact__clock" />
            </div>
            <div>
              <strong>Horário</strong>
              <p>{settings.hours}</p>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          {success && (
            <div className="form-alert" role="alert">
              Mensagem preparada! Complete o envio no WhatsApp.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              required
              aria-invalid={!!errors.nome}
            />
            {errors.nome && (
              <p className="form-error" role="alert">
                {errors.nome}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone / WhatsApp *</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              required
              aria-invalid={!!errors.telefone}
            />
            {errors.telefone && (
              <p className="form-error" role="alert">
                {errors.telefone}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="form-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="servico">Serviço de interesse *</label>
            <select
              id="servico"
              name="servico"
              value={form.servico}
              onChange={handleChange}
              required
              aria-invalid={!!errors.servico}
            >
              <option value="">Selecione...</option>
              <option value="Avaliação de adaptação">Avaliação de adaptação</option>
              <option value="Hospedagem">Hospedagem</option>
              <option value="Creche (day-care)">Creche (day-care)</option>
              <option value="Passeios">Passeios</option>
              <option value="Enriquecimento ambiental">Enriquecimento ambiental</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.servico && (
              <p className="form-error" role="alert">
                {errors.servico}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="preferencia">Como prefere ser atendido? *</label>
            <select
              id="preferencia"
              name="preferencia"
              value={form.preferencia}
              onChange={handleChange}
              required
              aria-invalid={!!errors.preferencia}
            >
              <option value="">Selecione...</option>
              <option value="Visita ao pátio">Visita ao pátio</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Ligação">Ligação</option>
            </select>
            {errors.preferencia && (
              <p className="form-error" role="alert">
                {errors.preferencia}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mensagem">Nome do pet e mensagem</label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={3}
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Ex.: Thor, labrador, 3 anos — hospedagem de 4 dias"
            />
          </div>

          <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
            Enviar via WhatsApp
          </button>
        </form>
      </div>

      <a
        href={floatHref}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <img src={floatSrc} alt="" width={56} height={56} />
      </a>
    </AnimatedSection>
  )
}
