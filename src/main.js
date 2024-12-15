// main.js 或 app.js
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router/router'; // 确保路径正确指向你的路由配置文件

const app = createApp(App);

app.use(ElementPlus); // 使用 Element Plus 组件库
app.use(router);      // 使用 Vue Router

// 不要在这里使用 app.use(axios);

app.mount('#app');    // 挂载应用到页面上