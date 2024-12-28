<script setup>
import ElderInfoManagement from '@/components/ElderInfoManagement.vue';

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
const handleOpenElderDetail = (routeInfo) => {
  const { name, params } = routeInfo;
  const tabIndex = editableTabs.value.findIndex(tab => tab.index === name);

  if (tabIndex === -1) {
    editableTabs.value.push({
      title: `老人详情 - ${params.elderid}`, // 动态设置标题，包含老人ID
      index: `${name}-${params.elderid}`, // 确保每个老人详情标签页都有唯一的index
      closable: true,
    });
  }

  activeTabName.value = name;
  router.push({ name, params });
};
</script>

<template>
  <div>
    <elder-info-management @openElderDetail="handleOpenElderDetail" ></elder-info-management>
  </div>
</template>

<style scoped>

</style>