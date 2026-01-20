<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { mechaImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Mecha View Content</p>
    <CategoryGallery :images="mechaImages" categoryName="Mecha" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
