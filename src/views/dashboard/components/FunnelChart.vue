<template>
    <div class="funnel-chart">
        <div ref="funnelChart" style="height: 300px;width: 100%;">
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
            funnelChart: {
                type: Object,
                default: () => {}
            },
            funnelValue: {
                type: Array,
                default: () => []
            },
            funnelConvert: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                chart: null,
            };
        },
        watch: {
            funnelValue: {
                handler(newVal, oldVal) {
                    this.setOption();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$refs.funnelChart);
                this.resize = _.throttle(this.chart.resize, 100);
                window.addEventListener('resize', this.resize);
            },
            setOption(settingData) {
                let self = this;
                var colors = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff'];
                var url = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAARCAMAAACLgl7OAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaVBMVEUAAADBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcEAAAD45xibAAAAInRSTlMAmT6WJYwSfBMGZAFHmEgtkBeCCW0KAlI1k5QeiA10A1tc7ah1owAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAB7SURBVCjPtZDZDoAgDAQXvA+8bwX1/3/SGKIBEd+cx07TdgtIiAF0/mygDvnAoYDr2b3nnjP8wOaDUG6J4ncfR9cdScpMzbJECZEXT1/kesyy0n1VPv6AulF908Kg6+9DWN/hjWGUfhpgYV5Ov8ywwgUhguODddtXvXIAjuUEs/70/t4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTItMTZUMTU6MzM6MDkrMDg6MDCzL2BEAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEyLTE2VDE1OjMzOjA5KzA4OjAwwnLY+AAAAABJRU5ErkJggg==';

                var lineargroup = [{
                        value: 100,
                        name: '目标',
                        oriname: "商品曝光",
                        color: ["rgba(29,211,137,0.8)", "rgba(29,211,137,0)"]
                    },
                    {
                        value: 100,
                        name: '点击率',
                        oriname: "点击",
                        color: ["rgba(102,142,255,0.7)", "rgba(102,142,255,0)"]
                    },
                    {
                        value: 60,
                        name: '下单率',
                        oriname: "下单",
                        color: ["rgba(255,198,82,0.6)", "rgba(255,198,82,0)"]
                    },
                    {
                        value: 20,
                        name: '支付率',
                        oriname: "支付",
                        color: ["rgba(255,110,115,0.5)", "rgba(255,110,115,0)"]
                    },
                ];

                var data1 = [];

                for (var i = 0; i < lineargroup.length; i++) {
                    var obj1 = {
                        value: this.funnelValue[i],
                        name: lineargroup[i].oriname
                    };
                    data1.push(obj1);
                }

                var option = {
                    backgroundColor: '#ffffff',
                    color: colors,
                    tooltip: {
                        trigger: "item",
                        formatter:function (parms){
                            let str  = ''
                            if (parms.componentSubType === 'funnel') {
                                str = parms.name + ' : ' + parms.value + '次'
                            }
                            if (parms.componentSubType === 'graph') {
                                str = parms.name.split(' > ')[0] + '~' + parms.name.split(' > ')[1] + ' : ' + parms.value
                            }
                            return  str ;
                        }
                    },
                    grid: {
                        top: '-10',
                        left: "-50%",
                        right: 0,
                        height: "226",
                        bottom: '0'
                    },
                    xAxis: {
                        show: false
                    },
                    yAxis: [{
                        show: false,
                        boundaryGap: false,
                        type: "category",
                        data: ["", "", "", ""]
                    }],
                    series: [{
                            top: 0,
                            type: 'funnel',
                            height: '280',
                            gap: 20,
                            minSize: 50,
                            left: '0%',
                            width: '50%',
                            sort: 'none',
                            label: {
                                show: true,
                                position: 'inside',
                                fontSize: '14',
                                formatter: function(d) {
                                    var ins = d.name;
                                    return ins
                                },
                                rich: {
                                    aa: {
                                        padding: [8, 0, 6, 0]
                                    }
                                }
                            },
                            data: data1
                        },
                        {
                            type: 'pictorialBar',
                            name: '',
                            symbolSize: ['32', '17'],
                            symbolPosition: 'center',
                            symbol: url,
                            animation: true,
                            symbolClip: true,
                            z: 10,
                            data: [{
                                    value: 100,
                                },
                                {
                                    value: 100,
                                },
                                {
                                    value: 100,
                                }
                            ]
                        },
                        {
                            z: 1,
                            top: 36,
                            height: 238,
                            type: 'graph',
                            layout: 'none',
                            symbolSize: 0,
                            roam: false,
                            left: "30%",
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            lineStyle: {
                                normal: {
                                    width: 2,
                                }
                            },
                            edgeLabel: {
                                normal: {
                                    show: true,
                                    rotate: 90,
                                    position: 'middle',
                                    backgroundColor: '#e4f5da',
                                    borderRadius: 20,
                                    color: '#333',
                                    verticalAlign: 'middle',
                                    fontSize: 14,
                                    legendHoverLink: true,
                                    padding: [2, 2, 2, 2],
                                    formatter: function(d) {
                                        if (d.value) {
                                            var ins = d.value ;
                                            return ins;
                                        }

                                    },
                                    rich: {
                                        words: {
                                            color: '#333',
                                            position: 'right',
                                            fontSize: 14,
                                            lineHeight: 20,
                                            padding: [0, 0, 4, 0],
                                        }
                                    }
                                }
                            },
                            data: [{
                                name: '商品曝光',
                                x: 400,
                                y: 0
                            }, {
                                name: '点击',
                                x: 400,
                                y: 20
                            }, {
                                name: '下单',
                                x: 400,
                                y: 40
                            }, {
                                name: '支付',
                                x: 400,
                                y: 60
                            }],

                            links: [{
                                    source: '商品曝光',
                                    target: '点击',
                                    value: self.funnelConvert[0],
                                    lineStyle: {
                                        normal: {
                                            curveness: 3.5,
                                        }
                                    }
                                },
                                {
                                    source: '点击',
                                    target: '下单',
                                    value: self.funnelConvert[1],
                                    lineStyle: {
                                        normal: {
                                            curveness: 3,
                                            color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 0,
                                                y2: 1,
                                                colorStops: [{
                                                    offset: 0,
                                                    color: '#668eff' // 0% 处的颜色
                                                }, {
                                                    offset: 1,
                                                    color: '#ffc751' // 100% 处的颜色
                                                }],
                                                global: false // 缺省为 false
                                            }

                                        }
                                    }
                                },
                                {
                                    source: '下单',
                                    target: '支付',
                                    value: self.funnelConvert[2],
                                    lineStyle: {
                                        normal: {
                                            curveness: 2.5,
                                            color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 0,
                                                y2: 1,
                                                colorStops: [{
                                                    offset: 0,
                                                    color: '#ffc751' // 0% 处的颜色
                                                }, {
                                                    offset: 1,
                                                    color: '#ff6e73' // 100% 处的颜色
                                                }],
                                                global: false // 缺省为 false
                                            }

                                        }
                                    }
                                }
                            ],

                        }
                    ]
                };
                this.chart.setOption(option);
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
    .funnel-chart {
        padding: 44px 0 0 20px;
        height: 350px;
        width:800px;
        margin: 0 auto;
    }
</style>
