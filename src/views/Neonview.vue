<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { neonImages } from '../config/images.ts'
</script>

<template>
  <div>
    <CategoryGallery :images="neonImages" categoryName="Neon" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
