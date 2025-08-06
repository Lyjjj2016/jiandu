<template>
  <div class="chart-container">
    <!-- 卡片布局 -->
    <div class="card-grid">
      <el-card
        v-for="(item, index) in tableData"
        :key="index"
        class="personnel-card"
        shadow="hover"
      >
        <div class="card-layout">
          <div class="card-info">
            <div class="card-header">
              <div class="user-info">
                <span class="personnel-name">{{ item.name }}</span>
              </div>
            </div>
            <div class="job-info">
              <div>{{ item.unit }}</div>
              <div>{{ item.jobNo }}</div>
              <div>
                <el-tag :type="item.warningStatus === '存在预警' ? 'danger' : 'success'" class="warning-status" size="small" round>
                  {{ item.warningStatus === '存在预警' ? '存在预警' : '无预警' }}
                </el-tag>
              </div>
              <div class="detail-button-container">
                <el-button type="primary" size="small" @click="handleView(item)" plain>查看详情</el-button>
              </div>
            </div>
          </div>
          <div class="radar-container">
            <div class="radar-chart" :id="`radar-chart-${index}`"></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onBeforeUnmount, nextTick, watch, ref } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent,
  TooltipComponent,
  LegendComponent,
  PolarComponent
} from 'echarts/components'

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PolarComponent,
  RadarChart,
  CanvasRenderer
])

const props = defineProps({
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

// 使用ref存储图表实例
const chartInstances = ref([]);

// 初始化雷达图方法
const initRadarCharts = () => {
  console.log('初始化雷达图', props.tableData.length)
  
  // 清理之前的图表实例
  chartInstances.value.forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.dispose();
    }
  });
  chartInstances.value = [];
  
  // 先销毁所有已存在的tooltip DOM
  document.querySelectorAll('.echarts-tooltip-custom').forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  
  props.tableData.forEach((item, index) => {
    const chartDom = document.getElementById(`radar-chart-${index}`)
    if (!chartDom) {
      console.error(`未找到雷达图容器: radar-chart-${index}`)
      return
    }
    
    const radarChart = echarts.init(chartDom)
    chartInstances.value.push(radarChart);
    
    // 使用从tableData传递的radarData，而不是生成随机数据
    const dataValues = item.radarData || [60, 60, 60, 60, 60, 60];
    
    const option = {
      animation: false,
      radar: {
        indicator: [
          { name: '政治监督', max: 100 },
          { name: '担当作为监督', max: 100 },
          { name: '纪律作分监督', max: 100 },
          { name: '选人用人监督', max: 100 },
          { name: '巡视巡查整改监督', max: 100 },
          { name: '信访等其他监督', max: 100 }
        ],
        shape: 'polygon',
        splitNumber: 3,
        center: ['50%', '52%'],
        radius: '88%',
        axisName: {
          show: false
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
              value: dataValues || [0, 0, 0, 0, 0, 0],
              name: '评分',
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                color: item.warningStatus === '存在预警' ? '#F56C6C' : '#409EFF',
                width: 2
              },
              areaStyle: {
                color: item.warningStatus === '存在预警' 
                  ? 'rgba(245, 108, 108, 0.2)' 
                  : 'rgba(64, 158, 255, 0.2)'
              },
              itemStyle: {
                color: item.warningStatus === '存在预警' ? '#F56C6C' : '#409EFF'
              }
            }
          ]
        }
      ],
      tooltip: {
        show: true,
        trigger: 'item',
        confine: false,
        appendToBody: true,
        className: 'echarts-tooltip-custom',
        formatter: function(params) {
          const dimensionNames = ['政治监督', '担当作为监督', '纪律作分监督', '选人用人监督', '巡视巡查整改监督', '信访等其他监督'];
          const values = params.value;
          let result = `<div style="font-weight:bold;margin-bottom:5px;">综合评分</div>`;
          
          for (let i = 0; i < dimensionNames.length; i++) {
            const color = params.color;
            result += `<div style="display:flex;justify-content:space-between;"><span>${dimensionNames[i]}:</span> <span style="font-weight:bold;color:${color}">${values[i]}</span></div>`;
          }
          
          return result;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); z-index: 9999 !important; pointer-events: none;',
        padding: [8, 12],
        position: function(point, params, dom, rect, size) {
          // 计算更合适的位置，确保tooltip在可视区域内
          const viewWidth = document.documentElement.clientWidth;
          const viewHeight = document.documentElement.clientHeight;
          const contentWidth = size.contentSize[0];
          const contentHeight = size.contentSize[1];
          
          // 基础位置：在点上方显示
          let x = point[0] - contentWidth / 2;
          let y = point[1] - contentHeight - 10;
          
          // 边界检查：确保不超出窗口范围
          if (x < 10) x = 10;
          if (x + contentWidth > viewWidth - 10) x = viewWidth - contentWidth - 10;
          if (y < 10) y = point[1] + 20; // 如果上方空间不足，则显示在点下方
          
          return [x, y];
        }
      }
    }
    
    try {
      radarChart.setOption(option, true);
      console.log(`雷达图 ${index} 设置成功`)
    } catch (error) {
      console.error('雷达图设置失败:', error)
    }
  });
  
  // 全局窗口大小变化时自适应调整所有图表大小
  window.addEventListener('resize', handleResize)
}

// 窗口大小变化时调整图表大小
const handleResize = () => {
  chartInstances.value.forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.resize();
    }
  });
}

// 监听数据变化
watch(() => props.tableData, () => {
  nextTick(() => {
    setTimeout(() => {
      initRadarCharts();
    }, 100);
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initRadarCharts();
    }, 100);
  });
  
  // 添加全局样式
  const globalStyle = document.createElement('style');
  globalStyle.innerHTML = `
    .echarts-tooltip-custom {
      z-index: 9999 !important;
      pointer-events: none;
    }
  `;
  document.head.appendChild(globalStyle);
})

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  // 清除所有图表实例
  chartInstances.value.forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.dispose();
    }
  });
  chartInstances.value = [];
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize);
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  padding: 0 10px;
}

.personnel-card {
  height: 190px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: visible;
}

.card-layout {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  padding-bottom: 0;
}

.card-info {
  width: 40%;
  padding-right: 10px;
}

.card-header {
  margin-bottom: 5%;
  height: 15%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.personnel-name {
  font-size: 1em;
  font-weight: bold;
}

.warning-status {
  font-size: 0.75em;
}

.job-info {
  margin-top: 10px;
  color: #666;
  font-size: 0.875em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.detail-button-container {
  margin-top: 0.2em;
}

.radar-container {
  width: 60%;
  height: 100%;
  position: relative;
}

.radar-chart {
  width: 110%;
  height: 110%;
  position: absolute;
  top: -5%;
  right: -5%;
  z-index: 2;
}

@media (max-width: 1600px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>