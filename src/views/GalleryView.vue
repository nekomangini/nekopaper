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
  <div class="gallery-view">
    <h2>Available Categories</h2>
    <p class="category-count">Browse {{ images.length }} categories</p>

    <div class="category-grid">
      <router-link v-for="img in images" :key="img.category" :to="`/${img.route}`" class="category-card">
        <img :src="img.src" :alt="`${img.category} category`" loading="lazy" />
        <p class="category-name">{{ img.category }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.gallery-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-view h2 {
  font-size: 28px;
  margin-bottom: 8px;
  color: #333;
}

.category-count {
  color: #777;
  margin-bottom: 30px;
  font-size: 16px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.category-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

.category-name {
  padding: 16px;
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  background: #f9f9f9;
  color: #333;
}

.category-card:hover .category-name {
  background: #007bff;
  color: white;
}
</style>
