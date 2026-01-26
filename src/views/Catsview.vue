<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { catsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <CategoryGallery :images="catsImages" categoryName="Cats" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
