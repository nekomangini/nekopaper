<script setup lang="ts">
import { dogsImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Dogs View Content</p>
    <div v-for="(dogsImg, index) in dogsImages" :key="index">
      <img :src="dogsImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
