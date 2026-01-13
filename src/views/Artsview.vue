<script setup lang="ts">
import { artsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Arts View Content</p>
    <div v-for="(artImg, index) in artsImages" :key="index">
      <img :src="artImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
