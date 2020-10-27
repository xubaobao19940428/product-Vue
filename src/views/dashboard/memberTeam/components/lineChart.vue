<template>
    <div class="line-chart">
        <div ref="lineChart" style="height: 400px;width: 100%;">
        </div>
    </div>
</template>
<script>
    import echarts from 'echarts';
    // import moment from 'moment'

    export default {
        props: {
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
            userIndex: {
                type: Number,
                default: 0
            },
            dimensionIncome: {
                type: Number,
                default: 0
            },
            dimensionlevel: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                chart: null,
                // resize: null
            };
        },
        mounted: function() {
            this.initChart();
            this.setOption();
        },
        watch: {
            lineData: {
                handler(newVal, oldVal) {
                    this.setOption();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$refs.lineChart);
                console.log(this.chart.resize)
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
                let self = this
                let options = {}
                if (this.userIndex ===0) {
                    options = Object.assign(options,{
                        animation: false,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line'
                            },
                            formatter:function (params){
                                // console.log(params)
                                let str= moment(params[0].axisValue).format('YYYY-MM-DD') +"</br>"
                                for (const iterator of params) {
                                    str = str+ iterator.marker+""+iterator.seriesName + ': ' + iterator.value + self.unit+"</br>"
                                }
                                return  str ;
                            }
                        },
                        legend: {
                            data: ['Total', 'SH', 'PS', 'AM', 'AT']
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
                        series: [
                            {
                                name: '全部',
                                type: 'line',
                                stack: '总量',
                                data: this.lineData.series && this.lineData.series[0]
                            },
                            {
                                name: 'SH',
                                type: 'line',
                                // stack: '总量',
                                data: this.lineData.series && this.lineData.series[1]
                            },
                            {
                                name: 'PS',
                                type: 'line',
                                // stack: '总量',
                                data: this.lineData.series && this.lineData.series[2]
                            },
                            {
                                name: 'AM',
                                type: 'line',
                                // stack: '总量',
                                data: this.lineData.series && this.lineData.series[3]
                            },
                            {
                                name: 'AT',
                                type: 'line',
                                // stack: '总量',
                                data: this.lineData.series && this.lineData.series[4]
                            },
                        ]
                    })
                } else if(this.userIndex ===1) {
                    console.log(this.dimensionIncome)
                    if (this.dimensionIncome == 0) {
                        options = Object.assign(options,{
                            animation: false,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                },
                                formatter:function (params){
                                    let str= params[0].name + "</br>" + params[0].marker+""+params[0].seriesName + ': ' + params[0].value
                                    return  str ;
                                }
                            },
                            legend: {
                                data: []
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
                                    data: this.lineData.series && this.lineData.series[0]
                                }
                            ]
                        })
                    } else if (this.dimensionIncome == 1 ) {
                        options = Object.assign(options,{
                            animation: false,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                },
                                formatter:function (params){
                                    let str= moment(params[0].axisValue).format('YYYY-MM-DD') +"</br>"
                                    for (const iterator of params) {
                                        str = str+ iterator.marker+""+iterator.seriesName + ': ' + iterator.value +"</br>"
                                    }
                                    return  str ;
                                }
                            },
                            legend: {
                                data: ['马来西亚', '新加坡', '泰国', '印度尼西亚']
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
                            series: [
                                {
                                    name: '马来西亚',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[0]
                                },
                                {
                                    name: '新加坡',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[1]
                                },
                                {
                                    name: '泰国',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[2]
                                },
                                {
                                    name: '印度尼西亚',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[3]
                                },
                            ]
                        })
                                        // this.chart.setOption(options,true);

                    } else if (this.dimensionIncome == 2) {
                        options = Object.assign(options,{
                            animation: false,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                },
                                formatter:function (params){
                                    // console.log(params)
                                    let str= moment(params[0].axisValue).format('YYYY-MM-DD') +"</br>"
                                    for (const iterator of params) {
                                        str = str+ iterator.marker+""+iterator.seriesName + ': ' + iterator.value +"</br>"
                                    }
                                    return  str ;
                                }
                            },
                            legend: {
                                data: ['SH', 'PS', 'AM', 'AT']
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
                                    name: 'SH',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[0]
                                },
                                {
                                    name: 'PS',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[1]
                                },
                                {
                                    name: 'AM',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[2]
                                },
                                {
                                    name: 'AT',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[3]
                                },
                            ]
                        })
                    }
                } else if(this.userIndex ===2) {
                    if (this.dimensionlevel == 0) {
                        options = Object.assign(options,{
                            animation: false,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                },
                                formatter:function (params){
                                    var str= params[0].name +"</br>" + params[0].marker+""+params[0].seriesName + ': ' + params[0].value
                                    return  str ;
                                }
                            },
                            legend: {
                                data: []
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
                                    data: this.lineData.series[0]
                                }
                            ]
                        })
                    } else if (this.dimensionlevel == 1 ) {
                        console.log('====>')
                        options = Object.assign(options,{
                            animation: false,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                },
                                formatter:function (params){
                                    // console.log(params)
                                    let str= moment(params[0].axisValue).format('YYYY-MM-DD') +"</br>"
                                    for (const iterator of params) {
                                        str = str+ iterator.marker+""+iterator.seriesName + ': ' + iterator.value +"</br>"
                                    }
                                    return  str ;
                                }
                            },
                            legend: {
                                data: ['马来西亚', '新加坡', '泰国', '印度尼西亚']
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
                            series: [
                                {
                                    name: '马来西亚',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[0]
                                },
                                {
                                    name: '新加坡',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[1]
                                },
                                {
                                    name: '泰国',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[2]
                                },
                                {
                                    name: '印度尼西亚',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[3]
                                },
                            ]
                        })
                    } else if (this.dimensionlevel == 2) {
                        options = Object.assign(options,{
                            animation: false,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                },
                                formatter:function (params){
                                    let str= moment(params[0].axisValue).format('YYYY-MM-DD') +"</br>"
                                    for (const iterator of params) {
                                        str = str+ iterator.marker+""+iterator.seriesName + ': ' + iterator.value +"</br>"
                                    }
                                    return  str ;
                                }
                            },
                            legend: {
                                data: ['SH', 'PS', 'AM', 'AT']
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
                            series: [
                                {
                                    name: 'SH',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[0]
                                },
                                {
                                    name: 'PS',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[1]
                                },
                                {
                                    name: 'AM',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[2]
                                },
                                {
                                    name: 'AT',
                                    type: 'line',
                                    data: this.lineData.series && this.lineData.series[3]
                                },
                            ]
                        })
                    }
                }
                this.chart.setOption(options,true);
            },

        },
    }
</script>
<style lang="scss" scoped>

</style>
