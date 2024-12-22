<template>
  <div>
    <!-- 筛选表单 -->
    <div style="margin-bottom: 20px;">
      <el-form :inline="true" @submit.prevent="applyFilters" class="align-left">
        <el-form-item label="老人编号">
          <el-input v-model="filters.elderID" placeholder="请输入老人编号"></el-input>
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
        <el-form-item label="状态" class="wider-input">
          <el-select v-model="filters.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未完成" value="未完成"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="filters.startDate" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="filters.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker
              v-model="filters.startTime"
              placeholder="选择开始时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker
              v-model="filters.endTime"
              placeholder="选择结束时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <!-- 应用筛选和清除筛选按钮 -->
        <el-form-item>
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button type="danger" @click="clearFilters">清除筛选</el-button>
          <el-button type="success" @click="showAddOrderDialog = true">增加订单</el-button>
        </el-form-item>

      </el-form>
      <!-- 显示筛选条件 -->
      <div v-if="false" style="margin-top: 10px; margin-bottom: 10px;">
        当前筛选条件:
        <span v-for="(value, key) in activeFilters" :key="key">
          {{ formatFilterLabel(key) }}: {{ value }},
        </span>
      </div>
    </div>

    <!-- 增加订单对话框 -->
    <el-dialog v-model="showAddOrderDialog" title="增加订单">
      <el-form :model="addOrderForm" label-width="100px">
        <el-form-item label="老人编号">
          <el-input v-model="addOrderForm.elderID" placeholder="请输入老人编号"></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="addOrderForm.type" placeholder="请选择服务类型">
            <el-option label="助餐" value="助餐"></el-option>
            <el-option label="助浴" value="助浴"></el-option>
            <el-option label="健康检测" value="健康检测"></el-option>
            <el-option label="陪同就医" value="陪同就医"></el-option>
            <el-option label="房屋清理" value="房屋清理"></el-option>
            <el-option label="自定义服务" value="自定义服务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="addOrderForm.startDate" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="addOrderForm.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker
              v-model="addOrderForm.startTime"
              placeholder="选择开始时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker
              v-model="addOrderForm.endTime"
              placeholder="选择结束时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addOrderForm.status" placeholder="请选择状态">
            <el-option label="未完成" value="未完成"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddOrderDialog = false">取消</el-button>
        <el-button type="primary" @click="addOrder">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange">
      <el-table-column prop="orderID" label="订单编号" width="180" sortable></el-table-column>
      <el-table-column prop="elderID" label="老人编号" width="180" sortable></el-table-column>
      <el-table-column prop="type" label="服务类型" width="180" sortable>
        <template #default="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="180" sortable>
        <template #default="{ row }">
          <span>{{ formatDate(row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="结束日期" width="180" sortable>
        <template #default="{ row }">
          <span>{{ formatDate(row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180" sortable>
        <template #default="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="showDetails(row)">查看详情</el-button>
          <el-button link type="primary" size="small" @click="showEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看详情对话框 -->
    <el-dialog v-if="dialogVisibleDetail" v-model="dialogVisibleDetail" title="订单详情">
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="currentRow.orderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人编号">
          <el-input v-model="currentRow.elderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-input v-model="currentRow.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="currentRow.remarks" disabled></el-input>
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="currentRow.frequency" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-input :value="formatDate(currentRow.startDate)" disabled></el-input>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-input :value="formatDate(currentRow.endDate)" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="currentRow.startTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="currentRow.endTime" disabled></el-input>
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
    <el-dialog v-if="dialogVisibleEdit" v-model="dialogVisibleEdit" title="编辑订单">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="editForm.orderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人编号">
          <el-input v-model="editForm.elderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="editForm.type" placeholder="请选择服务类型">
            <el-option label="助餐" value="助餐"></el-option>
            <el-option label="助浴" value="助浴"></el-option>
            <el-option label="健康检测" value="健康检测"></el-option>
            <el-option label="陪同就医" value="陪同就医"></el-option>
            <el-option label="房屋清理" value="房屋清理"></el-option>
            <el-option label="自定义服务" value="自定义服务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="editForm.frequency"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="editForm.startDate" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="editForm.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker
              v-model="editForm.startTime"
              placeholder="选择开始时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker
              v-model="editForm.endTime"
              placeholder="选择结束时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="未完成" value="未完成"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// 表格数据
const tableData = ref([]);

// 筛选条件
const filters = ref({
  elderID: '',
  type: '',
  status: '',
  startDate: null,
  endDate: null,
  startTime: '',
  endTime: '',
});

// 当前生效的筛选条件
const activeFilters = computed(() => {
  const active = {};
  if (filters.value.elderID) active.elderID = filters.value.elderID;
  if (filters.value.type) active.type = filters.value.type;
  if (filters.value.status) active.status = filters.value.status;
  if (filters.value.startDate) active.startDate = formatDate(filters.value.startDate);
  if (filters.value.endDate) active.endDate = formatDate(filters.value.endDate);
  if (filters.value.startTime) active.startTime = filters.value.startTime;
  if (filters.value.endTime) active.endTime = filters.value.endTime;
  return active;
});

// 详情对话框相关变量
const dialogVisibleDetail = ref(false);
const currentRow = ref({});

// 编辑对话框相关变量
const dialogVisibleEdit = ref(false);
const editForm = ref({});

// 排序相关变量
const sortField = ref(null);
const sortOrder = ref('ascending');

// 格式化日期
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '');

// 删除行的方法
const deleteRow = async (row) => {
  try {
    if (!confirm(`确定要删除订单编号为 ${row.orderID} 的记录吗？`)) return;

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `DELETE FROM \`order\` WHERE orderID = '${row.orderID}'`
    });

    if (response.data.affectedRows > 0) {
      fetchOrders();
    } else {
      console.error('订单删除失败');
    }
  } catch (error) {
    console.error('删除订单数据失败', error);
  }
};

// 获取订单数据
const fetchOrders = async (filterParams = {}) => {
  try {
    let sql = 'SELECT * FROM `order` WHERE 1=1';
    if (filterParams.elderID) sql += ` AND elderID = '${filterParams.elderID}'`;
    if (filterParams.type) sql += ` AND type = '${filterParams.type}'`;
    if (filterParams.status) sql += ` AND status = '${filterParams.status}'`;
    if (filterParams.startDate)
      sql += ` AND startDate >= '${new Date(filterParams.startDate).toISOString().split('T')[0]}'`;
    if (filterParams.endDate)
      sql += ` AND endDate <= '${new Date(filterParams.endDate).toISOString().split('T')[0]}'`;
    if (filterParams.startTime) sql += ` AND startTime >= '${filterParams.startTime}'`;
    if (filterParams.endTime) sql += ` AND endTime <= '${filterParams.endTime}'`;

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql });
    if (response.data && Array.isArray(response.data)) {
      tableData.value = response.data.map((item) => ({
        orderID: item.orderID,
        elderID: item.elderID,
        type: item.type,
        remarks: item.remarks,
        frequency: item.frequency,
        startTime: item.startTime,
        endTime: item.endTime,
        startDate: item.startDate ? new Date(item.startDate) : null,
        endDate: item.endDate ? new Date(item.endDate) : null,
        status: item.status,
      }));
    }
  } catch (error) {
    console.error('获取订单数据失败', error);
  }
};

// 处理排序变化
const handleSortChange = ({ prop, order }) => {
  sortField.value = prop;
  sortOrder.value = order === 'ascending' ? 'ascending' : 'descending';
  fetchOrders(filters.value);
};

// 展示详情
const showDetails = (row) => {
  currentRow.value = { ...row };
  dialogVisibleDetail.value = true;
};

// 编辑功能
const showEdit = (row) => {
  editForm.value = { ...row };
  dialogVisibleEdit.value = true;
};

// 保存编辑数据
const saveEdit = async () => {
  if (new Date(editForm.value.startDate) > new Date(editForm.value.endDate)) {
    alert('开始日期不能大于结束日期');
    return;
  }
  if (editForm.value.startTime > editForm.value.endTime) {
    alert('开始时间不能大于结束时间');
    return;
  }

  try {
    const updatedData = {
      ...editForm.value,
      startDate: editForm.value.startDate
          ? editForm.value.startDate.toISOString().split('T')[0]
          : null,
      endDate: editForm.value.endDate
          ? editForm.value.endDate.toISOString().split('T')[0]
          : null,
    };

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `UPDATE \`order\`
            SET type      = '${updatedData.type}',
                remarks   = '${updatedData.remarks}',
                frequency = '${updatedData.frequency}',
                startDate = '${updatedData.startDate}',
                endDate   = '${updatedData.endDate}',
                startTime = '${updatedData.startTime}',
                endTime   = '${updatedData.endTime}',
                status    = '${updatedData.status}'
            WHERE orderID = '${updatedData.orderID}'`,
    });

    if (response.data.affectedRows > 0) {
      fetchOrders();
      dialogVisibleEdit.value = false;
    } else {
      console.error('订单更新失败');
    }
  } catch (error) {
    console.error('保存编辑数据失败', error);
  }
};

