<template>
    <div class="user-acqisition">
        <el-row :gutter="12">
            <el-col :span="8" v-for="(item, index) in cardData" :key="index">
                <el-card shadow="always" class="increase-num">
                    <div class="member-title">
                        <div>{{dataType[item.dataType]}}</div>
                        <el-tooltip class="item-icon" effect="dark" :content="cardInfo[item.dataType]" placement="top">
                            <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                    </div>
                    <div class="member-time" v-if="item.dataType !== 'MONTHLY_ACTIVE_USER'">{{new Date().getTime() | dateTimeFormat}} | 今日</div>
                    <div class="member-time" v-else>{{monthDay}} ~ {{new Date().getTime() | dateTimeFormat}} | 今月</div>
                    <div>
                        <span class="human-num">{{item.volume}}</span>
                        <span class="human" v-if="index === 0 || index === 1 || index === 2">人</span>
                        <span class="human" v-else>%</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-card shadow="always" class="user-line">
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name" lazy>
                    <div class="uesr-box">
                        <div class="time-title">
                            <div class="line-chart-info">{{tabList[index].label}}趋势</div>
                            <div @click="timeChange(index)" class="line-chart-time">
                                {{dateRangeUserTimeStamp[index][0]}}~{{dateRangeUserTimeStamp[index][1]}}
                                <i class="iconfont">&#xe65b;</i>
                            </div>
                        </div>
                        <el-select v-model="activeDimensionTwo" v-if="tabList[index].label === '新增注册' || tabList[index].label === '累计注册'" @change="dimensionSecondChange" size="small">
                            <el-option
                            v-for="item in dimensionSecondList"
                            :key="item.dimension"
                            :label="item.label"
                            :value="item.dimension">
                            </el-option>
                        </el-select>
                        <el-select v-model="activeDimensionOne" v-else-if="tabList[index].label === 'DAU' || tabList[index].label === 'MAU'" @change="dimensionOneChange" size="small">
                            <el-option
                            v-for="item in dimensionList"
                            :key="item.dimension"
                            :label="item.label"
                            :value="item.dimension">
                            </el-option>
                        </el-select>
                    </div>
                    <line-chart v-if="lineDataMap.series" :ref="item.name"  :dataLenged="dataLenged" :lineData="lineDataMap" :unit="tabList[index].unit" :yMin="tabList[index].yMin"></line-chart>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-row :gutter="12" class="pie-box">
            <el-col :span="12">
                <el-card class="pieChart">
                    <div class="pie-title">
                        <div>获客渠道占比</div>
                        <div @click="timeCancleChange()" class="line-chart-time">
                            {{dateRangeCancleTimeStamp[0]}}~{{dateRangeCancleTimeStamp[1]}}
                            <i class="iconfont">&#xe65b;</i>
                        </div>
                    </div>
                    <pie-chart :pieData="cancleData" unit="%"></pie-chart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="pieChart">
                    <div class="pie-title">
                        <div>获客终端类型占比</div>
                        <div @click="timeRetuenChange()" class="line-chart-time">
                            {{dateRangeReturnTimeStamp[0]}}~{{dateRangeReturnTimeStamp[1]}}
                            <i class="iconfont">&#xe65b;</i>
                        </div>
                    </div>
                    <pie-chart :pieData="returnData" unit="%"></pie-chart>
                </el-card>
            </el-col>
        </el-row>
        <time-chose v-if="timeDialogVisible" :dialogVisible="timeDialogVisible" :timeMark="timeMark" @on-cancle="cancleTime" @on-confirm="confirmTime"></time-chose>
    </div>
