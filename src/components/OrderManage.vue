<template>
  <div>
    <!-- 筛选表单 -->
    <div style="margin-bottom: 0px;">
      <el-form :inline="true" @submit.prevent="applyFilters" class="align-left">
        <el-form-item label="订单号" class="wider-input">
          <el-input v-model="filters.orderID" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="老人编号" class="wider-input">
          <el-input v-model="filters.elderID" placeholder="请输入老人编号"></el-input>
        </el-form-item>
        <el-form-item label="老人姓名" class="wider-input">
          <el-input v-model="filters.elderName" placeholder="请输入老人名字"></el-input>
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
        <el-form-item label="结束日期" >
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
          <el-button type="danger" @click="clearFilters">重置</el-button>
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
        <el-form-item label="订单号">
          <el-input v-model="addOrderForm.orderID" disabled></el-input>
        </el-form-item>
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
        <el-form-item label="备注">
          <el-input v-model="addOrderForm.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="addOrderForm.frequency" placeholder="请输入频率"></el-input>
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
          <el-input v-model="addOrderForm.status" disabled>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddOrderDialog = false">取消</el-button>
        <el-button type="primary" @click="addOrder">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 表格 -->
    <div style="max-height: 2000px; overflow-y: auto;">
      <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange" max-height="460">
        <el-table-column prop="orderID" label="订单号" width="160" sortable></el-table-column>
        <el-table-column prop="elderID" label="老人编号" width="160" sortable></el-table-column>
        <el-table-column prop="elderName" label="老人姓名" width="160" sortable></el-table-column>
        <el-table-column prop="type" label="服务类型" width="160" sortable>
          <template #default="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="160" sortable>
          <template #default="{ row }">
            <span>{{ formatDate(row.startDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="结束日期" width="160" sortable>
          <template #default="{ row }">
            <span>{{ formatDate(row.endDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="140"
            :filters="[{ text: '未完成', value: '未完成' },{ text: '已完成', value: '已完成' },]"
            :filter-method="filterStatus"
            filter-placement="bottom-end"
            sortable>
          <template #default="scope">
            <el-tag :type="scope.row.status === '未完成' ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="160">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetails(row)">查看详情</el-button>
            <el-button link type="primary" size="small" @click="showEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 查看详情对话框 -->
    <el-dialog v-if="dialogVisibleDetail" v-model="dialogVisibleDetail" title="订单详情">
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="currentRow.orderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人编号">
          <el-input v-model="currentRow.elderID" disabled></el-input>
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
import { ElMessage } from 'element-plus';

// 表格数据
const tableData = ref([]);

// 筛选条件
const filters = ref({
  elderID: '',
  elderName: '',
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
  if (filters.value.elderName) active.elderName = filters.value.elderName;
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
    // 提示用户确认删除
    if (!confirm(`确定要删除订单编号为 ${row.orderID} 的记录及其相关工作订单吗？`)) return;

    // 第一步：删除 workorder 表中对应的记录
    const deleteWorkOrderSql = `DELETE FROM \`workorder\` WHERE orderID = '${row.orderID}'`;

    console.log('Constructed SQL for workorder:', deleteWorkOrderSql);

    await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql: deleteWorkOrderSql });

    // 第二步：删除 order 表中的记录
    const deleteOrderSql = `DELETE FROM \`order\` WHERE orderID = '${row.orderID}'`;

    console.log('Constructed SQL for order:', deleteOrderSql);

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql: deleteOrderSql });

    // 处理更新后的响应
    if (response.data && response.data.affectedRows > 0) {
      ElMessage({
        message: '订单删除成功',
        type: 'success'
      });
      fetchOrders(); // 成功删除后重新获取数据
    } else {
      ElMessage.error('订单删除失败');
    }
  } catch (error) {
    console.error('删除订单数据失败:', error.response ? error.response.data : error.message);
    ElMessage.error('删除订单时发生错误，请稍后再试或联系管理员');
  }
};

const fetchOrders = async (filterParams = {}) => {
  try {
    let sql = `
      SELECT o.orderID,
             o.elderID,
             o.type,
             o.remarks,
             o.frequency,
             o.startTime,
             o.endTime,
             o.startDate,
             o.endDate,
             o.status,
             e.elderName
      FROM \`order\` o
             JOIN \`elderinfo\` e ON o.elderID = e.elderID
      WHERE 1 = 1
    `;

    // 动态构建 SQL 查询条件
    if (filterParams.elderID) sql += ` AND o.elderID = '${filterParams.elderID}'`;
    if (filterParams.elderName) sql += ` AND e.elderName LIKE '%${filterParams.elderName}%'`;
    if (filterParams.type) sql += ` AND o.type = '${filterParams.type}'`;
    if (filterParams.status) sql += ` AND o.status = '${filterParams.status}'`;
    if (filterParams.startDate)
      sql += ` AND o.startDate > '${new Date(filterParams.startDate).toISOString().split('T')[0]}'`;
    if (filterParams.endDate)
      sql += ` AND o.endDate < '${new Date(filterParams.endDate).toISOString().split('T')[0]}'`;
    if (filterParams.startTime) sql += ` AND o.startTime >= '${filterParams.startTime}'`;
    if (filterParams.endTime) sql += ` AND o.endTime <= '${filterParams.endTime}'`;

    // 发送请求到后端
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {sql});

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
        elderName: item.elderName,
      }));
    }
  } catch (error) {
    console.error('获取订单数据失败:', error.response ? error.response.data : error.message);
  }
};

