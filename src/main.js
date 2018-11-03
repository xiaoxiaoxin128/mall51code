// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 引入moment插件
import moment from 'moment'

// 1.在此处的使用element插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入自定义网络请求的插件去下面的使用
import HttpTool from './pulign/http.js'
import App from './App'
import router from './router'

// 引入login的样式css操作
import '../src/assets/css/index.css'

// 1.1在此处执行Vue.use
Vue.use(ElementUI)
// 使用自定义网络请求插件去login中使用登录操作请求
Vue.use(HttpTool)

// 此处的是一个全局的过滤器moment插件,时间日期处理函数
// 设置后到user中设置日期函数操作
Vue.filter('fmtDate', function (v) {
  return moment(v).format('YYYY-MM-DD hh:mm:ss')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
