<script setup lang="ts">
import { neonImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Neon View Content</p>
    <div v-for="(NeonImg, index) in neonImages" :key="index">
      <img :src="NeonImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
