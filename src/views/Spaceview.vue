<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { spaceImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Space View Content</p>

    <CategoryGallery :images="spaceImages" categoryName="Space" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
