<template>
<el-card>
  <my-bread level1="商品管理" level2="商品列表"></my-bread>
  <el-alert
    title="添加商品"
    type="success"
    center
    show-icon>
  </el-alert>
  <!-- 设置一个变量active  在methods中定义方法 -->
  <el-steps align-center class="xmtop" :space="200" :active="active*1" finish-status="success">
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>

</el-steps>
<!-- model 绑定数据form用于体检表单 -->
<!-- @tab-click="tabChange()"事件 在选中是触发 -->
<el-form :model="form" class="form">
  <el-tabs @tab-click="tabChange()" v-model = 'active' class="xmtop" tab-position="left">
    <el-tab-pane name="1" label="基本信息">基本信息
      <!-- 基本 信息里面的数据 -->
      <el-form-item label="商品名称">
        <el-input v-model="form.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="form.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品重量">
        <el-input v-model="form.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品数量">
        <el-input v-model="form.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        <!-- 此出我们需要的是个级联选择器 -->
        {{selectedOptions}}
        <el-cascader
          clearable
          expand-trigger="hover"
          :options="options"
          :props="defaultProp"
          v-model="selectedOptions"
          @Change="handleChange">
      </el-cascader>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane name='2' label="商品参数">
        <el-form-item :label="item1.attr_name" 
        v-for="item1 in dtParams" 
        :key="item1.attr_id"><br>
            <el-checkbox-group
            v-model="item1.attr_vals">
                <el-checkbox
                v-for="(item2,index) in item1.attr_vals"
                :key="index" border :label="item2"></el-checkbox>
            </el-checkbox-group>
        </el-form-item><br>
      
    </el-tab-pane>
    <el-tab-pane name="3" label="商品属性">商品属性

      <el-form-item :label="item.attr-name" 
      v-for="(item,index) in staticParams"
      :key="index">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>

    </el-tab-pane>
    <el-tab-pane name="4" label="商品图片">商品图片
      <el-form>
      <el-upload
      :headers="headers"
        action="http://localhost:8888/api/private/v1/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form>
    </el-tab-pane>
    <el-tab-pane name="5" label="商品内容">
       <el-button type="primary"
        @click="addGoods()"
        >添加商品</el-button>
        <!-- 富文本 -->
        <quill-editor class="quill" v-model="form.goods_introduce">
        </quill-editor>
    </el-tab-pane>
  </el-tabs>
  </el-form>
</el-card>
</template>

<script>
// 引入富文本插件
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"

import { quillEditor } from "vue-quill-editor"

export default {
  // 局部注册组件
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        // 以','分割的列表
        goods_cat: "",
        goods_introduce: "",
        // 上传图片的临时路径
        pics: [],
        // 商品的数组()
        ettrs: []
      },
      // 级联选择器的数据
      options: [],
      selectedOptions: [],
      // 级联选择器的配置值
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 多选框的数据
      // checkList: [],
      // 保存动态参数的数组
      dtParams: [],
      // 保存静态参数的数组
      staticParams: [],
      // 上传图片的头部设置
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    }
  },
  // 调用方法获取数据
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 添加商品`
    async addGoods() {
      // goods_cat
      this.form.goods_cat = this.selectedOptions.join(",")
      // attrs:[]
      //  {"attr_id":15,"attr_value":"ddd"},
      const arr1 = this.dtParams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      });
      const arr2 = this.staticParams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals }
      })
      // ES6 ...展开操作符
      this.form.attrs = [...arr1, ...arr2]
      const res = await this.$http.post(`goods`, this.form)
      console.log(res)
      const {
        meta: { status, msg }
      } = res.data
      if (status === 201) {
        this.$message.success(msg)
        // 回到商品列表
        this.$router.push({ path: "/goods" })
      } else {
        this.$message.warning(msg)
      }
    },
    // 图片上传前
    handleSuccess(response) {
      this.form.pics.push({
        pics: response.data.tmp_path
      })
    },
    // 图片上传
    handlePreview(file) {},
    // 移除图片
    handleRemove(file) {
      // 将当前图片从this.form.pics数组中移除
      // 找下标
      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      // console.log(Index)
      this.form.pics.splice(Index, 1)
    },
    // tab切换的时候触发
    async tabChange() {
      // 判断tab点击的是第几个判断几级分类操作
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择商品分类")
          return
        }
        const sel = this.active === "2" ? "many" : "only"
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=${sel}`
        )
        // 发送请求获取动态参数数据
        if (this.active === "2") {
          // 获取动态参数
          this.dtParams = res.data.data;
          this.dtParams.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.split(",")
          })
        } else {
          // 静态数组参数
          this.staticParams = res.data.data
        }
      }
    },
    // 获取三级分类的数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`)
      this.options = res.data.data
    },
    handleChange() {}
  }
}
</script>

<style>
.xmtop {
  margin-top: 20px;
  font-size: 14px;
}
.form {
  height: 450px;
  overflow: auto;
}
.quill {
  min-height: 300px;
}
</style>




