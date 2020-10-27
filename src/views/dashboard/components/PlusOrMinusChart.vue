<template>
    <div ref="chart" style="height: 570px; width:450;">
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        props: {
            chartData: {
                type: Array,
                default: () => { return [] }
            }
        },
        data() {
            return {
                chart: null,
            };
        },
        watch: {
            chartData: {
                handler(newVal, oldVal) {
                    console.log(newVal)
                    this.setOption();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$refs.chart);
                this.resize = _.throttle(this.chart.resize, 100);
                window.addEventListener('resize', this.resize);
            },
            setOption() {
                let self = this
                let options = {
                    tooltip : {
                        show: true,
                        trigger: 'item',
                        axisPointer : {
                            type : 'shadow'
                        },
                        formatter:function (params){
                            let str  = ''
                            str = '日期：' + params.data.date[0]+ '~' + params.data.date[0] + "</br>"+
                                  '指标：' + params.data.target + "</br>" +
                                  '本月累计：' + params.data.monthlyData +  "</br>" +
                                  '模块：' + params.data.module + "</br>" +
                                  '目标完成率：' + params.data.progress +"</br>" +
                                  '环比增长率：' + params.data.value + '%';
                            return  str ;
                        }
                    },
                    grid: {
                        top: 0,
                        bottom: 0
                    },
                    xAxis: {
                        axisLine: {
                            show: false
                        },
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                width: 1,
                                type:'solid',
                                color: ['#ebeef5']
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type:'solid'
                            }
                        },
                    },
                    series: [{
                        type: 'bar',
                        stack: '',
                        barWidth: 14,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                color: '#000',
                                formatter: function(item) {
                                    return item.value + '%'
                                }
                            }
                        },
                        itemStyle: {
                             normal: {
                                color: function (params){
                                    let color = '#e1575a'
                                    if (params.dataIndex > 6 ) {
                                        if (params.value > 0) {
                                            color = '#5aa150'
                                        } else {
                                            color = '#e1575a'
                                        }
                                    } else {
                                        if (params.value < 0) {
                                            color = '#5aa150'
                                        }
                                    }
                                    return color;
                                }
                            }
                        },
                        data: self.chartData
                    }]
                }
                this.chart.setOption(options);
            }
        },
        mounted: function() {
            this.initChart();
            this.setOption();
        }
    };
</script>

<style lang="scss" scoped>
    .bar-chart {
        height: 138px;
        position: relative;
        .title {
            font-size: 13px;
            color: #fff;
            text-align: center;
        }
    }
</style>
