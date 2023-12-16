<template>
    <div class="slider">
        <div class="slider-demo-block">
            <el-button link circle class="btn-container" @click="toggleIcon">
                <el-icon v-if="showPlayIcon" :size="45" class="play">
                    <VideoPlay />
                </el-icon>
                <el-icon v-show="!showPlayIcon" :size="45" class="pause"><VideoPause /></el-icon>
            </el-button>
            <el-slider v-model="value" :step="10" show-stops :marks="marks" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { CSSProperties } from 'vue'

const showPlayIcon = ref(true);

const toggleIcon = () => {
  showPlayIcon.value = !showPlayIcon.value;
  // Add additional logic if needed
};

interface Mark {
    style: CSSProperties
    label: string
}

type Marks = Record<number, Mark | string>

const value = ref(0)
const marks = reactive<Marks>({
    0: '08:00',
    10: '08:00',
    20: '08:00',
    30: '08:00',
    40: '08:00',
    50: '08:00',
    60: '08:00',
    70: {
        style: {
            color: '#bce689',
        },
        label: '08:00',
    },
    80: '08:00',
    90: '08:00',
    100: '08:00',
})
</script>
<style scoped>
.slider-demo-block {
    background: rgba(1, 15, 25, .698);
    border-radius: 10px 100px / 120px;
    position: absolute;
    bottom: 3vh;
    right: 20px;
    transition: all .5s linear;
    display: flex;
    width: calc(100% - 25vw);
    height: 10vh;
    left: 3.6458333333vw;
    align-items: center;
}

.slider-demo-block .el-slider {
    margin-left: 16px;
    margin-right: 30px;
}

.slider-demo-block .demonstration {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
}

.slider-demo-block .demonstration+.el-slider {
    flex: 0 0 70%;
}

.btn-container {
    width: 50px;
    height: 50px;
    margin-left: 20px;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);
    
}



</style>
  