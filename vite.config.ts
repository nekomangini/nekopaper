import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Emit dist/.vite/manifest.json so build scripts (feed, sitemap) can map
    // source paths like src/assets/anime/guts.webp to their hashed output file.
    manifest: true,
  },
})
