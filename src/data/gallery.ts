const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export type GalleryItemType = 'image' | 'video'

export interface GalleryItem {
  id: string
  type: GalleryItemType
  src: string
  poster?: string
  youtubeId?: string
  alt: string
  caption: string
}

/** Fotos locais + vídeos via YouTube (embed) */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    type: 'image',
    src: asset('images/gallery/gallery-1.jpg'),
    alt: 'Cão feliz ao ar livre no gramado',
    caption: 'Liberdade no gramado',
  },
  {
    id: 'g2',
    type: 'image',
    src: asset('images/gallery/gallery-2.jpg'),
    alt: 'Cão em área verde ensolarada',
    caption: 'Playground com grama',
  },
  {
    id: 'v1',
    type: 'video',
    src: '',
    youtubeId: 'nGeKSiCQkPw',
    poster: asset('images/gallery/gallery-5.jpg'),
    alt: 'Vídeo: cães brincando e interagindo',
    caption: 'Rotina de creche',
  },
  {
    id: 'g3',
    type: 'image',
    src: asset('images/gallery/gallery-3.jpg'),
    alt: 'Momento de carinho com o pet',
    caption: 'Atenção individual',
  },
  {
    id: 'g4',
    type: 'image',
    src: asset('images/gallery/gallery-4.jpg'),
    alt: 'Cão correndo em espaço aberto',
    caption: 'Gasto de energia',
  },
  {
    id: 'v2',
    type: 'video',
    src: '',
    youtubeId: 'jFMA5ggFsXU',
    poster: asset('images/gallery/gallery-6.jpg'),
    alt: 'Vídeo: comandos básicos e enriquecimento',
    caption: 'Enriquecimento e treino',
  },
  {
    id: 'g5',
    type: 'image',
    src: asset('images/gallery/gallery-5.jpg'),
    alt: 'Cão brincando com bola',
    caption: 'Enriquecimento diário',
  },
  {
    id: 'g6',
    type: 'image',
    src: asset('images/gallery/gallery-6.jpg'),
    alt: 'Cão em movimento no pátio',
    caption: 'Espaço livre de gaiolas',
  },
  {
    id: 'g7',
    type: 'image',
    src: asset('images/gallery/gallery-7.jpg'),
    alt: 'Área externa preparada para hospedagem',
    caption: 'Ambiente familiar',
  },
]
