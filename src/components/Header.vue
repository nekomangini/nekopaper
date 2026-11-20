<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { images, getAllCategories } from '../config/images'

const route = useRoute()

/**
 * The full hero (stats, CTAs, artwork backdrop) is the landing page's job. Every
 * other route has its own heading, so it only gets the compact brand strip.
 */
const isHome = computed(() => route.path === '/')

const total = images.length
const categoryCount = getAllCategories().length

/** Newest first — same ordering rule as RecentAdded and the changelog. */
const newest = computed(() =>
  images
    .filter((img) => img.addedAt)
    .sort((a, b) => (b.addedAt! < a.addedAt! ? -1 : b.addedAt! > a.addedAt! ? 1 : 0)),
)

const backdrop = computed(() => newest.value.slice(0, 4))

/** Commit-local day, parsed at local midnight — matches the changelog and the feed. */
const latestDate = computed(() => {
  const iso = newest.value[0]?.addedAt
  if (!iso) return ''
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

/** "Surprise me" — deliberately a fresh random pick on every visit. */
const surprise = computed(() => {
  const pick = images[Math.floor(Math.random() * images.length)]
  return pick ? `/${pick.category.toLowerCase()}/download/${pick.slug}` : '/'
})
</script>

<template>
  <section class="hero" :class="{ 'hero--compact': !isHome }">
    <div v-if="isHome && backdrop.length" class="hero-backdrop" aria-hidden="true">
      <img v-for="img in backdrop" :key="img.slug" :src="img.src" alt="" />
    </div>

    <div class="hero-content">
      <h1 class="hero-title">ネコpaper</h1>
      <p class="hero-sub">My Personal Aesthetic Collection of Wallpapers</p>

      <template v-if="isHome">
        <p class="hero-stats">
          {{ total }} wallpapers · {{ categoryCount }} categories<template v-if="latestDate">
            · updated {{ latestDate }}</template>
        </p>

        <div class="hero-actions">
          <a href="#categories" class="hero-btn hero-btn--primary">Browse categories &darr;</a>
          <RouterLink :to="surprise" class="hero-btn">Surprise me</RouterLink>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 38vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 2rem 2.5rem;
}

/* Latest artwork, blurred behind the title so the fold is not empty terminal space */
.hero-backdrop {
  position: absolute;
  inset: -8%;
  z-index: -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* Without an explicit row the grid sized itself from the image aspect ratio
     (~250px), so only a thin strip at the top of the hero got any artwork. */
  grid-template-rows: 100%;
  gap: 6px;
  filter: blur(26px) brightness(0.5) saturate(1.05);
  transform: scale(1.06);
  opacity: 0.85;
  mask-image: radial-gradient(ellipse 85% 95% at 50% 42%, #000 30%, transparent 88%);
  -webkit-mask-image: radial-gradient(ellipse 85% 95% at 50% 42%, #000 30%, transparent 88%);
}

.hero-backdrop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-content {
  position: relative;
}

.hero-title {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: 0.08em;
  line-height: 1;
  color: var(--green-neon);
  text-shadow:
    0 0 40px rgba(57, 255, 110, 0.4),
    0 0 80px rgba(57, 255, 110, 0.15),
    0 2px 0 var(--green-700);
  animation: title-flicker 5s ease-in-out infinite;
  margin-bottom: 1.6rem;
}

.hero-sub {
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(0.4rem, 1.2vw, 0.6rem);
  color: var(--text-muted);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1.6rem;
}

.hero-stats {
  color: var(--text-primary);
  opacity: 0.85;
  font-size: 1rem;
  letter-spacing: 0.04em;
  margin-bottom: 1.8rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.hero-btn {
  display: inline-block;
  padding: 12px 22px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green-300);
  background: transparent;
  border: 1px solid var(--green-700);
  transition: all 0.25s ease;
}

.hero-btn:hover,
.hero-btn:focus-visible {
  color: var(--bg-abyss);
  background: var(--green-neon);
  border-color: var(--green-neon);
  text-shadow: none;
  box-shadow: 0 0 25px rgba(57, 255, 110, 0.35);
}

.hero-btn--primary {
  border-color: var(--green-neon);
  color: var(--green-neon);
}

/* Other routes keep the brand but not the landing-page apparatus */
.hero--compact {
  min-height: 0;
  padding: 3.5rem 2rem 1.5rem;
}

.hero--compact .hero-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  margin-bottom: 1rem;
}

.hero--compact .hero-sub {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .hero {
    min-height: 32vh;
    padding: 4rem 1.2rem 2rem;
  }

  .hero-stats {
    font-size: 0.85rem;
    line-height: 1.6;
  }

  .hero-btn {
    padding: 10px 16px;
    font-size: 0.7rem;
  }

  .hero-backdrop {
    filter: blur(16px) brightness(0.28) saturate(0.9);
  }

  .hero--compact {
    padding: 2.5rem 1.2rem 1rem;
  }
}
</style>
