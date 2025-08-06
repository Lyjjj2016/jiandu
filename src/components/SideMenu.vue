<template>
  <!-- 侧边栏 -->
  <aside class="dashboard-sidebar">
    <el-menu 
      :default-active="activeMenu" 
      class="el-menu-vertical" 
      :collapse="isCollapse"
      background-color="#fff"
      text-color="#333"
      active-text-color="#409EFF"
      router>
      
      <!-- 预警主页 -->
      <el-menu-item index="/">
          <div class="menu-title">
            <el-icon><Monitor /></el-icon>
            <span>预警主页</span>
          </div>
      </el-menu-item>
      
      <!-- 人员预警信息查询 -->
      <el-menu-item index="/personnel-warning">
          <div class="menu-title">
            <el-icon><Search /></el-icon>
          <span>人员预警信息查询</span>
          </div>
      </el-menu-item>
      
      <!-- 数据导入导出 -->
      <el-sub-menu index="3">
        <template #title>
          <div class="menu-title">
            <el-icon><Document /></el-icon>
            <span>信息导入导出</span>
          </div>
        </template>
        <el-menu-item index="/import-personnel">
          &nbsp;
          <div class="menu-title">
            <img src="@/assets/daoru.png" alt="导入" style="width: 16px; height: 16px; margin-right: 5px;" />
            &nbsp;&nbsp;
            <span>信息导入</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/export-data">
          &nbsp;
          <div class="menu-title">
            <img src="@/assets/daochu.png" alt="导出" style="width: 16px; height: 16px; margin-right: 5px;" />
            &nbsp;&nbsp;
            <span>信息导出</span>
          </div>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { Search, Monitor, Document } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

// 确定当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.dashboard-sidebar {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  left: 0;
  box-sizing: border-box;
  z-index: 1;
}

.el-menu-vertical {
  border-right: none !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
}

:deep(.el-menu) {
  border-right: none !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
}

:deep(.el-sub-menu) {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
}

:deep(.el-sub-menu__title) {
  font-size: 14px;
  padding-right: 0 !important;
}

:deep(.el-menu-item) {
  padding-left: 20px !important;
  min-width: 0 !important;
  margin: 0 !important;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  padding-right: 0 !important;
  width: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

:deep(.el-sub-menu .el-sub-menu__title) {
  padding-left: 20px !important;
  margin: 0 !important;
  height: 45px;
  line-height: 45px;
}

:deep(.el-menu-item-group__title) {
  padding: 0 !important;
}

.menu-title {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;
  box-sizing: border-box;
}

.menu-title i {
  margin-right: 5px;
}

.menu-title span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-title :deep(.el-icon) {
  margin-right: 5px;
  font-size: 16px;
}
</style>