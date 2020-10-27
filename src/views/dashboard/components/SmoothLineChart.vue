<template>
    <div class="line-chart">
        <div class="title">
            {{title}}
        </div>
        <div ref="lineChart" style="height: 200px;width: 100%;">
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            chart: null
            // resize: null
        };
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.lineChart);
            this.resize = _.throttle(this.chart.resize, 100);
            window.addEventListener('resize', this.resize);
        },
        setOption(settingData) {
            let options = {
                // title: {
                //     text: '今日',
                //     left: '50%',
                //     textAlign: 'center'
                // },
                // legend: {
                //     right: 20,
                //     orient: 'vertical',
                //     data: ['今日']
                // },
                xAxis: {
                    show: false,
                    type: 'category',
                    data: ['00:00','2:00','4:00','6:00','8:00','10:00','12:00']
                },
                yAxis: {
                    type: 'value',
                    show: false,
                },
                series: [{
                    name: '今日',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    symbolSize: 12,
                    data: ['12', '14', '12', '17', '14', '15', '10'],
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(199, 237, 250,0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(199, 237, 250,0.2)'
                            }], false)
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f7b851'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 4
                        }
                    }
                }]
            };
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
.line-chart {
    height: 138px;
    position: relative;
    .vital-info {
        position: absolute;
        top: 10px;
        right: 30px;
        color: #fff;
        text-shadow: 2px 2px 2px #000;
    }
    .legends {
        position: absolute;
        top: 20px;
        left: 50px;
        color: #fff;
    }
    .title {
        font-size: 13px;
        color: #fff;
        text-align: center;
    }
}
</style>
