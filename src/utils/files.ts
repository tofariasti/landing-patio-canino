/** Lê arquivo como Data URL (demo localStorage). Limite em bytes. */
export function readFileAsDataUrl(file: File, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(
        new Error(
          `Arquivo muito grande (${Math.round(file.size / 1024)} KB). Máximo: ${Math.round(maxBytes / 1024)} KB.`,
        ),
      )
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Falha ao ler o arquivo.'))
    }
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'))
    reader.readAsDataURL(file)
  })
}

export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '')
      return /^[\w-]{11}$/.test(id) ? id : null
    }
    const v = url.searchParams.get('v')
    if (v && /^[\w-]{11}$/.test(v)) return v
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/)
    if (embed) return embed[1]
  } catch {
    return null
  }
  return null
}

export const MAX_IMAGE_BYTES = 900_000
export const MAX_VIDEO_BYTES = 2_500_000
