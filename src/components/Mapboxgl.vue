<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
        <div class="slider">
            <div class="slider-demo-block">
                <el-slider v-model="selectedIndex" :step="1" :min="0" :max="urls.length - 1" show-stops />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainer = ref<HTMLElement | null>(null);

const urls = ref<string[]>([
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1"
]);

const selectedIndex = ref(0); // 当前选择的索引

const selectedUrl = computed(() => {
    return urls.value[selectedIndex.value];
});

let map: mapboxgl.Map | null = null; // 使用 mapboxgl.Map 类型

onMounted(() => {
    if (mapContainer.value) {
        mapboxgl.accessToken =
            "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";

        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: "mapbox://styles/1063816178/cll7d4s0000aj01pucz772ohj",
            center: [121.387899486, 31.09916171],
            zoom: 3,
        });

        // 添加地图加载完成事件监听器
        map.on("load", function () {
            if (map) {
                // 创建数据源
                map.addSource('wms-test-source', {
                    type: 'raster',
                    tiles: [selectedUrl.value],
                    tileSize: 256
                });

                // 创建图层
                map.addLayer({
                    id: 'wms-test-layer',
                    type: 'raster',
                    source: 'wms-test-source',
                    paint: {}
                });
            }
        });

        // 添加导航控件
        map.addControl(new mapboxgl.NavigationControl());
    }
});

watch(selectedIndex, (newIndex) => {
    if (map) {
        map.removeLayer('wms-test-layer');
        map.removeSource('wms-test-source');

        map.addSource('wms-test-source', {
            type: 'raster',
            tiles: [urls.value[newIndex]],
            tileSize: 256
        });

        map.addLayer({
            id: 'wms-test-layer',
            type: 'raster',
            source: 'wms-test-source',
            paint: {}
        });
    }
});

onUnmounted(() => {
    if (map) {
        map.remove();
    }
});
</script>
  
<style scoped>
.map-container {
    width: 100vw;
    height: 100vh;
}

.slider-demo-block {
    background: rgba(1, 15, 25, .698);
    border-radius: 10px 100px / 120px;
    position: absolute;
    bottom: 3vh;
    right: 20px;
    transition: all .5s linear;
    display: flex;
    width: calc(100% - 25vw);
    height: 10vh;
    left: 3.6458333333vw;
    align-items: center;
}

.slider-demo-block .el-slider {
    margin-left: 16px;
    margin-right: 12px;
}

.slider-demo-block .demonstration {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
}

.slider-demo-block .demonstration+.el-slider {
    flex: 0 0 70%;
}
</style>
  