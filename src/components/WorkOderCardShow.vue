<script>
import axios from "axios";

export default {
  name: 'WorkOrderCardShow',
  data() {
    return {
      workOrderStats: {
        '健康检测': { incomplete: null, total: null },
        '助浴': { incomplete: null, total: null },
        '送餐': { incomplete: null, total: null },
        '房屋清洁': { incomplete: null, total: null },
        '陪同就医': { incomplete: null, total: null },
        '自定义服务': { incomplete: null, total: null }
      },
      currentDate: null,
      loading: true // 加载状态
    };
  },
  created() {
    // 在组件创建时尝试从 localStorage 获取日期或设置为当前日期
    this.currentDate = localStorage.getItem('currentDate') || new Date().toISOString().slice(0, 10);
  },
  methods: {
    async fetchWorkOrderStats() {
      try {
        for (let type in this.workOrderStats) {
          const [incompleteResponse, totalResponse] = await Promise.all([
            axios.post('http://122.51.230.168:3000/api/execute-soft', {
              sql: `SELECT COUNT(*) AS count
                    FROM workorder wo
                    JOIN \`order\` o ON wo.orderID = o.orderID
                    WHERE DATE(wo.date) = '${this.currentDate}'
                      AND wo.status IN ('未完成', '未派遣')
                      AND o.type = '${type}';`
            }),
            axios.post('http://122.51.230.168:3000/api/execute-soft', {
              sql: `SELECT COUNT(*) AS count
                    FROM workorder wo
                    JOIN \`order\` o ON wo.orderID = o.orderID
                    WHERE DATE(wo.date) = '${this.currentDate}'
                      AND o.type = '${type}';`
            })
          ]);

          this.workOrderStats[type].incomplete = incompleteResponse.data.length > 0 ? incompleteResponse.data[0].count : 0;
          this.workOrderStats[type].total = totalResponse.data.length > 0 ? totalResponse.data[0].count : 0;
        }
      } catch (error) {
        console.error('获取数据失败', error);
        Object.keys(this.workOrderStats).forEach(type => {
          this.workOrderStats[type].incomplete = 0;
          this.workOrderStats[type].total = 0;
        });
      } finally {
        this.loading = false; // 请求完成后停止加载状态
      }
    }
  },
  mounted() {
    this.fetchWorkOrderStats(); // 在组件挂载时立即获取数据
  }
};
</script>

<template>
  <div v-if="!loading">
    <div class="statistic-card" v-for="(stats, type) in workOrderStats" :key="type">
      <el-statistic :value="stats.incomplete" :value-style="{ color: 'red' }">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            {{ type }} 当日工单情况
          </div>
        </template>
        <template #suffix>/{{ stats.total }}</template>
      </el-statistic>
    </div>
  </div>
  <div v-else>
    <p>加载中...</p>
  </div>
</template>

<style scoped>
.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 7px 10px rgba(84, 84, 87, 0.3);
  height: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
}
</style>