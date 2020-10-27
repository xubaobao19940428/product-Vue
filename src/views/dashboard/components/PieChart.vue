<template>
    <div class="pie-chart">
        <div class="title">
            {{title}}
        </div>
        <div ref="pieChart" style="height: 300px;width: 100%;">
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
        }
    },
    data() {
        return {
            chart: null,
            // pieData:[
            // //    {value:335, legendname:'种类01',name:"种类01  335",itemStyle:{color:"#8d7fec"}},
            // //    {value:310, legendname:'种类02',name:"种类02  310",itemStyle:{color:"#5085f2"}},
            // //    {value:234, legendname:'种类03',name:"种类03  234",itemStyle:{color:"#e75fc3"}},
            // //    {value:154, legendname:'种类04',name:"种类04  154",itemStyle:{color:"#f87be2"}},
            // //    {value:335, legendname:'种类05',name:"种类05  335",itemStyle:{color:"#f2719a"}}
            // ]
        };
    },
    computed: {
        pieDataModel() {
            return this.pieData
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
        setOption() {
            let self = this
            let options = {
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter:function (parms){
                        let str  = ''
                        if (self.unit === '金额') {
                            str = parms.marker+""+parms.data.legendname+"</br>"+
                            self.unit +"：$"+ parms.data.value+ "</br>"+
                            "占比："+ parms.percent+"%";
                        } else {
                            str = parms.marker+""+parms.data.legendname+"</br>"+
                            self.unit +"："+ parms.data.value+ "单</br>"+
                            "占比："+ parms.percent+"%";
                        }
                        return  str ;
                    }
                },
                series: [
                     {
                        name:'标题',
                        type:'pie',
                        center: ['50%', '60%'],
                        radius: ['40%', '65%'],
                        clockwise: true, //饼图的扇区是否是顺时针排布
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'outter',
                                formatter:function (params){
                                    let str = ''
                                    if (self.unit === '金额') {
                                       str = params.data.legendname + '\n$' + params.data.value + '(' + params.percent + '%)'
                                    } else {
                                       str = params.data.legendname + '\n' + params.data.value + '(' + params.percent + '%)'
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
                        data: this.pieDataModel
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
.pie-chart {
    height: 138px;
    position: relative;
    .title {
        font-size: 13px;
        color: #fff;
        text-align: center;
    }
}
</style>
