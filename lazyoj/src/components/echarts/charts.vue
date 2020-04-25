<template>
  <div
    ref="chartView"
    :style="{width: width, height: height, maxHeight: maxHeight, maxWidth: maxWidth}"
  ></div>
</template>

<script>
import echarts from "echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
export default {
  data() {
    return {
      chart: null
    };
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
      deep: true
    },
    width: {
      type: String,
      default() {
        return "100%";
      }
    },
    height: {
      type: String,
      default() {
        return "100%";
      }
    },
    maxWidth: {
      type: String,
      default() {
        return "100%";
      }
    },
    maxHeight: {
      type: String,
      default() {
        return "100%";
      }
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chartView);
    this.chart.setOption(this.options);
  },
  updated() {
    if (this.chart) {
      this.chart.resize();
    }
  },
  watch: {
    options: {
      handler(oldVal, newVal) {
        this.chart.setOption(newVal);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
</style>