<script setup>
import ElderCardTopStats from "@/components/ElderCardTopStats.vue";
import AnnouncementBoard from "@/components/AnnouncementBoard.vue";
import WorkOderCardShow from "@/components/WorkOderCardShow.vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 假设这是从 IndexView 或其他地方传入的 editableTabs 和 activeTabName 的引用
// 如果不是这样，请确保在父组件中正确传递这些值或者使用 provide/inject 或 Vuex 等状态管理工具。
const editableTabs = ref([
  {
    title: "首页",
    index: "home",
    closable: false,
  },
]);
const activeTabName = ref("home");

// 监听来自 AnnouncementBoard 的自定义事件
const handleOpenAlertDetail = (routeInfo) => {
  const { name, params } = routeInfo;
  const tabIndex = editableTabs.value.findIndex(tab => tab.index === name);

  if (tabIndex === -1) {
    editableTabs.value.push({
      title: `警报详情-${params.id}`,
      index: name,
      closable: true,
    });
  }

  activeTabName.value = name;
  router.push({ name, params });
};
</script>

<template>
  <el-scrollbar style="height: 700px;">
    <div>
      <elder-card-top-stats></elder-card-top-stats>
    </div>
    <div>
      <el-row :gutter="20" style="display: flex; justify-content: space-around; height: 100%;">
        <el-col :span="16" class="content-col">
          <div class="card-height">
            <el-scrollbar style="height: 100%;">
              <announcement-board @openAlertDetail="handleOpenAlertDetail"></announcement-board>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="7" class="content-col">
          <div class="card-height">
            <work-oder-card-show></work-oder-card-show>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<style scoped>
/* 保持原有样式 */
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}

/* 确保两个卡片的高度一致 */
.content-col {
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保列的高度占满父容器 */
}

.card-height {
  flex-grow: 1;
  height: 100%; /* 确保卡片高度占满其容器 */
  display: flex;
  flex-direction: column;
}

/* 确保 el-scrollbar 占据可用空间 */
.el-scrollbar {
  flex-grow: 1;
  overflow: auto;
}
</style>