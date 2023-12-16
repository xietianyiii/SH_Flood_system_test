<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
        <el-card shadow="always" class="tipcard" >  {{ formatTooltip(selectedIndex) }} </el-card>
        <div class="slider">
            <div class="slider-demo-block">
                <el-button link circle class="btn-container" @click="toggleIconAndAutoSlide">
                    <el-icon v-if="showPlayIcon" :size="45" class="play">
                        <VideoPlay />
                    </el-icon>
                    <el-icon v-show="!showPlayIcon" :size="45" class="pause">
                        <VideoPause />
                    </el-icon>
                </el-button>
                <el-slider v-model="selectedIndex" :step="1" :min="0" :max="urls.length - 1" show-stops
                    :format-tooltip="formatTooltip" :marks="marks" class="custom-slider" />

            </div>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch, onUnmounted } from 'vue';
import type { CSSProperties } from 'vue'
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Mark {
    style: CSSProperties
    label: string
}

type Marks = Record<number, Mark | string>

const marks = reactive<Marks>({
    0: '08:00',
    1: '09:00',
    2: '10:00',
    3: '11:00',
    4: '12:00',
    5: '13:00',
    6: '14:00',
    7: {
        style: {
            color: '#bce689',
        },
        label: '15:00',
    },
    8: '16:00',
    9: '17:00',
    10: '18:00',
})
const formatTooltip = (val: number) => {
    // 根据刻度的值返回您想要显示的文本内容
    const labels = ["2023/08/13 08:00", "2023/08/13 09:00", "2023/08/13 10:00", "2023/08/13 11:00",
        "2023/08/13 12:00", "2023/08/13 13:00", "2023/08/13 14:00", "2023/08/13 15:00",
        "2023/08/13 16:00", "2023/08/13 17:00",]; // 与刻度对应的文本
    return labels[val];
};

const mapContainer = ref<HTMLElement | null>(null);

const urls = ref<string[]>([
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:hn-8-3857",
    "http://localhost:8080/geoserver/ne/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=ne:sh(wgs84)1",
]);

const selectedIndex = ref(0); // 当前选择的索引
const selectedUrl = computed(() => {
    return urls.value[selectedIndex.value];
});

let map: mapboxgl.Map | null = null; // 使用 mapboxgl.Map 类型

const showPlayIcon = ref(true);

const isPlaying = ref(false); // 是否正在播放
let intervalId: ReturnType<typeof setInterval> | null = null; // 定时器 ID

// 开始自动滑动
const startAutoSlide = () => {
    isPlaying.value = true;
    intervalId = setInterval(() => {
        if (selectedIndex.value < urls.value.length - 1) {
            selectedIndex.value++;
        } else {
            stopAutoSlide();
        }
    }, 1000); // 1秒间隔
};

// 停止自动滑动
const stopAutoSlide = () => {
    isPlaying.value = false;
    showPlayIcon.value = !showPlayIcon.value;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

// 当 selectedIndex 变化时停止自动滑动
watch(selectedIndex, () => {
    if (!isPlaying.value && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});

const toggleIcon = () => {
    showPlayIcon.value = !showPlayIcon.value;
    if (isPlaying.value) {
        stopAutoSlide();
    }
};

const toggleAutoSlide = () => {
    if (isPlaying.value) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
};

const toggleIconAndAutoSlide = () => {
    if (isPlaying.value) {
        toggleIcon();
        stopAutoSlide();
    } else if (selectedIndex.value === urls.value.length - 1) {
        selectedIndex.value = 0; // 从头开始播放
        toggleIcon();
        toggleAutoSlide();
    } else {
        toggleIcon();
        toggleAutoSlide();
    }
};


onMounted(() => {
    if (mapContainer.value) {
        mapboxgl.accessToken = "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";

        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: "mapbox://styles/1063816178/cll7d4s0000aj01pucz772ohj",
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
    margin-left: 20px;
    margin-right: 30px;
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

.btn-container {
    width: 50px;
    height: 50px;
    margin-left: 20px;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);

}

.tipcard{
    border-radius: 10px 210px / 120px;
    position: absolute;
    bottom: 4.2vh;
    right: 20px;
    transition: all .5s linear;
    display: flex;
    width: 200px;
    height: 50px;
    left: 80vw;
    align-items: center;
    user-select: none; /* 阻止文本选择 */
    color:black; 
    font-weight: bold;

}

.tipcard:hover{
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);
}

/* 自定义 el-slider 样式 */
</style>
  