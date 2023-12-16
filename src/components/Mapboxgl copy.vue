<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
        <div class="button">
            <button @click="setMapStyle(0)" class="button1">地图</button>
            <button @click="setMapStyle(1)" class="button2">卫星图像</button>
        </div>
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

const mapStyles = [
    'mapbox://styles/1063816178/cll7d4s0000aj01pucz772ohj',
    'mapbox://styles/1063816178/clj8ckm2t003301rdejthfz81',
];

const urls = ref<string[]>([
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:0",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2291",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2331",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2381",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2411",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2431",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2451",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2471",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:2551",
    "http://localhost:8080/geoserver/test/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=test:384",
]);

const setMapStyle = (styleIndex: number) => {
    if (map) {
        // 设置新的地图样式
        map.setStyle(mapStyles[styleIndex]);

        // 添加新的图层和数据源
        map.on("styledata", () => {
            map!.addSource('wms-test-source'+selectedIndex, {
                type: 'raster',
                tiles: [selectedUrl.value],
                tileSize: 256
            });

            map!.addLayer({
                id: 'wms-test-layer'+selectedIndex,
                type: 'raster',
                source: 'wms-test-source'+selectedIndex,
                paint: {}
            });
        });
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
            style: mapStyles[0],
            center: [121.387899486, 31.05916171],
            zoom: 8.2,
            attributionControl: false, // 隐藏商标信息
        }); 

        if (map) {
            // 添加地图加载完成事件监听器
            map.on("load", function () {
                // 创建数据源
                map!.addSource('wms-test-source-0', {
                    type: 'raster',
                    tiles: [selectedUrl.value],
                    tileSize: 256
                });

                // 创建图层
                map!.addLayer({
                    id: 'wms-test-layer-0',
                    type: 'raster',
                    source: 'wms-test-source-0',
                    'layout': {
                        // Make the layer visible by default.
                        'visibility': 'visible'
                    },
                    paint: {}
                });
            });

            // 添加导航控件
            map.addControl(new mapboxgl.NavigationControl());

        }
    }
});


watch(selectedIndex, (newIndex, oldIndex) => {
    if (map) {
        // 更改当前图层的可见性为 'visible'
        map.setLayoutProperty('wms-test-layer-' + newIndex, 'visibility', 'visible');
        
        // 将上一个图层的可见性设为 'none'
        if (oldIndex !== null) {
            map.setLayoutProperty('wms-test-layer-' + oldIndex, 'visibility', 'none');
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

.map-container {
    width: 100vw;
    height: 91.6vh;
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

.tipcard {
    border-radius: 10px 210px / 120px;
    position: absolute;
    bottom: 4.2vh;
    right: 20px;
    transition: all .5s linear;
    display: flex;
    width: 200px;
    height: 50px;
    left: 82vw;
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
    right: 50px;
    top: 55px;
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
  