<script>
import axios from "axios";
export default {
  name: 'ElderCardTopStats',
  data() {
    return {
      elderCount: null, // 存储老人总数
      alertCount:null,//警报数量
      currentDate: '',//当前时间
      total_workorders_today:null,//当日工单总数
      incomplete_workorders_today:null,//当日未完成工单总数
      loading: true, // 加载状态
    };
  },
  // computed: {
  //   currentDate() {
  //     const now = new Date();
  //     const year = now.getFullYear();
  //     const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //     const day = String(now.getDate()).padStart(2, '0');
  //
  //     return `${year}-${month}-${day}`;
  //   },
  //   },
  methods: {
    updateCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // 更新 localStorage 中的日期
      localStorage.setItem('currentDate', formattedDate);

      this.currentDate = formattedDate;
    },
    async fetchtotal_workorders_today() {
      try {
        const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
          sql: "SELECT COUNT(*) AS total_workorders_today\n" +
              "FROM `workorder`\n" +
              "WHERE DATE(`date`) = '"+this.currentDate+"';", // 查询老人总数的 SQL 语句
        });
        if (response.data && response.data.length > 0) {
          this.total_workorders_today = response.data[0].total_workorders_today; // 将返回的总数设置给 elderCount
        } else {
          console.log('没有找到相关数据');
          this.total_workorders_today = 0;
        }
      } catch (error) {
        console.error('获取老人总数失败', error);
        this.total_workorders_today = 0;
      } finally {
        this.loading = false; // 请求完成后停止加载状态
      }
    },
    async fetchincomplete_workorders_today() {
      try {
        const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
          sql: "SELECT COUNT(*) AS incomplete_workorders_today " +
              "FROM `workorder`WHERE DATE(`date`) = '"
              +this.currentDate+"' AND `status` != '已完成';", // 查询老人总数的 SQL 语句
        });
        if (response.data && response.data.length > 0) {
          this.incomplete_workorders_today = response.data[0].incomplete_workorders_today; // 将返回的总数设置给 elderCount
        } else {
          console.log('没有找到相关数据');
          this.incomplete_workorders_today = 0;
        }
      } catch (error) {
        console.error('获取老人总数失败', error);
        this.incomplete_workorders_today= 0;
      } finally {
        this.loading = false; // 请求完成后停止加载状态
      }
    },
    async fetchElderCount() {
      try {
        const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
          sql: "SELECT COUNT(*) AS elderCount FROM elderinfo", // 查询老人总数的 SQL 语句
        });
        if (response.data && response.data.length > 0) {
          this.elderCount = response.data[0].elderCount; // 将返回的总数设置给 elderCount
        } else {
          console.log('没有找到相关数据');
          this.elderCount = 0;
        }
      } catch (error) {
        console.error('获取老人总数失败', error);
        this.elderCount = 0;
      } finally {
        this.loading = false; // 请求完成后停止加载状态
      }
    },
    async fetchAlertCount() {
      try {
        const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
          sql: "SELECT COUNT(*) AS alertCount FROM alert WHERE status = '未解决'" , // 查询未处理警报总数的 SQL 语句
        });
        if (response.data && response.data.length > 0) {
          this.alertCount = response.data[0].alertCount; // 将返回的总数设置给 elderCount
        } else {
          console.log('没有找到相关数据');
          this.alertCount = 0;
        }
      } catch (error) {
        console.error('获取未解决警报总数失败', error);
        this.alertCount = 0;
      } finally {
        this.loading = false; // 请求完成后停止加载状态
      }
    }
  },
  mounted() {
    this.fetchElderCount(); // 在组件挂载时立即获取数据
    this.fetchAlertCount();
    this.fetchtotal_workorders_today();
    this.fetchincomplete_workorders_today();
    this.updateCurrentDate();
  }
};
</script>

<template>
  <div style="margin: 10px; width: 100%;">
      <el-row  :gutter="20" style="display: flex; justify-content:space-around;">
        <el-col :span="7" style="width: 100%;">
          <div class="statistic-card">
            <el-statistic :value="elderCount">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  总入住老人数量
                  <el-tooltip
                      effect="dark"
                      content="已经办理入住到社区内的老人数量统计"
                      placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12"></el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="7" style="width: 100%;">
          <div class="statistic-card">
            <el-statistic :value="alertCount" :value-style="{ color: 'red' }">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  未处理的警报数
                  <el-tooltip
                      effect="light"
                      content="通过监控与手环触发未处理的警报数量"
                      placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12"></el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="7" style="width: 100%;">
          <div class="statistic-card">
            <el-statistic :value="incomplete_workorders_today" :value-style="{ color: 'red' }">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  今日工单情况
                </div>
              </template>
              <template #suffix>/{{total_workorders_today}}</template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
  </div>
</template>

<style scoped>
.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  //border: 1px solid #66b1ff;
  /* 添加阴影效果 */
  box-shadow: 0 7px 10px rgba(84, 84, 87, 0.3);
  height: 100%;
  min-height: 150px; /* 确保卡片有最低高度 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中对齐 */
  text-align: center; /* 水平居中对齐 */
}
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}



</style>