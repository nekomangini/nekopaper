<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ImageData } from '../config/images'

// Props
interface Props {
  images: ImageData[]
  categoryName: string
}

const props = defineProps<Props>()

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 12 // Adjusted to 12 for better grid alignment (divisible by 2, 3, and 4)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.images.slice(start, end)
})

const totalPages = computed(() => Math.ceil(props.images.length / itemsPerPage))

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="category-view">
    <div class="header-section">
      <h2>{{ categoryName }}</h2>
      <p class="image-count">Showing {{ paginatedItems.length }} of {{ images.length }} wallpapers</p>
    </div>

    <div class="image-grid">
      <div v-for="img in paginatedItems" :key="img.slug" class="image-card">
        <RouterLink :to="`/${img.category.toLowerCase()}/download/${img.slug}`" class="image-link">
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
  font-size: 2.2rem;
  margin-bottom: 8px;
  color: var(--accent);
  letter-spacing: -0.02em;
}

.image-count {
  color: rgba(var(--accent-light), 0.8);
  font-size: 1.1rem;
}

/* --- Grid Logic (Matches GalleryView) --- */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 50px;
}

.image-card {
  background: rgb(var(--background-light));
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--gray-light), 0.1);
}

.image-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
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
  /* Slightly shorter than category cards for a different feel */
  overflow: hidden;
  background: rgb(var(--black));
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.image-card:hover img {
  transform: scale(1.08);
}

/* --- Title Styling --- */
.image-title {
  padding: 16px;
  margin: 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  background: rgb(var(--gray-dark));
  color: var(--accent);
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-card:hover .image-title {
  background: var(--accent);
  color: rgb(var(--black));
}

/* --- Pagination (Gruvbox Theme) --- */
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
  border: 1.5px solid var(--accent);
  background: rgb(var(--background-light));
  color: var(--accent);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 600;
}

.pagination button:hover:not(:disabled) {
  background: var(--accent);
  color: rgb(var(--black));
}

.pagination button.active {
  background: var(--accent-dark);
  color: rgb(var(--black));
  border-color: var(--accent-dark);
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(var(--gray-light), 0.2);
  color: rgba(var(--gray-light), 0.4);
}

.page-info {
  color: rgba(var(--gray-light), 0.6);
  font-size: 0.9rem;
}
</style>
