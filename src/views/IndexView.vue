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
            default-active="dashboard"
        >
          <template v-for="item in asideMenu" :key="item.title">
            <!-- 两级菜单 -->
            <el-sub-menu
                v-if="item.subs"
                :index="item.title"
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
              <router-view />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { ElMessageBox } from 'element-plus';
import {
  Document,

} from "@element-plus/icons-vue";

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
          subs: [
            {
              title: "订单管理",
              index: "orderManagement",
            },
            {
              title: "工单管理",
              index: "workOrders",
            },
          ],
        },
        {
          title: "老人管理",
          subs: [
            {
              title: "老人列表",
              index: "elderList",
            },
            {
              title: "老人基本信息",
              index: "elderInfo",
            },
          ],
        },
        {
          title: "实时监测",
          subs: [
            {
              title: "实时监控",
              index: "liveMonitoring",
            },
            {
              title: "健康数据",
              index: "healthData",
            },
          ],
        },
        {
          title: "警报管理",
          subs: [
            {
              title: "警报列表",
              index: "alertList",
            },
            {
              title: "警报设置",
              index: "alertSettings",
            },
          ],
        },
      ],
    };
  },
  watch: {
    activeTabName: function () {
      console.log("高亮的index值", this.activeTabName);
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
  methods: {
    handleMenuItem(obj) {
      // 设置高亮
      this.activeTabName = obj.index;
      let result = this.editableTabs.findIndex((tab) => tab.index === obj.index);
      if (result === -1) {
        this.editableTabs.push({ ...obj, closable: true });
      }
      this.$router.push({ name: obj.index });
    },
    handleSwitchRoute(tabsPaneContext) {
      this.$router.push({ name: tabsPaneContext.paneName });
    },
    handleRemove(targetName) {
      if (targetName === 'home') {
        return; // 如果是首页，则不执行任何操作
      }
      let tabs = this.editableTabs;
      let activeName = this.activeTabName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.index === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.index;
            }
          }
        });
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
          .catch(() => {
            // 取消：不做任何提示
          });
    },
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