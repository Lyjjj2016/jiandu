import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PageView from '../views/PageView.vue'
import PersonnelWarningView from '../views/PersonnelWarningView.vue'
import ImportView from '../views/ImportView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        // 预警主页 - 概览（默认显示在主页）
        {
          path: '',
          name: 'overview',
          meta: { title: '概览' }
        },
        
        // 人员预警信息查询
        {
          path: 'personnel-warning',
          name: 'personnel-warning',
          component: PersonnelWarningView,
          meta: { title: '人员预警信息' }
        },
        
        // 数据导入
        {
          path: 'import-personnel',
          name: 'import-personnel',
          component: ImportView,
          meta: { title: '信息导入' }
        },
        {
          path: 'export-data',
          name: 'export-data',
          component: PageView,
          meta: { title: '数据导出' }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
