<template>
  <div class="build_up">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
        <div>
          <span style="font-size:20px;font-weight:900;line-height:20px">
            增长趋势
            <p style="color:#cccccc;font-size:12px">数据更新至{{todayTime1}}</p>
          </span>
        </div>
        <div>
          <el-date-picker
            style="margin-right:20px"
            v-model="buildValue"
            type="daterange"
            clearable
            value-format="timestamp"
            :picker-options="pickerOptions0"
            range-separator="~"
            @change="changeTime"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-button-group>
            <el-button-group style="padding: 3px 0">
              <el-button
                v-for="(item,index) in buildCheckButton"
                :key="index"
                class="btn"
                :class="{'isactive':isChange === index}"
                @click="clickType(index,item.value)"
              >{{item.name}}</el-button>
            </el-button-group>
          </el-button-group>
        </div>
      </div>
      <div>
        <el-button-group>
          <el-button-group style="padding: 3px 0">
            <el-button
              v-for="(item,index) in buildContentButton"
              :key="index"
              class="btn"
              :class="{'isactive':isContentChange === index}"
              @click="handleClick(index,item.value)"
            >{{item.name}}</el-button>
          </el-button-group>
        </el-button-group>
      </div>
      <!--下面的属性显示除了饼图统一处理-->
      <div class="noraml_pay_gmv" v-if="activeName!='6'">
        <div id="normal_gmv_line" ref="normalLineChart" style="width:100%;height:400px"></div>
      </div>
      <!--饼图-->
      <div class="normalproduct" v-else>
        <!-- <div id="normal_product" style="width:50%;height:400px" > -->
        <div class="pieData" style="width:50%;height:400px;" ref="pieChart"></div>
        <!-- </div> -->
        <!-- <div id="normal_product1" style="width:50%;height:400px" > -->
        <div class="pieData" style="width:50%;height:400px;" ref="pieChart1"></div>
        <!-- </div> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts/theme/macarons.js";
