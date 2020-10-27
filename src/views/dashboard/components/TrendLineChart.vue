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
        }
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
            let self = this
            let increaseImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfUlEQVQ4T2NkoBAwUqifYZAbcEOOLZSRkfGL+sOf23F5FacXQJoZGBhWQTWGaTz6tRqbIVgNQNMM04fVEAwDcGjGaQiKAQQ0YzUEbgCRmjEMQTbgPymJSuPRL7BeuAHX5dgasBnAxMCAYfA/BgZGzUe/wOoHeUokJkwo9gIARDAoEVrzbVAAAAAASUVORK5CYII='
            let reduceImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAjUlEQVQ4T2NkoBAwUqifYRAZIPVTowGrd5gY/mOI/2NgfMZ+A6we7AWx/zriLL//viAlPBhZWWWfMl56Ag8D6Z9aof8Z/68ixhDG/4xhT9mvrYa7AKaJGEOQNWMYABLAZwi6ZqwG4DIEm2acBqAbgkszXgNghvz9z/DlBce17bgCdxClRGLiH5sair0AABJkPBFMc1UrAAAAAElFTkSuQmCC'
            let options = {
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter:function (params){
                        var str= params[0].name +"</br>" + params[0].marker+""+params[0].seriesName + ': ' + params[0].value + '%'
                        return  str ;
                    }
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
                series: [
                    {
                        name: '全部',
                        type: 'line',
                        stack: '总量',
                        data: this.lineData.series
                    }
                ]
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
