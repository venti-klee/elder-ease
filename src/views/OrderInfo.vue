<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="start" style="display: flex;">
      <!-- 左侧卡片区域 -->
      <el-col :span="8" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div v-if="orderDetails" class="order-details">
          <el-form label-width="120px" class="order-form">
            <el-form-item label="订单号" class="order-id-item">
              {{ orderDetails.orderID }}
            </el-form-item>
            <el-form-item label="老人编号">
              {{ orderDetails.elderID }}
            </el-form-item>
            <el-form-item label="老人姓名">
              {{ orderDetails.elderName }}
            </el-form-item>
            <el-form-item label="服务类型">
              {{ orderDetails.type }}
            </el-form-item>
            <el-form-item label="备注">
              {{ orderDetails.remarks || '无' }}
            </el-form-item>
            <el-form-item label="频率">
              {{ orderDetails.frequency || '无' }}
            </el-form-item>
            <el-form-item label="开始日期">
              {{ formatDate(orderDetails.startDate) }}
            </el-form-item>
            <el-form-item label="结束日期">
              {{ formatDate(orderDetails.endDate) }}
            </el-form-item>
            <el-form-item label="开始时间">
              {{ formatTime(orderDetails.startTime) }}
            </el-form-item>
            <el-form-item label="结束时间">
              {{ formatTime(orderDetails.endTime) }}
            </el-form-item>
            <el-form-item label="状态">
              {{ orderDetails.status }}
            </el-form-item>
          </el-form>
        </div>
        <p v-else>加载中...</p>
      </el-col>

      <!-- 右侧工单表格区域 -->
      <el-col :span="16">
        <h1 v-if="orderDetails">订单号 {{ orderDetails.orderID }} 的工单表</h1>
        <div class="work-orders-table">
          <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange" max-height="520">
            <el-table-column prop="workOrderID" label="工单号" width="160" sortable></el-table-column>
            <el-table-column prop="type" label="服务类型" width="160" sortable></el-table-column>
            <el-table-column prop="date" label="日期" width="160" sortable>
              <template #default="{ row }">
                <span>{{ formatDate(row.date) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="workerID" label="护工工号" width="160" sortable></el-table-column>
            <el-table-column prop="workerName" label="护工姓名" width="160" sortable></el-table-column>
            <el-table-column prop="status" label="状态" width="140" sortable>
              <template #default="scope">
                <el-tag :type="scope.row.status === '未派遣' ? 'danger' : 'success'" disable-transitions>
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="160">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="showWorkOrderDetails(row)">查看详情</el-button>
                <!--                <el-button link type="primary" size="small" @click="showEdit(row)">编辑</el-button>-->
                <el-button link type="danger" size="small" @click="deleteRow(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisibleEdit" title="编辑工单">
          <el-form :model="editForm" label-width="100px">
            <el-form-item label="工单号">
              <el-input v-model="editForm.workOrderID" disabled></el-input>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="editForm.orderID"></el-input>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker v-model="editForm.date" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="editForm.status">
                <el-option label="未派遣" value="未派遣"></el-option>
                <el-option label="已派遣" value="已派遣"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="护工工号">
              <el-input v-model="editForm.workerID"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisibleEdit = false">取消</el-button>
              <el-button type="primary" @click="saveEdit">保存</el-button>
            </span>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const orderDetails = ref(null);
const tableData = ref([]);

// 编辑对话框相关变量
const dialogVisibleEdit = ref(false);
const editForm = ref({});

// 展示订单详情
const emit = defineEmits(['addTabWorkOrder']);
const showWorkOrderDetails = (row) => {
  console.log('Emitting addTabWorkOrder event with:', { name: 'workorder-detail', params: { workOrderID: row.workOrderID} });
  emit('addTabWorkOrder', { name: 'workorder-detail', params: { workOrderID: row.workOrderID } });
};

// 模拟加载订单详情的方法
const fetchOrderDetails = async (orderID) => {
  try {
    const sql = `
      SELECT o.orderID,
             o.elderID,
             e.elderName,
             o.type,
             o.remarks,
             o.frequency,
             o.startDate,
             o.endDate,
             o.startTime,
             o.endTime,
             o.status
      FROM \`order\` o
             JOIN \`elderinfo\` e ON o.elderID = e.elderID
      WHERE o.orderID = '${orderID}'
    `;
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      let orderData = response.data[0];
      orderData.startDate = formatDate(orderData.startDate);
      orderData.endDate = formatDate(orderData.endDate);
      orderData.startTime = formatTime(orderData.startTime);
      orderData.endTime = formatTime(orderData.endTime);

      orderDetails.value = orderData;
    } else {
      console.warn('未找到对应订单详情');
    }
  } catch (error) {
    console.error('加载订单详情时出错:', error.response ? error.response.data : error.message);
  }
};

// 加载工单数据
const fetchWorkOrders = async () => {
  try {
    const sql = `
      SELECT w.workOrderID, w.orderID, w.date, w.status, w.workerID, wi.workerName,
             o.elderID, o.type, o.remarks, o.startTime, o.endTime, ei.elderName
      FROM \`workorder\` w
             LEFT JOIN \`order\` o ON w.orderID = o.orderID
             LEFT JOIN \`elderinfo\` ei ON o.elderID = ei.elderID
             LEFT JOIN \`workerinfo\` wi ON w.workerID = wi.workerID
      WHERE w.orderID = '${route.params.orderID}'
    `;
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql });
    tableData.value = response.data;
  } catch (error) {
    console.error('加载工单数据时出错:', error.response ? error.response.data : error.message);
  }
};

