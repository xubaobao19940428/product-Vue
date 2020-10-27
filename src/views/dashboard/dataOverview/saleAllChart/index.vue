<template>
  <div class="saleChartAll">
    <div class="saleHeader">
      <span>{{title}}</span>
      <span>
        <el-button-group>
          <el-button @click="clickType(0,'ALl')" class="btn" :class="{'isactive':isChange === 0}">
            <i class="iconfont">&#xe620;</i>
          </el-button>
          <el-button @click="clickType(1,'ALl')" class="btn" :class="{'isactive':isChange === 1}">
            <i class="iconfont">&#xe614;</i>
          </el-button>
          <el-button @click="clickType(2,'ALl')" class="btn" :class="{'isactive':isChange === 2}">
            <i class="iconfont">&#xe641;</i>
          </el-button>
        </el-button-group>
      </span>
    </div>
    <div class="saleContent">
      <div class="saleLine" ref="saleLine" style="width:100%;height:250px" v-if="isChange==0"></div>
      <div class="saleLine" ref="barChart" style="width:100%;height:250px" v-else-if="isChange==1"></div>
      <div class="saleTable" style="width:100%;height:250px;" v-else>
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          height="230"
          row-key="rowName"
          border
          :tree-props="{children: 'childRowData', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="rowName"></el-table-column>
          <el-table-column prop="data1" :label="title!='订单'?'下单GMV':'下单数'"></el-table-column>
          <el-table-column prop="data2" :label="title!='订单'?'支付GMV':'支付订单数'"></el-table-column>
          <el-table-column prop="data3" :label="title!='订单'?'收入':'有效订单数'"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { numberReg } from "@/utils";
