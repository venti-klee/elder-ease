<template>
  <div class="work-order-container">

    <!-- 左侧：工单详情 -->
    <el-col :span="15" class="order-details-section">
      <div v-if="currentRow" class="order-details">
        <el-form label-width="120px" class="order-form">
          <el-form-item label="工单号" class="order-id-item">
            {{ currentRow.workOrderID }}
          </el-form-item>
          <el-form-item label="订单号">
            {{ currentRow.orderID }}
          </el-form-item>
          <el-form-item label="老人姓名">
            {{ currentRow.elderName || '未知老人' }}
          </el-form-item>
          <el-form-item label="服务类型">
            {{ currentRow.type }}
          </el-form-item>
          <el-form-item label="备注">
            {{ currentRow.remarks || '无' }}
          </el-form-item>
          <el-form-item label="开始时间">
            {{ formatTime(currentRow.startTime) }}
          </el-form-item>
          <el-form-item label="结束时间">
            {{ formatTime(currentRow.endTime) }}
          </el-form-item>
          <el-form-item label="日期">
            {{ formatDate(currentRow.date) }}
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="currentRow.status === '未派遣' ? 'danger' : 'success'" disable-transitions>
              {{ currentRow.status }}
            </el-tag>
          </el-form-item>
        </el-form>
      </div>
      <p v-else>加载中...</p>
    </el-col>

    <!-- 右侧：护工详情 -->
    <el-col :span="15" class="worker-details-section">
      <div v-if="workerDetails" class="worker-details">
        <el-form label-width="120px" class="order-form">
          <el-form-item>
            <img
                :src="workerPicUrl"
                alt="护工照片"
                class="worker-photo"
            />
          </el-form-item>
          <el-form-item label="护工工号">
            {{ workerDetails.workerID }}
          </el-form-item>
          <el-form-item label="护工姓名">
            {{ workerDetails.workerName || '无名护工' }}
          </el-form-item>
          <el-form-item label="性别">
            {{ workerDetails.workerGender }}
          </el-form-item>
          <el-form-item label="联系电话">
            {{ workerDetails.workerPhoneNumber }}
          </el-form-item>
          <el-form-item label="年龄">
            {{ workerDetails.workerAge }}
          </el-form-item>
        </el-form>
      </div>
      <p v-else-if="currentRow && !workerDetails">无关联护工信息</p>
      <p v-else>加载中...</p>
    </el-col>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const route = useRoute();
const currentRow = ref(null);
const workerDetails = ref(null);

// 格式化日期和时间函数
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '';
const formatTime = (time) => time ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';

// 获取工单详情
const fetchWorkOrderDetails = async (workOrderID) => {
  try {
    if (!/^WO\d{8}\d{4}$/.test(workOrderID)) throw new Error('无效的工单ID格式');

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `
        SELECT w.workOrderID, w.orderID, w.date, w.status, w.workerID, wi.workerName,
               o.elderID, o.type, o.remarks, o.startTime, o.endTime, ei.elderName
        FROM \`workorder\` w
        LEFT JOIN \`order\` o ON w.orderID = o.orderID
        LEFT JOIN \`elderinfo\` ei ON o.elderID = ei.elderID
        LEFT JOIN \`workerinfo\` wi ON w.workerID = wi.workerID
        WHERE w.workOrderID = '${workOrderID}'
      `
    });

    if (response.data.length > 0) {
      currentRow.value = response.data[0];
      currentRow.value.date = formatDate(currentRow.value.date);
      currentRow.value.startTime = formatTime(currentRow.value.startTime);
      currentRow.value.endTime = formatTime(currentRow.value.endTime);
      await fetchWorker();
    } else {
      ElMessage.warning('未找到对应工单详情，请检查工单编号是否正确。');
      resetData();
    }
  } catch (error) {
    console.error('加载工单详情时出错:', error);
    ElMessage.error('加载工单详情失败，请检查网络连接或稍后再试。');
    resetData();
  }
};

// 获取护工详情
const fetchWorker = async () => {
  if (!currentRow.value || !currentRow.value.workerID) return;

  try {
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `
        SELECT workerID, workerName, workerGender, workerPhoneNumber, workerAge
        FROM \`workerinfo\`
        WHERE workerID = '${currentRow.value.workerID}'
      `
    });

    if (response.data.length > 0) {
      workerDetails.value = response.data[0];
      // 如果存在 workerPic 并且需要使用绝对路径，可以在这里处理
      // 注意：确保 imageBaseUrl 是正确的并且已定义
      if (workerDetails.value.workerPic && process.env.VUE_APP_IMAGE_BASE_URL) {
        workerDetails.value.workerPic = `${process.env.VUE_APP_IMAGE_BASE_URL}${workerDetails.value.workerPic}`;
      }
    } else {
      ElMessage.warning('未找到对应护工详情，请检查护工编号是否正确。');
      workerDetails.value = null;
    }
  } catch (error) {
    console.error('加载护工详情时出错:', error);
    ElMessage.error('加载护工详情失败，请检查网络连接或稍后再试。');
    workerDetails.value = null;
  }
};

// 计算属性来确定护工照片的 URL
const workerPicUrl = computed(() => workerDetails.value?.workerPic || new URL('../assets/pic.jpg', import.meta.url).href);

// 监听路由参数 workOrderID 的变化并执行相应逻辑
watch(
    () => route.params.workOrderID,
    async (newWorkOrderID) => {
      if (newWorkOrderID) {
        await fetchWorkOrderDetails(newWorkOrderID);
      } else {
        resetData();
      }
    },
    { immediate: true }
);

// 重置数据的方法
const resetData = () => {
  currentRow.value = null;
  workerDetails.value = null;
};
</script>

<style scoped>
.work-order-container {
  display: flex;
  gap: 20px;
}

.order-details-section, .worker-details-section {
  background-color: #f9fafc;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.order-details, .worker-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-form .el-form-item {
  margin-bottom: 18px;
}

.order-form .el-form-item__label {
  font-weight: bold;
}

.order-id-item .el-form-item__label {
  width: 160px;
}

.order-id-item .el-form-item__content {
  margin-left: 20px;
}

.worker-photo {
  max-width: 150px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.worker-photo:hover {
  transform: scale(1.05);
}
</style>