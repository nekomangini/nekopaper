<script setup lang="ts">
import { environmentImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Environment View Content</p>
    <div v-for="(environmentImg, index) in environmentImages" :key="index">
      <img :src="environmentImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
