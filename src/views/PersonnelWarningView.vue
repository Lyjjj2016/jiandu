<template>
  <div class="personnel-warning-page">
    <!-- 使用顶部导航栏组件 -->
    <TopNavbar @search="handleSearch" />

    <div class="main-container">
      <!-- 使用侧边栏组件 -->
      <SideMenu :is-collapse="isCollapse" />

      <!-- 增加一个包装层 -->
      <div class="personnel-content-wrapper">
        <!-- 主要内容区域 -->
        <div class="personnel-warning">
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">预警主页</el-breadcrumb-item>
            <el-breadcrumb-item>人员预警信息查询</el-breadcrumb-item>
          </el-breadcrumb>

          <div class="search-form-container">
            <h2 class="section-title">查询表格</h2>
            <el-form :model="searchForm" label-width="auto" class="search-form">
              <div class="form-row">
                <el-form-item label="单位名称">
                  <el-input v-model="searchForm.unitName" placeholder="请输入单位名称" clearable class="light-input" />
                </el-form-item>
                <el-form-item label="单位职务">
                  <el-input v-model="searchForm.unitJobNo" placeholder="请输入单位职务" clearable class="light-input" />
                </el-form-item>
                <el-form-item label="预警情况">
                  <el-select v-model="searchForm.warningStatus" placeholder="全部" class="full-width light-input">
                    <el-option label="全部" value="" />
                    <el-option label="无预警" value="无预警" />
                    <el-option label="存在预警" value="存在预警" />
                  </el-select>
                </el-form-item>
                <div class="form-action-item">
                  <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
                </div>
              </div>

              <div class="form-row">
                <el-form-item label="筛选方式">
                  <el-select v-model="searchForm.filterMode" placeholder="全部" class="full-width light-input">
                    <el-option label="全部" value="" />
                    <el-option label="方式一" value="方式一" />
                    <el-option label="方式二" value="方式二" />
                    <el-option label="方式三" value="方式三" />
                  </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="date-range-picker light-input"
                  />
                </el-form-item>
                <el-form-item label="处分情况">
                  <el-select v-model="searchForm.punishmentStatus" placeholder="全部" class="full-width light-input">
                    <el-option label="全部" value="" />
                    <el-option label="无" value="无" />
                    <el-option label="处于影响期" value="处于影响期" />
                  </el-select>
                </el-form-item>
                <div class="form-action-item">
                  <el-button @click="handleReset" :icon="Refresh">重置</el-button>
                </div>
              </div>
            </el-form>
          </div>

          <div class="table-container">
            <div class="table-header">
              <div class="table-tabs">
                <el-radio-group v-model="viewMode" size="small" class="view-mode-tabs">
                  <el-radio-button label="list">列表查看</el-radio-button>
                  <el-radio-button label="metric">图形查看</el-radio-button>
                </el-radio-group>
              </div>
              <!--<div class="export-action">
                <el-button :icon="Download" @click="handleExport">下载</el-button>
              </div>-->
            </div>
           
            <div class="content-container">
              <PersonnelListView 
                v-if="viewMode === 'list'" 
                :loading="loading"
                :table-data="tableData"
                @view="handleView"
              />
              
              <PersonnelChartView 
                v-if="viewMode === 'metric'"
                :table-data="tableData"
                @view="handleView"
              />
              
              <!-- 人员详情视图 -->
              <PersonnelDetailView 
                v-if="showDetail"
                :personnel-data="selectedPersonnel"
                @close="handleCloseDetail"
                @restore-data="handleRestoreData"
              />
            </div>

            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[12, 24, 36, 48]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import TopNavbar from '@/components/TopNavbar.vue'
import SideMenu from '@/components/SideMenu.vue'
import PersonnelListView from '@/components/PersonnelListView.vue'
import PersonnelChartView from '@/components/PersonnelChartView.vue'
import PersonnelDetailView from '@/components/PersonnelDetailView.vue'

// 侧边栏折叠状态
const isCollapse = ref(false)

// 搜索表单数据
const searchForm = reactive({
  unitName: '',
  unitJobNo: '',
  warningStatus: '',
  punishmentStatus: '',
  dateRange: [],
  filterMode: '' // 添加筛选方式字段
})

// 表格相关数据
const loading = ref(false)
const viewMode = ref('list')
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 详情相关数据
const showDetail = ref(false)
const selectedPersonnel = ref(null)

// 初始化获取数据
onMounted(() => {
  // 检查是否有存储的人员详情数据
  const storedData = localStorage.getItem('personnelDetailData')
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData)
      selectedPersonnel.value = parsedData
      showDetail.value = true
    } catch (e) {
      console.error('解析存储的人员数据失败', e)
    }
  }
  
  fetchData()
})

