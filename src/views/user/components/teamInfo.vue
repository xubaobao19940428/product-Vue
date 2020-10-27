<template>
    <el-card class="member-active-card">
        <div slot="header" class="clearfix">
            <span>团队信息</span>
        </div>
        <!-- <el-row class="" :gutter="20">
            <el-col :span="14">
                <div class="">
                    <table class="team-table">
                      <tr>
                        <td>近7天消费额</td>
                        <td>近30天消费额</td>
                        <td>直属成员</td>
                        <td>全部成员</td>
                      </tr>
                      <tr>
                        <td>123</td>
                        <td>3</td>
                        <td>12</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>SH</td>
                        <td>PS</td>
                        <td>AM</td>
                        <td>AT</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>2</td>
                        <td>4</td>
                        <td>6</td>
                      </tr>
                    </table>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="team-chart">
                    <v-chart :autoresize="false" id="chart1" :options="teamInfoChart"/>
                </div>
            </el-col>
        </el-row> -->
        <div class="parent-path-container">
            <h3><i class="el-icon-s-unfold"></i>上级链路</h3>
            <div class="path-list">
                <div v-for="(item, index) in chainList" :key="index" class="chain-item">
                    <team-item-card :itemData="item"></team-item-card>
                    <i v-if="!(chainList.length-1 === index)" class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
    import echarts from 'echarts'
    import vChart from 'vue-echarts'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/chart/custom'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/tooltip'
    import teamItemCard from './teamItemCard'
    export default {
        name: 'teamInfo',
        props: {
            teamInfo: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            chainList: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        components: {
            vChart,
            teamItemCard
        },
        data() {
            return {
                teamInfoChart: {
                    ready: false,
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)'
                    },
                    legend: {
                        data: ['SH', 'PS', 'AM', 'AT'],
                        bottom: 0
                    },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        label: {
                            normal: {
                                formatter: '{b}: {c} ({d}%)'
                            }
                        },
                        data: [{
                            name: 'SH',
                            itemStyle: {
                                normal: {
                                    color: '#67B9F1'
                                }
                            },
                            value: ''
                        }, {
                            name: 'PS',
                            itemStyle: {
                                normal: {
                                    color: '#01A293'
                                }
                            },
                            value: ''
                        }, {
                            name: 'AM',
                            itemStyle: {
                                normal: {
                                    color: '#F16798'
                                }
                            },
                            value: ''
                        }, {
                            name: 'AT',
                            itemStyle: {
                                normal: {
                                    color: '#6767F1'
                                }
                            },
                            value: ''
                        }]
                    }]
                },
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.teamInfoChart.series[0].data[0].value = 1;
                this.teamInfoChart.series[0].data[1].value = 3;
                this.teamInfoChart.series[0].data[2].value = 4;
                this.teamInfoChart.series[0].data[3].value = 5;
            }
        }
    }
</script>

<style lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
</style>

<style lang="scss" scoped>
.team-table{
    width: 100%;
    border-left: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    color: #444;
    font-size: 14px;
    border-spacing:0;
    text-align: center;
    td{
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
      padding: 16px;
    }
    tr:nth-child(2n+1) {
        background: #f5f7fa;
    }
}
.team-chart {
    height: 240px;
}

.parent-path-container {
    height: 300px;
    h3 {
        font-size: 14px;
        padding: 16px 0;
        i {
            font-size: 16px;
            padding: 0px 8px;
        }
    }

    .path-list {
        padding: 10px;
        display: -webkit-box;
        overflow: auto;
        i {
            font-size: 36px;
            padding: 100px 14px 0px;
        }
        .chain-item {
            display: inherit;
        }
    }
}
</style>


