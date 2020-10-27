import {
    OrderTradeCount, //  订单交易数统计-首页表格 下面的四块
    PlatformOrderStatus, //  平台订单状态 统计
    OrderTradeChartCount, //  订单交易数统计-统计折线图 上面的四块
    OrderTradeChart, //  订单交易数统计-统计折线图
    ProductInfo, // 商品信息统计
    userRegistData,
    userRegistLine
} from '@/request/mdc'
import { BigScreenData } from '@/request/screendata'
import { OverviewTodayWatch, OverviewTodayTable, OverviewHourlyIncrease, OverviewOrdinaryGoods, OverviewTrendGrap, OverviewYearlySales, OverviewPlatformWide } from '@/request/dataV'
import mixins from './mixins'
import overviewHeader from '../../views/dashboard/dataOverview/overviewHeader'
import overviewTable from '../../views/dashboard/dataOverview/overviewTable'
import chartView from '../../views/dashboard/dataOverview/chartView'
import productTop from '../../views/dashboard/dataOverview/productTop'
import buildUp from '../../views/dashboard/dataOverview/buildUp'
import saleAll from '../../views/dashboard/dataOverview/saleAll'
import lastModule from '../../views/dashboard/dataOverview/lastModule'
import _ from 'lodash'
import { parseComponent } from 'vue-template-compiler'
export default {
    mixins: [mixins],
    components: {
        overviewHeader,
        overviewTable,
        chartView,
        productTop,
        buildUp,
        saleAll,
        lastModule
    },
    data() {
        return {
            resetInterval: null,
            checkButton: [
                { name: '全部', value: 'All' },
                { name: 'MY', value: 'MY' },
                { name: 'TH', value: 'TH' },
                { name: 'SG', value: 'SG' },
                { name: 'ID', value: 'ID' }
            ],
            isChange: 0,
            checkName: 'all',
            changeName: '1',
            changeType: 0,
            todayGiftGmv: {
                monthlyTargetProgress: "",
                ratio: "0%",
                todayTargetProgress: "",
                updateTime: "",
                volume: "",
                change: ''
            },
            todaynormalGmv: {
                monthlyTargetProgress: "",
                ratio: "0%",
                todayTargetProgress: "",
                updateTime: "",
                volume: "",
                change: ''
            },
            todayUser: {
                monthlyTargetProgress: "",
                ratio: "0%",
                todayTargetProgress: "",
                updateTime: "",
                volume: "",
                change: ''
            },
            changeNormal: {
                monthlyTargetProgress: "",
                ratio: "0%",
                todayTargetProgress: "",
                updateTime: "",
                volume: "",
                change: ''
            },
            // 中间表格
            payData: [],
            gmvData: [],
            todayTime1: '',
            gmvTableAttrData: [
                {
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed: 'left',
                }
            ],
            payTableAttrData: [
                {
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed: 'left',
                }
            ],
            newUserData: [],
            newUserTableAttrData: [
                {
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed: 'left',
                }
            ],
            //图表
            hoursLineData: {
                xAxis: [],
                payNum: [],
                sealNum: []
            },
            hoursBarData: {
                xAxis: [],
                payBarNum: [],
                sealBarNum: []
            },
            //今天时间top30数据
            todayTime: [new Date(new Date().toLocaleDateString()).getTime(),
            new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000)) - 1],

            myData: [],
            thData: [],
            //
            orderDataList: [],
            //增长趋势参数
            buildValue: [
                new Date(new Date().toLocaleDateString()).getTime() -
                24 * 60 * 60 * 1000 * 13 -
                1,
                new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000
            ],
            buildType: '1',
            changeBuildType: 'All',
            buildUpData: {
                xAxis: [],
                normalData: [],
                axle: []
            },
            //增长趋势饼图数据
            salePieChart: [],
            gmvPieChart: [],
            //销售增长
            saleCountryCode: 'All',
            yearSales: {
                xAxis: [],
                data: [],
                lenged: [],
                saleRowData: [],
            },
            yearGmv: {
                xAxis: [],
                data: [],
                lenged: [],
                gmvRowData: []
            },
            saleTime: [
                new Date(new Date().toLocaleDateString()).getTime() -
                  24 * 60 * 60 * 1000 * 120 -
                  1,
                new Date(new Date().toLocaleDateString()).getTime()
              ],
            //国家总揽
            allCountryCode: 'All',
            allCountryData: [],
            allNum: '0'

        }
    },
    watch: {
        checkName: {
            handler(newVal, oldVal) {
                console.log(newVal)
            },
            deep: true
        },
        changeValue: {
            handler(newVal, oldVal) {
                console.log(newVal)
            },
            deep: true
        }
    },
    mounted() {
        //目前数据概览部分
        this.getTodayTime()
        this.getOverviewTodayWatch()
        this.getOverviewTodayTable()
        this.getOverviewHourlyIncrease('all', '1')
        console.log(this.todayTime)
        this.getOverviewOrdinaryGoods(this.todayTime, '1')
        //底下的三个部分
        this.getOverviewTrendGrap()
        //销售增长
        this.getOverviewYearlySales()
        this.getOverviewPlatformWide()

    },
    // beforeDestroy () {
    //     if (this.resetInterval) {
    //         clearInterval(this.resetInterval) // 在Vue实例销毁前，清除我们的定时器
    //     }
    // },
    methods: {
        getTodayTime() {
            var todayTime = new Date()
            var Y = todayTime.getFullYear()
            var M = todayTime.getMonth()
            var D = todayTime.getDate()
            if (M < 10) {
                M = '0' + (M + 1)
            }
            if (D < 10) {
                D = '0' + D
            }
            this.todayTime1 = Y + '/' + M + '/' + D
            console.log(this.todayTime1)
        },
        //普通商品Top30
        getOverviewOrdinaryGoods(date, orderBy) {
            OverviewOrdinaryGoods({ startTime: date[0].toString(), endTime: date[1].toString(), orderBy: orderBy }).then(res => {
                console.log(res)
                if (res.ret.errcode == 1) {
                    res.rankData.map(item => {
                        if (item.title == 'MY') {
                            this.myData = item.rowData
                        } else if (item.title == 'TH') {
                            this.thData = item.rowData
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //接受top子组件传值
        topChange(data) {
            this.getOverviewOrdinaryGoods(data.todayTime, data.changeType)
        },
        //图形部分
        getOverviewHourlyIncrease(countryCode, type) {
            this.hoursLineData.xAxis = []
            this.hoursLineData.payNum = []
            this.hoursLineData.sealNum = []
            this.hoursBarData.xAxis = []
            this.hoursBarData.payBarNum = []
            this.hoursBarData.sealBarNum = []
            OverviewHourlyIncrease({ countryCode: countryCode, type: type }).then(res => {
                console.log(res)
                var xAxis = [], payNum = [], sealNum = [], payBarNum = [], sealBarNum = []
                if (res.ret.errcode == 1) {
                    if (type == '1') {
                        res.graphData.map(item => {
                            if (item.type == '支付订单数') {
                                item.pointData.map(xline => {
                                    xAxis.push(xline.tag)
                                    payNum.push({ value: xline.volume, change: xline.change })
                                })
                            } else if (item.type == '售出件数') {
                                item.pointData.map(xline => {
                                    sealNum.push({ value: xline.volume, change: xline.change })
                                })

                            } else if (item.type == '支付订单数增長') {
                                item.pointData.map(paybar => {
                                    payBarNum.push({ value: paybar.volume, change: paybar.change })
                                })
                            } else if (item.type == '售出件数增長') {
                                item.pointData.map(sealnum => {
                                    sealBarNum.push({ value: sealnum.volume, change: sealnum.change })
                                })
                            }
                        })
                        this.hoursLineData.xAxis = xAxis
                        this.hoursLineData.payNum = payNum
                        this.hoursLineData.sealNum = sealNum
                        this.hoursBarData.xAxis = xAxis
                        this.hoursBarData.payBarNum = payBarNum
                        this.hoursBarData.sealBarNum = sealBarNum
                        console.log(this.hoursBarData)
                    } else {
                        res.graphData.map(item => {
                            if (item.type == '注冊用戶') {
                                item.pointData.map(xline => {
                                    xAxis.push(xline.tag)
                                    payNum.push({ value: xline.volume, change: xline.change })
                                })
                            } else if (item.type == '新增PS數') {
                                item.pointData.map(xline => {
                                    sealNum.push({ value: xline.volume, change: xline.change })
                                })
                            } else if (item.type == '注冊用戶增長') {
                                item.pointData.map(xline => {
                                    payBarNum.push({ value: xline.volume, change: xline.change })
                                })
                            } else if (item.type == '新增PS數增長') {
                                item.pointData.map(xline => {
                                    sealBarNum.push({ value: xline.volume, change: xline.change })
                                })
                            }
                        })
                        this.hoursLineData.xAxis = xAxis
                        this.hoursLineData.payNum = payNum
                        this.hoursLineData.sealNum = sealNum
                        this.hoursBarData.xAxis = xAxis
                        this.hoursBarData.payBarNum = payBarNum
                        this.hoursBarData.sealBarNum = sealBarNum
                        console.log(this.hoursBarData)
                    }

                }
            }).catch(err => {
                console.log(err)
            })
        },
        //数据概览头部四个card数据
        getOverviewTodayWatch() {
            OverviewTodayWatch({}).then(res => {
                console.log('数据概览', res)
                if (res.ret.errcode == 1) {
                    res.boardData.map(item => {
                        if (item.type == '今日礼包支付GMV') {
                            this.todayGiftGmv = item
                            this.$set(this.todayGiftGmv, 'change', item.change)
                        } else if (item.type == '今日普货支付GMV') {
                            this.todaynormalGmv = item
                        } else if (item.type == '今日活跃用户数') {
                            this.todayUser = item
                        } else if (item.type == '普货转化率') {
                            this.changeNormal = item
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },

        //中间表格部分
        getOverviewTodayTable() {
            OverviewTodayTable({}).then(res => {
                this.payTableAttrData = [{
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed: true,
                }]
                this.gmvTableAttrData = [
                    {
                        lable: '',
                        name: '',
                        value: 'rowName',
                        minWidth: 100,
                        fixed: true,
                    }
                ]

                this.newUserTableAttrData = [
                    {
                        lable: '',
                        name: '',
                        value: 'rowName',
                        minWidth: 100,
                        fixed: true,
                    }
                ]
                if (res.ret.errcode == 1) {
                    console.log(res)
                    res.tableData.map(item => {
                        if (item.title == '1') {
                            item.columnName.map(payitem => {
                                if (payitem == 'MY') {
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'myData',

                                        fixed: false,
                                    })
                                } else if (payitem == 'TH') {
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'thData',

                                        fixed: false,
                                    })
                                } else if (payitem == 'SG') {
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'sgData',

                                        fixed: false,
                                    })
                                } else if (payitem == '合计') {
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'totalData',

                                        fixed: 'right',
                                    })
                                }
                            })
                            this.payData = item.listData
                        } else if (item.title == '2') {
                            item.columnName.map(payitem => {
                                if (payitem == 'MY') {
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'myData',

                                        fixed: false,
                                    })
                                } else if (payitem == 'TH') {
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'thData',

                                        fixed: false,
                                    })
                                } else if (payitem == 'SG') {
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'sgData',

                                        fixed: false,
                                    })
                                } else if (payitem == '合计') {
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'totalData',

                                        fixed: 'right',
                                    })
                                }
                            })
                            this.gmvData = item.listData
                        } else if (item.title == '3') {
                            item.columnName.map(payitem => {
                                if (payitem == 'MY') {
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'myData',

                                        fixed: false,
                                    })
                                } else if (payitem == 'TH') {
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'thData',

                                        fixed: false,
                                    })
                                } else if (payitem == 'SG') {
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'sgData',

                                        fixed: false,
                                    })
                                } else if (payitem == '合计') {
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'totalData',

                                        fixed: 'right',
                                    })
                                }
                            })
                            this.newUserData = item.listData
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //按钮点击
        typeClick(index, value) {
            this.isChange = index
            this.checkName = value
            ++this.changeType
            console.log(value, this.changeName)
            this.getOverviewHourlyIncrease(value, this.changeName)
        },
        //页面传值过来是用户还是订单
        changeValue1(value) {
            this.changeName = value
            this.getOverviewHourlyIncrease(this.checkName, this.changeName)
        },
        // 增长趋势
        //增长趋势子组件传值过来
        getBuildUP(data) {
            
            this.buildValue = data.dateTime
            this.buildType = data.name
            this.changeBuildType = data.changeType
            
            this.getOverviewTrendGrap()
        },
        getOverviewTrendGrap() {
            var params = {
                startTime: this.buildValue[0].toString(),
                endTime: this.buildValue[1].toString(),
                countryCode: this.changeBuildType,
                type: this.buildType
            }
            OverviewTrendGrap(params).then(res => {
                console.log(res)
                if (res.ret.errcode == 1) {
                    //前面折线图统一处理
                    if (this.buildType != 6) {
                        var xAxis = []
                        var axle = []
                        var yAixs = []
                        _.forEach(res.graph, (item => {
                            xAxis.push({
                                name: item.type,
                                isShow: item.visible,
                            })
                            _.forEach(item.point, (child) => {
                                child.tag = child.tag.substr(0, 10)
                                child.value = child.volume
                            })
                            yAixs.push(item.point)
                        }))
                        _.forEach(res.graph[0].point, xline => {
                            xline.tag = xline.tag.substr(0, 10)
                            axle.push(xline.tag)
                        })
                        console.log(xAxis, yAixs)
                        this.buildUpData = {
                            xAxis: xAxis,
                            normalData: yAixs,
                            axle: axle
                        }
                    } else {
                        //后面两个饼图分开处理
                        var gmvPieChart = [], salePieChart = []
                        _.forEach(res.chart, (item) => {
                            if (item.type == '支付GMV') {
                                item.slice.map(child => {
                                    child.name = child.tag
                                    child.value = Number(child.volume)
                                    gmvPieChart.push(child)
                                })
                            } else {
                                item.slice.map(child => {
                                    child.name = child.tag
                                    child.value = Number(child.volume)
                                    salePieChart.push(child)
                                })
                            }
                        })
                        this.salePieChart = salePieChart
                        this.gmvPieChart = gmvPieChart
                    }
                }

            })
        },
        //销售增长
        getOverviewYearlySales() {
            var params = {
                startTime:this.saleTime[0].toString(),
                endTime:this.saleTime[1].toString(),
                countryCode: this.saleCountryCode
            }
            OverviewYearlySales(params).then(res => {
                var saleRowData = [], gmvRowData = []
                var saleXaxis = [], saleLenged = [], saleData = []
                var gmvXaxis = [], gmvLenged = [], gmvData = []
                if (res.ret.errcode == 1) {
                    saleRowData = res.data[0].rowData
                    gmvRowData = res.data[1].rowData
                    this.yearSales.saleRowData = saleRowData
                    this.yearGmv.gmvRowData = gmvRowData
                }
                saleXaxis = res.data[0].graphData[0].date
                gmvXaxis = res.data[1].graphData[1].date
                _.forEach(res.data[0].graphData, item => {
                    saleLenged.push(item.type)
                    saleData.push(item.point)
                })
                _.forEach(res.data[1].graphData, item => {
                    gmvLenged.push(item.type)
                    gmvData.push(item.point)
                })
                this.yearSales.xAxis = saleXaxis
                this.yearSales.data = saleData
                this.yearSales.lenged = saleLenged
                this.yearGmv.xAxis = gmvXaxis
                this.yearGmv.lenged = gmvLenged
                this.yearGmv.data = gmvData
                console.log(this.yearGmv, this.yearSales)
            }).catch(error => {
                console.log(error)
            })
        },
        setSale(data) {
            this.saleCountryCode = data
            this.getOverviewYearlySales()
        },
        //国家数据总揽
        getOverviewPlatformWide() {
            var params = {
                countryCode: this.allCountryCode
            }
            OverviewPlatformWide(params).then(res => {
                if (res.ret.errcode == 1) {
                    console.log('国家总揽', res)
                    this.countryData = res.data
                    this.allNum = res.totalUserNum
                    _.forEach(res.num, item => {
                        item.name = item.type
                        item.value = item.number
                    })
                    this.allCountryData = res.num
                }
            }).catch(err => {
                console.log(err)
            })
        },
        setCountryData(data) {
            this.allCountryCode = data
            this.getOverviewPlatformWide()
        }

    }
}
