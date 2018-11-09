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
            <el-menu class="menu" 
            :router='true' 
            :unique-opened='true' 
            default-active="1">
                <!-- :此处会报错需要的的是一个布尔值,但是得到的是一个字符串,,要加: -->
                <!-- :unique-opened=true只保持一个子菜单操作 -->
                <!-- :router  开启路由模式,设置el-menu-item的index值为路由代替path跳转 -->
                <!-- 使用路由守卫操作将每个导航的切换模式进行遍历循环 -->
                <!-- 报错要是的是字符串但是拿到的是一个数字解决 拼接一个+''就可以 -->
                <el-submenu 
                :index="index +''" 
                v-for="(item1, index) in menus" 
                :key="index">
                    <!-- 一级权限的展示 -->
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                    </template>
                    <!-- 二级权限的标识 -->
                    <!-- 此时的index标识代替path跳转 -->
                    <el-menu-item 
                    :index="'/'+item2.path" 
                    v-for="(item2, index) in item1.children" 
                    :key="index">
                        <!-- icon饿了吗自定义图标 -->
                        <i class="el-icon-menu"></i>
                            {{item2.authName}}
                    </el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>
        <el-main class="main">
            <!-- 设置一个用户列表的容器 -->
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  // 返回一个统一路由守卫配置的空数据请求成功后数据赋值
  data() {
    return {
      menus: []
    };
  },
  // 设置组件加载之前的操作beforeCreate进行token的验证
  beforeCreate() {
    //   从session中获取token的值,判断
    //     const token = sessionStorage.getItem('token')
    //     if (!token) {
    //       this.$message.warning('请先登录')
    //       // 提示框
    //       // token不存在返回login页面
    //       this.$router.push('/login')
    //     }else this.$message.warning('进入到Home页')
    //     // token存在进行home页面的渲染
    //     this.$router.push('/')
    // 判断用户token是否存在,登录进行/home的页面的渲染
    // !token的  回到login页面
    // 操作退出的方法添加
  },
  // 调用方法
  created() {
    this.getMenus();
  },

  methods: {
    // 使用路由守卫统一配置,获取动态左侧动态的选项路由配置
    async getMenus() {
      const res = await this.$http.get(`menus`);
      console.log(res);
      this.menus = res.data.data;
    },
    loginout() {
      // 1.清除session
      sessionStorage.clear();
      // 2.跳转
      this.$router.push({
        name: "login"
      });
      // 3.提示
      this.$message.success("退出成功");
    }
  }
};
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

/* // 操作完成后  新建一个用户列表页 */
</style>
