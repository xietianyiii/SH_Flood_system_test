<template>
  <div>
    <!-- 引用 Menu.vue 组件，并通过 props 传递 updateLevels 方法 -->
    <Menu :updateLevels="updateLevels" @selectChange="handleSelectChange" />

    <!-- 在这里使用选择框的值 -->
    <div>
      <p>1：{{ selectedLevels[0] }}</p>
      <p>2：{{ selectedLevels[1] }}</p>
      <p>3：{{ selectedLevels[2] }}</p>
    </div>

    <div class="inundation-simulate-slide" v-if="state.showSlide">
      <el-card shadow="always" class="tipcard">123</el-card>
    </div>

  </div>
</template>

<script setup>
import Menu from './Menu.vue';
import { ref } from 'vue';
import { state } from './store';



const selectedLevels = ref(['', '', '']);

// 更新选择框的值的方法
const updateLevels = (levels) => {
  selectedLevels.value = levels;
};

// 处理选择框值变化的方法
const handleSelectChange = (levels) => {
  console.log('Selected Levels in Map.vue:', levels);
};
</script>
