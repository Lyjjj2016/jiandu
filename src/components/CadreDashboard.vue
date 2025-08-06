<template>
  <div class="cadre-dashboard">
    <!-- 使用TopNavbar组件 -->
    <TopNavbar @search="handleSearch" />

    <div class="dashboard-main">
      <!-- 使用SideMenu组件 -->
       <SideMenu :is-collapse="isCollapse" /> 

      <!-- 主内容区 -->
      <main class="dashboard-content">
        <!-- 概览页面内容 -->
        <div v-if="showDashboard" class="dashboard-overview">
          <!-- 上部分：人员总览+监督情况总览 和 各单位排名 -->
          <div class="top-modules">
            <!-- 左侧：人员总览和监督情况总览整合模块 -->
            <div class="overview-section">
              <h2 class="section-title">人员总览</h2>
              
              <!-- 人员总览卡片 -->
              <div class="overview-cards">
                <div class="card">
                  <div class="card-icon card-blue">
                    <el-icon><User /></el-icon>
                  </div>
                  <div class="card-content">
                    <div class="card-label">领导干部总人数</div>
                    <div class="card-num">1000</div>
                  </div>
                  <div class="card-suffix">人</div>
                </div>
                <div class="card">
                  <div class="card-icon card-purple">
                    <el-icon><Warning /></el-icon>
                  </div>
                  <div class="card-content">
                    <div class="card-label">实时预警人数</div>
                    <div class="card-num">25</div>
                  </div>
                  <div class="card-suffix">个</div>
                </div>
                <div class="card">
                  <div class="card-icon card-orange">
                    <el-icon><Bell /></el-icon>
                  </div>
                  <div class="card-content">
                    <div class="card-label">累计预警</div>
                    <div class="card-num">8874</div>
                  </div>
                  <div class="card-suffix">条</div>
                </div>
                <div class="card">
                  <div class="card-icon card-light-blue">
                    <el-icon><CircleCheck /></el-icon>
                  </div>
                  <div class="card-content">
                    <div class="card-label">无预警人数</div>
                    <div class="card-num">800</div>
                  </div>
                  <div class="card-suffix">人</div>
                </div>
              </div>
              
              <!-- 监督情况总览 -->
              <div class="supervision-container">
                <h2 class="section-title">监督情况总览</h2>
                <div class="chart-section" ref="barChartContainer" id="main"></div>
              </div>
            </div>

            <!-- 右侧：各单位排名 -->
            <div class="ranking-module">
              <h2 class="section-title">各单位排名</h2>
              <div class="ranking-section">
                <el-table
                  :data="rankingData"
                  style="width: 100%"
                  size="small"
                  :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#606266' }"
                >
                  <el-table-column
                    prop="rank"
                    label="排名"
                    width="60"
                    align="center"
                  >
                    <template #default="scope">
                      <span class="rank-num" :class="'rank-' + scope.row.rank">{{ scope.row.rank }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unitName"
                    label="单位名称"
                    min-width="100"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="rate"
                    label="无预警占比"
                    width="90"
                    align="right"
                  >
                    <template #default="scope">
                      <span class="rank-value">{{ scope.row.rate }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                
                <!-- 监督图片移至这里 -->
                <!-- 监督图片移至这里 -->
                <div class="supervision-image-section">
                  <img src="@/assets/paimingjiandu.png" alt="监督" class="supervision-image" />
                </div>
              </div>
            </div>
          </div>

          <!-- 下部分：六类异常占比 -->
          <div class="bottom-modules">
            <h2 class="section-title">六类异常占比</h2>
            <section class="pie-section">
              <div class="pie-row">
                <div class="pie-chart-container" ref="pieChart1"></div>
                <div class="pie-chart-container" ref="pieChart2"></div>
                <div class="pie-chart-container" ref="pieChart3"></div>
              </div>
              <div class="pie-row">
                <div class="pie-chart-container" ref="pieChart4"></div>
                <div class="pie-chart-container" ref="pieChart5"></div>
                <div class="pie-chart-container" ref="pieChart6"></div>
              </div>
            </section>
          </div>
        </div>
        
        <!-- 子页面内容 -->
        <div v-else class="router-view-container">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { 
  User, 
  Warning, 
  Bell, 
  CircleCheck
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import TopNavbar from '@/components/TopNavbar.vue'
import SideMenu from '@/components/SideMenu.vue'

// 侧边栏折叠状态
const isCollapse = ref(false)
const route = useRoute()

// 图表实例引用
const pieChartInstances = ref([])
const barChartInstance = ref(null)

// 单位排名数据
const rankingData = [
  { rank: 1, unitName: '组织部', rate: '100%' },
  { rank: 2, unitName: '宣传部', rate: '100%' },
  { rank: 3, unitName: '市监局', rate: '98%' },
  { rank: 4, unitName: '社工部', rate: '98%' },
  { rank: 5, unitName: '生态环境局', rate: '96%' },
  { rank: 6, unitName: '综合执法局', rate: '94%' },
  { rank: 7, unitName: '人力社保局', rate: '92%' }
]

// 图表容器引用
const barChartContainer = ref(null)
const pieChart1 = ref(null)
const pieChart2 = ref(null)
const pieChart3 = ref(null)
const pieChart4 = ref(null)
const pieChart5 = ref(null)
const pieChart6 = ref(null)

// 只在概览页面显示仪表盘内容
const showDashboard = computed(() => {
  return route.path === '/' || route.path === ''
})

// 搜索处理函数
const handleSearch = (searchText) => {
  console.log('搜索内容:', searchText)
  // 这里可以实现搜索功能
}

// 清理图表实例
const disposeCharts = () => {
  if (barChartInstance.value) {
    barChartInstance.value.dispose()
    barChartInstance.value = null
  }
  
  pieChartInstances.value.forEach(chart => {
    if (chart) chart.dispose()
  })
  pieChartInstances.value = []
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChartContainer.value) return
  
  // 如果已有实例先销毁
  if (barChartInstance.value) {
    barChartInstance.value.dispose()
  }
  
  barChartInstance.value = echarts.init(barChartContainer.value)
  
  // 添加交互事件监听
  barChartInstance.value.on('legendselectchanged', function(params) {
    console.log('Legend selected changed:', params)
  })
  
  // 监听图表大小变化，确保tooltip位置正确
  barChartInstance.value.on('finished', () => {
    console.log('Chart rendering finished')
  })
  
  // 监听鼠标移入移出事件
  barChartInstance.value.on('mouseover', function(params) {
    // 当鼠标悬停在柱子上时，可以执行额外操作
    console.log('Mouse over:', params.seriesName, params.name, params.value)
  })
  
  var option;
  
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      },
      enterable: true,
      formatter: function(params) {
        // 自定义tooltip内容
        let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].axisValue}</div>`;
        // 先计算总数
        let total = 0;
        params.forEach(item => {
          total += item.value;
        });
        
        // 然后构建显示内容
        params.forEach(item => {
          const percentage = Math.round(item.value/total*100);
          result += `<div style="display:flex;align-items:center;margin:3px 0;">
            <span style="display:inline-block;width:10px;height:10px;background:${item.color};margin-right:5px;border-radius:50%;"></span>
            <span>${item.seriesName}: ${item.value}人 (${percentage}%)</span>
          </div>`;
        });
        result += `<div style="margin-top:5px;font-weight:bold;border-top:1px solid #eee;padding-top:5px;">总计: ${total}人</div>`;
        return result;
      },
      position: function(pos, params, dom, rect, size) {
        // 智能定位，防止tooltip被遮挡
        // 获取dom的尺寸
        const domWidth = dom.offsetWidth;
        const domHeight = dom.offsetHeight;
        const viewWidth = size.viewSize[0];
        const viewHeight = size.viewSize[1];
        
        let left = pos[0] + 10;
        let top = pos[1] + 10;
        
        // 如果tooltip溢出右侧边界
        if (left + domWidth > viewWidth) {
          left = pos[0] - domWidth - 10;
        }
        
        // 如果tooltip溢出底部边界
        if (top + domHeight > viewHeight) {
          top = pos[1] - domHeight - 10;
        }
        
        return {left, top};
      },
      confine: true // 确保tooltip不会溢出画布范围
    },
    legend: {
      data: ['红色预警', '橙色预警', '黄色预警', '无预警'],
      bottom: 10,
      itemWidth: 10,
      itemHeight: 10,
      selectedMode: true,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['政治监督', '担当作为监督', '纪律作风监督', '选人用人监督', '巡视巡查整改监督', '信访等其他监督']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1000
    },
    series: [
      {
        name: '红色预警',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#FF4D4F'
        },
        label: {
          show: true,
          position: 'inside'
        },
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230]
      },
      {
        name: '橙色预警',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#FAAD14'
        },
        label: {
          show: true,
          position: 'inside'
        },
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330]
      },
      {
        name: '黄色预警',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#FADB14'
        },
        label: {
          show: true,
          position: 'inside'
        },
        emphasis: {
          focus: 'series'
        },
        data: [150, 212, 201, 154, 190, 230]
      },
      {
        name: '无预警',
        type: 'bar',
        stack: 'total',
        itemStyle: {
          color: '#52C41A'
        },
        label: {
          show: true,
          position: 'inside'
        },
        emphasis: {
          focus: 'series'
        },
        data: [320, 302, 301, 334, 390, 330]
      }
    ]
  };
  
  // 设置图表选项
  option && barChartInstance.value.setOption(option)
  
  // 确保图表渲染完成后可以正常交互
  setTimeout(() => {
    if (barChartInstance.value) {
      barChartInstance.value.resize()
      
      // 测试tooltip显示是否正常
      barChartInstance.value.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 0
      })
      
      // 短暂显示后隐藏tooltip
      setTimeout(() => {
        barChartInstance.value.dispatchAction({
          type: 'hideTip'
        })
      }, 1000)
    }
  }, 100)
}


// 初始化饼图
const initPieCharts = () => {
  const createPieChart = (el, title, data) => {
    if (!el) return null
    
    // 清除可能已存在的图表实例
    const existingChart = echarts.getInstanceByDom(el)
    if (existingChart) {
      existingChart.dispose()
    }
    
    const chart = echarts.init(el)
    const option = {
      title: {
        text: title,
        left: '19%',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        position: function(pos, params, dom, rect, size) {
          // 智能定位，防止tooltip被遮挡
          const domWidth = dom.offsetWidth;
          const domHeight = dom.offsetHeight;
          const viewWidth = size.viewSize[0];
          const viewHeight = size.viewSize[1];
          
          let left = pos[0] + 10;
          let top = pos[1] + 10;
          
          // 如果tooltip溢出右侧边界，调整到左边
          if (left + domWidth > viewWidth) {
            left = pos[0] - domWidth - 10;
          }
          
          // 如果tooltip仍然溢出左侧边界，调整到可见范围内
          if (left < 0) {
            left = 10;
          }
          
          // 如果tooltip溢出底部边界，调整到上方
          if (top + domHeight > viewHeight) {
            top = pos[1] - domHeight - 10;
          }
          
          // 如果tooltip溢出顶部边界，调整到可见范围内
          if (top < 0) {
            top = 10;
          }
          
          return {left, top};
        },
        confine: true, // 确保tooltip不会溢出画布范围
        enterable: true // 允许鼠标进入tooltip
      },
      legend: {
        orient: 'vertical',
        left: '48%',
        top: 'center',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          fontSize: 10
        }
      },
      color: ['#5470c6', '#91cc75', '#ee6666', '#fac858', '#73c0de', '#3ba272'],
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            }
          },
          data: data
        }
      ]
    }
    chart.setOption(option)
    return chart
  }

  // 清空之前的实例
  pieChartInstances.value = []
  
  // 政治监督
const chart1 = createPieChart(pieChart1.value, '    政治监督', [
    { value: 22, name: '政治言论' },
    { value: 2567, name: '经济责任审计结论' },
    { value: 1468, name: '民主生活会落实情况' },
    { value: 966, name: '政治素质考察结论' },
    { value: 966, name: '个人有关事项报送情况' }
  ])
  if (chart1) pieChartInstances.value.push(chart1)
  
  // 担当作为监督
const chart2 = createPieChart(pieChart2.value, ' 担当作为监督', [
    { value: 24, name: '领导干部离任(选人用人)事项交接' },
    { value: 21, name: '容错免责申报情况' },
    { value: 21, name: '不担当不作为反映情况' }
  ])
  if (chart2) pieChartInstances.value.push(chart2)
  
  // 纪律作风督
const chart3 = createPieChart(pieChart3.value, ' 纪律作风监督', [
    { value: 25, name: '违法违纪情况' },
    { value: 40, name: '民主集中制落实情况' },
    { value: 25, name: '八项规定精神执行情况' },
    { value: 10, name: '“四风”问题' },
    { value: 25, name: '生活作风问题(含舆情、社会关系等)' },
    { value: 25, name: '亲属经商办企业情况' },
  ])
  if (chart3) pieChartInstances.value.push(chart3)
  
  // 选人用人监督
const chart4 = createPieChart(pieChart4.value, ' 选人用人监督', [
    { value: 43, name: '一报告两评议结果' },
    { value: 4, name: '选人用人专项检查' },
    { value: 45, name: '因私出国(境)情况' },
    { value: 8, name: '干部兼职、经商办企业情况' },
    { value: 25, name: '干部档案“三龄两历一身份”审核认定情况' },
  ])
  if (chart4) pieChartInstances.value.push(chart4)
  
  // 巡视巡查整改监督
const chart5 = createPieChart(pieChart5.value, '巡视巡查整改监督', [
    { value: 16, name: '省市县巡查反馈整改情况' },
    { value: 21, name: '县委选人用人专项检查整改情况' },
   
  ])
  if (chart5) pieChartInstances.value.push(chart5)
  
  // 信访等其他监督
const chart6 = createPieChart(pieChart6.value, '信访等其他监督', [
    { value: 73, name: '信访反映集中或有线索未查清' },
    { value: 27, name: '其他信息' }
  ])
  if (chart6) pieChartInstances.value.push(chart6)
}

// 初始化所有图表
const initAllCharts = () => {
  nextTick(() => {
    // 确保DOM已更新后再初始化图表
    setTimeout(() => {
      initBarChart()
      initPieCharts()
      
      // 添加窗口大小变化时的重绘
      window.addEventListener('resize', handleResize)
    }, 300)
  })
}

// 处理窗口大小变化
const handleResize = () => {
  if (barChartInstance.value) {
    barChartInstance.value.resize()
  }
  
  pieChartInstances.value.forEach(chart => {
    if (chart) chart.resize()
  })
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  // 当路由切换回概览页面时重新初始化图表
  if (newPath === '/' || newPath === '') {
    // 确保先清理现有实例
    disposeCharts()
    initAllCharts()
  } else {
    // 不在概览页时清理图表实例释放内存
    disposeCharts()
    // 移除resize监听器
    window.removeEventListener('resize', handleResize)
  }
})

onMounted(() => {
  // 初始化所有图表
  if (showDashboard.value) {
    initAllCharts()
  }
})
</script>

<style scoped>
.cadre-dashboard {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(247,248,250,1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.dashboard-main {
  display: flex;
  flex: 1;
  height: calc(100% - 60px);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.dashboard-content {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  box-sizing: border-box;
}

.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* 上部分布局：人员总览+监督情况总览 和 各单位排名 */
.top-modules {
  display: flex;
  gap: 16px;
  width: 100%;
}

/* 左侧：人员总览和监督情况总览整合模块 */
.overview-section {
  flex: 4;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.overview-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.card {
  flex: 1;
  min-width: calc(25% - 12px);
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  border: 1px solid #f0f0f0;
}

.supervision-container {
  display: flex;
  flex-direction: column;
}

/* 右侧：各单位排名模块 */
.ranking-module {
  flex: 1;
  max-width: 300px;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.ranking-section {
  flex: 1;
  overflow-y: auto;
}

/* 下部分：六类异常占比 */
.bottom-modules {
  width: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 16px;
  font-weight: normal;
  color: #333;
  margin: 0 0 12px 0;
}

.sub-section-title {
  font-size: 15px;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: normal;
}

/* 卡片样式 */
.card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
  font-size: 18px;
  margin-right: 12px;
}

.card-blue {
  background-color: #409EFF;
}

.card-purple {
  background-color: #9254de;
}

.card-orange {
  background-color: #E6A23C;
}

.card-light-blue {
  background-color: #67C23A;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 14px;
  color: #666;
}

.card-num {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 4px;
}

.card-suffix {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

:deep(.el-icon) {
  font-size: inherit;
}

.card-icon :deep(.el-icon) {
  font-size: 18px;
}

/* 图表样式 */
.chart-section {
  width: 100%;
  height: 300px;
}

.pie-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pie-row {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.pie-chart-container {
  flex: 0 0 30%;
  max-width: 30%;
  height: 220px;
  background: #fff;
  padding: 8px 0;
  margin-right: 20px;
}

/* 排名数字样式 */
.rank-num {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #666;
  font-size: 12px;
}

.rank-1 {
  background-color: #f5c855;
  color: #fff;
}

.rank-2 {
  background-color: #aab9c3;
  color: #fff;
}

.rank-3 {
  background-color: #c99466;
  color: #fff;
}

.rank-value {
  color: #409EFF;
  font-weight: 500;
}

/* 自定义Element UI表格样式 */
:deep(.el-table) {
  --el-table-header-bg-color: #f5f5f5;
  font-size: 13px;
  border: none;
}

:deep(.el-table__row) {
  height: 36px;
}

:deep(.el-table__header) {
  height: 36px;
}

:deep(.el-table th) {
  font-weight: normal;
  padding: 6px 0;
  font-size: 13px;
}

:deep(.el-table td) {
  padding: 4px 0;
}

/* 移除Element表格的边框 */
:deep(.el-table--border), 
:deep(.el-table--group),
:deep(.el-table td.el-table__cell), 
:deep(.el-table th.el-table__cell.is-leaf) {
  border-color: #f0f0f0;
}

:deep(.el-table--border::after), 
:deep(.el-table--group::after), 
:deep(.el-table::before) {
  background-color: transparent;
}

/* 排名模块内图片样式 */
.supervision-image-section {
  margin-top: 16px;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 10px;
}

.supervision-image {
  width: 100%;
  max-width: 280px;
  height: auto;
  border-radius: 4px;
  object-fit: contain;
}

/* 子页面容器 */
.router-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 响应式布局 */
@media (max-width: 1280px) {
  .top-modules {
    flex-direction: column;
  }
  
  .ranking-module {
    width: 100%;
  }
  
  .overview-cards {
    flex-wrap: wrap;
  }
  
  .card {
    min-width: calc(50% - 8px);
  }
}

@media (max-width: 1024px) {
  .dashboard-main {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: 300px;
  }
  
  .overview-cards {
    flex-wrap: wrap;
  }
  
  .card {
    min-width: calc(50% - 8px);
  }
  
  .chart-section {
    min-height: 250px;
  }
}
</style>