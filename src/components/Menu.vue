<template>
    <div :class="['menu-container', { 'collapsed': isCollapsed }]">

        <!-- Custom Tabs -->
        <div class="custom-tabs">
            <div class="tab-headers">
                <div v-for="(tab, index) in tabs" :key="index" :class="['tab-header', { 'active': activeTab === index }]"
                    @click="selectTab(index)">
                    {{ tab.label }}
                </div>
            </div>

            <div class="tab-content">
                <!-- 整合 Tabs 到 User Content -->
                <div v-if="activeTab === 0">
                    <div class="hazard-page">
                        <!-- 等级选择模块容器 -->
                        <div class="level-selector-container">
                            <!-- 添加小标题 -->
                            <div class="header-title-container">
                                <div class="header-title">选择等级</div>
                                <div class="info-icon" @click="toggleInfoCard"><el-icon>
                                        <QuestionFilled />
                                    </el-icon></div> <!-- 信息图标 -->
                            </div>

                            <!-- 信息卡片，点击信息图标显示或隐藏 -->
                            <div v-if="showInfoCard" class="overlay">
                                <div class="info-card">
                                    <button class="close-button" @click="toggleInfoCard">&times;</button>
                                    <h1 class="info-card-title">选择等级</h1>
                                    <h2 class="info-card-subtitle">说明：</h2>
                                    <p class="info-card-content">
                                        洪涝快速预报系统特别关注极端情景，构建了复合情景下的淹没情景样本库。考虑不同的降雨强度、上游水位和风暴潮强度来预测淹没情况。例如，1997年台风“温妮”期间，上海经历了严重的洪涝灾害，强烈的风暴潮迅速推高了长江口和杭州湾的海平面，上游洪水导致黄浦江和苏州河水位急剧上涨，河道水量超出堤防容量，河水溢出流入市区。同时台风带来的持续暴雨使得市区的地表径流迅速增加。尤其是地势低洼、排水系统薄弱的区域，淹没范围和深度会迅速扩大，最终导致大面积的城市内涝。
                                    </p>
                                    <h2 class="info-card-subtitle">描述：</h2>
                                    <p class="info-card-content">降雨、水位和潮位各自划分了五个等级，其中三级为1997年Typhoon
                                        Winnie的强度，一级、二级分别在Typhoon Winnie的强度基础上减弱30%和10%，四级和五级分别在Typhoon
                                        Winnie的强度基础上增强20%和40%。</p>
                                </div>
                            </div>


                            <!-- 整个选择器容器，确保三行垂直排列 -->
                            <div class="level-container">
                                <!-- 第1行：降雨等级 -->
                                <div class="level-selector-row">
                                    <span class="level-label">降雨</span>
                                    <div class="dotted-line-container">
                                        <span class="dotted-line"></span>
                                        <div class="level-selector">
                                            <div v-for="(level, index) in levels" :key="index"
                                                :class="['level-item', { 'selected': selectedRainLevel === index }]"
                                                @click="selectRainLevel(index)">
                                                <span class="level-tag">{{ level.label }}</span> <!-- 小标签 -->
                                                <span class="circle">
                                                    <span v-if="selectedRainLevel === index" class="inner-circle"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第2行：水位等级 -->
                                <div class="level-selector-row">
                                    <span class="level-label">水位</span>
                                    <div class="dotted-line-container">
                                        <span class="dotted-line"></span>
                                        <div class="level-selector">
                                            <div v-for="(level, index) in levels" :key="index"
                                                :class="['level-item', { 'selected': selectedWaterLevel === index }]"
                                                @click="selectWaterLevel(index)">
                                                <span class="level-tag">{{ level.label }}</span> <!-- 小标签 -->
                                                <span class="circle">
                                                    <span v-if="selectedWaterLevel === index" class="inner-circle"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第3行：潮位等级 -->
                                <div class="level-selector-row">
                                    <span class="level-label">潮位</span>
                                    <div class="dotted-line-container">
                                        <span class="dotted-line"></span>
                                        <div class="level-selector">
                                            <div v-for="(level, index) in levels" :key="index"
                                                :class="['level-item', { 'selected': selectedTideLevel === index }]"
                                                @click="selectTideLevel(index)">
                                                <span class="level-tag">{{ level.label }}</span> <!-- 小标签 -->
                                                <span class="circle">
                                                    <span v-if="selectedTideLevel === index" class="inner-circle"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 包裹模型选择和导出模块的容器 -->
                        <div class="second-arrow-container">
                            <!-- 模型选择模块容器 -->
                            <div class="model-selector-container">
                                <!-- 模型选择标题和信息图标 -->
                                <div class="model-header-container">
                                    <div class="header-title-container">预测模型</div>
                                    <el-icon class="second-arrow-info-icon" @click="toggleModelInfoCard">
                                        <QuestionFilled />
                                    </el-icon>
                                </div>

                                <!-- 模型信息卡片 -->
                                <div v-if="showModelInfoCard" class="overlay">
                                    <div class="info-card">
                                        <button class="close-button" @click="toggleModelInfoCard">&times;</button>
                                        <h1 class="info-card-title">预测模型</h1>
                                        <h2 class="info-card-subtitle">说明：</h2>
                                        <p class="info-card-content">系统分别训练了CatBoost、Decision
                                            Tree、GradientBoosting、KNeighbors、LightGBM、RandomForest、XGBoost、ADaBoost、MLPRegressor模型用于预测，其中随机森林模型和K近邻模型精度最佳。
                                        </p>
                                        <h2 class="info-card-subtitle">描述：</h2>
                                        <!-- Insert the image below the subtitle -->
                                        <img class="info-card-image" :src="imagePath" alt="描述的图片" />

                                    </div>
                                </div>


                                <!-- 自定义下拉菜单 -->
                                <div class="custom-dropdown">
                                    <div class="dropdown-selected" @click="toggleDropdown">
                                        {{ selectedModel ? selectedModel : '请选择模型' }}
                                        <span class="arrow" :class="{ open: isDropdownOpen }"></span>
                                    </div>
                                    <ul v-if="isDropdownOpen" class="dropdown-options">
                                        <li v-for="(model, index) in models" :key="index" @click="selectModel(model)"
                                            :class="{ selected: model === selectedModel }">
                                            {{ model }}
                                        </li>
                                    </ul>
                                </div>

                                <!-- 预测按钮 -->
                                <button class="export-button" @click="handleGenerateMap2">预测</button>
                            </div>

                            <!-- 导出模块容器 -->
                            <div class="export-module-container">
                                <!-- 导出标题和信息图标 -->
                                <div class="export-header-container">
                                    <div class="header-title-container">导出格式</div>
                                    <el-icon class="second-arrow-info-icon" @click="toggleExportInfoCard">
                                        <QuestionFilled />
                                    </el-icon>
                                </div>

                                <!-- 导出信息卡片 -->
                                <div v-if="showExportInfoCard" class="overlay">
                                    <div class="info-card">
                                        <button class="close-button" @click="toggleExportInfoCard">&times;</button>
                                        <h1 class="info-card-title">导出格式</h1>
                                        <h2 class="info-card-subtitle">说明：</h2>
                                        <p class="info-card-content">选择预测后的地图导出格式。</p>
                                        <h2 class="info-card-subtitle">描述：</h2>
                                        <p class="info-card-content">支持导出TIFF和PNG。</p>

                                    </div>
                                </div>

                                <!-- 导出自定义下拉菜单 -->
                                <div class="custom-dropdown">
                                    <div class="dropdown-selected" @click="toggleExportDropdown">
                                        {{ selectedExport ? selectedExport : '选择导出格式' }}
                                        <span class="arrow" :class="{ open: isExportDropdownOpen }"></span>
                                    </div>
                                    <ul v-if="isExportDropdownOpen" class="dropdown-options">
                                        <li v-for="(format, index) in exportFormats" :key="index"
                                            @click="selectExportFormat(format)"
                                            :class="{ selected: format === selectedExport }">
                                            {{ format }}
                                        </li>
                                    </ul>
                                </div>

                                <!-- 导出按钮 -->
                                <button class="export-button" @click="exportFile">导出</button>
                            </div>
                        </div>


                    </div>
                </div>

                <div v-if="activeTab === 1">
                    <!-- 播放倍速模块 -->
                    <div class="speed-selector-container">
                        <!-- 播放倍速标题和信息图标 -->
                        <div class="speed-header-container">
                            <div class="header-title">播放倍速</div>
                            <el-icon class="Speed-info-icon" @click="toggleSpeedInfoCard">
                                <QuestionFilled />
                            </el-icon>
                        </div>

                        <!-- 播放倍速信息卡片 -->
                        <div v-if="showSpeedInfoCard" class="overlay">
                            <div class="info-card">
                                <button class="close-button" @click="toggleSpeedInfoCard">&times;</button>
                                <h1 class="info-card-title">播放倍速</h1>
                                <h2 class="info-card-subtitle">说明：</h2>
                                <p class="info-card-content">点击开始模拟后系统会生成一段可播放的淹没过程情景，该组件可以选择播放倍速。</p>
                                <h2 class="info-card-subtitle">描述：</h2>
                                <p class="info-card-content">支持0.5 × 、1.0 × 、1.5 × 、2.0 × 、3.0 ×。</p>

                            </div>
                        </div>

                        <!-- 播放倍速等级选择器 -->
                        <div class="level-selector-row">
                            <div class="dotted-line-container">
                                <span class="speed-dotted-line"></span>
                                <div class="level-selector">
                                    <div v-for="(speed, index) in speeds" :key="index"
                                        :class="['level-item', { 'selected': selectedSpeed === index }]"
                                        @click="selectSpeed(index)">
                                        <span class="level-tag">{{ speed.label }}</span> <!-- 小标签 -->
                                        <span class="circle">
                                            <span v-if="selectedSpeed === index" class="inner-circle"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 第二部分 -->
                    <div class="second-arrow-container">
                        <!-- 模拟事件模块 -->
                        <div class="event-selector-container">
                            <!-- 模拟事件标题和信息图标 -->
                            <div class="model-header-container">
                                <div class="header-title-container">模拟事件</div>
                                <el-icon class="second-arrow-info-icon" @click="toggleEventInfoCard">
                                    <QuestionFilled />
                                </el-icon>
                            </div>

                            <!-- 模拟事件信息卡片 -->
                            <div v-if="showEventInfoCard" class="overlay">
                                <div class="info-card">
                                    <button class="close-button" @click="toggleEventInfoCard">&times;</button>
                                    <h1 class="info-card-title">模拟事件</h1>
                                    <h2 class="info-card-subtitle">说明：</h2>
                                    <p class="info-card-content">选择模拟淹没过程的事件。</p>
                                    <h2 class="info-card-subtitle">描述：</h2>
                                    <p class="info-card-content">目前只支持选择Typhoon Winnie事件。</p>
                                </div>
                            </div>

                            <!-- 自定义下拉菜单 -->
                            <div class="custom-dropdown">
                                <div class="dropdown-selected" @click="toggleEventDropdown">
                                    {{ selectedEvent ? selectedEvent : '请选择事件' }}
                                    <span class="arrow" :class="{ open: isEventDropdownOpen }"></span>
                                </div>
                                <ul v-if="isEventDropdownOpen" class="dropdown-options">
                                    <li v-for="(event, index) in events" :key="index" @click="selectEvent(event)"
                                        :class="{ selected: event === selectedEvent }">
                                        {{ event }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- 模拟地区模块 -->
                        <div class="region-selector-container">
                            <!-- 模拟地区标题和信息图标 -->
                            <div class="model-header-container">
                                <div class="header-title-container">模拟地区</div>
                                <el-icon class="second-arrow-info-icon" @click="toggleRegionInfoCard">
                                    <QuestionFilled />
                                </el-icon>
                            </div>

                            <!-- 模拟地区信息卡片 -->
                            <div v-if="showRegionInfoCard" class="overlay">
                                <div class="info-card">
                                    <button class="close-button" @click="toggleRegionInfoCard">&times;</button>
                                    <h1 class="info-card-title">模拟地区</h1>
                                    <h2 class="info-card-subtitle">说明：</h2>
                                    <p class="info-card-content">选择模拟淹没过程的地区。</p>
                                    <h2 class="info-card-subtitle">描述：</h2>
                                    <p class="info-card-content">目前只支持选择上海地区。</p>
                                </div>
                            </div>

                            <!-- 自定义下拉菜单 -->
                            <div class="custom-dropdown">
                                <div class="dropdown-selected" @click="toggleRegionDropdown">
                                    {{ selectedRegion ? selectedRegion : '请选择地区' }}
                                    <span class="arrow" :class="{ open: isRegionDropdownOpen }"></span>
                                </div>
                                <ul v-if="isRegionDropdownOpen" class="dropdown-options">
                                    <li v-for="(region, index) in regions" :key="index" @click="selectRegion(region)"
                                        :class="{ selected: region === selectedRegion }">
                                        {{ region }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- 第三部分 -->
                    <div class="third-arrow-container">
                        <!-- 模拟模型模块 -->
                        <div class="simmodel-selector-container">
                            <!-- 模拟模型标题和信息图标 -->
                            <div class="model-header-container">
                                <div class="header-title-container">模拟模型</div>
                                <el-icon class="second-arrow-info-icon" @click="toggleSimModelInfoCard">
                                    <QuestionFilled />
                                </el-icon>
                            </div>

                            <!-- 模拟模型信息卡片 -->
                            <div v-if="showSimModelInfoCard" class="overlay">
                                <div class="info-card">
                                    <button class="close-button" @click="toggleSimModelInfoCard">&times;</button>
                                    <h1 class="info-card-title">模拟模型</h1>
                                    <h2 class="info-card-subtitle">说明：</h2>
                                    <p class="info-card-content">大气-海洋-陆地耦合模型即大气模型、海洋模型和海岸模型相嵌套的海岸风暴洪水数值模拟模型。</p>
                                    <h2 class="info-card-subtitle">描述：</h2>
                                    <p class="info-card-content">
                                        大气模型(藤田台风模型)、海洋模型(TELEMAC潮汐模型耦合TOMAWAC波浪模型)和海岸模型(MIKE11河网模型耦合MIKE21二维水动力模型)。 </p>
                                </div>
                            </div>

                            <!-- 自定义下拉菜单 -->
                            <div class="custom-dropdown">
                                <div class="dropdown-selected" @click="toggleSimModelDropdown">
                                    {{ selectedSimModel ? selectedSimModel : '请选择模拟模型' }}
                                    <span class="arrow" :class="{ open: isSimModelDropdownOpen }"></span>
                                </div>
                                <ul v-if="isSimModelDropdownOpen" class="dropdown-options">
                                    <li v-for="(simmodel, index) in simmodels" :key="index"
                                        @click="selectSimModel(simmodel)"
                                        :class="{ selected: simmodel === selectedSimModel }">
                                        {{ simmodel }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- 开始模拟按钮 -->
                        <div class="start-simulation-container">
                            <button class="start-button" @click="handleGenerateMap">开始模拟</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Collapsing Button (left arrow) -->
        <div v-if="!isCollapsed" class="collapse-button" @click="toggleMenu">
            <el-icon>
                <Back />
            </el-icon>
        </div>

        <!-- Expanding Button (right arrow) -->
        <div v-if="isCollapsed" class="expand-button" @click="toggleMenu">
            <el-icon>
                <Right />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElNotification } from 'element-plus';
import imagePath from '@/assets/image/模型精度.png'; // Import the image

// 你需要确保在 setup 函数顶部使用以下代码解构 emit:
const emits = defineEmits(['updateSpeed', 'updateActiveTab', 'selectChange', 'confirm', 'generateMap', 'generateMap2', 'exportMap']);

// 模拟事件选项
const events = ref(['Typhoon Winnie']);
const selectedEvent = ref('Typhoon Winnie');
const isEventDropdownOpen = ref(false);
const showEventInfoCard = ref(false);

// 模拟地区选项
const regions = ref(['上海']);
const selectedRegion = ref('上海');
const isRegionDropdownOpen = ref(false);
const showRegionInfoCard = ref(false);

// 模拟模型选项和选中的模型 (SimModel)
const simmodels = ref(['大气-海洋-陆地耦合模型']);
const selectedSimModel = ref('大气-海洋-陆地耦合模型');
const isSimModelDropdownOpen = ref(false);
const showSimModelInfoCard = ref(false);

const toggleSimModelDropdown = () => {
    isSimModelDropdownOpen.value = !isSimModelDropdownOpen.value;
};

// 切换下拉菜单的显示和隐藏
const toggleEventDropdown = () => {
    isEventDropdownOpen.value = !isEventDropdownOpen.value;
};

const toggleRegionDropdown = () => {
    isRegionDropdownOpen.value = !isRegionDropdownOpen.value;
};



// 选择事件并关闭下拉菜单
const selectEvent = (event) => {
    selectedEvent.value = event;
    isEventDropdownOpen.value = false;
};

// 选择地区并关闭下拉菜单
const selectRegion = (region) => {
    selectedRegion.value = region;
    isRegionDropdownOpen.value = false;
};

// 选择模拟模型并关闭下拉菜单
const selectSimModel = (simmodel) => {
    selectedSimModel.value = simmodel;
    isSimModelDropdownOpen.value = false;
};

// 模拟启动
const startSimulation = () => {
    if (selectedEvent.value && selectedRegion.value && selectedSimModel.value) {
        alert(`模拟开始：事件 - ${selectedEvent.value}, 地区 - ${selectedRegion.value}, 模型 - ${selectedSimModel.value}`);
    } else {
        alert('请选择所有必要的选项');
    }
};

// 信息卡片的显示切换
const toggleEventInfoCard = () => {
    showEventInfoCard.value = !showEventInfoCard.value;
};

const toggleRegionInfoCard = () => {
    showRegionInfoCard.value = !showRegionInfoCard.value;
};

const toggleSimModelInfoCard = () => {
    showSimModelInfoCard.value = !showSimModelInfoCard.value;
};

const showInfoCard = ref(false); // 控制信息卡片的显示
const showModelInfoCard = ref(false); // 控制模型信息卡片的显示
// 模型选项和选中的模型
const models = ref(['随机森林', 'K近邻',]);
const selectedModel = ref('随机森林');

// 控制下拉菜单是否打开
const isDropdownOpen = ref(false);

const speeds = [
    { value: 0.5, label: '0.5 ×' },
    { value: 1.0, label: '1.0 ×' },
    { value: 1.5, label: '1.5 ×' },
    { value: 2.0, label: '2.0 ×' },
    { value: 3.0, label: '3.0 ×' }
]; // 播放倍速值与小标签

const selectedSpeed = ref(1); // 默认倍速为 1.0
const showSpeedInfoCard = ref(false);

// 切换倍速信息卡片显示与隐藏
const toggleSpeedInfoCard = () => {
    showSpeedInfoCard.value = !showSpeedInfoCard.value;
};

// 选择倍速
const selectSpeed = (index) => {
    selectedSpeed.value = index;
    const speedValues = [2000, 1000, 750, 300, 100];  // Map the speeds to their respective intervals
    emits('updateSpeed', speedValues[selectedSpeed.value]); // Emit the corresponding interval time
};

// 导出模块逻辑
const exportFormats = ref(['TIFF', 'PNG']);
const selectedExport = ref('PNG');
const isExportDropdownOpen = ref(false);
const showExportInfoCard = ref(false);

// 切换下拉菜单的显示和隐藏
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleExportDropdown = () => {
    isExportDropdownOpen.value = !isExportDropdownOpen.value;
};

// 选择模型并关闭下拉菜单
const selectModel = (model) => {
    selectedModel.value = model;
    isDropdownOpen.value = false;
};

const selectExportFormat = (format) => {
    selectedExport.value = format;
    isExportDropdownOpen.value = false;
};

// 模拟导出功能
const exportFile = () => {
    if (selectedExport.value) {
        emits('exportMap', selectedExport.value);  // Emit exportMap event with the selected format
    } else {
        alert('请选择导出格式');
    }
};


const toggleExportInfoCard = () => {
    showExportInfoCard.value = !showExportInfoCard.value;
};

// 点击页面其他地方时关闭下拉菜单
document.addEventListener('click', (event) => {
    if (!event.target.closest('.custom-dropdown')) {
        isDropdownOpen.value = false;
    }
});

const isCollapsed = ref(false);
const activeTab = ref(0);  // Active tab index
const tabs = ref([
    { label: '淹没预测' },
    { label: '淹没模拟' },
]);

const toggleInfoCard = () => {
    showInfoCard.value = !showInfoCard.value;
};

const toggleModelInfoCard = () => {
    showModelInfoCard.value = !showModelInfoCard.value;
};

const toggleMenu = () => {
    isCollapsed.value = !isCollapsed.value;
};

const selectTab = (index) => {
    activeTab.value = index;
    emits('updateActiveTab', activeTab.value); // Emit activeTab value to parent
};

const selectedRainLevel = ref(2); // 默认选择的降雨等级
const selectedWaterLevel = ref(1); // 默认选择的水位等级
const selectedTideLevel = ref(0); // 默认选择的潮位等级

const levels = ref([
    { label: '1' },
    { label: '2' },
    { label: '3' },
    { label: '4' },
    { label: '5' }
]);

const selectRainLevel = (index) => {
    selectedRainLevel.value = index;
    emitSelectChange();
};

const selectWaterLevel = (index) => {
    selectedWaterLevel.value = index;
    emitSelectChange();
};

const selectTideLevel = (index) => {
    selectedTideLevel.value = index;
    emitSelectChange();
};

// Emit the selectChange event when any level is updated
const emitSelectChange = () => {
    const levels = [selectedRainLevel.value + 1, selectedWaterLevel.value + 1, selectedTideLevel.value + 1];
    emits('selectChange', levels); // 使用 emit 触发事件
};

const handleGenerateMap2 = () => {
    confirmLevel();  // Display a notification of the selected levels
    const levels = [selectedRainLevel.value + 1, selectedWaterLevel.value + 1, selectedTideLevel.value + 1];
    const multiplicationResult = levels.reduce((acc, level) => acc * level, 1);

    emits('confirm', multiplicationResult);  // 使用 emit 触发 confirm 事件并传递结果
    emits('generateMap2');  // 使用 emit 触发 generateMap2 事件

};

const confirmLevel = () => {
    ElNotification({
        message: `待生成的地图等级为P${selectedRainLevel.value + 1}_R${selectedWaterLevel.value + 1}_T${selectedTideLevel.value + 1}`,
        type: 'success',
    });
};

const handleGenerateMap = () => {
    const levels = [selectedRainLevel.value + 1, selectedWaterLevel.value + 1, selectedTideLevel.value + 1];
    emits('generateMap');  // 使用 emit 触发 generateMap 事件
};

const isMobile = ref(false);

// 检查是否是移动端
const checkDeviceType = () => {
    isMobile.value = window.innerWidth <= 1024;
};

// 监听页面变化
onMounted(() => {
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
});

// 移除监听器，防止内存泄露
onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDeviceType);
});

