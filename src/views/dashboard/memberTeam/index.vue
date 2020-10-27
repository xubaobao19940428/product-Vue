<template>
    <div class="container">
        <div class="member-team" v-loading="increaseLoading" element-loading-background="rgb(237,239,242)" element-loading-text="数据加载中">
            <el-row :gutter="12" class="num-row">
                <el-col :span="6" v-for="(item, index) in increaseData" :key="index">
                    <el-card shadow="never" class="increase-num">
                        <div class="member-title">
                            <div>{{dataType[item.dataType]}}</div>
                        </div>
                        <div class="member-time" v-if="item.dataType.indexOf('Increase') !== -1">{{new Date().getTime() | dateTimeFormat}} | 今日</div>
                        <div class="member-time" v-else>上线至今</div>
                        <div>
                            <span class="human-num">{{item.volume}}</span>
                            <span class="human">人</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="12" class="num-row">
                <el-col :span="6" v-for="(item, index) in miscellaneousData" :key="index">
                    <el-card shadow="never" class="increase-num">
                        <div class="member-title">
                            <div>{{dataActionType[item.dataType]}}</div>
                            <el-tooltip class="item-icon" effect="dark" :content="cardInfo[item.dataType]" placement="top">
                                <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                        </div>
                        <div class="member-time" @click="timeChange" v-if="item.dataType.indexOf('All') == -1">{{monthStart}} ～ {{monthEnd}} | 本月</div>
                        <div class="member-time" @click="timeChange" v-else>上线至今</div>
                        <div>
                            <span class="human-num">{{item.volume}}</span>
                            <span class="human">人</span>
                        </div>
                    </el-card>
                </el-col>
                <!-- <div class="num-mark"></div>
                <img src="../../../assets/images/loader.gif" /> -->
            </el-row>
            <div class="country-box">
                <div class="country-title">
                    <i class="iconfont">&#xe671;</i>
                    <span class="">看板多国家筛选：</span>
                </div>
                <el-select v-model="countryCode" @change="countryChange" size="small">
                    <el-option
                    v-for="item in countryList"
                    :key="item.shortCode"
                    :label="item.nameCn"
                    :value="item.shortCode">
                    </el-option>
                </el-select>
            </div>
            <!-- <div class="num-mark" v-if="loading"></div>
            <img src="../../../assets/images/loader.gif" class="loading" v-if="loading" /> -->
        </div>
        <el-card shadow="never" class="user-line">
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name" lazy>
                    <div class="uesr-box">
                        <div class="time-title">
                            <div class="line-chart-info">{{tabList[index].label}}趋势</div>
                            <div @click="timeChange(index)" class="line-chart-time">
                                <!-- {{dateRangeUserTimeStamp[index][0] | dateTimeFormat}}~{{dateRangeUserTimeStamp[index][1] | dateTimeFormat}} -->
                                {{dateRangeUserTimeStamp[index][0]}}~{{dateRangeUserTimeStamp[index][1]}}
                                <i class="iconfont">&#xe65b;</i>
                            </div>
                        </div>
                        <el-select v-model="countryDimension" v-if="tabList[index].label === '用户拉新'" @change="countryLineChange" size="small">
                            <el-option
                            v-for="item in countryDimensionList"
                            :key="item.code"
                            :label="item.label"
                            :value="item.code">
                            </el-option>
                        </el-select>
                        <el-select v-model="activeDimensionOne" v-else-if="tabList[index].label === '用户收入'" @change="dimensionOneChange" size="small">
                            <el-option
                            v-for="item in dimensionList"
                            :key="item.dimension"
                            :label="item.label"
                            :value="item.dimension">
                            </el-option>
                        </el-select>
                        <el-select v-model="activeDimensionTwo" v-else-if="tabList[index].label === '用户消费'" @change="dimensionTwoChange" size="small">
                            <el-option
                            v-for="item in dimensionList"
                            :key="item.dimension"
                            :label="item.label"
                            :value="item.dimension">
                            </el-option>
                        </el-select>
                    </div>
                    <line-chart :ref="item.name" :userIndex="userIndex" :dimensionIncome="activeDimensionOne" :dimensionlevel="activeDimensionTwo" :lineData="lineDataMap[item.name]" :unit="tabList[index].unit" :yMin="tabList[index].yMin"></line-chart>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- <el-card shadow="never" class="user-line">
            <el-tabs v-model="activeRebateName" @tab-click="handleRebateTabClick">
                <el-tab-pane v-for="(item, index) in tabRebateList" :key="index" :label="item.label" :name="item.name" lazy>
                    <div class="uesr-box">
                        <div class="time-title">
                            <div class="line-chart-info">{{tabRebateList[index].label}}趋势</div>
                            <div @click="timeRebateChange(index)" class="line-chart-time">
                                {{dateRangeRebateTimeStamp[index][0] | dateTimeFormat}}~{{dateRangeRebateTimeStamp[index][1] | dateTimeFormat}}
                                <i class="iconfont">&#xe65b;</i>
                            </div>
                        </div>
                        <el-select v-model="countryCode" @change="countryChange" size="small">
                            <el-option
                            v-for="item in countryList"
                            :key="item.shortCode"
                            :label="item.nameCn"
                            :value="item.shortCode">
                            </el-option>
                        </el-select>
                    </div>

                    <line-chart :ref="item.name" :lineData="lineDataMap[item.name]" :unit="tabRebateList[index].unit" :yMin="tabRebateList[index].yMin"></line-chart>
                </el-tab-pane>
            </el-tabs>
        </el-card> -->
        <el-row :gutter="12" class="num-row">
            <el-col :span="12" v-for="(item, index) in topList" :key="index">
                <el-card shadow="never" class="increase-num">
                    <div class="top-title">
                        {{item}}
                    </div>
                    <div class="top-box">
                        <div @click="timeTopChange(index)" class="line-chart-time">
                            {{dateRangeTOPTimeStamp[index][0]}}~{{dateRangeTOPTimeStamp[index][1]}}
                            <i class="iconfont">&#xe65b;</i>
                        </div>
                        <el-select v-model="countryCodeList[index]" @change="countryTopChange(index)" size="small" class="top-country">
                            <el-option
                            v-for="item in countryList"
                            :key="item.shortCode"
                            :label="item.nameCn"
                            :value="item.shortCode">
                            </el-option>
                        </el-select>
                    </div>
                    <sort-table :tableList="tableList[index]"></sort-table>
                </el-card>
            </el-col>
        </el-row>
        <time-chose :dialogVisible="timeDialogVisible" :timeMark="timeMark" @on-cancle="cancleTime" @on-confirm="confirmTime"></time-chose>
    </div>
