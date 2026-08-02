import { useSiteSettingsContext } from '../../context/SiteSettingsContext'

interface BrandLogoProps {
  className?: string
  /** Prefer image when available; otherwise split name for styled text */
  variant?: 'header' | 'footer' | 'plain'
}

export function BrandLogo({ className = '', variant = 'header' }: BrandLogoProps) {
  const { settings } = useSiteSettingsContext()
  const [first = '', ...rest] = settings.name.trim().split(/\s+/)
  const second = rest.join(' ')

  if (settings.logoDataUrl) {
    return (
      <img
        className={`brand-logo brand-logo--${variant} ${className}`.trim()}
        src={settings.logoDataUrl}
        alt={settings.name}
      />
    )
  }

  if (variant === 'plain') {
    return <span className={className}>{settings.name}</span>
  }

  return (
    <span className={`brand-text brand-text--${variant} ${className}`.trim()}>
      {first}
      {second ? (
        <>
          {' '}
          <span>{second}</span>
        </>
      ) : null}
    </span>
  )
}
