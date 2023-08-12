<template>
    <el-button type="primary" :icon="Avatar" style="margin-left: 16px" @click="drawer = true">
        Account
    </el-button>

    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        
       

    </el-drawer>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { Avatar } from '@element-plus/icons-vue'


const drawer = ref(false)
</script>
  