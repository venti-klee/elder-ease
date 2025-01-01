<template>
  <div>
    <!-- 筛选条件 -->
    <div style="margin-bottom: 0px;">
      <el-form :inline="true" @submit.prevent="applyFilters" class="align-left">
        <el-form-item label="工单号" class="wider-input">
          <el-input v-model="filters.workOrderID" placeholder="请输入工单号"></el-input>
        </el-form-item>
        <el-form-item label="订单号" class="wider-input">
          <el-input v-model="filters.orderID" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="服务类型" class="wider-input">
          <el-select v-model="filters.type" placeholder="请选择服务类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="助餐" value="助餐"></el-option>
            <el-option label="助浴" value="助浴"></el-option>
            <el-option label="健康检测" value="健康检测"></el-option>
            <el-option label="陪同就医" value="陪同就医"></el-option>
            <el-option label="房屋清理" value="房屋清理"></el-option>
            <el-option label="自定义服务" value="自定义服务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" class="wider-input">
          <el-date-picker v-model="filters.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" class="wider-input">
          <el-select v-model="filters.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未派遣" value="未派遣"></el-option>
            <el-option label="已派遣" value="已派遣"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护工工号" class="wider-input">
          <el-input v-model="filters.workerID" placeholder="请输入护工工号"></el-input>
        </el-form-item>
        <el-form-item label="护工姓名" class="wider-input">
          <el-input v-model="filters.workerName" placeholder="请输入护工姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button type="danger" @click="clearFilters">重置</el-button>
          <!--        <el-button type="success" @click="showAddWorkOrderDialog = true">新增工单</el-button>-->
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div style="max-height: 2000px; overflow-y: auto;">
      <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange" max-height="500">
        <el-table-column prop="workOrderID" label="工单号" width="160" sortable></el-table-column>
        <el-table-column prop="orderID" label="订单号" width="160" sortable></el-table-column>
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
            <el-button link type="primary" size="small" @click="showEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogVisibleDetail" title="工单详情">
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="工单号">
          <el-input v-model="currentRow.workOrderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="currentRow.orderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人姓名">
          <el-input v-model="currentRow.elderName" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-input v-model="currentRow.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="currentRow.remarks" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="currentRow.startTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="currentRow.endTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-input :value="formatDate(currentRow.date)" disabled></el-input>
        </el-form-item>
        <el-form-item label="护工工号">
          <el-input v-model="currentRow.workerID" disabled></el-input>
        </el-form-item>
        <el-form-item label="护工姓名">
          <el-input v-model="currentRow.workerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="currentRow.status" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisibleDetail = false">关闭</el-button>
    </span>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisibleEdit" title="编辑工单">
      <el-form :model="editForm" label-width="100px">
        <!-- 假设这里有一些表单项用于编辑 -->
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

  </div>
</template>

<script setup>
import {ref, computed, onMounted, defineEmits} from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const emit = defineEmits(['addTabWorkOrder']);
// 展示订单详情
const showWorkOrderDetails = (row) => {
  // OrderManagement.vue 或其他相关组件
  console.log('Emitting addTabWorkOrder event with:', { name: 'workorder-detail', params: { workOrderID: row.workOrderID} });
  emit('addTabWorkOrder', { name: 'workorder-detail', params: { workOrderID: row.workOrderID } });
};

// 表格数据
const tableData = ref([]);

// 筛选条件
const filters = ref({
  workOrderID: '',
  orderID: '',
  date: null,
  status: '',
  workerID: '',
  workerName: '',
  type: ''
});

// 当前生效的筛选条件
const activeFilters = computed(() => {
  const active = {};
  if (filters.value.workOrderID) active.workOrderID = filters.value.workOrderID;
  if (filters.value.orderID) active.orderID = filters.value.orderID;
  if (filters.value.date) active.date = formatDate(filters.value.date);
  if (filters.value.status) active.status = filters.value.status;
  if (filters.value.workerID) active.workerID = filters.value.workerID;
  if (filters.value.workerName) active.workerName = filters.value.workerName;
  if (filters.value.type) active.type = filters.value.type;
  return active;
});

// 排序相关变量
const sortField = ref(null);
const sortOrder = ref('ascending');

// 处理排序变化
const handleSortChange = ({ prop, order }) => {
  sortField.value = prop;
  sortOrder.value = order === 'ascending' ? 'ASC' : 'DESC';
  fetchWorkOrders(activeFilters.value);
};

// 详情对话框相关变量
const dialogVisibleDetail = ref(false);
const currentRow = ref({});

