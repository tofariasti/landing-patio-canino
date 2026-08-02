import type { SiteSettings } from '../types/siteSettings'
import { STORE, WHATSAPP_NUMBER } from '../config/constants'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: STORE.name,
  tagline: STORE.tagline,
  city: STORE.city,
  address: STORE.address,
  email: STORE.email,
  phone: STORE.phone,
  hours: STORE.hours,
  whatsappNumber: WHATSAPP_NUMBER,
  logoDataUrl: '',
  whatsappFloatDataUrl: '',
  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: '',
    youtube: '',
  },
}
