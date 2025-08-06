<template>
  <div class="personnel-detail-view" v-if="personnelData">
    <!-- 上部分 - 占页面高度的40% -->
    <div class="top-section">
      <!-- 左侧：人员基本信息 - 占宽度20% -->
      <div class="info-section">
        <div class="section-title">人员基本信息</div>
        <div class="info-content">
          <div class="info-row">
            <div class="info-item">
              <span class="label">人员姓名：</span>
              <span class="value">{{ personnelData.name }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">工作单位：</span>
              <span class="value">{{ personnelData.unit }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">工作职务：</span>
              <span class="value">{{ personnelData.jobNo }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">预警情况：</span>
              <span class="value" :class="{
                'warning-text': personnelData.warningStatus === '存在预警',
                'safe-text': personnelData.warningStatus !== '存在预警'
              }">
                {{ personnelData.warningStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间：雷达图 - 占宽度40% -->
      <div class="radar-section">
        <div class="section-title">六维图详情</div>
        <div id="detail-radar-chart" class="radar-chart"></div>
      </div>
      
      <!-- 右侧：条形图 - 占宽度40% -->
      <div class="bars-section">
        <div class="section-title">条形图详情</div>
        <div class="score-bars">
          <div class="score-bar-item">
            <div class="bar-label">政治监督</div>
            <div class="bar-container">
              <div class="bar-progress" :style="`width: ${scoreData.political}%;`"></div>
            </div>
            <div class="bar-value">{{ scoreData.political }}</div>
          </div>
          
          <div class="score-bar-item">
            <div class="bar-label">担当作为监督</div>
            <div class="bar-container">
              <div class="bar-progress" :style="`width: ${scoreData.economic}%;`"></div>
            </div>
            <div class="bar-value">{{ scoreData.economic }}</div>
          </div>
          
          <div class="score-bar-item">
            <div class="bar-label">纪律作风监督</div>
            <div class="bar-container">
              <div class="bar-progress" :style="`width: ${scoreData.livelihood}%;`"></div>
            </div>
            <div class="bar-value">{{ scoreData.livelihood }}</div>
          </div>
        
          <div class="score-bar-item">
            <div class="bar-label">选人用人监督</div>
            <div class="bar-container">
              <div class="bar-progress" :style="`width: ${scoreData.discipline}%;`"></div>
            </div>
            <div class="bar-value">{{ scoreData.discipline }}</div>
          </div>
          
          <div class="score-bar-item">
            <div class="bar-label">巡视巡查整改监督</div>
            <div class="bar-container">
              <div class="bar-progress" :style="`width: ${scoreData.violation}%;`"></div>
            </div>
            <div class="bar-value">{{ scoreData.violation }}</div>
          </div>
          
          <div class="score-bar-item">
            <div class="bar-label">信访等其他监督</div>
            <div class="bar-container">
              <div class="bar-progress" :style="`width: ${scoreData.legal}%;`"></div>
            </div>
            <div class="bar-value">{{ scoreData.legal }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下部分 - 占页面高度的60% -->
    <div class="bottom-section">
      <div class="section-title">监督记录</div>
      
      <!-- 监督记录表格 -->
      <el-table
        ref="supervisionTableRef"
        :data="supervisionRecords"
        stripe
        style="width: 100%"
        @expand-change="handleExpandRow"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div class="expanded-row">
              <div class="expanded-item">
                <span class="expanded-label">问题分类：</span>
                <span>{{ props.row.problemType }}</span>
              </div>
              <div class="expanded-item">
                <span class="expanded-label">发生时间：</span>
                <span>{{ props.row.occurrenceTime }}</span>
              </div>
              <div class="expanded-item full-width">
                <span class="expanded-label">事件内容：</span>
                <span>{{ props.row.content }}</span>
              </div>
              <div class="expanded-item full-width">
                <span class="expanded-label">处理结果：</span>
                <span>{{ props.row.result }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="id"
          label="序号"
          align="center"
          min-width="80"
        />
        
        <el-table-column
          prop="problemType"
          label="问题分类"
          min-width="120"
        />
        
        <el-table-column
          prop="resultSummary"
          label="处理结果"
          min-width="120"
        />
        
        <el-table-column
          prop="effectPeriod"
          label="影响期间"
          min-width="150"
        />
        
        <el-table-column
          label="操作"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页控制器 -->
      <div class="pagination-container">
        <el-pagination
          layout="total, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 关闭按钮 -->
    <div class="close-button" @click="handleClose">
      <el-icon><Close /></el-icon>
      <span class="close-text">关闭</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits, computed } from 'vue'
import { Close } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarChart,
  CanvasRenderer
])

const props = defineProps({
  personnelData: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'restore-data'])

// 模拟从雷达图数据生成详细分数数据
const scoreData = ref({
  political: 0,
  economic: 0,
  livelihood: 0,
  discipline: 0,
  violation: 0,
  legal: 0
})

// 监督记录表格数据
const supervisionRecords = computed(() => {
  // 如果预警情况为"无预警"，则返回空数组
  if (props.personnelData && props.personnelData.warningStatus !== '存在预警') {
    return [];
  }

  // 否则返回完整的数据
  return [
    {
      id: 1,
      problemType: '四风问题',
      resultSummary: '党纪处分',
      effectPeriod: '2021-02-28 -- 2024-02-28',
      occurrenceTime: '2021-01-15',
      content: '于2021年1月1日，xxx同志xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx。',
      result: '于2021年1月1日，给予xxx同志严重警告处分，影响期三年。'
    },
    {
      id: 2,
      problemType: '个人有关事项报告造假',
      resultSummary: '诫勉谈话',
      effectPeriod: '2021-02-28 -- 2024-02-28',
      occurrenceTime: '2021-02-10',
      content: '漏报个人房产信息。',
      result: '批评教育并责令整改。'
    }
  ];
})

// 分页数据
const total = computed(() => supervisionRecords.value.length)
const currentPage = ref(1)
const pageSize = ref(10)

// 雷达图实例
let radarChart = null

// 表格引用
const supervisionTableRef = ref(null)

// 保存状态到localStorage
const saveStateToStorage = () => {
  if (props.personnelData) {
    localStorage.setItem('personnelDetailData', JSON.stringify(props.personnelData))
  }
}

// 从localStorage获取状态
const getStateFromStorage = () => {
  const storedData = localStorage.getItem('personnelDetailData')
  if (storedData) {
    try {
      return JSON.parse(storedData)
    } catch (e) {
      console.error('解析存储的人员数据失败', e)
      return null
    }
  }
  return null
}

// 初始化雷达图
const initRadarChart = () => {
  if (!props.personnelData) return
  
  // 使用 setTimeout 确保 DOM 已经完全加载
  setTimeout(() => {
    const chartDom = document.getElementById('detail-radar-chart')
    if (!chartDom) {
      console.error('未找到雷达图容器: detail-radar-chart')
      return
    }
    
    // 销毁旧图表
    if (radarChart) {
      radarChart.dispose()
    }
    
    radarChart = echarts.init(chartDom)
    
    const option = {
      animation: false,
      radar: {
        indicator: [
          { name: '政治监督', max: 100 },
          { name: '担当作为监督', max: 100 },
          { name: '纪律作风监督', max: 100 },
          { name: '选人用人监督', max: 100 },
          { name: '巡视巡查整改监督', max: 100 },
          { name: '信访等其他监督', max: 100 }
        ],
        shape: 'polygon',
        splitNumber: 4,
        center: ['50%', '50%'],
        radius: '70%',
        axisName: {
          color: '#333',
          fontSize: 12
        },
        splitArea: {
          areaStyle: {
            color: ['#f3f6f9', '#e9f0f6', '#dbe7f3']
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      series: [
        {
          name: '综合评分',
          type: 'radar',
          data: [
            {
              value: props.personnelData.radarData || [60, 60, 60, 60, 60, 60],
              name: '评分',
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                color: props.personnelData.warningStatus === '存在预警' ? '#F56C6C' : '#409EFF',
                width: 2
              },
              areaStyle: {
                color: props.personnelData.warningStatus === '存在预警' 
                  ? 'rgba(245, 108, 108, 0.2)' 
                  : 'rgba(64, 158, 255, 0.2)'
              },
              itemStyle: {
                color: props.personnelData.warningStatus === '存在预警' ? '#F56C6C' : '#409EFF'
              }
            }
          ]
        }
      ],
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function(params) {
          const dimensionNames = ['政治监督', '担当作为监督', '纪律作风监督', '选人用人监督', '巡视巡查整改监督', '信访等其他监督']
          const values = params.value
          let result = `<div style="font-weight:bold;margin-bottom:5px;">综合评分</div>`
          
          for (let i = 0; i < dimensionNames.length; i++) {
            const color = params.color
            result += `<div style="display:flex;justify-content:space-between;"><span>${dimensionNames[i]}:</span> <span style="font-weight:bold;color:${color}">${values[i]}</span></div>`
          }
          
          return result
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      }
    }
    
    try {
      radarChart.setOption(option, true)
    } catch (error) {
      console.error('雷达图设置失败:', error)
    }
  }, 100)
}

// 生成分数数据
const generateScoreData = () => {
  if (!props.personnelData || !props.personnelData.radarData) return
  
  const radarData = props.personnelData.radarData
  
  // 使用雷达图数据来设置对应的分数条
  scoreData.value = {
    political: radarData[0],
    economic: radarData[1],
    livelihood: radarData[2],
    discipline: radarData[3],
    violation: radarData[4],
    legal: radarData[5]
  }
}

// 监听数据变化
watch(() => props.personnelData, (newData) => {
  if (newData) {
    generateScoreData()
    initRadarChart()
    saveStateToStorage() // 保存新的人员数据到localStorage
  }
}, { deep: true })

// 窗口大小变化时调整图表大小
const handleResize = () => {
  if (radarChart) {
    radarChart.resize()
  }
}

// 关闭详情
const handleClose = () => {
  localStorage.removeItem('personnelDetailData') // 清除存储的数据
  emit('close')
}

// 处理表格行展开
const handleExpandRow = (row) => {
  console.log('展开行:', row)
}

// 处理查看详情
const handleViewDetail = (row) => {
  console.log('查看详情:', row)
  // 控制行的展开/折叠状态
  supervisionTableRef.value.toggleRowExpansion(row)
}

// 处理分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 在实际应用中，这里应该调用API获取新的分页数据
  console.log('切换到页码:', page)
}

onMounted(() => {
  // 如果props中有数据则使用props，否则尝试从localStorage恢复
  if (props.personnelData) {
    generateScoreData()
    initRadarChart()
    saveStateToStorage()
  } else {
    // 尝试从localStorage恢复数据
    const storedData = getStateFromStorage()
    if (storedData) {
      // 通知父组件更新数据
      emit('restore-data', storedData)
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  // 添加页面刷新前的事件监听
  window.addEventListener('beforeunload', saveStateToStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('beforeunload', saveStateToStorage)
  
  if (radarChart) {
    radarChart.dispose()
    radarChart = null
  }
})
</script>

<style scoped>
.personnel-detail-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* 上部分样式 - 占40%高度 */
.top-section {
  height: 40%;
  display: flex;
  border-bottom: 2px solid #888;
}

/* 左侧部分 - 占20%宽度 */
.info-section {
  width: 20%;
  padding: 15px;
  border-right: 2px solid #888;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* 中间部分 - 占40%宽度 */
.radar-section {
  width: 40%;
  padding: 15px;
  border-right: 2px solid #888;
  display: flex;
  flex-direction: column;
}

/* 右侧部分 - 占40%宽度 */
.bars-section {
  width: 40%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* 下部分样式 - 占60%高度 */
.bottom-section {
  height: 60%;
  padding: 15px;
  overflow-y: auto;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #e0e0e0;
}

.info-content {
  flex: 1;
  font-size: 14px;
}

.info-row {
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label {
  font-weight: bold;
  color: #333;
  width: 80px;
  flex-shrink: 0;
}

.value {
  color: #666;
  flex: 1;
}

.warning-text {
  color: #F56C6C;
  font-weight: bold;
}

.safe-text {
  color: #67C23A;
  font-weight: bold;
}

.radar-chart {
  flex: 1;
  width: 100%;
  height: calc(100% - 30px);
}

.score-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  margin-top: 15px;
}

.score-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  width: 120px;
  text-align: right;
  color: #666;
  font-size: 13px;
  white-space: nowrap;
}

.bar-container {
  flex: 1;
  height: 16px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.bar-progress {
  height: 100%;
  background-color: #409EFF;
  border-radius: 8px;
}

.bar-value {
  width: 30px;
  text-align: right;
  font-weight: bold;
  color: #409EFF;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 15px;
  width: auto;
  min-width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: #f56c6c;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 20;
  padding: 0 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.close-button:hover {
  background-color: #e64242;
  transform: scale(1.05);
}

.close-text {
  margin-left: 5px;
  font-size: 14px;
  font-weight: bold;
}

/* 表格展开行样式 */
.expanded-row {
  padding: 15px;
  background-color: #f9f9f9;
  width: 100%; /* 确保展开行宽度与表格一致 */
}

.expanded-item {
  display: block; /* 改为块级元素，使每个项目占一行 */
  margin-bottom: 10px; /* 添加底部间距 */
}

.expanded-label {
  font-weight: bold;
  color: #666;
  display: inline-block; /* 使标签成为块级元素 */
  min-width: 80px; /* 设置标签最小宽度 */
  margin-right: 8px; /* 标签和内容之间的间距 */
}

.full-width {
  width: 100%;
}

/* 分页控制器样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 加粗表头样式 */
:deep(.el-table__header) th {
  font-size: 14px !important;
  font-weight: bold !important;
  color: #000000 !important;
}

@media (max-width: 1200px) {
  .top-section {
    flex-direction: column;
    height: auto;
    overflow-y: auto;
  }
  
  .info-section,
  .radar-section,
  .bars-section {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid #888;
  }
  
  .radar-section {
    height: 300px;
  }
  
  .bottom-section {
    height: auto;
  }
  
  /* 在小屏幕上进一步优化表格列 */
  :deep(.el-table__body) td {
    padding: 8px 0;
  }
  
  :deep(.el-table__header) th {
    padding: 8px 0;
  }
  
  /* 在小屏幕上优化展开行样式 */
  .expanded-label {
    min-width: 60px; /* 在小屏幕上减小标签最小宽度 */
  }
}
</style>