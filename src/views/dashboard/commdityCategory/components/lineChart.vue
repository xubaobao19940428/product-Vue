<template>
    <div class="line-chart">
        <div ref="lineChart" style="height: 400px;width: 98%;">
        </div>
    </div>
</template>

<script>
    // import moment from 'moment'
    import echarts from 'echarts'

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            lineData: {
                type: Object,
                default: () => {}
            },
            unit: {
                type: String,
                default: ''
            },
            yMin: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                chart: null
            };
        },
        watch: {
            lineData: {
                handler(newVal, oldVal) {
                    console.log(newVal, oldVal)
                    this.setOption();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$refs.lineChart,'vintage');
                this.resize = _.throttle(this.chart.resize, 100);
                window.addEventListener('resize', this.resize);
            },
            resizeChart() {
                setTimeout(() => {
                    this.chart.resize()
                }, 10)
            },
            seriesList () {
                let list = []
                let color = [
                    "#d87c7c",
                    "#919e8b",
                    "#d7ab82",
                    "#6e7074",
                    "#61a0a8",
                    "#efa18d",
                    "#787464",
                    "#cc7e63",
                    "#724e58",
                    "#4b565b",
                    '#c23531',
                    '#2f4554',
                    '#61a0a8',
                    '#d48265',
                    '#91c7ae',
                    '#749f83',
                    '#ca8622',
                    '#bda29a'
                ]
                for (const key in this.lineData.series) {
                    // console.log(this.lineData.series[key])
                    list.push({
                        name: key,
                        type: 'line',
                        data: this.lineData.series[key],
                        label: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: color[key], //改变折线颜色
                                }
                            }
                        },
                    })
                }
                // console.log('====>>',list)
                return list
            },
            setOption(settingData) {
                let self = this
                let options = {
                    animation: false,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        },
                        position: function (pos, params, dom, rect, size) {
                            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                            var obj = {top: 0};
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                            return obj;
                        },
                        formatter:function (params){
                            let str= params[0].axisValue.indexOf('第') === -1?moment(params[0].axisValue).format('YYYY-MM-DD') +"</br>": params[0].axisValue+"</br>"
                            for (const iterator of params) {
                                str = str+ iterator.marker+""+iterator.seriesName + ': ' + iterator.value + self.unit +"</br>"
                            }
                            return  str ;
                        }
                    },
                    grid: {
                        top: 30,
                        left: 60,
                        bottom: 70,
                        right: 60
                    },
                    legend: {
                        x: 'center', // 'center' | 'left' | {number},
                        y: 'top', // 'center' | 'bottom' | {number}
                        bottom: 10,
                        type: 'scroll',
                        data: this.lineData.cateName
                    },
                    color: [
                        "#d87c7c",
                        "#919e8b",
                        "#d7ab82",
                        "#6e7074",
                        "#61a0a8",
                        "#efa18d",
                        "#787464",
                        "#cc7e63",
                        "#724e58",
                        "#4b565b",
                        '#c23531',
                        '#2f4554',
                        '#61a0a8',
                        '#d48265',
                        '#91c7ae',
                        '#749f83',
                        '#ca8622',
                        '#bda29a'
                    ],
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#00ca95',
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lineData.xAxis,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: function (value) {
                                // console.log(value)
                                let text = ''
                                if (self.unit === '%') {
                                    text = value + self.unit
                                } else {
                                    text = value
                                }
                                return text
                            }
                        },
                        min: self.yMin
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            start: 0,
                            end: 100,
                            zoomOnMouseWheel: 'ctrl'
                        },
                        {
                            show: true,
                            type: 'slider',
                            y: '90%',
                            start: 50,
                            end: 100
                        }
                    ],
                    series: this.seriesList()
                };
                this.chart.setOption(options);
            }
        },
        mounted: function() {
            this.initChart();
            this.setOption();
        }
    }
</script>

<style lang="scss" scoped>
    .line-chart {
        height: 500px;
        position: relative;
        overflow: auto;
        z-index: 1;
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
