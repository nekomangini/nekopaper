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
