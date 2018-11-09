<template>
<!-- 商品列表的页面 -->
<el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchArea">
        <el-col :span="24">
            <!-- 搜索框绑定数据操作搜索内容v-model   searchVal去data下面定义方法-->
            <el-input placeholder="请输入内容" class="searchInput" v-model="searchVal">
                <!-- 绑定一个点击数件,用于查询s搜索数据 -->
                <el-button slot="append" icon="el-icon-search" @click="checkUser()"></el-button>
            </el-input>
            <!-- 点击的添加用户时弹出添加操作绑定一个click按钮 -->
            <el-button type="success" @click="AddGoods()">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- 表格操作 -->
    <el-table v-loading="loading" :data='list' style="width: 100%">
        <el-table-column type="index" label='#' width='60'>
        </el-table-column>

        <el-table-column prop="goods_name" label='商品名称' width="350">
        </el-table-column>
        <el-table-column prop="goods_price" label='商品价格(元)' width="150">
        </el-table-column>

        <el-table-column prop="goods_weight" label='商品重量' width="150">
        </el-table-column>
        <el-table-column prop="create_time" label='创建日期' width="200">
            <!-- 创建日期的操作fmtDate -->
            <template slot-scope="scope">
                {{scope.row.create_time | fmtDate}}
            </template>
        </el-table-column>

        <el-table-column label='操作' width="120">
            <template slot-scope="scope">
                <!-- 给编辑按钮绑定一个事件showEditBox  到methods设置 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditBox(scope.row.id)" plain circle></el-button>
                <!-- 删除点击的绑定showDeleBox -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleBox(scope.row.id)" circle></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页操作 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[20, 40, 60, 80]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      // 分页数据相关变量声明
      pagesize: 20,
      // 多少页
      pagenum: 1,
      // 总数的声明再到下面去定义获取总数的条数
      total: 0,
      // 查询关键字搜索操作器methods中设置发送请求
      searchVal: ""
    };
  },
  created() {
    this.pagenum = 1;
    this.loadTableData();
  },

  methods: {
    // 显示添加商品的组件
    AddGoods() {
      // 修改标识,后去index中配合操作引入
      this.$router.push({
        name: "addgoods"
      });
    },
    // 分页的操作
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
      const res = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchVal
        }`
      );

      console.log(res);
      // 获取数据的总条数操作赋值
      this.total = res.data.data.total;
      // 获取数据信息赋值给list[]
      this.list = res.data.data.goods;
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
