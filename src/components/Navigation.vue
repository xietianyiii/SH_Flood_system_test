<template>
  <div class="header-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64"
      text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">

      <div class="logo-container">
        <div class="logo">
          <a href="http://segs.shnu.edu.cn/">
            <div class="title-logo"></div>
          </a>
        </div>
        <div class="title-text">
          <div class="title_cn">上海市洪涝灾害预测系统</div>
          <div class="title_en">Shanghai Flood Disaster Prediction System</div>
        </div>
      </div>

      <div class="flex-grow" /> <!-- //弹性空间 -->

      <el-menu-item index="1">
        <div class="block">
          <div class="role1_cn">
            <i class="logoset logo1"></i>
            <span>功能 1</span>
          </div>
          <div class="role1_en">Function 1</div>
        </div>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <div class="block">
            <div class="role1_cn">
              <i class="logoset logo1"></i>
              <span>功能 2</span>
            </div>
            <div class="role1_en">Function 2</div>
          </div>
        </template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="3" disabled>
        <div class="block">
          <div class="role1_cn">
            <i class="logoset logo1"></i>
            <span>功能 3</span>
          </div>
          <div class="role1_en">Function 3</div>
        </div>
      </el-menu-item>
      <el-menu-item index="4">
        <div class="block">
          <div class="role1_cn">
            <i class="logoset logo1"></i>
            <span>功能 4</span>
          </div>
          <div class="role1_en">Function 4</div>
        </div>
      </el-menu-item>

      <div class="time-container">
        <div >2023/8/8</div>
        <div class="datatime">
          <div class="week">星期二</div>
          <div class="time">15:30</div>
        </div>
      </div>

      

      <div class="drawer">
        <Drawer></Drawer>
      </div>
    </el-menu>



  </div>

</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import Drawer from '@/components/Drawer.vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

</script>


<style>
* {
  margin: 0;
  padding: 0;
}

.header-container {
  background-color: #222a35;
  overflow: hidden;
  width: 100%;
  height: 8vh;
  position: relative;
  display: contents;
  justify-content: space-between;
}


.logo-container {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 4vh 0 1.5vh;
}

.title-logo {
  height: 4.5vh !important;
  width: 4.5vh !important;
  background-image: url(../assets/icons/logo.png);
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 0;
  margin-right: 1.5vh;
}

.title-text {
  font-size: 1.8vh;
  color: #fff;
  cursor: default;
  padding-left: 0;
  white-space: nowrap;
}

.title_cn {
  line-height: 3.5vh;
  font-weight: 700;
}

.title_en {
  font-size: 1.4vh;
  line-height: 10px;
  color: #d9d7d7;
  font-family: Arial, Helvetica, sans-serif;
}

.flex-grow {
  flex-grow: 0.1;
}

.block {
  display: block;
  height: 8vh;
}

.logoset {
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  width: 2.2vh;
  height: 2.2vh;
  margin-right: 1vh;
  display: inline-block;
}

.logo1 {
  background-image: url(../assets/icons/logo.png);
}

.role1_cn {
  font-size: 1.8vh;
  font-weight: bold;
  line-height: 2.13vh;
  margin-bottom: 1.6vh;
  margin-top: 2vh;
  font-family: Arial, Helvetica, sans-serif;
}

.role1_en {
  font-size: 1.4vh;
  font-weight: bold;
  line-height: 5px;
  color: #c0c5c6;
  padding-left: 4px;
  font-family: Arial, Helvetica, sans-serif;
}

.time-container {
  width: 7vw;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  background-color: #031620;
  padding: 0 10px 0 16px;
  font-size: 1.8vh;
  /* margin-left: auto; */
}

.datatime {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.week {
  display: inline-block;
}

.time {
  font-size: 1.8vh;
  font-weight: 700;
  display: inline-block;
  color: #f6b93b;
}

.drawer{
  width: 7vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  margin-left: 30vw;
}
</style>