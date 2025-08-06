<template>
  <div class="list-module">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="人员姓名" min-width="100" align="center" />
      <el-table-column prop="unit" label="所属单位" min-width="120" align="center" />
      <el-table-column prop="jobNo" label="单位职务" min-width="150" align="center" />
      <el-table-column prop="warningStatus" label="预警情况" min-width="100" align="center">
        <template #default="scope">
          <span :class="{ 'warning-tag': scope.row.warningStatus === '存在预警' }">
            {{ scope.row.warningStatus }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160" align="center" />
      <el-table-column prop="punishmentStatus" label="处分情况" min-width="120" align="center">
        <template #default="scope">
          <span :class="{ 'warning-tag': scope.row.punishmentStatus === '处于影响期' }">
            {{ scope.row.punishmentStatus }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" align="center" fixed="right">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view'])

// 查看详情
const handleView = (row) => {
  emit('view', row)
}
</script>

<style scoped>
.list-module {
  width: 100%;
  flex: 1;
  overflow-x: hidden;
}

.warning-tag {
  color: #f56c6c;
  font-weight: bold;
}
</style> 