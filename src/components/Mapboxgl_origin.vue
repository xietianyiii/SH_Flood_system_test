<template>
    <div v-if="isDesktop">
        <!-- 电脑端的导航菜单内容 -->
        <div>
            <LoadingOverlay v-if="isLoading" />
            <div ref="mapContainer" class="map-container"></div>
            <div class="color-container">
                <div class="color-intro">淹没深度(单位m)</div>
                <div class="color-bar">
                    <color></color>
                </div>
            </div>
            <div class="button">
                <button @click="setMapStyle(0)" class="button1">地图</button>
                <button @click="setMapStyle(1)" class="button2">卫星图像</button>
            </div>
            <button @click="flyToLocation" class="fly-button">
                <img src="@/assets/icons/导航.svg" alt="导航图标" class="icon-center" style="width: 17px; height: 17px;" />
            </button>

            <el-card shadow="always" class="tipcard"> {{ formatTooltip(selectedIndex) }} </el-card>
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
    </div>

    <!-- 移动端的内容 -->
    <div v-else>
        <div>
            <LoadingOverlay v-if="isLoading" />
            <div ref="mapContainer" class="map-container"></div>
            <div class="color-container">
                <div class="color-intro">淹没深度(单位m)</div>
                <div class="color-bar">
                    <color></color>
                </div>
            </div>
            <div class="button">
                <button @click="setMapStyle(0)" class="button1">地图</button>
                <button @click="setMapStyle(1)" class="button2">卫星图像</button>
            </div>
            <button @click="flyToLocation" class="fly-button">
                <img src="@/assets/icons/导航.svg" alt="导航图标" class="icon-center" style="width: 17px; height: 17px;" />
            </button>

            <el-card shadow="always" class="tipcard"> {{ formatTooltip(selectedIndex) }} </el-card>
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
    </div>
</template>
  
<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch, onUnmounted, onBeforeUnmount } from 'vue';
import LoadingOverlay from '../components/LoadingOverlay.vue'; // 导入加载中提示组件
import type { CSSProperties } from 'vue'
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import color from '@/components/colorcanvas.vue'

const isDesktop = ref(window.innerWidth >= 768)
const handleResize = () => {
    isDesktop.value = window.innerWidth >= 768
}

mapboxgl.accessToken = "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";

interface Mark {
    style: CSSProperties
    label: string
}

type Marks = Record<number, Mark | string>

const marks = reactive<Marks>({
    0: '08',
    1: '09',
    2: '10',
    3: '11',
    4: '12',
    5: '13',
    6: '14',
    7: {
        style: {
            color: '#bce689',
        },
        label: '15:00',
    },
    8: '16',
    9: '17',
    10: '18',
    11: '19',
    12: '20',
    13: '21',
    14: '22',
    15: '23',
    16: '00',
    17: '01',
    18: '02',
    19: '03',
    20: '04',
    21: '05',
    22: '06',
    23: '07',
    24: '08',
    25: '09',
    26: '10',
    27: '11',
    28: '12',
    29: '13',
    30: '14',
    31: '15',
    32: '16',
    33: '17',
    34: '18',
    35: '19',
    36: '20',
    37: '21',
    38: '22',
})
const formatTooltip = (val: number) => {
    // 根据刻度的值返回您想要显示的文本内容
    const labels = ["2023/08/13 08:00", "2023/08/13 09:00", "2023/08/13 10:00", "2023/08/13 11:00",
        "2023/08/13 12:00", "2023/08/13 13:00", "2023/08/13 14:00", "2023/08/13 15:00",
        "2023/08/13 16:00", "2023/08/13 17:00", "2023/08/13 08:00", "2023/08/13 09:00", "2023/08/13 10:00", "2023/08/13 11:00",
        "2023/08/13 12:00", "2023/08/13 13:00", "2023/08/13 14:00", "2023/08/13 15:00",
        "2023/08/13 16:00", "2023/08/13 17:00", "2023/08/13 08:00", "2023/08/13 09:00", "2023/08/13 10:00", "2023/08/13 11:00",
        "2023/08/13 12:00", "2023/08/13 13:00", "2023/08/13 14:00", "2023/08/13 15:00",
        "2023/08/13 16:00", "2023/08/13 17:00", "2023/08/13 08:00", "2023/08/13 09:00", "2023/08/13 10:00", "2023/08/13 11:00",
        "2023/08/13 12:00", "2023/08/13 13:00", "2023/08/13 14:00", "2023/08/13 15:00", "2023/08/13 16:00",]; // 与刻度对应的文本
    return labels[val];
};

const mapContainer = ref<HTMLElement | null>(null);

const mapStyles = [
    'mapbox://styles/1063816178/cll7d4s0000aj01pucz772ohj',
    'mapbox://styles/1063816178/clj8ckm2t003301rdejthfz81',
];
var mapstyle = mapStyles[0];
// 创建一个数组来存储图层名称
const layerNames: string[] = [];
const sourceNames: string[] = [];

