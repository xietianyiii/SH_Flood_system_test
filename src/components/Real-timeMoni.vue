<template>
    <div id="app" class="app-container">
        <div id="rainInfo_container">
            <div id="predictionInfo">降雨的预测信息</div>
            <div id="chart_container">
                <div id="chartArea"></div>
            </div>
            <div class="separator"></div>
            <div class="weatherStation">
                <div class="weatherStationTitle">降雨站点信息</div>
                <div class="weatherStationSubtitle">降雨站ID</div>
                <div class="weatherStationSubtitle">来源</div>
                <div id="stationId" class="weatherStationValue">58362</div>
                <div id="source" class="weatherStationValue">Meteostat</div>
                <div class="weatherStationSubtitle">纬度/经度</div>
                <div class="weatherStationSubtitle">降雨站点名称</div>
                <div id="coordinates" class="weatherStationValue">31.1667 / 121.4333</div>
                <div id="stationName" class="weatherStationValue">Shanghai / Hongqiao</div>
                <div class="weatherStationSubtitle">省市</div>
                <div class="weatherStationSubtitle">地区</div>
                <div class="weatherStationValue">上海市</div>
                <div class="weatherStationValue">闵行区</div>
            </div>
            <div class="separator"></div>
            <div class="rainThreshold">
                <div class="thresholdTitle">降雨阈值</div>
                <div class="unitSubtitle">测量单位</div>
                <div class="thresholdValue">降雨量（mm）</div>

                <div class="thresholdLabels">警戒值</div>
                <div class="thresholdLabels">危险值</div>
                <div class="thresholdLabels">极限值</div>

                <div class="thresholdNumbers">8.000</div>
                <div class="thresholdNumbers">12.000</div>
                <div class="thresholdNumbers">20.000</div>

                <div class="thresholdRect" style="background-color: orange;"></div>
                <div class="thresholdRect" style="background-color: red;"></div>
                <div class="thresholdRect" style="background-color: #a70606;"></div>
            </div>

            <div class="separator"></div>
            <div class="footerNote">洪灾情况为近似数据，仅供参考。如需了解详情，请查看官方资料。</div>
        </div>
        <div id="map" ref="mapContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';

const mapContainer = ref<HTMLElement | null>(null);
const chartInstance = ref<any | null>(null); // 用于存储图表实例

const mapboxToken = 'pk.eyJ1IjoiMTA2MzgxNjE3OCIsImEiOiJjbGhyZzRnbjMwZGtrM2VzaTg4a3Z1d2I1In0.G4AQfmjpfeOjf7YJVytWhA';
mapboxgl.accessToken = mapboxToken;

interface Station {
    coords: [number, number];
    id: string;
    name: string;
}

const initMap = (station: Station) => {
    const map = new mapboxgl.Map({
        container: mapContainer.value!,
        style: 'mapbox://styles/1063816178/cm345pm0e002201rc0esq7xtp',
        center: [121.4737, 31.2304],
        zoom: 8
    });

    new mapboxgl.Marker()
        .setLngLat([station.coords[1], station.coords[0]])
        .setPopup(new mapboxgl.Popup().setText(station.name))
        .addTo(map);

    map.addControl(new mapboxgl.NavigationControl());
};

const renderChart = async (station: Station, precipitationData: number[], timestamps: string[]) => {
    // 动态导入 ApexCharts
    const { default: ApexCharts } = await import('apexcharts');  // 动态导入

    // 销毁旧的图表实例
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    const options = {
        series: [{
            name: '降雨量',
            data: precipitationData
        }],
        chart: {
            type: 'area',
            height: 220,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        title: {
            text: `${station.name}`,
            align: 'left'
        },
        labels: timestamps,
        xaxis: {
            type: 'datetime',
            tickAmount: 5,
            labels: {
                formatter: (value: string) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                }
            }
        },
        yaxis: {
            title: {
                text: '降雨量 (mm)',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            },
            opposite: true
        },
        tooltip: {
            x: {
                formatter: (value: string) => {
                    const date = new Date(value);
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
                }
            },
            y: {
                formatter: (value: number) => `${value} mm`
            }
        },
        annotations: {
            yaxis: [
                {
                    y: 8,
                    borderColor: 'orange',
                    label: {
                        text: '警戒值',
                        style: { color: 'black', background: 'yellow' }
                    }
                },
                {
                    y: 12,
                    borderColor: 'red',
                    label: {
                        text: '危险值',
                        style: { color: 'black', background: 'red' }
                    }
                }
            ]
        }
    };

    chartInstance.value = new ApexCharts(document.querySelector('#chartArea'), options);
    chartInstance.value.render();
};

// 组件卸载时销毁图表实例
onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null; // 清除引用
    }
});

const fetchStations = async () => {
    const response = await fetch('http://47.113.180.32:5000/stations');
    return await response.json();
};

const fetchRainData = async (stationId: string) => {
    const response = await fetch(`http://47.113.180.32:5000/rain_data/${stationId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
};

onMounted(async () => {
    try {
        const stations = await fetchStations();
        const station = stations[0];
        initMap(station);

        const rainData = await fetchRainData(station.id);
        renderChart(station, rainData.precipitation, rainData.timestamps);
    } catch (error) {
        console.error('Error initializing map or chart:', error);
    }
});
</script>

<style scoped>
.app-container {
    display: flex;
    margin-top: 8.4vh;
    height: 91.6vh;
    font-family: Arial, sans-serif;
}

#rainInfo_container {
    width: 27vw;
    height: 91.6vh;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
}

#map {
    width: 73vw;
    height: 91.6vh;
}

.separator {
    height: 1px;
    background-color: #ddd;
    margin: 12px 0;
}

.weatherStation {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.weatherStationTitle {
    grid-column: span 2;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
}

.weatherStationSubtitle {
    font-weight: 500;
    font-size: 11px;
    color: rgb(95, 99, 104);
    margin-bottom: -2px;
}

.weatherStationValue {
    font-weight: 550;
    font-size: 12px;
    color: #212121;
    margin-top: -3px;
}

.rainThreshold {
    margin-top: 0px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
}

.thresholdTitle {
    grid-column: span 3;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
}

.unitSubtitle {
    grid-column: span 3;
    font-weight: 500;
    font-size: 11px;
    color: rgb(95, 99, 104);
    margin-bottom: -2px;
}

.thresholdValue {
    font-weight: 550;
    font-size: 12px;
    color: #212121;
    margin-top: -3px;
    grid-column: span 3;
}

.thresholdLabels {
    font-size: 12px;
    color: #212121;
    text-align: left;
    margin-bottom: -2px;
}

.thresholdNumbers {
    font-weight: 550;
    font-size: 12px;
    color: #212121;
    margin-top: -3px;
    text-align: left;
}

.thresholdRect {
    width: 7.8vw;
    height: 4px;
    margin: 0 auto;
}

.footerNote {
    font-weight: 400;
    font-size: 12px;
    color: #212121;
    text-align: left;
    position: absolute;
    bottom: 20px;
}
</style>
