<script setup lang="ts">
import { gamesImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Games View Content</p>
    <div v-for="(gamesImg, index) in gamesImages" :key="index">
      <img :src="gamesImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
