<template>
    <div class="tree-chart">
        <div ref="treeData" style="height: 300px;width: 300px; margin: 0 auto">
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        props: {
            treeData: {
                type: Array,
                default: () => []
            },
            scale: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                chart: null
            };
        },
        watch: {
            treeData: {
                handler(newVal, oldVal) {
                    console.log(newVal)
                    this.setOption();
                },
                deep: true
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$refs.treeData);
                this.resize = _.throttle(this.chart.resize, 100);
                window.addEventListener('resize', this.resize);
            },
            numFormat(num) {
                let numInt = Math.round(num)
                let result = (numInt.toString().indexOf ('.') !== -1) ? numInt.toLocaleString() : numInt.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                return result;
            },
            setOption() {
                let self = this
                // let data = [{
                //     "value": 27.6,
                //     "name": "保险"
                // }, {
                //     "value": 16.5,
                //     "name": "知识产权"
                // }, {
                //     "value": 16.5,
                //     "name": "出版"
                // }, {
                //     "value": 5.5,
                //     "name": "轻工业"
                // }, {
                //     "value": 4.8,
                //     "name": "金融"
                // }, {
                //     "value": 13.7,
                //     "name": "化工"
                // }]
                let options = {
                    // backgroundColor: "#000",
                    title: {
                        text: '',
                        left: '50%',
                        top: '30',
                        textAlign: 'center',
                        textStyle: {
                            color: "#000",
                            fontWeight: 'normal',
                        }
                    },
                    color: ['#72cf8b', '#9093fb', '#c580fb', '#fc9a39', '#2cc9c8', '#0496d4', '#8f2ada', '#f37f8e'],
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params){
                            let str  = ''
                            str = '后台分类：' + params.data.name + '</br>' +
                                  '国家：' + params.data.countryCode + '</br>' +
                                  'GMV：$'  + self.numFormat(params.data.volume) + "</br>" +
                                  '售出件数：' + params.data.quantity + '</br>' +
                                  '售出商品单价：$'  + self.numFormat(params.data.pricePerItem) +"</br>" +
                                  '占GMV比：'  + parseFloat(params.data.percentage.toFixed(1))+ '%'+ '</br>' +
                                  '占' + params.data.countryCode + '-GMV比：' + parseFloat(params.data.countryRatio.toFixed(1)) + '%';
                            return  str ;
                        }
                    },
                    series: [{
                        type: 'treemap',
                        width: self.scale * 100 + '%',
                        height: self.scale * 90 + '%',
                        top: '15%',
                        roam: false, //是否开启拖拽漫游（移动和缩放）
                        nodeClick: false, //点击节点后的行为,false无反应
                        breadcrumb: {
                            show: false
                        },
                        label: { //描述了每个矩形中，文本标签的样式。
                            normal: {
                                show: true,
                                fontWeight: 'bold',
                                position: ['5%', '2%'],
                                formatter: function(params) {
                                    let str = ''
                                    str = params.data.name + '\n' + parseFloat(params.data.countryRatio.toFixed(1)) + '%'
                                    return str
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 16,
                                },
                                borderWidth: 1,
                                borderColor: '#fff',
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: self.treeData
                    }]
                }
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
