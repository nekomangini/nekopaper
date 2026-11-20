<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ImageData } from '../config/images'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'

// Props
interface Props {
  images: ImageData[]
  categoryName: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()

// Sort State — 'newest' is the default, persisted in ?sort= so it is shareable
type SortMode = 'newest' | 'az'

const normalizeSort = (value: unknown): SortMode =>
  value === 'az' ? 'az' : 'newest'

const sortMode = ref<SortMode>(normalizeSort(route.query.sort))

// Back/forward navigation can change ?sort= too
watch(() => route.query.sort, (value) => {
  sortMode.value = normalizeSort(value)
})

const titleOf = (img: ImageData) => img.title
const timeOf = (img: ImageData) =>
  img.addedAt ? new Date(img.addedAt).getTime() : Number.NaN

/** The collection in the selected order — never mutates props.images */
const sortedImages = computed<ImageData[]>(() => {
  const list = [...props.images]

  if (sortMode.value === 'az') {
    return list.sort((a, b) => titleOf(a).localeCompare(titleOf(b)))
  }

  // Newest first; wallpapers without a date sink to the bottom.
  return list.sort((a, b) => {
    const ta = timeOf(a)
    const tb = timeOf(b)
    const aMissing = Number.isNaN(ta)
    const bMissing = Number.isNaN(tb)
    if (aMissing && bMissing) return titleOf(a).localeCompare(titleOf(b))
    if (aMissing) return 1
    if (bMissing) return -1
    if (ta === tb) return titleOf(a).localeCompare(titleOf(b))
    return tb - ta
  })
})

// Pagination State
const itemsPerPage = 12

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedImages.value.length / itemsPerPage)),
)

/**
 * `?page=` comes from the URL, so it is clamped rather than trusted: a hand-typed
 * `?page=999` used to render an empty grid labelled "Page 999 of 17", and negative
 * values sliced from the end of the collection.
 */
const pageFromQuery = (value: unknown): number => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Math.floor(Number(raw))
  if (!Number.isFinite(parsed) || parsed < 1) return 1
  return Math.min(parsed, totalPages.value)
}

const currentPage = ref(pageFromQuery(route.query.page))

/** Switching the ordering always restarts at page 1; keeps every other param. */
const setSort = (mode: SortMode) => {
  sortMode.value = mode
  currentPage.value = 1
  const query: LocationQueryRaw = {}
  for (const [key, value] of Object.entries(route.query)) {
    if (key !== 'page') query[key] = value
  }
  query.sort = mode
  router.push({ query })
}

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedImages.value.slice(start, start + itemsPerPage)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    router.push({ query: { ...route.query, page: page } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch(() => route.query.page, (newPage) => {
  currentPage.value = pageFromQuery(newPage)
})

/** A narrower collection (new search results, shorter category) must not strand the view on a dead page. */
watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total
    router.replace({ query: { ...route.query, page: total } })
  }
})
</script>

<template>
  <div class="category-view">
    <div class="header-section">
      <div class="header-top">
        <div class="header-text">
          <h2>{{ categoryName }}</h2>
          <p class="image-count">Showing {{ paginatedItems.length }} of {{ sortedImages.length }} wallpapers</p>
        </div>

        <div class="sort-toggle" role="group" aria-label="Sort wallpapers">
          <button type="button" :class="{ active: sortMode === 'newest' }"
            :aria-pressed="sortMode === 'newest'" @click="setSort('newest')">
            Newest
          </button>
          <button type="button" :class="{ active: sortMode === 'az' }"
            :aria-pressed="sortMode === 'az'" @click="setSort('az')">
            A–Z
          </button>
        </div>
      </div>
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

.header-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text {
  min-width: 0;
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

/* --- Sort Toggle --- */
.sort-toggle {
  display: flex;
  border: 1px solid var(--green-900);
  background: var(--bg-surface);
  flex-shrink: 0;
}

.sort-toggle button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
}

.sort-toggle button + button {
  border-left: 1px solid var(--green-900);
}

.sort-toggle button:hover {
  color: var(--green-neon);
  text-shadow: 0 0 10px rgba(57, 255, 110, 0.3);
}

.sort-toggle button.active {
  background: rgba(57, 255, 110, 0.08);
  color: var(--green-neon);
  text-shadow: 0 0 10px rgba(57, 255, 110, 0.3);
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

.image-card:hover .card-image-wrapper img {
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

/* --- Responsive --- */
@media (max-width: 768px) {
  .header-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .category-view h2 {
    font-size: 1.6rem;
  }

  .image-count {
    font-size: 0.9rem;
  }

  .sort-toggle button {
    padding: 7px 14px;
    font-size: 0.85rem;
  }
}
</style>
