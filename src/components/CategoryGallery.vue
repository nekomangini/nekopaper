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
const itemsPerPage = 15

// The "Slice" Logic
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.images.slice(start, end)
})

// Calculate total pages
const totalPages = computed(() =>
  Math.ceil(props.images.length / itemsPerPage)
)

// Navigation Methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="category-view">
    <h2>{{ categoryName }} Images</h2>
    <p class="image-count">
      Showing {{ paginatedItems.length }} of {{ images.length }} images
    </p>

    <!-- Image Grid -->
    <div class="image-grid">
      <div v-for="img in paginatedItems" :key="img.src" class="image-item">
        <RouterLink :to="`${img.category}/download/${img.slug}`" class="image-link">
          <img :src="img.src" :alt="img.title" loading="lazy" />
          <p class="image-title">{{ img.title }}</p>
        </RouterLink>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">
        Previous
      </button>

      <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
        {{ page }}
      </button>

      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>

    <!-- Page Info -->
    <p class="page-info">Page {{ currentPage }} of {{ totalPages }}</p>
  </div>
</template>

<style scoped>
.category-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.image-count {
  color: #777;
  margin-bottom: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.image-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.image-title {
  padding: 12px;
  margin: 0;
  text-align: center;
  font-size: 14px;
  background: #f9f9f9;
}

.image-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 0;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.pagination button:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #999;
}

.pagination button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  text-align: center;
  color: #777;
  font-size: 14px;
}
</style>
