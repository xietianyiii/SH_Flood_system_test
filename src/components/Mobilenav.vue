<template>
    <div class="container">
        <div class="menu-container">
            <el-menu class="el-menu-vertical-demo" default-active="3" @open="handleOpen" @close="handleClose">


                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <location />
                        </el-icon>
                        <span>最大淹没情况</span>
                    </template>
                    <router-link to="/function21" class="menu-link"><el-menu-item
                            index="1-1">水深</el-menu-item></router-link>
                    <router-link to="/function22" class="menu-link"><el-menu-item
                            index="1-2">范围</el-menu-item></router-link>

                </el-sub-menu>


                <router-link to="/function1" class="menu-link">
                    <el-menu-item index="2">
                        <el-icon><icon-menu /></el-icon>
                        <span>特大淹没概率</span>
                    </el-menu-item>
                </router-link>

                <router-link to="/function3" class="menu-link">
                    <el-menu-item index="3">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <span>淹没情况模拟</span>
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