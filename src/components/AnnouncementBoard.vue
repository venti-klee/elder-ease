<template>
  <el-card class="announcement-board">
    <template #header>
      <span>警告信息栏</span>
    </template>
    <el-timeline>
      <!-- 按天分组的警报 -->
      <el-timeline-item
          v-for="(group, index) in groupedAlerts"
          :key="index"
          :timestamp="group.date"
          placement="top"
          style="padding: 0;"
      >
        <el-row :gutter="10" style="margin: -5px;">
          <el-col
              v-for="alert in group.alerts"
              :key="alert.alertID"
              :span="12"
              style="padding: 5px;"
          >
            <div @click="handleAlertClick(alert)">
              <el-card :class="['alert-card', getAlertStatusClass(alert.status)]">
                <h4 style="margin: 0;">警报类型: {{ alert.alertType }}</h4>
                <p style="margin: 2px 0;">警报时间: {{ formatDate(alert.datetime) }}</p>
                <p style="margin: 2px 0;">警报对象ID: {{ alert.elderID }}</p>
                <p style="margin: 2px 0;">警报对象位置: {{ displayLocation(alert.location) }}</p>
                <p style="margin: 2px 0;">警报状态: {{ alert.status }}</p>
              </el-card>
            </div>

<!--            <router-link-->
<!--                :to="{ name: 'AlertDetail', params: { id: alert.alertID } }"-->
<!--                style="text-decoration: none; color: inherit; display: block;"-->
<!--            >-->
<!--              <el-card :class="['alert-card', getAlertStatusClass(alert.status)]">-->
<!--                <h4 style="margin: 0;">警报类型: {{ alert.alertType }}</h4>-->
<!--                <p style="margin: 2px 0;">警报时间: {{ formatDate(alert.datetime) }}</p>-->
<!--                <p style="margin: 2px 0;">警报对象ID: {{ alert.elderID }}</p>-->
<!--                <p style="margin: 2px 0;">警报对象位置: {{ displayLocation(alert.location) }}</p>-->
<!--                <p style="margin: 2px 0;">警报状态: {{ alert.status }}</p>-->
<!--              </el-card>-->
<!--            </router-link>-->
          </el-col>
        </el-row>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const alerts = ref([]);

const fetchLatestAlerts = async () => {
  try {
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: "SELECT  *\n" +

          "FROM \n" +
          "  alert \n" +
          "ORDER BY \n" +
          "  datetime DESC \n" +
          "LIMIT 10;",
    });
    if (response.data && response.data.length > 0) {
      alerts.value = response.data;
      console.log(response.data);
    } else {
      console.log('没有找到相关数据');
      alerts.value = null;
    }
  } catch (error) {
    console.error('There was an error fetching the latest alerts!', error);
  }
};

onMounted(() => {
  fetchLatestAlerts();
  setInterval(fetchLatestAlerts, 60000); // 每分钟刷新一次数据
});

const sortedAlerts = computed(() => {
  return [...alerts.value].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
});

const groupedAlerts = computed(() => {
  const groups = {};
  sortedAlerts.value.forEach(alert => {
    const date = new Date(alert.datetime).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = { date, alerts: [] };
    }
    groups[date].alerts.push(alert);
  });
  return Object.values(groups);
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// 根据警报状态返回相应的类名
const getAlertStatusClass = (status) => {
  if (status === '未解决') return 'unsolved';
  if (status === '已解决') return 'solved';
  if (status === '错误警报') return 'error-alert';
  return ''; // 默认情况下没有额外的类名
};

// 格式化位置信息

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
// 自定义事件发射器
// eslint-disable-next-line no-undef
const emit = defineEmits(['openAlertDetail']);

// 处理警报卡片点击事件
const handleAlertClick = (alert) => {
  emit('openAlertDetail', { name: 'AlertDetail', params: { id: alert.alertID } });
};
</script>

<style scoped>
.announcement-board {
  font-size: 12px;
  margin: 10px; /* 减少外部边距 */
}

.alert-card {
  transition: background-color 0.3s;
  padding: 8px; /* 减少内部边距 */
  margin-bottom: 8px; /* 减少卡片之间的间距 */
  border-radius: 4px; /* 可选：减小圆角半径 */
}

/* 移除 el-timeline-item 默认样式中的额外间距 */
.el-timeline-item__wrapper {
  padding-left: 0;
  padding-right: 0;
}

/* 确保链接没有额外的样式 */
.alert-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.unsolved,
.solved,
.error-alert {
  padding: 8px; /* 统一卡片内的边距 */
}

.unsolved {
  background-color: #ffcccc; /* 浅红色 */
}

.solved {
  background-color: #ccffcc; /* 浅绿色 */
}

.error-alert {
  background-color: #ffcc99; /* 浅橙色 */
}

/* 设置栅格系统的外边距和内边距 */
.el-row {
  margin: 0 -5px; /* 移除外边距 */
}

.el-col {
  padding: 5px; /* 添加内边距 */
}
</style>