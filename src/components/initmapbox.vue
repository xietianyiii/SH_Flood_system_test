<template>
    <div ref="mapContainer" class="map-container"></div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    if (mapContainer.value) {

        mapboxgl.accessToken =
            "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";

        const map = new mapboxgl.Map({
            container: mapContainer.value,
            style: "mapbox://styles/1063816178/clj8ckm2t003301rdejthfz81", // style URL
            center: [121.387899486, 31.09916171], // starting position [lng, lat]
            zoom: 3, // starting zoom
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        
        // Clean up map when the component is unmounted
        return () => {
            map.remove();
        };
    }
});
</script>
  
<style scoped>
.map-container {
    position: absolute;
    top: 8vh;
    bottom: 0;
    width: 100%;
}
</style>
  