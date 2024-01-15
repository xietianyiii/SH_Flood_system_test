<template>
  <div class="menu-container">
    <!-- Menu 组 -->
    <div class="menu">
      <!-- 标题栏 -->
      <div class="title">REALTIME MAP SYSTEM</div>

      <!-- 图标栏 -->
      <div class="icon-bar">
        <!-- 右上角四个功能图标 -->
        <div class="icon" @click="showCard('icon1')"><el-icon :size="iconSize">
            <ElemeFilled />
          </el-icon></div>
        <div class="icon" @click="showCard('icon2')"><el-icon :size="iconSize">
            <Shop />
          </el-icon></div>
        <div class="icon" @click="showCard('icon3')"><el-icon :size="iconSize">
            <SwitchFilled />
          </el-icon></div>
        <div class="icon" @click="showCard('icon4')"><el-icon :size="iconSize">
            <Opportunity />
          </el-icon></div>
      </div>
    </div>

    <!-- Card 组 -->
    <div v-if="showCardFlag" class="card">
      <!-- 在这里放置参数选择的内容 -->
      <div v-if="selectedIcon === 'icon1'">
        <h3 class="card-title">淹没过程模拟</h3>


        <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">

          <el-tab-pane name="server">
            <template v-slot:label>
              <span class="custom-label">服务器数据</span>
            </template>
            <div class="select-container">
              <el-select v-model="levels[0]" placeholder="降雨等级">
                <el-option v-for="level in options" :key="level.value" :label="level.label"
                  :value="level.value"></el-option>
              </el-select>

              <el-select v-model="levels[1]" placeholder="水位等级">
                <el-option v-for="level in options" :key="level.value" :label="level.label"
                  :value="level.value"></el-option>
              </el-select>

              <el-select v-model="levels[2]" placeholder="潮位等级">
                <el-option v-for="level in options" :key="level.value" :label="level.label"
                  :value="level.value"></el-option>
              </el-select>
            </div>
          </el-tab-pane>

          <el-tab-pane label="用户数据" name="user">
            <el-input-number v-model="userInput1" :min="0" :max="100" :controls="false"
              placeholder="输入数字1"></el-input-number>
            <el-input-number v-model="userInput2" :min="0" :max="100" :controls="false"
              placeholder="输入数字2"></el-input-number>
            <el-input-number v-model="userInput3" :min="0" :max="100" :controls="false"
              placeholder="输入数字3"></el-input-number>
          </el-tab-pane>

        </el-tabs>


      </div>
      <div v-if="selectedIcon === 'icon2'">Card Content for Icon 2</div>
      <div v-if="selectedIcon === 'icon3'">Card Content for Icon 3</div>
      <div v-if="selectedIcon === 'icon4'">Card Content for Icon 4</div>

      <button @click="submitCard">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const iconSize = ref('28px'); // 可以根据需要调整图标的大小
const showCardFlag = ref(false);
const selectedIcon = ref('');
const cardTitle = ref('');

const activeTab = ref('server');
const options = [
  { label: '等级1', value: '1' },
  { label: '等级2', value: '2' },
  { label: '等级3', value: '3' },
  { label: '等级4', value: '4' },
  { label: '等级5', value: '5' },
];

const levels = ref(['', '', '']);
const userInput1 = ref(0);
const userInput2 = ref(0);
const userInput3 = ref(0);

const handleTabClick = (tab) => {
  // 处理标签页切换事件
  console.log('Tab clicked:', tab.name);
};

const showCard = (icon) => {
  showCardFlag.value = true;
  selectedIcon.value = icon;

  // 设置每个图标对应的卡片标题
  if (icon === 'icon1') cardTitle.value = 'Card Title for Icon 1';
  else if (icon === 'icon2') cardTitle.value = 'Card Title for Icon 2';
  else if (icon === 'icon3') cardTitle.value = 'Card Title for Icon 3';
  else if (icon === 'icon4') cardTitle.value = 'Card Title for Icon 4';
};

const submitCard = () => {
  // 处理卡片提交逻辑，可以在这里获取选择的参数
  console.log('Selected Icon:', selectedIcon.value);
  // 清空参数并隐藏卡片
  selectedIcon.value = '';
  cardTitle.value = '';
  showCardFlag.value = false;
};


</script>

<style scoped>
.menu-container {
  width: 280px;
  height: 90px;
  position: fixed;
  top: 10vh;
  right: 10vw;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  box-sizing: border-box;
  background: #fff;
  padding: 0;
  margin: 0;
}

.menu,
.card {
  width: 100%;
  /* 继承 menu-container 的宽度 */
  box-sizing: border-box;
  /* 确保 box-sizing 一致 */
  border: 1px solid #1b0303;

}

.menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  /* 设置相对定位 */
}

.card {
  height: 250px;
  background-color: #ffffff;
  z-index: 999;
  position: absolute;
  top: 89px;
  text-align: center;
}

.card-title {
  margin-top: 12px;
  font-size: 18px;
  margin-bottom: 10px;
}

.custom-label {
  margin-left: 5px;
  /* 自定义 label 的右边距，调整位置 */
}

.title {
  text-align: center;
  font-size: 21px;
  font-weight: bold;
  color: rgb(125, 120, 222);
  margin-top: 10px;
  /* 将 .menu 向下移动 20px，可以根据需要调整 */
  cursor: default;
}

.icon-bar {
  display: flex;
  justify-content: space-between;
  /* 让图标等间距排列 */
  margin-top: 15px;

}

.icon {
  cursor: pointer;
  flex: 0.2;
  /* 让图标在 icon-bar 内等宽 */
  text-align: center;
}

/* 添加一定的间距 */
.el-select {
  margin-bottom: 10px; /* 根据需要调整间距大小 */
}
</style>
