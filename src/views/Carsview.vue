<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { carsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <CategoryGallery :images="carsImages" categoryName="Cars" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
