<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { gamesImages } from '../config/images.ts'
</script>

<template>
  <div>
    <CategoryGallery :images="gamesImages" categoryName="Games" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
