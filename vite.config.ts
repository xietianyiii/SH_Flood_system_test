import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    visualizer({
      open: true, // 构建完成后自动打开分析页面
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
         if (id.includes('node_modules')) {
            // 按需拆分特定模块
            if (id.includes('mapbox-gl')) return 'mapbox'; // mapbox 拆分到单独的 chunk
            if (id.includes('element-plus')) return 'elementPlus'; // element-plus 拆分
            if (id.includes('apexcharts')) return 'apexCharts'; // apexcharts 拆分
            // 如果有其他大库，例如 vue-router、axios，可以按需拆分
            if (id.includes('vue-router')) return 'vue-router'; // vue-router 拆分
            if (id.includes('axios')) return 'axios'; // axios 拆分
            // 默认将所有其他库放入 vendor
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 300
  }
})
