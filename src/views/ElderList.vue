<script setup>
import ElderInfoManagement from '@/components/ElderInfoManagement.vue';
import { defineEmits } from 'vue';

// 定义自定义事件发射器
const emit = defineEmits(['openElderDetail']);
</script>

<template>
  <div>
    <elder-info-management @openElderDetail="(tabInfo) => emit('openElderDetail', tabInfo)"></elder-info-management>
  </div>
</template>

<style scoped>

</style>