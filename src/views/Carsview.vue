<script setup lang="ts">
import { carsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Cars View Content</p>
    <div v-for="(carsImg, index) in carsImages" :key="index">
      <img :src="carsImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
