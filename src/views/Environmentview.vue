<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { environmentImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Environment View Content</p>
    <CategoryGallery :images="environmentImages" categoryName="Environment" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
