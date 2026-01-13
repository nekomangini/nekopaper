<script setup lang="ts">
import { othersImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Others View Content</p>
    <div v-for="(othersImg, index) in othersImages" :key="index">
      <img :src="othersImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
