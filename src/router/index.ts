import { createRouter, createWebHistory } from 'vue-router'
import { Componenttest, Homeview, Threeviews, Wstest } from '@/views/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: Homeview
    },
    {
      path: '/Componenttest',
      name: 'Componenttest',
      component: Componenttest
    },
    {
      path: '/Homeview',
      name: 'Homeview',
      component: Homeview
    },
    {
      path: '/Threeviews',
      name: 'Threeviews',
      component: Threeviews
    },
    {
      path: '/Wstest',
      name: 'Wstest',
      component: Wstest
    },
  ]
})

export default router
