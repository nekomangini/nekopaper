<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ImageData } from '../config/images'
import { useRoute, useRouter } from 'vue-router';

// Props
interface Props {
  images: ImageData[]
  categoryName: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()

// Pagination State
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = 12

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.images.slice(start, end)
})

const totalPages = computed(() => Math.ceil(props.images.length / itemsPerPage))

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    router.push({ query: { ...route.query, page: page } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
})
</script>

<template>
  <div class="category-view">
    <div class="header-section">
      <h2>{{ categoryName }}</h2>
      <p class="image-count">Showing {{ paginatedItems.length }} of {{ images.length }} wallpapers</p>
    </div>

    <div class="image-grid">
      <div v-for="img in paginatedItems" :key="img.slug" class="image-card">
        <RouterLink :to="{
          path: `/${img.category.toLowerCase()}/download/${img.slug}`,
          query: { fromPage: currentPage }
        }" class="image-link">
          <div class="card-image-wrapper">
            <img :src="img.src" :alt="img.title" loading="lazy" />
          </div>
          <p class="image-title">{{ img.title }}</p>
        </RouterLink>
      </div>
    </div>

    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="nav-btn">
          &larr; Prev
        </button>

        <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
          :class="{ active: currentPage === page }">
          {{ page }}
        </button>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="nav-btn">
          Next &rarr;
        </button>
      </div>
      <p class="page-info">Page {{ currentPage }} of {{ totalPages }}</p>
    </div>
  </div>
</template>

<style scoped>
.category-view {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 40px;
}

.category-view h2 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 8px;
  color: var(--green-neon);
  text-shadow: 0 0 20px rgba(57, 255, 110, 0.3);
  letter-spacing: 0.05em;
}

.image-count {
  color: var(--text-dim);
  font-size: 1.1rem;
  letter-spacing: 0.1em;
}

/* --- Grid Logic --- */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 50px;
}

.image-card {
  background: var(--bg-surface);
  border: 1px solid rgba(57, 255, 110, 0.05);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover {
  transform: translateY(-4px);
  border-color: rgba(57, 255, 110, 0.3);
  box-shadow:
    0 0 25px rgba(57, 255, 110, 0.08),
    0 8px 30px rgba(0, 0, 0, 0.5);
}

.image-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* --- Image Zoom Effect --- */
.card-image-wrapper {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: var(--bg-abyss);
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease, filter 0.3s;
  filter: brightness(0.85) saturate(0.9);
}

.image-card:hover img {
  transform: scale(1.08);
  filter: brightness(1) saturate(1);
}

/* --- Title Styling --- */
.image-title {
  padding: 16px;
  margin: 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  background: var(--bg-elevated);
  color: var(--green-300);
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-card:hover .image-title {
  background: var(--green-neon);
  color: var(--bg-abyss);
  text-shadow: none;
}

/* --- Pagination (Doom Theme) --- */
.pagination-container {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pagination {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid var(--green-900);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--green-neon);
  color: var(--green-neon);
  text-shadow: 0 0 10px rgba(57, 255, 110, 0.3);
}

.pagination button.active {
  background: rgba(57, 255, 110, 0.08);
  color: var(--green-neon);
  border-color: var(--green-neon);
  text-shadow: 0 0 10px rgba(57, 255, 110, 0.3);
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-dim);
  font-size: 0.9rem;
}
</style>
