export interface SiteSocials {
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

export interface SiteSettings {
  name: string
  tagline: string
  city: string
  address: string
  email: string
  phone: string
  hours: string
  /** Digits only, with country code — e.g. 5551991213724 */
  whatsappNumber: string
  logoDataUrl: string
  whatsappFloatDataUrl: string
  socials: SiteSocials
}

export type SiteSettingsInput = SiteSettings
