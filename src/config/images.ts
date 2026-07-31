export interface ImageData {
  src: string
  title: string
  category: string
  slug: string
}

/**
 * Load all images automatically
 */
const imageModules = import.meta.glob(
  '../assets/**/*.{webp,png,jpg,jpeg}',
  { eager: true, import: 'default' }
) as Record<string, string>

/**
 * Convert file paths → ImageData[]
 */
export const images: ImageData[] = Object.entries(imageModules).map(
  ([path, src]) => {
    const parts = path.split('/')
    // category = folder after assets/
    const category = parts[2] || 'unknown'
    // filename without extension
    const filename = parts[parts.length - 1]?.replace(/\.\w+$/, '') || 'unknown'

    const slug = filename.toLocaleLowerCase().replace(/[_-]/g, '-')

    return {
      src,
      title: filename.replace(/[_-]/g, ' '),
      category,
      slug
    }
  }
)

/**
 * Get images by category
 */
export const getImagesByCategory = (category: string): ImageData[] => {
  return images.filter(img => img.category === category.toLowerCase())
}

export const getImageBySlug = (slug: string) => {
  return images.find(img => img.slug === slug)
}

/**
 * Orientation cache — maps src → 'horizontal' | 'vertical' | 'square'
 */
const orientationCache = new Map<string, string>()

function getOrientation(src: string): Promise<string> {
  const cached = orientationCache.get(src)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let orient: string
      if (img.naturalWidth > img.naturalHeight) {
        orient = 'horizontal'
      } else if (img.naturalHeight > img.naturalWidth) {
        orient = 'vertical'
      } else {
        orient = 'square'
      }
      orientationCache.set(src, orient)
      resolve(orient)
    }
    img.onerror = () => {
      orientationCache.set(src, 'unknown')
      resolve('unknown')
    }
    img.src = src
  })
}

/**
 * Search images by query — matches title, category, or orientation
 * Orientation keywords: "horizontal monitor", "vertical monitor", "square display"
 */
export async function searchImages(query: string): Promise<ImageData[]> {
  const q = query.toLowerCase().trim()
  if (!q) return []

  // Check if query is an orientation keyword
  const isOrientationSearch =
    q.includes('horizontal') || q.includes('vertical') || q.includes('square')

  if (isOrientationSearch) {
    let targetOrientation = ''
    if (q.includes('horizontal')) targetOrientation = 'horizontal'
    else if (q.includes('vertical')) targetOrientation = 'vertical'
    else if (q.includes('square')) targetOrientation = 'square'

    // Check all images, load dimensions as needed
    const checks = images.map(async (img) => {
      const orient = await getOrientation(img.src)
      return orient === targetOrientation ? img : null
    })

    const results = await Promise.all(checks)
    return results.filter((r): r is ImageData => r !== null)
  }

  // Normal text search — matches title or category
  return images.filter(
    img => img.title.toLowerCase().includes(q) || img.category.toLowerCase().includes(q)
  )
}

/**
 * Category helpers (computed once on import)
 */
export const abstractImages = images.filter(i => i.category === 'abstract')
export const animeImages = images.filter(i => i.category === 'anime')
export const artsImages = images.filter(i => i.category === 'arts')
export const carsImages = images.filter(i => i.category === 'cars')
export const catsImages = images.filter(i => i.category === 'cats')
export const dogsImages = images.filter(i => i.category === 'dogs')
export const environmentImages = images.filter(i => i.category === 'environment')
export const gamesImages = images.filter(i => i.category === 'games')
export const mechaImages = images.filter(i => i.category === 'mecha')
export const neonImages = images.filter(i => i.category === 'neon')
export const othersImages = images.filter(i => i.category === 'others')
export const spaceImages = images.filter(i => i.category === 'space')

/**
 * Get all categories with metadata
 */
export const getAllCategories = () => {
  const categories = new Set(images.map(img => img.category))
  return Array.from(categories).map(category => {
    const categoryImages = images.filter(img => img.category === category)
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      route: category.toLowerCase(),
      thumbnail: categoryImages[0]?.src || '',
      count: categoryImages.length
    }
  })
}
