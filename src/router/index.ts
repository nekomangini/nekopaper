import { createRouter, createWebHistory } from 'vue-router'
import GalleryView from '../views/GalleryView.vue'
import AbstractView from '../views/AbstractView.vue'
import Animeview from '../views/Animeview.vue'
import Artsview from '../views/Artsview.vue'
import Carsview from '../views/Carsview.vue'
import Catsview from '../views/Catsview.vue'
import Dogsview from '../views/Dogsview.vue'
import Environmentview from '../views/Environmentview.vue'
import Gamesview from '../views/Gamesview.vue'
import Mechaview from '../views/Mechaview.vue'
import Neonview from '../views/Neonview.vue'
import Othersview from '../views/Othersview.vue'
import Spaceview from '../views/Spaceview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: GalleryView
    },
    {
      path: '/abstract',
      name: 'abstract',
      component: AbstractView
    },
    {
      path: '/anime',
      name: 'anime',
      component: Animeview
    },
    {
      path: '/arts',
      name: 'arts',
      component: Artsview
    },
    {
      path: '/cars',
      name: 'cars',
      component: Carsview
    },
    {
      path: '/cats',
      name: 'cats',
      component: Catsview
    },
    {
      path: '/dogs',
      name: 'dogs',
      component: Dogsview
    },
    {
      path: '/environment',
      name: 'environment',
      component: Environmentview
    },
    {
      path: '/games',
      name: 'games',
      component: Gamesview
    },
    {
      path: '/mecha',
      name: 'mecha',
      component: Mechaview
    },
    {
      path: '/neon',
      name: 'neon',
      component: Neonview
    },
    {
      path: '/others',
      name: 'others',
      component: Othersview
    },
    {
      path: '/space',
      name: 'space',
      component: Spaceview
    }
  ]
})

export default router
