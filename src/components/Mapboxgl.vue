<template>
    <div v-if="isDesktop">
        <!-- 电脑端的导航菜单内容 -->
        <div>

            <LoadingOverlay v-if="isLoading" />
            <div ref="mapContainer" class="map-container"></div>

            <div>
                <!-- 引用 Menu.vue 组件，并通过 props 传递 updateLevels 方法 -->
                <Menu :updateLevels="updateLevels" @selectChange="handleSelectChange" @confirm="handleConfirm"
                    @generateMap="handleGenerateMap" @generateMap2="handleGenerateMap2" @exportMap="handleExportMap"
                    @updateActiveTab="handleUpdateActiveTab" @updateSpeed="handleUpdateSpeed" />
                <!-- 在这里使用选择框的值 -->
                <!-- <div class="test-show">
                    <p>1：{{ selectedLevels[0] }}</p>
                    <p>2：{{ selectedLevels[1] }}</p>
                    <p>3：{{ selectedLevels[2] }}</p>
                    <p>相乘结果：{{ multiplicationResult }}</p>
                </div> -->
            </div>

            <!-- 加载进度 -->
            <!-- <div>
                <div class="progress-container">
                    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
                </div>
            </div> -->

            <div class="wave-container" v-if="isLoading">
                <div class="wave-change" :style="{ top: waveTop + 'px' }"></div>
                <div class="wave"></div>
            </div>
            <div class="wave-text" v-if="isLoading">模型生成中，请稍候</div>


            <div class="color-container">
                <div class="color-intro">淹没深度(单位m)</div>
                <div class="color-bar">
                    <color></color>
                </div>
            </div>

            <div class="map-modify-container">
                <div class="button">
                    <button @click="setMapStyle(0)" class="button1">地图</button>
                    <button @click="setMapStyle(1)" class="button2">卫星图像</button>
                </div>
            </div>

            <button @click="flyToLocation" class="fly-button">
                <img src="@/assets/icons/导航.svg" alt="导航图标" class="icon-center" style="width: 17px; height: 17px;" />
            </button>

            <div class="inundation-simulate-slide" v-if="activeTab === 1">
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
    </div>

    <!-- 移动端的内容 -->
    <div v-else>
        <div>
            <LoadingOverlay v-if="isLoading" />
            <div ref="mapContainer" class="map-container"></div>
            <div>
                <!-- 引用 Menu.vue 组件，并通过 props 传递 updateLevels 方法 -->
                <Menu :updateLevels="updateLevels" @selectChange="handleSelectChange" @confirm="handleConfirm"
                    @generateMap="handleGenerateMap" @generateMap2="handleGenerateMap2" @exportMap="handleExportMap"
                    @updateActiveTab="handleUpdateActiveTab" @updateSpeed="handleUpdateSpeed" />
                <!-- 在这里使用选择框的值 -->
                <!-- <div class="test-show">
                    <p>1：{{ selectedLevels[0] }}</p>
                    <p>2：{{ selectedLevels[1] }}</p>
                    <p>3：{{ selectedLevels[2] }}</p>
                    <p>相乘结果：{{ multiplicationResult }}</p>
                </div> -->
            </div>

            <div class="wave-container" v-if="isLoading">
                <div class="wave-change" :style="{ top: waveTop + 'px' }"></div>
                <div class="wave"></div>
            </div>
            <div class="wave-text" v-if="isLoading">模型生成中，请稍候</div>

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

            <div class="inundation-simulate-slide" v-if="activeTab === 1">
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
    </div>
</template>
  
<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch, onUnmounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import LoadingOverlay from '../components/LoadingOverlay.vue'; // 导入加载中提示组件
import type { CSSProperties } from 'vue'
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import color from '@/components/colorcanvas.vue'
import Menu from '@/components/Menu.vue';
import { state } from '@/components/store';


// 检查设备类型
const isMobile = window.innerWidth <= 768; // 设定屏幕宽度小于等于768px为移动端

