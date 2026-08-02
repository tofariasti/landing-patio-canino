import { HashRouter, Routes, Route } from 'react-router-dom'
import { useServices } from './hooks/useServices'
import { useCustomers } from './hooks/useCustomers'
import { usePets } from './hooks/usePets'
import { useCareLogs } from './hooks/useCareLogs'
import { useGalleryManager } from './hooks/useGalleryManager'
import { useSiteSettings } from './hooks/useSiteSettings'
import { ServicesContext } from './context/ServicesContext'
import { CustomersContext } from './context/CustomersContext'
import { PetsContext } from './context/PetsContext'
import { CareLogsContext } from './context/CareLogsContext'
import { GalleryContext } from './context/GalleryContext'
import { SiteSettingsContext } from './context/SiteSettingsContext'
import { LandingPage } from './pages/LandingPage'
import { AppLayout } from './components/app/AppLayout'
import { DashboardPage } from './pages/app/DashboardPage'
import { CustomersPage } from './pages/app/CustomersPage'
import { CustomerDetailPage } from './pages/app/CustomerDetailPage'
import { PetsPage } from './pages/app/PetsPage'
import { ReservationsPage } from './pages/app/ReservationsPage'
import { CareLogsPage } from './pages/app/CareLogsPage'
import { GalleryAdminPage } from './pages/app/GalleryAdminPage'
import { ServicesPage } from './pages/app/ServicesPage'
import { SettingsPage } from './pages/app/SettingsPage'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const servicesState = useServices()
  const customersState = useCustomers(servicesState.getService)
  const petsState = usePets()
  const careLogsState = useCareLogs()
  const galleryState = useGalleryManager()
  const siteSettingsState = useSiteSettings()
  useTheme()

  return (
    <SiteSettingsContext.Provider value={siteSettingsState}>
      <ServicesContext.Provider value={servicesState}>
        <CustomersContext.Provider value={customersState}>
          <PetsContext.Provider value={petsState}>
            <CareLogsContext.Provider value={careLogsState}>
              <GalleryContext.Provider value={galleryState}>
                <HashRouter>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/app" element={<AppLayout />}>
                      <Route index element={<DashboardPage />} />
                      <Route path="clientes" element={<CustomersPage />} />
                      <Route path="clientes/:id" element={<CustomerDetailPage />} />
                      <Route path="pets" element={<PetsPage />} />
                      <Route path="reservas" element={<ReservationsPage />} />
                      <Route path="rotina" element={<CareLogsPage />} />
                      <Route path="galeria" element={<GalleryAdminPage />} />
                      <Route path="servicos" element={<ServicesPage />} />
                      <Route path="configuracoes" element={<SettingsPage />} />
                    </Route>
                  </Routes>
                </HashRouter>
              </GalleryContext.Provider>
            </CareLogsContext.Provider>
          </PetsContext.Provider>
        </CustomersContext.Provider>
      </ServicesContext.Provider>
    </SiteSettingsContext.Provider>
  )
}
