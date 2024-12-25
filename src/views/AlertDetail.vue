<template>
  <div class="container">
    <!-- 第一行：编辑警报状态 -->
    <el-row type="flex" justify="center" style="margin-bottom: 20px;">
      <el-col :span="12">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="8">警报状态修改:</el-col>
          <el-col :span="8">
            <el-select v-model="editStatus" placeholder="请选择状态">
              <el-option label="未解决" value="未解决"></el-option>
              <el-option label="已解决" value="已解决"></el-option>
              <el-option label="错误警报" value="错误警报"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="updateAlertStatus">保存状态</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 第二行：四张卡片 -->
    <el-row :gutter="20" type="flex" justify="space-between" style="display: flex; flex-grow: 1;">
      <!-- 左侧两个卡片 -->
      <el-col :span="12" style="display: flex; flex-direction: column; flex-grow: 1;">
        <!-- 警报详情 -->
        <el-card class="alert-detail" style="flex-grow: 1;">
          <template #header>
            <span>警报详情: {{ alert ? alert.alertID : '' }}</span>
          </template>
          <div v-if="alert">
            <el-row>
              <el-col span="20" style="text-align: left;width: 75%">
                <p>警报类型: {{ alert.alertType }}</p>
                <p>警报时间: {{ formatDate(alert.datetime) }}</p>
                <p>警报对象ID: {{ alert.elderID }}</p>
                <p>警报对象位置:</p>
                <p>{{ displayLocation(alert.location) }}</p>
                <p>警报状态: {{ alert.status }}</p>
              </el-col>
              <el-col span="4" style="text-align: left">
                <p>手环数据</p>
                <p>血压: {{ alert.bloodPressure }}</p>
                <p>血氧: {{ alert.bloodOxygen }}</p>
                <p>心率: {{ alert.heartRate }}</p>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <p>加载中...</p>
          </div>
        </el-card>
        <!-- 老人详情 -->
        <ElderInfoCard :elderID="alert ? alert.elderID : ''" class="elder-info-card" />
      </el-col>

      <!-- 右侧两个卡片 -->
      <el-col :span="12" style="display: flex; flex-direction: column; flex-grow: 1;">
        <!-- 地图 -->
        <el-card class="alert-detail" style="flex-grow: 1;">
          <template #header>
            <span>位置信息</span>
          </template>
          <div id="map-container" v-if="alert" style="width: 100%; height: 100%;">
            <tencent-map :key="alert.alertID" :location="alert.location"></tencent-map>
          </div>
          <div v-else>
            <p>加载中...</p>
          </div>
        </el-card>
        <!-- 监控 -->
        <el-card class="alert-detail" style="flex-grow: 1;">
          <template #header>
            <span>警报监控画面详情: {{ alert?.monitorID || '加载中...' }}</span>
          </template>
          <div v-if="alert" class="video-wrapper">
            <video autoplay loop muted playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
              <source src="/static/video1.mp4" type="video/mp4">
              您的浏览器不支持 video 标签。
            </video>
          </div>
          <div v-else>
            <p>加载中...</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.el-row {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  margin-bottom: 20px;
}

.el-col {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.alert-detail,
.elder-info-card {
  font-size: 14px;
  margin: 10px;
  height: auto; /* 根据内容自动调整高度 */
  min-height: 150px; /* 设置一个合理的最小高度 */
  flex-grow: 1; /* 让卡片根据内容自动扩展 */
  overflow: hidden; /* 防止内容溢出 */
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 这个比例对应于 16:9 的宽高比 */
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ElderInfoCard from "@/components/ElderInfoCard.vue";
import TencentMap from "@/components/TencentMap.vue";

const route = useRoute();
const alert = ref(null);
const dataLoaded = ref(false); // 添加一个标志位来追踪数据是否加载完成
const isMapVisible = ref(false); // 控制地图是否可见
// 新增状态和描述的编辑变量
const editStatus = ref('');
const editDescription = ref('');
// Fetch the specific alert based on the ID in the route parameters
onMounted(async () => {
  try {
    const alertId = route.params.id;

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `
        SELECT * FROM alert WHERE alertID = '${alertId}';
      `,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      alert.value = response.data[0];
      console.log(response.data[0]);
    } else {
      console.log('没有找到相关数据');
      alert.value = null;
    }
  } catch (error) {
    console.error('There was an error fetching the alert details!', error);
    alert.value = null; // Or set to a default state
  } finally {
    dataLoaded.value = true; // 数据加载完成后设置标志位为true
  }
});

// 监听 alert 的变化并在其变为非空时显示地图
watch(alert, (newValue) => {
  if (newValue && newValue.location && newValue.location.x && newValue.location.y) {
    setTimeout(() => {
      isMapVisible.value = true;
    }, 100); // 确保DOM更新后延迟显示地图
  } else {
    isMapVisible.value = false;
  }
}, { immediate: true }); // 立即执行一次监听器

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const displayLocation = (location) => {
  console.log('Location received:', location); // 调试：查看接收到的位置信息

  if (!location || typeof location !== 'object' || !('x' in location) || !('y' in location)) {
    return '位置信息不可用';
  }

  const { x, y } = location;
  console.log('Parsed coordinates:', x, y); // 调试：确认解析的坐标

  // 直接返回经度和纬度，不再使用正则表达式
  return `经度: ${x}, 纬度: ${y}`;
};
// 更新警报状态的方法
const updateAlertStatus = async () => {
  if (!alert.value) return;

  try {
    await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `
        UPDATE alert SET status='${editStatus.value}' WHERE alertID='${alert.value.alertID}';
      `,
    });
    alert.value.status = editStatus.value; // 更新本地状态
    console.log('警报状态已更新');
  } catch (error) {
    console.error('更新警报状态失败', error);
  }
};

// 更新警报描述的方法
// eslint-disable-next-line no-unused-vars
const updateAlertDescription = async () => {
  if (!alert.value) return;

  try {
    await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `
        UPDATE alert SET description='${editDescription.value}' WHERE alertID='${alert.value.alertID}';
      `,
    });
    alert.value.description = editDescription.value; // 更新本地描述
    console.log('警报描述已更新');
  } catch (error) {
    console.error('更新警报描述失败', error);
    if (error.response) {
      // 请求成功发出但服务器响应了一个状态码范围之外的状态
      console.error('Server responded with status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // 请求已构建但未收到响应
      console.error('No response received:', error.request);
    } else {
      // 设置请求时发生了一些事情，触发了错误
      console.error('Error setting up request:', error.message);
    }
  }
};
</script>