// 电脑端和移动端的初始坐标
const desktopCenter: [number, number] = [121.017899486, 31.01916171]; // 电脑端初始坐标
const mobileCenter: [number, number] = [121.434708, 31.260416]; // 移动端初始坐标 (可以替换为你想要的坐标)

const desktopZoom = 8.5; // 电脑端的初始zoom级别
const mobileZoom = 7.6;   // 移动端的初始zoom级别 (可以调整)

const initialCenter: [number, number] = isMobile ? mobileCenter : desktopCenter; // 根据设备类型选择中心坐标
const initialZoom = isMobile ? mobileZoom : desktopZoom;       // 根据设备类型选择zoom级别

const isLoading = ref(false); // 控制加载状态

const activeTab = ref(0); // Default to the first tab

const handleUpdateActiveTab = (tab) => {
    activeTab.value = tab;
};
const selectedLevels = ref(['', '', '']);
const multiplicationResult = ref(0); // 默认值为1，确保初始值不影响相乘结果

// 更新选择框的值的方法
const updateLevels = (levels) => {
    selectedLevels.value = levels;
};

const handleSelectChange = (levels) => {
    console.log('Selected Levels in Map.vue:', levels);
    selectedLevels.value = levels;
};

const handleConfirm = (result) => {
    console.log('Multiplication Result in Map.vue:', result);
    multiplicationResult.value = result;
};

// 处理生成地图按钮点击的方法
/* const handleGenerateMap = () => {
    // Check if multiplicationResult.value is within a valid range
    if (multiplicationResult.value >= 1 && multiplicationResult.value <= 125) {
        // Construct the array name dynamically
        const selectedMapArrayName = `mapArrays${multiplicationResult.value}`;

        if (mapArrays[selectedMapArrayName]) {
            urls.value = mapArrays[selectedMapArrayName];
        } else {
            console.error(`Map array with name ${selectedMapArrayName} does not exist.`);
        }
        // Check if the dynamically constructed array exists in mapArrays
        if (selectedMapArrayName in mapArrays) {
            ElMessage.success('正在生成中,请稍后……');

            const selectedMapArray = mapArrays[selectedMapArrayName];
            console.log('Selected Map Array:', selectedMapArray);

            // Remove existing layers and sources
            layerNames.forEach(layerId => {
                if (map.getLayer(layerId)) {
                    map.removeLayer(layerId);
                }
            });

            sourceNames.forEach(sourceId => {
                if (map.getSource(sourceId)) {
                    map.removeSource(sourceId);
                }
            });


            // Call modifyMapLayers with the selected URLs
            // 初始化地图
            isLoading.value = true; // 地图加载中，显示LoadingOverlay
            progress.value = 0;
            startAutoLoad();
            // 初始化地图
            initMap();

            map?.on('load', () => {
                playTimeSliderOnce(); // 在地图加载完成后自动播放时间进度条
                flyToLocation();
            });

        } else {
            console.error(`Array ${selectedMapArrayName} does not exist in mapArrays.`);
            ElMessage.error('服务器内的数据分别包含降雨、水位和潮位一级至五级的数据，你选择的数据还未录入服务器。')
        }
    } else {
        ElMessage.error('服务器内不存在的数据')
    }
}; */

