<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <!-- Background layers -->
  <div class="bg-mesh"></div>
  <div class="grid-bg"></div>

  <Navbar siteTitle="ネコpaper" />
  <Header />
  <RouterView />
  <Footer />
</template>

<style scoped>
.bg-mesh {
  position: fixed;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(
      ellipse at 15% 85%,
      rgba(196, 32, 32, 0.06) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 85% 15%,
      rgba(57, 255, 110, 0.03) 0%,
      transparent 45%
    ),
    radial-gradient(
      ellipse at 50% 100%,
      rgba(0, 80, 30, 0.2) 0%,
      transparent 60%
    ),
    var(--bg-abyss);
}

.grid-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(57, 255, 110, 0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(57, 255, 110, 0.012) 1px, transparent 1px);
  background-size: 60px 60px;
}
</style>
