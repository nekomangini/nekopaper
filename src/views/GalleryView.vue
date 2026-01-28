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
        <div class="card-image-wrapper">
          <img :src="img.src" :alt="`${img.category} category`" loading="lazy" />
        </div>
        <p class="category-name">{{ img.category }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.gallery-view {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-view h2 {
  color: var(--accent);
  font-size: 2.2rem;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.category-count {
  color: rgba(var(--accent-light), 0.8);
  font-size: 1.2rem;
  margin-bottom: 40px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.category-card {
  display: block;
  text-decoration: none;
  background: rgb(var(--background-light));
  border-radius: 12px;
  overflow: hidden;
  /* Use your global box-shadow variable */
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--gray-light), 0.1);
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.card-image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.category-card:hover img {
  transform: scale(1.05);
}

.category-name {
  padding: 20px;
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  background: rgb(var(--gray-dark));
  color: var(--accent);
  transition: all 0.3s ease;
}

/* Match the footer/nav hover logic */
.category-card:hover .category-name {
  background: var(--accent);
  color: rgb(var(--black));
}

/* --- Responsive Text --- */
@media (max-width: 768px) {
  .gallery-view {
    padding: 20px 15px;
  }

  .gallery-view h2 {
    font-size: 1.6rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-count {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0 auto 30px auto;
  }
}
</style>
