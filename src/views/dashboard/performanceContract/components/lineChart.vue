<template>
  <div class="lineChart" ref="lineChart" style="width:100%;height:250px"></div>
</template>
<script>
import echarts from "echarts";
import { numberReg } from "@/utils";

export default {
  props: {
    lineDataMap: {
      type: Object,
      default: () => {
        return {
          xAxis: [],
          normalData: [],
          axle: [],
        };
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    this.setOption();
  },
  watch: {
    lineDataMap: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.setOption();
        });
      },
      deep: true,
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.lineChart);
      this.resize = _.throttle(this.chart.resize, 100);
      window.addEventListener("resize", this.resize);
    },
    resizeChart() {
      setTimeout(() => {
        this.chart.resize();
      }, 10);
    },
    setOption(settingData) {
      let self = this;
      let options = {};
      var series = [];
      var obj = {};
      this.lineDataMap.xAxis.map((itemFalse) => {
        if (itemFalse.isShow == false) {
          obj[itemFalse.name] = false;
        }
      });
      this.lineDataMap.normalData.map((item, index) => {
        series.push({
          name: this.lineDataMap.xAxis[index].name,
          type: "line",
          symbol: "circle",
          symbolSize: 5,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1,
              },
              label: {
                show: true,
              },
            },
          },
          labelLine: {
            show: false,
          },
          animation: true,
          data: item,
          animationDuration: 2000,
        });
      });
      options = Object.assign(options, {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: function (params) {
            let str = moment(params[0].axisValue).format("YYYY-MM-DD") + "</br>";
            for (let index = 0; index < params.length; index++) {
              str =
                str +
                params[index].seriesName +
                ":" +
                params[index].data.volume +
                "</br>";
              if (params[index].seriesName !== "SO整体时效" && params[index].seriesName !== "PO整体时效" && params[index].seriesName !== "出库异常" && params[index].seriesName !== "跨境异常"&& params[index].seriesName !== "宅配异常"&& params[index].seriesName !== "宅配时效" && params[index].seriesName !== "采购下单异常"&& params[index].seriesName !== "发货异常"&& params[index].seriesName !== "到仓异常") {
                str =
                  str +
                  "支付数量" +
                  ": " +
                  params[index].data.paidOrderNum +
                  "</br>" +
                  "达标数量" +
                  ": " +
                  params[index].data.onTargetNum +
                  "</br>";
              }
            }
            return str;
          },
        },
        legend: {
          top: "20",
          show: true,
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          data: this.lineDataMap.xAxis,
          selected: obj,
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "0",
          containLabel: true,
        },
        label: {
          show: true,
          position: "top",
          textStyle: {
            color: "#00ca95",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: "black",
            },
          },
          axisTick: {
            show: true,
          },
          data: this.lineDataMap.axle,
        },
        yAxis: {
          type: "value",
          name: "",
          axisLabel: {
            formatter: "{value}",
          },
          axisLine: {
            lineStyle: {
              color: "#195384",
            },
          },
          axisTick: {
            show: true,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#11366e",
            },
          },
        },
        series: series,
      });
      this.chart.setOption(options, true);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>