<template>
  <el-container style="height: 100vh;">
    <!-- 左侧导航栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" style="background-color: rgb(238, 241, 246)">
      <div style="padding: 15px; text-align: center;">
        <el-tooltip :content="isCollapse ? '展开' : '折叠'" placement="right">
          <el-button circle @click="toggleNav">
            <el-icon v-if="isCollapse"><Expand /></el-icon>
            <el-icon v-else><Fold /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @select="handleSelect"
      >
        <el-menu-item v-for="monitor in monitors" :key="monitor.monitorID" :index="monitor.monitorID">
          <span>{{ monitor.monitorID }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主要内容区域 -->
    <el-container>
      <el-header style="display: flex; align-items: center; justify-content: space-between;">
        <span class="header-title">监控系统</span>
      </el-header>
      <el-main>
        <div v-if="loading">
          <p>正在加载监控点数据...</p>
        </div>
        <div v-else-if="selectedMonitor">
<!--          <h2>{{ selectedMonitor.formattedAddress }}</h2>-->
          <p>监控 ID: {{ selectedMonitor.monitorID }}</p>
          <p v-if="selectedMonitor.location">
           监控地址: {{ selectedMonitor.location }}
          </p>
          <div>
            监控画面：
            <video src="/static/video1.mp4" autoplay loop></video>
          </div>
        </div>
        <div v-else>
          <p>请选择一个监控点以查看详细信息。</p>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Expand, Fold } from '@element-plus/icons-vue';

// 响应式数据
const isCollapse = ref(true);
const monitors = ref([]);
const selectedMonitor = ref(null);
const loading = ref(true); // 添加加载状态

// 方法
const toggleNav = () => {
  isCollapse.value = !isCollapse.value;
};
const fetchMonitors = async () => {
  try {
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: "SELECT * FROM monitor"
    });
    monitors.value=response.data
  } catch (error) {
    console.error('There was an error fetching the monitor data!', error);
  } finally {
    loading.value = false; // 数据加载完成后关闭加载状态
  }
};
// 在选择监控点时获取详细地址信息

// 在选择监控点时获取详细地址信息
const handleSelect = async (index) => {
  const selected = monitors.value.find(monitor => monitor.monitorID === index);
  if (selected && selected.location) {
    selectedMonitor.value = { ...selected, formattedAddress: '正在加载...' }
  }
};

// 在组件挂载时获取监控数据
onMounted(() => {
  fetchMonitors();
});
</script>

<style scoped>
.header-title {
  font-size: 1.2em;
  margin-left: auto;
  margin-right: 20px;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  display: flex;
  align-items: center;
}

.el-aside {
  color: #333;
  display: flex;
  flex-direction: column;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  padding: 20px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>