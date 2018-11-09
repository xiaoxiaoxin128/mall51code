<template>
<el-card>
  <my-bread level1="数据统计" level2="数据报表"></my-bread>

    <div id="main"
    ref="main"
    style="width: 600px;height:400px;"></div>

</el-card></template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      option1: []
    };
  },
  mounted() {
    this.loadEcharts();
  },
  methods: {
    async loadEcharts() {
      console.log(this.$refs);

      var myChart = echarts.init(this.$refs.main);
      // 获取数据
      // 接口文档 1.11.3.
      // reports/:type   'reports/type=3
      const res = await this.$http.get(`reports/type/1`);
      // console.log(res)
      this.option1 = res.data.data;

      const option2 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };

      // console.log(this.option1);
      // ...操作符
      // ...array
      // ...obj
      const option = { ...this.option1, ...option2 };
      // console.log(option)

      var obj = {
        name: "abc"
      };
      var obj1 = { ...obj };
      // 注意: obj和obj1不是同一个指针 指向了不同内存空间
      console.log(obj === obj1);

      // var arr = [1, 2, 3]
      // var arr2 = [...arr]

      myChart.setOption(option);
    }
  }
};
</script>
<style>
/* // 1. html提供容器
// 2. js init (DOM容器)
// 3. 配置数据
// 4. 使用数据 setOption()

// ...arr ...obj
// -> 内存 指针
// 面试用 prototype
// 排序算法 (冒泡/快排/桶排/插入排序)
// 算法导论
// 数据结构
// -> */
</style>