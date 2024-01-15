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
                <div class="close" @click="submitCard"><el-icon>
                        <ArrowUpBold />
                    </el-icon></div>

                <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">

                    <el-tab-pane name="server">
                        <template v-slot:label>
                            <span class="custom-label">服务器数据</span>
                        </template>
                        <div class="select-container">

                            <div class="select-small-container">
                                <div class="select-text">降雨等级：</div>
                                <el-select v-model="levels[0]" placeholder="降雨等级" @change="handleSelectChange">
                                    <el-option v-for="level in options" :key="level.value" :label="level.label"
                                        :value="level.value"></el-option>
                                </el-select>
                            </div>

                            <div class="select-small-container">
                                <div class="select-text">水位等级：</div>
                                <el-select v-model="levels[1]" placeholder="水位等级" @change="handleSelectChange">
                                    <el-option v-for="level in options" :key="level.value" :label="level.label"
                                        :value="level.value"></el-option>
                                </el-select>
                            </div>


                            <div class="select-small-container">
                                <div class="select-text">潮位等级：</div>
                                <el-select v-model="levels[2]" placeholder="潮位等级" @change="handleSelectChange">
                                    <el-option v-for="level in options" :key="level.value" :label="level.label"
                                        :value="level.value"></el-option>
                                </el-select>
                            </div>

                            <div class="button-container">
                                <div class="button-confirm-container">
                                    <div class="current-level-text-container">
                                        <p class="current-level-text1">当前等级：</p>
                                        <p class="current-level-text">P{{ levels[0] }}</p>
                                        <p class="current-level-text">_R{{ levels[1] }}</p>
                                        <p class="current-level-text">_T{{ levels[2] }}</p>
                                    </div>
                                    <el-button class="button-confirm" plain @click="handleConfirm">确认</el-button>
                                </div>
                                <div>
                                    <el-popover placement="bottom-start" :width="280" trigger="hover"
                                        content="生成地图前,一定要先确认等级哦~">
                                        <template #reference>
                                            <el-button class="button-generate" @click="handleGenerateMap">生成地图</el-button>
                                        </template>
                                    </el-popover>

                                </div>
                            </div>

                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="用户数据" name="user">
                        <!--  <el-input-number v-model="userInput1" :min="0" :max="100" :controls="false"
                            placeholder="输入数字1"></el-input-number>
                        <el-input-number v-model="userInput2" :min="0" :max="100" :controls="false"
                            placeholder="输入数字2"></el-input-number>
                        <el-input-number v-model="userInput3" :min="0" :max="100" :controls="false"
                            placeholder="输入数字3"></el-input-number> -->
                    </el-tab-pane>

                </el-tabs>


            </div>
            <div v-if="selectedIcon === 'icon2'">Card Content for Icon 2</div>
            <div v-if="selectedIcon === 'icon3'">Card Content for Icon 3</div>
            <div v-if="selectedIcon === 'icon4'">Card Content for Icon 4</div>

        </div>
    </div>
</template>
  
<script setup>
import { ref, defineProps, defineEmits, h } from 'vue';
import { ElNotification } from 'element-plus';
import { state } from './store';


const confirmLevel = () => {
    ElNotification({
        message: `待生成的地图等级为P${levels.value[0]}_R${levels.value[1]}_T${levels.value[2]}`,
        type: 'success',
    })
}

const iconSize = ref('28px'); // 可以根据需要调整图标的大小
const showCardFlag = ref(false);
const selectedIcon = ref('');
const cardTitle = ref('');

const props = defineProps(['updateLevels']);
const emits = defineEmits();


const activeTab = ref('server');
const options = [
    { label: '一级', value: '1' },
    { label: '二级', value: '2' },
    { label: '三级', value: '3' },
    { label: '四级', value: '4' },
    { label: '五级', value: '5' },
];

const levels = ref(['', '', '']);
const userInput1 = ref(0);
const userInput2 = ref(0);
const userInput3 = ref(0);

// 当选择框的值发生变化时触发
const handleSelectChange = () => {
    props.updateLevels(levels.value); // 将选择框的值传递给父组件
    emits('selectChange', levels.value); // 通过自定义事件将值传递给父组件
};

const showCard = (icon) => {
    showCardFlag.value = true;
    selectedIcon.value = icon;

    // 设置每个图标对应的卡片标题
    if (icon === 'icon1') {
        cardTitle.value = 'Card Title for Icon 1';
        state.showSlide = true;
    }else if (icon === 'icon2') {
        cardTitle.value = 'Card Title for Icon 2';
        state.showSlide = false;
    }else if (icon === 'icon3') {
        cardTitle.value = 'Card Title for Icon 3';
        state.showSlide = false;
    }else if (icon === 'icon4'){ 
        cardTitle.value = 'Card Title for Icon 4';
        state.showSlide = false;
    }
};


const submitCard = () => {
    // 处理卡片提交逻辑，可以在这里获取选择的参数
    console.log('Selected Icon:', selectedIcon.value);
    // 清空参数并隐藏卡片
    selectedIcon.value = '';
    cardTitle.value = '';
    showCardFlag.value = false;
    state.showSlide = false;
};

const handleConfirm = () => {
    confirmLevel();
    const multiplicationResult = levels.value.reduce((acc, level) => acc * parseInt(level), 1);
    emits('confirm', multiplicationResult); // 通过自定义事件传递相乘的值
};

const handleGenerateMap = () => {
    emits('generateMap'); // 触发生成地图事件
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
    height: 312px;
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

.close {
    cursor: pointer;
    width: 30px;
    height: auto;
    position: absolute;
    top: 10px;
    right: 3px;
}

/* 添加一定的间距 */
.el-select {
    margin-bottom: 12px;
    width: 150px;
}

.select-text {
    font-weight: lighter;
    font-size: smaller;
    margin-top: 6px;
}

.select-small-container {
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    margin-right: 20px;
}

.button-container {
    display: flex;
    flex-direction: column;
}

.button-generate {
    width: 100%;
}

.button-confirm {
    width: 40%;
    margin-right: 5px;
}

.button-confirm-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.current-level-text-container {
    display: flex;
    align-items: center;
    margin-top: 5px;
}

.current-level-text {
    font-weight: bold;
    font-size: small;
}

.current-level-text1 {
    font-weight: lighter;
    margin-left: 10px;
    font-family: YouYuan;
    font-size: 15px;
}
</style>
  