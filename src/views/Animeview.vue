<script setup lang="ts">
import { animeImages } from '../config/images';
</script>

<template>
  <div>
    <p>Anime View Content</p>
    <div v-for="(animeImg, index) in animeImages" :key="index">
      <img :src="animeImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
