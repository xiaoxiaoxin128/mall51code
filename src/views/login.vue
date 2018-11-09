<template>
<!-- 登录页面 -->
<!-- 操作表单提交的页面延时style -->
<div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px">
        <h2>用户登录</h2>
        <el-form-item label="用户名">
            <!-- 1.v-model要绑定数据去下面script中提供一个数据 -->
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <!-- input登录点击按钮 -->
        <!-- 设置按钮的样式style  -->
        <!-- 使用HttpTool网络请求插件操作登录页面提交操作 -->
        <el-button class="login-button" type="primary" @click="handleLoginin()">登录</el-button>
        <!-- 样式操作完成后找到路由index.js页面进行配置login.vue -->
    </el-form>
</div>
</template>

<script>
export default {
  data() {
    //  1.1 提供上面v-model的数据绑定
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    //   点击登录按钮触发post请求foemdata数据
    // async    aeait  执行异步的操作赋值给res直接操作
    async handleLoginin() {
      const res = await this.$http.post("login", this.formdata);
      //   console.log(res)
      //   .then(res => {
      const { meta } = res.data;
      if (meta.status === 200) {
        //   设置获取token信息令牌,操作每次登陆时候的效验
        const token = res.data.data.token;
        // 将token的信息存储在session里面
        sessionStorage.setItem("token", token);
        // 过去token的表示验证成功后,操作router配置跳转到home页面中
        this.$router.push("/");
        this.$message.success(meta.msg);
      } else {
        // 提示框
        this.$message.warning(meta.msg);
      }
    }
    // 判断用户输入的name是否存在输出提示框
  }
};
</script>

<style>
/* 操作login的css样式 */
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-button {
  width: 100%;
}
</style>