const urls = ref<string[]>(["http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:0",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test032",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test066",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test167",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test179",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test215",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test220",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test225",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test228",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2291",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test230",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test232",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test233",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test234",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test235",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test236",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test237",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2381",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test239",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test240",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2411",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test242",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2431",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test244",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2451",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test246",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2471",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test248",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test249",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test250",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test251",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test252",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test253",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test254",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:2551",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test256",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test257",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test292",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:384",
]);


const initializeMapLayers = (map, urls, layerNames, sourceNames) => {
    if (!map) {
        return;
    }

    mapboxgl.accessToken = "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";

    urls.value.forEach((url, index) => {
        const sourceId = 'wms-test-source' + index;
        const layerId = 'wms-test-layer' + index;

        // 添加数据源
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [url],
            tileSize: 256
        });

        // 添加图层
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {},
            layout: {
                visibility: 'visible'
            }
        });

        // 将图层名称存储到数组中
        layerNames.push(layerId);
        sourceNames.push(sourceId);
    });
}; 

// 初始化地图的函数
const initializeMap = () => {
    if (mapContainer.value) {
        if (map) {
            // 如果地图已存在，移除它
            map.remove();
        }

        // 重新创建地图
        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: mapstyle, // 初始样式
            center: [121.417899486, 31.01916171],
            zoom: 7.7,
            logoPosition: "bottom-right",   //移动至右下角
            attributionControl: false, // 隐藏商标信息
        });

        map.on('style.load', () => {
            initializeMapLayers(map, urls, layerNames, sourceNames);
        });


        // 添加导航控件
        map.addControl(new mapboxgl.NavigationControl());
    }
};

const setMapStyle = (styleIndex: number) => {
    if (map) {
        // 设置新的地图样式
        mapstyle = mapStyles[styleIndex];
        // 初始化地图
        initializeMap();
    }
};


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
    }, 200); // 1秒间隔
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
    } else if (selectedIndex.value === 0) {
        selectedIndex.value = 0; // 从头开始播放
        toggleIcon();
        toggleAutoSlide();
    } else {
        toggleIcon();
        toggleAutoSlide();
    }
};


// 新增一个函数用于地图初始化后的自动播放
const playTimeSliderOnce = () => {
    const lastIndex = urls.value.length - 1; // 最后一个索引

    // 设置一个定时器，每隔一段时间自动切换时间进度条
    let i = 0;
    const intervalId = setInterval(() => {
        if (i <= lastIndex) {
            selectedIndex.value = i;
            i++;
        } else {
            clearInterval(intervalId); // 达到最后一个索引后清除定时器
            // 在播放完成后设置一个延迟，然后隐藏 LoadingOverlay
            isLoading.value = false;
            //selectedIndex.value = 0; // 重置进度条为0
        }
    }, 100); // 这里的 1000 是切换间隔时间，可以根据需要调整
};

const flyToLocation = () => {
    if (map) {
        // 设置指定的经纬度和缩放级别
        const coordinates: [number, number] = [121.387899486, 31.05916171];
        const zoomLevel = 7.5;

        // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画
        map.flyTo({
            center: coordinates,
            zoom: zoomLevel,
            essential: true // 如果启用，确保用户始终能看到飞行动画
        });
    }
};

const isLoading = ref(true); // 控制加载状态

