<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import { useRoute } from 'vue-router'; // 引入 vue-router 钩子

const route = useRoute(); // 获取当前路由对象
</script>

<template>
  <div class="app">
    <!-- 如果当前路由不是登录页，则显示导航 -->
    <div class="head" v-if="route.path !== '/'">
      <Navigation></Navigation>
    </div>

    <!-- 只有这部分受路由控制 -->
    <div class="map">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
body,
html {
  margin: 0;
  padding: 0;
}

.head {
  position: fixed; /* 固定在页面顶部 */
  top: 0;
  left: 0;
  width: 100%; /* 宽度为 100% */
  z-index: 1000; /* 确保在其他元素上方 */
}
</style>
