<template>
    <!-- 封装面包屑栏操作 -->
   <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
// 父子组件传值
export default {
    name: 'my-bread',//自动定义名字
    props: ['level1','level2']
}
</script>

<style>

</style>