</template>
<script>
    import { MemberIncreaseNumber, MemberMiscellaneousData, MemberBrokenLineGraph, MemberPsIncreaseRankingList, MemberPsIncreaseRiseRankingList, MemberPsIncreaseDropRankingList } from '@/request/memberTeam'
    import timeChose from './components/timeChose'
    import lineChart from './components/lineChart'
    import sortTable from './components/sortTable'

    export default {
        data () {
            return {
                countryCode: '',
                dataType:{
                    IncreaseSHNumber: '新增SH数',
                    IncreasePSNumber: '新增PS数',
                    IncreaseAMNumber: '新增AM数',
                    IncreaseATNumber: '新增AT数',
                    AllTimeSHNumber: '累计SH数',
                    AllTimePSNumber: '累计PS数',
                    AllTimeAMNumber: '累计AM数',
                    AllTimeATNumber: '累计AT数',
                },
                dataActionType: {
                    PSActivationNumber: '0度PS激活数',
                    PSInvitationNumber: '邀约PS成功用户数',
                    FirstOrderNumber: '开首单用户数',
                    AllTimePSActivationNumber: '0度PS激活累计数',
                    AllTimePSInvitationNumber: '邀约PS成功用户累计数',
                    AllTimeFirstOrderNumber: '开单用户累计数',
                },
                cardInfo:{
                    PSActivationNumber: '统计周期内，团队内没有的PS下属的PS团队长，团队中晋升了ps/am/at的团队长 的数量',
                    PSInvitationNumber: '统计周期内，用户邀到粉丝（即有绑定关系），且粉丝在周期内成功升级PS ，的邀请人数量，同个邀请人在邀请到不同用户时，可以被计算多次',
                    FirstOrderNumber: '统计周期内，会员开单（自己购买或者销售给SH普通商品）用户数（首单）',
                    AllTimePSActivationNumber: '团队内没有的PS下属的PS团队长，团队中晋升了ps/am/at的团队长 的数量，每日加总的累计值',
                    AllTimePSInvitationNumber: '用户邀到粉丝（即有绑定关系），且粉丝在周期内成功升级PS ，的邀请人数量，同个邀请人在邀请到不同用户时，可以被计算多次，每日的值累加汇总',
                    AllTimeFirstOrderNumber: '会员开单（自己购买或者销售给SH普通商品）用户数（首单），每日的值累加汇总',
                },
                increaseData: [],
                miscellaneousData: [],
                timeDialogVisible:false,
                monthStart: moment().add('month', 0).format('YYYY-MM') + '-01',
                monthEnd: moment(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)).format('YYYY-MM-DD'),
                increaseLoading: true,
                misLoading:true,
                activeName: 'UserPullNew',
                activeTab: 'UserPullNew',
                userIndex:0,
                tabList: [{
                        label: '用户拉新',
                        name: 'UserPullNew',
                        unit: '人',
                        yMin: 0
                    }, {
                        label: '用户收入',
                        name: 'UserIncome',
                        unit: '$',
                        yMin: 0
                    }, {
                        label: '用户消费',
                        name: 'UserConsumption',
                        unit: '$',
                        yMin: 0
                    }
                ],
                activeRebateName: 'NumOfOrder',
                rebateIndex:0,
                tabRebateList: [{
                        label: '返佣人数',
                        name: 'NumOfOrder',
                        unit: '单',
                        yMin: 0
                    }, {
                        label: '返佣订单',
                        name: 'GMV',
                        unit: '$',
                        yMin: 0
                    }, {
                        label: '返佣金额',
                        name: 'GMVPerUser',
                        unit: '$',
                        yMin: 0
                    }
                ],
                lineDataMap:{
                    UserPullNew: {},
                    UserIncome: {},
                    UserConsumption: {},
                },
                activeDimensionOne:0,
                activeDimensionTwo:0,
                countryDimension:0,
                countryDimensionList: [
                    {
                        code: 0,
                        label: '合计'
                    },{
                        code: 100,
                        label: '马来西亚'
                    }, {
                        code: 101,
                        label: '新加坡'
                    }, {
                        code: 102,
                        label: '泰国'
                    }, {
                        code: 103,
                        label: '印度尼西亚'
                    }
                ],
                dimensionList: [{
                    label:'按合计',
                    dimension:0
                },{
                    label:'按国家',
                    dimension:1
                },{
                    label:'按用户等级',
                    dimension:2
                }],
                timeMark:'user',
                dateRangeUserTimeStamp: [[moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')]],
                dateRangeTOPTimeStamp: [[moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')]],
                // dateRangeUserTimeStamp: [[1572537600000, 1577721599000], [1572537600000, 1577721599000], [1572537600000, 1577721599000]],
                dateRangeRebateTimeStamp: [[1572537600000, 1577721599000], [1572537600000, 1577721599000], [1572537600000, 1577721599000]],
                topList: ['新增PS数TOP50用户', '邀约环比上涨最多TOP50用户','邀约环比下降最多TOP50用户'],
                countryCodeList: ['','',''],
                topIndex: 0,
                tableList: [[],[],[]]
            }
        },
        components: {
            timeChose,
            lineChart,
            sortTable
        },
        mounted () {
            this.getMemberIncreaseNumber()
            this.getMemberMiscellaneousData()
            this.getMemberBrokenLineGraph()
            this.getMemberPsIncreaseRankingList()
            this.getMemberPsIncreaseRiseRankingList()
            this.getMemberPsIncreaseDropRankingList()
        },
        computed:{
            countryList () {
                let countryList = [].concat(this.$store.state.dict.countryList)
                let item = countryList.find((val) => {
                    return val.shortCode == ''
                })
                if (!item) {
                    countryList.unshift({
                        nameCn: '合计',
                        nameLocal: '合计',
                        shortCode: ''
                    })
                }
                let item1 = countryList.find((val) => {
                    return val.shortCode == 'ID'
                })
                if (!item1) {
                    countryList.push({
                        nameCn: '印度尼西亚',
                        nameLocal: '印度尼西亚',
                        shortCode: 'ID'
                    })
                }
                return countryList
            },
        },
        methods:{
            getMemberIncreaseNumber () {
                let params = {
                    countryCode: this.countryCode,
                    dataType: [11,12,13,14,15,16,17,18]
                }
                // this.increaseData.splice(0)
                MemberIncreaseNumber(params).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        this.increaseLoading = false
                        this.increaseData = res.data
                    }
                })
            },
            getMemberMiscellaneousData () {
                let params = {
                    countryCode: this.countryCode,
                    dataType: [19,20,21,22,23,24]
                }
                MemberMiscellaneousData(params).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        this.misLoading=false
                        this.miscellaneousData = res.data
                    }
                })
            },
            countryChange (val) {
                console.log(val)
                this.countryCode = val
                // this.loading = true
                this.increaseLoading=true
                this.misLoading=true
                this.getMemberIncreaseNumber()
                this.getMemberMiscellaneousData()
            },
            cancleTime () {
                this.timeDialogVisible = false
            },
            confirmTime (timeMark, dateRange, dateRangeTimeStamp) {
                console.log(timeMark, dateRange, dateRangeTimeStamp)
                console.log(this.dateRangeUserTimeStamp)
                if (timeMark === 'user') {
                    console.log(this.userIndex)
                    // this.dateRangeUserTimeStamp[this.userIndex] = dateRangeTimeStamp
                    this.dateRangeUserTimeStamp[this.userIndex] = dateRange
                    this.getMemberBrokenLineGraph()
                    console.log(this.dateRangeUserTimeStamp)
                } else if (timeMark === 'rebate') {
                    this.dateRangeRebateTimeStamp[this.rebateIndex] = dateRangeTimeStamp
                } else if (timeMark === 'top') {
                    this.dateRangeTOPTimeStamp[this.topIndex] = dateRange
                    switch (this.topIndex) {
                        case 0:this.getMemberPsIncreaseRankingList();break;
                        case 1:this.getMemberPsIncreaseRiseRankingList();break;
                        case 2:this.getMemberPsIncreaseDropRankingList();break;
                    }
                }
                console.log(this.dateRangeTOPTimeStamp)
                this.timeDialogVisible = false
            },
            timeChange (index) {
                this.timeMark = 'user'
                this.userIndex = index
                this.timeDialogVisible = true
            },
            timeRebateChange (index) {
                this.timeMark = 'rebate'
                this.rebateIndex = index
                this.timeDialogVisible = true
            },
            getMemberBrokenLineGraph () {
                let params = {}
                console.log(moment(this.dateRangeUserTimeStamp[0][0], 'YYYY-MM-DD HH:mm:ss'))
                if (this.userIndex === 0) {
                    let start = this.dateRangeUserTimeStamp[0][0] + ' 00:00:00'
                    let end = this.dateRangeUserTimeStamp[0][1] + ' 23:59:59'
                    let startTime = moment(start, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
                    let endTime = moment(end, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
                    console.log(start,end,startTime,endTime)
                    params = Object.assign(params,{
                        startTime: startTime,
                        endTime: endTime,
                        dimension :this.countryDimension,
                        dataType :25,
                    })
                } else if (this.userIndex === 1){
                    let start = this.dateRangeUserTimeStamp[1][0] + ' 00:00:00'
                    let end = this.dateRangeUserTimeStamp[1][1] + ' 23:59:59'
                    let startTime = moment(start, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
                    let endTime = moment(end, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
                    console.log(start,end,startTime,endTime)
                    params = Object.assign(params,{
                        startTime: startTime,
                        endTime: endTime,
                        dimension :this.activeDimensionOne,
                        dataType :26,
                    })
                } else if (this.userIndex === 2){
                    let start = this.dateRangeUserTimeStamp[2][0] + ' 00:00:00'
                    let end = this.dateRangeUserTimeStamp[2][1] + ' 23:59:59'
                    let startTime = moment(start, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
                    let endTime = moment(end, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
                    console.log(start,end,startTime,endTime)
                    params = Object.assign(params,{
                        startTime: startTime,
                        endTime: endTime,
                        dimension :this.activeDimensionTwo,
                        dataType :27,
                    })
                }
                console.log(params)
                MemberBrokenLineGraph(params).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        if (this.userIndex === 0){
                            let series = [[],[],[],[],[]]
                            let xAxis = []
                            _.forEach(res.data, point => {
                                if (point.dimensionTag.indexOf('Total')!==-1){
                                    series[0].push(point.volume)
                                }else if(point.dimensionTag.indexOf('SH')!==-1){
                                    series[1].push(point.volume)
                                }else if(point.dimensionTag.indexOf('PS')!==-1){
                                    series[2].push(point.volume)
                                }else if(point.dimensionTag.indexOf('AM')!==-1){
                                    series[3].push(point.volume)
                                }else if(point.dimensionTag.indexOf('AT')!==-1){
                                    series[4].push(point.volume)
                                }
                                xAxis.push(point.date)
                            })
                            console.log(series)
                            this.lineDataMap[this.activeName] = {
                                series: series,
                                xAxis: this.distinct(xAxis)
                            }
                            console.log(this.lineDataMap)
                        } else if (this.userIndex === 1){
                            if(this.activeDimensionOne === 0) {
                                let series = [[]]
                                let xAxis = []
                                _.forEach(res.data, point => {
                                    series[0].push(point.volume)
                                    xAxis.push(point.date)
                                })
                                this.lineDataMap[this.activeName] = {
                                    series: series,
                                    xAxis: this.distinct(xAxis)
                                }
                                console.log(this.lineDataMap)
                            } else if (this.activeDimensionOne === 1) {
                                let series = [[],[],[],[]]
                                let xAxis = []
                                _.forEach(res.data, point => {
                                    if (point.dimensionTag.indexOf('MY')!==-1){
                                        series[0].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('SG')!==-1){
                                        series[1].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('TH')!==-1){
                                        series[2].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('ID')!==-1){
                                        series[3].push(point.volume)
                                    }
                                    xAxis.push(point.date)
                                })
                                console.log(series)
                                this.lineDataMap[this.activeName] = {
                                    series: series,
                                    xAxis: this.distinct(xAxis)
                                }
                                console.log(this.lineDataMap)
                            } else if (this.activeDimensionOne === 2) {
                                let series = [[],[],[],[]]
                                let xAxis = []
                                _.forEach(res.data, point => {
                                    if(point.dimensionTag.indexOf('SH')!==-1){
                                        series[0].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('PS')!==-1){
                                        series[1].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('AM')!==-1){
                                        series[2].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('AT')!==-1){
                                        series[3].push(point.volume)
                                    }
                                    xAxis.push(point.date)
                                })
                                console.log(series)
                                this.lineDataMap[this.activeName] = {
                                    series: series,
                                    xAxis: this.distinct(xAxis)
                                }
                                console.log(this.lineDataMap)
                            }
                        } else if ( this.userIndex === 2){
                            if(this.activeDimensionTwo === 0) {
                                let series = [[]]
                                let xAxis = []
                                _.forEach(res.data, point => {
                                    series[0].push(point.volume)
                                    xAxis.push(point.date)
                                })
                                this.lineDataMap[this.activeName] = {
                                    series: series,
                                    xAxis: this.distinct(xAxis)
                                }
                                console.log(this.lineDataMap)
                            } else if (this.activeDimensionTwo === 1) {
                                let series = [[],[],[],[]]
                                let xAxis = []
                                _.forEach(res.data, point => {
                                    if (point.dimensionTag.indexOf('MY')!==-1){
                                        series[0].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('SG')!==-1){
                                        series[1].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('TH')!==-1){
                                        series[2].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('ID')!==-1){
                                        series[3].push(point.volume)
                                    }
                                    xAxis.push(point.date)
                                })
                                console.log(series)
                                this.lineDataMap[this.activeName] = {
                                    series: series,
                                    xAxis: this.distinct(xAxis)
                                }
                                console.log(this.lineDataMap)
                            } else if (this.activeDimensionTwo === 2) {
                                let series = [[],[],[],[]]
                                let xAxis = []
                                _.forEach(res.data, point => {
                                    if(point.dimensionTag.indexOf('SH')!==-1){
                                        series[0].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('PS')!==-1){
                                        series[1].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('AM')!==-1){
                                        series[2].push(point.volume)
                                    }else if(point.dimensionTag.indexOf('AT')!==-1){
                                        series[3].push(point.volume)
                                    }
                                    xAxis.push(point.date)
                                })
                                console.log(series)
                                this.lineDataMap[this.activeName] = {
                                    series: series,
                                    xAxis: this.distinct(xAxis)
                                }
                                console.log(this.lineDataMap)
                            }
                        }
                    }
                })
            },
            distinct (arr) {
                let newArr = []
                for(let i = 0; i < arr.length; i++) {
                    if(newArr.indexOf(arr[i]) < 0) {
                        newArr.push(arr[i])
                    }
                }
                return newArr
            },
            handleTabClick (val) {
                console.log(val)
                this.activeName = val.name
                this.activeTab = val.name
                this.userIndex = Number(val.index)
                this.getMemberBrokenLineGraph()
            },
            handleRebateTabClick (val) {
                this.rebateIndex = Number(val)
            },
            countryLineChange (val) {
                console.log(val)
                this.countryDimension = val
                this.getMemberBrokenLineGraph()
            },
            dimensionOneChange (val) {
                console.log(val)
                this.activeDimensionOne = val
                this.getMemberBrokenLineGraph()
            },
            dimensionTwoChange (val) {
                this.activeDimensionTwo = val
                this.getMemberBrokenLineGraph()
            },
            timeTopChange (index) {
                this.timeMark = 'top'
                this.timeDialogVisible = true
                this.topIndex = index
            },
            countryTopChange (index) {
                switch (index) {
                    case 0:this.getMemberPsIncreaseRankingList();break;
                    case 1:this.getMemberPsIncreaseRiseRankingList();break;
                    case 2:this.getMemberPsIncreaseDropRankingList();break;
                }
            },
            getMemberPsIncreaseRankingList () {
                let params = {
                    startTime: moment(this.dateRangeTOPTimeStamp[0][0]).valueOf().toString(),
                    endTime: moment(this.dateRangeTOPTimeStamp[0][1]).valueOf().toString(),
                    countryCode: this.countryCodeList[0]
                }
               MemberPsIncreaseRankingList(params).then(res => {
                   if (res.ret.errcode === 1) {
                       console.log(res)
                       this.tableList[0].splice(0)
                       this.tableList[0] = res.memberData
                       console.log(this.tableList)
                   }
               }) 
            },
            getMemberPsIncreaseRiseRankingList () {
                let params = {
                    startTime: moment(this.dateRangeTOPTimeStamp[1][0]).valueOf().toString(),
                    endTime: moment(this.dateRangeTOPTimeStamp[1][1]).valueOf().toString(),
                    countryCode: this.countryCodeList[1]
                }
                MemberPsIncreaseRiseRankingList(params).then(res => {
                    if (res.ret.errcode === 1) {
                       console.log(res)
                       this.tableList[1].splice(0)
                       this.tableList[1] = res.memberData
                    }
                })
            },
            getMemberPsIncreaseDropRankingList () {
                let params = {
                    startTime: moment(this.dateRangeTOPTimeStamp[2][0]).valueOf().toString(),
                    endTime: moment(this.dateRangeTOPTimeStamp[2][1]).valueOf().toString(),
                    countryCode: this.countryCodeList[2]
                }
                MemberPsIncreaseDropRankingList(params).then(res => {
                    if (res.ret.errcode === 1) {
                       console.log(res)
                       this.tableList[2].splice(0)
                       this.tableList[2] = res.memberData
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .container{
        background-color: rgb(237,239,242);
        overflow: auto;
        .member-team{
            position: relative;
            .num-row {
                position: relative;
            }
            .num-mark{
                background: rgb(237,239,242);
                z-index: 10;
                position: absolute;
                width: 100%;
                height: 100%;
                // opacity: 0.6;
                top: 0;
            }
            .loading{
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: -123px;
                margin-top: -123px;
                z-index: 11;
            }
            .increase-num{
                margin: 5px;
            }
            .member-title{
                display: flex;
                justify-content: flex-start;
                font-size: 20px;
                font-weight: 500;
                .item-icon{
                    font-size: 14px;
                    color: rgb(209, 209, 208);
                }
            }
            .member-time{
                margin-bottom: 10px;
                margin-top: 5px;
                font-size: 14px;
                color: rgb(209, 209, 208);
            }
            .human-num{
                font-size: 24px;
                font-weight: 500;
            }
            .human{
                font-size: 12px;
                padding-left: 5px;
            }
            .country-box{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                right: 6px;
                bottom: 0px;
                width: 220px;
                height: 120px;
                border-radius: 5px;
                background-color: rgb(153,153,153)
            }
            .country-title{
                padding-bottom: 10px;
                font-size: 20px;
                .iconfont{
                    font-size: 24px;
                    margin-right: 3px;
                }
            }
        }
        .user-line{
            margin: 5px;
        }
        .uesr-box{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .time-title{
                display: flex;
                justify-content: space-around;
                align-items: center;
                cursor: pointer;
            }
            .line-chart-info{
                font-size: 16px;
                font-weight: 500;
            }
        }
        .line-chart-time{
            margin-left: 20px;
            color: rgb(209, 209, 208);
            font-size: 12px;
            .iconfont{
                color: rgb(193,193,193);
                font-size: 16px;
            }
        }
        .top-title{
            font-size: 20px;
            font-weight: 500;
        }
        .top-box{
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .top-country{
            margin-left: 10px;
            margin-bottom: 10px;
            margin-top: 10px;
        }
    }
</style>
