<template>
  <!-- 电脑端的内容 -->
  <div v-if="isDesktop">
    <!-- 电脑端的导航菜单内容 -->
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
          <div>2023/8/8</div>
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
  </div>

  <!-- 移动端的内容 -->
  <div v-else>
    <!-- 移动端的导航菜单内容 -->
    <header class="mobile-navbar">
      <div class="left-section">
        <!-- 放置图标和标题 -->
        <div class="logo-title">
          <img src="../assets/icons/logo.png" alt="Icon" class="icon" />
          <h1 class="title">上海市洪涝灾害预测系统</h1>
        </div>
      </div>
      <div class="right-section">
        <!-- 右侧扩展面板按钮 -->
        <button class="expand-btn" @click="toggleSidebar">
          <el-icon class="expand-icon">
            <Menu />
          </el-icon>
        </button>
      </div>
    </header>

    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- 侧边栏内容 -->
      <div class="sidebar-content">
        <sider class="sidernav"></sider>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import sider from '@/components/Mobilenav.vue'
// 定义侧边栏开关状态
const sidebarOpen = ref(false);

// 切换侧边栏状态
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const sidebarOpened = ref(false);

const openSidebar = () => {
  sidebarOpened.value = true; // 点击右侧按钮时打开侧边栏
};

const activeIndex = ref('1')
const isDesktop = ref(window.innerWidth >= 768)

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>


<style>
* {
  margin: 0;
  padding: 0;
}

/* 响应式设计 - 电脑端 */
@media screen and (min-width: 768px) {

  /* 电脑端的样式 */
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

  .drawer {
    width: 7vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    margin-left: 30vw;
  }
}

/* 响应式设计 - 移动端 */
@media screen and (max-width: 767px) {

  /* 移动端的样式 */
  .mobile-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #3498db;
    /* 主色调 */
    color: #ffffff;
    /* 文字颜色 */
    padding: 8px;
    position: relative;
    height: 38px;
    /* 设置相对定位 */
    z-index: 999;
    /* 确保导航栏位于顶层 */
  }

  .left-section {
    flex: 1;
  }

  .right-section {
    flex: 1;
    text-align: right;
  }

  .logo-title {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 38px;
    height: 38px;
    /* 图标样式 */
  }

  .title {
    margin: 0;
    font-size: 17.5px;
    font-weight: bolder;
    margin-left: 10px;
    /* 调整图标和标题之间的间距 */
    white-space: nowrap;
    /* 防止标题换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
    max-width: 100%;
    /* 调整标题最大宽度 */
    line-height: 30px;
    /* 垂直居中 */
  }

  .expand-btn {
    background: none;
    border: none;
    cursor: pointer;
  }

  .expand-icon {
    font-size: 28px;
    /* 增大图标尺寸 */
    margin-left: 5px;
    /* 调整图标与按钮之间的间距 */
    /* 其他样式 */
  }

  /* 侧边栏样式 */
  .sidebar {
    position: fixed;
    top: 38;
    left: 0;
    width: 50%;
    /* 侧边栏宽度 */
    height: 100vh;
    /* 占满整个视口高度 */
    background-color: #f0f0f0;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
    /* 初始时隐藏侧边栏 */
    z-index: 998;
    /* 确保侧边栏位于导航栏下方 */
  }

  .sidebar-open {
    transform: translateX(0);
    /* 显示侧边栏 */
  }
}
</style>