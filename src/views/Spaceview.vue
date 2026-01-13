<script setup lang="ts">
import { spaceImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Space View Content</p>
    <div v-for="(spaceImg, index) in spaceImages" :key="index">
      <img :src="spaceImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
