<template>
  <!-- 电脑端的内容 -->
  <div v-if="isDesktop">
    <!-- 电脑端的导航菜单内容 -->
    <div class="header-container">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">

        <div class="logo-container">
          <div class="logo">
            <a href="http://segs.shnu.edu.cn/">
              <div class="title-logo"></div>
            </a>
          </div>
          <div class="title-text">
            <div class="title_cn">洪涝快速预报系统</div>
            <div class="title_en">Rapid Flood Forecast System</div>
          </div>
        </div>

        <div class="flex-grow" /> <!-- //弹性空间 -->

        <router-link to="/forecasting" class="menu-link">
          <el-menu-item index="1" class="el-menu">
            <div class="block">
              <div class="role1_cn">
                <i class="logoset logo1"></i>
                <span>淹没预测</span>
              </div>
              <div class="role1_en">Inundation prediction</div>
            </div>
          </el-menu-item>
        </router-link>

        <router-link to="/modeling" class="menu-link">
          <el-menu-item index="3" class="el-menu">
            <div class="block">
              <div class="role1_cn">
                <i class="logoset logo1"></i>
                <span>实时监测预警</span>
              </div>
              <div class="role1_en">Real-time Monitoring</div>
            </div>
          </el-menu-item>
        </router-link>
        <!--  <a href="/src/components/test6.html" class="menu-link">
          <el-menu-item index="3" class="el-menu">
            <div class="block">
              <div class="role1_cn">
                <i class="logoset logo1"></i>
                <span>实时监测预警</span>
              </div>
              <div class="role1_en">Function 3</div>
            </div>
          </el-menu-item>
        </a> -->






        <!-- <div class="time-container">
          <div>2023/8/8</div>
          <div class="datatime">
            <div class="week">星期二</div>
            <div class="time">15:30</div>
          </div>
        </div> -->



        <div class="drawer">
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
        <button class="expand-btn" @click="toggleSidebar" :class="{ 'opened': sidebarOpen, 'closed': !sidebarOpen }">
          <el-icon class="expand-icon">
            <!-- 使用条件语句根据侧边栏状态渲染不同的图标 -->
            <i v-if="!sidebarOpen" class="menu-icon">
              <Menu />
            </i>
            <i v-else class="close-icon">
              <CloseBold />
            </i>
          </el-icon>
        </button>
      </div>
    </header>

    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- 侧边栏内容 -->
      <div class="sidebar-content">
        <sider class="sidernav" @click="toggleSidebar"></sider>
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 阴影效果 */
  }

  .head {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 阴影效果 */
  }


  .logo-container {
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 4vh 0 1.5vh;
  }

  .title-logo {
    height: 4.5vh !important;
    width: 3.5vh !important;
    background-image: url(../assets/icons/watermap.png);
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 0;
    margin-right: 1.5vh;
  }

  .title-text {
    font-size: 1.8vh;
    color: #5b0c0c;
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
    font-weight: bold;
    color: #109cb8;
    font-family: Arial, Helvetica, sans-serif;
  }

  .flex-grow {
    flex-grow: 1;
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
    height: 2vh !important;
    width: 1.5vh !important;
    background-image: url(../assets/icons/watermap.png);
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
    font-size: 13px;
    line-height: 3px;
    color: #109cb8;
    padding-left: 17px;
    font-family: Arial, Helvetica, sans-serif;
  }

  a {
    text-decoration: none;
    /* 去除所有链接的下划线 */
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
    margin-right: 45vw;

  }

  .menu-link {
    width: 100%;
    /* 添加其他可能需要的样式 */
  }

  .el-menu-item {
    height: 8vh;
  }

  .el-menu-item,
  .menu-link {
    border: none;
    /* 移除边框 */
  }

}

/* 响应式设计 - 移动端 */
@media screen and (max-width: 767px) {

  /* 移动端的样式 */
  .mobile-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: linear-gradient(-145deg, #3c83ad 40%, #7aabec 100%);
    background-image: linear-gradient(-305deg, white 4%, #7aabec 20%, #3c83ad 120%);
    /* 主色调 */
    color: #ffffff;
    /* 文字颜色 */
    padding: 8px;
    position: relative;
    height: 44px;
    /* 设置相对定位 */
    z-index: 999;
    /* 确保导航栏位于顶层 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
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
    transition: all 0.15s ease;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .expand-btn.opened {
    /* 修改背景色 */
    transform: rotate(-90deg);
    /* 旋转按钮 */
  }

  .expand-icon {
    font-size: 28px;
    /* 增大图标尺寸 */
    margin-left: 5px;
    /* 调整图标与按钮之间的间距 */
    /* 其他样式 */
    color: #fff;
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
    background-image: linear-gradient(-225deg, #3c83ad 40%, #7aabec 100%);
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