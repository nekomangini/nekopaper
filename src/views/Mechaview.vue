<script setup lang="ts">
import { mechaImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Mecha View Content</p>
    <div v-for="(mechaImg, index) in mechaImages" :key="index">
      <img :src="mechaImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
