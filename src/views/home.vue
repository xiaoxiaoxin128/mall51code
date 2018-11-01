<template>
<!-- home的页面操作顶部栏 -->
<el-container class="container">
    <el-header class="header">
        <el-row>
            <!-- layout格栅布局操作 -->
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <img src="../assets/logo.png">
    </div>
            </el-col>
            <el-col :span="19" class="middle">
                <h2>电商后台管理系统</h2>
            </el-col>
            <!-- 操作退出的操作按钮click   loginout()   再到methods中添加方法-->
            <el-col :span="1"><a href='#' class="loginout" @click="loginout()">退出</a></el-col>
        </el-row>
    </el-header>
    <el-container>
        <!-- 左侧的导航栏操作 -->
        <el-aside class="aside" width="200px">
            <el-menu class="menu" default-active="2" :unique-opened='true' :router='true'>
                <!-- :此处会报错需要的的是一个布尔值,但是得到的是一个字符串,,要加: -->
                <!-- :unique-opened=true只保持一个子菜单操作 -->
                <!-- :router  开启路由模式,设置el-menu-item的index值为路由代替path跳转 -->
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户管理</span>
                    </template>
                    <!-- 此时的index标识代替path跳转 -->
                    <el-menu-item index="/users">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>用户列表</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>权限管理</span>
                    </template>
                    <!-- 此时的index标识代替path跳转 -->
                    <el-menu-item index="/role">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>角色列表</el-menu-item>
                    <!-- 此时的index标识代替path跳转 -->
                    <el-menu-item index="/right">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>权限列表</el-menu-item>
                </el-submenu>

                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>商品管理</span>
                    </template>
                    <el-menu-item index="3-1">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>商品列表</el-menu-item>
                    <el-menu-item index="3-2">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>参数分类</el-menu-item>
                    <el-menu-item index="3-3">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>商品分类</el-menu-item>
                </el-submenu>

                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>订单管理</span>
                    </template>
                    <el-menu-item index="4-1">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>订单管理</el-menu-item>
                </el-submenu>

                <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>数据统计</span>
                    </template>
                    <el-menu-item index="5-1">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>数据报表</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main class="main">Main</el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  // 设置组件加载之前的操作beforeCreate进行token的验证
  beforeCreate () {
    //   从session中获取token的值,判断
    const token = sessionStorage.getItem('token')

    if (!token) {
      // token不存在返回login页面
      this.$router.push('/login.vue')
      // 提示框
      this.$message.warning('请先登录')
    } else this.$message.warning('进入到home页')

    // token存在进行home页面的渲染
    this.$router.push('/')
  },
  // 判断用户token是否存在,登录进行/home的页面的渲染
  // !token的  回到login页面
  // 操作退出的方法添加
methods:{
   loginout() {
        // 1.清除session
        sessionStorage.clear()
        // 2.跳转  
        this.$router.push({name: 'login'})
        // 3.提示
        this.$message.success('退出成功')
    }
   }
 }
</script>

<style>
/* home页面的样式css操作 */
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
  height: 100%;
}

/* 头部样式 */
.header .middle {
  line-height: 60px;
  color: #fff;
  text-align: center;
}

.header .loginout {
  line-height: 60px;
  text-decoration: none;
}

/* 左侧栏的100% */
.menu {
  height: 100%;
}
</style>
