<template>
  <div>
    <!-- 筛选条件 -->
    <div style="margin-bottom: 0px;">
      <el-form :inline="true" @submit.prevent="applyFilters" class="align-left">
        <el-form-item label="老人编号" class="wider-input">
          <el-input v-model="filters.elderID" placeholder="请输入老人编号"></el-input>
        </el-form-item>
        <el-form-item label="老人姓名" class="wider-input">
          <el-input v-model="filters.elderName" placeholder="请输入老人姓名"></el-input>
        </el-form-item>
        <el-form-item label="老人年龄" class="wider-input">
          <el-input v-model="filters.elderAge" placeholder="请输入老人年龄"></el-input>
        </el-form-item>
        <el-form-item label="老人地址" class="wider-input">
          <el-input v-model="filters.elderAddress" placeholder="请输入老人地址"></el-input>
        </el-form-item>
        <el-form-item label="老人联系方式" class="wider-input">
          <el-input v-model="filters.elderPhoneNumber" placeholder="请输入老人联系方式"></el-input>
        </el-form-item>
        <el-form-item label="性别" class="wider-input">
          <el-select v-model="filters.elderGender" placeholder="请选择性别">
            <el-option label="全部" value=""></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诈骗风险" class="wider-input">
          <el-select v-model="filters.fraudRisk" placeholder="请选择风险等级">
            <el-option label="全部" value=""></el-option>
            <el-option label="低" value="低"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="高" value="高"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button type="danger" @click="clearFilters">重置</el-button>
          <el-button type="success" @click="showAddDialog">新增老人信息</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div style="max-height: 2000px; overflow-y: auto;">
      <el-table :data="tableData" style="width: 100%" max-height="500">
        <el-table-column prop="elderID" label="老人编号" width="150" sortable></el-table-column>
        <el-table-column prop="elderName" label="老人姓名" width="150" sortable></el-table-column>
        <el-table-column prop="elderGender" label="性别" width="130" sortable></el-table-column>
        <el-table-column prop="elderAge" label="年龄" width="130" sortable></el-table-column>
        <el-table-column prop="elderAddress" label="地址" width="160" sortable></el-table-column>
        <el-table-column prop="elderPhoneNumber" label="联系电话" width="160" sortable></el-table-column>
        <el-table-column prop="fraudRisk" label="诈骗风险" width="150" sortable>
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.fraudRisk)" disable-transitions>
              {{ scope.row.fraudRisk }}
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

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogVisibleDetail" title="老人信息详情">
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="老人编号">
          <el-input v-model="currentRow.elderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人姓名">
          <el-input v-model="currentRow.elderName" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="currentRow.elderGender" disabled></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="currentRow.elderAge" disabled></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="currentRow.elderAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="currentRow.elderPhoneNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人">
          <el-input v-model="currentRow.emergencyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系电话">
          <el-input v-model="currentRow.emergencyPhoneNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="与老人的关系">
          <el-input v-model="currentRow.relationship" disabled></el-input>
        </el-form-item>
        <el-form-item label="饮食档案">
          <el-input type="textarea" v-model="currentRow.dietFiles" disabled></el-input>
        </el-form-item>
        <el-form-item label="诈骗风险">
          <el-input v-model="currentRow.fraudRisk" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleDetail = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisibleEdit" title="编辑老人信息">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="老人编号">
          <el-input v-model="editForm.elderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人姓名">
          <el-input v-model="editForm.elderName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.elderGender">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editForm.elderAge"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.elderAddress"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.elderPhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人">
          <el-input v-model="editForm.emergencyName"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系电话">
          <el-input v-model="editForm.emergencyPhoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="与老人的关系">
          <el-input v-model="editForm.relationship"></el-input>
        </el-form-item>
        <el-form-item label="饮食档案">
          <el-input type="textarea" v-model="editForm.dietFiles"></el-input>
        </el-form-item>
        <el-form-item label="欺诈风险">
          <el-select v-model="editForm.fraudRisk">
            <el-option label="低" value="低"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="高" value="高"></el-option>
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

    <!-- 新增对话框 -->
    <el-dialog v-model="dialogVisibleAdd" title="新增老人信息">
      <el-form :model="addForm" label-width="130px" :rules="rules" ref="addFormRef">
        <el-form-item label="老人编号" prop="elderID">
          <el-input v-model="addForm.elderID" disabled></el-input>
        </el-form-item>
        <el-form-item label="老人姓名" prop="elderName" >
          <el-input v-model="addForm.elderName" placeholder="请输入老人姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="elderGender">
          <el-select v-model="addForm.elderGender" placeholder="请选择老人性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="elderAge" >
          <el-input v-model.number="addForm.elderAge" placeholder="请输入老人年龄"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="elderAddress">
          <el-input v-model="addForm.elderAddress" placeholder="请输入老人地址"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="elderPhoneNumber">
          <el-input v-model="addForm.elderPhoneNumber" placeholder="请输入老人联系电话"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyName">
          <el-input v-model="addForm.emergencyName" placeholder="请输入紧急联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系电话" prop="emergencyPhoneNumber">
          <el-input v-model="addForm.emergencyPhoneNumber" placeholder="请输入紧急联系人联系电话"></el-input>
        </el-form-item>
        <el-form-item label="与老人的关系" prop="relationship">
          <el-input v-model="addForm.relationship" placeholder="请输入紧急联系人与老人的关系"></el-input>
        </el-form-item>
        <el-form-item label="饮食档案" prop="dietFiles">
          <el-input type="textarea" v-model="addForm.dietFiles" placeholder="请输入老人的饮食档案"></el-input>
        </el-form-item>
        <el-form-item label="欺诈风险" prop="fraudRisk">
          <el-select v-model="addForm.fraudRisk" placeholder="请输入欺诈风险等级">
            <el-option label="低" value="低"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="高" value="高"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleAdd = false">取消</el-button>
          <el-button type="primary" @click="submitAdd">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { defineEmits } from 'vue';

