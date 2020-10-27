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
import {OverviewTodayWatch,OverviewTodayTable,OverviewHourlyIncrease,OverviewOrdinaryGoods} from '@/request/dataV'
import mixins from './mixins'
import echarts from 'echarts'
import moment from 'moment'
export default {
    mixins: [mixins],
    
    data () {
        return {
            resetInterval:null,
            checkButton:[
                {name:'全部',value:'All'},
                {name:'MY',value:'MY'},
                {name:'TH',value:'TH'},
                {name:'SG',value:'SG'},
                {name:'ID',value:'ID'}
            ],
            isChange:0,
            checkName:'all',
            changeName:'1',
            changeType:0,
            todayGiftGmv:{},
            todaynormalGmv:{},
            todayUser:{},
            changeNormal:{},
            // 中间表格
            payData:[],
            gmvData:[],
            todayTime:'',
            gmvTableAttrData:[
                {
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed:'left',
                }
            ],
            payTableAttrData:[
                {
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed:'left',
                }
            ],
            newUserData:[],
            newUserTableAttrData:[
                {
                    lable: '',
                    name: '',
                    value: 'rowName',
                    minWidth: 100,
                    fixed:'left',
                }
            ],
            //图表
            hoursLineData:{
                xAxis:[],
                payNum:[],
                sealNum:[]
            },
            hoursBarData:{
                xAxis:[],
                payBarNum:[],
                sealBarNum:[]
            },
            //今天时间top30数据
            todayTime:[new Date(new Date().toLocaleDateString()).getTime(),
                new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000) - 1)],
            myData:[],
            thData:[],
            //
            orderDataList: [],
            polar1: {
                ready: false,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['订单总计', '礼包订单', '普通商品订单', '礼包销售额', '普通订单销售额'],
                    top: 30,
                    right: 0
                },
                xAxis: {
                    data: [],
                    boundaryGap: false
                },
                yAxis: {},
                series: [{
                    name: '订单总计',
                    type: 'line',
                    areaStyle: {},
                    data: []
                }, {
                    name: '礼包订单',
                    type: 'line',
                    areaStyle: {},
                    data: []
                }, {
                    name: '普通商品订单',
                    type: 'line',
                    areaStyle: {},
                    data: []
                }, {
                    name: '礼包销售额',
                    type: 'line',
                    areaStyle: {},
                    data: []
                }, {
                    name: '普通订单销售额',
                    type: 'line',
                    areaStyle: {},
                    data: []
                }]
            },
            polar2: {
                ready: false,

                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                    data: ['粉丝', '会员', '经理', '总经理'],
                    bottom: 0
                },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    label: {
                        normal: {
                            formatter: '{b}: {c} ({d}%)'
                        }
                    },
                    data: [{
                        name: '粉丝',
                        itemStyle: {
                            normal: {
                                color: '#67B9F1'
                            }
                        },
                        value: ''
                    }, {
                        name: '会员',
                        itemStyle: {
                            normal: {
                                color: '#01A293'
                            }
                        },
                        value: ''
                    }, {
                        name: '经理',
                        itemStyle: {
                            normal: {
                                color: '#F16798'
                            }
                        },
                        value: ''
                    }, {
                        name: '总经理',
                        itemStyle: {
                            normal: {
                                color: '#6767F1'
                            }
                        },
                        value: ''
                    }]
                }]
            },
            polar3: {
                ready: false,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['新注册用户', '新增粉丝', '新增会员', '新增经理', '新增总经理'],
                    top: 30,
                    right: 0
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: '新注册用户',
                    type: 'line',
                    data: []
                }, {
                    name: '新增粉丝',
                    type: 'line',
                    data: []
                }, {
                    name: '新增会员',
                    type: 'line',
                    data: []
                }, {
                    name: '新增经理',
                    type: 'line',
                    data: []
                }, {
                    name: '新增总经理',
                    type: 'line',
                    data: []
                }]
            },
            orderStatusInfo: {},
            orderStatistics: {},
            OrderTradeChartCountList: {},
            userStatistics: {},
            productInfo: {},
            proTimeList: [],
            orderTimeList: [],
            orderStatusTimeList: [],
            userTimeList: [],
            hourRegisterChart: null, // 小时成交额 + 注册数图表
        }
    },
    watch:{
        checkName:{
            handler(newVal,oldVal) {
                console.log(newVal)
            },
            deep: true
        },
        changeValue:{
            handler(newVal,oldVal){
                console.log(newVal)
            },
            deep:true
        }
    },
    mounted () {
        this.getOrderTradeStatistics()
        this.getOrderStatus()
        this.getOrderTrade()
        this.getOrderStatistics()
        this.getProductStatistics()
        this.getUserChartData()
        this.getUserStatistics()
        this.getDataSource()
        this.getOrderTradeChartCount()
        //目前数据概览部分
        this.getOverviewTodayWatch()
        this.getOverviewTodayTable()
        this.getOverviewHourlyIncrease('all','1')
        console.log(this.todayTime)
        this.getOverviewOrdinaryGoods(this.todayTime,'1')
        this.resetInterval = window.setInterval(() => {
           this.getOverviewTodayWatch() 
        }, 5 * 1000)
        this.getTodayTime()
    },
    beforeDestroy () {
        if (this.resetInterval) {
            clearInterval(this.resetInterval) // 在Vue实例销毁前，清除我们的定时器
        }
    },
    // beforeDestroy () {
    //     if (this.resetInterval) {
    //         clearInterval(this.resetInterval) // 在Vue实例销毁前，清除我们的定时器
    //     }
    // },
    methods: {
        getTodayTime(){
            var todayTime = new Date()
            var Y = todayTime.getFullYear()
            var M = todayTime.getMonth()
            var D = todayTime.getDate()
            if(M<10){
                M='0'+(M+1)
            }
            if(D<10){
                D='0'+D
            }
            this.todayTime = Y+'/'+M+'/'+D
          },
        //普通商品Top30
        getOverviewOrdinaryGoods(date,orderBy){
            OverviewOrdinaryGoods({startTime:date[0].toString(),endTime:date[1].toString(),orderBy:orderBy}).then(res=>{
                console.log(res)
                if(res.ret.errcode==1){
                    res.rankData.map(item=>{
                        if(item.title=='MY'){
                            this.myData=item.rowData
                        }else if(item.title=='TH'){
                            this.thData = item.rowData
                        }
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        //接受top子组件传值
        topChange(data){
            this.getOverviewOrdinaryGoods(data.todayTime,data.changeType)
        },
        //图形部分
        getOverviewHourlyIncrease(countryCode,type){
            this.hoursLineData.xAxis = []
            this.hoursLineData.payNum = []
            this.hoursLineData.sealNum = []
            this.hoursBarData.xAxis=[]
            this.hoursBarData.payBarNum=[]
            this.hoursBarData.sealBarNum=[]
            OverviewHourlyIncrease({countryCode:countryCode,type:type}).then(res=>{
               console.log(res)
                var xAxis=[],payNum=[],sealNum=[],payBarNum=[],sealBarNum=[]
                if(res.ret.errcode==1){
                    if(type=='1'){
                        res.graphData.map(item=>{
                            if(item.type=='支付订单数'){
                                item.pointData.map(xline=>{
                                    xAxis.push(xline.tag)
                                    payNum.push(xline.volume)
                                })
                            }else if(item.type=='售出件数'){
                                item.pointData.map(xline=>{
                                    sealNum.push(xline.volume)
                                })
                                
                            }else if(item.type=='支付订单数增長'){
                                item.pointData.map(paybar=>{
                                    payBarNum.push(paybar.volume)
                                })
                            }else if(item.type=='售出件数增長'){
                                item.pointData.map(sealnum=>{
                                    sealBarNum.push(sealnum.volume)
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
                    }else{
                        res.graphData.map(item=>{
                            if(item.type=='注冊用戶'){
                                item.pointData.map(xline=>{
                                    xAxis.push(xline.tag)
                                    payNum.push(xline.volume)
                                })
                            }else if(item.type=='新增PS數'){
                                item.pointData.map(xline=>{
                                    sealNum.push(xline.volume)
                                })
                            }else if(item.type=='注冊用戶增長'){
                                item.pointData.map(xline=>{
                                    payBarNum.push(xline.volume)
                                }) 
                            }else if(item.type=='新增PS數增長'){
                                item.pointData.map(xline=>{
                                    sealBarNum.push(xline.volume)
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
            }).catch(err=>{
                console.log(err)
            })
        },
        //数据概览头部四个card数据
        getOverviewTodayWatch(){
            OverviewTodayWatch({}).then(res=>{
                if(res.ret.errcode==1){
                    res.boardData.map(item=>{
                        if(item.type=='今日礼包支付GMV'){
                            this.todayGiftGmv = item
                        }else if(item.type=='今日普货支付GMV'){
                            this.todaynormalGmv = item
                        }else if(item.type=='今日活跃用户数'){
                            this.todayUser = item
                        }else if(item.type=='普货转化率'){
                            this.changeNormal = item
                        }
                    })
                }
                console.log(this.todayUser)
            }).catch(err=>{
                console.log(err)
            })
        },
        
        //中间表格部分
        getOverviewTodayTable(){
            OverviewTodayTable({}).then(res=>{
                this.payTableAttrData=[{
                        lable: '',
                        name: '',
                        value: 'rowName',
                        minWidth: 100,
                        fixed:true,
                    }]
                    this.gmvTableAttrData=[
                        {
                            lable: '',
                            name: '',
                            value: 'rowName',
                            minWidth: 100,
                            fixed:true,
                        }
                    ]
                   
                    this.newUserTableAttrData=[
                        {
                            lable: '',
                            name: '',
                            value: 'rowName',
                            minWidth: 100,
                            fixed:true,
                        }
                    ]
                if(res.ret.errcode==1){
                    console.log(res)
                    res.tableData.map(item=>{
                        if(item.title=='1'){
                            item.columnName.map(payitem=>{
                                if(payitem=='MY'){
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'myData',
                                        
                                        fixed:false, 
                                    })
                                }else if(payitem=='TH'){
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'thData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='SG'){
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'sgData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='合计'){
                                    this.payTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'totalData',
                                       
                                        fixed:'right', 
                                    })
                                }
                            })
                            this.payData=item.listData
                        }else if(item.title=='2'){
                            item.columnName.map(payitem=>{
                                if(payitem=='MY'){
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'myData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='TH'){
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'thData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='SG'){
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'sgData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='合计'){
                                    this.gmvTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'totalData',
                                       
                                        fixed:'right', 
                                    })
                                }
                            })
                            this.gmvData=item.listData
                        }else if(item.title=='3'){
                            item.columnName.map(payitem=>{
                                if(payitem=='MY'){
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'myData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='TH'){
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'thData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='SG'){
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'sgData',
                                       
                                        fixed:false, 
                                    })
                                }else if(payitem=='合计'){
                                    this.newUserTableAttrData.push({
                                        lable: payitem,
                                        name: payitem,
                                        value: 'totalData',
                                       
                                        fixed:'right', 
                                    })
                                }
                            })
                            this.newUserData=item.listData
                        }
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        //按钮点击
        typeClick(index,value){
           this.isChange = index
           this.checkName = value
           this.changeName = '1'
           ++this.changeType
           this.getOverviewHourlyIncrease(value,'1')
        },
        //页面传值过来是用户还是订单
        changeValue1(value){
            this.changeName = value
            this.getOverviewHourlyIncrease(this.checkName,this.changeName)
        },
        // 订单总数统计
        async getOrderStatistics () {
            OrderTradeCount({}).then((res) => {
                if (res.ret.errcode === 1) {
                    this.orderStatistics = res.data
                }
            })
        },
        // 订单交易数统计-统计折线图 上面的四块
        async getOrderTradeChartCount () {
            OrderTradeChartCount({}).then((res) => {
                if (res.ret.errcode === 1) {
                    this.OrderTradeChartCountList = res.data
                }
            })
        },
        // 获取订单状态
        getOrderStatus () {
            this.orderStatusTimeList = this.orderStatusTimeList ? this.orderStatusTimeList : []
            PlatformOrderStatus({
                startTime: !this.orderStatusTimeList[0] ? null : this.orderStatusTimeList[0],
                endTime: !this.orderStatusTimeList[1] ? null : this.orderStatusTimeList[1]
            }).then((res) => {
                if (res.ret.errcode === 1) {
                    this.orderStatusInfo = res.data
                }
            })
        },
        // 订单交易数折线图
        getOrderTrade () {
            this.orderTimeList = this.orderTimeList ? this.orderTimeList : []
            OrderTradeChart({
                startTime: !this.orderTimeList[0] ? null : this.orderTimeList[0],
                endTime: !this.orderTimeList[1] ? null : this.orderTimeList[1]
            }).then((res) => {
                if (res.ret.errcode === 1) {
                    let array = res.chart
                    this.polar1.xAxis.data = []
                    this.polar1.series[0].data = []
                    this.polar1.series[1].data = []
                    this.polar1.series[2].data = []
                    this.polar1.series[3].data = []
                    this.polar1.series[4].data = []
                    array.map((item, index) => {
                        this.polar1.xAxis.data.push(item.date.slice(0, 10))
                        this.polar1.series[0].data.push(item.totalOrderNum || 0)
                        this.polar1.series[1].data.push(item.giftOrderNum || 0)
                        this.polar1.series[2].data.push(item.ordinaryOrderNum || 0)
                        this.polar1.series[3].data.push(item.giftOrderAmount || 0)
                        this.polar1.series[4].data.push(item.ordinaryOrderAmount || 0)
                    })
                    this.polar1.ready = true
                }
            })
        },
        // 商品信息统计
        getProductStatistics () {
            ProductInfo({}).then((res) => {
                if (res.ret.errcode === 1) {
                    this.productInfo = res.data
                }
            })
        },
        // 用户信息折线图
        getUserChartData () {
            this.userTimeList = this.userTimeList ? this.userTimeList : []
            userRegistLine({
                // pageSize: !this.userTimeList[0] ? 7 : 500,
                startTime: !this.userTimeList[0] ? null : this.userTimeList[0],
                endTime: !this.userTimeList[1] ? null : this.userTimeList[1]
            }).then((res) => {
                if (res.ret.errcode == 1) {
                    let array = res.line
                    this.polar3.xAxis.data = []
                    this.polar3.series[0].data = []
                    this.polar3.series[1].data = []
                    this.polar3.series[2].data = []
                    this.polar3.series[3].data = []
                    this.polar3.series[4].data = []
                    array.map((item, index) => {
                        this.polar3.xAxis.data.push(item.date.slice(0, 10))
                        this.polar3.series[0].data.push(item.userCount || 0)
                        this.polar3.series[1].data.push(item.fansCount || 0)
                        this.polar3.series[2].data.push(item.memberCount || 0)
                        this.polar3.series[3].data.push(item.managerCount || 0)
                        this.polar3.series[4].data.push(item.generalManagerCount || 0)
                    })
                    this.polar3.ready = true
                }
            })
        },
        // 用户动态两侧数据获取
        getUserStatistics () {
            userRegistData({}).then(res => {
                if (res.ret.errcode === 1) {
                    this.userStatistics = res.data
                    this.userStatistics.totalCount = res.chart.totalCount || 0
                    this.polar2.series[0].data[0].value = res.chart.fansCount || 0
                    this.polar2.series[0].data[1].value = res.chart.memberCount || 0
                    this.polar2.series[0].data[2].value = res.chart.managerCount || 0
                    this.polar2.series[0].data[3].value = res.chart.generalManagerCount || 0
                    this.polar2.ready = true
                }
            })
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
                color: ['#8b5a00', '#009933'],
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
                        color: '#000',
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
                        color: '#fff'
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
                        data: psNumList,
                        itemStyle: { normal: { label: { show: true } } }
                    }
                ]
            }

            this.hourRegisterChart.setOption(options)
        },
        getDataSource () {
            let params = {}
            BigScreenData(params).then(res => {
                if (res.ret.errcode === 1) {
                    console.log(res)
                    this.drawHourChart(res.fourHourRegistrations)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
