import { handleSectionNav } from '../utils/scroll'
import { LandingHeader } from '../components/landing/LandingHeader'
import { Hero } from '../components/landing/Hero'
import { About } from '../components/landing/About'
import { Services } from '../components/landing/Services'
import { PriceCalculator } from '../components/landing/PriceCalculator'
import { DeliveryOptions } from '../components/landing/DeliveryOptions'
import { Process } from '../components/landing/Process'
import { Gallery } from '../components/landing/Gallery'
import { Testimonials } from '../components/landing/Testimonials'
import { FAQ } from '../components/landing/FAQ'
import { Contact } from '../components/landing/Contact'
import { LandingFooter } from '../components/landing/LandingFooter'
import { MobileDock } from '../components/landing/MobileDock'

export function LandingPage() {
  return (
    <div className="landing">
      <a
        href="#home"
        className="skip-link"
        onClick={(e) => handleSectionNav(e, 'home')}
      >
        Pular para o conteúdo
      </a>
      <LandingHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <PriceCalculator />
        <DeliveryOptions />
        <Process />
        <Gallery />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <LandingFooter />
      <MobileDock />
    </div>
  )
}
