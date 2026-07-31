<template>
  <section class="hero">
    <h1 class="hero-title">ネコpaper</h1>
    <p class="hero-sub">My Personal Aesthetic Collection of Wallpapers</p>
  </section>
</template>

<style scoped>
.hero {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem 3rem;
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
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .hero {
    min-height: 50vh;
    padding: 5rem 1.2rem 2rem;
  }
}
</style>
