import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'vant/lib/index.css'; // 引入 Vant 样式文件
import { NavBar, Sidebar, SidebarItem ,Icon  } from 'vant';
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
app.use(router)
app.use(ElementPlus)
app.use(NavBar);
app.use(Sidebar);
app.use(SidebarItem);
app.use(Icon);

app.mount('#app')
