import { createRouter, createWebHistory } from 'vue-router'
import test from '../components/test.vue'
import Login from '../components/login+heart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: test, 
    },
    {
      path: '/home/login',
      name: 'login',
      component: Login, 
    }
  ]

})

export default router

// {
//   path: '/',
//   name: 'home',
//   component: HomeView
// },
// {
//   path: '/about',
//   name: 'about',
//   // route level code-splitting
//   // this generates a separate chunk (About.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import('../views/AboutView.vue')
// }
// ]