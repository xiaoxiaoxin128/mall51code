import Vue from 'vue'
import Router from 'vue-router'
// login页面的路由配置路径@自动锁定src文件夹
// 进入下面的router[]配置路由的跳转
import Login from '@/views/login'
import Home from '@/views/home'
// 配置用户列表组件User
import User from '@/views/user'

Vue.use(Router)

export default new Router({
  // 定义路由,映射一个组件配置对象
  routes: [{
    path: '/',
    component: Home,
    // user用户列表要在home里面配置
    children: [
      {
        // 此时的home中 router 开启的index标识点击会自动跳转
        name: 'users',
        path: '/users',
        component: User}
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  }]
})
