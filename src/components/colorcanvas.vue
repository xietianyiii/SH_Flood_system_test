<template>
    <div class="rounded-bar">
        <canvas ref="colorCanvas"></canvas>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const colorCanvas = ref(null);

onMounted(() => {
    drawGradientFromSLD();
});

function drawGradientFromSLD() {
    const canvas = colorCanvas.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const colorMapEntries = [
        { quantity: 0, color: '#fffaff' },
        { quantity: 0.050000205586432006, color: '#4777b5' },
        { quantity: 0.099999960102880009, color: '#4c7ab8' },
        { quantity: 0.19999992020576002, color: '#4db4c0' },
        { quantity: 0.29999988030864, color: '#0989d7' },
        { quantity: 0.50000205586432001, color: '#1c31ff' },
        { quantity: 0.99999960102880014, color: '#fee1a5' },
        { quantity: 1.106998400000002, color: '#d5301f' }
    ];

    const gradientColors = generateGradientColors(colorMapEntries);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientColors.forEach((entry) => {
        gradient.addColorStop(
            (entry.quantity - colorMapEntries[0].quantity) /
            (colorMapEntries[colorMapEntries.length - 1].quantity -
                colorMapEntries[0].quantity),
            entry.color
        );
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateGradientColors(colorMap) {
    const gradientColors = [];
    colorMap.forEach((entry, index) => {
        if (index < colorMap.length - 1) {
            const nextEntry = colorMap[index + 1];
            const colorStops = 100;
            const step = (nextEntry.quantity - entry.quantity) / colorStops;

            for (let i = 0; i < colorStops; i++) {
                const quantity = entry.quantity + step * i;
                gradientColors.push({
                    quantity,
                    color: interpolateColor(entry.color, nextEntry.color, i / colorStops)
                });
            }
        } else {
            gradientColors.push(entry);
        }
    });
    return gradientColors;
}

function interpolateColor(color1, color2, factor) {
    function hexToRgba(hex) {
        return [
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16)
        ];
    }

    const color1Rgb = hexToRgba(color1);
    const color2Rgb = hexToRgba(color2);

    const result = color1Rgb.map((channel, index) => {
        const delta = color2Rgb[index] - channel;
        return Math.round(channel + delta * factor);
    });

    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}
</script>
  
<style scoped>
/* 默认样式 */

canvas {
    border-radius: 20px;
    width: 250px;
    height: 13px;
}

/* 移动端样式 */
@media (max-width: 768px) {
    .rounded-bar {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        overflow: hidden;
    }

    canvas {
        border-radius: 20px;
        width: 150px;
        height: 8px;
    }
}
</style>
  