</script>

<style scoped>
/* 响应式设计 - 电脑端 */
@media screen and (min-width: 768px) {

    /* Image inside the info card */
    .info-card-image {
        width: 100%;
        max-width: 500px;
        height: auto;
        display: block;
        margin-left: 160px;
    }


    /* Close button for the info card */
    .close-button {
        position: absolute;
        top: 10px;
        /* Adjust to desired padding from the top */
        right: 15px;
        /* Adjust to desired padding from the right */
        background: none;
        border: none;
        font-size: 24px;
        font-weight: bold;
        color: #666;
        /* Gray color for the "×" */
        cursor: pointer;
    }

    .close-button:hover {
        color: #333;
        /* Darker color on hover */
    }

    /* Full-screen overlay to dim the page */
    /* Full-screen overlay to dim the page */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(34, 62, 118, 0.8);
        /* Semi-transparent background for the overlay */
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Centered white info card */
    .info-card {
        background-color: white;
        /* Fully opaque white background */
        padding: 20px;
        border-radius: 10px;
        width: 900px;
        text-align: left;
        /* Align text to the left */
        position: absolute;
        top: 50%;
        /* Move the card to the vertical center */
        left: 50%;
        /* Move the card to the horizontal center */
        transform: translate(-50%, -50%);
        /* Offset the position to truly center the card */
        z-index: 1001;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        /* Add a shadow to make it stand out */
        padding-left: 30px;
        /* Add padding from the left */
    }

    /* Large title (大标题) */
    .info-card-title {
        font-size: 18px;
        font-weight: bold;
        /* Make the title bold */
        color: #4a596a;
        /* Apply the requested font color */
        margin-bottom: 15px;
        /* Add some space below the title */
    }

    /* Subtitle (小标题) */
    .info-card-subtitle {
        font-size: 16px;
        font-weight: bold;
        /* Make the subtitle bold */
        color: #4a596a;
        /* Apply the requested font color */
        margin-bottom: 10px;
        /* Add some space below the subtitle */
    }

    /* Content text (文本内容) */
    .info-card-content {
        font-size: 16px;
        font-weight: normal;
        /* Normal weight for the content */
        color: #4a596a;
        /* Apply the requested font color */
        margin-bottom: 20px;
    }


    /* 模拟按钮样式 */
    .start-button {
        width: 200px;
        margin-top: 36px;
        padding: 10px;
        background: #0095d2;
        border-color: #0095d2;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        /* 圆角设置 */
    }

    .start-button:hover {
        background-color: #0095d2;
    }

    .speed-selector-container {
        margin-bottom: 35px;
    }

    /* 播放倍速模块的标题和信息图标容器 */
    .speed-header-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        margin-bottom: 20px;
    }

    .speed-header-title {
        font-size: 18px;
        font-weight: bold;
        color: white;
    }

    .level-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .level-item:hover {
        transform: scale(1.1);
        /* Slightly enlarges on hover */
    }

    .circle {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(219, 227, 247, .5);
        background-color: transparent;
        position: relative;
        z-index: 2;
        transition: border-color 0.3s ease;
        /* Smoothly changes border color */
    }

    .circle::before,
    .circle::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 1px;
        background-color: #2e57b8;
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
    }

    .circle::before {
        left: -12px;
    }

    .circle::after {
        right: -12px;
    }

    .inner-circle {
        width: 60%;
        height: 60%;
        background-color: #4fc3f7;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        /* Initially scaled down */
        transition: transform 0.3s ease, background-color 0.3s ease;
        /* Adds smooth animation for scaling */
    }

    .level-item.selected .circle {
        border-color: #4fc3f7;
    }

    .level-item.selected .inner-circle {
        transform: translate(-50%, -50%) scale(1);
        /* Scale up the inner circle when selected */
    }





    /* 包裹模型选择和导出模块的容器 */
    .second-arrow-container,
    .third-arrow-container {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-top: 20px;
    }

    /* 顶部小标题和信息图标容器 */
    .header-title-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        /* 左对齐 */
        gap: 10px;
        /* 控制选择等级和图标的距离 */
        margin-bottom: 2px;
    }

    .header-title {
        font-size: 18px;
        font-weight: bold;
        color: white;
    }

    /* el-icon 信息图标样式 */
    .info-icon {
        font-size: 22px;
        cursor: pointer;
        opacity: 0.6;
        /* 使图标透明 */
        transition: opacity 0.3s ease;
        transform: translateY(-7px);
    }

    .Speed-info-icon {
        font-size: 22px;
        cursor: pointer;
        opacity: 0.6;
        /* 使图标透明 */
        transition: opacity 0.3s ease;
        transform: translateY(-10px);
    }

    .Speed-info-icon:hover {
        opacity: 1;
        /* 悬停时恢复正常显示 */
    }

    .second-arrow-info-icon {
        font-size: 22px;
        cursor: pointer;
        opacity: 0.6;
        /* 使图标透明 */
        transition: opacity 0.3s ease;
        transform: translate(75px, -23px);
    }

    .second-arrow-info-icon:hover {
        opacity: 1;
        /* 悬停时恢复正常显示 */
    }

    /* 等级选择模块容器样式 */
    .level-selector-container {
        margin-bottom: 35px;
        /* 调整选择等级和模型选择模块之间的间距 */
    }

    /* 自定义下拉菜单 */
    .custom-dropdown {
        margin-top: -10px;
        position: relative;
        width: 200px;
        background-color: #2e57b8;
        color: white;
        border-bottom: 1px solid white;
        cursor: pointer;
        font-size: 16px;
    }

    .dropdown-selected {
        padding: 8px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* 隐藏右侧的下拉箭头 */
    .arrow {
        transition: transform 0.3s ease;
    }

    .arrow.open {
        transform: rotate(180deg);
    }

    /* 下拉选项 */
    .dropdown-options {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: white;
        color: #2e57b8;
        list-style: none;
        padding: 0;
        margin: 0;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }

    .dropdown-options li {
        padding: 10px;
        cursor: pointer;
    }

    .dropdown-options li:hover {
        background-color: #c6e2ff;
        color: #2e57b8;

    }

    .dropdown-options li.selected {
        background-color: #c6e2ff;
        color: #2e57b8;
    }

    /* 导出按钮样式 */
    .export-button {
        width: 200px;
        margin-top: 15px;
        padding: 10px;
        background: #0095d2;
        border-color: #0095d2;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        /* 圆角设置 */
    }

    .export-button:hover {
        background-color: #00a0e1;
    }


    .menu-container {
        width: 600px;
        height: 90px;
        position: fixed;
        top: 8.5vh;
        left: 0vw;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        box-sizing: border-box;
        background: #0d47a1;
        color: white;
        /* 白色字体 */
        padding: 0;
        margin: 0;
        transition: transform 0.3s ease;
    }

    .menu-container.collapsed {
        transform: translateX(-100%);
    }

    .collapse-button,
    .expand-button {
        position: absolute;
        top: -3px;
        width: 50px;
        height: 50px;
        background-color: #00a0e1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 26px;
        font-weight: bold;
    }

    .collapse-button {
        right: -50px;
    }

    .expand-button {
        left: 600px;
    }

    /* Custom Tabs styles */
    .custom-tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
        top: -3px;
    }

    .tab-headers {
        display: inline-flex;
        width: auto;
        /* Allow the container to adjust based on the content */
        height: 50px;
        justify-content: flex-start;
        /* Align tabs to the start */
        background-color: #2146a5;
        /* Default background color */
        font-family: Arial, Helvetica, sans-serif;
    }

    .tab-header {
        text-align: center;
        cursor: pointer;
        color: rgba(219, 227, 247, .5);
        transition: background-color 0.3s ease;
        font-size: 16px;
        font-weight: 550;
        letter-spacing: 1.1px;
        outline: 0;
        padding: 16px 24px;
        text-transform: uppercase;
        transition: all .16s linear;
    }

    .tab-header.active {
        color: white;
        background-color: #2e57b8;
        /* Same color as tab-content when active */
    }

    .tab-header:not(.active):hover {
        color: rgb(151, 198, 239);
        /* Hover effect for non-active tabs */
    }

    .tab-content {
        padding: 48px 32px 72px;
        padding-right: 50px;
        background-color: #2e57b8;
        /* Same as active tab */
        color: white;
        flex: 1;
    }

    /* 顶部小标题 */
    .header-title {
        font-size: 16px;
        font-weight: 500;
        color: white;
        margin-bottom: 20px;
    }

    /* 用于确保选择器垂直排列 */
    .level-container {
        display: flex;
        flex-direction: column;
        /* 使三行垂直排列 */
        gap: 20px;
        /* 行间距 */
    }

    /* 每行选择器的容器 */
    .level-selector-row {
        position: relative;
        left: 10px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        /* 垂直居中 */
    }

    /* 等级标签的文本 */
    .level-label {
        font-size: 14px;
        font-weight: lighter;
        color: white;
        margin-right: 10px;
    }

    /* 小标签样式 */
    .level-tag {
        display: block;
        font-size: 14px;
        color: white;
        margin-bottom: 5px;
        text-align: center;
        font-weight: bold;
    }


    /* 整体排列一行 */
    .level-row {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-top: 10px;
    }

    /* 文本样式 */
    .rainfall-level {
        font-size: 14px;
        font-weight: 520;
        margin-right: 10px;
        white-space: nowrap;
        /* 防止换行 */
    }

    /* 虚线容器，确保虚线与圆形选择器重叠 */
    .dotted-line-container {
        position: relative;
        flex-grow: 1;
        display: flex;
        align-items: center;
    }

    /* 虚线样式 */
    .dotted-line {
        width: 100%;
        border-bottom: 1px dashed rgba(219, 227, 247, .5);
        /* 使用虚线 */
        position: absolute;
        /* 让虚线处于底层 */
        z-index: 0;
    }

    .speed-dotted-line {
        width: 93%;
        border-bottom: 1px dashed rgba(219, 227, 247, .5);
        /* 使用虚线 */
        position: absolute;
        /* 让虚线处于底层 */
        z-index: 0;
        margin-left: 10px;
    }

    /* 圆形选择器样式 */
    .level-selector {
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: relative;
        z-index: 1;
        /* 确保圆形位于虚线上方 */
    }

    .level-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        margin-top: -20px;
        /* 提高整个 .level-item 以让圆形与虚线对齐 */
    }

    .circle {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(219, 227, 247, .5);
        background-color: transparent;
        background-color: #2e57b8;
        position: relative;
        z-index: 2;
        /* 确保圆形在虚线上 */
        margin-top: 0px;
        /* 轻微调整圆形的位置，使其与虚线对齐 */
    }

    /* 使用伪元素覆盖虚线左右两边，避免覆盖圆形 */
    .circle::before,
    .circle::after {
        content: '';
        position: absolute;
        width: 10px;
        /* 覆盖虚线左右的宽度 */
        height: 1px;
        /* 覆盖虚线的高度 */
        background-color: #2e57b8;
        /* 与背景色相同 */
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
        /* 在圆形下方，覆盖虚线 */
    }

    .circle::before {
        left: -12px;
        /* 圆形左边 */
    }

    .circle::after {
        right: -12px;
        /* 圆形右边 */
    }

    .inner-circle {
        width: 60%;
        /* 内部小圆，控制大小为 3/5 */
        height: 60%;
        background-color: #4fc3f7;
        /* 选中时的填充颜色 */
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* 居中 */
    }

    .level-item.selected .circle {
        border-color: #4fc3f7;
    }
}

