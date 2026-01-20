<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { othersImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Others View Content</p>

    <CategoryGallery :images="othersImages" categoryName="Others" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
