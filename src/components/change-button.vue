<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
        <div class="button">
            <button @click="setMapStyle(0)" class="button1">地图</button>
            <button @click="setMapStyle(1)" class="button2">卫星图像</button>
        </div>
        <div class="slider">
            <div class="slider-demo-block">
                <el-slider v-model="selectedIndex" :step="1" :min="0" :max="urls.length - 1" show-stops show-tooltip
                    :format-tooltip="formatTooltip" />

            </div>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const formatTooltip = (val: number) => {
    // 根据刻度的值返回您想要显示的文本内容
    const labels = ["文本1", "文本2", "文本3"]; // 与刻度对应的文本
    return labels[val];
};

const mapContainer = ref(null);

const mapStyles = [
    'mapbox://styles/1063816178/cll7d4s0000aj01pucz772ohj',
    'mapbox://styles/mapbox/satellite-v9',
];

const setMapStyle = (styleIndex: number) => {
    map!.setStyle(mapStyles[styleIndex]);
};

const urls = ref<string[]>([
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1",
    "http://localhost:8080/geoserver/topp/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=topp:states"
]);

const selectedIndex = ref(0); // 当前选择的索引
const selectedUrl = computed(() => {
    return urls.value[selectedIndex.value];
});

let map: mapboxgl.Map | null = null; // 使用 mapboxgl.Map 类型

onMounted(() => {
    if (mapContainer.value) {
        mapboxgl.accessToken = "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";

        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: mapStyles[0],
            center: [121.387899486, 31.09916171],
            zoom: 3,
        }); // 添加类型注释

        if (map) {
            // 添加地图加载完成事件监听器
            map.on("load", function () {
                // 创建数据源
                map!.addSource('wms-test-source', {
                    type: 'raster',
                    tiles: [selectedUrl.value],
                    tileSize: 256
                });

                // 创建图层
                map!.addLayer({
                    id: 'wms-test-layer',
                    type: 'raster',
                    source: 'wms-test-source',
                    paint: {}
                });
            });

            // 添加导航控件
            map.addControl(new mapboxgl.NavigationControl());
        }
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

.el-popper.is-customized {
    /* Set padding to ensure the height is 32px */
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
    background: linear-gradient(45deg, #b2e68d, #bce689);
    right: 0;
}

.button {
    margin: 30px;
    z-index: 0;
    position: absolute;
    cursor: pointer;
    right: 20px;
    top: 0px;
}

.button1, .button2{
    background: none padding-box rgb(255, 255, 255);
    border: 0px;
    margin: 0px;
    padding: 0px 17px;
    cursor: pointer;
    height: 28px;
    font-size: 12px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
    transition: background-color 0.3s ease; /* 添加过渡效果，使颜色变化平滑 */
}

.button1:hover, .button2:hover {
    background-color:  #CCCCCC; /* 鼠标悬停时的按钮颜色（灰色） */
}



</style>
  