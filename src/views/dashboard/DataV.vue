<template>
    <div class="app-container data-view-wrapper">
        <div class="header">
            <img src="../../assets/images/header.png"/>
            <div class="header-content">
                <b>Fingo数据平台</b>
                <span>{{ datetime }}</span>
            </div>
        </div>
        <div class="content">
            <!--上面的部分-->
            <div class="chart_content">
                <!--上面的柱状图翻转-->
                <div class="content_left">
                    <order-data-comp :orderData="orderData" :barData="orderBarData" ref="orderBarData" ></order-data-comp>
                </div>
                <!--折线图部分-->
                <div class="center_center">
                    <div class="title">
                        <span>今日支付GMV ($)</span>
                    </div>
                    <LineChart ref="setLineChart" :lineData="lineData" :fontSize="fontSize" :labelFontSize="labelFontSize"></LineChart>
                </div>
                <!--漏斗图部分-->
                <div class="center_right">
                    <div class="title title1">
                        <span>用户活跃数据（人）</span>
                        <span>更新时间:{{updateTime.substr(10).substr(0,6)}}</span>
                    </div>
                    <DatavAmAt :dauData="dauData"/>
                    <FunnelChart :funnelData="conversionData" ref="funnelChart"></FunnelChart>
                </div>
            </div>
            <!--底下的部分-->
            <div class="chart_content">
                <!--饼图部分-->
                <div class="content_left">
                    <new-user-comp :promotion1="promotion1" :promotion2="promotion2" :promoTotal1="promoTotal1" :promoTotal2="promoTotal2" ref="newUserData"></new-user-comp>
                </div>
                <!--表格部分-->
                <div class="center_center chart_content_b_center">
                    <div class="center_center_left">
                        <div class="title title3">
                            <span>首页模块</span>
                        </div>
                        <div class="center_left-content">
                            <div v-for="(item, index) in indexPageList" :key="index">
                                <div style="width:45%;margin-bottom:0.1rem;box-sizing: border-box;">
                                    <p style="font-size:.15rem;margin-bottom:.1rem">{{item.moduleName}}</p>
                                    <p v-if="item.change.indexOf('-')==-1&&item.change!=''" style="font-size:.18rem;color:#FF0000;white-space: nowrap"><i class="el-icon-top"></i>{{item.change}}</p>
                                    <p v-else-if="item.change.indexOf('-')!=-1&&item.change!=''" style="font-size:.18rem;color:#13CE8C;white-space: nowrap"><i class="el-icon-bottom"></i>{{item.change}}</p>
                                    <p v-else style="font-size:.18rem;white-space: nowrap">--</p>
                                </div>
                                <div style="flex: 1;padding-left:.1rem;font-size:.3rem;color:#00EBFF;box-sizing:border-box;">

                                    <span v-if="item.gmv==''">$0</span>
                                    <span v-else>{{item.gmv}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--热门商品TOP5-->
                    <div class="center_center_right">
                        <div class="title title4"><span>当日TOP5普货</span></div>
                        <HotSaleProductTable :tableData="tableData"></HotSaleProductTable>
                    </div>
                </div>
                <!--柱状图部分-->
                <div class="center_right">
                    <div class="title title5"><span>今日注册数及PS数</span></div>

                    <BarChart :barData="memberBarData" ref="setBarData"></BarChart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { BigScreenData } from '@/request/screendata'
    // import moment from 'moment'

    import echarts from 'echarts'

    import OrderDataComp from './datavComponents/OrderDataComp'
    import DatavTitle from './datavComponents/DatavTitle'
    import NewUserComp from './datavComponents/NewUserComp'
    import LineChart from './datavComponents/LineChart'
    import BarChart from './datavComponents/BarChart'
    import FunnelChart from './datavComponents/FunnelChart'
    import HotSaleProductTable from './datavComponents/HotSaleProductTable'
    import DatavAmAt from './datavComponents/DatavAmAt'
    // 漏斗接口
    import { BigScreenConversion, BigScreenGmvStats, BigScreenModuleStats, BigScreenMemberStats, BigScreenAcquisition, BigScreenDauStats, BigScreenProductSale } from '@/request/dataV'
    export default {
        name: 'dataView',
        inject: ['reload'],
        data () {
            return {
                datetime: '',
                maximumSingleDayTurnover: '', // 单日最高11.11成交额
                maximumSingleDayRegistrations: '', // 最高单日注册量（12.9）
                todayRegistrations: '', // 今日注册量
                totayGiftTurnover: '', // 当日礼包成交额
                totayOrdinaryTurnover: '', // 当日普通商品成交额
                totayOrdinaryNum: '', // 普通商品订单数
                totayGiftNum: '', // 当日礼包订单数
                totayGiftAndOrdinary: '', // 当日礼包加普通商品总
                hourRegisterChart: null, // 小时成交额 + 注册数图表
                commissionTop10Chart: null, // top10的返佣图表
                abilityPieChart: null, // 商品礼包占比饼状图
                abilityData: [], // 商品礼包占比饼状图
                numChart: null, // 订单数图表
                hourTurnoverChart: null, // 订单数图表
                fontSize: '',
                labelFontSize: '',
                resetInterval: '',
                conversionData: [], // 漏斗
                dauData: [],
                updateTime: '',
                tableData: [], // 表格数据
                lineData: {}, // 折线图数据
                orderData: {
                    today: {
                        totalGmv: '1',
                        totalOrderNum: ''
                    },
                    gift: {
                        totalGmv: '1',
                        totalOrderNum: ''
                    },
                    normal: {
                        totalGmv: '1',
                        totalOrderNum: '',
                        totalPricePerOrder: ''
                    }
                }, // 第一个图表左边数据
                orderBarData: {}, // 第一个图表柱状图数据
                indexPageList: [], // 首页数据
                memberBarData: {},
                promotion1: [],
                promotion2: [],
                promoTotal1: '0',
                promoTotal2: '0'// 今日注册数及ps数据
            }
        },
        watch: {
            labelFontSize: {
                handler (newVal, oldVal) {
                    console.log(newVal)
                    this.reload()
                },
                deep: true
            },
            fontSize: {
                handler (newVal, oldVal) {
                    this.reload()
                },
                deep: true
            }
        },
        components: {
            OrderDataComp,
            DatavTitle,
            NewUserComp,
            LineChart,
            BarChart,
            FunnelChart,
            HotSaleProductTable,
            DatavAmAt
        },
        created () {
            this.setSize()
        },
        mounted () {
            this.getBigScreenData()
            this.getGamData()
            this.getBigScreenModuleStats()
            this.getBigScreenMemberStats()
            this.getBigScreenAc()
            this.userDataScreen()
            this.getBigScreenProductSale()
            let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
            this.timer = setInterval(() => {
                _this.setSize()
                _this.datetime = new Date().format('yyyy-MM-dd hh:mm:ss')// 修改数据date
            }, 1000)
            this.getDataSource()
            this.resetInterval = window.setInterval(() => {
                this.getBigScreenData()
                this.getGamData()
                this.getBigScreenModuleStats()
                this.getBigScreenMemberStats()
                this.getBigScreenAc()
                this.userDataScreen()
                this.getBigScreenProductSale()
            }, 10 * 1000)
        },
        beforeDestroy () {
            if (this.timer) {
                clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
            }
            if (this.resetInterval) {
                clearInterval(this.resetInterval) // 在Vue实例销毁前，清除我们的定时器
            }
        },
        methods: {
            getBigScreenProductSale () {
                BigScreenProductSale().then(resultes => {
                    if (resultes.ret.errcode == 1) {
                        this.tableData = resultes.productStats
                        console.log(resultes)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            userDataScreen () {
                BigScreenDauStats({}).then((res) => {
                    if (res.ret.errcode == 1) {
                        console.log(res)
                        this.updateTime = res.updateTime
                        this.dauData = res.dauData
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 对象数组排序
            createComprisonFunction (propertyName) {
                return function (object1, object2) {
                    var value1 = object1[propertyName]
                    var value2 = object2[propertyName]
                    if (value1 < value2) {
                        return -1
                    } else if (value1 > value2) {
                        return 1
                    } else {
                        return 0
                    }
                }
            },
            getBigScreenAc () {
                BigScreenAcquisition({}).then(res => {
                    this.promotion2 = []
                    this.promotion1 = []
                    if (res.ret.errcode == 1) {
                        res.stats.map(item => {
                            if (item.promotionName == '拆红包') {
                                this.promoTotal1 = item.totalRegisterNum
                                item.countryStats.map(children => {
                                    this.promotion1.push({
                                        num: Number(children.registerNum),
                                        value: Number(children.registerNum),
                                        name: children.countryCode
                                    })
                                })
                            } else {
                                this.promoTotal2 = item.totalRegisterNum
                                item.countryStats.map(children => {
                                    this.promotion2.push({
                                        num: Number(children.registerNum),
                                        value: Number(children.registerNum),
                                        name: children.countryCode
                                    })
                                })
                            }
                        })
                        this.promotion1.sort(this.createComprisonFunction('num'))
                        var minValue1 = 10
                        var minValue2 = 10
                        for (var i = 0; i < this.promotion1.length; i++) {
                            minValue1 += 40
                            this.promotion1[i].value = minValue1
                        }

                        this.promotion2.sort(this.createComprisonFunction('num'))
                        for (var i = 0; i < this.promotion2.length; i++) {
                            minValue2 += 40
                            this.promotion2[i].value = minValue2
                        }
                        this.$refs['newUserData'].setOption()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 今日注册数及ps数
            getBigScreenMemberStats () {
                BigScreenMemberStats({}).then(res => {
                    if (res.ret.errcode == 1) {
                        var time = []; var psNum = []; var registerNum = []
                        res.memberStats.map(item => {
                            time.push(item.periodName)
                            psNum.push(Number(item.psNum))
                            registerNum.push(Number(item.registerNum))
                        })
                        this.memberBarData = {
                            time: time,
                            psNum: psNum,
                            registerNum: registerNum
                        }
                        this.$refs['setBarData'].setOption()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // gam看板数据
            getBigScreenModuleStats () {
                BigScreenModuleStats({}).then(res => {
                    if (res.ret.errcode == 1) {
                        this.indexPageList = res.moduleStats
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 第一个图和折线图
            getGamData () {
                BigScreenGmvStats({}).then((resultes) => {
                    if (resultes.ret.errcode == 1) {
                        console.log(resultes)
                        var time = []
                        var normal = []
                        var gift = []
                        // 处理折线图部分
                        resultes.points.map(item => {
                            time.push(item.time)
                            if (item.type == '普貨') {
                                normal.push({
                                    value: Number(item.gmv),
                                    change: item.change != '' ? item.change : '0'
                                })
                            } else {
                                gift.push({
                                    value: Number(item.gmv),
                                    change: item.change != '' ? item.change : '0'
                                })
                            }
                        })
                        var newTime = []
                        for (var el of new Set(time)) {
                            newTime.push(el)
                        }
                        this.lineData = {
                            time: newTime,
                            normal: normal,
                            gift: gift
                        }
                        this.$refs['setLineChart'].setOption()
                        // 处理第一个倒过来的柱状图
                        var today = {}; var normal = {}; var gift = {}
                        var firstData = []; var secondData = []; var thirdData = []
                        resultes.orderStats.map(item => {
                            if (item.countryCode == '') {
                                // 总计数据
                                if (item.type == '總計') {
                                    today = {
                                        totalGmv: item.totalGmv,
                                        totalOrderNum: item.totalOrderNum
                                    }
                                } else if (item.type == '禮包') {
                                    gift = {
                                        totalGmv: item.totalGmv,
                                        totalOrderNum: item.totalOrderNum
                                    }
                                } else {
                                    normal = {
                                        totalGmv: item.totalGmv,
                                        totalOrderNum: item.totalOrderNum,
                                        totalPricePerOrder: Number(item.totalPricePerOrder)
                                    }
                                }
                                this.orderData = {
                                    today: today,
                                    gift: gift,
                                    normal: normal
                                }
                                // this.$refs['orderBarData'].setOption()
                                // 柱状图数据
                            } else {
                                if (item.type == '總計' && item.countryCode != 'ID') {
                                    firstData.push(item)
                                } else if (item.type == '禮包' && item.countryCode != 'ID') {
                                    secondData.push(item)
                                } else if (item.type == '普貨' && item.countryCode != 'ID') {
                                    thirdData.push(item)
                                }
                                var firstmax = Math.max.apply(Math, firstData.map(item => { return item.totalGmv }))
                                var firstmin = Math.min.apply(Math, firstData.map(item => { return item.totalGmv }))
                                var secondmax = Math.max.apply(Math, secondData.map(item => { return item.totalGmv }))
                                var secondmin = Math.min.apply(Math, secondData.map(item => { return item.totalGmv }))
                                var thirdmax = Math.max.apply(Math, thirdData.map(item => { return item.totalGmv }))
                                var thirdmin = Math.min.apply(Math, thirdData.map(item => { return item.totalGmv }))
                                firstData.map(item => {
                                    if (item.totalGmv != 0) {
                                        if (item.totalGmv == firstmax) {
                                            item.progress = 100
                                        } else if (item.totalGmv == firstmin) {
                                            item.progress = 30
                                        } else {
                                            item.progress = 80
                                        }
                                    } else {
                                        item.progress = 10
                                    }
                                })
                                secondData.map(item => {
                                    if (item.totalGmv != 0) {
                                        if (item.totalGmv == secondmax) {
                                            item.progress = 100
                                        } else if (item.totalGmv == secondmin) {
                                            item.progress = 30
                                        } else {
                                            item.progress = 80
                                        }
                                    } else {
                                        item.progress = 10
                                    }
                                })
                                thirdData.map(item => {
                                    if (item.totalGmv != 0) {
                                        if (item.totalGmv == thirdmax) {
                                            item.progress = 100
                                        } else if (item.totalGmv == thirdmin) {
                                            item.progress = 30
                                        } else {
                                            item.progress = 80
                                        }
                                    } else {
                                        item.progress = 10
                                    }
                                })
                                // if(item.countryCode=='MY'){
                                //     MYdata.push({
                                //         countryCode: item.countryCode,
                                //         value: item.totalGmv,
                                //         totalOrderNum: Number(item.totalOrderNum),
                                //         totalPricePerOrder: item.totalPricePerOrder,
                                //         type:item.type
                                //     })
                                // }else if(item.countryCode=='SG'){
                                //     SGdata.push({
                                //         countryCode: item.countryCode,
                                //         value: item.totalGmv,
                                //         totalOrderNum: Number(item.totalOrderNum),
                                //         totalPricePerOrder: item.totalPricePerOrder,
                                //         type:item.type
                                //     })
                                // }else if(item.countryCode=='TH'){
                                //     THdata.push({
                                //         countryCode: item.countryCode,
                                //         value: item.totalGmv,
                                //         totalOrderNum: Number(item.totalOrderNum),
                                //         totalPricePerOrder: item.totalPricePerOrder,
                                //         type:item.type
                                //     })
                                // }
                            }
                        })
                        this.orderBarData = {
                            firstData: firstData,
                            secondData: secondData,
                            thirdData: thirdData
                        }
                        console.log(this.orderBarData)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            // 漏斗图表接口
            getBigScreenData () {
                BigScreenConversion({}).then((res) => {
                    if (res.ret.errcode == 1) {
                        console.log(res)
                        this.conversionData = [

                            { trueValue: res.loginRate,
                              value: 100,
                              name: '登录转化率'
                            },
                            { trueValue: res.browseRate,
                              value: 80,
                              name: '浏览转化率'
                            },
                            { trueValue: res.orderRate,
                              value: 60,
                              name: '购买转化率'
                            },
                            { trueValue: res.payRate,
                              value: 40,
                              name: '支付转化率'
                            },
                            { trueValue: res.completeRate,
                              value: 20,
                              name: '成功支付率'
                            }
                        ]
                        this.$refs['funnelChart'].setOption()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            changeRMB (data) {
                return (data * 7.03).toFixed(2)
            },
            setSize () {
                this.labelFontSize = 0.18 * (document.documentElement.clientHeight / 1080) * 100
                localStorage.setItem('labelFontSize', this.labelFontSize)
                var width = document.documentElement.clientHeight
                this.fontSize = (width / 1080) * 100
                localStorage.setItem('fontSize', this.fontSize)
                document.getElementsByTagName('html')[0].style.fontSize = this.fontSize + 'px'
            },
            // 绘制四小时注册数图表 折线图
            drawHourChart (fourHourRegistrations = []) {
                if (this.hourRegisterChart) {
                    this.hourRegisterChart.clear()
                } else {
                    this.hourRegisterChart = echarts.init(document.getElementById('hourRegisterChart'))
                }
                let userTotalNumList = []
                let psNumList = []
                let timeList = []
                fourHourRegistrations.forEach(item => {
                    userTotalNumList.push(item.userTotalNum)
                    psNumList.push(item.psNum)
                    timeList.push(moment(parseInt(item.time)).format('HH') + '时')
                })
                let that = this
                let options = {
                    color: ['#E9E67A', '#3FDCDC'],
                    grid: {
                        left: 0.3 * that.fontSize,
                        right: 0.2 * that.fontSize,
                        top: 0.7 * that.fontSize,
                        bottom: 0,
                        containLabel: true
                    },
                    tooltip: { trigger: 'axis' },
                    legend: {
                        x: 'center',
                        y: 'top',
                        itemWidth: 18,
                        itemHeight: 10,
                        textStyle: {
                            color: '#ffffff',
                            fontSize: that.labelFontSize
                        },
                        data: ['注册数', 'ps数']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: timeList,
                            axisTick: { show: false },
                            axisLine: {
                                lineStyle: {
                                    color: '#ffffff'
                                }
                            },
                            axisLabel: {
                                color: '#ffffff',
                                fontSize: that.labelFontSize
                            }
                        }
                    ],
                    yAxis: {
                        nameTextStyle: {
                            color: '#ffffff',
                            fontSize: that.labelFontSize,
                            align: 'left'
                        },
                        type: 'value',
                        axisTick: { show: false },
                        axisLabel: {
                            fontSize: that.labelFontSize,
                            color: '#ffffff'
                        },
                        axisLine: { show: false },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(52, 58, 81, 0.2)'
                            }
                        }
                    },
                    series: [
                        {
                            name: '注册数',
                            type: 'line',
                            symbolSize: 6,
                            label: {
                                show: true,
                                fontSize: that.labelFontSize * 0.7,
                                formatter: function (params) {
                                    if (params.dataIndex == 0 || params.dataIndex == fourHourRegistrations.length - 1) {
                                        return that.formatNum(params.data)
                                    } else {
                                        return ''
                                    }
                                }
                            },
                            stack: 'a',
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(63, 220, 220, 0.1)'
                                }, {
                                    offset: 1,
                                    color: '#131a2d'
                                }])
                            },
                            data: userTotalNumList,
                            itemStyle: { normal: { label: { show: true } } }
                        },
                        {
                            name: 'ps数',
                            type: 'line',
                            symbolSize: 6,
                            label: {
                                show: true,
                                fontSize: that.labelFontSize * 0.7,
                                formatter: function (params) {
                                    if (params.dataIndex == 0 || params.dataIndex == fourHourRegistrations.length - 1) {
                                        return that.formatNum(params.data)
                                    } else {
                                        return ''
                                    }
                                }
                            },
                            stack: 'b',
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(63, 220, 220, 0.1)'
                                }, {
                                    offset: 1,
                                    color: '#131a2d'
                                }])
                            },
                            data: psNumList,
                            itemStyle: { normal: { label: { show: true } } }
                        }
                    ]
                }

                this.hourRegisterChart.setOption(options)
            },
            formatNum (num) {
                return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            },
            drawCommissionTop10Chart (commissionTop10 = []) {
                if (this.commissionTop10Chart) {
                    this.commissionTop10Chart.clear()
                } else {
                    this.commissionTop10Chart = echarts.init(document.getElementById('commissionTop10Chart'))
                }
                let data = []
                let nickNameList = []
                let maxList = []
                let max = 0
                // commissionTop10 = commissionTop10.sort(this.compare('commissionAmount'))

                commissionTop10.forEach(item => {
                    max = item.commissionAmount > max ? item.commissionAmount : max
                    data.push({
                        value: item.commissionAmount,
                        name: item.nickName
                    })
                    nickNameList.push(item.nickName)
                })
                maxList = new Array(commissionTop10.length).fill(max)
                let that = this

                let options = {
                    color: ['#3FDCDC', '#E9E67A'],
                    grid: {
                        top: 0.4 * that.fontSize,
                        left: 1 * that.fontSize,
                        right: 0.8 * that.fontSize,
                        bottom: 0,
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: function (params) {
                            return params[1].name + '<br/>' + params[1].marker + params[1].seriesName + ': ' + params[1].value.toLocaleString()
                        }
                    },
                    legend: {
                        left: 'center',
                        itemWidth: 18,
                        itemHeight: 10,
                        textStyle: {
                            color: '#ffffff',
                            fontSize: 0.2 * that.fontSize
                        },
                        data: ['累计开户', '累计通话']
                    },
                    xAxis: { show: false },
                    yAxis: {
                        type: 'category',
                        data: nickNameList,
                        axisTick: { show: false },
                        axisLabel: {
                            fontSize: 0.2 * that.fontSize,
                            color: '#ffffff'
                        },
                        axisLine: { show: false }
                    },
                    series: [
                        {
                            show: true,
                            type: 'bar',
                            barGap: '-100%',
                            barWidth: '50%', // 统计条宽度
                            itemStyle: {
                                normal: {
                                    color: 'rgb(131, 131, 131, 0.2)'
                                }
                            },
                            z: 1,
                            data: maxList
                        },
                        {
                            name: '累计返佣金额',
                            type: 'bar',
                            label: {
                                show: true,
                                fontSize: 0.18 * that.fontSize,
                                position: 'right',
                                formatter: function (params) {
                                    return params.value.toLocaleString()
                                }
                            },
                            data: data,
                            barGap: '-100%',
                            barWidth: '50%',
                            z: 2
                        }
                    ]
                }

                this.commissionTop10Chart.setOption(options)
            },
            // 占比饼状图
            drawAbilityPieChart (totayOrdinaryTurnover = '', totayGiftTurnover = '') {
                let abilityPiedata = [{ value: totayOrdinaryTurnover, name: '普通商品' }, { value: totayGiftTurnover, name: '礼包商品' }]
                var randomData = []
                for (var i = 0; i < 40; i++) {
                    randomData[i] = 1
                }
                if (this.abilityPieChart) {
                    this.abilityPieChart.clear()
                } else {
                    this.abilityPieChart = echarts.init(document.getElementById('abilityPieChart'))
                }
                let that = this
                var option = {
                    color: ['#23ADFF', '#3FDCDC'],
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: [
                        {
                            name: '多形态设备占比',
                            type: 'pie',
                            radius: ['30%', '45%'],
                            center: ['51%', '50%'],
                            startAngle: 45,
                            data: abilityPiedata,
                            label: {
                                formatter: function (params) {
                                    console.log(params)
                                    return params.name + ': ' + '\n' + params.percent + '%' + '\n' + '$' + params.value
                                },
                                fontSize: 0.2 * that.fontSize
                            }
                        },
                        {
                            type: 'pie',
                            silent: 'true',
                            radius: ['18%', '23%'],
                            center: ['51%', '50%'],
                            data: randomData,
                            label: { show: false },
                            labelLine: { show: false },
                            itemStyle: {
                                color: '#0d386a',
                                borderWidth: 4,
                                borderColor: 'rgba(0,0,0,0)'
                            }
                        }
                    ]
                }
                this.abilityPieChart.setOption(option)
            },
            // 交易额数据展示
            drawHourTurnoverChart (hourTurnover = [], hourTurnover2 = []) {
                var list = [90764, 27159, 9754, 3930, 3720, 10919, 16159, 23405, 30620, 56132, 113127, 98621, 67891, 52288, 54336, 38627, 50968, 90718, 114851, 64675, 91090, 102350]
                var listNew = []
                for (let i = 0; i < hourTurnover.length; i++) {
                    listNew.push((list[i] / 4.17).toFixed(2))
                }
                var timeList = []
                var giftTurnoverList = []
                var ordinaryTurnoverList = []
                for (let i = 0; i < hourTurnover.length; i++) {
                    timeList.push(moment(parseInt(hourTurnover[i].time)).format('HH') + '时')
                    giftTurnoverList.push((hourTurnover[i].giftTurnover).replace(/\.(.*)/g, ''))
                    ordinaryTurnoverList.push((hourTurnover[i].ordinaryTurnover).replace(/\.(.*)/g, ''))
                }
                var timeList2 = []
                // var giftTurnoverList2 = []
                // var ordinaryTurnoverList2 = []
                var totalTurnoverList2 = []
                for (let i = 0; i < hourTurnover2.length; i++) {
                    timeList2.push(moment(parseInt(hourTurnover2[i].time)).format('HH') + '时')
                    // giftTurnoverList2.push((hourTurnover2[i].giftTurnover).replace(/\.(.*)/g, ''))
                    // ordinaryTurnoverList2.push((hourTurnover2[i].ordinaryTurnover).replace(/\.(.*)/g, ''))
                    totalTurnoverList2.push((hourTurnover2[i].totalTurnover).replace(/\.(.*)/g, ''))
                }
                if (this.hourTurnoverChart) {
                    this.hourTurnoverChart.clear()
                } else {
                    this.hourTurnoverChart = echarts.init(document.getElementById('hourTurnoverChart'))
                }
                let that = this
                var option = {
                    color: ['#E9E67A', '#3FDCDC'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: [{
                                 x: 'center',
                                 y: 'top',
                                 // itemWidth: 18,
                                 // itemHeight: 10,
                                 textStyle: {
                                     color: '#ffffff',
                                     fontSize: that.labelFontSize
                                 },
                                 data: ['普通商品', '礼包商品']
                             },
                             {
                                 data: ['记录成交额', '今日成交额'],
                                 top: '60%',
                                 textStyle: {
                                     color: '#ffffff'
                                 }
                             }],
                    grid: [{
                        left: 0.3 * that.fontSize,
                        right: 0.4 * that.fontSize,
                        // height: 0.6 * that.fontSize,
                        height: '40%',
                        containLabel: true
                    }, {
                        left: '3%',
                        right: '4%',
                        top: '68%',
                        height: '20%',
                        containLabel: true
                    }],
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: timeList,
                        gridIndex: 0,
                        axisTick: { show: false },
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff'
                            }
                        },
                        axisLabel: {
                            color: '#ffffff',
                            fontSize: that.labelFontSize
                            // rotate: 45
                        }
                    }, {
                        type: 'category',
                        data: timeList2,
                        gridIndex: 1,
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff'
                            }
                        }
                    }],
                    yAxis: [
                        {
                            nameTextStyle: {
                                color: '#ffffff',
                                fontSize: that.labelFontSize,
                                align: 'left'
                            },
                            type: 'value',
                            axisTick: { show: false },
                            axisLabel: {
                                fontSize: that.labelFontSize,
                                color: '#ffffff'
                            },
                            axisLine: { show: false },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(52, 58, 81, 0.2)'
                                }
                            },
                            gridIndex: 0
                        }, {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                fontSize: that.labelFontSize,
                                color: '#ffffff'
                            },
                            gridIndex: 1
                        }],
                    series: [
                        {
                            name: '普通商品',
                            type: 'line',
                            data: ordinaryTurnoverList,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        fontSize: that.labelFontSize * 0.6
                                    } } },
                            xAxisIndex: 0,
                            yAxisIndex: 0
                        },
                        {
                            name: '礼包商品',
                            type: 'line',
                            data: giftTurnoverList,
                            itemStyle: { normal: { label: {
                                show: true,
                                fontSize: that.labelFontSize * 0.6
                            } } },
                            xAxisIndex: 0,
                            yAxisIndex: 0
                        },
                        {
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            name: '记录成交额',
                            // itemStyle: { normal: { label: { show: true } } },
                            data: listNew
                        }, {
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            name: '今日成交额',
                            itemStyle: { normal: { label: {
                                show: true,
                                fontSize: that.labelFontSize * 0.5 } } },
                            data: totalTurnoverList2
                        }
                    ]
                }
                this.hourTurnoverChart.setOption(option)
            },
            getDataSource () {
                let params = {}
                BigScreenData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.maximumSingleDayTurnover = (res.maximumSingleDayTurnover).replace(/\.(.*)/g, '')// 单日最高11.11成交额
                        this.maximumSingleDayRegistrations = res.maximumSingleDayRegistrations // 最高单日注册量（12.9）
                        this.todayRegistrations = res.todayRegistrations // 今日注册量
                        this.totayGiftTurnover = res.totayGiftTurnover // 当日礼包成交额
                        this.totayOrdinaryTurnover = res.totayOrdinaryTurnover // 当日普通商品成交额
                        this.totayOrdinaryNum = res.totayOrdinaryNum // 普通商品订单数
                        this.totayGiftNum = res.totayGiftNum // 当日礼包订单数
                        this.totayGiftAndOrdinary = parseInt(res.totayGiftTurnover) + parseInt(res.totayOrdinaryTurnover)
                        // this.drawHourChart(res.fourHourRegistrations)
                        this.drawCommissionTop10Chart(res.commissionTop_10)
                        // this.drawAbilityPieChart(res.totayOrdinaryTurnover, res.totayGiftTurnover)
                        // this.drawHourTurnoverChart(res.hourTurnover, res.hourTurnover2)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .data-view-wrapper{
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #050f3a;
        color: #fff;
        .header {
            position: relative;
            width: 100%;
            img{
                width: 100%;
                display: flex;
            }
            .header-content{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: 0;
                top: 0;
                box-sizing: border-box;
                b{
                    font-size: 0.35rem;
                }
                span{
                    font-size: 0.15rem;
                    margin-top: 0.10rem;
                }
            }

        }
        .content{
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
            padding: 0.15rem;
            .chart_content{
                flex: 1;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                overflow: hidden;
                .content_left{
                    width:32%;
                    height:100%;
                    border:1px solid #233f79;
                    box-sizing:border-box;
                    padding: .10rem 0.05rem;
                    background: #09153D;
                    overflow: hidden;
                }
                .center_center{
                    flex: 1;
                    margin:0 .16rem;
                    height:100%;
                    border:1px solid #233f79;
                    box-sizing:border-box;
                    padding: .10rem 0.05rem;
                    background: #09153D;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .center_right{
                    height:100%;
                    width:28%;
                    border:1px solid #233f79;
                    box-sizing:border-box;
                    padding: .10rem 0.05rem;
                    background: #09153D;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .chart_content_b_center{
                    display: flex;
                    flex-direction: row;
                    border: 0;
                    padding: 0;
                    .center_center_left{
                        height:100%;
                        width:35%;
                        border:1px solid #233f79;
                        padding:0.125rem 0.07rem 0 0.07rem;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        .center_left-content{
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            >div{
                                display: flex;
                                align-items: center;
                                margin-top: .10rem;
                            }
                        }
                    }
                    .center_center_right{
                        flex: 1;
                        height:100%;
                        overflow: hidden;
                        border:1px solid #233f79;
                        margin-left:0.145rem;
                        padding:0.125rem 0.1rem 0.15rem 0.1rem;
                        box-sizing: border-box;
                    }
                }
            }
            .chart_content:nth-child(1) {
                margin-bottom: 0.16rem;
            }
        }
    }
    p {
        margin: 0;
    }
    img {
        width: 100%;
    }

    .color-1 {
        color: #4d91ff;
    }

    .color-2 {
        color: #c39c53;
    }
    .clock-img {
        width: 0.15rem;
        height: 0.3rem;
        float: left;
        position: relative;
    }

    .clock-img img {
        position: absolute;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    .date-time {
        font-size: 0.15rem;
        display: inline-block;
        float: left;
        margin-top:.1rem;
        margin-left: 0.1rem;
    }

    .content {
        overflow: hidden;
    }

    .left-info {
        margin-top: 0.3rem;
        width: 26%;
        float: left;

        .user-info {
            float: left;
            width: 50%;
        }
    }

    .mid-info {
        width: 48%;
        float: left;
    }

    .mid-title-s {
        margin-top: 0.8rem;
    }

    .right-info {
        width: 26%;
        float: left;
    }

    .title {
        font-size: .15rem;
        color: #fefefe;
        width:100%;
        height:0.395rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-image: url(../../assets/images/title-header1.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-sizing: border-box;
        padding: .05rem .22rem 0;
    }
    .title1{
        background-image: url(../../assets/images/title-header2.png);
    }
    .title2{
        background-image: url(../../assets/images/title-header3.png);
    }
    .title3{
        background-image: url(../../assets/images/title-header4.png);
    }
    .title4{
        background-image: url(../../assets/images/title-header5.png);
    }
    .title5{
        background-image: url(../../assets/images/title-header6.png);
    }
    .m-top {
        margin-top: 0.3rem;
    }

    .label-text {
        font-size: 0.55rem;
        text-align: center;
        color: #2BE7FF;
        height: 0.55rem;
        line-height: 0.55rem;
        background-image: url(../../assets/images/num_banner.png);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin: 0.15rem 0 0.2rem;
    }

    .label-text2 {
        font-size: 0.2rem;
        text-align: center;
        color: #2BE7FF;
        height: 0.55rem;
        line-height: 0.55rem;
        background-image: url(../../assets/images/num_banner.png);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin: 0.15rem 0 0.2rem;
    }

    .trend-info {
        margin-top: 5rem;
    }
    #hourRegisterChart {
        height: 3.4rem;
        margin-top: 0.2rem;
    }

    #hourTurnoverChart {
        height: 8.0rem;
        margin-top: 0.2rem;
    }

    #commissionTop10Chart {
        height: 4.3rem;
        margin-top: 0.1rem;
    }

    #abilityPieChart {
        height: 3.5rem;
    }

    .ability-info {
        margin-top: 0.5rem;
    }

    .ability-table {
        width: 100%;
        border-collapse: collapse;
    }

    .ability-table td {
        font-size: 0.2rem;
        color: #c39c53;
    }

    .td-num {
        text-align: right;
    }

    .province-container {
        padding: 0.3rem 0.4rem 0;
    }

    .user-count {
        padding-left: 0.1rem;
        font-size: 0.3rem;
        margin-top: 0.2rem;
    }

    .province-ct {
        overflow: hidden;
    }

    .chart-ct {
        width: 48%;
        float: left;
        margin-right: 2%;
        background-color: rgba(13, 11, 19, 0.1);
        padding: 0.1rem;
        margin-top: 0.3rem;
    }

    .chart {
        height: 3rem;
    }

    .btn-return {
        text-align: right;
        font-size: 0.2rem;
        cursor: pointer;
    }
    .index-page-module {
        border: 1px solid #3a74bb;
        padding: 8px;
        font-size: 16px;
        .title {
            height: 30px;
        }
        .top-item {
            height: 0.2rem;
            margin-bottom: 0.05rem;
            .left {
                height: 0.2rem;
                width: 45%;
                display: inline-block;
                padding-top: 6px;
                font-size:0.18rem;
                p {
                    color: #ff0000;
                    padding: 6px 0;
                }
            }
            .right {
                width: 55%;
                font-size: 0.11rem;
                display: inline-block;
                color: #00ebff;
                height: 0.2rem;
                line-height: .2rem;
            }
        }
    }
    .hot-sale {
        border: 1px solid #3a74bb;
        padding: 8px;
    }
    .hot-top{
        margin-top:20px;
    }
    .ability-info,.area-info{

        margin-top:20px;
    }
    .user-at{
        border: 1px solid #3a74bb;
        padding:10px;
        box-sizing:border-box;
    }
    .today-ps{
        margin-top:20px;
        border: 1px solid #3a74bb;
        height:350px;
    }
    /deep/.center_top_left {
        height: 0.2rem;
        width: 45%;
        display: inline-block;
        padding-top: 6px;
        font-size:0.18rem;
        p {
            color: #ff0000;
            padding: 6px 0;
        }
    }
    /deep/ .center_top_right {
        width: 55%;
        font-size: 0.11rem;
        display: inline-block;
        color: #00ebff;
        height: 0.2rem;
        line-height: .2rem;
    }
    .bkml-top{
        position: absolute;
        top: 10px;
        bottom: 10px;
        left: 10px;
        right: 10px;
        clip-path:
            polygon(
                    0 0, calc(100% - 45px) 0, 100% 48px,
                    100% calc(100%), calc(100%) 100%,
                    45px 100%, 0 calc(100% - 45px), 0 45px
            );

    }
</style>