// 监听路由参数 orderID 的变化并执行相应逻辑
watch(
    () => route.params.orderID,
    async (newOrderID) => {
      if (newOrderID) {
        await fetchOrderDetails(newOrderID);
        await fetchWorkOrders();
      }
    },
    { immediate: true }
);

// 格式化日期
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '');

// 辅助函数：格式化时间为 HH:mm:ss 格式
function formatTime(time) {
  return time ? new Date(`1970-01-01T${time}`).toISOString().split('T')[1].slice(0, 8) : '无';
}

// 显示编辑对话框
// const showEdit = (row) => {
//   editForm.value = { ...row }; // 复制当前行的数据到编辑表单中
//   dialogVisibleEdit.value = true;
// };

const deleteRow = async (row) => {
  try {
    if (!confirm(`确定要删除工单编号为 ${row.workOrderID} 的记录吗？`)) return;

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `DELETE FROM \`workorder\` WHERE workOrderID = '${row.workOrderID}'`
    });

    if (response.data.affectedRows > 0) {
      await fetchWorkOrders();
    } else {
      console.error('工单删除失败');
    }
  } catch (error) {
    console.error('删除工单数据失败', error);
  }
};

// 保存编辑的工作订单数据
const saveEdit = async () => {
  try {
    console.log(editForm.value.date.toISOString().split('T')[0]);
    const updatedData = {
      ...editForm.value,
      date: editForm.value.date
          ? editForm.value.date.toISOString().split('T')[0]
          : null,
    };

    // 发送更新请求，使用参数化查询
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `UPDATE \`workorder\`
            SET orderID      = '${updatedData.orderID}',
                date   = '${updatedData.date}',
                status = '${updatedData.status}',
                workerID = '${updatedData.workerID}'
            WHERE workOrderID = '${updatedData.workOrderID}'`
    });

    if (response.data.affectedRows > 0) {
      await fetchWorkOrders(); // 成功后重新获取工单列表
      dialogVisibleEdit.value = false; // 关闭对话框
    } else {
      console.error('工作订单更新失败');
    }
  } catch (error) {
    console.error('保存编辑的工作订单数据失败', error);
  }
};
</script>

<style scoped>
/* 添加任何必要的样式 */
.container {
  padding: 20px;
}

.order-details {
  background-color: #f9fafc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.order-form .el-form-item {
  margin-bottom: 18px;
}

.order-form .el-form-item__label {
  font-weight: bold;
  width: 120px !important;
}

.order-form .el-form-item__content {
  flex: 1;
}

/* 特别处理订单号的间距 */
.order-id-item .el-form-item__label {
  width: 160px !important; /* 确保标签宽度足够大 */
}

.order-id-item .el-form-item__content {
  margin-left: 20px; /* 增加内容与标签之间的间距 */
}

.work-orders-table {
  margin-top: 0px;
}
</style>