onMounted(() => {
    window.addEventListener('resize', handleResize)
    isLoading.value = true; // 地图加载中，显示LoadingOverlay
    // 初始化地图
    initializeMap();
    map?.on('load', () => {
        playTimeSliderOnce(); // 在地图加载完成后自动播放时间进度条
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

watch(selectedIndex, (newIndex, oldIndex) => {
    if (map) {
        // 更改当前图层的可见性为 'visible'
        map.setLayoutProperty('wms-test-layer' + newIndex, 'visibility', 'visible');

        // 将上一个图层的可见性设为 'none'
        if (oldIndex !== null) {
            map.setLayoutProperty('wms-test-layer' + oldIndex, 'visibility', 'none');
        }
    }
});

onUnmounted(() => {
    if (map) {
        map.remove();
    }
});
</script>
  
<style scoped>
/* 响应式设计 - 电脑端 */
@media screen and (min-width: 768px) {

    /* 电脑端的样式 */
    .map-container {
        width: 100vw;
        height: 91.6vh;
    }

    .slider-demo-block {
        background: rgba(1, 15, 25, .698);
        border-radius: 13px;
        position: absolute;
        bottom: 3vh;
        transition: all .5s linear;
        display: flex;
        width: calc(100% - 25vw);
        height: 10vh;
        top: 88vh;
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

    .tipcard {
        border-radius: 10px;
        position: absolute;
        bottom: 4.2vh;
        transition: all .5s linear;
        display: flex;
        width: 200px;
        height: 50px;
        top: 81vh;
        left: 3.6458333333vw;
        align-items: center;
        user-select: none;
        /* 阻止文本选择 */
        color: black;
    }

    .tipcard:hover {
        box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);

        border: 1px solid #b2e68d;
        /* 添加 2 像素宽的金边 */
    }

    .button {
        margin: 30px;
        z-index: 0;
        position: absolute;
        cursor: pointer;
        right: -20px;
        top: 46px;
    }

    .button1,
    .button2 {
        background: none padding-box rgb(255, 255, 255);
        border: 0px;
        margin: 0px;
        padding: 0px 17px;
        cursor: pointer;
        height: 28px;
        font-size: 12px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        transition: background-color 0.3s ease;
        /* 添加过渡效果，使颜色变化平滑 */
    }

    .button1:hover,
    .button2:hover {
        background-color: #CCCCCC;
        /* 鼠标悬停时的按钮颜色（灰色） */
    }

    .fly-button {
        z-index: 1;
        /* 提高按钮的层级，确保其位于地图上方 */
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 120px;
        background-color: #fff;
        /* 设置背景颜色为白色 */
        border: 1px solid #ccc;
        /* 添加边框 */
        border-radius: 4px;
        /* 添加边框圆角 */
        padding: 6px 12px;
        /* 调整内边距 */
        width: 29px;
        height: 29px;
        font-size: 14px;
        text-align: center;
        box-shadow: rgba(0.5, 0.5, 0.5, 0.3) 0px 2px 6px -1px;
        transition: background-color 0.3s ease, border 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        /* 添加边框颜色过渡效果 */
    }

    .icon-center {
        font-size: 17px;
    }

    .fly-button:hover {
        background-color: #f0f0f0;
        /* 鼠标悬停时的背景色 */
        border-color: #999;
        /* 鼠标悬停时的边框色 */
    }

    /* 移除按钮点击后的默认边框样式 */
    .fly-button:focus {
        outline: none;
    }

    .color-container {
        margin: 30px;
        z-index: 0;
        position: absolute;
        cursor: pointer;
        left: 80vw;
        top: 86.5vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

    }

    .color-intro {
        font-size: 15px;
        font-weight: bold;
        color: #333;
        margin-bottom: 3.5px;
    }

    :deep(.mapboxgl-ctrl) {
        display: none !important;
    }
}

/* 响应式设计 - 移动端 */
@media screen and (max-width: 767px) {

    /* 移动端的样式 */
    .map-container {
        width: 100vw;
        height: 93vh;
    }

    .slider-demo-block {
        background: rgba(1, 15, 25, .698);
        border-radius: 13px;
        position: absolute;
        bottom: 3vh;
        transition: all .5s linear;
        display: flex;
        width: calc(100% - 3vw);
        height: 10vh;
        top: 88vh;
        left: 1.5vw;
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

    .tipcard {
        border-radius: 10px;
        position: absolute;
        bottom: 4.2vh;
        transition: all .5s linear;
        display: flex;
        width: 190px;
        height: 6vh;
        top: 81.5vh;
        left: 1.5vw;
        align-items: center;
        user-select: none;
        /* 阻止文本选择 */
        color: black;
    }

    .tipcard:hover {
        box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);

        border: 1px solid #b2e68d;
        /* 添加 2 像素宽的金边 */
    }

    .button {
        margin: 30px;
        z-index: 0;
        position: absolute;
        cursor: pointer;
        left: -20px;
        top: 33px;
    }

    .button1,
    .button2 {
        background: none padding-box rgb(255, 255, 255);
        border: 0px;
        margin: 0px;
        padding: 0px 17px;
        cursor: pointer;
        height: 28px;
        font-size: 12px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        transition: background-color 0.3s ease;
        /* 添加过渡效果，使颜色变化平滑 */
    }

    .button1:hover,
    .button2:hover {
        background-color: #CCCCCC;
        /* 鼠标悬停时的按钮颜色（灰色） */
    }

    .Color-Card {
        margin: 30px;
        z-index: 0;
        position: absolute;
        cursor: pointer;
        left: -15px;
        top: 55px;
    }

    .Select-Card {
        margin: 30px;
        z-index: 0;
        position: absolute;
        cursor: pointer;
        right: 220px;
        top: 315px;
    }


    .fly-button {
        z-index: 1;
        /* 提高按钮的层级，确保其位于地图上方 */
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 70px;
        background-color: #fff;
        /* 设置背景颜色为白色 */
        border: 1px solid #ccc;
        /* 添加边框 */
        border-radius: 4px;
        /* 添加边框圆角 */
        padding: 6px 12px;
        /* 调整内边距 */
        width: 29px;
        height: 29px;
        font-size: 14px;
        text-align: center;
        box-shadow: rgba(0.5, 0.5, 0.5, 0.3) 0px 2px 6px -1px;
        transition: background-color 0.3s ease, border 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        /* 添加边框颜色过渡效果 */
    }

    .icon-center {
        font-size: 17px;
    }

    .fly-button:hover {
        background-color: #f0f0f0;
        /* 鼠标悬停时的背景色 */
        border-color: #999;
        /* 鼠标悬停时的边框色 */
    }

    /* 移除按钮点击后的默认边框样式 */
    .fly-button:focus {
        outline: none;
    }

    .color-container {
        margin: 30px;
        z-index: 0;
        position: absolute;
        cursor: pointer;
        left: 50vw;
        top: 78.5vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

    }

    .color-intro {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-bottom: -3.5px;
    }

    :deep(.mapboxgl-ctrl) {
        display: none !important;
    }
}
</style>
  