<template>
  <div class="last_module">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="vertical-align: middle;font-size:14px;margin-right:10px">国家筛选:</span>
        <el-button-group>
          <el-button
            v-for="(item,index) in buildCheckButton"
            :key="index"
            @click="clickType(index,item.value)"
            class="btn"
            :class="{'isactive':isChange === index}"
          >{{item.name}}</el-button>
        </el-button-group>
      </div>
      <div class="content">
        <div class="content_left">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-card shadow="always" class="card_bottom">
                <div class="card_content">
                  <div class="card_bottom_left">
                    <i class="iconfont" style="font-size: 40px;line-height: 60px;">&#xe617;</i>
                  </div>
                  <div class="card_bottom_right">
                    <div class="header">
                      <span>总收入 ($)</span>
                      <span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="累计至昨日，Fingo平台用户交易产生的支付GMV减去退款金额"
                          placement="top"
                        >
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="bottom_content" v-if="countryData.length!=0">{{countryData[0].volume}}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="always" class="card_bottom">
                <div class="card_content">
                  <div class="card_bottom_left">
                    <i class="iconfont" style="font-size: 40px;line-height: 60px;">&#xe61b;</i>
                  </div>
                  <div class="card_bottom_right">
                    <div class="header">
                      <span>总有效订单数 (单)</span>
                      <span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="累计至昨日，Fingo平台用户交易产生的支付订单数减去整单退的订单数"
                          placement="top"
                        >
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="bottom_content" v-if="countryData.length!=0">{{countryData[1].volume}}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="always" class="card_bottom">
                <div class="card_content">
                  <div class="card_bottom_left">
                    <i class="el-icon-user-solid" style="font-size: 40px;line-height: 60px;"></i>
                  </div>
                  <div class="card_bottom_right">
                    <div class="header">
                      <span>总注册用户数 (人)</span>
                      <span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="累计至昨日，Fingo平台注册成功的用户数"
                          placement="top"
                        >
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="bottom_content" v-if="countryData.length!=0">{{countryData[2].volume}}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-card shadow="always" class="card_bottom">
                <div class="card_content">
                  <div class="card_bottom_left">
                    <i class="el-icon-goods" style="font-size: 40px;line-height: 60px;"></i>
                  </div>
                  <div class="card_bottom_right">
                    <div class="header">
                      <span>总支付用户数 (人)</span>
                      <span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="累计至昨日，在Fingo平台产生过支付订单的用户数"
                          placement="top"
                        >
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="bottom_content" v-if="countryData.length!=0">
                      <span>{{countryData[3].volume}}</span>
                      <p style="font-size:12px;color:#cccccc" >占总用户数{{countryData[3].ratio}}</p>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="always" class="card_bottom">
                <div class="card_content">
                  <div class="card_bottom_left">
                    <i class="iconfont" style="font-size: 40px;line-height: 60px;">&#xe61f;</i>
                  </div>
                  <div class="card_bottom_right">
                    <div class="header">
                      <span>普货支付用户数 (人)</span>
                      <span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="累计至昨日，在Fingo平台产生过普货支付订单的用户数"
                          placement="top"
                        >
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="bottom_content" v-if="countryData.length!=0">
                      <span >{{countryData[4].volume}}</span>
                      <p style="font-size:12px;color:#cccccc" >占总用户数{{countryData[4].ratio}}</p>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="always" class="card_bottom">
                <div class="card_content">
                  <div class="card_bottom_left">
                    <i class="iconfont" style="font-size: 40px;line-height: 60px;">&#xece4;</i>
                  </div>
                  <div class="card_bottom_right">
                    <div class="header">
                      <span>总会员数 (人)</span>
                      <span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="累计至昨日，成为Fingo平台会员的用户数"
                          placement="top"
                        >
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="bottom_content" v-if="countryData.length!=0">
                      <span >{{countryData[5].volume}}</span>
                      <p style="font-size:12px;color:#cccccc" >占总用户数{{countryData[5].ratio}}</p>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="content_right">
          <el-card shadow="always" style="height:220px;" class="content_bottom">
            <div style="width:100%;height:220px" ref="pieChart"></div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/theme/macarons.js'
    export default {
        name: 'lastModule',
        props: {
            countryData: {
                type: Array,
                default: () => {
                    return []
                }
            },
            allNum: {
                type: String,
                default: '0'
            },
            allCountryData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data () {
            return {
                buildCheckButton: [
                    { name: '合计', value: 'All' },
                    { name: 'MY', value: 'MY' },
                    { name: 'TH', value: 'TH' },
                    { name: 'SG', value: 'SG' },
                    { name: 'ID', value: 'ID' }
                ],
                isChange: 0,
                pieChart: null,
                resizePieChart: null
            }
        },
        computed: {
            isCollapse () {
                return this.$store.state.app.isCollapse
            }
        },
        watch: {
            allCountryData: {
                handler (newVal, oldVal) {
                    this.setPieChart()
                },
                deep: true
            },
            isCollapse: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        setTimeout(() => {
                            window.addEventListener(
                                'resize', this.pieChart.resize(), 800)
                        }, 100)
                    }
                },
                deep: true
            }
        },
        methods: {
            clickType (index, value) {
                this.isChange = index
                this.$emit('on-country-data', value)
            },
            initChart () {
                this.pieChart = echarts.init(this.$refs.pieChart, 'macarons')
                this.resizePieChart = _.throttle(this.pieChart.resize, 100)
                window.addEventListener('resize', this.resizePieChart)
                window.addEventListener(
                    'onorientationchange',
                    this.resizeNormalLineChart
                )
            },
            setPieChart () {
                if (this.pieChart) {
                    this.pieChart.clear()
                } else {
                    this.pieChart = echarts.init(this.$refs.pieChart, 'macarons')
                }
                let options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    graphic: {
                        // 图形中间文字
                        type: 'text',
                        left: 'center',
                        top: '45%',
                        style: {
                            text: `总用户数\n${this.allNum}`,
                            textAlign: 'center',
                            fill: 'black',
                            fontSize: 16
                        }
                    },
                    series: [
                        {
                            name: '总用户数',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '55%'],
                            minAngle: 10,
                            width: '60%',
                            height: '60%',
                            avoidLabelOverlap: true,
                            label: {
                                position: 'outer',
                                formatter: '{value|{b}} {d}%\n{c}',
                                textStyle: {
                                    color: '#666666',
                                    fontSize: 12
                                },
                                rich: {
                                    align: 'bottom',
                                    value: {
                                        fontSize: 12,
                                        color: 'black'
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: true,
                                smooth: 0.2,
                                length: 5,
                                length2: 10
                            },
                            data: this.allCountryData
                        }
                    ]
                }
                this.pieChart.setOption(options, true)
            }
        },
        mounted () {
            this.initChart()
            this.setPieChart()
        }
    }
</script>

<style lang="scss" scoped>
.last_module {
  width: 100%;
  height: auto;
  .isactive {
    color: #409eff !important;
    background: #ecf5ff !important;
    border-color: #b3d8ff !important;
  }
  .btn {
    background: #fff;
    border: 1px solid #dcdfe6;
  }
  .content {
    width: 100%;
    height: 250px;
    display: flex;
    .content_left {
      width: 75%;
      .card_content {
        display: flex;
        .card_bottom_left {
          width: 20%;
          line-height: 50px;
          text-align: center;
          font-size: 25px;
        }
        .card_bottom_right {
            flex:1;
          .header {
            display: flex;
            justify-content: space-between;
            color: #c1c1c1;
          }
          .bottom_content {
            font-size: 30px;
            color: rgba(0, 0, 0, 0.847058823529412);
            margin-top: 5px;
          }
        }
      }
    }
    .content_right {
      width: 25%;
      margin-left: 20px;
      height: 220px;
    }
    .card_bottom {
      height: 100px;
      margin-bottom: 20px;
    }
    /deep/ .content_bottom{
      .el-card__body{
        padding:0;
      }
    }
  }
}
</style>