export default {
  name: "saleAllChart",
  props: {
    originData: {
      type: Object,
      default: () => {
        return {
          xAxis: [],
          data: [],
          lenged: []
        };
      }
    },
    title: {
      type: String,
      default: "订单"
    },
    chartTitle: {
      type: String,
      default: "有效订单数"
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      leftChart: null,
      resizeLeftChart: null,
      barChart: null,
      resizeBarChart: null,
      isChange: 0,
      buildCheckButton: [
        { name: "&#xe614;", value: "All" },
        { name: "柱状", value: "MY" },
        { name: "表格", value: "TH" }
      ]
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.app.isCollapse;
    }
  },
  watch: {
    isChange: {
      handler(newVal, oldVal) {
        if (newVal == 0) {
          this.$nextTick(() => {
            this.initChart();
            this.setLeftCahrt();
          });
        } else if (newVal == 1) {
          this.$nextTick(() => {
            this.barChart = echarts.init(this.$refs.barChart);
            this.resizeBarChart = _.throttle(this.barChart.resize, 100);
            window.addEventListener("resize", this.resizeBarChart);
            window.addEventListener("resize", this.resizeBarChart);
            this.setOption();
          });
        } else {
          this.$nextTick(() => {
            if (this.barChart) {
              this.barChart.clear();
            }
            if (this.leftChart) {
              this.leftChart.clear();
            }
          });
        }
      },
      deep: true
    },
    originData: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.isChange == 0) {
            this.$nextTick(() => {
              this.initChart();
              this.setLeftCahrt();
            });
          } else if (this.isChange == 1) {
            this.$nextTick(() => {
              this.barChart = echarts.init(this.$refs.barChart);
              this.resizeBarChart = _.throttle(this.barChart.resize, 100);
              window.addEventListener("resize", this.resizeBarChart);
              window.addEventListener("resize", this.resizeBarChart);
              this.setOption();
            });
          }
        }
      },
      deep: true
    },
    isCollapse: {
      handler(newVal, oldVal) {
        setTimeout(() => {
          if (this.leftChart) {
            this.leftChart.resize();
          } else {
            window.addEventListener(
              "resize",
              () => {
                this.barChart.resize();
              },
              800
            );
          }
        }, 800);
      }
    }
  },
  methods: {
    //按钮切换点击事件
    clickType(index, value) {
      this.isChange = index;
    },
    initChart() {
      this.leftChart = echarts.init(this.$refs.saleLine);
      this.resizeLeftChart = _.throttle(this.leftChart.resize, 100);
      window.addEventListener("resize", this.resizeLeftChart);
      window.addEventListener("resize", this.resizeRightChart);
    },
    setLeftCahrt() {
      if (this.leftChart) {
        this.leftChart.clear();
      } else {
        this.leftChart = echarts.init(this.$refs.saleLine);
      }
      var series = [];
      this.originData.data.map((item, index) => {
        series.push({
          name: this.originData.lenged[index],
          type: "line",
          // stack: '总量',
          symbol: "circle",
          symbolSize: 5,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1
              },
              label: {
                show: true,
                formatter: function(params) {
                  return numberReg(params.value);
                }
              }
            }
          },
          labelLine: {
            show: false
          },
          animation: true,
          data: item,
          animationDuration: 1000
        });
      });
      let options = {
        title: {
          text: `${this.chartTitle}`,
          left: "center"
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "0",
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function(params) {
            var formatter = `<p>年月${params[0].axisValue}</p>`;
            params.map((item, index) => {
              formatter += `<p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}:${numberReg(
                params[index].data.value
              )}</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>
                      `;
            });
            return formatter;
          }
        },
        legend: {
          top: "20",
          show: true,
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          data: this.originData.lenged,
          selected: {
            CostGo: false,
            普货: false,
            礼包: false,
            充值业务:false
          }
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "black"
              }
            },
            axisTick: {
              show: true
            },
            data: this.originData.xAxis
          }
        ],
        yAxis: [
          {
            show: false,
            type: "value",
            name: "",
            axisLabel: {
              show: false,
              formatter: "{value}"
            },
            axisLine: {
              lineStyle: {
                color: "#195384"
              }
            },
            axisTick: {
              show: true
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#11366e"
              }
            }
          }
        ],
        /* dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ], */
        series: series
      };
      this.leftChart.setOption(options, true);
    },
    //柱状图
    setOption() {
      if (this.barChart) {
        this.barChart.clear();
      } else {
        this.barChart = echart.init(this.$refs.barChart);
      }
      let settingData = this.barData;
      var that = this;
      var series = [];
      this.originData.data.map((item, index) => {
        series.push({
          name: this.originData.lenged[index],
          type: "bar",
          barMinHeight: 10,
          itemStyle: {
            normal: {
              opacity: 1,
              label: {
                show: true,
                position: "top",
                formatter: function(params) {
                  return numberReg(params.value);
                }
              }
            }
          },
          labelLine: {
            show: false
          },
          animation: true,
          data: item,
          animationDuration: 2000
        });
      });
      let options = {
        title: {
          text: `${this.chartTitle}`,
          left: "center",
          top: "0"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: function(params) {
            var formatter = `<p>年月${params[0].axisValue}</p>`;
            params.map((item, index) => {
              formatter += `<p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}:${numberReg(
                params[index].data.value
              )}</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>
                      `;
            });
            return formatter;
          }
        },
        legend: {
          show: true,
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          data: this.originData.lenged,
          top: "20",
          selected: {
            CostGo: false,
            普货: false,
            礼包: false,
            充值业务:false
          }
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "40",
          bottom: "0",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.originData.xAxis,
            show: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#195384",
                width: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            show: false,
            axisTick: {
              show: true
            },
            axisLabel: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#195384",
                type: "solid"
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#063374"
              }
            }
          }
        ],
        series: series
      };
      this.barChart.setOption(options, true);
    }
  },
  mounted() {
    this.initChart();
    this.setLeftCahrt();
    console.log(this.title)
  }
};
</script>

<style lang="scss" scoped>
.saleChartAll {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .saleHeader {
    display: flex;
    justify-content: space-between;
  }
  .isactive {
    color: #409eff !important;
    background: #ecf5ff !important;
    border-color: #b3d8ff !important;
  }
  .btn {
    background: #fff;
    border: 1px solid #dcdfe6;
    padding: 5px;
  }
  /deep/ .el-table {
    position: absolute;
    top: 20px;
  }
}
</style>