@media screen and (max-width: 767px) {

    /* Image inside the info card */
    .info-card-image {
        width: 100%;
        max-width: 500px;
        height: auto;
        display: block;
        margin-left: 160px;
    }


    /* Close button for the info card */
    .close-button {
        position: absolute;
        top: 10px;
        /* Adjust to desired padding from the top */
        right: 15px;
        /* Adjust to desired padding from the right */
        background: none;
        border: none;
        font-size: 24px;
        font-weight: bold;
        color: #666;
        /* Gray color for the "×" */
        cursor: pointer;
    }

    .close-button:hover {
        color: #333;
        /* Darker color on hover */
    }

    /* Full-screen overlay to dim the page */
    /* Full-screen overlay to dim the page */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(34, 62, 118, 0.8);
        /* Semi-transparent background for the overlay */
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Centered white info card */
    .info-card {
        background-color: white;
        /* Fully opaque white background */
        padding: 20px;
        border-radius: 10px;
        width: 900px;
        text-align: left;
        /* Align text to the left */
        position: absolute;
        top: 50%;
        /* Move the card to the vertical center */
        left: 50%;
        /* Move the card to the horizontal center */
        transform: translate(-50%, -50%);
        /* Offset the position to truly center the card */
        z-index: 1001;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        /* Add a shadow to make it stand out */
        padding-left: 30px;
        /* Add padding from the left */
    }

    /* Large title (大标题) */
    .info-card-title {
        font-size: 18px;
        font-weight: bold;
        /* Make the title bold */
        color: #4a596a;
        /* Apply the requested font color */
        margin-bottom: 15px;
        /* Add some space below the title */
    }

    /* Subtitle (小标题) */
    .info-card-subtitle {
        font-size: 16px;
        font-weight: bold;
        /* Make the subtitle bold */
        color: #4a596a;
        /* Apply the requested font color */
        margin-bottom: 10px;
        /* Add some space below the subtitle */
    }

    /* Content text (文本内容) */
    .info-card-content {
        font-size: 16px;
        font-weight: normal;
        /* Normal weight for the content */
        color: #4a596a;
        /* Apply the requested font color */
        margin-bottom: 20px;
    }


    /* 模拟按钮样式 */
    .start-button {
        width: 200px;
        margin-top: 36px;
        padding: 10px;
        background: #0095d2;
        border-color: #0095d2;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        /* 圆角设置 */
    }

    .start-button:hover {
        background-color: #0095d2;
    }

    .speed-selector-container {
        margin-bottom: 35px;
    }

    /* 播放倍速模块的标题和信息图标容器 */
    .speed-header-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        margin-bottom: 20px;
    }

    .speed-header-title {
        font-size: 18px;
        font-weight: bold;
        color: white;
    }

    .level-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .level-item:hover {
        transform: scale(1.1);
        /* Slightly enlarges on hover */
    }

    .circle {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(219, 227, 247, .5);
        background-color: transparent;
        position: relative;
        z-index: 2;
        transition: border-color 0.3s ease;
        /* Smoothly changes border color */
    }

    .circle::before,
    .circle::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 1px;
        background-color: #2e57b8;
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
    }

    .circle::before {
        left: -12px;
    }

    .circle::after {
        right: -12px;
    }

    .inner-circle {
        width: 60%;
        height: 60%;
        background-color: #4fc3f7;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        /* Initially scaled down */
        transition: transform 0.3s ease, background-color 0.3s ease;
        /* Adds smooth animation for scaling */
    }

    .level-item.selected .circle {
        border-color: #4fc3f7;
    }

    .level-item.selected .inner-circle {
        transform: translate(-50%, -50%) scale(1);
        /* Scale up the inner circle when selected */
    }





    /* 包裹模型选择和导出模块的容器 */
    .second-arrow-container,
    .third-arrow-container {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-top: 20px;
    }

    /* 顶部小标题和信息图标容器 */
    .header-title-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        /* 左对齐 */
        gap: 10px;
        /* 控制选择等级和图标的距离 */
        margin-bottom: 2px;
    }

    .header-title {
        font-size: 18px;
        font-weight: bold;
        color: white;
    }

    /* el-icon 信息图标样式 */
    .info-icon {
        font-size: 22px;
        cursor: pointer;
        opacity: 0.6;
        /* 使图标透明 */
        transition: opacity 0.3s ease;
        transform: translateY(-7px);
    }

    .Speed-info-icon {
        font-size: 22px;
        cursor: pointer;
        opacity: 0.6;
        /* 使图标透明 */
        transition: opacity 0.3s ease;
        transform: translateY(-10px);
    }

    .Speed-info-icon:hover {
        opacity: 1;
        /* 悬停时恢复正常显示 */
    }

    .second-arrow-info-icon {
        font-size: 22px;
        cursor: pointer;
        opacity: 0.6;
        /* 使图标透明 */
        transition: opacity 0.3s ease;
        transform: translate(75px, -23px);
    }

    .second-arrow-info-icon:hover {
        opacity: 1;
        /* 悬停时恢复正常显示 */
    }

    /* 等级选择模块容器样式 */
    .level-selector-container {
        margin-bottom: 35px;
        /* 调整选择等级和模型选择模块之间的间距 */
    }

    /* 自定义下拉菜单 */
    .custom-dropdown {
        margin-top: -10px;
        position: relative;
        width: 200px;
        background-color: #2e57b8;
        color: white;
        border-bottom: 1px solid white;
        cursor: pointer;
        font-size: 16px;
    }

    .dropdown-selected {
        padding: 8px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* 隐藏右侧的下拉箭头 */
    .arrow {
        transition: transform 0.3s ease;
    }

    .arrow.open {
        transform: rotate(180deg);
    }

    /* 下拉选项 */
    .dropdown-options {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: white;
        color: #2e57b8;
        list-style: none;
        padding: 0;
        margin: 0;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }

    .dropdown-options li {
        padding: 10px;
        cursor: pointer;
    }

    .dropdown-options li:hover {
        background-color: #c6e2ff;
        color: #2e57b8;

    }

    .dropdown-options li.selected {
        background-color: #c6e2ff;
        color: #2e57b8;
    }

    /* 导出按钮样式 */
    .export-button {
        width: 200px;
        margin-top: 15px;
        padding: 10px;
        background: #0095d2;
        border-color: #0095d2;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        /* 圆角设置 */
    }

    .export-button:hover {
        background-color: #00a0e1;
    }


    .menu-container {
        width: 600px;
        height: 90px;
        position: fixed;
        top: 7.8vh;
        left: 0vw;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        box-sizing: border-box;
        background: #0d47a1;
        color: white;
        /* 白色字体 */
        padding: 0;
        margin: 0;
        transition: transform 0.3s ease;
        transform: scale(0.5); /* 整体缩放至 80% 大小 */
        transform-origin: top left; /* 缩放的起点为左上角 */
    }

    .menu-container.collapsed {
        transform: translateX(-100%);
    }

    .collapse-button,
    .expand-button {
        position: absolute;
        top: -3px;
        width: 50px;
        height: 50px;
        background-color: #00a0e1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 26px;
        font-weight: bold;
    }

    .collapse-button {
        right: -50px;
    }

    .expand-button {
        left: 600px;
    }

    /* Custom Tabs styles */
    .custom-tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
        top: -3px;
       
    }

    .tab-headers {
        display: inline-flex;
        width: auto;
        /* Allow the container to adjust based on the content */
        height: 50px;
        justify-content: flex-start;
        /* Align tabs to the start */
        background-color: #2146a5;
        /* Default background color */
        font-family: Arial, Helvetica, sans-serif;
    }

    .tab-header {
        text-align: center;
        cursor: pointer;
        color: rgba(219, 227, 247, .5);
        transition: background-color 0.3s ease;
        font-size: 16px;
        font-weight: 550;
        letter-spacing: 1.1px;
        outline: 0;
        padding: 16px 24px;
        text-transform: uppercase;
        transition: all .16s linear;
    }

    .tab-header.active {
        color: white;
        background-color: #2e57b8;
        /* Same color as tab-content when active */
    }

    .tab-header:not(.active):hover {
        color: rgb(151, 198, 239);
        /* Hover effect for non-active tabs */
    }

    .tab-content {
        padding: 48px 32px 72px;
        padding-right: 50px;
        background-color: #2e57b8;
        /* Same as active tab */
        color: white;
        flex: 1;
    }

    /* 顶部小标题 */
    .header-title {
        font-size: 16px;
        font-weight: 500;
        color: white;
        margin-bottom: 20px;
    }

    /* 用于确保选择器垂直排列 */
    .level-container {
        display: flex;
        flex-direction: column;
        /* 使三行垂直排列 */
        gap: 20px;
        /* 行间距 */
    }

    /* 每行选择器的容器 */
    .level-selector-row {
        position: relative;
        left: 10px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        /* 垂直居中 */
    }

    /* 等级标签的文本 */
    .level-label {
        font-size: 14px;
        font-weight: lighter;
        color: white;
        margin-right: 10px;
    }

    /* 小标签样式 */
    .level-tag {
        display: block;
        font-size: 14px;
        color: white;
        margin-bottom: 5px;
        text-align: center;
        font-weight: bold;
    }


    /* 整体排列一行 */
    .level-row {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-top: 10px;
    }

    /* 文本样式 */
    .rainfall-level {
        font-size: 14px;
        font-weight: 520;
        margin-right: 10px;
        white-space: nowrap;
        /* 防止换行 */
    }

    /* 虚线容器，确保虚线与圆形选择器重叠 */
    .dotted-line-container {
        position: relative;
        flex-grow: 1;
        display: flex;
        align-items: center;
    }

    /* 虚线样式 */
    .dotted-line {
        width: 100%;
        border-bottom: 1px dashed rgba(219, 227, 247, .5);
        /* 使用虚线 */
        position: absolute;
        /* 让虚线处于底层 */
        z-index: 0;
    }

    .speed-dotted-line {
        width: 93%;
        border-bottom: 1px dashed rgba(219, 227, 247, .5);
        /* 使用虚线 */
        position: absolute;
        /* 让虚线处于底层 */
        z-index: 0;
        margin-left: 10px;
    }

    /* 圆形选择器样式 */
    .level-selector {
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: relative;
        z-index: 1;
        /* 确保圆形位于虚线上方 */
    }

    .level-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        margin-top: -20px;
        /* 提高整个 .level-item 以让圆形与虚线对齐 */
    }

    .circle {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(219, 227, 247, .5);
        background-color: transparent;
        background-color: #2e57b8;
        position: relative;
        z-index: 2;
        /* 确保圆形在虚线上 */
        margin-top: 0px;
        /* 轻微调整圆形的位置，使其与虚线对齐 */
    }

    /* 使用伪元素覆盖虚线左右两边，避免覆盖圆形 */
    .circle::before,
    .circle::after {
        content: '';
        position: absolute;
        width: 10px;
        /* 覆盖虚线左右的宽度 */
        height: 1px;
        /* 覆盖虚线的高度 */
        background-color: #2e57b8;
        /* 与背景色相同 */
        top: 50%;
        transform: translateY(-50%);
        z-index: -1;
        /* 在圆形下方，覆盖虚线 */
    }

    .circle::before {
        left: -12px;
        /* 圆形左边 */
    }

    .circle::after {
        right: -12px;
        /* 圆形右边 */
    }

    .inner-circle {
        width: 60%;
        /* 内部小圆，控制大小为 3/5 */
        height: 60%;
        background-color: #4fc3f7;
        /* 选中时的填充颜色 */
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* 居中 */
    }

    .level-item.selected .circle {
        border-color: #4fc3f7;
    }
}
</style>
