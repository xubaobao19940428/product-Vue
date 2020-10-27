<template>
  <div class="lineChart" ref="lineChart" style="width:100%;height:250px"></div>
</template>
<script>
import echarts from "echarts";

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
      let series = [];
      let obj = {};
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
          animationDuration: 2000
        });
      });
      options = Object.assign(options, {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          position: function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              var obj = {top: 60};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
          },
          formatter: function (params) {
            let str = moment(params[0].axisValue).format("YYYY-MM-DD") + "</br>";
            for (let index = 0; index < params.length; index++) {
              str =
                str +
                params[index].seriesName +
                ": " +
                (params[index].data.value) + '%' +
                "</br>" +
                "采购PO数量" +
                ": " +
                params[index].data.purchaseTotalNum +
                "</br>" +
                "取消PO数量" +
                ": " +
                params[index].data.cancelNum+
                "</br>"+
                "待采购PO占比" +
                ": " +
                params[index].data.yet2PurchaseData +
                "</br>"+
                "待发货PO占比" +
                ": " +
                params[index].data.yet2ShipData+
                "</br>"+
                "待入库PO占比" +
                ": " +
                params[index].data.yet2IncomeData +
                "</br>"+
                "入库异常待处理PO占比" +
                ": " +
                params[index].data.errorData +
                "</br>";
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
          show: false,
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