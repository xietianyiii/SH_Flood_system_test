<template>
  <div v-if="isDesktop">
    <!-- 电脑端的导航菜单内容 -->
    <div>
      <LoadingOverlay v-if="isLoading" />
      <div ref="mapContainer" class="map-container"></div>

      <div>
        <!-- 引用 Menu.vue 组件，并通过 props 传递 updateLevels 方法 -->
        <Menu :updateLevels="updateLevels" @selectChange="handleSelectChange" @confirm="handleConfirm"
          @generateMap="handleGenerateMap" />

        <!-- 在这里使用选择框的值 -->
        <div class="test-show">
          <p>1：{{ selectedLevels[0] }}</p>
          <p>2：{{ selectedLevels[1] }}</p>
          <p>3：{{ selectedLevels[2] }}</p>
          <p>相乘结果：{{ multiplicationResult }}</p>
        </div>
      </div>

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

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch, onUnmounted, onBeforeUnmount } from 'vue';
import LoadingOverlay from '../components/LoadingOverlay.vue'; // 导入加载中提示组件
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import color from '@/components/colorcanvas.vue'
import Menu from '@/components/Menu.vue';

const selectedLevels = ref(['', '', '']);
const multiplicationResult = ref(0); // 默认值为1，确保初始值不影响相乘结果

// 更新选择框的值的方法
const updateLevels = (levels) => {
  selectedLevels.value = levels;
};

// 处理选择框值变化的方法
const handleSelectChange = (levels) => {
  console.log('Selected Levels in Map.vue:', levels);
};

// 处理确认按钮点击的方法
const handleConfirm = (result) => {
  console.log('Multiplication Result in Map.vue:', result);
  multiplicationResult.value = result; // 更新相乘结果
};

// 处理生成地图按钮点击的方法
const handleGenerateMap = () => {
  // Check if multiplicationResult.value is within a valid range
  if (multiplicationResult.value >= 1 && multiplicationResult.value <= 125) {
    // Construct the array name dynamically
    const selectedMapArrayName = `mapArrays${multiplicationResult.value}`;

    // Check if the dynamically constructed array exists in mapArrays
    if (selectedMapArrayName in mapArrays) {
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
      modifyMapLayers(map, selectedMapArray, layerNames, sourceNames);
    } else {
      console.error(`Array ${selectedMapArrayName} does not exist in mapArrays.`);
    }
  } else {
    console.error("Invalid multiplicationResult.value. It should be between 1 and 125.");
  }
};





// 地图地址数组
const mapArrays = {
  mapArrays1: [
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test032",
  ],
  mapArrays2: ["http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:0",
    "http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:30test032",
  
],
  // Add more mapArraysX if needed
};




const isDesktop = ref(window.innerWidth >= 768)
const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768
}

mapboxgl.accessToken = "pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA";


const mapContainer = ref<HTMLElement | null>(null);

const mapStyles = [
  'mapbox://styles/1063816178/cll7d4s0000aj01pucz772ohj',
  'mapbox://styles/1063816178/clj8ckm2t003301rdejthfz81',
];
var mapstyle = mapStyles[0];
// 创建一个数组来存储图层名称
const layerNames: string[] = [];
const sourceNames: string[] = [];

const urls = ref<string[]>(["http://47.113.180.32:8090/geoserver/flood/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=flood:384",]);


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


const setMapStyle = (styleIndex: number) => {
  if (map) {
    // 设置新的地图样式
    mapstyle = mapStyles[styleIndex];
    // 初始化地图
    initMap();
  }
};

let map: mapboxgl.Map | null = null; // 使用 mapboxgl.Map 类型

/* const flyToLocation = () => {
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
}; */

/* const flyToLocation = () => {
  if (map) {
    // 设置初始位置和缩放级别
    const initialCoordinates: [number, number] = [-58.612100514,  -31.05916171];
    const initialZoomLevel = 1.3;

    // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画至初始位置
    map.flyTo({
      center: initialCoordinates,
      zoom: initialZoomLevel,
      essential: true // 如果启用，确保用户始终能看到飞行动画
    });

    // 延迟一段时间后，再次调用 flyTo 方法，将地图环球飞行一圈再回到原点
    setTimeout(() => {
      const newCoordinates: [number, number] = [121.387899486, 31.05916171]; // 设定新的中心点坐标（全球中心点）
      const newZoomLevel = 8.1; // 设定新的缩放级别

      // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画至全球中心点
      map.flyTo({
        center: newCoordinates,
        zoom: newZoomLevel,
        essential: true // 如果启用，确保用户始终能看到飞行动画
      });
    }, 2900); // 这里设置一个延迟时间，让地图在初始位置停留一段时间后再进行环球飞行
  }
}; */

const flyToLocation = () => {
  if (map) {
    // 设置初始位置和缩放级别
    const initialCoordinates: [number, number] = [-58.612100514, -31.05916171];
    const initialZoomLevel = 1.3;

    // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画至初始位置
    map.flyTo({
      center: initialCoordinates,
      zoom: initialZoomLevel,
      essential: true // 如果启用，确保用户始终能看到飞行动画
    });

    // 在初始动画完成后，使用 flyTo 方法实现环球飞行
    map.once('moveend', () => {
      const newCoordinates: [number, number] = [121.387899486, 31.05916171]; // 设定新的中心点坐标（全球中心点）
      const newZoomLevel = 7.6; // 设定新的缩放级别

      // 使用 mapboxgl 的 flyTo 方法实现地图飞行动画至全球中心点
      map.flyTo({
        center: newCoordinates,
        zoom: newZoomLevel,
        essential: true, // 如果启用，确保用户始终能看到飞行动画
        animate: true, // 开启动画效果
        duration: 5000 // 设置飞行动画的持续时间
      });
    });
  }
};

const isLoading = ref(false); // 控制加载状态

onMounted(() => {
  window.addEventListener('resize', handleResize)
  isLoading.value = false; // 地图加载中，显示LoadingOverlay
  // 初始化地图
  initMap();
  map?.on('load', () => {
    isLoading.value = false;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})



onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
/* 响应式设计 - 电脑端 */
@media screen and (min-width: 768px) {

  .test-show {
    position: absolute;
    top: 200px;
    left: 20px;
  }

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
