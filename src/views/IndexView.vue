<template>
  <div class="common-layout">
    <el-container class="box">
      <!-- 左侧菜单栏 -->
      <el-aside class="el-aside">
        <h1 class="logoBox">社区养老小助手</h1>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#003873"
            text-color="#fff"
            :router="true"
            :default-active="activeTabName"
        >
          <template v-for="item in asideMenu" :key="item.title">
            <!-- 两级菜单 -->
            <el-sub-menu
                v-if="item.subs"
                :index="item.index"
            >
              <template #title>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                  v-for="subItem in item.subs"
                  :key="subItem.index"
                  :index="subItem.index"
                  @click="handleMenuItem(subItem)"
              >{{ subItem.title }}</el-menu-item>
            </el-sub-menu>

            <!-- 一级菜单 -->
            <el-menu-item
                v-else
                :index="item.index"
                @click="handleMenuItem(item)"
            >
              <el-icon><document /></el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- header头部菜单 -->
        <el-header class="header">
          <span>管理员面板</span>
        </el-header>
        <!-- main主体模块：标签页 + 当前路由内容 -->
        <el-scrollbar>
          <el-main class="el-main">
            <el-tabs
                v-model="activeTabName"
                type="card"
                closable
                @tab-remove="handleRemove"
                @tab-click="handleSwitchRoute"
            >
              <el-tab-pane
                  v-for="item in editableTabs"
                  :key="item.index"
                  :label="item.title"
                  :name="item.index"
                  :closable="item.closable"
              >
                <!-- 监听来自子组件的事件 -->
                <router-view @addTab="addTab" @openAlertDetail2="handleOpenAlertDetail2"  @openElderDetail="addTabElder"/>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';
import { Document } from '@element-plus/icons-vue';

export default {
  components: {
    Document,
  },
  data() {
    return {
      //当前选项卡
      activeTabName: "home",
      //需要显示的标签数组
      editableTabs: [
        {
          title: "首页",
          index: "home",
          closable: false, // 首页不可关闭
        },
      ],
      //左侧菜单选项配置
      asideMenu: [
        {
          title: "订单/服务",
          index: "orderService",
          subs: [
            { title: "订单管理", index: "orderManagement" },
            { title: "工单管理", index: "workOrders" }
          ]
        },
        {
          title: "老人管理",
          index: "elderManagement",
          subs: [
            { title: "老人列表", index: "elderList" },
            //{ title: "老人基本信息", index: "elderInfo" }
          ]
        },
        {
          title: "实时监测",
          index: "liveMonitoring",
          subs: [
            { title: "实时监控", index: "liveMonitoring" },
            // { title: "健康数据", index: "healthData" }
          ]
        },
        {
          title: "警报管理",
          index: "alertManagement",
          subs: [
            { title: "警报列表", index: "alertList" },
            // { title: "警报设置", index: "alertSettings" }
          ]
        }
      ],
    };
  },
  watch: {
    '$route': {
      handler(newRoute) {
        if (!this.editableTabs.some(tab => tab.index === newRoute.name)) {
          this.editableTabs.push({
            title: newRoute.meta.title || newRoute.name,
            index: newRoute.name,
            closable: true,
          });
        }
        this.activeTabName = newRoute.name || 'home';
      },
      immediate: true
    }
  },
  methods: {
    addTab(tabInfo) {
      if (!this.editableTabs.some(tab => tab.index === tabInfo.index)) {
        this.editableTabs.push(tabInfo);
      }
      this.activeTabName = tabInfo.index;
      this.$router.push({ name: tabInfo.index, params: tabInfo.params });
    },
    handleMenuItem(obj) {
      this.addTab({ ...obj, closable: obj.closable !== false });
    },
    handleSwitchRoute(tabsPaneContext) {
      this.$router.push({ name: tabsPaneContext.paneName });
    },
    handleOpenAlertDetail2(tabInfo) {
        console.log('Received openAlertDetail2 event with:', tabInfo); // 新增的日志输出
        if (!tabInfo || !tabInfo.params || !tabInfo.params.id) {
          console.error('Invalid or missing tabInfo:', tabInfo);
          return;
        }
        const { name,params } = tabInfo;
        const routeName = 'AlertDetail'; // 使用预定义的路由名称
        const tabIndex = this.editableTabs.findIndex(tab => tab.index === name);

        if (tabIndex !== -1) {
          // 如果标签页已存在，激活它而不是创建新的
          console.log('Tab already exists:', this.editableTabs[tabIndex]); // 新增的日志输出
          this.activeTabName = this.editableTabs[tabIndex].index;
        } else {
          // 如果不存在，则添加新标签页
          console.log('Adding new tab for:', tabInfo); // 新增的日志输出
          this.editableTabs.push({
            title: `警报详情 `, // 动态设置标题，包含警报ID
            index: name, // 使用组合的 routeName 和 id 确保唯一性
            closable: true,
          });
          // 设置活动标签为新增加的标签
          this.activeTabName = name;
        }

        // 导航到新标签对应的路由
        this.$router.push({ name: routeName, params });
        console.log('Opened alert detail:', tabInfo);
      },
    // handleOpenAlertDetail(tabInfo) {
    //   console.log("!1111handleOpenAlertDetail")
    //   const { name, params } = tabInfo;
    //   if (!params || !params.id) {
    //     console.error('Missing required param "id":', tabInfo);
    //     return;
    //   }
    //
    //   // 直接添加新标签页，不再检查是否存在
    //   this.editableTabs.push({
    //     title: `警报详情 - ${params.id}`, // 动态设置标题，包含警报ID
    //     index: `${name}-${params.id}`, // 确保每个警报详情标签页都有唯一的index
    //     closable: true,
    //   });
    //   // 设置活动标签为新增加的标签
    //   this.activeTabName = `${name}-${params.id}`;
    //   // 导航到新标签对应的路由
    //   this.$router.push({ name, params });
    //   console.log("!1111handleOpenAlertDetail")
    // },

    addTabElder(tabInfo) {
      const { name, params } = tabInfo;
      if (!params || !params.elderid) {
        console.error('Missing required param "elderid":', tabInfo);
        return;
      }

      // 检查是否已经有对应的标签页存在
      const existingTab = this.editableTabs.find(tab =>
          tab.index === `${name}-${params.elderid}`
      );

      if (existingTab) {
        // 如果存在，设置活动标签为已存在的标签
        this.activeTabName = existingTab.index;
      } else {
        // 如果不存在，添加新标签页
        this.editableTabs.push({
          title: `老人详情 - ${params.elderid}`, // 动态设置标题，包含老人ID
          index: `${name}-${params.elderid}`, // 确保每个老人详情标签页都有唯一的index
          closable: true,
        });
        // 设置活动标签为新增加的标签
        this.activeTabName = `${name}-${params.elderid}`;
      }

      // 导航到对应标签页的路由
      this.$router.push({ name, params });
    },
    handleRemove(targetName) {
      if (targetName === 'home') return;

      let tabs = this.editableTabs;
      let activeName = this.activeTabName;
      if (activeName === targetName) {
        const nextTab = tabs.find(tab => tab.index !== targetName);
        if (nextTab) {
          activeName = nextTab.index;
        }
      }

      this.activeTabName = activeName;
      this.editableTabs = tabs.filter(tab => tab.index !== targetName);
      this.$router.push({ name: activeName });
    },
    exitLogin() {
      ElMessageBox.confirm("真的要退出登陆吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            localStorage.removeItem("isLogin");
            this.$router.push("/login");
          })
          .catch(() => {});
    },
  },
  mounted() {
    // 确保页面加载时根据当前路由设置活动标签
    const currentRouteName = this.$route.name;
    if (currentRouteName && !this.editableTabs.some(tab => tab.index === currentRouteName)) {
      this.editableTabs.push({ title: currentRouteName, index: currentRouteName, closable: true });
    }
    this.activeTabName = currentRouteName || 'home';
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif; /* 统一字体 */
}

