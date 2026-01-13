<script setup lang="ts">
import { abstractImages } from '../config/images.ts'
</script>

<template>
  <div>
    <p>Abstract View Content</p>
    <div v-for="(abstractImg, index) in abstractImages" :key="index">
      <img :src="abstractImg.src" alt="">
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
