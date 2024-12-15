<template>
  <div class="body">
    <div class="main">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <h3>社区养老小助手登录</h3>
          </div>
        </template>
        <el-form :model="form" label-width="120px" ref="formRef" class="form">
          <el-form-item label="服务中心名称" prop="serviceCenterName">
            <el-select v-model="form.serviceCenterName" placeholder="请选择服务中心名称" class="full-width" @change="updateLocation">
              <el-option
                  v-for="item in serviceCenters"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="位置" prop="location">
            <el-input v-model="form.location" placeholder="位置将自动显示" class="full-width" readonly></el-input>
          </el-form-item>
          <el-form-item label="管理员密钥" prop="adminKey">
            <el-input type="password" v-model="form.adminKey" placeholder="请输入管理员密钥" class="full-width"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" class="full-width">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import router from "@/router/router";

// 假设的服务中心选项数据，现在包含位置信息
const serviceCenters = [
  { value: 'center1', label: '中心一', location: '北京市海淀区' },
  { value: 'center2', label: '中心二', location: '上海市浦东新区' },
  // 更多的服务中心...
];

const formRef = ref(null);
const form = reactive({
  serviceCenterName: '',
  location: '',
  adminKey: ''
});

// 根据选择的服务中心名称自动更新位置
function updateLocation() {
  const selectedCenter = serviceCenters.find(center => center.value === form.serviceCenterName);
  if (selectedCenter) {
    form.location = selectedCenter.location;
  }
}

function submitForm() {
  if (!form.serviceCenterName || !form.adminKey) {
    ElMessage.error('请填写所有信息');
    return;
  }

  // 这里添加实际的登录逻辑
  console.log('提交表单:', form);
  ElMessage.success('登录成功');
  // 跳转到 IndexView 页面
  router.push({ name: 'home' });
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

.body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  background-color: #ecf0f3;
  color: #a0a5a8;
}

.main {
  position: relative;
  width: 100%;
  max-width: 600px; /* 设置最大宽度 */
  padding: 25px;
  background-color: #ffffff;
  box-shadow: 10px 10px 10px #9299a2;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
}

.box-card {
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  transition: all 0.3s ease-in-out;
}

.card-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #303133;
}

.form {
  margin-top: 1rem;
}

.full-width {
  width: 100%;
}

.el-form-item {
  margin-bottom: 24px; /* 调整这个值来改变间距大小 */
}

.el-form-item__content .el-input__inner,
.el-form-item__content .el-select {
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: border-color 0.3s;
}

.el-form-item__content .el-input__inner:focus,
.el-form-item__content .el-select:focus {
  border-color: #409eff;
}

.el-button--primary {
  border-radius: 8px;
  background-color: #409eff;
  border-color: #409eff;
  transition: background-color 0.3s, border-color 0.3s;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

@media (max-width: 1200px) {
  .main {
    transform: scale(0.9);
  }
}

@media (max-width: 1000px) {
  .main {
    transform: scale(0.8);
  }
}

@media (max-width: 800px) {
  .main {
    transform: scale(0.7);
  }
}

@media (max-width: 600px) {
  .main {
    transform: scale(0.6);
  }

  .box-card {
    width: 100%;
  }
}
</style>