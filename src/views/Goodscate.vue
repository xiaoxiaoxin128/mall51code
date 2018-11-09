<template>
<!-- 商品分类列表 -->
<el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 组件添加的按钮 -->
    <el-row>
        <el-col :span="24">
            <el-button type="success" class="addbtn" @click="showAddGoodDia()">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- 编辑分类的对话框 -->
     <el-dialog title="添加分类" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editGoodcate()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 商品添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="分类" :label-width="formLabelWidth">
                {{selectedOptions}}
                <el-cascader change-on-select clearable expand-trigger='hove' :options="caslist" :props="defaultProp" v-model="selectedOptions">

                </el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <!-- 点击确定添加表单的信息提交addGoods   到 methods中添加方法-->
            <el-button type="primary" @click="addGoodCate()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 表格栏的操作 -->
    <el-table :data='list' style="width: 100%">
        <!-- <el-table-column prop="cat_name" label='分类名称' width='160'> -->
        <!-- </el-table-column> -->
        <!-- 三级表格的操作 -->
        <el-tree-grid prop="cat_name" label="名称分类" width="300" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children" :indenStSize="30">
        </el-tree-grid>

        <el-table-column prop="cat_level" label='级别' width="350">
            <!-- 级别操作 -->
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">一级</span>
                <span v-if="scope.row.cat_level===1">二级</span>
                <span v-if="scope.row.cat_level===2">三级</span>
            </template>
        </el-table-column>
        <el-table-column prop="cat_deleted" label='是否有效' width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-if="scope.row.cat_deleted===true">无效</span>
            </template>
        </el-table-column>
        <el-table-column label='操作' width="120">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" 
                size="mini" 
                @click="showEditBox(scope.row)" 
                plain circle>
                </el-button>
                <el-button 
                type="danger" 
                icon="el-icon-delete" 
                size="mini" 
                @click="showDeleBox(scope.row)" 
                circle>
                </el-button>
            </template>
        </el-table-column>
    </el-table>

</el-card>
</template>

<script>
// 导入三级表格插件组件扩展
const ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      list: [],
      // 对话框的显示与隐藏
      dialogFormVisibleAdd: false,
      // 编辑分类对话框的操作
      dialogFormVisibleEdit: false,
      // 宽度
      formLabelWidth: "150px",
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      // 级联选择器要用的数据
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  // 调用获取数据方法
  created() {
    this.loadTableData();
  },
  methods: {
    // 添加分类显示对话框
    async addGoodCate() {
      const res = await this.$http.put(`categories/${this.form.cat_id}`, {
        cat_name: this.form.cat_name
      });
    },

    // 删除分类,显示提示框
    showDeleBox(cat) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确定执行删除的操作指令
          const res = await this.$http.delete(`categories/;${cat.cat_id}`)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
            this.loadTableData()
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    // 显示对话框编辑分类发送请求
    async editGoodcate() {
      const res = await this.$http.put(`categories/${this.form.cat_id}`, {
        cat_name: this.form.cat_name
      })
      // console.log(res);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.$message.success(msg)
        this.loadTableData()
      }
    },
    // 编辑分类
    showEditBox(cat) {
      this.form.cat_name = cat.cat_name
      this.form.cat_id = cat.cat_id

      this.dialogFormVisibleEdit = true
    },
    // 点击添加事件,显示对话框
    async showAddGoodDia() {
      // 数据获取
      const res = await this.$http.get(`categories?type=2`)
      this.dialogFormVisibleAdd = true
      this.caslist = res.data.data
    },

    // 获取数据
    async loadTableData() {
      const res = await this.$http.get(`categories?type=3`)
      console.log(res)
      this.list = res.data.data
    }
  }
}
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
