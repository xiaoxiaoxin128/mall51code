// 写一个自己的网络请求插件封装一个http插件
// 导出HttpTool操作 去main.js中导包使用
// export default HttpTool
import axios from 'axios'

const HttpTool = {}

HttpTool.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 添加一个代码拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么一次性设置token的授权
    const AUTH_TOKEN = sessionStorage.getItem('token')
    config.headers.common['Authorization'] = AUTH_TOKEN
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}

export default HttpTool
