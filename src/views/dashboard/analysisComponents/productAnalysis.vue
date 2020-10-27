<template>
  <div class="product_analysis">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
        <div style="padding-top:20px">
          <span style="font-size:20px;font-weight:900;line-height:20px">
            普货增长趋势
            <p style="color:#cccccc;font-size:12px">数据更新至{{todayTime1}}</p>
          </span>
        </div>
        <div>
          <el-form :model="formData" :inline="true" label-position="top" size="medium">
            <el-form-item label="一级品类">
              <el-select placeholder v-model="formData.data" @change="changeCategory">
                <el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="item.cateId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                style="margin-right:20px"
                v-model="formData.buildValue"
                type="daterange"
                value-format="timestamp"
                :picker-options="pickerOptions0"
                range-separator="~"
                @change="changeTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="国家">
              <el-button-group style="text-align:left">
                <el-button
                  v-for="(item,index) in buildCheckButton"
                  :key="index"
                  class="btn"
                  :class="{'isactive':isChange === index}"
                  @click="clickType(index,item.value)"
                >{{item.name}}</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
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
      <div class="noraml_pay_gmv" v-if="activeName!='5'">
        <div id="normal_gmv_line" ref="normalLineChart" style="width:100%;height:550px"></div>
      </div>
      <!--饼图-->
      <div class="normalproduct" v-else>
        <div class="pieData" style="width:50%;height:550px;" ref="pieChart"></div>
        <div class="pieData" style="width:50%;height:550px;" ref="pieChart1"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import { numberReg } from "@/utils";
// import {GetBackendLevelOneCategory} from '@/request/dataV'
export default {
  name: "productAnalysis",
  props: {
    originData: {
      type: Object,
      default: () => {
        return {
          xAxis: [],
          normalData: [],
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
    },
    cateList:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data() {
    var originDate = () => {
      var newDate = new Date();
      newDate.setMonth(0);
      newDate.setDate(1);
      return newDate.getTime();
    };
    return {
      activeName: "1",
      buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" }
      ],
      buildContentButton: [
        { name: "支付GMV", value: "1" },
        { name: "售出件数", value: "2" },
        { name: "件均价", value: "3" },
        { name: "商品动销", value: "4" },
        { name: "成交品类分布", value: "5" }
      ],
      isChange: 0,
      isContentChange: 0,
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() - 8.64e7 ||
            time.getTime() < originDate() - 8.64e7
          );
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
      todayTime1: "",
      formData: {
        data: "all",
        buildValue: [
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000 * 14 +
            1,
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000
        ]
      }
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
        if (newVal != 5) {
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
        dateTime: this.formData.buildValue,
        graphType: this.activeName,
        countryCode: this.buildType,
        cateOneId:this.formData.data
      });
    },
    changeTime(value) {
      this.$emit("on-build-up", {
        dateTime: this.formData.buildValue,
        graphType: this.activeName,
        countryCode: this.buildType,
        cateOneId:this.formData.data
      });
    },
    // tabs页面编写
    handleClick(index, value) {
      this.activeName = value;
      this.isContentChange = index;
      this.$emit("on-build-up", {
        dateTime: this.formData.buildValue,
        graphType: this.activeName,
        countryCode: this.buildType,
        cateOneId:this.formData.data
      });
    },
    changeCategory(value){
      this.$emit("on-build-up", {
        dateTime: this.formData.buildValue,
        graphType: this.activeName,
        countryCode: this.buildType,
        cateOneId:this.formData.data
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
    //统一曲线配置
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
                  if(this.activeName==4){
                    return numberReg(params.value)+'%'
                  }else{
                    return numberReg(params.value);
                  }
                  
                  // return params.value
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
            if (this.activeName == 1||this.activeName==2) {
              params.map((item, index) => {
                series += `
                      <p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}</p>
                      <p style="padding-left:10px">${this.activeName==1?'支付GMV':'售出件数'}:${this.activeName==1?'$':''}${numberReg(
                        params[index].data.value)
                      }</p>
                      <p style="padding-left:10px">占整体比:${
                        params[index].data.ratio
                      }</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>
                      `;
              });
              return series;
            } else if (this.activeName == 3) {
              params.map((item, index) => {
                series += `
                      <p>
                      <span style="display:inline-block;width:10px;height:10px;background:${
                        params[index].color
                      };border-radius:50%">
                      </span>${params[index].seriesName}</p>
                      <p style="padding-left:10px">件均价:${numberReg(
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
                      </span>${params[index].seriesName}</p>
                      <p style="padding-left:10px">商品动销率:${
                        params[index].data.volume+'%'
                      }</p>
                      <p style="padding-left:10px">环比增长率:${
                        params[index].data.change
                      }</p>
                       <p style="padding-left:10px">在架商品数:${
                        params[index].data.ratio
                      }</p>
                      `;
              });
              return series;
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
                  fontSize: 14
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
            animationEasing: "cabicOut",
            avoidLabelOverlap: true,
            // minAngle:'5',
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
            // minAngle:'5',
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
                  fontSize: 14
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
      n = n.toString();
      return n[1] ? n : "0" + n;
    },
    formatTime(number, format) {
      var formateArr = ["Y", "M", "D", "h", "m", "s"];
      var returnArr = [];

      var date = new Date(number);
      returnArr.push(date.getFullYear());
      returnArr.push(this.formatNumber(date.getMonth() + 1));
      returnArr.push(this.formatNumber(date.getDate()));

      returnArr.push(this.formatNumber(date.getHours()));
      returnArr.push(this.formatNumber(date.getMinutes()));
      returnArr.push(this.formatNumber(date.getSeconds()));

      for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
    },
    getTodayTime() {
      var todayTime = new Date().getTime() - 24 * 60 * 60 * 1000;
      this.todayTime1 = this.formatTime(todayTime, "Y/M/D");
      console.log(this.todayTime1);
    }
  },
  mounted() {
    this.initChart();
    this.setOptionNormalLine();
    this.getTodayTime();
  }
};
</script>

<style lang="scss" scoped>
.product_analysis {
  width: 100%;
  margin: 20px 0;
  .el-card {
    height: auto;
    .el-form-item {
      margin-bottom: 0;
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
    .pieData{
      flex:1;
    }
  }
  /* 下方表格 */
}
</style>
