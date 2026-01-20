<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { artsImages } from '../config/images'
</script>

<template>
  <div>
    <p>Arts View Content</p>
    <CategoryGallery :images="artsImages" categoryName="Arts" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
