import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8888', // 后端服务器地址
  timeout: 10000, // 请求超时时间
  withCredentials: true // 允许携带cookie
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    // 例如添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 根据后端约定的状态码进行处理
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '服务器响应异常',
        type: 'error',
        duration: 5 * 1000
      })

      // 特定状态码处理
      if (res.code === 401) {
        // Token过期或未登录处理
        ElMessage({
          message: '登录已过期，请重新登录',
          type: 'warning'
        })
        // 可以在此处理重定向到登录页等逻辑
      }
      return Promise.reject(new Error(res.message || '服务器响应异常'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    ElMessage({
      message: error.message || '网络请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service