<template>
    <el-card class="member-active-card">
        <div slot="header" class="clearfix">
            <span>用户价值信息</span>
            <el-date-picker v-model="dateRange" type="daterange" size="mini" style="float: right;" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <el-table :data="memberValueInfo" border style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
            <el-table-column prop="" label="近30天订单数" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="" label="总订单数" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="" label="近30天消费额" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="" label="总消费额" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="" label="客单价" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="" label="活跃价值" align="center" header-align="center">
            </el-table-column>
        </el-table>
        <el-row class="chart-container">
            <el-col :span="8">
                <div class="pie-container">
                    <v-chart :options="consumeValuePie" ref="pie" autoresize />
                </div>
            </el-col>
            <el-col :span="16">
                <div class="line-container">
                    <v-chart :options="mamberSellLine" ref="line" autoresize />
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import echarts from 'echarts'
    import vChart from 'vue-echarts'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/custom'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/tooltip'
    export default {
        name: 'memberValueInfo',
        props: {},
        components: {
            vChart
        },
        data() {
            return {
                memberValueInfo: [],
                dateRange: '',
                consumeValuePie: {
                    title: {
                        text: '各品类消费占比',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['网红商品', '食品保健', '家居日用', '美妆饰品', '母婴用品']
                    },
                    series: [{
                        name: '消费占比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67'],
                        data: [{
                                value: 335,
                                name: '网红商品'
                            },
                            {
                                value: 310,
                                name: '食品保健'
                            },
                            {
                                value: 234,
                                name: '家居日用'
                            },
                            {
                                value: 135,
                                name: '美妆饰品'
                            },
                            {
                                value: 1548,
                                name: '母婴用品'
                            }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                },
                mamberSellLine: {
                    title: {
                        text: '用户日成交额',
                        x: 'center'
                    },
                    legend: {
                        data: ['折线图'],
                        x: '200px',
                        itemGap: 200,
                    },
                     xAxis: {
                        type: 'category',
                        data: ['20190912', '20190913', '20190914', '20190915']
                    },
                    yAxis: {
                        type: 'value',
                        max: 300,
                    },
                    series: [
                        {
                            data: [120, 200, 150, 80],
                            type: 'line',
                            name: '折线图',
                            symbolSize: 10 // 控制线条上 点 的大小
                        }
                    ]
                } 
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chart-container {
        height: 300px;
        padding: 14px;
        .pie-container, .line-container {
            height: 300px;
        }
    }
</style>


