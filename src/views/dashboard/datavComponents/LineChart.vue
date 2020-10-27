<template>
    <div class="line-chart">
        <div ref="lineChart" style="height: 100%;width: 100%;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            lineData: {
                type: Object,
                default: () => {
                    return { normal: [], time: [], gift: [] }
                }
            },
            labelFontSize: {
                type: Number,
                default: () => {
                    return 36
                }
            },
            fontSize: {
                type: Number,
                default: () => {
                    return 200
                }
            }
        },
        data () {
            return {
                chart: null,
                timer: null
            }
        },
        watch: {
            lineData: {
                handler (newVal, oldVal) {
                    this.initChart()
                    this.setOption(newVal)
                },
                deep: true
            },
            fontSize: {
                handler (newVal, oldVal) {
                    this.initChart()
                    this.setOption(this.lineData)
                },
                deep: true
            },
            labelFontSize: {
                handler (newVal, oldVal) {
                    console.log(newVal)
                    this.initChart()
                    this.setOption(this.lineData)
                },
                deep: true
            }
        },
        methods: {
            initChart () {
                this.chart = echarts.init(this.$refs.lineChart)
                this.chart.getDom().style.height = this.$el.offsetHeight + 'px'
                this.chart.resize()
                window.addEventListener('resize', this.resize)
            },
            setOption () {
                if (this.chart) {
                    this.chart.clear()
                } else {
                    this.chart = echarts.init(this.$refs.lineChart)
                    this.chart.getDom().style.height = this.$el.offsetHeight + 'px'
                    this.chart.resize()
                }
                let settingData = this.lineData
                var _that = this
                let options = {
                    // backgroundColor:'#11183c',
                    grid: {
                        left: 0.15 * _that.fontSize,
                        right: '10%',
                        top: 0.3 * _that.fontSize,
                        bottom: '15%',
                        containLabel: true
                    },
                    tooltip: {
                        show: true,
                        position: ['50%', '5%'],
                        trigger: 'axis',
                        formatter: function (data) {
                            if (data[0].data.change.indexOf('-') == 0) {
                                if (data[1].data.change.indexOf('-') == 0) {
                                    return `<p style="font-size:${_that.labelFontSize * 0.55}px">同比变化</p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">普通商品:<span style="color:#13ce8c"><i class="el-icon-bottom"></i>${data[0].data.change.substr(1)}</span></p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">礼包商品:<span style="color:#13ce8c"><i class="el-icon-bottom"></i>${data[1].data.change.substr(1)}</span></p>
									`
                                } else {
                                    return `<p style="font-size:${_that.labelFontSize * 0.55}px">同比变化</p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">普通商品:<span style="color:#13ce8c"><i class="el-icon-bottom"></i>${data[0].data.change.substr(1)}</span></p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">礼包商品:<span style="color:red"><i class="el-icon-top"></i>${data[1].data.change}</span></p>
									`
                                }
                            } else {
                                if (data[1].data.change.indexOf('-') == 0) {
                                    return `<p style="font-size:${_that.labelFontSize * 0.55}px">同比变化</p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">普通商品:<span style="color:red"><i class="el-icon-top"></i>${data[0].data.change}</span></p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">礼包商品:<span style="color:#13ce8c"><i class="el-icon-bottom"></i>${data[1].data.change.substr(1)}</span></p>
									`
                                } else {
                                    return `<p style="font-size:${_that.labelFontSize * 0.55}px">同比变化</p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">普通商品:<span style="color:red"><i class="el-icon-top"></i>${data[0].data.change}</span></p>
									<p style="font-size:${_that.labelFontSize * 0.55}px">礼包商品:<span style="color:red"><i class="el-icon-top"></i>${data[1].data.change}</span></p>
									`
                                }
                            }
                        }
                    },
                    legend: {
                        show: true,
                        x: 'center',
                        y: _that.fontSize * 3.8,
                        icon: 'stack',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: _that.labelFontSize * 5 / 6
                        },
                        data: ['普通商品', '礼包商品'],
                        itemWidth: _that.labelFontSize * 5 / 6,
                        itemHeight: _that.labelFontSize * 5 / 6,
                        itemGap: _that.labelFontSize
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                color: '#fff',
                                fontSize: _that.labelFontSize * 5 / 6
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#195384'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: '#195384'
                                }
                            },
                            data: settingData.time
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '',
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#fff',
                                    fontSize: _that.labelFontSize * 5 / 6
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#195384'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: '#11366e'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '普通商品',
                            type: 'line',
                            // stack: '总量',
                            symbol: 'circle',
                            symbolSize: 5,
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: _that.labelFontSize * 0.55
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#E2E166',
                                    lineStyle: {
                                        color: '#E2E166',
                                        width: 1
                                    },
                                    // areaStyle: {
                                    // 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    // 		offset: 0,
                                    // 		color: 'rgba(63, 220, 220, 0.1)'
                                    // 	}, {
                                    // 		offset: 1,
                                    // 		color: '#131a2d'
                                    // 	}])
                                    // },
                                    label: {
                                        show: true
                                    }
                                }

                            },
                            markPoint: {
                                itemStyle: {
                                    normal: {
                                        color: 'red'
                                    }
                                }
                            },
                            animation: true,
                            data: settingData.normal,
                            animationEasing: 'quinticInOut',
                            animationDuration: 2000
                        },
                        {
                            name: '礼包商品',
                            type: 'line',
                            // stack: '总量',
                            symbol: 'circle',
                            symbolSize: 5,
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: _that.labelFontSize * 0.55
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#00E2E0',
                                    lineStyle: {
                                        color: '#00E2E0',
                                        width: 1
                                    },
                                    // areaStyle: {
                                    // 		color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    // 		offset: 0,
                                    // 		color: 'rgba(63, 220, 220, 0.1)'
                                    // 	}, {
                                    // 		offset: 1,
                                    // 		color: '#131a2d'
                                    // 	}])
                                    // },
                                    label: {
                                        show: true
                                    }
                                }
                            },
                            animation: true,
                            data: settingData.gift,
                            animationDuration: 2000
                        }
                    ]
                }
                this.chart.setOption(options, true)
                console.log(settingData)
                if (settingData.time) {
                    setTimeout(() => {
                        this.chart.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 0, // 显示第几个series
                            dataIndex: settingData.time.length - 2 // 显示第几个数据
                        })
                    })
                }
            }
        },
        mounted: function () {
            this.initChart()
            this.setOption(this.lineData)
        }
    }
</script>

<style lang="scss" scoped>
    .line-chart {
        flex: 1;
        overflow: hidden;
    }
</style>
