import { HashRouter, Routes, Route } from 'react-router-dom'
import { useServices } from './hooks/useServices'
import { useCustomers } from './hooks/useCustomers'
import { ServicesContext } from './context/ServicesContext'
import { CustomersContext } from './context/CustomersContext'
import { LandingPage } from './pages/LandingPage'
import { AppLayout } from './components/app/AppLayout'
import { DashboardPage } from './pages/app/DashboardPage'
import { CustomersPage } from './pages/app/CustomersPage'
import { CustomerDetailPage } from './pages/app/CustomerDetailPage'
import { ServicesPage } from './pages/app/ServicesPage'
import { SettingsPage } from './pages/app/SettingsPage'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const servicesState = useServices()
  const customersState = useCustomers(servicesState.getService)
  useTheme()

  return (
    <ServicesContext.Provider value={servicesState}>
      <CustomersContext.Provider value={customersState}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="clientes" element={<CustomersPage />} />
              <Route path="clientes/:id" element={<CustomerDetailPage />} />
              <Route path="servicos" element={<ServicesPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </CustomersContext.Provider>
    </ServicesContext.Provider>
  )
}
