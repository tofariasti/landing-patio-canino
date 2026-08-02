import { useEffect, useState } from 'react'
import { useServicesContext } from '../../context/ServicesContext'
import { useCustomersContext } from '../../context/CustomersContext'
import { usePetsContext } from '../../context/PetsContext'
import { useCareLogsContext } from '../../context/CareLogsContext'
import { useGalleryContext } from '../../context/GalleryContext'
import { useSiteSettingsContext } from '../../context/SiteSettingsContext'
import { useTheme } from '../../hooks/useTheme'
import type { SiteSettings } from '../../types/siteSettings'
import { MAX_IMAGE_BYTES, readFileAsDataUrl } from '../../utils/files'
import { sanitizeWhatsAppNumber } from '../../hooks/useSiteSettings'

export function SettingsPage() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const { customers, resetCustomers } = useCustomersContext()
  const { services, resetServices } = useServicesContext()
  const { pets, resetPets } = usePetsContext()
  const { logs, resetCareLogs } = useCareLogsContext()
  const { items, resetGallery } = useGalleryContext()
  const { settings, updateSettings, resetSettings, whatsappDigits } =
    useSiteSettingsContext()

  const [form, setForm] = useState<SiteSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(settings)
  }, [settings])

  async function handleLogo(file: File | null, field: 'logoDataUrl' | 'whatsappFloatDataUrl') {
    if (!file) {
      setForm((prev) => ({ ...prev, [field]: '' }))
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file, MAX_IMAGE_BYTES)
      setForm((prev) => ({ ...prev, [field]: dataUrl }))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload.')
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const digits = sanitizeWhatsAppNumber(form.whatsappNumber)
    if (digits.length < 10) {
      setError('Informe um WhatsApp válido com DDD (ex.: 5551999999999).')
      return
    }
    if (!form.name.trim()) {
      setError('Nome da marca é obrigatório.')
      return
    }
    updateSettings({
      ...form,
      name: form.name.trim(),
      whatsappNumber: digits,
    })
    setError('')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  function handleResetAll() {
    if (
      window.confirm(
        'Restaurar dados demo originais? Isso apaga tutores, pets, rotina, galeria, serviços e identidade visual alterados localmente.',
      )
    ) {
      resetCustomers()
      resetServices()
      resetPets()
      resetCareLogs()
      resetGallery()
      resetSettings()
    }
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Configurações</h1>
          <p className="app-header__subtitle">
            Identidade, WhatsApp, redes e preferências do demo
          </p>
        </div>
      </header>

      <form className="panel settings-group" onSubmit={handleSave}>
        <h3>Identidade visual</h3>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {saved && (
          <p className="form-alert" role="status">
            Configurações salvas — já refletem no site e no painel.
          </p>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="set-name">Nome da marca *</label>
            <input
              id="set-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="set-tagline">Slogan</label>
            <input
              id="set-tagline"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>
        </div>

        <div className="brand-uploads">
          <div className="form-group">
            <label htmlFor="set-logo">Logo</label>
            <input
              id="set-logo"
              type="file"
              accept="image/*"
              onChange={(e) => void handleLogo(e.target.files?.[0] ?? null, 'logoDataUrl')}
            />
            <div className="brand-preview">
              {form.logoDataUrl ? (
                <img src={form.logoDataUrl} alt="Prévia do logo" />
              ) : (
                <span className="brand-preview__fallback">{form.name || 'Logo'}</span>
              )}
            </div>
            {form.logoDataUrl && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => setForm({ ...form, logoDataUrl: '' })}
              >
                Remover logo
              </button>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="set-wa-float">Ícone flutuante do WhatsApp</label>
            <input
              id="set-wa-float"
              type="file"
              accept="image/*"
              onChange={(e) =>
                void handleLogo(e.target.files?.[0] ?? null, 'whatsappFloatDataUrl')
              }
            />
            <div className="brand-preview brand-preview--round">
              {form.whatsappFloatDataUrl ? (
                <img src={form.whatsappFloatDataUrl} alt="Prévia WhatsApp" />
              ) : (
                <span className="brand-preview__fallback">WA</span>
              )}
            </div>
            {form.whatsappFloatDataUrl && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => setForm({ ...form, whatsappFloatDataUrl: '' })}
              >
                Usar ícone padrão
              </button>
            )}
          </div>
        </div>

        <h3 className="settings-subtitle">Contato e WhatsApp</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="set-whatsapp">WhatsApp (com DDI) *</label>
            <input
              id="set-whatsapp"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="5551999999999"
              required
            />
            <p className="help-text">
              Atual: {whatsappDigits || '—'} · usado em todos os botões wa.me
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="set-phone">Telefone exibido</label>
            <input
              id="set-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="set-email">E-mail</label>
            <input
              id="set-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="set-hours">Horário</label>
            <input
              id="set-hours"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="set-address">Endereço</label>
            <input
              id="set-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="set-city">Cidade</label>
            <input
              id="set-city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
        </div>

        <h3 className="settings-subtitle">Redes sociais</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="set-ig">Instagram</label>
            <input
              id="set-ig"
              type="url"
              value={form.socials.instagram}
              onChange={(e) =>
                setForm({
                  ...form,
                  socials: { ...form.socials, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/sua_pagina"
            />
          </div>
          <div className="form-group">
            <label htmlFor="set-fb">Facebook</label>
            <input
              id="set-fb"
              type="url"
              value={form.socials.facebook}
              onChange={(e) =>
                setForm({
                  ...form,
                  socials: { ...form.socials, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/sua_pagina"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="set-tt">TikTok</label>
            <input
              id="set-tt"
              type="url"
              value={form.socials.tiktok}
              onChange={(e) =>
                setForm({
                  ...form,
                  socials: { ...form.socials, tiktok: e.target.value },
                })
              }
              placeholder="https://tiktok.com/@sua_pagina"
            />
          </div>
          <div className="form-group">
            <label htmlFor="set-yt">YouTube</label>
            <input
              id="set-yt"
              type="url"
              value={form.socials.youtube}
              onChange={(e) =>
                setForm({
                  ...form,
                  socials: { ...form.socials, youtube: e.target.value },
                })
              }
              placeholder="https://youtube.com/@seu_canal"
            />
          </div>
        </div>

        <div className="modal__actions" style={{ justifyContent: 'flex-start' }}>
          <button type="submit" className="btn btn--primary">
            Salvar identidade
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => {
              if (window.confirm('Restaurar só a identidade visual padrão?')) {
                resetSettings()
              }
            }}
          >
            Restaurar identidade
          </button>
        </div>
      </form>

      <div className="panel settings-group">
        <h3>Tema</h3>
        <div className="theme-toggle" role="group" aria-label="Selecionar tema">
          <button
            type="button"
            className={theme === 'light' ? 'is-active' : ''}
            onClick={() => setTheme('light')}
          >
            Claro
          </button>
          <button
            type="button"
            className={theme === 'dark' ? 'is-active' : ''}
            onClick={() => setTheme('dark')}
          >
            Escuro
          </button>
          <button type="button" onClick={toggleTheme}>
            Alternar
          </button>
        </div>
      </div>

      <div className="panel settings-group">
        <h3>Dados demo</h3>
        <ul className="settings-stats">
          <li>Tutores: {customers.length}</li>
          <li>Pets: {pets.length}</li>
          <li>Serviços: {services.length}</li>
          <li>Registros de rotina: {logs.length}</li>
          <li>Itens de galeria: {items.filter((i) => !i.hidden).length}</li>
        </ul>
        <p className="help-text">
          Todos os dados (incluindo uploads e logo) ficam só no localStorage deste
          navegador.
        </p>
        <button
          type="button"
          className="btn btn--danger"
          onClick={handleResetAll}
          style={{ marginTop: '1rem' }}
        >
          Restaurar dados originais
        </button>
      </div>
    </>
  )
}
