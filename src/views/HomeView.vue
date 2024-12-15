<script setup>
//import ElderCardTopStats from "@/components/ElderCardTopStats.vue";
import ElderCardTopStats from "@/components/ElderCardTopStats.vue";
import AnnouncementBoard from "@/components/AnnouncementBoard.vue";
</script>

<template>
  <el-scrollbar style="height: 700px;" >
    <div >
      <elder-card-top-stats></elder-card-top-stats>
    </div>
    <div>
      <el-row>
        <el-col :span="12">
          <announcement-board></announcement-board>
        </el-col>
      </el-row>
    </div>
<h1>home
</h1>

<br>
  <h1>
    2e2
  </h1></el-scrollbar>

</template>


<style scoped>
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
</style>