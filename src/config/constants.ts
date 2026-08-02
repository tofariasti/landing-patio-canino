export const WHATSAPP_NUMBER = '5551991213724'

export const STORE = {
  name: 'Pátio Canino',
  tagline: 'Hospedagem e creche livre de gaiolas',
  city: 'Porto Alegre, RS',
  address: 'Av. Edgar Píres de Castro, 375 — Hípica',
  email: 'contato@patiocanino.demo',
  phone: '(51) 99121-3724',
  hours: 'Hospedagem 24h · Creche Seg–Sáb 7h–19h',
} as const

export const STORAGE_KEYS = {
  customers: 'patiocanino-demo-customers',
  services: 'patiocanino-demo-services',
  theme: 'patiocanino-demo-theme',
} as const

export const SITE_URL = 'https://tofariasti.github.io/landing-patio-canino/site/'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

/** Fotos locais (Unsplash) — ver public/images/manifest.json */
export const IMAGES = {
  hero: asset('images/hero.jpg'),
  heroCard: asset('images/hero-card.jpg'),
  about: asset('images/about.jpg'),
  services: asset('images/services.jpg'),
  process: asset('images/process.jpg'),
  delivery: asset('images/delivery.jpg'),
  whatsappFloat: asset('images/whatsapp-float.png'),
  og: `${SITE_URL}images/og-image.jpg`,
} as const

export const PRIORITY_MULTIPLIER = 1.5
export const PICKUP_FEE = 20
export const MIN_DAYS = 1
export const MAX_DAYS = 30
