
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
                chart: null
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
                            // str = parms.marker+""+parms.data.legendname +"</br>"+"占比："+ parms.percent+"%";
                            str = `${parms.marker}${parms.data.legendname}</br>占比：${parms.percent}%${parms.data.volume?'</br>数量：':''}${parms.data.volume?parms.data.volume:''}`
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
                                        str = params.data.legendname + '(' + params.percent + '%)'
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
