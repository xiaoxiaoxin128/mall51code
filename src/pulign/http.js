// // 写一个自己的网络请求插件封装一个http插件
// import axios from 'axios'

// const HttpTool = {}

// HttpTool.install = (Vue) => {
//   axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

//   Vue.prototype.$http = axios
// }
// // 导出HttpTool操作 去main.js中导包使用
// export default HttpTool
import axios from 'axios'

const HttpTool = {}

HttpTool.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  Vue.prototype.$http = axios
}

export default HttpTool
