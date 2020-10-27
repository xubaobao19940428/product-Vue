<template>
    <div class="line-chart">
        <div class="title">
            {{title}}
        </div>
        <div ref="lineChart" style="height: 400px;width: 100%;">
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
        },
        dataLenged: Array
    },
    data() {
        return {
            chart: null
            // resize: null
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
            this.chart = echarts.init(this.$refs.lineChart);
            this.resize = _.throttle(this.chart.resize, 100);
            window.addEventListener('resize', this.resize);
        },
        resizeChart() {
            setTimeout(() => {
                this.chart.resize()
            }, 10)
        },
        setOption(settingData) {
            console.log(this.lineData)
            let data = this.seriesData()
            console.log(data)
            let self = this
            let options = {
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter:function (params){
                        // console.log(params)
                        let str = params[0].name +"</br>"
                        for (const iterator of params) {
                            str +=  iterator.marker+""+iterator.seriesName + ': ' + iterator.value + "</br>"
                        }
                        return  str 
                    }
                },
                legend: {
                    data: this.dataLenged
                },
                grid: {
                    top: 30,
                    left: 60,
                    bottom: 70,
                    right: 60
                },
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
                series: data
            };
            this.chart.setOption(options,true);
        },
        seriesData () {
            let list = []
            for (let i = 0; i < this.lineData.series.length; i++) {
                list.push({
                    name: this.dataLenged[i],
                    type: 'line',
                    stack: this.dataLenged[i],
                    data: this.lineData.series[i]
                })
                
            }
            console.log(list)
            return list
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
    height: 400px;
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