<template>
  <el-card class="elder-info">
    <template #header>
      <span>老人信息</span>
    </template>
    <div v-if="elderInfo">
      <p><strong>老人姓名:</strong> {{ elderInfo.elderName }}</p>
      <p><strong>性别:</strong> {{ elderInfo.elderGender }}</p>
      <p><strong>年龄:</strong> {{ elderInfo.elderAge }}</p>
      <p><strong>住址:</strong> {{ elderInfo.elderAddress }}</p>
      <p><strong>电话:</strong> {{ elderInfo.elderPhoneNumber }}</p>
      <p><strong>紧急联系人姓名:</strong> {{ elderInfo.emergencyName }}</p>
      <p><strong>紧急联系人电话:</strong> {{ elderInfo.emergencyPhoneNumber }}</p>
      <p><strong>与紧急联系人关系:</strong> {{ elderInfo.relationship }}</p>
      <p><strong>饮食档案:</strong> {{ elderInfo.dietFiles || '无' }}</p>
      <p><strong>诈骗风险:</strong> {{ elderInfo.fraudRisk }}</p>
    </div>
    <div v-else>
      <p>暂无老人详细信息</p>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { defineProps } from 'vue';

const props = defineProps({
  elderID: {
    type: String,
    required: true
  }
});

const elderInfo = ref(null);

// Function to fetch elder information
async function fetchElderInfo(elderID) {
  try {
    console.log('Fetching elder info for elderID:', elderID); // Debugging line

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `
        SELECT
          *
        FROM
          elderinfo
        WHERE
          elderID = '${elderID}';
      `,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data); // Debugging line

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      elderInfo.value = response.data[0];
    } else {
      console.log('没有找到相关数据');
      elderInfo.value = null;
    }
  } catch (error) {
    console.error('There was an error fetching the elder info!', error);
    elderInfo.value = null; // Or set to a default state
  }
}

// Watch for changes in elderID and fetch data only when it's valid
watch(() => props.elderID, async (newElderID) => {
  if (newElderID && newElderID.trim() !== '') {
    await fetchElderInfo(newElderID);
  }
}, { immediate: true });
</script>

<style scoped>
.elder-info {
  font-size: 14px;
  margin: 20px;
}
</style>