import "echarts/theme/vintage.js";
import { numberReg } from "@/utils";
// import salePayChart from './buildUpChart/salePayChart'
export default {
  name: "buildUp",
  // components:{
  //   salePayChart
  // },
  props: {
    originData: {
      type: Object,
      default: () => {
        return {
          xAxis: [
            {
              name: "整体",
              isShow: true
            },
            {
              name: "测试1",
              isShow: false
            },
            {
              name: "测试2",
              isShow: false
            },
            {
              name: "测试3",
              isShow: false
            }
          ],
          normalData: [
            [1, 2, 3],
            [4, 5, 6],
            [6, 7, 8],
            [8, 9, 10]
          ],
          axle: []
        };
      }
    },
    pieData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pieData1: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    var originDate=()=>{
      var newDate=new Date()
      newDate.setMonth(0)
      newDate.setDate(1)
      return newDate.getTime()
    }
    return {
      activeName: "1",
      buildValue: [
        new Date(new Date().toLocaleDateString()).getTime() -
          24 * 60 * 60 * 1000 * 13 -
          1,
        new Date(new Date().toLocaleDateString()).getTime() -
          24 * 60 * 60 * 1000
      ],
      buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" }
      ],
      buildContentButton: [
        { name: "支付GMV", value: "1" },
        { name: "支付订单数", value: "2" },
        // { name: "普货支付GMV", value: "3" },
        { name: "用户", value: "4" },
        { name: "DAU", value: "7" },
        { name: "商品", value: "5" },
        { name: "普货品类", value: "6" }
      ],
      isChange: 0,
      isContentChange: 0,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7||time.getTime() < (originDate()-8.64e7);
        }
      },
      buildType: "All",
      payLineChart: null,
      resizePayLineChart: null,
      normalLineChart: null,
      resizeNormalLineChart: null,
      pieChart: null,
      resizePieChart: null,
      pieChart1: null,
      resizePieChart1: null,
      todayTime1: ""
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.app.isCollapse;
    }
  },
  watch: {
    activeName: {
      handler(newVal, oldVal) {
        if (newVal != 6) {
          this.$nextTick(() => {
            this.setOptionNormalLine();
          });
        } else {
          this.$nextTick(() => {
            this.pieChart = echarts.init(this.$refs.pieChart);
            this.resizePieChart = _.throttle(this.pieChart.resize, 100);
            this.pieChart1 = echarts.init(this.$refs.pieChart1);
            this.resizePieChart1 = _.throttle(this.pieChart1.resize, 250);
            if (this.normalLineChart) {
              this.normalLineChart.clear();
            }
            this.pieChart.resize();
            window.addEventListener(
              "onorientationchange",
              this.resizePieChart1
            );
            window.addEventListener(
              "resize",
              () => {
                this.pieChart.resize();
                this.pieChart1.resize();
              },
              100
            );
            window.addEventListener("onorientationchange", this.resizePieChart);
            this.setPieChart();
            this.setPieChart1();
          });
        }
      }
    },
    isCollapse: {
      handler(newVal, oldVal) {
        setTimeout(() => {
          if (this.normalLineChart) {
            this.normalLineChart.resize();
          } else {
            window.addEventListener(
              "resize",
              () => {
                this.pieChart.resize();
                this.pieChart1.resize();
              },
              800
            );
          }
        }, 800);
      },
      deep: true
    },
    originData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.normalLineChart.resize();
          this.setOptionNormalLine();
        }
      },
      deep: true
    },
    pieData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.setPieChart();
        }
      }
    },
    pieData1: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.setPieChart1();
        }
      }
    }
  },
  methods: {
    
    //tabs按钮
    clickType(index, value) {
      this.isChange = index;
      this.buildType = value;
      this.$emit("on-build-up", {
        dateTime: this.buildValue,
        name: this.activeName,
        changeType: this.buildType
      });
    },
    changeTime(value) {
      this.$emit("on-build-up", {
        dateTime: this.buildValue,
        name: this.activeName,
        changeType: this.buildType
      });
    },
    // tabs页面编写
    handleClick(index, value) {
      this.activeName = value;
      this.isContentChange = index;
      this.$emit("on-build-up", {
        dateTime: this.buildValue,
        name: this.activeName,
        changeType: this.buildType
      });
    },
    /*
      支付两个公用一个line图
      */
    initChart() {
      //普获数据
      this.normalLineChart = echarts.init(this.$refs.normalLineChart);
      this.resizeNormalLineChart = _.throttle(this.normalLineChart.resize, 100);
      window.addEventListener("resize", this.resizeNormalLineChart);
      window.addEventListener(
        "onorientationchange",
        this.resizeNormalLineChart
      );
      //饼图
    },
    //后面曲线看看能不能都用一个曲线
    setOptionNormalLine() {
      if (this.normalLineChart) {
        this.normalLineChart.clear();
      } else {
        this.normalLineChart = echarts.init(this.$refs.normalLineChart);
      }
      var series = [];
      var obj = {};
      this.originData.xAxis.map(itemFalse => {
        if (itemFalse.isShow == false) {
          obj[itemFalse.name] = false;
        }
      });
      this.originData.normalData.map((item, index) => {
        series.push({
          name: this.originData.xAxis[index].name,
          type: "line",
          symbol: "circle",
          symbolSize: 5,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1
              },
              label: {
                show: true,
                formatter: params => {
                  return numberReg(params.value);
                }
              }
            }
          },
          labelLine: {
            show: false
          },
          markPoint: {
            data: [{ type: "max", name: "最大值" }]
          },
          animation: true,
          data: item,
          animationDuration: 2000
        });
      });
      let options = {
        grid: {
          left: "5%",
          right: "10%",
          bottom: "0",
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: params => {
            var series = `<p>${params[0].axisValue}</p>`;
            var seriesProduct = `<p>新上架商品数</p>
            <p>${params[0].axisValue}</p>
            `;
            if (this.activeName == 1 || this.activeName == 2) {
              params.map((item, index) => {
                series += `
                      <p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}:${numberReg(
                  params[index].data.value
                )}</p>
                      <p style="padding-left:10px">目标完成率:${
                        params[index].data.progress
                      }</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>
                      `;
              });
              return series;
            } else if (this.activeName == 3 || this.activeName == 7) {
              params.map((item, index) => {
                series += `
                      <p>
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
              return series;
            } else if (this.activeName == 4) {
              params.map((item, index) => {
                series += `
                      <p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}:${numberReg(
                  params[index].data.value
                )}</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>
                      <p style="padding-left:10px">注册日普货转化率:${
                        params[index].data.progress
                      }</p>
                      `;
              });
              return series;
            } else if (this.activeName == 5) {
              params.map((item, index) => {
                seriesProduct += `
                      <p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}:${numberReg(
                  params[index].data.value
                )}</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>`;
              });
              return seriesProduct;
            }
          }
        },
        legend: {
          orient: "vertical",
          right: "20",
          top: "20",
          show: true,
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          data: this.originData.xAxis,
          selected: obj
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

            data: this.originData.axle
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisLabel: {
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
        series: series
      };
      this.normalLineChart.setOption(options, true);
    },
    //第一个饼图
    setPieChart() {
      if (this.pieChart) {
        this.pieChart.clear();
      } else {
        this.pieChart = echarts.init(this.$refs.pieChart);
      }
      let options = {
        title: {
          text: "普货品类分布图（支付GMV)",
          left: "35%",
          bottom: "0"
        },
        tooltip: {
          trigger: "item",
          formatter: "支付GMV <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            bottom: 0,
            color: [
              "#67C671",
              "#8080FF",
              "#C280FF",
              "#F59A23",
              "#00BFBF",
              "#0096D7",
              "#7800D7",
              "#EC808D",
              "#0000FF",
              "#0066FF",
              "#CCCCCC"
            ],
            center: ["50%", "50%"],
            data: this.pieData,
            label: {
              position: "outer",
              alignTo: "none",
              bleedMargin: 5,
              // formatter: `{value|{b}}\n{d}%\n${numberReg('{c}')}`,
              formatter: function(params) {
                var str = numberReg(params.value.toString());
                return `{value|${params.name}}\n${params.percent}%\n${str}`;
              },
              rich: {
                value: {
                  fontSize: 14,
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: "#ffffff"
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 6,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            left: 0,
            right: 0,
            top: 20,
            bottom: 0,
            animation: true,
            animationDuration: 2000,
            animationEasing: "cabicOut"
          }
        ]
      };
      this.pieChart.setOption(options, true);
      // this.pieChart.resize()
    },
    //第二个饼图
    setPieChart1() {
      if (this.pieChart1) {
        this.pieChart1.clear();
      } else {
        this.pieChart1 = echarts.init(this.$refs.pieChart1);
      }
      let options = {
        title: {
          text: "普货品类分布图（售出件数)",
          left: "center",
          bottom: "0",
          textStyle: {
            color: "#333333",
            fontWeight: 900
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "售出件数 <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            color: [
              "#67C671",
              "#8080FF",
              "#C280FF",
              "#F59A23",
              "#00BFBF",
              "#0096D7",
              "#7800D7",
              "#EC808D",
              "#0000FF",
              "#0066FF",
              "#CCCCCC"
            ],
            center: ["50%", "50%"],
            data: this.pieData1,
            animation: true,
            animationDuration: 2000,
            animationEasing: "cabicOut",
            avoidLabelOverlap: true,
            label: {
              position: "outer",
              alignTo: "none",
              bleedMargin: 5,
              formatter: function(params) {
                var str = numberReg(params.value.toString());
                return `{value|${params.name}}\n${params.percent}%\n${str}`;
              },
              rich: {
                value: {
                  fontSize: 14,
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: "#ffffff"
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 6,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
          }
        ]
      };
      this.pieChart1.setOption(options, true);
    },
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      },
    formatTime(number,format) {

      var formateArr  = ['Y','M','D','h','m','s'];
      var returnArr   = [];

      var date = new Date(number);
      returnArr.push(date.getFullYear());
      returnArr.push(this.formatNumber(date.getMonth() + 1));
      returnArr.push(this.formatNumber(date.getDate()));

      returnArr.push(this.formatNumber(date.getHours()));
      returnArr.push(this.formatNumber(date.getMinutes()));
      returnArr.push(this.formatNumber(date.getSeconds()));

      for (var i in returnArr)
      {
        format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
      },
    getTodayTime(){
        var todayTime = new Date().getTime()-24*60*60*1000
       this.todayTime1 = this.formatTime(todayTime,'Y/M/D')
       console.log(this.todayTime1)
      },
  },
  mounted() {
    this.initChart();
    this.setOptionNormalLine();
    this.getTodayTime();
  }
};
</script>

<style lang="scss" scoped>
.build_up {
  width: 100%;
  margin: 20px 0;
  .el-card {
    height: auto;
    .el-button-group {
      margin-left: 10px;
    }
  }
  .isactive {
    color: #409eff !important;
    background: #ecf5ff !important;
    border-color: #b3d8ff !important;
  }
  .btn {
    background: #fff;
    border: 1px solid #dcdfe6;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background: #ffffff;
  }
  .payinfo {
    width: 100%;
    height: auto;
  }
  .noraml_pay_gmv {
    width: 100%;
    height: auto;
  }
  .normalproduct {
    display: flex;
    width: 100%;
    height: auto;
  }
  /* 下方表格 */
}
</style>
