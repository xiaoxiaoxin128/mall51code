<template>
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 组件添加的按钮 -->
    <el-row>
        <el-col :span="24">
            <el-button type="primary" class="addbtn">添加按钮</el-button>
        </el-col>
    </el-row>
    <!-- 表格 请求的数据rolelist  到data下面-->
    <el-table :data="rolelist" style="width: 100%">
        <!-- 展开列type="expand" for 循环  加嵌套的操作-->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- el-row是行,el-coll列 -->
                <!-- 一级权限 -->
                <el-row class="level1" v-for="(item1, index) in scope.row.children" :key="index">
                    <el-col :span="4">
                        <!-- 输出的标签 @close   tab事件取消触发的事件-->
                        <el-tag @close="deleRole(scope.row, item1.id)" closable type="cussess">{{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <!-- 二级权限 -->
                    <el-col :span="20">
                        <el-row class="level2" v-for="(item2, index) in item1.children" :key="index">
                            <el-col :span="4">
                                <!-- @click="deleRole()绑定删除事件 去methods中实现 -->
                                <el-tag @close="deleRole(scope.row, item2.id)" type="info" closable>{{item2.authName}}</el-tag>
                                <i class="el-icon-loading"></i>
                                <!-- 三级权限 -->
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRole(scope.row, item3.id)" class="level3" closable type="error" v-for="(item3, index) in item2.children" :key="index">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row v-if="scope.row.children.length === 0">
                    未获取分配权限
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="#" type="index">

        </el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <!-- 给编辑按钮绑定一个事件showEditBox  到methods设置 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
                <!-- 设置分配角色的操作showRoleBox -->
                <el-button type="success" icon="el-icon-check" size="mini" @click="showSetRightDia(scope.row)" circle>
                </el-button>
                <!-- 删除点击的绑定showDeleBox -->
                <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
            </template>
        </el-table-column>
        <!-- 分配权限对画框的操作 -->
    </el-table>
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
        <template slot-scope="scope">
            <!-- 树状结构 -->
            <el-tree ref="tree" :data="treelist" :props="defaultProps" node-key="id" :default-expanded-keys="expandedArr" :default-checked-keys="checkedArr" show-checkbox>
                <!-- 默认为z展开的数组 -->
            </el-tree>
        </template>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <!-- setRight袖带权限的点击按钮 -->
                <el-button type="primary" @click="setRight()">确 定</el-button>
            </span>
    </el-dialog>

</el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogVisible: false,
      // 树形结构要用的数据
      treelist: [],
      defaultProps: {
        // children和authName是treelist的数组中用户的数据的key
        children: "children",
        label: "authName"
      },
      expandedArr: [], // 展开的默认id节点数组
      // 当前角色权限显示
      checkedArr: [],
      // 角Id赋值
      roleId: -1
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    // 修改权限  发送请求获取数据
    async setRight() {
      this.dialogVisible = false;
      // roles/:roleId/rights  roles 角色ID  rids权限Id列表
      // getchechedkeys(获取选中的id节点值)
      // gethalfcheckedKeys (获取半节点的id值)
      // 树形结构  el-tree
      // arr1就是我当前打钩的节点值
      const arr1 = this.$refs.tree.getCheckedKeys();

      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      // 操作符展开数组的每个元素
      const arr = [...arr1, ...arr2];
      console.log(arr);

      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res);
      // 判断输出结果,结构赋值操作
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.loadTableData();
      }
    },

    //  显示分配权限的对话框
    async showSetRightDia(role) {
      // 给权限ID赋值
      this.roleId = role.id;

      const res = await this.$http.get(`rights/tree`);
      this.treelist = res.data.data;

      //    expandeArr赋值的操作
      const arr = [];
      // 遍历数组

      res.data.data.forEach(item1 => {
        arr.push(item1.id);
        item1.children.forEach(item2 => {
          arr.push(item2.id);
          item2.children.forEach(item3 => {
            arr.push(item3.id);
          });
        });
      });
      // 默认展开数组
      // console.log(arr)
      this.expandedArr = arr;
      // 默认显示有权限的数组
      // this.checked = []
      const arrcheck = [];
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrcheck.push(item3.id);
          });
        });
      });
      this.checkedArr = arrcheck;
      this.dialogVisible = true;
      //  优化处理
    },
    //  实现点击按钮删除权限功能
    async deleRole(role, rightId) {
      //数据的路径 roles/:roleId/rights/:rightId
      // :roleId角色ID    rightId权限Id
      // 发送请求获取数据
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(res);
      // 删除成功刷新页面
      // 删除成功过刷新当前的children 删除后更新了children的值
      role.children = res.data.data;
    },
    async loadTableData() {
      // 获取数据
      const res = await this.$http.get(`roles`);
      // 将获取的数据传给空的list就可以在视图中使用数据 了
      // console.log(res)
      this.rolelist = res.data.data;
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.addbtn {
  margin-top: 20px;
}

.level1 {
  margin: 10px;
  margin-bottom: 10px;
}

.level2 {
  margin-bottom: 10px;
}

.level3 {
  margin-left: 5px;
}
</style>
