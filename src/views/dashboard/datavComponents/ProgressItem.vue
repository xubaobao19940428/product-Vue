<template>
    <div class="progress-wrapper">
        <div class="progress_center">
            <div v-for="(item, index) in barData.firstData" :key="index" class="progress-item" :class="'progress-item-' + item.countryCode">
                <div class="progress" :class="'progress-bg-' + item.countryCode" :style="'width:' + item.progress/2 + '%'"></div>
                <span class="order-amount">${{item.totalGmv}}</span>
                <span class="order-num">单量{{item.totalOrderNum}}</span>
            </div>
        </div>
        <div class="progress_center">
            <div v-for="(item, index) in barData.secondData" :key="index" class="progress-item" :class="'progress-item-' + item.countryCode">
                <div class="progress" :class="'progress-bg-' + item.countryCode" :style="'width:' + item.progress/2 + '%'"></div>
                <span class="order-amount">${{item.totalGmv}}</span>
                <span class="order-num">单量{{item.totalOrderNum}}</span>
            </div>
        </div>
        <div class="progress_center">
            <div v-for="(item, index) in barData.thirdData" :key="index" class="progress-item" :class="'progress-item-' + item.countryCode">
                <div class="progress" :class="'progress-bg-' + item.countryCode" :style="'width:' + item.progress/2 + '%'"></div>
                <span class="order-amount">${{item.totalGmv}}</span>
                <span class="order-num">单量{{item.totalOrderNum}}</span>
                <span class="order-num">{{'($'+item.totalPricePerOrder+')'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            barData: {
                type: Object,
                default: () => {
                    return {
                        fitstData: [],
                        secondData: [],
                        thirdData: []
                    }
                }
            }
        },
        data () {
            return {
                chart: null,
                fontSize: '',
                labelFontSize: '',
                timer: null,
                dataList: [{
                    countryCode: 'MY',
                    orderNum: 1233,
                    orderAmount: 546732,
                    progress: 100

                }, {
                    countryCode: 'TH',
                    orderNum: 323,
                    orderAmount: 43222,
                    progress: 30
                }, {
                    countryCode: 'SG',
                    orderNum: 231,
                    orderAmount: 8763,
                    progress: 80
                }]
            }
        },
        watch: {
            barData: {
                handler (newVal, oldVal) {
                },
                deep: true
            }
        },
        methods: {
            initChart () {
                this.chart = echarts.init(this.$refs.barChart)
                this.labelFontSize = localStorage.getItem('labelFontSize')
                this.fontSize = localStorage.getItem('fontSize')
                this.resize = _.throttle(this.chart.resize, 100)
                window.addEventListener('resize', this.resize)
            },
            setOption () {
                if (this.chart) {
                    this.chart.clear()
                } else {
                    this.chart = echarts.init(this.$refs.barChart)
                }
                let settingData = this.barData
                var _that = this
                let options = {
                    // backgroundColor: '#00265f',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['马来西亚', '泰国', '新加坡'],
                        left: '0',
                        textStyle: {
                            color: 'white',
                            fontSize: _that.fontSize * 0.15
                        },

                        bottom: '20',
                        itemWidth: _that.fontSize * 0.15,
                        itemHeight: _that.fontSize * 0.15,
                        itemGap: _that.fontSize * 0.175
                    },
                    grid: {
                        // left: _that.fontSize*2.15,
                        right: _that.fontSize * 1.5,
                        top: _that.fontSize * 0.1,
                        containLabel: true
                    },
                    xAxis: [{
                        show: false,
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff'
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#195384',
                                // width: 1,
                                type: 'solid'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#063374'
                            }
                        }
                    }],
                    yAxis: [{
                        show: false,
                        scale: true,
                        max: 2,
                        boundaryGap: [ 0.2, 0.2 ],
                        type: 'category',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#195384',
                                width: 1,
                                type: 'solid'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }

                    }],
                    series: [{
                                 name: '马来西亚',
                                 type: 'bar',
                                 data: settingData.MYdata,
                                 barMinHeight: 10,
                                 barWidth: _that.fontSize * 0.075, // 柱子宽度
                                 barGap: 2, // 柱子之间间距
                                 itemStyle: {
                                     normal: {
                                         color: '#13ce8c',
                                         label: {
                                             formatter: function (data) {
                                                 if (data.data.type == '普貨') {
                                                     return `{a|$${data.value}}{b|单量${data.data.totalOrderNum}}{c|$(${data.data.totalPricePerOrder})}`
                                                 }
                                                 return `{a|$${data.value}}{b|单量${data.data.totalOrderNum}}`
                                             },
                                             show: true,
                                             position: 'right',
                                             textStyle: {
                                                 fontWeight: 'bolder',
                                                 fontSize: '12',
                                                 color: '#fff'
                                             },

                                             rich: {
                                                 a: {
                                                     color: '#F17F88',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     fontSize: _that.labelFontSize
                                                 },
                                                 b: {
                                                     color: '#00ABEE',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     padding: [0, 5],
                                                     fontSize: _that.labelFontSize * 2 / 3
                                                 },
                                                 c: {
                                                     color: '#00ABEE',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     padding: [0, 5],
                                                     fontSize: _that.labelFontSize * 2 / 3
                                                 }
                                             }
                                         }
                                     }
                                 }
                             }, {
                                 name: '泰国',
                                 type: 'bar',
                                 data: settingData.THdata,
                                 barMinHeight: 10,
                                 barWidth: _that.fontSize * 0.075, // 柱子宽度
                                 barGap: 2, // 柱子之间间距
                                 itemStyle: {
                                     normal: {
                                         color: '#fac167',
                                         label: {
                                             formatter: function (data) {
                                                 if (data.data.type == '普貨') {
                                                     return `{a|$${data.value}}{b|单量${data.data.totalOrderNum}}{c|$(${data.data.totalPricePerOrder})}`
                                                 }
                                                 return `{a|$${data.value}}{b|单量${data.data.totalOrderNum}}`
                                             },
                                             show: true,
                                             position: 'right',
                                             textStyle: {
                                                 fontWeight: 'bolder',
                                                 fontSize: '12',
                                                 color: '#fff'
                                             },

                                             rich: {
                                                 a: {
                                                     color: '#F17F88',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     fontSize: _that.labelFontSize
                                                 },
                                                 b: {
                                                     color: '#00ABEE',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     padding: [0, 5],
                                                     fontSize: _that.labelFontSize * 2 / 3
                                                 },
                                                 c: {
                                                     color: '#00ABEE',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     padding: [0, 5],
                                                     fontSize: _that.labelFontSize * 2 / 3
                                                 }
                                             }
                                         }
                                     }
                                 }
                             },
                             {
                                 name: '新加坡',
                                 type: 'bar',
                                 data: settingData.SGdata,
                                 barMinHeight: 10,
                                 barWidth: _that.fontSize * 0.075, // 柱子宽度
                                 barGap: 2, // 柱子之间间距
                                 barCategoryGap: '100%', // Make series be overlap
                                 itemStyle: {
                                     normal: {
                                         color: '#f17f88',
                                         label: {
                                             formatter: function (data) {
                                                 if (data.data.type == '普貨') {
                                                     return `{a|$${data.value}}{b|单量${data.data.totalOrderNum}}{c|$(${data.data.totalPricePerOrder})}`
                                                 }
                                                 return `{a|$${data.value}}{b|单量${data.data.totalOrderNum}}`
                                             },
                                             show: true,
                                             position: 'right',
                                             textStyle: {
                                                 fontWeight: 'bolder',
                                                 fontSize: '12',
                                                 color: '#fff'
                                             },

                                             rich: {
                                                 a: {
                                                     color: '#F17F88',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     fontSize: _that.labelFontSize
                                                 },
                                                 b: {
                                                     color: '#00ABEE',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     padding: [0, 5],
                                                     fontSize: _that.labelFontSize * 2 / 3
                                                 },
                                                 c: {
                                                     color: '#00ABEE',
                                                     lineHeight: 22,
                                                     align: 'center',
                                                     padding: [0, 5],
                                                     fontSize: _that.labelFontSize * 2 / 3
                                                 }
                                             }
                                         }
                                     }
                                 }
                             }
                    ]
                }
                this.chart.setOption(options)
            }
        },
        mounted: function () {
            // this.timer=window.setInterval(()=>{
            // this.initChart()
            // },1000)
            // this.initChart();
            // this.setOption(this.barData);
        },
        beforeDestroy () {
            // if (this.timer) {

            //     clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
            // }
        }
    }
