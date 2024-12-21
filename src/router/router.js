// router/router.js
import { createRouter, createWebHistory } from 'vue-router';
import AlertDetail from '../views/AlertDetail.vue'; // 确保路径正确
const routes = [
    {
        path: '/login',
        name: "login",
        component: () => import("../views/LoginView.vue"),
    },

    {
        path: '/',
        name: 'index', // 定义名为 'index' 的路由
        redirect: '/home', // 默认重定向到首页
        component: () => import("../views/IndexView.vue"), // 使用 IndexView.vue 作为主布局
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import("../views/HomeView.vue"),
            },
            {
                path: '/alerts/:id',
                name: 'AlertDetail',
                component: AlertDetail,
                props: true // 将路由参数作为props传递给组件

            },
            {
                path: 'order-management',
                name: 'orderManagement',
                component: () => import("../views/OrderManagement.vue"),
            },
            {
                path: 'work-orders',
                name: 'workOrders',
                component: () => import("../views/WorkOrders.vue"),
            },
            {
                path: 'elder-list',
                name: 'elderList',
                component: () => import("../views/ElderList.vue"),
            },
            {
                path: 'elder-info',
                name: 'elderInfo',
                component: () => import("../views/ElderInfo.vue"),
            },
            {
                path: 'live-monitoring',
                name: 'liveMonitoring',
                component: () => import("../views/LiveMonitoring.vue"),
            },
            {
                path: 'health-data',
                name: 'healthData',
                component: () => import("../views/HealthData.vue"),
            },
            {
                path: 'alert-list',
                name: 'alertList',
                component: () => import("../views/AlertList.vue"),
            },
            {
                path: 'alert-settings',
                name: 'alertSettings',
                component: () => import("../views/AlertSettings.vue"),
            },
            // 其他子路由...
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), // 使用 BASE_URL 环境变量
    routes, // 使用上面定义的 routes 数组
});


export default router;