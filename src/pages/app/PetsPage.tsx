import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import { usePetsContext } from '../../context/PetsContext'
import type { PetInput, PetSize, PetSex } from '../../types/pet'
import { PET_SEX_LABELS, PET_SIZE_LABELS } from '../../types/pet'
import { MAX_IMAGE_BYTES, readFileAsDataUrl } from '../../utils/files'

const EMPTY: PetInput = {
  customerId: '',
  name: '',
  breed: '',
  size: 'medio',
  sex: 'macho',
  ageYears: 1,
  weightKg: 10,
  vaccinesOk: true,
  neutered: false,
  medications: '',
  temperament: '',
  notes: '',
  photoDataUrl: undefined,
}

export function PetsPage() {
  const { customers } = useCustomersContext()
  const { pets, addPet, updatePet, deletePet } = usePetsContext()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<PetInput>(EMPTY)
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return pets
    return pets.filter((p) => {
      const tutor = customers.find((c) => c.id === p.customerId)
      return (
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q) ||
        (tutor?.name.toLowerCase().includes(q) ?? false)
      )
    })
  }, [pets, customers, search])

  function openModal(petId?: string) {
    setError('')
    setShowModal(true)
    if (petId) {
      const pet = pets.find((p) => p.id === petId)
      if (!pet) return
      setEditingId(petId)
      setForm({
        customerId: pet.customerId,
        name: pet.name,
        breed: pet.breed,
        size: pet.size,
        sex: pet.sex,
        ageYears: pet.ageYears,
        weightKg: pet.weightKg,
        vaccinesOk: pet.vaccinesOk,
        neutered: pet.neutered,
        medications: pet.medications,
        temperament: pet.temperament,
        notes: pet.notes,
        photoDataUrl: pet.photoDataUrl,
      })
    } else {
      setEditingId(null)
      setForm({ ...EMPTY, customerId: customers[0]?.id ?? '' })
    }
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(EMPTY)
    setError('')
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
    if (!form.name.trim()) {
      setError('Nome do pet é obrigatório.')
      return
    }
    if (!form.customerId) {
      setError('Selecione o tutor.')
      return
    }
    if (editingId) updatePet(editingId, form)
    else addPet(form)
    closeModal()
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Pets</h1>
          <p className="app-header__subtitle">
            Fichas dos cães — vacinas, porte e cuidados
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => openModal()}>
          + Novo pet
        </button>
      </header>

      <div className="panel">
        <div className="form-group app-search">
          <label htmlFor="search-pets">Buscar</label>
          <input
            id="search-pets"
            type="search"
            placeholder="Nome, raça ou tutor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="app-empty">Nenhum pet encontrado.</p>
        ) : (
          <div className="pets-grid">
            {filtered.map((pet) => {
              const tutor = customers.find((c) => c.id === pet.customerId)
              return (
                <article key={pet.id} className="pet-card">
                  <div className="pet-card__media">
                    {pet.photoDataUrl ? (
                      <img src={pet.photoDataUrl} alt={pet.name} />
                    ) : (
                      <div className="pet-card__placeholder" aria-hidden="true">
                        {pet.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="pet-card__body">
                    <h3>{pet.name}</h3>
                    <p className="pet-card__meta">
                      {pet.breed} · {PET_SIZE_LABELS[pet.size]} · {PET_SEX_LABELS[pet.sex]}
                    </p>
                    <p className="pet-card__tutor">
                      Tutor:{' '}
                      {tutor ? (
                        <Link to={`/app/clientes/${tutor.id}`}>{tutor.name}</Link>
                      ) : (
                        '—'
                      )}
                    </p>
                    <div className="pet-card__badges">
                      {pet.vaccinesOk && <span className="badge badge--ok">Vacinas OK</span>}
                      {pet.medications && <span className="badge badge--warn">Medicamento</span>}
                      {pet.neutered && <span className="badge">Castrado</span>}
                    </div>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => openModal(pet.id)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => {
                          if (window.confirm(`Excluir ${pet.name}?`)) deletePet(pet.id)
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pet-modal-title">
          <form className="modal modal--wide" onSubmit={handleSubmit}>
            <h2 id="pet-modal-title" className="modal__title">
              {editingId ? 'Editar pet' : 'Novo pet'}
            </h2>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pet-name">Nome *</label>
                <input
                  id="pet-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="pet-tutor">Tutor *</label>
                <select
                  id="pet-tutor"
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pet-breed">Raça</label>
                <input
                  id="pet-breed"
                  value={form.breed}
                  onChange={(e) => setForm({ ...form, breed: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pet-size">Porte</label>
                <select
                  id="pet-size"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value as PetSize })}
                >
                  {(Object.keys(PET_SIZE_LABELS) as PetSize[]).map((key) => (
                    <option key={key} value={key}>
                      {PET_SIZE_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pet-sex">Sexo</label>
                <select
                  id="pet-sex"
                  value={form.sex}
                  onChange={(e) => setForm({ ...form, sex: e.target.value as PetSex })}
                >
                  {(Object.keys(PET_SEX_LABELS) as PetSex[]).map((key) => (
                    <option key={key} value={key}>
                      {PET_SEX_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pet-age">Idade (anos)</label>
                <input
                  id="pet-age"
                  type="number"
                  min={0}
                  max={30}
                  value={form.ageYears}
                  onChange={(e) => setForm({ ...form, ageYears: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pet-weight">Peso (kg)</label>
                <input
                  id="pet-weight"
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="pet-photo">Foto</label>
              <input
                id="pet-photo"
                type="file"
                accept="image/*"
                onChange={(e) => void handlePhoto(e.target.files?.[0] ?? null)}
              />
              {form.photoDataUrl && (
                <img className="upload-preview" src={form.photoDataUrl} alt="Prévia" />
              )}
            </div>
            <div className="form-row">
              <label className="check-inline">
                <input
                  type="checkbox"
                  checked={form.vaccinesOk}
                  onChange={(e) => setForm({ ...form, vaccinesOk: e.target.checked })}
                />
                Vacinas em dia
              </label>
              <label className="check-inline">
                <input
                  type="checkbox"
                  checked={form.neutered}
                  onChange={(e) => setForm({ ...form, neutered: e.target.checked })}
                />
                Castrado(a)
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="pet-meds">Medicamentos</label>
              <textarea
                id="pet-meds"
                rows={2}
                value={form.medications}
                onChange={(e) => setForm({ ...form, medications: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pet-temp">Temperamento</label>
              <input
                id="pet-temp"
                value={form.temperament}
                onChange={(e) => setForm({ ...form, temperament: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pet-notes">Observações</label>
              <textarea
                id="pet-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="modal__actions">
              <button type="button" className="btn btn--outline" onClick={closeModal}>
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
