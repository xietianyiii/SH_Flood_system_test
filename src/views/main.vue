<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue'
import Mapbox from '@/components/Mapboxgl.vue'
</script>

<template>
    <div class="app">
        <div class="head">
            <Navigation></Navigation>
        </div>

        <div class="map">
            <Mapbox></Mapbox>
        </div>
    </div>
</template>

<style>

body, html {
    margin: 0;
    padding: 0;
}


</style>