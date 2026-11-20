<script setup lang="ts">
import { computed } from 'vue'
import { images, type ImageData } from '../config/images'

interface ChangeGroup {
  dateKey: string // YYYY-MM-DD (from the recorded git commit date)
  label: string // "Nov 17, 2026"
  relative: string // "Today" / "Yesterday" / "12 days ago" / ""
  items: ImageData[]
}

const formatLabel = (dateKey: string) =>
  // Parse at local midnight — Date.parse("YYYY-MM-DD") would be UTC and could shift a day.
  new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const relativeOf = (dateKey: string): string => {
  const days = Math.floor((Date.now() - Date.parse(`${dateKey}T00:00:00`)) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return ''
}

/** All wallpapers grouped by their added date, newest day first. */
const groups = computed<ChangeGroup[]>(() => {
  const byDate = new Map<string, ImageData[]>()

  for (const img of images) {
    if (!img.addedAt || Number.isNaN(Date.parse(img.addedAt))) continue
    const key = img.addedAt.slice(0, 10) // commit-local date, stable regardless of viewer TZ
    const bucket = byDate.get(key)
    if (bucket) bucket.push(img)
    else byDate.set(key, [img])
  }

  // YYYY-MM-DD strings sort chronologically, so a plain lexicographic desc works.
  return [...byDate.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatLabel(dateKey),
      relative: relativeOf(dateKey),
      items: [...items].sort((a, b) => {
        const ta = a.addedAt ? Date.parse(a.addedAt) : 0
        const tb = b.addedAt ? Date.parse(b.addedAt) : 0
        return ta === tb ? a.title.localeCompare(b.title) : tb - ta
      }),
    }))
})

const totalWallpapers = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0))
</script>

<template>
  <div class="changelog-view">
    <div class="header-section">
      <h2>Changelog</h2>
      <p class="subtitle">
        {{ totalWallpapers }} wallpapers across {{ groups.length }} update days — newest first
      </p>
      <p class="subscribe-hint">
        Want a ping instead?
        <a href="/feed.xml">Subscribe via RSS</a>
      </p>
    </div>

    <p v-if="groups.length === 0" class="empty-state">
      No dated uploads yet — run <code>npm run metadata</code> to backfill dates from git history.
    </p>

    <section v-for="group in groups" :key="group.dateKey" class="changelog-group">
      <div class="group-header">
        <h3>{{ group.label }}</h3>
        <span v-if="group.relative" class="relative-badge">{{ group.relative }}</span>
        <span class="group-count">
          {{ group.items.length }} new wallpaper{{ group.items.length === 1 ? '' : 'es' }}
        </span>
      </div>

      <div class="thumb-grid">
        <RouterLink
          v-for="img in group.items"
          :key="img.slug"
          :to="`/${img.category.toLowerCase()}/download/${img.slug}`"
          class="thumb"
        >
          <div class="thumb-img">
            <img :src="img.src" :alt="img.title" loading="lazy" />
          </div>
          <p class="thumb-title">{{ img.title }}</p>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.changelog-view {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 40px;
}

.changelog-view h2 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 8px;
  color: var(--green-neon);
  text-shadow: 0 0 20px rgba(57, 255, 110, 0.3);
  letter-spacing: 0.05em;
}

.subtitle {
  color: var(--text-dim);
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.subscribe-hint {
  color: var(--text-muted);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
}

.subscribe-hint a {
  color: var(--green-300);
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
  padding-bottom: 1px;
}

.subscribe-hint a:hover {
  color: var(--green-neon);
  text-shadow: 0 0 10px rgba(57, 255, 110, 0.3);
}

.empty-state {
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--green-900);
  padding: 24px;
  text-align: center;
}

.empty-state code {
  color: var(--green-300);
}

/* --- Day group --- */
.changelog-group {
  margin-bottom: 48px;
}

.group-header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(57, 255, 110, 0.15);
}

.group-header h3 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  margin: 0;
  color: var(--green-300);
  letter-spacing: 0.05em;
}

.relative-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--bg-abyss);
  background: var(--green-neon);
  padding: 2px 8px;
  text-transform: uppercase;
}

.group-count {
  color: var(--text-dim);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
}

/* --- Thumbnails --- */
.thumb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.thumb {
  display: block;
  text-decoration: none;
  background: var(--bg-surface);
  border: 1px solid rgba(57, 255, 110, 0.05);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumb:hover {
  transform: translateY(-4px);
  border-color: rgba(57, 255, 110, 0.3);
  box-shadow:
    0 0 25px rgba(57, 255, 110, 0.08),
    0 8px 30px rgba(0, 0, 0, 0.5);
}

.thumb-img {
  width: 100%;
  height: 130px;
  overflow: hidden;
  background: var(--bg-abyss);
}

.thumb-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease, filter 0.3s;
  filter: brightness(0.85) saturate(0.9);
}

.thumb:hover .thumb-img img {
  transform: scale(1.08);
  filter: brightness(1) saturate(1);
}

.thumb-title {
  margin: 0;
  padding: 10px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  background: var(--bg-elevated);
  color: var(--green-300);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.thumb:hover .thumb-title {
  background: var(--green-neon);
  color: var(--bg-abyss);
  text-shadow: none;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .changelog-view {
    padding: 24px 15px;
  }

  .changelog-view h2 {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .group-header h3 {
    font-size: 1.1rem;
  }

  .thumb-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .thumb-img {
    height: 100px;
  }
}
</style>
