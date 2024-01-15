<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue'
import Mapbox from '@/components/Mapboxgl.vue'
</script>

<template>
    <div class="app">
        <!-- <div class="head">
            <Navigation></Navigation>
        </div> -->

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

#color-card {
    text-align: center;
    margin-top: 60px;
}
</style>