const handleGenerateMap = () => {
    // 直接使用 mapArrays27
    const selectedMapArrayName = 'mapArrays27';

    if (mapArrays[selectedMapArrayName]) {
        urls.value = mapArrays[selectedMapArrayName];
    } else {
        console.error(`Map array with name ${selectedMapArrayName} does not exist.`);
    }

    // Check if the selected map array exists in mapArrays
    if (selectedMapArrayName in mapArrays) {
        ElMessage.success('正在生成中,请稍后……');

        const selectedMapArray = mapArrays[selectedMapArrayName];
        console.log('Selected Map Array:', selectedMapArray);

        // Remove existing layers and sources
        layerNames.forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
        });

        sourceNames.forEach(sourceId => {
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        });

        // 初始化地图
        isLoading.value = true; // 地图加载中，显示LoadingOverlay
        progress.value = 0;
        startAutoLoad();
        // 初始化地图
        initMap();

        map?.on('load', () => {
            playTimeSliderOnce(); // 在地图加载完成后自动播放时间进度条
            flyToLocation();
        });

    } else {
        console.error(`Array ${selectedMapArrayName} does not exist in mapArrays.`);
        ElMessage.error('服务器内的数据分别包含降雨、水位和潮位一级至五级的数据，你选择的数据还未录入服务器。');
    }
};

let selectedMapURLs = ref([]); // Variable to hold the selected map URLs for export

const handleGenerateMap2 = () => {
    // Check if multiplicationResult.value is within a valid range
    if (multiplicationResult.value >= 1 && multiplicationResult.value <= 125) {
        // Construct the array name dynamically
        const selectedMapArrayName = `maxmapArrays${multiplicationResult.value}`;

        if (maxmapArrays[selectedMapArrayName]) {
            urls.value = maxmapArrays[selectedMapArrayName];
            selectedMapURLs.value = maxmapArrays[selectedMapArrayName]; // Store for export
        } else {
            console.error(`Map array with name ${selectedMapArrayName} does not exist.`);
        }
        // Check if the dynamically constructed array exists in mapArrays
        if (selectedMapArrayName in maxmapArrays) {
            const selectedMapArray = maxmapArrays[selectedMapArrayName];
            console.log('Selected Map Array:', selectedMapArray);

            // Remove existing layers and sources
            layerNames.forEach(layerId => {
                if (map.getLayer(layerId)) {
                    map.removeLayer(layerId);
                }
            });

            sourceNames.forEach(sourceId => {
                if (map.getSource(sourceId)) {
                    map.removeSource(sourceId);
                }
            });

            // Call modifyMapLayers with the selected URLs
            modifyMapLayers(map, selectedMapArray, layerNames, sourceNames);

        } else {
            console.error(`Array ${selectedMapArrayName} does not exist in mapArrays.`);
        }
    } else {
        console.error("Invalid multiplicationResult.value. It should be between 1 and 125.");
    }
};

