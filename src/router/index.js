import Vue from 'vue'
import Router from 'vue-router'
// login页面的路由配置路径@自动锁定src文件夹
// 进入下面的router[]配置路由的跳转
import Login from '@/views/login'
// 配置home页面
import Home from '@/views/home'
// 配置用户列表组件User
import User from '@/views/user'
// 配置用户权限列表
import Rights from '@/views/rights'
// 配置角色列表
import Role from '@/views/role'
// 配置商品多个路径
import Cateparams from '@/views/cateparams'
import Goodscate from '@/views/goodscate'
import Goodslist from '@/views/goodslist'
import GoodsAdd from '@/views/goodsadd'
import Order from '@/views/order'
import Report from '@/views/report'

// 引入添加商品的列表

import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: User
    },
    {
      name: 'rights',
      path: '/rights',
      component: Rights
    },
    {
      name: 'roles',
      path: '/roles',
      component: Role
    },
    {
      name: 'goods',
      path: '/goods',
      component: Goodslist
    }, {
      name: 'params',
      path: '/params',
      component: Cateparams
    }, {
      name: 'categories',
      path: '/categories',
      component: Goodscate
    },
    {
      name: 'addgoods',
      path: '/goods/add',
      component: GoodsAdd
    },
    {
      name: 'orders',
      path: '/orders',
      component: Order
    },
    {
      name: 'reports',
      path: '/reports',
      component: Report
    }
    ]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }]
})

// 导航的路由守卫设置router提供的方法
// 在跳转前会触发拦截的操作

export default router

// 导航/路由 守卫
// 在跳转之前 会触发 (拦截)
router.beforeEach((to, from, next) => {
  console.log(to, from)
  //
  if (to.path === '/login') {
    next() //
  } else {
    const token = sessionStorage.getItem('token')

    if (!token) {
      router.push('/login')
      Message.success('请先登录')
      // next()
    } else {
      // Message.warning('进入到Home页')
      // router.push('/')
      next()
    }
  }
  next()
})