// 格式化筛选标签
const formatFilterLabel = (key) => {
  switch (key) {
    case 'elderID': return '老人编号';
    case 'type': return '服务类型';
    case 'status': return '状态';
    case 'startDate': return '开始日期';
    case 'endDate': return '结束日期';
    case 'startTime': return '开始时间';
    case 'endTime': return '结束时间';
    default: return key;
  }
};

// 清除筛选条件
const clearFilters = () => {
  filters.value = {
    elderID: '',
    type: '',
    status: '',
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
  };
  fetchOrders();
};

// 应用筛选条件
const applyFilters = () => {
  fetchOrders(filters.value);
};

// 增加订单对话框状态
const showAddOrderDialog = ref(false);
// 增加订单表单数据
const addOrderForm = ref({
  elderID: '',
  type: '',
  startDate: null,
  endDate: null,
  startTime: '',
  endTime: '',
  status: '',
});

// 增加订单方法
const addOrder = async () => {
  if (!addOrderForm.value.elderID || !addOrderForm.value.type) {
    alert('请填写完整信息');
    return;
  }

  try {
    const newOrder = {
      ...addOrderForm.value,
      startDate: addOrderForm.value.startDate
          ? addOrderForm.value.startDate.toISOString().split('T')[0]
          : null,
      endDate: addOrderForm.value.endDate
          ? addOrderForm.value.endDate.toISOString().split('T')[0]
          : null,
    };

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `INSERT INTO \`order\` (elderID, type, startDate, endDate, startTime, endTime, status)
            VALUES ('${newOrder.elderID}', '${newOrder.type}', '${newOrder.startDate}', '${newOrder.endDate}',
            '${newOrder.startTime}', '${newOrder.endTime}', '${newOrder.status}')`,
    });

    if (response.data.affectedRows > 0) {
      fetchOrders();
      showAddOrderDialog.value = false;
    } else {
      console.error('订单添加失败');
    }
  } catch (error) {
    console.error('添加订单失败', error);
  }
};

onMounted(() => fetchOrders());
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

/* 定义更宽的输入框 */
.wider-input .el-select,
.wider-input .el-input {
  width: 250px; /* 设置你想要的宽度 */
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