<script setup lang="ts">
import CategoryGallery from '../components/CategoryGallery.vue';
import { abstractImages } from '../config/images'
</script>

<template>
  <div>
    <CategoryGallery :images="abstractImages" categoryName="Abstract" />
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
