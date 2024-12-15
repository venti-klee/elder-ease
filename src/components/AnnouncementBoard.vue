<template>
  <el-card class="announcement-board">
    <template #header>
      <span>公告栏</span>
    </template>
    <el-timeline>
      <el-timeline-item
          v-for="item in items"
          :key="item.id"
          :timestamp="item.date"
          placement="top"
      >
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
const items = ref([
  { id: 1, date: '2024-05-15', title: '公告标题 1', content: '这里是公告内容 1...' },
  { id: 2, date: '2024-05-14', title: '公告标题 2', content: '这里是公告内容 2...' },
  // 更多公告...
])
</script>
<style>
.announcement-board {
  margin: 30px;
}
</style>