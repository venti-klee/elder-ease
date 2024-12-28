<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="space-between" style="display: flex;">
      <!-- 左侧卡片区域 -->
      <el-col :span="12" style="display: flex; flex-direction: column; justify-content: space-between;">
        <!-- 编辑老人信息与展示 -->
        <el-form v-if="elder" :model="elder" label-width="100px">
          <el-form-item label="老人编号">
            <el-input v-model="elder.elderID" disabled></el-input>
          </el-form-item>
          <el-form-item label="老人姓名">
            <el-input v-model="elder.elderName"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="elder.elderGender">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="elder.elderAge"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="elder.elderAddress"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="elder.elderPhoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人">
            <el-input v-model="elder.emergencyName"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系电话">
            <el-input v-model="elder.emergencyPhoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="与老人的关系">
            <el-input v-model="elder.relationship"></el-input>
          </el-form-item>
          <el-form-item label="饮食档案">
            <el-input type="textarea" v-model="elder.dietFiles"></el-input>
          </el-form-item>
          <el-form-item label="欺诈风险">
            <el-select v-model="elder.fraudRisk">
              <el-option label="低" value="低"></el-option>
              <el-option label="中" value="中"></el-option>
              <el-option label="高" value="高"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="saveEdit">保存</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form>
        <p v-else>加载中...</p>
      </el-col>


      <el-col :span="12">
        <el-row>
          <!-- 手环信息显示区域 -->
            <el-card v-if="braceletData">
              <template #header>
                <span>手环信息</span>
              </template>
              <p>心率: {{ braceletData.heartRate }}</p>
              <p>血氧: {{ braceletData.bloodOxygen }}</p>
              <p>血压: {{ braceletData.bloodPressure }}</p>
              <p>位置: {{ displayLocation(braceletData.location) }}</p>
            </el-card>
            <div v-else>
              <p>加载中...</p>
            </div>
        </el-row>
        <el-card>
          <template #header>
            <span>位置信息</span>
          </template>
          <div id="map-container" v-if="braceletData" style="width: 100%; height: 100%;">
            <!-- 使用动态 key 来强制重新渲染 -->
            <tencent-map :key="braceletData.elderID" :location="braceletData.location"></tencent-map>
          </div>
          <div v-else>
            <p>加载中...</p>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.button-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}



.alert-detail{
  font-size: 14px;
  margin: 10px;
}
.elder-info-card {
  font-size: 14px;
  margin: 10px;
  height: 100%;
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 这个比例对应于 16:9 的宽高比 */
//height: 0;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TencentMap from "@/components/TencentMap.vue";

const route = useRoute();
const elder = ref(null);
const dataLoaded = ref(false); // 添加一个标志位来追踪数据是否加载完成
const elderLoaded = ref(false);
const braceletLoaded = ref(false);
const isMapVisible = ref(false); // 控制地图是否可见
const braceletData=ref(null);//手环数据
const originalElderData=ref(null);//保存原来的老人数据
const editForm = ref({});
// 加载老人信息
const fetchElderInfo = async (elderId) => {
  try {
    if (!elderId) {
      console.error('Missing or invalid elderid in route parameters');
      return;
    }

    console.log("Fetching elder info with ID:", elderId);

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `SELECT * FROM elderinfo WHERE elderID = '${elderId}'`
    });

    if (response.data.length > 0) {
      elder.value = response.data[0];
      originalElderData.value = { ...elder.value }; // 保存原始数据
      Object.assign(editForm.value, elder.value); // 初始化编辑表单数据
    }

    elderLoaded.value = true;
  } catch (error) {
    console.error('There was an error fetching the elder info!', error);
    elderLoaded.value = true; // 即使出错也要结束加载状态
  }
};

// 加载手环数据
const fetchBraceletData = async (elderId) => {
  try {
    if (!elderId) {
      console.error('Missing or invalid elderid in route parameters');
      return;
    }

    console.log("Fetching bracelet data with ID:", elderId);

    const response2 = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `SELECT * FROM braceletsdata WHERE elderID = '${elderId}'`
    });

    if (response2.data.length > 0) {
      braceletData.value = response2.data[0];
      isMapVisible.value = !!braceletData.value.location; // 根据手环数据中的位置信息决定是否显示地图
    }

    braceletLoaded.value = true;
  } catch (error) {
    console.error('There was an error fetching the bracelet data!', error);
    braceletLoaded.value = true; // 即使出错也要结束加载状态
  }
};

// 组合两个函数以确保顺序执行
const fetchData = async (elderId) => {
  await fetchElderInfo(elderId);
  await fetchBraceletData(elderId);
  dataLoaded.value = elderLoaded.value && braceletLoaded.value;
};
// Fetch the specific alert based on the ID in the route parameters
// onMounted(async () => {
//   await fetchData(route.params.elderid);
//   dataLoaded.value=true;
//
// });
// 确保watch只添加一次，并且使用immediate: true来立即执行
watch(() => route.params.elderid, async (newElderId) => {
  if (newElderId) {
    await fetchData(newElderId);
  }
}, { immediate: true });


// 显示位置信息

// 监听路由变化以更新elderId并重新获取数据
watch(() => route.params.elderid, async (newElderId) => {
  if (newElderId) {
    await fetchElderInfo(newElderId);
  }
}, { immediate: true });

// 监听 elder 的变化并在其变为非空时显示地图
watch(elder, (newValue) => {
  if (newValue && newValue.location && newValue.location.x && newValue.location.y) {
    setTimeout(() => {
      isMapVisible.value = true;
    }, 100); // 确保DOM更新后延迟显示地图
  } else {
    isMapVisible.value = false;
  }
}, { immediate: true }); // 立即执行一次监听器

// eslint-disable-next-line no-unused-vars
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
// 保存编辑的老人信息数据
const saveEdit = async () => {
  try {
    const updatedData = {
      ...elder.value
    };

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `UPDATE \`elderinfo\`
            SET elderName = '${updatedData.elderName}',
                elderGender = '${updatedData.elderGender}',
                elderAge = '${updatedData.elderAge}',
                elderAddress = '${updatedData.elderAddress}',
                elderPhoneNumber = '${updatedData.elderPhoneNumber}',
                emergencyName = '${updatedData.emergencyName}',
                emergencyPhoneNumber = '${updatedData.emergencyPhoneNumber}',
                relationship = '${updatedData.relationship}',
                dietFiles = '${updatedData.dietFiles}',
                fraudRisk = '${updatedData.fraudRisk}'
            WHERE elderID = '${updatedData.elderID}'`
    });

    if (response.data.affectedRows > 0) {
      fetchElderInfo(); // 成功后重新获取老人信息列表
    } else {
      console.error('老人信息更新失败');
    }
  } catch (error) {
    console.error('保存编辑的老人信息数据失败', error);
  }
};
// 取消编辑，恢复原始数据
const resetForm = () => {
  if (originalElderData.value) {
    Object.assign(elder.value, originalElderData.value); // 恢复原始数据到编辑表单
    elder.value = { ...originalElderData.value }; // 更新显示的数据
  }
};
</script>
