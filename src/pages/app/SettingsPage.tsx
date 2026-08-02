import { useServicesContext } from '../../context/ServicesContext'
import { useCustomersContext } from '../../context/CustomersContext'
import { useTheme } from '../../hooks/useTheme'

export function SettingsPage() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const { customers, resetCustomers } = useCustomersContext()
  const { services, resetServices } = useServicesContext()

  function handleReset() {
    if (
      window.confirm(
        'Restaurar dados demo originais? Isso apagará tutores e serviços alterados localmente.',
      )
    ) {
      resetCustomers()
      resetServices()
    }
  }

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Configurações</h1>
          <p className="app-header__subtitle">Preferências do modo demonstração</p>
        </div>
      </header>

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
        <p>Tutores atuais: {customers.length}</p>
        <p>Serviços atuais: {services.length}</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Todos os dados são salvos apenas no localStorage deste navegador.
        </p>
        <button type="button" className="btn btn--danger" onClick={handleReset} style={{ marginTop: '1rem' }}>
          Restaurar dados originais
        </button>
      </div>
    </>
  )
}