.logoBox {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  color: #fff;
  transition: transform 0.3s ease-in-out;
}

.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: #ecf0f3; /* 匹配登录界面的背景色 */
}

.header {
  height: 58px;
  background-color: #011c3a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
  color: #fff;
}

.el-aside {
  width: 240px;
  background: #011c3a;
  color: #fff;
  padding-top: 80px; /* 调整顶部填充，避免Logo重叠 */
  transition: transform 0.3s ease-in-out;
}

/* 主菜单样式 */
.el-menu {
  border-right: none;
  border-bottom: none;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1); /* 添加左侧阴影 */
  background-color: #012c5e;
}

/* 一级菜单项样式 */
.el-menu-item,
.el-sub-menu__title {
  height: 50px;
  line-height: 50px;
  transition: background-color 0.3s, color 0.3s;
  background-color: #003873;
}

/* 一级菜单项悬停和激活状态 */
.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: #409eff !important;
  color: #fff;
}

.el-menu-item.is-active {
  background-color: #409eff !important;
  color: #fff;
}

/* 二级菜单样式 */
.el-sub-menu .el-menu {
  background-color: #74b3fa; /* 二级菜单背景色 */
}

/* 二级菜单项样式 */
.el-sub-menu .el-menu-item {
  background-color: #5786b9;
  height: 45px;
  line-height: 45px;
}

/* 二级菜单项悬停和激活状态 */
.el-sub-menu .el-menu-item:hover {
  background-color: #a2c9ff !important; /* 更浅的背景色 */
  color: #fff;
}

.el-sub-menu .el-menu-item.is-active {
  background-color: #a2c9ff !important; /* 更浅的背景色 */
  color: #fff;
}

.el-main {
  background-color: #ffffff; /* 白色背景，与登录界面一致 */
  flex-grow: 1;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}
</style>