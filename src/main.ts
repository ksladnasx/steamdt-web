import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入图标库（若安装）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import router from '@/router';
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(ElementPlus)
// 注册所有图标（可选）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
