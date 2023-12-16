<!-- src/components/ColorBlockBand.vue -->

<template>
    <div class="color-block-band">
      <div class="main-block">淹没水深</div>
      <div v-for="(item, index) in subData" :key="index" :style="{ backgroundColor: item.color }" class="sub-block">
        {{ item.text }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ColorBlockBand',
    data() {
      return {
        subData: [
          { text: '0 - 0.05', color: '#e74c3c', font: 'Arial, sans-serif' },
          { text: '0.05 - 0.1', color: '#2ecc71', font: 'Verdana, sans-serif' },
          { text: '0.1 - 0.2', color: '#f39c12', font: 'Tahoma, sans-serif' },
          { text: '0.2 - 0.3', color: '#3498db', font: 'Georgia, serif' },
          { text: '0.3 - 0.4', color: '#9b59b6', font: 'Times New Roman, serif' },
          { text: '0.4 - 0.5', color: '#FFD700', font: 'Times New Roman, serif' },
          { text: '0.5 - 1', color: '#FF8C00', font: 'Times New Roman, serif' },
          { text: '1 - 45', color: '#DC143C', font: 'Times New Roman, serif' },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .color-block-band {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .main-block,
  .sub-block {
    width: 110px; /* 长方体宽度，根据你的需求调整 */
    height: 55px; /* 主长方体高度，根据你的需求调整 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white; /* 文字颜色，根据你的需求调整 */
    font-weight: bold; /* 文字粗细，根据你的需求调整 */
    cursor: default; /* 设置鼠标形状为默认 */
  }
  
  .main-block {
    background-color: #3498db; /* 主长方体颜色，根据你的需求调整 */
    user-select: none; /* 阻止文本选择 */
    cursor: default; /* 设置鼠标形状为默认 */
  }
  
  .sub-block {
    margin-top: 0; /* 子长方体之间的间距，根据你的需求调整 */
    height: 25px; /* 子长方体高度，根据你的需求调整 */
    user-select: none; /* 阻止文本选择 */
    cursor: default; /* 设置鼠标形状为默认 */
  }
  
  </style>
  