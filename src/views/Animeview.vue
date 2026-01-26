<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { animeImages } from '../config/images';
</script>

<template>
  <div>
    <CategoryGallery :images="animeImages" categoryName="Anime" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