// 模拟获取数据的函数
const fetchData = () => {
  loading.value = true
  // 模拟后端API调用
  setTimeout(() => {
    // 模拟数据
    const mockData = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      name: '张三',
      unit: 'xx镇',
      jobNo: `xx办公室干部`,
      warningStatus: index % 5 === 0 ? '存在预警' : '无预警',
      createTime: '2021-02-28 10:30',
      punishmentStatus: index % 10 === 0 ? '处于影响期' : '无',
      // 添加六个维度的评分数据，供雷达图使用
      radarData: [
        60 + Math.round(Math.sin(index * 0.1) * 30), // 工作能力
        65 + Math.round(Math.cos(index * 0.2) * 25), // 组织纪律 
        70 + Math.round(Math.sin(index * 0.3) * 20), // 廉洁自律
        75 + Math.round(Math.cos(index * 0.4) * 15), // 作风建设
        80 + Math.round(Math.sin(index * 0.5) * 10), // 守法意识
        85 + Math.round(Math.cos(index * 0.6) * 5)   // 个人品行
      ]
    }))
    
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    tableData.value = mockData.slice(start, end)
    total.value = mockData.length
    loading.value = false
  }, 500)
}

// 搜索处理
const handleSearch = (searchText) => {
  if (searchText !== undefined) {
    console.log('全局搜索:', searchText)
    // 处理顶部导航栏的搜索
    return
  }
  
  // 处理表单搜索
  currentPage.value = 1
  fetchData()
}

// 重置处理
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    if (Array.isArray(searchForm[key])) {
      searchForm[key] = []
    } else {
      searchForm[key] = ''
    }
  })
  currentPage.value = 1
  fetchData()
}

// 查看详情
const handleView = (row) => {
  console.log('查看详情', row)
  selectedPersonnel.value = row
  showDetail.value = true
}

// 关闭详情
const handleCloseDetail = () => {
  showDetail.value = false
  selectedPersonnel.value = null
}

// 导出数据
const handleExport = () => {
  console.log('导出数据')
  // 这里可以实现导出数据的逻辑
}

// 分页相关处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

// 处理restore-data事件
const handleRestoreData = (data) => {
  selectedPersonnel.value = data
  showDetail.value = true
}
</script>

<style scoped>
.personnel-warning-page {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(247,248,250,1);
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex: 1;
  height: calc(100% - 60px);
  overflow: hidden;
}

/* 新增的包装层样式 */
.personnel-content-wrapper {
  flex: 1;
  display: flex;
  overflow: auto;
}

.personnel-warning {
  padding: 20px;
  background-color: #f7f8fa;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

/* 面包屑样式 */
.el-breadcrumb {
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 15px;
  margin-top: 0;
  color: #333;
}

.search-form-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.form-row .el-form-item {
  margin-bottom: 0;
  flex: 1;
  min-width: 200px;
}

/* 操作按钮容器样式 */
.form-action-item {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
  min-width: 80px;
}

/* 浅灰色输入框样式 */
.light-input {
  background-color: #f5f7fa;
}

.light-input :deep(.el-input__wrapper),
.light-input :deep(.el-input__inner),
.light-input :deep(.el-select__wrapper),
.light-input :deep(.el-range-editor.el-input__wrapper) {
  background-color: #f5f7fa !important;
}

/* 专门针对日期选择器的样式 */
.date-range-picker:deep(.el-range-editor.el-input__wrapper) {
  background-color: #f5f7fa !important;
}

.date-range-picker:deep(.el-range-input) {
  background-color: #f5f7fa !important;
}

.date-range-picker:deep(.el-date-editor) {
  background-color: #f5f7fa !important;
}

/* 更强制的日期选择器样式覆盖 */
:deep(.el-date-editor.el-input),
:deep(.el-date-editor.el-input__wrapper),
:deep(.el-date-editor .el-input__wrapper),
:deep(.el-date-editor .el-range-input),
:deep(.el-date-editor.el-range-editor.el-input__wrapper) {
  background-color: #f5f7fa !important;
}

/* 确保日期选择器内部输入框为灰色 */
:deep(.el-date-editor .el-range-input),
:deep(.el-date-editor .el-range-separator) {
  background-color: #f5f7fa !important;
  color: #606266;
}

.full-width {
  width: 100%;
}

.date-range-picker {
  width: 100%;
}

.table-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
  flex: 1;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* 视图切换按钮样式 - 椭圆形按钮 */
.view-mode-tabs :deep(.el-radio-button__inner) {
  padding: 8px 20px;
  border-radius: 20px;
}

/* 添加按钮间间距 */
.view-mode-tabs :deep(.el-radio-button:first-child) {
  margin-right: 10px;
}

/* 去除按钮组的默认边框样式 */
.view-mode-tabs :deep(.el-radio-button__original) {
  border: none;
}

/* 自定义按钮组样式使其成为椭圆形 */
.view-mode-tabs :deep(.el-radio-button) {
  margin-right: 10px;
}

.view-mode-tabs :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 20px;
  border-right: 1px solid #dcdfe6;
}

.view-mode-tabs :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.warning-tag {
  color: #f56c6c;
  font-weight: bold;
}

.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-actions {
    margin-top: 10px;
    justify-content: flex-end;
  }
}
</style> 