<template>
  <div>
    <Row :gutter="16">
      <i-col span="6">
        <Card :style="{background: '#2db7f5'}">
          <div :style="{textAlign: 'center'}">
            <h3>用户</h3>
            <h1>{{ usersNums }}</h1>
          </div>
        </Card>
      </i-col>
      <i-col span="6">
        <Card :style="{background: '#19be6b'}">
          <div :style="{textAlign: 'center'}">
            题目
            <h1>{{ problemNums }}</h1>
          </div>
        </Card>
      </i-col>
      <i-col span="6">
        <Card :style="{background: '#ff9900'}">
          <div :style="{textAlign: 'center'}">
            竞赛
            <h1>{{ contestNums }}</h1>
          </div>
        </Card>
      </i-col>
      <i-col span="6">
        <Card :style="{background: '#ed4014'}">
          <div :style="{textAlign: 'center'}">
            提交
            <h1>{{ solutionNums }}</h1>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row :style="{marginTop: '2rem'}">
      <i-col span="24">
        <Card>
          <v-chart :options="chartOption" height="500px" width="70%" :style="{margin: '0 auto'}"></v-chart>
        </Card>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">致谢</i-col>
    </Row>
  </div>
</template>

<script>
import chart from "../../../components/echarts/charts";
export default {
  data() {
    return {
      usersNums: 0,
      contestNums: 0,
      problemNums: 0,
      solutionNums: 0,
      chartOption: {
        title: {
          text: "提交数据统计"
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
        legend: {
          data: ["Submit", "Accept"]
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
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: []
          }
        ]
        ,
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "Submit",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: []
          },
          {
            name: "Accept",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: []
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    fetchData() {
      this.$axios.get("/api/user/count").then(res => {
        this.usersNums = res.data.data.count;
      });
      this.$axios.get("/api/problem/count").then(res => {
        this.problemNums = res.data.data.count;
      });
      this.$axios.get("/api/contest/count").then(res => {
        this.contestNums = res.data.data.count;
      });
      this.$axios.get("/api/solution/count").then(res => {
        this.solutionNums = res.data.data.count;
      });
      this.$axios.get("/api/solution/statistics").then(res => {
        this.chartOption.xAxis[0].data = [...Object.keys(res.data.data.total)]
        this.chartOption.series[0].data = []
        for (let i in res.data.data.total) {
          this.chartOption.series[0].data.push(res.data.data.total[i])
        }
        this.chartOption.series[1].data = []
        for (let i in res.data.data.accept) {
          this.chartOption.series[1].data.push(res.data.data.accept[i])
        }
      })
    }
  },
  mounted() {},
  updated() {},
  components: {
    "v-chart": chart
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>