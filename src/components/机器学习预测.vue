<template>
  <div class="box">
    <el-card class="box-card" shadow="always">

      <div class="Title">
        <div class="head-middle-container">
              <div class="head">
                <p class="head-title">机器学习预测淹没范围</p>
              </div>
              <div class="middle">
                <p class="middle-title">地区：上海</p>
              </div>
          </div>    
      </div>


      <div class="box-body">

        <div class="body-select">
          <div class="select-title">降雨</div>
          <div class="select">
              <el-select v-model="value1" placeholder="降雨">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </div>
        </div>

        <div class="body-select">
          <div class="select-title">水位</div>
          <div class="select">
              <el-select v-model="value2" placeholder="水位">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </div>
        </div>
        
        <div class="body-select">
          <div class="select-title">潮位</div>
          <div class="select">
              <el-select v-model="value3" placeholder="潮位">
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
          </div>
        </div>

      </div>

      <div class="card-footer">
        <run></run>
      </div>
      
    </el-card>
    
  </div>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import run from '@/components/run_python.vue'

const value1 = ref('') // 为降雨选择器创建不同的 ref 变量
const value2 = ref('') // 为水位选择器创建不同的 ref 变量
const value3 = ref('') // 为潮位选择器创建不同的 ref 变量

const options1 = [
  {
    value: '一级',
    label: '一级',
  },
  {
    value: '二级',
    label: '二级',
  },
  {
    value: '三级',
    label: '三级',
  },
  {
    value: '四级',
    label: '四级',
  },
  {
    value: '五级',
    label: '五级',
  },
]

const options3 = [
  {
    value: '一级',
    label: '一级',
  },
  {
    value: '二级',
    label: '二级',
  },
  {
    value: '三级',
    label: '三级',
  },
  {
    value: '四级',
    label: '四级',
  },
  {
    value: '五级',
    label: '五级',
  },
]

const options2 = [
  {
    value: '一级',
    label: '一级',
  },
  {
    value: '二级',
    label: '二级',
  },
  {
    value: '三级',
    label: '三级',
  },
  {
    value: '四级',
    label: '四级',
  },
  {
    value: '五级',
    label: '五级',
  },
]

</script>

<style scoped>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.box-card {
  width: 360px;
  position: absolute;
  transform: translate(-50%, -50%);
}

.box-card:hover {
  /* 增加阴影深度 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
}
.Title {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.head-middle-container {
  display: flex;
  flex-direction: column; /* 垂直方向排列 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 8px; /* 间距大小可以根据需要调整 */
}
.head{
  margin-bottom: -18px; /* 间距大小可以根据需要调整 */
}

.head-title{
  font-size: 20px; /* 调整字体大小 */
  font-weight: bold; /* 加粗字体 */
  color: black; /* 字体颜色为黑色 */
}
.middle-title{
  font-size: 15px; /* 调整字体大小 */
  font-weight: bold; /* 加粗字体 */
  color: black; /* 字体颜色为黑色 */
}
.box-body{
  display: grid;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.body-select {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 20px; /* 间距大小可以根据需要调整 */
}


.select-title {
  margin-right: 10px; /* 右间距可以根据需要调整 */
  text-align: left; /* 左对齐 */
  font-size: 15px; /* 调整字体大小 */
  font-weight:lighter; /* 加粗字体 */
  color: black; /* 字体颜色为黑色 */
}

.card-footer {
  display: flex;
  flex-direction: column;
  /* 设置主轴方向为垂直 */
  justify-content: center;
  align-items: center;
}


</style>
