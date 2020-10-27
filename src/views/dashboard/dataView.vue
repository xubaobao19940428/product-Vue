<template>
    <div class="app-container">
        <div class="loading">
            <img class="loading-img" src="../../assets/images/loader.gif">
        </div>
        <div class="container national-container">
            <div class="header">
                <img src="../../assets/images/bg_header.png"/>
                <p class="header-title">fingo贝叶斯数据平台</p>
                <div class="header-time">
                    <div class="clock-img">
                        <img src="../../assets/images/clock.png"/>
                    </div>
                    <div class="date-time">{{datetime}}</div>
                </div>
            </div>
            <div class="content">
                <div class="left-info">
                    <div class="user-info">
                        <div class="label-item daily-open-item">
                            <div class="title">今日成交</div>
                            <div class="label-text">${{totayGiftAndOrdinary}}</div>
                            <div class="label-text2">￥{{changeRMB(totayGiftAndOrdinary)}}</div>
                        </div>
                        <div class="label-item daily-open-item">
                            <div class="title">今日活跃用户数</div>
                            <div class="label-text">{{ todayRegistrations }}</div>
                        </div>
                        <div class="label-item">
                            <div class="title">普通商品订单数</div>
                            <div class="label-text">{{ totayOrdinaryNum }}</div>
                        </div>
                    </div>
                    <div class="user-info">
                        <div class="label-item">
                            <div class="title">成交记录(11.11)</div>
                            <div class="label-text">${{maximumSingleDayTurnover }}</div>
                            <div class="label-text2">￥{{changeRMB(maximumSingleDayTurnover)}}</div>
                        </div>
                        <div class="label-item">
                            <div class="title">活跃用户数记录</div>
<!--                            <div class="label-text">{{ maximumSingleDayRegistrations }}</div>-->
                            <div class="label-text">72168</div>
                        </div>
                        <div class="label-item">
                            <div class="title">礼包商品订单数</div>
                            <div class="label-text">{{ totayGiftNum }}</div>
                        </div>
                    </div>
                    <div class="trend-info">
                        <div class="title">今日注册及PS数</div>
                        <div id="hourRegisterChart" ></div>
                    </div>
                </div>
                <div class="mid-info">
                    <div class="title mid-title-s">今日交易数据（美元）</div>
                    <div id="hourTurnoverChart"></div>
<!--                    <div id="map-chart"></div>-->
                </div>
                <div class="right-info">
                    <div class="area-info">
                        <div class="title">TOP10 AT/AM </div>
                        <div id="commissionTop10Chart" ></div>
<!--                        <div id="provinceChart"></div>-->
                    </div>
                    <div class="ability-info">
                        <div class="title">成交占比</div>
                        <div id="abilityPieChart"></div>
                        <!--                        <div id="abilityPieChart"></div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { BigScreenData } from '@/request/screendata'
    // import moment from 'moment'
    import echarts from 'echarts'
    export default {
        name: 'dataView',
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
                resetInterval: ''
            }
        },
        created () {
            this.setSize()
        },
        mounted () {
            let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
            this.timer = setInterval(() => {
                _this.datetime = new Date().format('yyyy-MM-dd hh:mm:ss')// 修改数据date
            }, 1000)
            this.getDataSource()
            this.resetInterval = window.setInterval(() => {
                this.getDataSource()
            }, 5 * 1000)
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
            changeRMB (data) {
                return (data * 7.03).toFixed(2)
            },
            setSize () {
                this.labelFontSize = 0.18 * (document.documentElement.clientHeight / 1080) * 100
                
                var width = document.documentElement.clientHeight
                this.fontSize = (width / 1080) * 100
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
                        this.drawHourChart(res.fourHourRegistrations)
                        this.drawCommissionTop10Chart(res.commissionTop_10)
                        this.drawAbilityPieChart(res.totayOrdinaryTurnover, res.totayGiftTurnover)
                        this.drawHourTurnoverChart(res.hourTurnover, res.hourTurnover2)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
            * {
                box-sizing: border-box;
            }

            body, html {
                margin: 0;
                height: 100%;
                font-family: "Helvetica Neue", "Microsoft Yahei", Helvetica, Arial, "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
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

            .loading {
                height: 100%;
                background: radial-gradient(#1d3760, #0d0b13);
                position: relative;
            }

            .loading-img {
                display: inline-block;
                width: 50px;
                height: 50px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -25px;
                margin-left: -25px;
            }

            .container {
                color: #fefefe;
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                background-image: url(../../assets/images/bg.jpg);
                background-size: cover;
                background-position: center;
            }

            .header {
                position: relative;
            }

            .header-title {
                position: absolute;
                bottom: 50%;
                left: 50%;
                -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
                font-size: 0.35rem;
                letter-spacing: 3px;
            }

            .header-time {
                position: absolute;
                bottom: 25%;
                left: 50%;
                -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
                font-size: 0;
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
                line-height: 0.3rem;
                margin-left: 0.1rem;
            }

            .content {
                overflow: hidden;
                margin-top: -0.3rem;
            }

            .left-info {
                margin-top: 0.3rem;
                width: 30%;
                float: left;

                .user-info {
                    float: left;
                    width: 50%;
                }
            }

            .mid-info {
                width: 40%;
                float: left;
            }

            .mid-title-s {
                margin-top: 0.8rem;
            }

            .right-info {
                width: 30%;
                float: left;
            }

            .title {
                font-size: 0.22rem;
                color: #fefefe;
                text-align: center;
                height: 0.45rem;
                line-height: 0.45rem;
                background-image: url(../../assets/images/title_banner.png);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
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
</style>
