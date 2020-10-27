<template>
    <div class="bar-chart">
        <div class="title">
            {{title}}
        </div>
        <div ref="barChart" style="height: 400px;width: 100%;">
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
            },
            barData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                chart: null,
            };
        },
        watch: {
            barData: {
                handler(newVal, oldVal) {
                    this.setOption();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$refs.barChart);
                this.resize = _.throttle(this.chart.resize, 100);
                window.addEventListener('resize', this.resize);
            },
            setOption(settingData) {
                let options = {
                    title: {
                        text: ''
                    },
                    grid:[{x: '55'}],
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: false
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        data: this.barData.xAxis
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '',
                        type: 'bar',
                        itemStyle: {
                            color: '#188df0'
                        },
                        data: this.barData.series,
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
