<script setup lang="ts">
import { catsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Cats View Content</p>
    <div v-for="(catsImg, index) in catsImages" :key="index">
      <img :src="catsImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
