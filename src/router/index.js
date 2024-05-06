import { createRouter, createWebHistory } from 'vue-router'
import HotelCrear from '../views/DatosPorGenero.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/datos-facultad',
      name: 'datos-facultad',
      component: () => import('../views/DatosPorFacultad.vue')
    },
    {
      path: '/datos-genero',
      name: 'datos-genero',
      component: () => import('../views/DatosPorGenero.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/graficas',
      name: 'graficas',
      component: () => import('../views/GraphView.vue')
    }
  ]
})

export default router