// 处理排序变化
const handleSortChange = ({prop, order}) => {
  sortField.value = prop;
  sortOrder.value = order === 'ascending' ? 'ascending' : 'descending';
  fetchOrders(filters.value);
};

// 展示详情
const showDetails = (row) => {
  currentRow.value = {...row};
  dialogVisibleDetail.value = true;
};

// 编辑功能
const showEdit = (row) => {
  editForm.value = {...row};
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
    case 'elderID':
      return '老人编号';
    case 'elderName':
      return '老人姓名'
    case 'type':
      return '服务类型';
    case 'status':
      return '状态';
    case 'startDate':
      return '开始日期';
    case 'endDate':
      return '结束日期';
    case 'startTime':
      return '开始时间';
    case 'endTime':
      return '结束时间';
    default:
      return key;
  }
};

// 清除筛选条件
const clearFilters = () => {
  filters.value = {
    elderID: '',
    elderName: '',
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
  orderID: '',
  elderID: '',
  type: '',
  remarks: '',
  frequency: '',
  startDate: null,
  endDate: null,
  startTime: '',
  endTime: '',
  status: '未完成',
});
// 订单编号自动生成
const generateOrderID = async () => {
  try {
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: 'SELECT MAX(orderID) AS maxID FROM `order`',
    });
    const maxID = response.data[0]?.maxID || 'order000';
    const numericPart = maxID.slice(5); // 提取数字部分
    const newID = `order${String(parseInt(numericPart, 10) + 1).padStart(3, '0')}`;
    addOrderForm.value.orderID = newID;
  } catch (error) {
    console.error('订单编号生成失败', error);
  }
};
// 增加订单方法
const addOrder = async () => {
  if (!addOrderForm.value.elderID || !addOrderForm.value.type) {
    alert('请填写完整信息');
    return;
  }

  try {
    // 在添加订单之前生成新的订单编号
    await generateOrderID();

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
      sql: `INSERT INTO \`order\` (orderID, elderID, type, remarks, frequency, startDate, endDate, startTime, endTime, status)
            VALUES ('${newOrder.orderID}', '${newOrder.elderID}', '${newOrder.type}', '${newOrder.remarks}', '${newOrder.frequency}',
            '${newOrder.startDate}', '${newOrder.endDate}', '${newOrder.startTime}', '${newOrder.endTime}', '${newOrder.status}')`,
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
  width: 150px; /* 设置你想要的宽度 */
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