const handleExportMap = (format) => {
    if (selectedMapURLs.value.length === 0) {
        console.error("No map URLs available for export.");
        return;
    }

    selectedMapURLs.value.forEach((url, index) => {
        // Replace format parameter in the URL
        let modifiedUrl = url.replace(/format=image\/\w+/, `format=${format === 'TIFF' ? 'image/tiff' : 'image/png'}`);
        console.log('Modified URL for download:', modifiedUrl);

        // Fetch the map image from the modified URL
        fetch(modifiedUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch map image from URL: ${modifiedUrl}`);
                }
                return response.blob(); // Get the image blob
            })
            .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = `map_${index}.${format.toLowerCase()}`; // Name the files sequentially
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl); // Clean up the object URL
            })
            .catch(error => {
                console.error('Error during map export:', error);
            });

    });
};


const maxmapArrays = {
    maxmapArrays1: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_R0_T0'],
    maxmapArrays2: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_R0_Tf0d30'],
    maxmapArrays3: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_R0_Tz0d20'],
    maxmapArrays4: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_R0_Tz0d50'],
    maxmapArrays5: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_R0_Tz0d80'],
    maxmapArrays6: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf10_T00'],
    maxmapArrays7: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf10_Tf0d30'],
    maxmapArrays8: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf10_Tz0d20'],
    maxmapArrays9: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf10_Tz0d50'],
    maxmapArrays10: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf10_Tz0d80'],
    maxmapArrays11: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf30_T00'],
    maxmapArrays12: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf30_Tf0d30'],
    maxmapArrays13: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf30_Tz0d20'],
    maxmapArrays14: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf30_Tz0d50'],
    maxmapArrays15: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rf30_Tz0d80'],
    maxmapArrays16: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz20_T00'],
    maxmapArrays17: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz20_Tf0d30'],
    maxmapArrays18: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz20_Tz0d20'],
    maxmapArrays19: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz20_Tz0d50'],
    maxmapArrays20: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz20_Tz0d80'],
    maxmapArrays21: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz40_T00'],
    maxmapArrays22: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz40_Tf0d30'],
    maxmapArrays23: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz40_Tz0d20'],
    maxmapArrays24: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz40_Tz0d50'],
    maxmapArrays25: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:P0_Rz40_Tz0d80'],
    maxmapArrays26: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_R0_T00'],
    maxmapArrays27: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_R0_Tf0d30'],
    maxmapArrays28: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_R0_Tz0d20'],
    maxmapArrays29: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_R0_Tz0d50'],
    maxmapArrays30: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_R0_Tz0d80'],
    maxmapArrays31: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf10_T00'],
    maxmapArrays32: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf10_Tf0d30'],
    maxmapArrays33: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf10_Tz0d20'],
    maxmapArrays34: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf10_Tz0d50'],
    maxmapArrays35: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf10_Tz0d80'],
    maxmapArrays36: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf30_T00'],
    maxmapArrays37: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf30_Tf0d30'],
    maxmapArrays38: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf30_Tz0d20'],
    maxmapArrays39: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf30_Tz0d50'],
    maxmapArrays40: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rf30_Tz0d80'],
    maxmapArrays41: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz20_T00'],
    maxmapArrays42: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz20_Tf0d30'],
    maxmapArrays43: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz20_Tz0d20'],
    maxmapArrays44: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz20_Tz0d50'],
    maxmapArrays45: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz20_Tz0d80'],
    maxmapArrays46: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz40_T00'],
    maxmapArrays47: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz40_Tf0d30'],
    maxmapArrays48: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz40_Tz0d20'],
    maxmapArrays49: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz40_Tz0d50'],
    maxmapArrays50: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf10_Rz40_Tz0d80'],
    maxmapArrays51: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_R0_T00'],
    maxmapArrays52: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_R0_Tf0d30'],
    maxmapArrays53: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_R0_Tz0d20'],
    maxmapArrays54: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_R0_Tz0d50'],
    maxmapArrays55: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_R0_Tz0d80'],
    maxmapArrays56: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf10_T00'],
    maxmapArrays57: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf10_Tf0d30'],
    maxmapArrays58: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf10_Tz0d20'],
    maxmapArrays59: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf10_Tz0d50'],
    maxmapArrays60: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf10_Tz0d80'],
    maxmapArrays61: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf30_T00'],
    maxmapArrays62: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf30_Tf0d30'],
    maxmapArrays63: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf30_Tz0d20'],
    maxmapArrays64: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf30_Tz0d50'],
    maxmapArrays65: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rf30_Tz0d80'],
    maxmapArrays66: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz20_T00'],
    maxmapArrays67: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz20_Tf0d30'],
    maxmapArrays68: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz20_Tz0d20'],
    maxmapArrays69: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz20_Tz0d50'],
    maxmapArrays70: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz20_Tz0d80'],
    maxmapArrays71: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz40_T00'],
    maxmapArrays72: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz40_Tf0d30'],
    maxmapArrays73: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz40_Tz0d20'],
    maxmapArrays74: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz40_Tz0d50'],
    maxmapArrays75: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pf20_Rz40_Tz0d80'],
    maxmapArrays76: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_R0_T00'],
    maxmapArrays77: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_R0_Tf0d30'],
    maxmapArrays78: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_R0_Tz0d20'],
    maxmapArrays79: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_R0_Tz0d50'],
    maxmapArrays80: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_R0_Tz0d80'],
    maxmapArrays81: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf10_T00'],
    maxmapArrays82: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf10_Tf0d30'],
    maxmapArrays83: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf10_Tz0d20'],
    maxmapArrays84: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf10_Tz0d50'],
    maxmapArrays85: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf10_Tz0d80'],
    maxmapArrays86: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf30_T00'],
    maxmapArrays87: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf30_Tf0d30'],
    maxmapArrays88: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf30_Tz0d20'],
    maxmapArrays89: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf30_Tz0d50'],
    maxmapArrays90: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rf30_Tz0d80'],
    maxmapArrays91: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz20_T00'],
    maxmapArrays92: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz20_Tf0d30'],
    maxmapArrays93: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz20_Tz0d20'],
    maxmapArrays94: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz20_Tz0d50'],
    maxmapArrays95: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz20_Tz0d80'],
    maxmapArrays96: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz40_T00'],
    maxmapArrays97: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz40_Tf0d30'],
    maxmapArrays98: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz40_Tz0d20'],
    maxmapArrays99: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz40_Tz0d50'],
    maxmapArrays100: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz10_Rz40_Tz0d80'],
    maxmapArrays101: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_R0_T00'],
    maxmapArrays102: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_R0_Tf0d30'],
    maxmapArrays103: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_R0_Tz0d20'],
    maxmapArrays104: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_R0_Tz0d50'],
    maxmapArrays105: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_R0_Tz0d80'],
    maxmapArrays106: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf10_T00'],
    maxmapArrays107: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf10_Tf0d30'],
    maxmapArrays108: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf10_Tz0d20'],
    maxmapArrays109: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf10_Tz0d50'],
    maxmapArrays110: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf10_Tz0d80'],
    maxmapArrays111: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf30_T00'],
    maxmapArrays112: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf30_Tf0d30'],
    maxmapArrays113: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf30_Tz0d20'],
    maxmapArrays114: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf30_Tz0d50'],
    maxmapArrays115: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rf30_Tz0d80'],
    maxmapArrays116: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz20_T00'],
    maxmapArrays117: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz20_Tf0d30'],
    maxmapArrays118: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz20_Tz0d20'],
    maxmapArrays119: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz20_Tz0d50'],
    maxmapArrays120: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz20_Tz0d80'],
    maxmapArrays121: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz40_T00'],
    maxmapArrays122: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz40_Tf0d30'],
    maxmapArrays123: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz40_Tz0d20'],
    maxmapArrays124: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz40_Tz0d50'],
    maxmapArrays125: ['http://47.113.180.32:8090/geoserver/max/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=max:Pz30_Rz40_Tz0d80'],
};


// 地图地址数组
const mapArrays = {
    /* mapArrays125: [
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_0",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_32",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_66",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_167",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_179",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_215",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_220",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_225",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_228",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_229",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_230",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_232",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_233",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_234",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_235",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_236",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_237",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_238",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_239",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_240",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_241",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_242",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_243",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_244",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_245",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_246",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_247",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_248",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_249",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_250",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_251",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_252",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_253",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_254",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_255",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_256",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_257",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_292",
        "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:Pz30_Rz40_Tz0d8_384",
    ], */
    mapArrays27: ["http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:0",
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
    ],
    // Add more mapArraysX if needed
};

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
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: {
        style: {
            color: '#bce689',
        },
        label: '',
    },
    8: '',
    9: '',
    10: '',
    11: '',
    12: '',
    13: '',
    14: '',
    15: '',
    16: '',
    17: '',
    18: '',
    19: '',
    20: '',
    21: '',
    22: '',
    23: '',
    24: '',
    25: '',
    26: '',
    27: '',
    28: '',
    29: '',
    30: '',
    31: '',
    32: '',
    33: '',
    34: '',
    35: '',
    36: '',
    37: '',
    38: '',
})
const formatTooltip = (val: number) => {
    // 根据刻度的值返回您想要显示的文本内容
    const labels = ["事件发生", "00:00:00", "08:00:00", "16:30:00",
        "41:45:00", "44:45:00", "53:45:00", "55:00:00",
        "56:15:00", "57:00:00", "57:15:00", "57:30:00", "58:00:00", "58:15:00",
        "58:30:00", "58:45:00", "59:00:00", "59:15:00",
        "59:30:00", "59:45:00", "60:00:00", "60:15:00", "60:30:00", "60:45:00",
        "61:00:00", "61:15:00", "61:30:00", "61:45:00",
        "62:00:00", "62:15:00", "62:30:00", "62:45:00", "63:00:00", "63:15:00",
        "63:30:00", "63:45:00", "64:00:00", "64:15:00", "73:00:00", "96:00:00"]; // 与刻度对应的文本
    return `${labels[0]} --- ${labels[val + 1]}`;
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

const urls = ref<string[]>([
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test254",
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

        console.log(sourceNames.length);

        console.log('Final Layer Names Array: ', layerNames);

    });
};

//修改地图图层的函数
const modifyMapLayers = (map, selectedUrls, layerNames, sourceNames) => {
    if (!map) {
        return;
    }

    // Add new sources and layers based on selectedUrls
    selectedUrls.forEach((url, index) => {
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
const initMap = () => {
    if (mapContainer.value) {
        if (map) {
            // 如果地图已存在，移除它
            map.remove();
        }

        // 检查设备类型
        const isMobile = window.innerWidth <= 768; // 设定屏幕宽度小于等于768px为移动端

        // 电脑端和移动端的初始坐标
        const desktopCenter: [number, number] = [121.017899486, 31.01916171]; // 电脑端初始坐标
        const mobileCenter: [number, number] = [121.434708, 31.260416]; // 移动端初始坐标 (可以替换为你想要的坐标)

        const desktopZoom = 8.5; // 电脑端的初始zoom级别
        const mobileZoom = 7.6;   // 移动端的初始zoom级别 (可以调整)

        const initialCenter: [number, number] = isMobile ? mobileCenter : desktopCenter; // 根据设备类型选择中心坐标
        const initialZoom = isMobile ? mobileZoom : desktopZoom;       // 根据设备类型选择zoom级别

        // 重新创建地图
        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: mapstyle, // 初始样式
            center: initialCenter,
            zoom: initialZoom,
            logoPosition: "bottom-right",   //移动至右下角
            attributionControl: false, // 隐藏商标信息
        });

        map.on('style.load', () => {
            initializeMapLayers(map, urls, layerNames, sourceNames);
        });

        console.log('Map initialized, Layer Names Array: ', layerNames);
        // 添加导航控件
        map.addControl(new mapboxgl.NavigationControl());
    }
};

//修改地图的函数
const modifyMap = () => {
    if (mapContainer.value) {

        map.on('style.load', () => {
            modifyMapLayers(map, urls, layerNames, sourceNames);
        });
    }
};

const initializeMap = () => {
    if (mapContainer.value) {
        if (map) {
            // 获取当前地图样式
            const currentStyle = map.getStyle();

            console.log('Removing layers and sources');

            // Check if currentStyle.sources is an array before iterating over it
            if (Array.isArray(currentStyle.sources)) {
                currentStyle.sources.forEach(source => {
                    if (source.id.startsWith('wms-test-source')) {
                        map.removeSource(source.id);
                    }
                });
            }

            // 移除现有的图层
            currentStyle.layers.forEach(layer => {
                if (layer.id.startsWith('wms-test-layer')) {
                    map.removeLayer(layer.id);
                }
            });

            map.on('style.load', () => {
                initializeMapLayers(map, urls, layerNames, sourceNames);
            });
        } else {
            // 如果地图不存在，创建新地图
            initMap();
        }
    }
};



const setstyleMap = () => {
    if (mapContainer.value) {
        if (map) {
            // 如果地图已存在，移除它
            map.remove();
        }

        // 重新创建地图
        map = new mapboxgl.Map({
            container: mapContainer.value,
            style: mapstyle, // 初始样式
            center: initialCenter,
            zoom: initialZoom,
            logoPosition: "bottom-right",   //移动至右下角
            attributionControl: false, // 隐藏商标信息
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
        setstyleMap();
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
    }, intervalTime.value); // 1秒间隔
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

const intervalTime = ref(500); // Default interval time (for 3.0x speed)

// Function to handle the speed update from Menu.vue
const handleUpdateSpeed = (newSpeed) => {
    intervalTime.value = newSpeed; // Update the interval time based on the selected speed
};


// 新增一个函数用于地图初始化后的自动播放
const playTimeSliderOnce = () => {
    const lastIndex = urls.value.length - 1; // 最后一个索引

    let i = 0;
    const intervalId = setInterval(() => {
        if (i <= lastIndex) {
            selectedIndex.value = i;
            i++;
        } else {
            clearInterval(intervalId); // 达到最后一个索引后清除定时器
            isLoading.value = false; // Hide the loading overlay after playback
        }
    }, 150);  // Use the dynamic interval time based on selected speed
};


const flyToLocation = () => {
    if (map) {

        // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画
        map.flyTo({
            center: initialCenter,
            zoom: initialZoom,
            essential: true // 如果启用，确保用户始终能看到飞行动画
        });
    }
};

const zoomToMinimum = () => {
    if (map) {
        if (map) {
            // 设置指定的经纬度和缩放级别
            const coordinates: [number, number] = [-121.387899486, 31.05916171];
            const zoomLevel = 1;

            // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画
            map.flyTo({
                center: coordinates,
                zoom: zoomLevel,
                essential: true // 如果启用，确保用户始终能看到飞行动画
            });
        }
    }
};



onMounted(() => {
    window.addEventListener('resize', handleResize)
    isLoading.value = true; // 地图加载中，显示LoadingOverlay
    // 初始化地图
    setstyleMap();
    map?.on('load', () => {
        playTimeSliderOnce(); // 在地图加载完成后自动播放时间进度条
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

const progress = ref(0);
const remainprogress = ref(100);
let interval: NodeJS.Timeout | null = null;

// 计算动画元素的top值
const waveTop = computed(() => {
    return 80 - (progress.value / 100) * 200;
});
// 监听进度值的变化
watch(progress, () => {
    // 进度值发生变化时更新动画元素的top值
    const waveChangeElement: HTMLElement = document.querySelector('.wave-change');
    if (waveChangeElement) {
        (waveChangeElement as HTMLElement).style.top = waveTop.value + 'px';
    }
});
// 开始自动加载
function startAutoLoad() {
    if (!interval) {
        interval = setInterval(() => {
            if (progress.value < 100) {
                progress.value += 1;
                remainprogress.value = 100 - progress.value;
            } else {
                clearInterval(interval!);
                interval = null;
            }
        }, 1000);
    }
}

// 停止自动加载
function stopAutoLoad() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

watch(selectedIndex, (newIndex, oldIndex) => {
    if (map) {
        // 更改当前图层的可见性为 'visible'
        map.setLayoutProperty('wms-test-layer' + newIndex, 'visibility', 'visible');

        // 将上一个图层的可见性设为 'none'
        if (oldIndex !== null) {
            map.setLayoutProperty('wms-test-layer' + oldIndex, 'visibility', 'none');
        }

        stopAutoLoad();
        console.log(newIndex);
        console.log(layerNames.length)
        progress.value = (100 - remainprogress.value) + ((newIndex + 1) / urls.value.length) * remainprogress.value;

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
    .wave-container {
        position: absolute;
        width: 200px;
        height: 200px;
        padding: 5px;
        border: 5px solid rgb(118, 218, 255);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;
        z-index: 999;
    }

    .wave-change {
        position: absolute;
        width: 200px;
        height: 200px;
        left: 0;
        top: 80px;
        animation: change 12s infinite linear;

        &::before,
        &::after {
            content: "";
            position: absolute;
            width: 400px;
            height: 400px;
            top: 0;
            left: 50%;
            background-color: rgba(255, 255, 255, .6);
            border-radius: 45% 47% 43% 46%;
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 7s linear infinite;
            z-index: 1;
        }

        &::after {
            border-radius: 47% 42% 46% 44%;
            background-color: rgba(255, 255, 255, .8);
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 9s linear -4s infinite;
            z-index: 2;
        }
    }

    .wave {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: rgb(118, 218, 255);
        border-radius: 50%;

    }

    p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 36px;
        color: #000;
        z-index: 10;
    }

    .wave-text {
        position: absolute;
        top: 67vh;
        left: 49vw;
        transform: translate(-50%, -50%);
        z-index: 999;
        font-weight: bold;
    }

    @keyframes rotate {
        50% {
            transform: translate(-50%, -73%) rotate(180deg);
        }

        100% {
            transform: translate(-50%, -70%) rotate(360deg);
        }
    }


    .progress-container {
        width: 100%;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 4px;
        margin-bottom: 10px;
        position: relative;
    }

    .progress-bar {
        height: 100%;
        background-color: #4caf50;
        border-radius: 4px;
        transition: width 0.3s ease-in-out;
        /* 添加过渡效果 */
        position: relative;
    }

    .progress-text {
        position: absolute;
        left: 50%;
        color: rgb(19, 19, 19);
    }



    .map-container {
        margin-top: 8.4vh;
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

    .map-modify-container {
        position: absolute;
        top: 9vh;
        right: 0.2vw;
    }

    .fly-button {
        z-index: 1;
        /* 提高按钮的层级，确保其位于地图上方 */
        position: absolute;
        cursor: pointer;
        top: 13vh;
        right: 0.2vw;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 6px 12px;
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

    .wave-container {
        position: absolute;
        width: 200px;
        height: 200px;
        padding: 5px;
        border: 5px solid rgb(118, 218, 255);
        top: 42vh;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;
        z-index: 999;
    }

    .wave-change {
        position: absolute;
        width: 200px;
        height: 200px;
        left: 0;
        top: 80px;
        animation: change 12s infinite linear;

        &::before,
        &::after {
            content: "";
            position: absolute;
            width: 400px;
            height: 400px;
            top: 0;
            left: 50%;
            background-color: rgba(255, 255, 255, .6);
            border-radius: 45% 47% 43% 46%;
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 7s linear infinite;
            z-index: 1;
        }

        &::after {
            border-radius: 47% 42% 46% 44%;
            background-color: rgba(255, 255, 255, .8);
            transform: translate(-50%, -70%) rotate(0);
            animation: rotate 9s linear -4s infinite;
            z-index: 2;
        }
    }

    .wave {
        position: relative;
        width: 200px;
        height: 200px;
        background-color: rgb(118, 218, 255);
        border-radius: 50%;

    }

    p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 36px;
        color: #000;
        z-index: 10;
    }

    .wave-text {
        position: absolute;
        top: 59vh;
        left: 47vw;
        transform: translate(-50%, -50%);
        z-index: 999;
        font-weight: bold;

    }

    @keyframes rotate {
        50% {
            transform: translate(-50%, -73%) rotate(180deg);
        }

        100% {
            transform: translate(-50%, -70%) rotate(360deg);
        }
    }

    /* 移动端的样式 */
    .map-container {
        margin-top: 7vh;
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
        font-size: small;
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
        top: 10vh;
    }

    .button1,
    .button2 {
        background: none padding-box rgb(255, 255, 255);
        border: 0px;
        margin: 0px;
        position: relative;
        top: 63vh;
        padding: 0px 17px;
        cursor: pointer;
        height: 28px;
        font-size: 12px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        /* background-color: #CCCCCC; */
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
        right: 5px;
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
  