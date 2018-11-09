<template>
<!-- 用户列表的组件操作 找到路由中配置路径router-->
<!-- 面包屑的导航栏 -->
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 加入格栅操作-->
    <el-row class="searchArea">
        <el-col :span="24">
            <!-- 搜索框绑定数据操作搜索内容v-model   searchVal去data下面定义方法-->
            <el-input placeholder="请输入内容" class="searchInput" v-model="searchVal">
                <!-- 绑定一个点击数件,用于查询s搜索数据 -->
                <el-button slot="append" icon="el-icon-search" @click="checkUser()"></el-button>
            </el-input>
            <!-- 点击的添加用户时弹出添加操作绑定一个click按钮 -->
            <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 添加用户框    dialogFormVisibleAdduser退出操作配置-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>

            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>

            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>

            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
            <!-- 点击确定添加表单的信息提交addUser   dao methods总添加方法-->
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑用户对话框显示渲染 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <!-- disabled = true禁止点击操作 -->
                <el-input disabled="true" v-model="formData.username" autocomplete="off"></el-input>

            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>

            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>

            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
            <!-- 点击确定添加表单的信息提交editUser   到 methods总添加方法-->
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 分配权限的输入框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleSetrole">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <!-- 直接用差值表达式渲染即可分配的用户名名字 -->
                {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <!-- 下拉框的操作组件 -->
                <el-select v-model="currRoleId">
                    <!-- 请选择 -->
                    <el-option disabled label="请选择" :value="-1">
                        <!-- 下拉框最终的值就是 -->
                    </el-option>
                    <el-option v-for="(item ,index) in roles" :label="item.roleName" :key="index" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleSetrole = false">取 消</el-button>
            <!-- 分配角色的确定按钮setrole   dao methods总添加方法-->
            <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 表格 -->
    <!-- 对应列的类型。如果设置了 selection 则显示多选框；
         如果设置了 index 则显示该行的索引（从 1 开始计算）
         如果设置了 expand 则显示为一个可展开的按钮 -->
    <!-- 次处的data='list会自动绑定下面的list[]空数组     -->
    <!-- v-loading="loading"页面加载等待的圈圈操作 -->
    <el-table v-loading="loading" :data='list' style="width: 100%">
        <el-table-column type="index" label='#' width='80'>
        </el-table-column>

        <el-table-column prop="username" label='姓名' width="150">
        </el-table-column>

        <el-table-column prop="email" label='邮箱' width="150">
        </el-table-column>

        <el-table-column prop="mobile" label='电话' width="120">
        </el-table-column>

        <el-table-column prop="create_time" label='创建日期' width="200">
            <!-- 创建日期的操作fmtDate -->
            <template slot-scope="scope">
                {{scope.row.create_time | fmtDate}}
            </template>

        </el-table-column>
        <!-- 单元格中的内容不是字符串,是开关组件按钮 -->
        <el-table-column label='用户状态' width="120">
            <!-- 组件开关要单独加一个template -->
            <!-- 此时的scope就是上面的data.list的每个元素{} -->
            <!-- slot-scope是固定的用来传值的 -->
            <!-- scope是随便来命名的 -->
            <template slot-scope="scope">
                <!-- 开关按钮组件赋值给v-model  后进行传值 -->
                <!-- scope.row就是list的每个元素.这里是{}scope.row.mg_state的值 -->
                <!-- changeSwitch事件数据改变触发函数 -->
                <el-switch @change="changeSwitchMgstate(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <!-- 编辑,删除,按钮组件 -->
        <el-table-column label='操作' width="200">
            <template slot-scope="scope">
                <!-- 给编辑按钮绑定一个事件showEditBox  到methods设置 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBox(scope.row.id)" plain circle></el-button>
                <!-- 设置分配角色的操作showRoleBox -->
                <el-button type="success" icon="el-icon-check" size="mini" @click="showRoleBox(scope.row)" circle></el-button>
                <!-- 删除点击的绑定showDeleBox -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleBox(scope.row.id)" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 修改分页操作 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      // 值为一个空数组用于下面的ueses赋值给list
      list: [],
      loading: false,
      // 分页数据相关变量声明

      currentPage: 1,
      // 条数
      pagesize: 2,
      // 多少页
      pagenum: 1,
      // 总数的声明再到下面去定义获取总数的条数
      total: 0,
      // 查询关键字搜索操作器methods中设置发送请求
      searchVal: "",
      // 添加用户的对话框操作
      dialogFormVisibleAdduser: false,
      // 需要请求的表单数据
      formData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 对话框中input的宽度
      formLabelWidth: "120px",
      // 编辑用户对话框属性
      dialogFormVisibleEdituser: false,
      // 分配权限操作
      dialogFormVisibleSetrole: false,
      // 当前用户名
      currUserName: "",
      currRoleId: -1,
      // 获取所有角色(主管/测试)
      roles: [],
      // 用户ID
      currUserId: -1
    };
  },
  // 调用方法数据
  created() {
    this.loadTableData();
  },

  // 获取数据的数据操作异步的操作async
  methods: {
    // 分配请求权限-发送请求

    async setRole() {
      // 发送请求标识users/id/role
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      const {
        meta: { status, msg }
      } = res.data;
      // 提示框
      this.$message.success(msg);
      // 关闭对话框
      this.dialogFormVisibleSetrole = false;
      // 重置
      this.currRoleId = -1;
    },
    // 分配权限 显示对话框 操作上面配置
    async showRoleBox(user) {
      // 获取用户的id
      this.currUserId = user.id;

      this.currUserName = user.username;
      // 显示分配权限框
      this.dialogFormVisibleSetrole = true;
      const res = await this.$http.get("roles");
      this.roles = res.data.data;

      const res2 = await this.$http.get(`users/${user.id}`);
      this.currRoleId = res2.data.data.rid;
    },
    // 编辑用户,点击确定提交修改的表单
    async editUser() {
      // 关闭隐藏对话框
      this.dialogFormVisibleEdituser = false;
      // 发送请求put
      const res = await this.$http.put(
        `users/${this.formData.id}`,
        this.formData
      );
      // 刷新视图
      this.loadTableData();
      // 提示
      this.$message.success(res.data.meta.msg);
    },
    // 编辑按钮显示对话框的操作
    async showEditBox(userId) {
      // 开启显示对话框
      this.dialogFormVisibleEdituser = true;
      // 发送请求
      const res = await this.$http.get(`users/${userId}`);
      // 获得请求的数据进行判断渲染
      this.formData = res.data.data;
    },
    // 添加用户的表单请求提交
    async addUser() {
      // 关闭对话框false关闭
      this.dialogFormVisibleAdduser = false;
      // 方法请求获取数据
      const res = await this.$http.post("users", this.formData);
      const {
        meta: { status, msg }
      } = res.data;
      // 刷新视
      this.loadTableData();
      // 提示框
      this.$message.success(msg);
      // 清空表单
      this.formData = {};
    },
    // 显示添加用户的方法操作
    showAddUserDia() {
      this.dialogFormVisibleAdduser = true;
    },
    // 显示删除提示框传一个值和与上面的showDateBox交互
    showDeleBox(userId) {
      this.$confirm("sure, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 此处删除操作要发送一个请求看接口文档
          const res = await this.$http.delete(`users/${userId}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            // 删除成功刷新类表
            this.loadTableData();
            this.$message({
              type: "success",
              message: msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: msg
          });
          console.log(msg);
        });
    },
    // 通过开关改变用户状态操作
    async changeSwitchMgstate(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      // console.log(res)
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        // 提示框显示
        this.$message.success(msg);
      }
    },
    // 查询用户搜索发送请求的方法
    checkUser() {
      this.loadTableData();
    },
    // 分页轩相关的方法
    handleSizeChange(val) {
      //  点击当前页发送请求
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.loadTableData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      // 点击请求将获取数据传给下面的pagenum
      this.loadTableData();
      // console.log(`当前页: ${val}`)
    },
    async loadTableData() {
      // 请求数据之前加载显示加载动画
      this.loading = true;
      // 除了登录功能, 其他功能的接口都需要加入token 才能请求
      // header添加token
      const AUTH_TOKEN = sessionStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // 查询的价格参数操作,query是查询参数
      const res = await this.$http.get(
        `users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchVal
        }`
      );
      console.log(res);
      // 获取数据的总条数操作赋值
      this.total = res.data.data.total;
      // 结构赋值将获取de数据进行渲然列表
      const {
        meta: { msg, status },
        data: { users }
      } = res.data;
      // 定义的msg必须要点输出一下不然会 报错
      console.log(msg);
      if (status === 200) {
        // 数据请求成功之后结束页面加载动画
        this.loading = false;
        // 列表数组
        this.list = users;

        // 重置获取的列表
        this.pagenum = 1;
        // this.pagesize = pagesize
        // this.currentPage = 1
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>
