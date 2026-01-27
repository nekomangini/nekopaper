import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue')
    },
    {
      path: '/abstract',
      name: 'abstract',
      component: () => import('../views/AbstractView.vue')
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('../views/Animeview.vue')
    },
    {
      path: '/arts',
      name: 'arts',
      component: () => import('../views/Artsview.vue')
    },
    {
      path: '/cars',
      name: 'cars',
      component: () => import('../views/Carsview.vue')
    },
    {
      path: '/cats',
      name: 'cats',
      component: () => import('../views/Catsview.vue')
    },
    {
      path: '/dogs',
      name: 'dogs',
      component: () => import('../views/Dogsview.vue')
    },
    {
      path: '/environment',
      name: 'environment',
      component: () => import('../views/Environmentview.vue')
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/Gamesview.vue')
    },
    {
      path: '/mecha',
      name: 'mecha',
      component: () => import('../views/Mechaview.vue')
    },
    {
      path: '/neon',
      name: 'neon',
      component: () => import('../views/Neonview.vue')
    },
    {
      path: '/others',
      name: 'others',
      component: () => import('../views/Othersview.vue')
    },
    {
      path: '/space',
      name: 'space',
      component: () => import('../views/Spaceview.vue')
    },
    {
      path: '/:category/download/:slug',
      name: 'Download',
      component: () => import('../views/DownloadView.vue')
    }
  ]
})

export default router
