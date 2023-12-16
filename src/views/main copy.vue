<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue'
import Mapbox from '@/components/Mapboxgl.vue'
import color from '@/components/color.vue'
</script>

<template>
    <div class="app">
        <div class="head">
            <Navigation></Navigation>
        </div>

        <div class="map">
            <Mapbox></Mapbox>
            <div class="color-card">
                <color></color>
            </div>
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