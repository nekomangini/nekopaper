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
  { src: abstractImg, category: 'Abstract', route: 'abstract' },
  { src: animeImg, category: 'Anime', route: 'anime' },
  { src: artImg, category: 'Arts', route: 'arts' },
  { src: carImg, category: 'Cars', route: 'cars' },
  { src: catImg, category: 'Cats', route: 'cats' },
  { src: dogImg, category: 'Dogs', route: 'dogs' },
  { src: enviromentImg, category: 'Environment', route: 'environment' },
  { src: gameImg, category: 'Games', route: 'games' },
  { src: mechaImg, category: 'Mecha', route: 'mecha' },
  { src: neonImg, category: 'Neon', route: 'neon' },
  { src: otherImg, category: 'Others', route: 'others' },
  { src: spaceImg, category: 'Space', route: 'space' }
]
</script>

<template>
  <div>
    <h2>Available Categories</h2>
    <div>
      <router-link v-for="img in images" :key="img.category" :to="`/${img.route}`">
        <img :src="img.src" :alt="`${img.category} category`" loading="lazy" />
        <p>{{ img.category }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 300px;
}
</style>
