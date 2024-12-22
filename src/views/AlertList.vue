<template>
  <div class="alert-container">
    <!-- 筛选表单 -->
    <el-form :inline="true" class="align-left">
      <el-form-item label="警报ID">
        <el-input v-model="filters.alertID" placeholder="请输入警报ID"></el-input>
      </el-form-item>
      <el-form-item label="警报类型">
        <el-select v-model="filters.alertType" placeholder="请选择警报类型">
          <el-option label="全部" value=""></el-option>
          <el-option label="室内监控" value="室内监控"></el-option>
          <el-option label="室外监控" value="室外监控"></el-option>
          <el-option label="手环" value="手环"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="请选择状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未解决" value="未解决"></el-option>
          <el-option label="已解决" value="已解决"></el-option>
          <el-option label="错误警报" value="错误警报"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事发时间">
        <el-date-picker v-model="filters.datetime" type="datetime" placeholder="选择事发时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="老人ID">
        <el-input v-model="filters.elderID" placeholder="请输入老人ID"></el-input>
      </el-form-item>
      <el-form-item label="监控设备ID">
        <el-input v-model="filters.monitorID" placeholder="监控设备ID"></el-input>
      </el-form-item>
      <!-- 应用筛选和清除筛选按钮 -->
      <el-form-item>
        <el-button type="primary" @click="applyFilters">查询</el-button>
        <el-button type="danger" @click="clearFilters">清除筛选</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="filteredAlerts" style="width: 100%" @row-click="handleAlertClick" :row-class-name="tableRowClassName">
      <el-table-column prop="alertID" label="警报ID" width="180" sortable></el-table-column>
      <el-table-column prop="datetime" label="事发时间" width="180" sortable></el-table-column>
      <el-table-column prop="alertType" label="警报类型" width="180" sortable></el-table-column>
      <el-table-column prop="monitorID" label="监控设备ID" width="180" sortable></el-table-column>
      <el-table-column prop="elderID" label="老人ID" width="180" sortable></el-table-column>
      <el-table-column prop="status" label="状态" width="180" sortable></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// 定义 emits
// eslint-disable-next-line no-undef
const emit = defineEmits(['addTabAlert']);

// 表格数据
const alerts = ref([]);

// 筛选条件
const filters = ref({
  alertID: '',
  alertType: '',
  status: '',
  datetime: null,
  elderID: '',
  monitorID: ''
});

// 当前生效的筛选条件
const filteredAlerts = computed(() => {
  return alerts.value.filter(alert =>
      (!filters.value.alertID || alert.alertID.includes(filters.value.alertID)) &&
      (!filters.value.alertType || alert.alertType === filters.value.alertType) &&
      (!filters.value.status || alert.status === filters.value.status) &&
      (!filters.value.datetime || new Date(alert.datetime).toDateString() === new Date(filters.value.datetime).toDateString()) &&
      (!filters.value.elderID || alert.elderID.includes(filters.value.elderID)) &&
      (!filters.value.monitorID || alert.monitorID.includes(filters.value.monitorID))
  );
});

// 获取最新警报数据
const fetchLatestAlerts = async () => {
  try {
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: "SELECT * FROM alert"
    });
    if (response.data && response.data.length > 0) {
      alerts.value = response.data;
    } else {
      console.log('没有找到相关数据');
      alerts.value = [];
    }
  } catch (error) {
    console.error('There was an error fetching the latest alerts!', error);
  }
};

onMounted(() => {
  fetchLatestAlerts();
  setInterval(fetchLatestAlerts, 60000); // 每分钟刷新一次数据
});

// 清除筛选条件
const clearFilters = () => {
  Object.keys(filters.value).forEach(key => filters.value[key] = '');
};

// 处理警报卡片点击事件
// eslint-disable-next-line no-unused-vars
const handleAlertClick = (row, event) => {
  if (!row || !row.alertID) {
    console.error('Invalid row or alertID is missing:', row);
    return;
  }
  console.log('Clicked on row with ID:', row.alertID);
  emit('addTabAlert', { name: 'AlertDetail', params: { id: row.alertID } });
};

// 提交筛选条件
const applyFilters = (event) => {
  event.preventDefault(); // 手动阻止默认提交行为
  // 这里放置你的筛选逻辑
};
// 添加一个方法来确定每一行的类名
const tableRowClassName = ({ row }) => {
  if (row.status === '未解决') {
    return 'warning-row';
  } else if (row.status === '已解决') {
    return 'success-row';
  } else if (row.status === '错误警报') {
    return 'danger-row';
  }
  return '';
};
</script>
<style >

/* 自定义样式 */
.warning-row {
  //background-color: #ffeb9b !important; /* 警告颜色 */
  background-color: #fceff0 !important; /* 危险颜色 */
}

.success-row {
  background-color: #ffffff !important; /* 成功颜色 */
}

.danger-row {
  background-color: #f8f5d7 !important; /* 危险颜色 */
}
</style>