</template>
<script>
    // import moment from 'moment'
    import timeChose from '../memberTeam/components/timeChose'
    import pieChart from '../commdityCategory/components/pieChart'
    import lineChart from './components/lineChart'
    import { UserActivityDataDisplay, UaBrokenLineGraph, UaSourceProportionPieChart, UaSiteProportionPieChart} from '@/request/userAcquisition'

    export default {
        data() {
            return {
                cardData: [],
                dataType: {
                    "NEW_REGISTER_USER": '新增注册用户数',
                    "DAILY_ACTIVE_USER": 'DAU',
                    "MONTHLY_ACTIVE_USER": 'MAU',
                    "ONE_DAY_USER_RETENTION": '用户次日留存率',
                    "SEVEN_DAY_USER_RETENTION": '用户七日留存率'
                },
                cardInfo: {
                    "NEW_REGISTER_USER": '统计周期内新增注册用户数',
                    "DAILY_ACTIVE_USER": '当日活跃用户数',
                    "MONTHLY_ACTIVE_USER": '本月月活用户数，按日活跃加总去重',
                    "ONE_DAY_USER_RETENTION": '统计 昨天打开app的用户数中今天打开app的人数/昨天打开app的用户数，按deviceID',
                    "SEVEN_DAY_USER_RETENTION": '统计 D-7天打开app的用户数中D日又打开app的人数/D-7天打开app的用户数，D取当前日s'
                },
                monthDay: moment().startOf('month').format('YYYY-MM-DD'),
                tabList: [{
                        label: '新增注册',
                        name: '6',
                        unit: '人',
                        yMin: 0
                    }, {
                        label: '累计注册',
                        name: '7',
                        unit: '',
                        yMin: 0
                    }, {
                        label: 'DAU',
                        name: '8',
                        unit: '',
                        yMin: 0
                    }, {
                        label: 'MAU',
                        name: '9',
                        unit: '',
                        yMin: 0
                    }
                ],
                activeName: '6',
                activeDimensionOne:300,
                activeDimensionTwo:300,
                dimensionList: [{
                    label:'按合计',
                    dimension:300
                },{
                    label:'按国家',
                    dimension:302
                },{
                    label:'按会员等级',
                    dimension:301
                },{
                    label:'按终端类型',
                    dimension:303
                }],
                dimensionSecondList: [{
                    label:'按合计',
                    dimension:300
                },{
                    label:'按国家',
                    dimension:302
                },{
                    label:'按终端类型',
                    dimension:303
                }],
                timeMark:'add',
                dateRangeUserTimeStamp: [[moment('2020-04-18').format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment('2020-04-18').format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment('2020-04-18').format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')], [moment('2020-04-18').format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')]],
                dateRangeReturnTimeStamp: [moment('2020-04-18').format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
                dateRangeCancleTimeStamp: [moment('2020-04-18').format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
                timeDialogVisible: false,
                userIndex: 0,
                cancleData: [],
                returnData: [],
                lineDataMap: {},
                dataLenged: []
            }
        },
        components: {
            timeChose,
            pieChart,
            lineChart
        },
        mounted() {
            this.getUserActivityDataDisplay()
            this.getUaSourceProportionPieChart()
            this.getUaSiteProportionPieChart()
            this.getUaBrokenLineGraph()
        },
        methods: {
            getUserActivityDataDisplay () {
                let params = {
                    dataType: [1,2,3,4,5]
                }
                UserActivityDataDisplay(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.cardData = res.data
                    }
                })
            },
            handleTabClick (val) {
                console.log(val)
                this.activeName = val.name
                this.userIndex = Number(val.index)
                this.getUaBrokenLineGraph()
            },
            getUaBrokenLineGraph () {
                let params = {
                    startTime: moment(this.dateRangeUserTimeStamp[this.userIndex][0]).valueOf().toString(),
                    endTime: moment(this.dateRangeUserTimeStamp[this.userIndex][1]).valueOf().toString(),
                    dataType: Number(this.activeName),
                    dimension:  this.userIndex === 0 || this.userIndex === 1?this.activeDimensionTwo:this.activeDimensionOne
                }
                UaBrokenLineGraph(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataLenged.splice(0)
                        for (const iterator of res.data) {
                            this.dataLenged.push(iterator.dimensionTag)
                        }
                        console.log(this.dataLenged)
                        let series = []
                        let xAxis = []
                        let data = res.data[0].data
                        for (let index = 0; index < data.length; index++) {
                            xAxis.push(data[index].date)
                        }
                        for (let i = 0; i < res.data.length; i++) {
                            series.push([])
                        }
                        let lineData = res.data
                        for (let index = 0; index < lineData.length; index++) {
                            console.log(lineData[index])
                            for (const iterator of lineData[index].data) {
                                series[index].push(iterator.volume)
                            }
                        }
                        console.log(series)
                        this.lineDataMap= {
                            series: series,
                            xAxis: xAxis
                        }
                        console.log(this.lineDataMap)
                    }
                })
            },
            cancleTime () {
                this.timeDialogVisible = false
            },
            confirmTime (timeMark, dateRange, dateRangeTimeStamp) {
                console.log(timeMark, dateRange, dateRangeTimeStamp)
                console.log(this.dateRangeUserTimeStamp)
                if (timeMark === 'add') {
                    console.log(this.userIndex)
                    this.dateRangeUserTimeStamp[this.userIndex] = dateRange
                    this.getUaBrokenLineGraph()
                    console.log(this.dateRangeUserTimeStamp)
                }else if (this.timeMark === 'cancles') {
                    this.dateRangeCancleTimeStamp = dateRange
                    this.getUaSourceProportionPieChart()
                } else if (this.timeMark === 'returns') {
                    this.dateRangeReturnTimeStamp = dateRange
                    this.getUaSiteProportionPieChart()
                }
                this.timeDialogVisible = false
            },
            timeChange (index) {
                this.timeMark = 'add'
                this.userIndex = index
                this.timeDialogVisible = true
            },
            dimensionOneChange (val) {
                console.log(val)
                this.activeDimensionOne = val
                this.getUaBrokenLineGraph()
            },
            dimensionSecondChange (val) {
                console.log(val)
                this.activeDimensionTwo = val
                this.getUaBrokenLineGraph()
            },
            getUaSourceProportionPieChart () {
                let params = {
                    startTime:moment(this.dateRangeCancleTimeStamp[0]).valueOf().toString(),
                    endTime:moment(this.dateRangeCancleTimeStamp[1]).valueOf().toString()
                }
                UaSourceProportionPieChart(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let cancleDataList = []
                        let sum = 0
                        for (const iterator of res.data) {
                            sum += Number(iterator.volume)
                        }
                        console.log(sum)
                        _.forEach(res.data, (item, index)=> {
                            let cancleDataObj = {}
                            cancleDataObj.value =  ((Number(item.volume)/Number(sum)).toFixed(2))*100
                            cancleDataObj.legendname = item.dataTag
                            cancleDataObj.volume = item.volume
                            cancleDataList.push(cancleDataObj)
                        })
                        console.log(cancleDataList)
                        this.cancleData = cancleDataList
                    }
                })
            },
            getUaSiteProportionPieChart () {
                let params = {
                    startTime:moment(this.dateRangeReturnTimeStamp[0]).valueOf().toString(),
                    endTime:moment(this.dateRangeReturnTimeStamp[1]).valueOf().toString()
                }
                UaSiteProportionPieChart(params).then(res => {
                    if (res.ret.errcode === 1) {
                       console.log(res)
                        let returnDataList = []
                        let sum = 0
                        for (const iterator of res.data) {
                            sum += Number(iterator.volume)
                        }
                        _.forEach(res.data, (item, index)=> {
                            let returnDataObj = {}
                            returnDataObj.value =  ((Number(item.volume)/Number(sum)).toFixed(2))*100
                            returnDataObj.legendname = item.dataTag
                            returnDataObj.volume = item.volume
                            returnDataList.push(returnDataObj)
                        })
                        console.log(returnDataList)
                        this.returnData = returnDataList
                    }
                })
            },
            timeCancleChange () {
                this.timeMark = 'cancles'
                this.timeDialogVisible = true
            },
            timeRetuenChange () {
                this.timeMark = 'returns'
                this.timeDialogVisible = true
            },
        },
    }
</script>
<style lang="scss" scoped>
    .user-acqisition{
        overflow: scroll;
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
            .line-chart-time{
                margin-left: 20px;
                color: rgb(209, 209, 208);
                font-size: 12px;
                .iconfont{
                    color: rgb(193,193,193);
                    font-size: 16px;
                }
            }
        }
        .line-chart-time{
            margin-left: 20px;
            color: rgb(209, 209, 208);
            font-size: 12px;
            cursor: pointer;
            .iconfont{
                color: rgb(193,193,193);
                font-size: 16px;
            }
        }
        .pie-box{
            margin-top: 10px;
        }
        .pie-title{
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid rgb(209, 209, 208);
        }
        .pieChart{
            height:400px;
        }
    }
</style>