// 编辑对话框相关变量
const dialogVisibleEdit = ref(false);
const editForm = ref({});


// 格式化日期
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '');

const fetchWorkOrders = async (filterParams = {}) => {
  try {
    // 构建 SQL 查询语句
    let sql = `
      SELECT w.workOrderID, w.orderID, w.date, w.status, w.workerID, wi.workerName,
             o.elderID, o.type, o.remarks, o.startTime, o.endTime, ei.elderName
      FROM \`workorder\` w
             LEFT JOIN \`order\` o ON w.orderID = o.orderID
             LEFT JOIN \`elderinfo\` ei ON o.elderID = ei.elderID
             LEFT JOIN \`workerinfo\` wi ON w.workerID = wi.workerID
      WHERE 1=1
    `;

    // 动态构建 SQL 查询条件
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        switch (key) {
          case 'workOrderID':
            sql += ` AND w.workOrderID = '${value}'`;
            break;
          case 'orderID':
            sql += ` AND w.orderID = '${value}'`;
            break;
          case 'date':
            sql += ` AND w.date = '${value}'`;
            break;
          case 'status':
            sql += ` AND w.status = '${value}'`;
            break;
          case 'workerID':
            sql += ` AND w.workerID = '${value}'`;
            break;
          case 'workerName':
            sql += ` AND wi.workerName = '${value}'`;
            break;
          case 'type':
            sql += ` AND o.type = '${value}'`;
            break;
          default:
            // 如果有其他需要处理的字段，可以在这里添加默认处理逻辑
            break;
        }
      }
    });

    // 发送请求到后端，使用参数化查询
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql });

    if (response.data && Array.isArray(response.data)) {
      tableData.value = response.data.map((item) => ({
        workOrderID: item.workOrderID,
        orderID: item.orderID,
        date: item.date ? new Date(item.date) : null,
        status: item.status,
        workerID: item.workerID,
        workerName: item.workerName || '无名护工',
        elderID: item.elderID,
        elderName: item.elderName || '未知老人',
        type: item.type,
        startTime: item.startTime,
        endTime: item.endTime,
        remarks: item.remarks
      }));
    }
  } catch (error) {
    console.error('获取工作订单数据失败:', error.response ? error.response.data : error.message);
    ElMessage.error('获取工作订单数据失败，请稍后再试');
  }
};

// 删除行的方法
const deleteRow = async (row) => {
  try {
    if (!confirm(`确定要删除工单编号为 ${row.workOrderID} 的记录吗？`)) return;

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `DELETE FROM \`workorder\` WHERE workOrderID = '${row.workOrderID}'`
    });

    if (response.data.affectedRows > 0) {
      fetchWorkOrders();
    } else {
      console.error('工单删除失败');
    }
  } catch (error) {
    console.error('删除工单数据失败', error);
  }
};

// 展示详情
// const showDetails = (row) => {
//   currentRow.value = {...row};
//   dialogVisibleDetail.value = true;
// };

// 显示编辑对话框
const showEdit = (row) => {
  editForm.value = { ...row }; // 复制当前行的数据到编辑表单中
  dialogVisibleEdit.value = true;
};

// 保存编辑的工作订单数据
const saveEdit = async () => {
  try {
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
      fetchWorkOrders(); // 成功后重新获取工单列表
      dialogVisibleEdit.value = false; // 关闭对话框
    } else {
      console.error('工作订单更新失败');
    }
  } catch (error) {
    console.error('保存编辑的工作订单数据失败', error);
  }
};


// 应用筛选条件
const applyFilters = () => {
  fetchWorkOrders(activeFilters.value);
};

// 清除筛选条件
const clearFilters = () => {
  filters.value = {
    workOrderID: '',
    orderID: '',
    date: null,
    status: '',
    workerID: ''
  };
  fetchWorkOrders();
};

onMounted(() => fetchWorkOrders());
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

/* 定义更宽的输入框 */
.wider-input .el-select,
.wider-input .el-input {
  width: 200px; /* 设置你想要的宽度 */
}

/* 左对齐筛选表单 */
.align-left {
  text-align: left; /* 确保文本左对齐 */
  justify-content: flex-start; /* 使用 Flexbox 左对齐子元素 */
}

/* 移除 el-form-item 默认的 margin-right */
.align-left .el-form-item {
  margin-left: 10px !important;
  margin-right: 10px !important;
}

/* 如果需要进一步调整表单项之间的间距，可以通过下面的方式 */
.align-left .el-form-item:not(:last-child) {
  margin-right: 100px; /* 设置你希望的间距 */
}
</style>