</script>

<style lang="scss" scoped>
     .progress-wrapper {
         width: 100%;
         height:100%;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         align-items: center;
        .progress_center {
            width: 100%;
            height:1.13rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .progress-item{
                width: 100%;
                align-items: center;
                display: flex;
                flex-wrap: wrap;
                font-size:0.18rem;
                margin-top: 0.1rem;
            }
            .progress-item:nth-child(1) {
                margin-top: 0;
            }
            .progress-bg-MY {
                background-color: #13ce8c;
            }
            .progress-bg-TH {
                background-color: #fac167;
            }
            .progress-bg-SG {
                background-color: #f17f88;
            }
            .progress-bg-ID {
                background-color: #00c7db;
            }
            .progress {
                display: inline-block;
                width: 50%;
                height: .075rem;
            }
            .order-amount {
                display: inline-block;
                font-size: .18rem;
                padding: 0 3px;
                line-height:.18rem;
                vertical-align: middle;
            }
            .order-num {
                display: inline-block;
                font-size: .15rem;
                color: #00ebff;
                margin-right:.1rem;
                vertical-align: middle;
            }
        }
        .progress-item-MY {
            color: #13ce8c;
        }
        .progress-item-TH {
            color: #fac167;
        }
        .progress-item-SG {
            color: #f17f88;
        }
        .progress-item-ID {
            color: #00c7db;
        }

    }
</style>
