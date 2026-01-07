<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const category = computed(() => {
  const cat = route.params.category as string
  return cat.charAt(0).toUpperCase() + cat.slice(1)
})
</script>

<template>
  <div>
    <h2>{{ category }} Images</h2>
    <p>Displaying images for {{ category }} category</p>
    <!-- You'll add your images grid here later -->
  </div>
</template>
