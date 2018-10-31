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
  data () {
    //  1.1 提供上面v-model的数据绑定
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    //   点击登录按钮触发post请求foemdata数据
    handleLoginin () {
      this.$http.post('login', this.formdata).then(res => {
        // console.log(res)
        // 判断用户输入的name是否存在输出提示框
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          // 提示框
          this.$message.warning(meta.msg)
        }
      })
    }
  }
}
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
