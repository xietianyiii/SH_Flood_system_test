<template>
    <div class="slider">
        <div class="slider-demo-block">
            <el-slider v-model="value" :step="10" show-stops />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(0)
</script>
<style scoped>



.slider-demo-block {
    background: rgba(1,15,25,.698);
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
    margin-right: 12px;
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
</style>
  