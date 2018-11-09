<template>
<el-card class="box-card">
    <my-bread level1="订单管理" level2="订单列表"></my-bread>

    <el-table :data="list" border style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="180">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order-price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="120">
            <!-- 判断是否付款的操作 -->
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_pay==='0'" type="success">已付款</el-tag>
            <el-tag v-if="scope.row.order_pay==='1'" type="danger">未付款</el-tag>

          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
        </el-table-column>
        <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"
            size="mini" 
            plain circle @click="dialogFormVisible=true"></el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="省市区">
        <!-- 级联选择器 -->
        <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
        </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址">
      <el-input v-model="form.address" autocomplete="off"></el-input>

    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
</el-card>
</template>

<script>
// import options from '@assets/city_data2017_element.js'
import options from "@/assets/city_data2017_element.js";
export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      form: {
        address: ""
      },
      options: [],
      selectedOptions: []
    };
  },
  //  调用方法
  created() {
    // 省市县传值
    this.options = options;
    this.getData();
  },
  methods: {
    handleChange() {},
    async getData() {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=10`);
      console.log(res);
      //
      this.list = res.data.data.goods;
      // console.log(this.list)
    }
  }
};
</script>

<style>
.box-card {
  padding-bottom: 20px;
}
</style>
