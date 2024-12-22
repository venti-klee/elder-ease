// main.js 或 app.js

import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router/router'; // 确保路径正确指向你的路由配置文件
import TMapVue from 'tlbs-map-vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

// 使用 Element Plus 组件库
app.use(ElementPlus);

// 使用 Vue Router
app.use(router);

// 使用 TMapVue 插件，并传递腾讯地图 API 密钥
app.use(TMapVue, {
    key: 'K64BZ-G3GKA-5JFKV-CTL5T-S43JF-53FGU', // 替换为你的腾讯地图 API 密钥
});

// 全局注册所有 Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 挂载应用到页面上
app.mount('#app');