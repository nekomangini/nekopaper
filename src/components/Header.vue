<template>
  <div class="container">
    <h1>ネコpaper</h1>
    <p>My Personal Aesthetic Collection of Wallpapers </p>
  </div>
</template>

<style scoped>
h1 {
  color: var(--accent);
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

p {
  color: rgb(var(--accent-light));
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  h1 {
    font-size: 2.2rem;
    line-height: 1.1;
  }

  p {
    font-size: 1rem;
    opacity: 0.9;
    max-width: 280px;
    margin: 0 auto;
  }
}
</style>
