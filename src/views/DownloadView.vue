<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue' // Added imports
import { useRoute, useRouter } from 'vue-router'
import { getImageBySlug } from '../config/images'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const image = computed(() => getImageBySlug(slug))
const isSharePopupOpen = ref(false)
const SITE_KOFI = "https://ko-fi.com/yourlink"

const goBack = () => {
  const page = route.query.fromPage;
  const category = image.value?.category.toLowerCase();

  if (page && category) {
    // Goes back to /arts?page=14
    router.push({ path: `/${category}`, query: { page: page } });
  } else {
    router.back();
  }
}
const toggleShare = () => isSharePopupOpen.value = !isSharePopupOpen.value

// Close logic
const closePopup = () => { isSharePopupOpen.value = false }

const handleGlobalEvents = (e: any) => {
  // Close on Escape key
  if (e.key === 'Escape') closePopup()

  // Close if clicking outside the share-wrapper
  if (e.type === 'click' && !e.target.closest('.share-wrapper')) {
    closePopup()
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalEvents)
  window.addEventListener('keydown', handleGlobalEvents)
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalEvents)
  window.removeEventListener('keydown', handleGlobalEvents)
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert("Link copied!")
    closePopup() // Close after copying
  } catch (err) { console.error(err) }
}

const shareLinks = computed(() => {
  const url = encodeURIComponent(window.location.href)
  return {
    twitter: `https://twitter.com/intent/tweet?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  }
})

// Image properties
const resolutionDisplay = ref('Loading resolution...')
const orientation = ref('Desktop') // Default fallback

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  const w = img.naturalWidth
  const h = img.naturalHeight

  // naturalWidth and naturalHeight get the true size of the file, 
  // not the size it is scaled to on the screen.
  resolutionDisplay.value = `${w} x ${h}`

  // Determine Orientation
  if (w > h) {
    orientation.value = 'Horizontal Monitor'
  } else if (h > w) {
    orientation.value = 'Vertical Monitor'
  } else {
    orientation.value = 'Square Display'
  }
}

const firstName = computed(() => {
  if (!image.value) return ''

  // Try title first, then slug. 
  // We split by space or hyphen and take the first item.
  const name = image.value.title || image.value.slug || ''
  return name.split(/[\s-]+/)[0]
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
          Back to {{ image.category }}
        </button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-container">
        <div class="image-container">
          <img class="wallpaper-image" :src="image.src" :alt="image.title" @load="handleImageLoad">
        </div>

        <div class="hero-content">
          <div class="left-section">
            <h1 class="wallpaper-name">{{ image.title }}</h1>

            <div class="main-info">
              <span class="main-tag">{{ image.category }}</span>
              <span class="resolution">{{ resolutionDisplay }}</span>
            </div>

            <div class="tags-container">
              <span class="tag">{{ orientation }}</span>
              <span class="tag">ネコpaper</span>
              <span class="tag" v-if="firstName">{{ firstName.toLowerCase() }}</span>
            </div>

            <!-- TODO: change the source according to the image file -->
            <!-- <div class="credits"> -->
            <!--   <div class="credits-label">Source</div> -->
            <!--   <a href="#" class="credits-link"> -->
            <!--     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> -->
            <!--       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /> -->
            <!--     </svg> -->
            <!--     Internal Assets -->
            <!--   </a> -->
            <!-- </div> -->
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
/* --- 1. Page Layout & Navigation --- */
.download-page {
  min-height: 100vh;
  padding-bottom: 60px;
}

.download-nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 32px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1.5px solid rgba(var(--gray-light), 0.2);
  color: rgb(var(--gray-light));
  font-size: 0.9375rem;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 600;
}

.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(var(--accent-light), 0.05);
}

/* --- 2. Hero Section & Image --- */
.hero {
  max-width: 1400px;
  margin: 20px auto 48px;
  padding: 0 32px;
}

.hero-container {
  background: rgb(var(--background-light));
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  border: 1px solid rgba(var(--gray-light), 0.1);
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: rgb(var(--black));
  overflow: hidden;
}

.wallpaper-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* --- 3. Content & Information --- */
.hero-content {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
  padding: 40px;
}

.wallpaper-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.03em;
  margin: 0 0 16px 0;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.main-tag {
  background: var(--accent);
  color: rgb(var(--black));
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.resolution {
  color: rgba(var(--accent-light), 0.8);
  font-size: 1rem;
  font-weight: 500;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: rgb(var(--gray-dark));
  color: rgb(var(--gray-light));
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid rgba(var(--gray-light), 0.1);
}

.tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* --- 4. Credits Section --- */
.credits {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(var(--gray-light), 0.1);
}

.credits-label {
  font-size: 0.75rem;
  color: rgba(var(--gray-light), 0.5);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.credits-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* --- 5. Action Buttons (Merged & Fixed) --- */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 56px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Icon constraints within buttons */
.btn-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: block;
}

.btn-icon path,
.btn-icon circle {
  stroke-width: 2.5px;
}

/* Button Variants */
.download-btn {
  background: var(--accent);
  color: rgb(var(--black));
}

.download-btn:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.share-btn {
  background: rgb(var(--gray-dark));
  color: var(--accent);
  border: 1.5px solid var(--accent);
}

.share-btn:hover {
  background: rgba(var(--accent-light), 0.1);
  transform: translateY(-2px);
}

.kofi-btn {
  background: #29abe0;
  color: #fff;
}

.kofi-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

/* --- 6. Share Popup (CENTERED & ANIMATED) --- */
.share-wrapper {
  position: relative;
  width: 100%;
}

.share-popup {
  position: absolute;
  /* Move to middle of button */
  bottom: 130%;
  /* Center it and reset Y */
  left: 50%;
  transform: translateX(-50%) translateY(0);
  background: rgb(var(--gray-dark));
  border: 1.5px solid var(--accent);

  /* --- Width Adjustments --- */
  min-width: 200px;
  padding: 10px;
  gap: 18px;
  justify-content: center;
  /* ------------------------- */

  border-radius: 12px;
  display: flex;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  pointer-events: auto;
}

.share-popup.hidden {
  /* Maintain the X centering while animating the Y slide */
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
  pointer-events: none;
}

/* Centered Arrow */
.share-popup::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--accent);
}

.social-link {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  background: rgba(var(--accent-light), 0.1);
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--accent);
  color: rgb(var(--black));
}

/* --- 7. Responsive Queries --- */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    padding: 30px;
  }

  .hero {
    padding: 0 16px;
    margin-top: 10px;
  }

  .image-container {
    aspect-ratio: 4/5;
    max-height: 30vh;
  }

  .wallpaper-image {
    object-fit: cover;
  }

  .right-section {
    order: -1;
  }

  .wallpaper-name {
    font-size: 2rem;
  }
}
</style>
