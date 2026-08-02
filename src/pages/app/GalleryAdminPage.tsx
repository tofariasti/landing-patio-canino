import { useState } from 'react'
import { useGalleryContext } from '../../context/GalleryContext'
import type { GalleryItemType } from '../../data/gallery'
import {
  extractYoutubeId,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  readFileAsDataUrl,
} from '../../utils/files'

export function GalleryAdminPage() {
  const { items, addItem, removeItem, restoreItem } = useGalleryContext()
  const [error, setError] = useState('')
  const [caption, setCaption] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleUpload(file: File | null, type: GalleryItemType) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const max = type === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
      const dataUrl = await readFileAsDataUrl(file, max)
      addItem({
        type,
        src: dataUrl,
        alt: caption || file.name,
        caption: caption || (type === 'image' ? 'Nova foto' : 'Novo vídeo'),
      })
      setCaption('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload.')
    } finally {
      setBusy(false)
    }
  }

  function handleYoutube(e: React.FormEvent) {
    e.preventDefault()
    const id = extractYoutubeId(youtubeUrl)
    if (!id) {
      setError('Informe um link ou ID válido do YouTube.')
      return
    }
    addItem({
      type: 'video',
      src: '',
      youtubeId: id,
      alt: caption || 'Vídeo do YouTube',
      caption: caption || 'Vídeo da rotina',
    })
    setYoutubeUrl('')
    setCaption('')
    setError('')
  }

  const visible = items.filter((i) => !i.hidden)
  const hidden = items.filter((i) => i.hidden)

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-header__title">Galeria</h1>
          <p className="app-header__subtitle">
            Upload de fotos/vídeos e links do YouTube — refletidos no site demo
          </p>
        </div>
      </header>

      <div className="panel">
        <h2 className="panel__title">Adicionar mídia</h2>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-group">
          <label htmlFor="gal-caption">Legenda</label>
          <input
            id="gal-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ex.: Brincadeira no gramado"
          />
        </div>
        <div className="upload-actions">
          <label className="btn btn--lawn btn--sm upload-btn">
            {busy ? 'Enviando…' : 'Upload foto'}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={busy}
              onChange={(e) => {
                void handleUpload(e.target.files?.[0] ?? null, 'image')
                e.target.value = ''
              }}
            />
          </label>
          <label className="btn btn--outline btn--sm upload-btn">
            Upload vídeo
            <input
              type="file"
              accept="video/*"
              hidden
              disabled={busy}
              onChange={(e) => {
                void handleUpload(e.target.files?.[0] ?? null, 'video')
                e.target.value = ''
              }}
            />
          </label>
        </div>
        <p className="help-text">
          Fotos até ~900 KB · vídeos locais até ~2,5 MB (demo no navegador). Para vídeos
          maiores, use YouTube.
        </p>

        <form className="youtube-form" onSubmit={handleYoutube}>
          <div className="form-group">
            <label htmlFor="yt-url">Ou cole um link do YouTube</label>
            <input
              id="yt-url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <button type="submit" className="btn btn--primary btn--sm">
            Adicionar vídeo
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Itens publicados ({visible.length})</h2>
        </div>
        <div className="gallery-admin-grid">
          {visible.map((item) => (
            <article key={item.id} className="gallery-admin-card">
              <div className="gallery-admin-card__media">
                {item.src.startsWith('data:image') ||
                (item.type === 'image' && item.src) ? (
                  <img src={item.src} alt={item.alt} />
                ) : item.src.startsWith('data:video') ? (
                  <video src={item.src} muted playsInline />
                ) : (
                  <img
                    src={
                      item.poster ||
                      (item.youtubeId
                        ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`
                        : item.src)
                    }
                    alt={item.alt}
                  />
                )}
                <span className="gallery-admin-card__type">
                  {item.type === 'video' ? 'Vídeo' : 'Foto'}
                  {item.source === 'upload' ? ' · upload' : ''}
                </span>
              </div>
              <div className="gallery-admin-card__body">
                <strong>{item.caption}</strong>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  onClick={() => {
                    if (window.confirm('Remover este item da galeria do site?')) {
                      removeItem(item.id)
                    }
                  }}
                >
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {hidden.length > 0 && (
        <div className="panel">
          <h2 className="panel__title">Ocultos ({hidden.length})</h2>
          <ul className="hidden-list">
            {hidden.map((item) => (
              <li key={item.id}>
                <span>{item.caption}</span>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => restoreItem(item.id)}
                >
                  Restaurar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
