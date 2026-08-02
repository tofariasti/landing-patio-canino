import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedSection, StaggerGroup, StaggerItem } from '../ui/AnimatedSection'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GALLERY_ITEMS, type GalleryItem, type GalleryItemType } from '../../data/gallery'

type Filter = 'all' | GalleryItemType

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tudo' },
  { id: 'image', label: 'Fotos' },
  { id: 'video', label: 'Vídeos' },
]

function youtubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  const items = useMemo(() => {
    if (filter === 'all') return GALLERY_ITEMS
    return GALLERY_ITEMS.filter((item) => item.type === filter)
  }, [filter])

  const activeItem = activeIndex != null ? items[activeIndex] : null

  const closeLightbox = useCallback(() => setActiveIndex(null), [])

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i == null ? i : (i - 1 + items.length) % items.length))
  }, [items.length])

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i == null ? i : (i + 1) % items.length))
  }, [items.length])

  useEffect(() => {
    if (activeIndex == null) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [activeIndex, closeLightbox, showPrev, showNext])

  function openItem(item: GalleryItem) {
    const index = items.findIndex((i) => i.id === item.id)
    if (index >= 0) setActiveIndex(index)
  }

  return (
    <AnimatedSection
      className="gallery section section--alt"
      id="galeria"
      aria-labelledby="gallery-title"
    >
      <div className="container">
        <div className="gallery__intro">
          <span className="section-label">Galeria</span>
          <h2 className="section-title" id="gallery-title">
            Um dia no Pátio Canino
          </h2>
          <p className="section-lead">
            Fotos e vídeos da rotina: gramado aberto, brincadeiras e o cuidado que
            seu cão recebe todos os dias.
          </p>

          <div className="gallery__filters" role="group" aria-label="Filtrar galeria">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`gallery__filter${filter === f.id ? ' is-active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => {
                  setFilter(f.id)
                  setActiveIndex(null)
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <StaggerGroup as="ul" className="gallery__grid" key={filter}>
          {items.map((item) => (
            <StaggerItem key={item.id} as="li" className="gallery__item">
              <button
                type="button"
                className="gallery__card"
                onClick={() => openItem(item)}
                aria-label={`Abrir ${item.type === 'video' ? 'vídeo' : 'foto'}: ${item.caption}`}
              >
                <img
                  src={item.type === 'video' ? item.poster : item.src}
                  alt={item.alt}
                  loading="lazy"
                />
                {item.type === 'video' && (
                  <span className="gallery__play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28">
                      <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.88" />
                      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="#fff" />
                    </svg>
                  </span>
                )}
                <span className="gallery__caption">{item.caption}</span>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      <AnimatePresence>
        {activeItem && activeIndex != null && (
          <motion.div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.caption}
            onClick={closeLightbox}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="gallery-lightbox__close"
              aria-label="Fechar"
              onClick={closeLightbox}
            >
              ×
            </button>
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--prev"
              aria-label="Anterior"
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
            >
              ‹
            </button>
            <motion.div
              className="gallery-lightbox__stage"
              onClick={(e) => e.stopPropagation()}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeItem.type === 'video' && activeItem.youtubeId ? (
                <iframe
                  key={activeItem.youtubeId}
                  className="gallery-lightbox__video"
                  src={youtubeEmbedUrl(activeItem.youtubeId)}
                  title={activeItem.alt}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeItem.type === 'video' && activeItem.src ? (
                <video
                  key={activeItem.src}
                  className="gallery-lightbox__video"
                  src={activeItem.src}
                  poster={activeItem.poster}
                  controls
                  autoPlay
                  playsInline
                >
                  Seu navegador não reproduz este vídeo.
                </video>
              ) : (
                <img src={activeItem.src} alt={activeItem.alt} />
              )}
              <p className="gallery-lightbox__caption">
                {activeItem.caption}
                <span>
                  {activeIndex + 1} / {items.length}
                </span>
              </p>
            </motion.div>
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--next"
              aria-label="Próximo"
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  )
}
