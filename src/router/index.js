import Vue from 'vue'
import Router from 'vue-router'
// login页面的路由配置路径@自动锁定src文件夹
// 进入下面的router[]配置路由的跳转
import Login from '@/views/login'
Vue.use(Router)

export default new Router({
  // 定义路由,映射一个组件配置对象
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  }]
})
