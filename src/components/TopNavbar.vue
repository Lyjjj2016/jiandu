<template>
  <!-- 顶部导航栏 -->
  <header class="dashboard-header">
    <div class="logo-title">
      <img src="@/assets/cpc.png" alt="logo" class="logo" />
      <span class="system-title">新昌县领导干部全量监督信息预警系统</span>
    </div>
    <div class="header-actions">
      <div class="search-container">
        <el-input
          v-model="searchInput"
          placeholder="搜索信息"
          class="search-input light-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
      <el-avatar icon="UserFilled" size="32" class="user-avatar" />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Search, UserFilled } from '@element-plus/icons-vue'

// 搜索框数据
const searchInput = ref('')

// 搜索功能
const emit = defineEmits(['search'])
const handleSearch = () => {
  emit('search', searchInput.value)
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.logo-title {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  width: auto;
  margin-right: 12px;
  object-fit: contain;
}

.system-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 10px;
}

.search-container {
  width: 250px;
}

.search-input {
  font-size: 13px;
}

.light-input :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
}

.user-avatar {
  cursor: pointer;
}
</style>