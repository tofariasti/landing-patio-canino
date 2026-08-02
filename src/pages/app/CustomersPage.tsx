import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomersContext } from '../../context/CustomersContext'
import type { CustomerInput } from '../../types/customer'

const EMPTY: CustomerInput = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
}

export function CustomersPage() {
  const { customers, addCustomer, deleteCustomer } = useCustomersContext()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<CustomerInput>(EMPTY)
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q),
    )
  }, [customers, search])

  function openModal() {
    setForm(EMPTY)
    setError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setForm(EMPTY)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Nome é obrigatório.')
      return
    }
    const tutor = addCustomer(form)
    closeModal()
    window.location.hash = `#/app/clientes/${tutor.id}`
  }

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Excluir tutor ${name}?`)) {
      deleteCustomer(id)
    }
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Tutores</h1>
          <p className="app-header__subtitle">
            {customers.length} {customers.length === 1 ? 'cadastrado' : 'cadastrados'}
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--sm" onClick={openModal}>
          + Novo tutor
        </button>
      </header>

      <div className="panel">
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="search-tutors">Buscar</label>
          <input
            id="search-tutors"
            type="search"
            placeholder="Nome, pet, e-mail, telefone ou endereço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>
            {customers.length === 0
              ? 'Nenhum tutor cadastrado. Clique em “Novo tutor” para começar.'
              : 'Nenhum tutor encontrado para esta busca.'}
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Reservas</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.orders.length}</td>
                    <td>{c.address || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/app/clientes/${c.id}`} className="btn btn--outline btn--sm">
                          Abrir
                        </Link>
                        <button
                          type="button"
                          className="btn btn--danger btn--sm"
                          onClick={() => handleDelete(c.id, c.name)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <form className="modal" onSubmit={handleSubmit}>
            <h2 id="modal-title" className="modal__title">
              Novo tutor
            </h2>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-group">
              <label htmlFor="t-name">Nome *</label>
              <input
                id="t-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="t-email">E-mail</label>
              <input
                id="t-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="t-phone">Telefone</label>
              <input
                id="t-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="t-address">Endereço</label>
              <input
                id="t-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="t-notes">Observações / pets</label>
              <textarea
                id="t-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Ex.: Tutora do Max (labrador). Vacinas em dia."
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
