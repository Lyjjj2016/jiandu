<template>
  <div class="import-module-wrapper">
    <el-card class="import-module-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
        </div>
      </template>
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        :action="apiUrl"
        name="file"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :on-error="handleError"
        :auto-upload="false"
        :before-upload="beforeUpload"
        drag
      >
        <!--<template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>-->

        <div class="upload-area">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此处或 <em>点击选择文件</em>
          </div>
        </div>
        

        <template #tip>
          <el-button class="ml-3" type="success" @click="submitUpload">
          上传文件
        </el-button>
          <div class="el-upload__tip" style="font-size: 14px;">只能上传excel文件，且不超过5MB</div>
        </template>
      </el-upload>
      
      <div v-if="(uploadRef as any)?.uploadFiles?.length > 0" class="file-list">
        <div v-for="(file, index) in (uploadRef as any).uploadFiles" :key="index">
          {{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }}MB)
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'

export interface ImportModuleProps {
  title: string
  apiUrl: string
  resetOnSuccess?: boolean
}

const props = withDefaults(defineProps<ImportModuleProps>(), {
  resetOnSuccess: true
})

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'error'): void
}>()

// 上传引用
const uploadRef = ref<UploadInstance>()

// 提交上传
const submitUpload = () => {
  uploadRef.value!.submit()
}

// 处理上传成功
const handleSuccess = (response: any) => {
  if (response.code === 0 && response.data === true) {
    ElMessage.success('信息导入成功')
    emit('success')
    if (props.resetOnSuccess) {
      // 上传成功后重置模块状态
      uploadRef.value!.clearFiles()
    }
  } else {
    ElMessage.error('上传的文件不符合要求，请重新上传！')
    emit('error')
  }
}

// 上传前检查文件大小
const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('上传文件大小不能超过5MB！')
    return false
  }
  return true
}

// 处理文件超出限制
const handleExceed = () => {
  ElMessage.warning('当前已存在待上传的文件')
}

// 处理上传失败
const handleError = () => {
  ElMessage.error('上传的文件为空或不符合要求，请重新上传！')
  emit('error')
}
</script>

<style scoped>
.import-module-wrapper {
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 100%;
}

.import-module-card {
  height: 100%;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  word-break: break-all;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header span {
  font-size: 1.1rem;
  font-weight: bold;
}

.import-module-card .el-button {
  font-size: 1.2rem;
  padding: 8px 16px;
}

.upload-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 500px; /* 增加最小宽度 */
  padding: 20px 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.el-icon--upload {
  font-size: 67px;
  color: var(--el-text-color-placeholder);
  margin-bottom: 16px;
  line-height: 50px;
}

/* 处理文件名过长的情况 */
.upload-demo .el-upload-list__item-name {
  white-space: normal;
  word-break: break-all;
  max-width: 100%;
}
</style>
