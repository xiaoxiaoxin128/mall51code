<template>
<!-- 新建一个用户权限列表  到index.js中配置路径 -->
<el-card class="box-card">
    <!-- 面包屑栏 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格  到method是中获取数据-->
    <!-- 固定表头 height="250"价格高 -->
     <el-table
     class="mtop"
      :data="list"
       height="250"
      style="width: 100%">
      <el-table-column
       type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
            <!-- 判断层级数字转换为几级菜单 -->
            <!-- scope.row.lvevl -->
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-if="scope.row.level === '1'">二级</span>
            <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  // 加载数据
  created() {
    this.loadTableData();
  },
  methods: {
    async loadTableData() {
      // 发送列表请求数据操作一次性设置授权token值数据
      // 在http.js中设置"代码拦截器"
      const res = await this.$http.get(`rights/list`);
      // 将获取的数据传给空的list就可以在视图中使用数据 了
      this.list = res.data.data;
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.mtop {
  margin-top: 20px;
}
</style>
