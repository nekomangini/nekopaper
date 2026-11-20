<script setup lang="ts">
import { computed } from 'vue'
import { images } from '../config/images'
import type { ImageData } from '../config/images'

/** How many wallpapers to show in the rail */
const LIMIT = 12
/** A wallpaper keeps its NEW badge for this many days */
const NEW_WINDOW_DAYS = 14

const now = Date.now()
const dayMs = 24 * 60 * 60 * 1000

const recent = computed<ImageData[]>(() =>
  images
    .filter((img) => img.addedAt)
    .sort((a, b) => (b.addedAt! < a.addedAt! ? -1 : b.addedAt! > a.addedAt! ? 1 : 0))
    .slice(0, LIMIT)
)

const isNew = (img: ImageData): boolean =>
  !!img.addedAt && now - new Date(img.addedAt).getTime() <= NEW_WINDOW_DAYS * dayMs

const hasNew = computed(() => recent.value.some(isNew))

/** How many wallpapers landed inside the NEW window */
const newCount = computed(
  () => images.filter((img) => img.addedAt && isNew(img)).length,
)

/**
 * Commit-local day (YYYY-MM-DD), parsed at local midnight. Formatting the full
 * timestamp instead would shift the day for visitors west of the commit offset and
 * would disagree with the changelog grouping and the RSS feed.
 */
const formatDay = (iso: string): string =>
  new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

/** "Nov 17, 2026 · 12 new this week" — computed from the data, never hand-written */
const updatedLine = computed(() => {
  const latest = recent.value[0]
  if (!latest?.addedAt) return ''
  const count =
    newCount.value > 0
      ? ` · ${newCount.value} new in the last ${NEW_WINDOW_DAYS} days`
      : ''
  return `Updated ${formatDay(latest.addedAt)}${count}`
})

const formatDate = (iso: string): string =>
  formatDay(iso).replace(/, \d{4}$/, '')
</script>

<template>
  <section v-if="recent.length" class="recent-added">
    <div class="recent-header">
      <h2>Recently Added</h2>
      <p v-if="updatedLine" class="updated-line">
        <span class="pulse-dot" aria-hidden="true"></span>
        {{ updatedLine }}
      </p>
    </div>

    <div class="recent-grid">
      <RouterLink
        v-for="img in recent"
        :key="img.slug"
        :to="{
          path: `/${img.category.toLowerCase()}/download/${img.slug}`,
          query: { fromPage: 1 },
        }"
        class="recent-card"
      >
        <div class="card-image-wrapper">
          <img :src="img.src" :alt="img.title" loading="lazy" />
          <span v-if="isNew(img)" class="new-badge">NEW</span>
        </div>
        <div class="card-meta">
          <p class="image-title">{{ img.title }}</p>
          <p class="image-date">{{ formatDate(img.addedAt!) }}</p>
        </div>
      </RouterLink>
    </div>

    <p v-if="!hasNew" class="no-new-hint">Nothing new in the last {{ NEW_WINDOW_DAYS }} days yet.</p>
  </section>
</template>

<style scoped>
.recent-added {
  padding: 0 0 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.recent-header {
  margin-bottom: 24px;
}

.recent-added h2 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: var(--green-neon);
  text-shadow: 0 0 20px rgba(57, 255, 110, 0.3);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.updated-line {
  color: var(--text-dim);
  font-size: 1rem;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green-neon);
  box-shadow: 0 0 8px var(--green-neon);
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.recent-card {
  display: block;
  text-decoration: none;
  background: var(--bg-surface);
  border: 1px solid rgba(57, 255, 110, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.recent-card:hover {
  transform: translateY(-4px);
  border-color: rgba(57, 255, 110, 0.3);
  box-shadow:
    0 0 25px rgba(57, 255, 110, 0.08),
    0 8px 30px rgba(0, 0, 0, 0.5);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
  background: var(--bg-abyss);
}

.recent-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease, filter 0.3s;
  filter: brightness(0.85) saturate(0.9);
}

.recent-card:hover img {
  transform: scale(1.05);
  filter: brightness(1) saturate(1);
}

.new-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: var(--bg-abyss);
  background: var(--green-neon);
  box-shadow: 0 0 12px rgba(57, 255, 110, 0.6);
  animation: badge-glow 2s ease-in-out infinite;
}

@keyframes badge-glow {
  0%,
  100% {
    box-shadow: 0 0 12px rgba(57, 255, 110, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(57, 255, 110, 0.9);
  }
}

.card-meta {
  padding: 12px;
  background: var(--bg-elevated);
}

.image-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--green-300);
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-date {
  margin: 4px 0 0;
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}

.no-new-hint {
  margin-top: 16px;
  color: var(--text-dim);
  font-size: 0.9rem;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .recent-added {
    padding: 0 0 30px;
  }

  .recent-added h2 {
    font-size: 1.4rem;
  }

  .updated-line {
    font-size: 0.85rem;
  }

  .recent-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px;
  }

  .card-image-wrapper {
    height: 110px;
  }
}
</style>