// 定义自定义事件发射器
// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['openElderDetail']);

// 表格数据
const tableData = ref([]);

// 筛选条件
const filters = ref({
  elderID: '',
  elderName: '',
  elderAge: '',
  elderAddress: '',
  elderPhoneNumber: '',
  elderGender: '',
  fraudRisk: ''
});

// 当前生效的筛选条件
const activeFilters = computed(() => {
  const active = {};
  if (filters.value.elderID) active.elderID = filters.value.elderID;
  if (filters.value.elderName) active.elderName = filters.value.elderName;
  if (filters.value.elderGender) active.elderGender = filters.value.elderGender;
  if (filters.value.fraudRisk) active.fraudRisk = filters.value.fraudRisk;
  if (filters.value.elderAge) active.elderAge = filters.value.elderAge;
  if (filters.value.elderAddress) active.elderAddress = filters.value.elderAddress;
  if (filters.value.elderPhoneNumber) active.elderPhoneNumber = filters.value.elderPhoneNumber;
  return active;
});

// 详情对话框相关变量
const dialogVisibleDetail = ref(false);
const currentRow = ref({});

// 编辑对话框相关变量
const dialogVisibleEdit = ref(false);
const editForm = ref({});

// 获取老人信息
const fetchElderInfo = async (filterParams = {}) => {
  try {
    let sql = `
      SELECT * FROM \`elderinfo\`
      WHERE 1=1
    `;

    // 动态构建 SQL 查询条件
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        sql += ` AND \`${key}\` = '${value}'`;
      }
    });

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', { sql });

    if (response.data && Array.isArray(response.data)) {
      tableData.value = response.data.map(item => ({
        ...item,
        dietFiles: item.dietFiles || ''
      }));
    }
  } catch (error) {
    console.error('获取老人信息失败:', error.response ? error.response.data : error.message);
    ElMessage.error('获取老人信息失败，请稍后再试');
  }
};

// 删除行的方法
const deleteRow = async (row) => {
  try {
    if (!confirm(`确定要删除老人ID为 ${row.elderID} 的记录吗？`)) return;

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `DELETE FROM \`elderinfo\` WHERE elderID = '${row.elderID}'`
    });

    if (response.data.affectedRows > 0) {
      fetchElderInfo();
    } else {
      console.error('老人信息删除失败');
    }
  } catch (error) {
    console.error('删除老人信息失败', error);
  }
};

// 展示详情
const showDetails = (row) => {
  // ElderInfoManagement.vue
    console.log('Emitting openElderDetail event with:', { name: 'elderDetail', params: { elderid: row.elderID } });
    emit('openElderDetail', { name: 'elderDetail', params: { elderid: row.elderID } });
};

// 显示编辑对话框
const showEdit = (row) => {
  editForm.value = { ...row }; // 复制当前行的数据到编辑表单中
  dialogVisibleEdit.value = true;
};

// 保存编辑的老人信息数据
const saveEdit = async () => {
  try {
    const updatedData = {
      ...editForm.value
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
      dialogVisibleEdit.value = false; // 关闭对话框
    } else {
      console.error('老人信息更新失败');
    }
  } catch (error) {
    console.error('保存编辑的老人信息数据失败', error);
  }
};

