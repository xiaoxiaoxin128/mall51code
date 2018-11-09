<template>
<!-- 面包屑+导航 -->
<el-card class="box-card">
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 注释的组件 -->
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="error" show-icon>
    </el-alert>
    <!-- 商品分类 -->
    <el-form class="form">
        <el-form-item label="请选择商品分类 ">
            <!-- {{selectedOptions}} -->
            <el-cascader clearable expand-trigger="hover" :options="options" :props="defaultProp" v-model="selectedOptions" @change="handleChange">
            </el-cascader>
        </el-form-item>
    </el-form>
    <!-- tab栏切换 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="1">
            <el-row>
                <!-- :disabled="btn"点击禁止切换 -->
                <el-col :span='24'>
                    <el-button @click="showDiaAddDyParams()" :disabled="btndisabled" type="success">设置动态参数

                    </el-button>

                </el-col>
            </el-row>
            <!-- 点击弹框 -->
            <el-dialog title="添加分类" :visible.sync="dialogFormVisibleadd">
                <el-form :model="form">
                    <el-form-item label="参数名称">
                        <el-input v-model="form.attr_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="值">
                        <el-input v-model="form.attr_vlas" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleadd = false">取 消</el-button>
                    <el-button type="primary" @click="addDyParams()">确 定</el-button>
                </div>
            </el-dialog>
            <!-- tab栏点击的显示动态参数的表格 -->
            <el-table :data="list" height="250" border style="width: 100%">
                <el-table-column type="expand" label="#" width="80">
                    <template slot-scope="scope">
                        <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row.attr_vals,scope.row,tag)">
                            {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)" @blur="handleInputConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="180">
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" plain circle @click="showEditBox(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" plain circle @click="showDeleBox(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
            <el-table height="250" border style="width: 100%">
                <el-table-column type="index" label="#" width="80">

                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="180">
                </el-table-column>
                <el-table-column prop="attr_vals" label="属性值" width="180">
                </el-table-column>

                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" plain circle @click="showEditBox(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" plain circle @click="showDeleBox(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      // 级联选择器的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      list: [],
      inputVisible: false,
      inputValue: "",
      //  添加按钮的响应
      btndisabled: true,
      //  添加参数的对话框的表单数据
      form: {
        attr_name: "",
        attr_sel: "many",
        attr_vals: ""
      },
      dialogFormVisibleadd: false
    };
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 点击按钮显示对话框
    showDiaAddDyParams() {
      this.dialogFormVisibleadd = true
    },
    // 添加点击对话框确定发送请求
    async addDyParams() {
      this.dialogFormVisibleadd = false
      const res = await this.$http.post(
        `categories/${this.selectedOptions[2]}/attributes`,
        this.form
      )
      this.getDyParams(); //刷新从新获取参数
    },
    //点击_newTag额按钮,触发下面的方法
    //   点击输入框,获取焦点
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //
    async handleInputConfirm(attr_vals, item) {
      let inputValue = this.inputValue
      if (inputValue) {
        // 点击标签添加数组
        attr_vals.push(inputValue);
        // 发送请求 categories/:id/attributes/:attrId
        const putData = {
          attr_name: item.attr_name,
          attr_sel: "many",
          attr_vals: attr_vals.join(",")
        }
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
          putData
        )
      }
      this.inputVisible = false
      this.inputValue = ""
    },
    // el-tag关闭
    async handleClose(attr_vals, item, tag) {
      // 编辑对画框提交参数categories/:id/attributes/:attrId
      // 删除数据
      attr_vals.splice(attr_vals.indexOf(tag), 1)
      const putData = {
        attr_name: item.attr_name,
        attr_sel: "many",
        attr_vals: attr_vals.join(",")
      }
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`,
        putData
      )
    },
    // 获取动态参数的数据
    async getDyParams() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      )
      this.list = res.data.data;
      console.log(this.list)
      this.list.forEach(item => {
        item.attr_vals =
          item.attr_vals.trim().length === 0
            ? []
            : item.attr_vals.trim().split(",")
      })
    },
    // tab切换时触发
    async handleClick() {
      if (this.activeName === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        this.staticlist = res.data.data
        console.log(this.staticlist)
      }
    },
    // 获取三级分类
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`)
      // console.log(res)
      this.options = res.data.data
      // console.log(this.options)
    },
    // 级联选择器改变时,会触发下面的方法
    handleChange() {
      // 有了三级菜单才开启点击
      this.btndisabled = false
      this.getDyParams()
    }
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
}

.form {
  height: 40px;
}
</style>
