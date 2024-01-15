import { createRouter, createWebHashHistory } from 'vue-router'
import test from '../views/test.vue'
import Function1Component from '../components/function1.vue'
import Function21Component from '../components/function2-1.vue'
import Function22Component from '../components/function2-2.vue'
import Function3Component from '../components/function3.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/flood'
    },
    {
      path: '/flood',
      name: 'flood',
      component: Function1Component, 
    },{
      path: '/function1',
      name: 'function1',
      component: Function1Component // 导入功能一对应的组件
    },
    {
      path: '/function21',
      name: 'function21',
      component: Function21Component // 导入功能四对应的组件
    },
    {
      path: '/function22',
      name: 'function22',
      component: Function22Component // 导入功能四对应的组件
    },
    {
      path: '/function3',
      name: 'function3',
      component: Function3Component // 导入功能四对应的组件
    },
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