// 根据欺诈风险等级返回标签的颜色类型
const getTagType = (riskLevel) => {
  switch (riskLevel) {
    case '低':
      return 'success';
    case '中':
      return 'warning';
    case '高':
      return 'danger';
    default:
      return '';
  }
};

// 应用筛选条件
const applyFilters = () => {
  fetchElderInfo(activeFilters.value);
};

// 清除筛选条件
const clearFilters = () => {
  filters.value = {
    elderID: '',
    elderName: '',
    elderGender: '',
    fraudRisk: ''
  };
  fetchElderInfo();
};

// 新增对话框相关变量
const dialogVisibleAdd = ref(false);
const addForm = ref({
  elderID: '',
  elderName: '',
  elderGender: '',
  elderAge: null,
  elderAddress: '',
  elderPhoneNumber: '',
  emergencyName: '',
  emergencyPhoneNumber: '',
  relationship: '',
  dietFiles: '',
  fraudRisk: ''
});
const rules = ref({
  //elderID: [{ required: true, message: '请输入老人ID', trigger: 'blur' }],
  elderName: [{ required: true, message: '请输入老人姓名', trigger: 'change' }],
  elderGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  elderAge: [{ required: true, message: '请输入年龄', trigger: 'change' }],
  elderAddress: [{ required: true, message: '请输入地址', trigger: 'change' }],
  elderPhoneNumber: [{ required: true, message: '请输入联系电话', trigger: 'change' }],
  emergencyName: [{ required: true, message: '请输入紧急联系人', trigger: 'change' }],
  emergencyPhoneNumber: [{ required: true, message: '请输入紧急联系电话', trigger: 'change' }],
  relationship: [{ required: true, message: '请输入关系', trigger: 'change' }],
  dietFiles: [{ required: false }],
  fraudRisk: [{ required: true, message: '请选择欺诈风险等级', trigger: 'change' }]
});
const addFormRef = ref(null);

// 显示新增对话框
const showAddDialog = () => {
  addForm.value = {
    elderID: '',
    elderName: '',
    elderGender: '',
    elderAge: null,
    elderAddress: '',
    elderPhoneNumber: '',
    emergencyName: '',
    emergencyPhoneNumber: '',
    relationship: '',
    dietFiles: '',
    fraudRisk: ''
  };
  dialogVisibleAdd.value = true;
};

// 提交新增老人信息
const submitAdd = async () => {
  try {
    await addFormRef.value.validate();

    // 获取下一个可用的老人ID
    const nextElderID = await getNextElderID();

    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `INSERT INTO \`elderinfo\`
            (elderID, elderName, elderGender, elderAge, elderAddress, elderPhoneNumber,
             emergencyName, emergencyPhoneNumber, relationship, dietFiles, fraudRisk)
            VALUES
            ('${nextElderID}', '${addForm.value.elderName}', '${addForm.value.elderGender}',
             ${addForm.value.elderAge}, '${addForm.value.elderAddress}', '${addForm.value.elderPhoneNumber}',
             '${addForm.value.emergencyName}', '${addForm.value.emergencyPhoneNumber}',
             '${addForm.value.relationship}', '${addForm.value.dietFiles}', '${addForm.value.fraudRisk}')`
    });

    if (response.data && response.data.affectedRows > 0) {
      fetchElderInfo(); // 成功后重新获取老人信息列表
      dialogVisibleAdd.value = false; // 关闭对话框
      ElMessage.success('新增老人信息成功');
    } else {
      console.error('新增老人信息失败');
      ElMessage.error('新增老人信息失败，请稍后再试');
    }
  } catch (error) {
    console.error('提交新增老人信息失败', error);
    ElMessage.error('提交新增老人信息失败，请检查输入的信息是否正确');
  }
};

// 获取下一个可用的老人ID
const getNextElderID = async () => {
  try {
    const response = await axios.post('http://122.51.230.168:3000/api/execute-soft', {
      sql: `SELECT MAX(elderID) AS maxID FROM \`elderinfo\``
    });

    let maxID = response.data[0].maxID || 'elder000';
    let numPart = parseInt(maxID.replace('elder', ''), 10) + 1;
    return `elder${String(numPart).padStart(3, '0')}`;
  } catch (error) {
    console.error('获取下一个老人ID失败:', error.response ? error.response.data : error.message);
    throw new Error('无法获取下一个老人ID');
  }
};

onMounted(() => fetchElderInfo());
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