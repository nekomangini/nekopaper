<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getImageBySlug } from '../config/images'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

// Data source
const image = computed(() => getImageBySlug(slug))

// UI State
const isSharePopupOpen = ref(false)
const SITE_KOFI = "https://ko-fi.com/yourlink"

// Methods
const goBack = () => router.back()
const toggleShare = () => isSharePopupOpen.value = !isSharePopupOpen.value

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert("Link copied!")
  } catch (err) { console.error(err) }
}

const shareLinks = computed(() => {
  const url = encodeURIComponent(window.location.href)
  return {
    twitter: `https://twitter.com/intent/tweet?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  }
})
</script>

<template>
  <div v-if="image" class="download-page">
    <header class="download-nav">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Gallery
        </button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-container">
        <div class="image-container">
          <img class="wallpaper-image" :src="image.src" :alt="image.title">
        </div>

        <div class="hero-content">
          <div class="left-section">
            <h1 class="wallpaper-name">{{ image.title }}</h1>

            <div class="main-info">
              <span class="main-tag">{{ image.category }}</span>
              <span class="resolution">Ultra HD High Quality</span>
            </div>

            <div class="tags-container">
              <span class="tag">Desktop</span>
              <span class="tag">Wallpaper</span>
              <span class="tag">ネコpaper</span>
            </div>

            <div class="credits">
              <div class="credits-label">Source</div>
              <a href="#" class="credits-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Internal Assets
              </a>
            </div>
          </div>

          <div class="right-section">
            <a :href="image.src" :download="image.slug" class="action-btn download-btn">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download
            </a>

            <div class="share-wrapper">
              <button @click="toggleShare" class="action-btn share-btn">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
                Share
              </button>

              <div class="share-popup" :class="{ 'hidden': !isSharePopupOpen }">
                <a :href="shareLinks.twitter" target="_blank" class="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a :href="shareLinks.facebook" target="_blank" class="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.093 0-2.87.717-2.87 2.69v1.28h3.456l-.466 3.667h-2.99v7.98H9.101z" />
                  </svg>
                </a>
                <button @click="copyLink" class="social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
              </div>
            </div>

            <a :href="SITE_KOFI" target="_blank" class="action-btn kofi-btn">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
              </svg>
              Support on Ko-fi
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="not-found">Loading Wallpaper...</div>
</template>

<style scoped>
/* INSERT THE ENTIRE CSS YOU PROVIDED HERE */
.download-nav {
  max-width: 1400px;
  margin: 20px auto 0;
  padding: 0 32px;
}

body {
  background: #282828;
  color: #ebdbb2;
  min-height: 100vh;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 0.9375rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.website-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.hero {
  max-width: 1400px;
  margin: 48px auto;
  padding: 0 32px;
}

.hero-container {
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
  overflow: hidden;
}

.wallpaper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  padding: 40px 48px 48px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.wallpaper-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.main-tag {
  background: #1a1a1a;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.resolution {
  color: #666;
  font-size: 0.9375rem;
  font-weight: 500;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f5f5f5;
  color: #666;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.tag:hover {
  background: #fff;
  border-color: #e5e5e5;
  color: #1a1a1a;
}

.credits {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
}

.credits-label {
  font-size: 0.8125rem;
  color: #999;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.credits-link {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
}

.credits-link:hover {
  color: #0066cc;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.share-wrapper {
  position: relative;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  box-sizing: border-box;
  width: 100%;
  height: 56px;
  line-height: 1;

  border: none;
  white-space: nowrap;
  text-decoration: none;
}

.download-btn {
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
}

.download-btn:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.download-btn:active {
  transform: translateY(0);
}

.share-btn {
  background: #fff;
  color: #1a1a1a;
  border: 1.5px solid #e5e5e5;
}

.share-btn:hover {
  background: #fafafa;
  border-color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.share-popup {
  position: absolute;
  top: 110%;
  right: 0;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  gap: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.share-popup.hidden {
  display: flex;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

.share-popup:not(.hidden) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.social-link:hover {
  background: #1a1a1a;
  color: #fff;
  transform: scale(1.1);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.kofi-btn {
  background: linear-gradient(135deg, #FF5E5B 0%, #FF3D00 100%);
  color: #fff;
  margin-top: 12px;
  text-decoration: none;
}

.kofi-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 94, 91, 0.3);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 24px;
  }

  .right-section {
    order: -1;
  }

  .wallpaper-name {
    font-size: 1.75rem;
  }

  .share-popup {
    right: 0;
    left: auto;
  }
}

@media (max-width: 640px) {
  .header-content {
    padding: 0 20px;
  }

  .hero {
    margin: 24px auto;
    padding: 0 16px;
  }

  .hero-container {
    border-radius: 16px;
  }

  .wallpaper-name {
    font-size: 1.5rem;
  }

  .share-popup {
    width: 100%;
    justify-content: center;
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background: #0a0a0a;
    color: #fff;
  }

  header {
    background: rgba(26, 26, 26, 0.95);
    border-bottom-color: #2a2a2a;
  }

  .back-btn {
    color: #999;
  }

  .back-btn:hover {
    background: #1a1a1a;
    color: #fff;
  }

  .website-name {
    color: #fff;
  }

  .hero-container {
    background: #1a1a1a;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .image-container {
    background: #0a0a0a;
  }

  .wallpaper-name {
    color: #fff;
  }

  .main-tag {
    background: #fff;
    color: #1a1a1a;
  }

  .resolution {
    color: #999;
  }

  .tag {
    background: #2a2a2a;
    color: #999;
    border-color: transparent;
  }

  .tag:hover {
    background: #333;
    border-color: #444;
    color: #fff;
  }

  .credits {
    border-top-color: #2a2a2a;
  }

  .credits-link {
    color: #fff;
  }

  .credits-link:hover {
    color: #4da3ff;
  }

  .download-btn {
    background: #fff;
    color: #1a1a1a;
  }

  .download-btn:hover {
    background: #f0f0f0;
  }

  .share-btn {
    background: #2a2a2a;
    color: #fff;
    border-color: #3a3a3a;
  }

  .share-btn:hover {
    background: #333;
    border-color: #fff;
  }

  .share-popup {
    background: #2a2a2a;
    border-color: #444;
  }

  .social-link {
    background: #3a3a3a;
    color: #fff;
  }

  .social-link:hover {
    background: #fff;
    color: #1a1a1a;
  }
}

/* ... all other classes from your CSS ... */
</style>
