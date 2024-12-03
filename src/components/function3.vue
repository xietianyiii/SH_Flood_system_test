<template>
    <div id="app" class="app-container">
        <!-- 设备检测后渲染不同的组件 -->
        <RLmoni v-if="!isMobile" />
        <RLmoniMobile v-if="isMobile" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';

// 懒加载 RLmoni 组件
const RLmoni = defineAsyncComponent(() => import('@/components/Real-timeMoni.vue'));
// 懒加载 RLmoniMobile 组件
const RLmoniMobile = defineAsyncComponent(() => import('@/components/RLmoni-mobile.vue'));

const isMobile = ref(false);

onMounted(() => {
    // 判断是否为移动端设备
    isMobile.value = window.innerWidth <= 768;
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768;
    });
});
</script>

<style scoped>
.app-container {
    display: flex;
    height: auto;
    font-family: Arial, sans-serif;
}
</style>
