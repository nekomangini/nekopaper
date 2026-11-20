<script setup lang="ts">
import { getAllCategories, getImagesByCategory } from '../config/images'
import type { ImageData } from '../config/images'
import RecentAdded from '../components/RecentAdded.vue'

interface CategoryCard {
  name: string
  route: string
  src: string
  count: number
}

/**
 * Newest wallpaper in a category. Picking this instead of a random one keeps the
 * landing page stable across reloads, lets the browser cache the thumbnails, and
 * doubles as a "what's fresh here" preview.
 */
const newestIn = (pool: ImageData[]): ImageData | undefined =>
  pool.reduce<ImageData | undefined>((best, img) => {
    if (!best) return img
    if (!img.addedAt) return best
    return !best.addedAt || img.addedAt > best.addedAt ? img : best
  }, undefined)

/** Biggest collection first, so the grid has a hierarchy instead of a shuffle. */
const categories: CategoryCard[] = getAllCategories()
  .map((cat) => {
    const pool = getImagesByCategory(cat.route)
    return {
      name: cat.name,
      route: cat.route,
      src: newestIn(pool)?.src ?? cat.thumbnail,
      count: cat.count,
    }
  })
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

const totalWallpapers = categories.reduce((sum, cat) => sum + cat.count, 0)
</script>

<template>
  <div class="gallery-view">
    <RecentAdded />

    <section id="categories" class="category-section">
      <h2>Categories</h2>
      <p class="category-meta">
        {{ totalWallpapers }} wallpapers across {{ categories.length }} collections
      </p>

      <div class="category-grid">
        <router-link v-for="cat in categories" :key="cat.route" :to="`/${cat.route}`" class="category-card">
          <div class="card-image-wrapper">
            <img :src="cat.src" :alt="`${cat.name} category`" loading="lazy" />
          </div>
          <div class="category-footer">
            <p class="category-name">{{ cat.name }}</p>
            <span class="category-count">{{ cat.count }}</span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gallery-view {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.category-section {
  scroll-margin-top: 90px;
}

.gallery-view h2 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 2.2rem;
  color: var(--green-neon);
  text-shadow: 0 0 20px rgba(57, 255, 110, 0.3);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.category-meta {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 40px;
  letter-spacing: 0.02em;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.category-card {
  display: block;
  text-decoration: none;
  background: var(--bg-surface);
  border: 1px solid rgba(57, 255, 110, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: rgba(57, 255, 110, 0.3);
  box-shadow:
    0 0 25px rgba(57, 255, 110, 0.08),
    0 8px 30px rgba(0, 0, 0, 0.5);
}

.card-image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: var(--bg-abyss);
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease, filter 0.3s;
  filter: brightness(0.85) saturate(0.9);
}

.category-card:hover img {
  transform: scale(1.05);
  filter: brightness(1) saturate(1);
}

.category-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 20px;
  background: var(--bg-elevated);
  transition: all 0.3s ease;
}

.category-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--green-300);
  letter-spacing: 0.05em;
}

.category-count {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.category-card:hover .category-footer {
  background: var(--green-neon);
}

.category-card:hover .category-name,
.category-card:hover .category-count {
  color: var(--bg-abyss);
  text-shadow: none;
}

/* --- Responsive Text --- */
@media (max-width: 768px) {
  .gallery-view {
    padding: 20px 15px;
  }

  .gallery-view h2 {
    font-size: 1.6rem;
    line-height: 1.2;
  }

  .category-meta {
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
}
</style>
