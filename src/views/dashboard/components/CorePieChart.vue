<template>
    <div class="pie-chart">
        <div class="title">
            {{title}}
        </div>
        <div ref="pieChart" style="height: 450px;width: 100%;">
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
        pieData: {
            type: Array,
            default: () => { return [] }
        },
        unit: {
            type: String,
            default: '数量'
        },
        radius: {
            type: String | Number,
            default: '60'
        },
        centerY: {
            type: String | Number,
            default: '50%'
        }
    },
    data() {
        return {
            chart: null,
            // pieData:[
            //    {value:335, legendname:'种类01',name:"种类01  335",itemStyle:{color:"#8d7fec"}},
            //    {value:310, legendname:'种类02',name:"种类02  310",itemStyle:{color:"#5085f2"}},
            //    {value:234, legendname:'种类03',name:"种类03  234",itemStyle:{color:"#e75fc3"}},
            //    {value:154, legendname:'种类04',name:"种类04  154",itemStyle:{color:"#f87be2"}},
            // ]
        };
    },
    computed: {
        pieDataModel() {
            return this.pieData
        },
        radiusValue() {
            //  Number(this.radius) + 25
            let radius = Number(this.radius)
            if (!isNaN(radius)) {
                radius = radius * 0.7
            } else (
                radius = 16
            )
            if (radius < 16) {
                radius = 16
            }
            return radius
        }

    },
    watch: {
        pieData: {
            handler(newVal, oldVal) {
                this.setOption();
            },
            deep: true
        }
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.pieChart);
            this.resize = _.throttle(this.chart.resize, 100);
            window.addEventListener('resize', this.resize);
        },
        numFormat(num) {
            let numInt = Math.round(num)
            var result = (numInt.toString().indexOf ('.') !== -1) ? numInt.toLocaleString() : numInt.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            return result;
        },
        setOption() {
            let self = this
            let options = {
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter:function (params){
                        // console.log(params)
                        let str  = ''
                        let orderType = params.data.orderType
                        if (orderType === 'Normal' || orderType === 'Gift' || orderType === 'B2B') {
                            let orderTypeStr = ''
                            if (orderType === 'Normal') {
                                orderTypeStr = '普通商品'
                            } else if (orderType === 'Gift') {
                                orderTypeStr = '礼包'
                            } else if (orderType === 'B2B') {
                                orderTypeStr = 'B2B'
                            }
                            str = '国家：' + params.data.countryCode + '</br>' +
                                'GMV：$' + self.numFormat(params.data.value) + '</br>' +
                                '占GMV比：'+ parseFloat(params.data.percentage.toFixed(1)) + '%' + '</br>' +
                                '占' + orderTypeStr +'GMV比：' + parseFloat(params.percent.toFixed(1)) + '%'
                        } else {
                            if (params.data.dataType === '27') {
                                str = '订单类型：' + params.data.name + '</br>' +
                                '普货GMV：$' + self.numFormat(params.data.volume) + '</br>' +
                                '占普货GMV比：'+ parseFloat(params.data.percentage.toFixed(1)) + '%' + '</br>' +
                                '占对应国普货GMV比：' + parseFloat(params.percent.toFixed(1)) + '%'
                            } else {
                                str = '用户级别：' + params.data.name + '</br>' +
                                '普货GMV：$' + self.numFormat(params.data.volume) + '</br>' +
                                '占普货GMV比：'+ parseFloat(params.data.percentage.toFixed(1)) + '%' + '</br>' +
                                '占对应国普货GMV比：' + parseFloat(params.percent.toFixed(1)) + '%'
                            }

                        }
                        return  str ;
                    }
                },
                color: ['#72cf8b', '#9093fb', '#c580fb', '#fc9a39', '#2cc9c8', '#0496d4', '#8f2ada', '#f37f8e'],
                series: [
                     {
                        name:'标题',
                        type:'pie',
                        radius : this.radiusValue + '%',
                        center: ['50%', this.centerY],
                        clockwise: true, //饼图的扇区是否是顺时针排布
                        avoidLabelOverlap: true,
                        label: {
                            rotate: false,
                            normal: {
                                show: true,
                                position: 'outter',
                                formatter:function (params){
                                    let str = ''
                                    if (self.unit === '金额') {
                                       str = '$' + params.data.legendname + '\n$' + self.numFormat(params.data.value) + '\n' + '(' + parseFloat(params.percent.toFixed(1)) + '%)'
                                    } else {
                                       str = params.data.legendname + '\n$' + self.numFormat(params.data.value)+ '\n' + '(' + parseFloat(params.percent.toFixed(1)) + '%)'
                                    }
                                    return str
                                 }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 14,
                                length2: 6,
                                smooth: true,
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#ffffff',
                            },
                            emphasis: {
                                borderWidth: 0,
                                shadowBlur: 6,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: this.pieDataModel
                    },
                    // {
                    //     radius: ['0%', '60%'],
                    //     center: ['50%', '60%'],
                    //     type: 'pie',
                    //     label: {
                    //         normal: {
                    //             show: false
                    //         },
                    //         emphasis: {
                    //             show: false
                    //         }
                    //     },
                    //     labelLine: {
                    //         normal: {
                    //             show: false
                    //         },
                    //         emphasis: {
                    //             show: false
                    //         }
                    //     },
                    //     animation: false,
                    //     tooltip: {
                    //         show: false
                    //     },
                    //     itemStyle: {
                    //         normal: {
                    //             color: 'rgba(250,250,250,0.5)'
                    //         }
                    //     },
                    //     data: [{
                    //         value: 1,
                    //     }],
                    // }
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
.pie-chart {
    height: 450px;
    position: relative;
    .title {
        font-size: 13px;
        color: #fff;
        text-align: center;
    }
}
</style>
