import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from '../ui/AnimatedSection'
import { SEED_SERVICES } from '../../data/seedServices'
import { createDefaultExtras, EXTRA_LABELS } from '../../types/order'
import { CATEGORY_LABELS, UNIT_LABELS } from '../../types/service'
import {
  calculatePriceEstimate,
  formatCurrency,
  validatePriceInput,
  EXTRA_FEES,
} from '../../utils/pricing'
import { buildQuickWhatsAppUrl } from '../../utils/whatsapp'
import { MAX_DAYS, MIN_DAYS, PICKUP_FEE } from '../../config/constants'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'

export function PriceCalculator() {
  const { settings, whatsappDigits } = useSiteSettingsContext()
  const activeServices = useMemo(
    () => SEED_SERVICES.filter((s) => s.active && s.price > 0),
    [],
  )
  const [serviceId, setServiceId] = useState(activeServices[0]?.id ?? '')
  const [weightKg, setWeightKg] = useState(3)
  const [quantity, setQuantity] = useState(1)
  const [extras, setExtras] = useState(createDefaultExtras())
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const service = activeServices.find((s) => s.id === serviceId)
  const estimate = service
    ? calculatePriceEstimate(service, { serviceId, weightKg, quantity, extras })
    : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validatePriceInput(service, weightKg, quantity)
    if (validationError) {
      setError(validationError)
      setSubmitted(false)
      return
    }
    setError(null)
    setSubmitted(true)
  }

  function toggleExtra(key: keyof typeof extras) {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }))
    setSubmitted(false)
  }

  const whatsappText =
    service && estimate
      ? `Olá! Simulei uma estadia no ${settings.name}:\n• ${service.name}\n• ${service.unit === 'dia' ? `${weightKg} dia(s)` : `${quantity} sessão(ões)`}\n• Total estimado: ${formatCurrency(estimate.total)}\n\nGostaria de agendar avaliação.`
      : ''

  return (
    <AnimatedSection
      className="calculator section"
      id="orcamento"
      aria-labelledby="calculator-title"
    >
      <div className="container calculator__inner">
        <div className="calculator__intro">
          <span className="section-label">Ferramenta interativa</span>
          <h2 className="section-title" id="calculator-title">
            Simular estadia
          </h2>
          <p className="section-lead">
            Escolha o serviço, ajuste dias ou sessões e veja o valor estimado em
            tempo real — sem cadastro.
          </p>
        </div>

        <form className="calculator__form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="calc-service">Serviço</label>
            <select
              id="calc-service"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value)
                setSubmitted(false)
              }}
            >
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {CATEGORY_LABELS[s.category]}
                </option>
              ))}
            </select>
          </div>

          {service?.unit === 'dia' ? (
            <div className="form-group">
              <label htmlFor="calc-weight">
                Dias: <strong>{weightKg}</strong>
              </label>
              <input
                id="calc-weight"
                type="range"
                min={MIN_DAYS}
                max={MAX_DAYS}
                value={weightKg}
                onChange={(e) => {
                  setWeightKg(parseInt(e.target.value, 10))
                  setSubmitted(false)
                }}
                aria-valuemin={MIN_DAYS}
                aria-valuemax={MAX_DAYS}
                aria-valuenow={weightKg}
              />
              <div className="range-labels">
                <span>{MIN_DAYS} dia</span>
                <span>{MAX_DAYS} dias</span>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="calc-qty">Quantidade de sessões</label>
              <input
                id="calc-qty"
                type="number"
                min="1"
                max="20"
                value={quantity}
                onChange={(e) => {
                  setQuantity(parseInt(e.target.value, 10) || 1)
                  setSubmitted(false)
                }}
              />
            </div>
          )}

          <fieldset className="calculator__extras">
            <legend>Extras opcionais</legend>
            <label>
              <input
                type="checkbox"
                checked={extras.express}
                onChange={() => toggleExtra('express')}
              />
              {EXTRA_LABELS.express}
            </label>
            <label>
              <input
                type="checkbox"
                checked={extras.perfume}
                onChange={() => toggleExtra('perfume')}
              />
              {EXTRA_LABELS.perfume} (+{formatCurrency(EXTRA_FEES.perfume)})
            </label>
            <label>
              <input
                type="checkbox"
                checked={extras.stainRemoval}
                onChange={() => toggleExtra('stainRemoval')}
              />
              {EXTRA_LABELS.stainRemoval} (+{formatCurrency(EXTRA_FEES.stainRemoval)})
            </label>
            <label>
              <input
                type="checkbox"
                checked={extras.delivery}
                onChange={() => toggleExtra('delivery')}
              />
              {EXTRA_LABELS.delivery} (+{formatCurrency(PICKUP_FEE)})
            </label>
          </fieldset>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary">
            Calcular orçamento
          </button>

          <AnimatePresence mode="wait">
            {submitted && estimate && service && (
              <motion.div
                className="calculator__result"
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3>Estimativa para {service.name}</h3>
                <dl className="calculator__breakdown">
                  <div>
                    <dt>Subtotal ({UNIT_LABELS[service.unit]})</dt>
                    <dd>{formatCurrency(estimate.subtotal)}</dd>
                  </div>
                  {estimate.extrasTotal > 0 && (
                    <div>
                      <dt>Extras</dt>
                      <dd>{formatCurrency(estimate.extrasTotal)}</dd>
                    </div>
                  )}
                  {estimate.deliveryFee > 0 && (
                    <div>
                      <dt>Busca/entrega</dt>
                      <dd>{formatCurrency(estimate.deliveryFee)}</dd>
                    </div>
                  )}
                  <div className="calculator__total-row">
                    <dt>Total estimado</dt>
                    <dd>{formatCurrency(estimate.total)}</dd>
                  </div>
                </dl>
                <a
                  href={buildQuickWhatsAppUrl(whatsappText, whatsappDigits)}
                  className="btn btn--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar via WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </AnimatedSection>
  )
}
