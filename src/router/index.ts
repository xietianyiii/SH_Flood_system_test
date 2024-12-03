import { createRouter, createWebHashHistory } from 'vue-router';
const Function1Component = () => import('../components/function1.vue');
const Function3Component = () => import('../components/function3.vue');
const LoginComponent = () => import('../components/login+heart.vue');

import { isAuthenticated } from '../auth'; // 引入 `isAuthenticated` 状态

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginComponent, // 登录页面作为首页
    },
    {
      path: '/forecasting',
      name: 'function1',
      component: Function1Component,
      // 使用路由守卫，确保只有登录成功后才能访问此页面
      beforeEnter: (to, from, next) => {
        if (isAuthenticated.value) {
          next();
        } else {
          next('/'); // 如果未登录，则重定向到登录页面
        }
      }
    },
    {
      path: '/modeling',
      name: 'function3',
      component: Function3Component,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated.value) {
          next();
        } else {
          next('/'); // 如果未登录，则重定向到登录页面
        }
      }
    },
  ]
});

export default router;
