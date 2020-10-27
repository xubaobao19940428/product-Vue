<template>
    <div class="bar-chart">
        <div ref="barChart" style="height: 4rem;width: 100%;"></div>
        <div class="data_num">
            <span v-for="(item,index) in barData.registerNum" :key="index">{{item}}</span>
        </div>
        <div class="data_num"><span v-for="(item,index) in barData.psNum" :key="index">{{item}}</span></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            barData: {
                type: Object,
                default: () => {
                    return {
                        time: [],
                        psNum: [],
                        registerNum: []
                    }
                }
            }
        },
        data () {
            return {
                chart: null,
                labelFontSize: '',
                fontSize: ''
            }
        },
        watch: {
            barData: {
                handler (newVal, oldVal) {
                    this.setOption(newVal)
                },
                deep: true
            }
        },
        methods: {
            initChart () {
                this.chart = echarts.init(this.$refs.barChart)
                this.resize = _.throttle(this.chart.resize, 100)
                window.addEventListener('resize', this.resize)
            },
            setOption () {
                if (this.chart) {
                    this.chart.clear()
                } else {
                    this.chart = echart.init(this.$refs.barChart)
                }
                let settingData = this.barData
                var that = this
                let options = {
                    // backgroundColor: '#00265f',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['注册', 'PS'],
                        orient: 'vertical',
                        bottom: '0',
                        align: 'left',
                        left: '0',
                        textStyle: {
                            color: '#fff',
                            fontSize: that.fontSize * 0.15
                        },
                        itemWidth: that.fontSize * 0.15,
                        itemHeight: that.fontSize * 0.15,
                        itemGap: that.fontSize * 0.15
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '15%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: settingData.time,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#195384',
                                width: 1,
                                type: 'solid'

                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: that.fontSize * 0.15
                            }
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff',
                            fontSize: that.fontSize * 0.15
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#195384',
                                // width: 1,
                                type: 'solid'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#063374'
                            }
                        }
                    }],
                    series: [{
                        name: '注册',
                        type: 'bar',
                        data: settingData.registerNum,
                        barWidth: 13, // 柱子宽度
                        barGap: 0.2, // 柱子之间间距
                        itemStyle: {
                            normal: {
                                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                //     offset: 0,
                                //     color: '#008cff'
                                // }, {
                                //     offset: 1,
                                //     color: '#005193'
                                // }]),
                                color: '#00c7db',
                                opacity: 1
                            }
                        },
                        animation: true,
                        animationDuration: 2000
                    }, {
                        name: 'PS',
                        type: 'bar',
                        data: settingData.psNum,
                        barWidth: 13,
                        barGap: 0.2,
                        itemStyle: {
                            normal: {
                                color: '#429afc',
                                opacity: 1
                            }
                        },
                        animation: true,
                        animationDuration: 2000
                    }]
                }
                this.chart.setOption(options, true)
            }
        },
        mounted: function () {
            this.labelFontSize = localStorage.getItem('labelFontSize')
            this.fontSize = localStorage.getItem('fontSize')
            this.initChart()
            this.setOption(this.barData)
        }
    }
</script>

<style lang="scss" scoped>
    .bar-chart {
        flex: 1;
        overflow: hidden;
        position: relative;
        .title {
            font-size: 13px;
            color: #fff;
            text-align: center;
        }
        .data_num{
            font-size: .10rem;
            position: relative;
            top: -.59rem;
            line-height: .275rem;
            /* left: .3rem; */
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-around;
            // width: 4.2rem;
            padding-left: .52rem;
        }
    }
</style>
