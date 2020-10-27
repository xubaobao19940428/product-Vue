import vChart from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import {
    OrderTrade
} from '@/request/mdc'
export default {
    components: {
        'v-chart': vChart
    },
    data () {
        return {
            pageSizeList: [ 7, 10, 15, 20, 40, 50, 100, 1000 ],
            proTypeList: {
                1: '不含礼包',
                2: '含礼包'
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近7天',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近15天',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近30天',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近60天',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近90天',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    methods: {
        getPropName (type) {
            switch (type) {
                case 'today': return '今日'
                case 'week': return '本周'
                case 'month': return '本月'
            }
            return ''
        },
        // 订单交易
        getOrderTradeStatistics () {
            OrderTrade({}).then((res) => {
                if (res.ret.errcode === 1) {
                    console.log(111)
                    this.orderDataList = res.data
                    // for (let i = 0; i < this.orderDataList.length; i++) {
                    //
                    // }
                    console.log(this.orderDataList)
                }
            })
        }
    }
}
