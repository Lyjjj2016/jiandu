<template>
  <div class="import-container">
    <!-- 白色背景区域 -->
    <div class="import-white-area">
      <h2>信息导入</h2>
    
<!-- 模块容器 -->
    <div class="modules-container">
      <!-- 干部基础信息导入模块 -->
      <ImportModule
        title="干部基础信息导入"
        apiUrl="http://localhost:8888/api/user/importUserInfo"
        :resetOnSuccess="true"
        @success="handleModuleSuccess"
        @error="handleModuleError"
      />

      <!-- 干部监督信息导入模块 -->
      <ImportModule
        title="干部监督信息导入"
          apiUrl="http://127.0.0.1:8888/api/superviseEvent/importExcel"
          :resetOnSuccess="true"
          @success="handleModuleSuccess"
          @error="handleModuleError"
      />
    </div> <!-- 结束模块容器 -->
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ImportModule from '../components/ImportModule.vue'

// 可以在这里添加其他需要的逻辑
const handleModuleSuccess = () => {
  // 处理模块成功事件
  console.log('导入成功')
}

const handleModuleError = () => {
  // 处理模块错误事件
  console.log('导入失败')
}
</script>

<style scoped>
.import-container {
  padding: 5px;
  background-color: rgba(247,248,250,1);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  max-width: 100%;
  min-width: 100%;
}

/* 白色背景区域样式 */
.import-white-area {
  width: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  max-width: 100%;
  min-width: 100%;
  display: block;
}

.modules-container {
  display: flex;
  gap: 20px;
  width: 100%;
}

.import-module-card {
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 100%;
  height: 33.333%;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  word-break: break-all;
}

/* 处理文件名过长的情况 */
.upload-demo .el-upload-list__item-name {
  white-space: normal;
  word-break: break-all;
  max-width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header span {
  font-size: 1.1rem;
  font-weight: normal;
}

.import-module-card .el-button {
  font-size: 1.2rem;
  padding: 8px 16px;
}

.upload-demo {
  display: flex;
  align-items: center;
  gap: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #303133;
  font-weight: bold;
}

h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #606266;
}
</style>

<ImportModule
        title="干部基础信息导入"
        apiUrl="http://localhost:8888/api/user/importUserInfo"
        :resetOnSuccess="true"
        @success="handleModuleSuccess"
        @error="handleModuleError"
      />