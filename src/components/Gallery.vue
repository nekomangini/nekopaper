<script setup lang="ts">
import abstractImg from '../assets/abstract/radiant/yellow_004.webp'
import animeImg from '../assets/anime/chainsaw-man/makima_001.webp'
import artImg from '../assets/arts/character-art/character_art_027.webp'
import carImg from '../assets/cars/cars_009.webp'
import catImg from '../assets/cats/cats_005.webp'
import dogImg from '../assets/dogs/dogs_001.webp'
import enviromentImg from '../assets/environment/environment_005.webp'
import gameImg from '../assets/games/games_008.webp'
import mechaImg from '../assets/mecha/mecha_001.webp'
import neonImg from '../assets/neon/neon_001.webp'
import otherImg from '../assets/others/others_001.webp'
import spaceImg from '../assets/space/space_002.webp'
const images = [
  {
    src: abstractImg,
    category: 'Abstract',
  },
  {
    src: animeImg,
    category: 'Anime'
  },
  {
    src: artImg,
    category: 'Arts'
  },
  {
    src: carImg,
    category: 'Cars'
  },
  {
    src: catImg,
    category: 'Cats'
  },
  {
    src: dogImg,
    category: 'Dogs'
  },
  {
    src: enviromentImg,
    category: 'Environment'
  },
  {
    src: gameImg,
    category: 'Games'
  },
  {
    src: mechaImg,
    category: 'Mecha'
  },
  {
    src: neonImg,
    category: 'Neon'
  },
  {
    src: otherImg,
    category: 'Others'
  },
  {
    src: spaceImg,
    category: 'Space'
  }
]
</script>
<template>
  <div>
    <h2>Available Categories</h2>
    <!-- <img :src="images[0]?.src" /> -->
    <div v-for="(img, index) in images" :key="index">
      <p>{{ img.category }}</p>
      <img :src="img.src" />
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
