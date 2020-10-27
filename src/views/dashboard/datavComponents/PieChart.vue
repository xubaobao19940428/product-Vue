<template>
    <div class="pie-chart">
        <div ref="pieChart" style="height: 1.9rem;width: 100%;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            barData: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                chart: null,
                fontSize: '',
                labelFontSize: '',
                timer: null
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
                this.chart = echarts.init(this.$refs.pieChart)
                this.labelFontSize = localStorage.getItem('labelFontSize')
                this.fontSize = localStorage.getItem('fontSize')
                this.chart.getDom().style.height = this.$el.offsetHeight + 'px'
                this.chart.resize()
                window.addEventListener('resize', this.resize)
            },
            setOption () {
                if (this.chart) {
                    this.chart.clear()
                } else {
                    this.chart = echarts.init(this.$refs.pieChart)
                    this.chart.getDom().style.height = this.$el.offsetHeight + 'px'
                    this.chart.resize()
                }
                console.log(this.barData)
                console.log('-----')
                let settingData = this.barData

                var that = this
                let options = {
                    color: ['#13ce8c', '#fac167', '#f17f88', '#00ebff'],
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return `${params.name}:${params.data.num}`
                        },
                        textStyle: {
                            fontSize: that.labelFontSize
                        }
                    },

                    calculable: true,
                    series: [
                        {
                            name: '',
                            width: '50%',
                            height: '80%',
                            min: 0,
                            max: 100,
                            minSize: '0%',
                            maxSize: '95%',
                            type: 'pie',
                            radius: [that.fontSize * 0.3, '75%'],
                            center: ['50%', '50%'],
                            minAngle: 30,
                            labelLine: {
                                normal: {
                                    length: 5,
                                    length2: 25,
                                    lineStyle: {
                                        type: 'solid'
                                    }
                                }
                            },
                            label: {
                                normal: {
                                    formatter: (params) => {
                                        return `${params.name}${params.data.num}`
                                    },
                                    borderWidth: 0,
                                    borderRadius: 4,
                                    height: that.labelFontSize,
                                    textStyle: {
                                        fontSize: that.labelFontSize * 5 / 6
                                    },
                                    align: 'center',
                                    rich: {
                                        b: {
                                            fontSize: that.labelFontSize * 5 / 6,
                                            lineHeight: that.labelFontSize * 5 / 9
                                        },
                                        c: {
                                            fontSize: that.labelFontSize * 5 / 6,
                                            lineHeight: that.labelFontSize * 5 / 9
                                        }
                                    }
                                }
                            },
                            roseType: 'pie',
                            data: settingData,
                            animtion: true,
                            animationDUration: 1000
                        },
                        {
                            type: 'pie',
                            radius: ['10', '12'],
                            center: ['50%', '50%'],
                            data: [100],
                            label: {
                                show: false
                            },
                            animtion: true,
                            animationDUration: 1000
                        }
                    ]
                }
                this.chart.setOption(options, true)
            }
        },
        mounted: function () {
            this.initChart()
            this.setOption(this.barData, true)
        }
    }
</script>

<style lang="scss" scoped>
    .pie-chart {
        width: 100%;
        height: 100%;
        position: relative;
        .title {
            font-size: 13px;
            color: #fff;
            text-align: center;
        }
    }
</style>
