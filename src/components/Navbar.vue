<script setup lang="ts">
import { ref } from 'vue';

// 1. Define Props (e.g., from App.vue)
defineProps<{ siteTitle: string }>();

// 2. Reactive State
const isMenuOpen = ref(false);
const currentCategory = ref('anime'); // Example active state

// 3. Toggle Logic
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 4. Data
const categories = [
  "Abstract", "Anime", "Arts", "Cars", "Cats", "Dogs",
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

        <h2 class="site-logo">
          <a href="/">{{ siteTitle }}</a>
        </h2>
      </div>
    </nav>

    <transition name="slide">
      <div v-if="isMenuOpen" class="dropdown-menu">
        <div class="dropdown-header">
          <h3>Categories</h3>
        </div>
        <ul class="category-list">
          <li v-for="category in categories" :key="category">
            <a :href="`#/${category.toLowerCase()}`" class="category-item"
              :class="{ active: currentCategory === category.toLowerCase() }" @click="closeMenu">
              {{ category }}
            </a>
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
  background: rgb(40, 40, 40);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.site-logo a {
  color: rgb(251, 173, 47);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.4rem;
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
  background: rgb(189, 183, 136);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: rgb(50, 50, 50);
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.6);
  border-bottom-right-radius: 12px;
  overflow-y: auto;
  z-index: 99;
  border: 1px solid rgba(189, 183, 136, 0.1);
}

.dropdown-header {
  padding: 1.25rem 1.5rem;
  background: rgb(45, 45, 45);
  border-bottom: 1px solid rgba(189, 183, 136, 0.1);
}

.dropdown-header h3 {
  margin: 0;
  font-size: 0.8rem;
  color: rgb(251, 173, 47);
  text-transform: uppercase;
  letter-spacing: 0.1em;
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
  color: rgb(189, 183, 136);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.category-item:hover {
  background: rgba(251, 173, 47, 0.05);
  color: rgb(251, 173, 47);
  padding-left: 1.8rem;
}

.category-item.active {
  background: rgba(131, 165, 152, 0.15);
  color: rgb(131, 165, 152);
  border-left: 4px solid rgb(131, 165, 152);
  font-weight: 600;
}

/* --- Overlay --- */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
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

/* Custom scrollbar for dropdown */
.dropdown-menu::-webkit-scrollbar,
.search-results-content::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track,
.search-results-content::-webkit-scrollbar-track {
  background: rgb(40, 40, 40);
}

.dropdown-menu::-webkit-scrollbar-thumb,
.search-results-content::-webkit-scrollbar-thumb {
  background: rgb(100, 88, 60);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover,
.search-results-content::-webkit-scrollbar-thumb:hover {
  background: rgb(131, 165, 152);
}
</style>
