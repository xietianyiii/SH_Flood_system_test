<template>
    <div class="container">
        <div class="menu-container">
            <el-menu class="el-menu-vertical-demo" default-active="2" @open="handleOpen" @close="handleClose">

                <router-link to="/forecasting" class="menu-link">
                    <el-menu-item index="2">
                        <el-icon><setting /></el-icon>
                        <span>淹没预测</span>
                    </el-menu-item>
                </router-link>

                <router-link to="/modeling" class="menu-link">
                    <el-menu-item index="3">
                        <el-icon>
                            <icon-menu />
                        </el-icon>
                        <span>实时监测预警</span>
                    </el-menu-item>
                </router-link>

            </el-menu>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style scoped>
.container {
    height: 100vh;
    background-color: white;
    /* 设置背景颜色为蓝色 */
    margin: 0;
    border: none;
    padding: 0;
}

.menu-container {
    border: none;
}

.el-menu-vertical-demo {
    border: none;
}
</style>