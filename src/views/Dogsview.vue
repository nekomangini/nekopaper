<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { dogsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Dogs View Content</p>
    <CategoryGallery :images="dogsImages" categoryName="Dogs" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
