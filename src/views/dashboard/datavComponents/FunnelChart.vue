<template>
    <div class="funnel-chart">
        <div ref="funnelChart" style="height: 100%;width: 100%;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            funnelData: {
                type: Array,
                default: () => {
                    return []
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
            funnelData: {
                handler (newVal, oldVal) {
                    this.setOption(newVal)
                },
                deep: true
            }
        },
        methods: {

            initChart () {
                this.chart = echarts.init(this.$refs.funnelChart)
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
                    this.chart = echarts.init(this.$refs.funnelChart)
                    this.chart.getDom().style.height = this.$el.offsetHeight + 'px'
                    this.chart.resize()
                }
                let settingData = this.funnelData
                var that = this
                let options = {
                    tooltip: {
                        show: false,
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    calculable: true,
                    series: [{
                        name: '',
                        type: 'funnel',
                        left: that.fontSize * 1.8,
                        // x2: 80,
                        top: that.fontSize * 0.27,
                        width: '60%',
                        height: '80%',
                        // height: {totalHeight} - y - y2,
                        min: 0,
                        max: 100,
                        minSize: '0%',
                        maxSize: '95%',
                        sort: 'none',
                        gap: 2,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                // formatter:
                                formatter: function (data) {
                                    return `${data.data.name}[${data.data.trueValue}]%`
                                },
                                textStyle: {
                                    fontSize: that.labelFontSize,
                                    color: '#ffffff'
                                }
                            },
                            emphasis: {
                                textStyle: {
                                    fontSize: that.labelFontSiz * 0.55
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    width: 0,
                                    type: 'solid'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 0
                            }
                        },
                        data: settingData,
                        animation: true,
                        animationDuration: 2000
                    }],
                    'color': ['#8b95ee', '#429afc', '#00c7db', '#76ecb7', '#e5fc87']
                }
                this.chart.setOption(options, true)
            }
        },
        mounted: function () {
            this.initChart()
            // this.setOption(this.funnelData)
        }
    }
</script>

<style lang="scss" scoped>
    .funnel-chart {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
</style>
