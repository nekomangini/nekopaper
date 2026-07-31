<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

// 1. Props 
defineProps<{ siteTitle: string }>();

// 2. Reactive State
const isMenuOpen = ref(false);
const route = useRoute()

// 3. Toggle Logic
const currentCategory = computed(() => {
  return route.path.replace('/', '')
})
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 4. Data
const categories = [
  "Home", "Abstract", "Anime", "Arts", "Cars", "Cats", "Dogs",
  "Environment", "Games", "Mecha", "Neon", "Others", "Space"
];
</script>

<template>
  <header class="navbar-header">
    <nav class="nav-container">
      <div class="nav-left">
        <button class="hamburger-menu" :class="{ active: isMenuOpen }" @click="toggleMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <h1 class="site-logo">
          <router-link to="/">{{ siteTitle }} </router-link>
        </h1>
      </div>
    </nav>

    <transition name="slide">
      <div v-if="isMenuOpen" class="dropdown-menu">
        <div class="dropdown-header">
          <h3>Categories</h3>
        </div>
        <ul class="category-list">
          <li v-for="category in categories" :key="category">
            <router-link :to="category === 'Home' ? '/' : `/${category.toLowerCase()}`" class="category-item"
              :class="{ active: (category === 'Home' && route.path === '/') || currentCategory === category.toLowerCase() }"
              @click="closeMenu">
              {{ category }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>

    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
  </header>
</template>

<style scoped>
/* --- Layout --- */
.navbar-header {
  margin: 0;
  padding: 0.12em 1rem;
  background: linear-gradient(
    180deg,
    rgba(2, 8, 5, 0.95) 0%,
    rgba(2, 8, 5, 0.6) 70%,
    transparent 100%
  );
  backdrop-filter: blur(4px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.site-logo {
  display: block;
}

.site-logo a {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  color: var(--green-neon);
  text-shadow: 0 0 20px rgba(57, 255, 110, 0.5);
  letter-spacing: 0.2em;
  text-decoration: none;
}

/* --- Hamburger Animation --- */
.hamburger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-dim);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger-menu.active span {
  background: var(--green-neon);
  box-shadow: 0 0 8px rgba(57, 255, 110, 0.5);
}

.hamburger-menu.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* --- Dropdown Menu Style --- */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 320px;
  max-height: calc(100vh - 80px);
  background: var(--bg-surface);
  border: 1px solid var(--green-900);
  border-bottom-right-radius: 12px;
  overflow-y: auto;
  z-index: 99;
}

.dropdown-header {
  padding: 1.25rem 1.5rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid rgba(57, 255, 110, 0.1);
}

.dropdown-header h3 {
  margin: 0;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.6rem;
  color: var(--green-500);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

/* --- Category Items --- */
.category-list {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
}

.category-item {
  display: block;
  padding: 0.9rem 1.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.category-item:hover {
  background: rgba(57, 255, 110, 0.05);
  color: var(--green-300);
  padding-left: 1.8rem;
}

.category-item.active {
  background: rgba(57, 255, 110, 0.08);
  color: var(--green-neon);
  border-left: 4px solid var(--green-neon);
  text-shadow: 0 0 10px rgba(57, 255, 110, 0.3);
  font-weight: 600;
}

/* --- Overlay --- */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 98;
}

/* --- Vue Transitions --- */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.dropdown-menu::-webkit-scrollbar {
  width: 5px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: var(--bg-abyss);
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: var(--green-900);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: var(--green-700);
}

@media (max-width: 768px) {

  .full-text,
  .site-logo {
    display: none;
  }

  .nav-left {
    gap: 0;
  }

  .nav-container {
    min-height: 50px;
    justify-content: flex-start;
  }

}
</style>
