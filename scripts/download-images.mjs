/**
 * Download dog boarding photos from Unsplash.
 * Run: node scripts/download-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/images')

/** @type {Record<string, { slug: string; w?: number; desc: string; unsplashId: string }>} */
const IMAGES = {
  'hero.jpg': {
    slug: '1548199973-03cce0bbc87b',
    unsplashId: 'N04F13EuWvY',
    w: 1600,
    desc: 'Dois cães correndo juntos em gramado aberto',
  },
  'hero-card.jpg': {
    slug: '1552053831-71594a27632d',
    unsplashId: 'ybHtKzNmN6A',
    w: 900,
    desc: 'Golden retriever olhando para a câmera',
  },
  'about.jpg': {
    slug: '1601758228041-f3b2795255f1',
    unsplashId: '2l0CW7YWnDg',
    w: 1200,
    desc: 'Cão brincando ao ar livre',
  },
  'services.jpg': {
    slug: '1530281700549-e82e7bf110d6',
    unsplashId: 'Sg3TlmX7OE',
    w: 1200,
    desc: 'Cão correndo em espaço aberto',
  },
  'process.jpg': {
    slug: '1583511655857-d19b40a7a54e',
    unsplashId: 'Mv9hjnEUHR4',
    w: 1200,
    desc: 'Cão em ambiente acolhedor',
  },
  'delivery.jpg': {
    slug: '1583337130417-3346a1be7dee',
    unsplashId: 'qQWym7I7J2g',
    w: 1200,
    desc: 'Cão feliz em área externa',
  },
  'og-image.jpg': {
    slug: '1544568100-847a948585b9',
    unsplashId: 'N04F13EuWvY',
    w: 1200,
    desc: 'Cão em gramado — imagem OG',
  },
}

function unsplashUrl(slug, w = 1200) {
  return `https://images.unsplash.com/photo-${slug}?w=${w}&q=85&auto=format&fit=crop`
}

await mkdir(outDir, { recursive: true })

const manifest = {}

for (const [filename, { slug, w, desc, unsplashId }] of Object.entries(IMAGES)) {
  const url = unsplashUrl(slug, w)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed ${filename} (${slug}): HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(outDir, filename), buf)
  manifest[filename] = {
    unsplashSlug: slug,
    unsplashId,
    description: desc,
    bytes: buf.length,
  }
  console.log(`✓ ${filename} — ${desc}`)
}

await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log('manifest.json written')
