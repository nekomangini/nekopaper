<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchImages, type ImageData } from '../config/images'
import CategoryGallery from '../components/CategoryGallery.vue'

const route = useRoute()
const query = ref(route.query.q as string || '')
const results = ref<ImageData[]>([])

async function doSearch(q: string) {
  if (!q) {
    results.value = []
    return
  }
  results.value = await searchImages(q)
}

watch(() => route.query.q, (q) => {
  query.value = (q as string) || ''
  doSearch(query.value)
}, { immediate: true })
</script>

<template>
  <CategoryGallery v-if="query" :images="results" :categoryName="`Search: ${query}`" />
  <div v-else class="empty-search">
    <p>No search query provided.</p>
  </div>
</template>

<style scoped>
.empty-search {
  padding: 80px 20px;
  text-align: center;
  color: var(--text-dim);
  font-size: 1.1rem;
}
</style>
