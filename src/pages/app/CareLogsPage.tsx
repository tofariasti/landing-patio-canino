import { useMemo, useState } from 'react'
import { useCustomersContext } from '../../context/CustomersContext'
import { usePetsContext } from '../../context/PetsContext'
import { useCareLogsContext } from '../../context/CareLogsContext'
import type { CareLogInput, CareLogType } from '../../types/careLog'
import { CARE_LOG_LABELS } from '../../types/careLog'
import { MAX_IMAGE_BYTES, readFileAsDataUrl } from '../../utils/files'

const EMPTY: CareLogInput = {
  petId: '',
  customerId: '',
  type: 'observacao',
  title: '',
  notes: '',
  occurredAt: new Date().toISOString().slice(0, 16),
  photoDataUrl: undefined,
}

export function CareLogsPage() {
  const { customers } = useCustomersContext()
  const { pets } = usePetsContext()
  const { logs, addLog, deleteLog } = useCareLogsContext()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<CareLogInput>(EMPTY)
  const [error, setError] = useState('')
  const [petFilter, setPetFilter] = useState('all')

  const filtered = useMemo(() => {
    if (petFilter === 'all') return logs
    return logs.filter((l) => l.petId === petFilter)
  }, [logs, petFilter])

  function openModal() {
    const firstPet = pets[0]
    setForm({
      ...EMPTY,
      petId: firstPet?.id ?? '',
      customerId: firstPet?.customerId ?? '',
      occurredAt: new Date().toISOString().slice(0, 16),
    })
    setError('')
    setShowModal(true)
  }

  async function handlePhoto(file: File | null) {
    if (!file) {
      setForm((prev) => ({ ...prev, photoDataUrl: undefined }))
      return
    }
    try {
      const dataUrl = await readFileAsDataUrl(file, MAX_IMAGE_BYTES)
      setForm((prev) => ({ ...prev, photoDataUrl: dataUrl }))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload.')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.petId) {
      setError('Selecione o pet.')
      return
    }
    if (!form.title.trim()) {
      setError('Informe um título.')
      return
    }
    const pet = pets.find((p) => p.id === form.petId)
    addLog({
      ...form,
      customerId: pet?.customerId ?? form.customerId,
      occurredAt: new Date(form.occurredAt).toISOString(),
    })
    setShowModal(false)
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Rotina</h1>
          <p className="app-header__subtitle">
            Alimentação, passeios, medicamentos e observações do dia
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={openModal}>
          + Novo registro
        </button>
      </header>

      <div className="panel">
        <div className="form-group" style={{ maxWidth: 280 }}>
          <label htmlFor="filter-pet">Filtrar por pet</label>
          <select
            id="filter-pet"
            value={petFilter}
            onChange={(e) => setPetFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="app-empty">Nenhum registro de rotina.</p>
        ) : (
          <div className="care-timeline">
            {filtered.map((log) => {
              const pet = pets.find((p) => p.id === log.petId)
              const tutor = customers.find((c) => c.id === log.customerId)
              return (
                <article key={log.id} className="care-card">
                  <div className="care-card__top">
                    <span className={`care-tag care-tag--${log.type}`}>
                      {CARE_LOG_LABELS[log.type]}
                    </span>
                    <time dateTime={log.occurredAt}>
                      {new Date(log.occurredAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                  <h3>{log.title}</h3>
                  <p className="care-card__meta">
                    {pet?.name ?? 'Pet'} · {tutor?.name ?? 'Tutor'}
                  </p>
                  {log.notes && <p>{log.notes}</p>}
                  {log.photoDataUrl && (
                    <img className="care-card__photo" src={log.photoDataUrl} alt="" />
                  )}
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => {
                      if (window.confirm('Excluir este registro?')) deleteLog(log.id)
                    }}
                  >
                    Excluir
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="care-modal-title">
          <form className="modal modal--wide" onSubmit={handleSubmit}>
            <h2 id="care-modal-title" className="modal__title">
              Novo registro de rotina
            </h2>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="care-pet">Pet *</label>
                <select
                  id="care-pet"
                  value={form.petId}
                  onChange={(e) => {
                    const pet = pets.find((p) => p.id === e.target.value)
                    setForm({
                      ...form,
                      petId: e.target.value,
                      customerId: pet?.customerId ?? '',
                    })
                  }}
                  required
                >
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="care-type">Tipo</label>
                <select
                  id="care-type"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as CareLogType })
                  }
                >
                  {(Object.keys(CARE_LOG_LABELS) as CareLogType[]).map((key) => (
                    <option key={key} value={key}>
                      {CARE_LOG_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="care-title">Título *</label>
              <input
                id="care-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="care-when">Quando</label>
              <input
                id="care-when"
                type="datetime-local"
                value={form.occurredAt}
                onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="care-notes">Detalhes</label>
              <textarea
                id="care-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="care-photo">Foto (opcional)</label>
              <input
                id="care-photo"
                type="file"
                accept="image/*"
                onChange={(e) => void handlePhoto(e.target.files?.[0] ?? null)}
              />
              {form.photoDataUrl && (
                <img className="upload-preview" src={form.photoDataUrl} alt="Prévia" />
              )}
            </div>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
