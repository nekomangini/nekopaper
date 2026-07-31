<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllCategories, getImagesByCategory } from '../config/images'

interface CategoryCard {
  name: string
  route: string
  src: string
}

const categories = ref<CategoryCard[]>([])

onMounted(() => {
  categories.value = getAllCategories().map(cat => {
    const pool = getImagesByCategory(cat.route)
    const random = pool[Math.floor(Math.random() * pool.length)]
    return {
      name: cat.name,
      route: cat.route,
      src: random?.src || cat.thumbnail
    }
  })
})
</script>

<template>
  <div class="gallery-view">
    <h2>Available Categories</h2>
    <p class="category-count">Browse {{ categories.length }} categories</p>

    <div class="category-grid">
      <router-link v-for="cat in categories" :key="cat.route" :to="`/${cat.route}`" class="category-card">
        <div class="card-image-wrapper">
          <img :src="cat.src" :alt="`${cat.name} category`" loading="lazy" />
        </div>
        <p class="category-name">{{ cat.name }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.gallery-view {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
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

.category-count {
  color: var(--text-dim);
  font-size: 1.2rem;
  margin-bottom: 40px;
  letter-spacing: 0.1em;
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

.category-name {
  padding: 20px;
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  background: var(--bg-elevated);
  color: var(--green-300);
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
}

.category-card:hover .category-name {
  background: var(--green-neon);
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-count {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0 auto 30px auto;
  }
}
</style>
