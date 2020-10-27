<template>
    <div class="customer-service">
        <div v-loading="onlineLoading" element-loading-background="rgb(237,239,242)" element-loading-text="数据加载中">  
            <div class="statue-title">实时客服在线状态</div>
            <div>
                <el-row :gutter="8" class="num-row">
                    <el-col :span="4" v-for="(item, index) in onLineStatus" :key="index">
                        <el-card shadow="always" class="increase-num">
                            <div class="member-title">
                                <div>{{item.type}}</div>
                                <el-tooltip class="item-icon" effect="dark" :content="cardInfo[item.type]" placement="top">
                                    <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                            </div>
                            <div class="member-time">实时刷新</div>
                            <div>
                                <span class="human-num" @click="staffClick(item.staffNickName,item.type)">{{item.value}}</span>
                            </div>
                        </el-card>
                    </el-col> 
                </el-row>
            </div>
            <div class="user-data">
                <div class="statue-title">用户实时在线数据</div>
                <el-select v-model="countryCode" size="medium" @change="countryChange">
                    <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </div>
            <div>
                <el-row :gutter="10" class="num-row">
                    <el-col :span="5" v-for="(item, index) in userRealTimeOnLineInfo" :key="index">
                        <el-card shadow="always" class="increase-num">
                            <div class="member-title">
                                <div>{{item.type}}</div>
                                <el-tooltip class="item-icon" effect="dark" :content="cardInfo[item.type]" placement="top">
                                    <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                            </div>
                            <div class="member-time">实时刷新</div>
                            <div>
                                <span class="num">{{item.value}}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div class="customer-data">
                <div class="statue-title">客服个人数据</div>
                <el-select v-model="customerId" size="medium" filterable clearable @change="customerChange">
                    <el-option v-for="item in csStaffInfo" :key="item.staffId" :label="item.staffNickName" :value="item.staffId"></el-option>
                </el-select>
            </div>
            <div>
                <el-row :gutter="10" class="num-row">
                    <el-col :span="4" v-for="(item, index) in csStaffPersonalData" :key="index">
                        <el-card shadow="always" class="increase-num">
                            <div class="member-title">
                                <div>{{item.type}}</div>
                                <el-tooltip class="item-icon" effect="dark" :content="cardInfo[item.type]" placement="top">
                                    <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                            </div>
                            <div class="member-time">实时刷新</div>
                            <div>
                                <span class="num">{{item.value}}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <el-card shadow="always" class="increase-num">
                <div class="statue-title">每日咨询量趋势</div>
                <line-chart v-if="lineDataMap.series" :dataLenged="dataLenged" :lineData="lineDataMap"></line-chart>
            </el-card>
            <el-card shadow="always" class="increase-num">
                <div class="statue-title">用户在线报表</div>
                <user-online :countryList="countryList" :languageList="languageList"></user-online>
            </el-card>
            <el-card shadow="always" class="increase-num">
                <div class="statue-title">客服数据报表</div>
                <customer-data :csStaffInfo="csStaffInfo"></customer-data>
            </el-card>
            <el-card shadow="always" class="increase-num">
                <div class="statue-title">客服聊天详情报表</div>
                <chat-detail :csStaffInfo="csStaffInfo" :countryList="countryList" :languageList="languageList"></chat-detail>
            </el-card>
            <el-card shadow="always" class="increase-num">
                <div class="statue-title">未接起聊天详情报表</div>
                <missed-chat :countryList="countryList" :languageList="languageList"></missed-chat>
            </el-card>
            <staff-dialog v-if="staffDialog" :dialogVisible="staffDialog" :title="title" :nameList="nameList" @on-cancle="cancleDialog"></staff-dialog>
        </div>
    </div>
</template>
<script>
    import { RealTimeCsStaffOnLineInfo, UserRealTimeOnLineInfo, CsStaffPersonalData, CsStaffList, DayConsultationVolume } from '@/request/customerService'
    import lineChart from '../userAcquisition/components/lineChart'
    import staffDialog from './components/staffDialog'
    import userOnline from './components/userOnline'
    import customerData from './components/customerData'
    import missedChat from './components/missedChat'
    import chatDetail from './components/chatDetail'

    export default {
        data () {
            return {
                onlineLoading: true,
                timeLoading: true,
                onLineStatus: [],
                nameList: [],
                cardInfo: {
                    "在线中": "当前登陆im后台的客服数量，包括在线/忙碌状态",
                    "空闲中": "当前登陆im后台且状态为「在线」且无服务中工单",
                    "聊天中": "当前登陆im后台且状态为「在线」且有服务中工单",
                    "忙碌中": "当前登陆im后台且状态为「忙碌」",
                    "已离线": "当前未登陆im后台的有效客服账号数量",
                    "用户在线访问UV": "当天进入客服页面的访问量，用户id去重",
                    "用户在线转人工UV": "当天点击转接人工客服的量，按用户id计算未成功(排队结束)的算一次，成功建立会话的算多次 =（放弃量+接起量）",
                    "客服接线量": "当天客服接起的工单总数，用户id不去重",
                    "离线消息池余量": "当前离线消息池中待分配的消息总数量",
                    "用户放弃量": "当天排队结束等待的次数，同一天用户id去重",
                    "客服接起率": "客服接线量/用户在线转人工量",
                    "当前等待在线数": "当前还在排队中的在线用户数量",
                    "当前在线满意度": "当天受理在线客户给予好评的量/当天受理在线客户给予评价的量",
                    "在线处理工单量": "当天共处理完成咨询数量（结束服务时间为准）",
                    "当天在线时长": "所有客服当天累计在线总时长（包括在线、忙碌、小憩 状态）",
                    "当日忙碌时长": "所有客服当天累计忙碌状态总时长",
                    "平均聊天时长": "所有客服当天累计聊天总时长/当天完成服务的工单数量",
                    "当前满意度":"客服当天受理在线客户给予好评的量/客服当天受理在线客户给予评价的量"
                },
                countryCode: '',
                userRealTimeOnLineInfo: [],
                customerId: '',
                csStaffInfo: [],
                csStaffPersonalData: [],
                dataLenged: ['用户访问量','转人工客服量','人工接线量','放弃量'],
                lineDataMap: {},
                staffDialog: false,
                title: ''
            }
        },
        components: {
            lineChart,
            staffDialog,
            userOnline,
            customerData,
            missedChat,
            chatDetail
        },
        mounted() {
            this.getRealTimeCsStaffOnLineInfo()
            this.getUserRealTimeOnLineInfo()
            this.getCsStaffList()
            this.getCsStaffPersonalData()
            this.getDayConsultationVolume()
        },
        computed: {
            countryList () {
                let list = [].concat(this.$store.state.dict.countryList)
                let item = list.find((val) => {
                    return val.shortCode == ''
                })
                if (!item) {
                    list.unshift({
                        nameCn: '合计',
                        nameLocal: '合计',
                        shortCode: ''
                    })
                } 
                let item1 = list.find((val) => {
                    return val.shortCode == 'ID'
                })
                if (!item1) {
                    list.push({
                        nameCn: '印度尼西亚',
                        nameLocal: '印度尼西亚',
                        shortCode: 'ID'
                    })
                } 
                return list
            },
            languageList () {
                let list = this.$store.state.dict.languageList
                list.unshift({
                    code: '',
                    desc: '全选'
                })
                return list
            }
        },
        methods: {
            getRealTimeCsStaffOnLineInfo () {
                this.onlineLoading = true
                RealTimeCsStaffOnLineInfo({}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.onLineStatus = res.staffOnLineInfos
                        this.onlineLoading = false
                    }
                })
            },
            staffClick (val,type) {
                this.nameList = val
                this.title = type
                this.staffDialog = true
            },
            cancleDialog () {
                this.staffDialog = false
            },
            getUserRealTimeOnLineInfo () {
                this.timeLoading = true
                let params = {
                    country: this.countryCode
                }
                UserRealTimeOnLineInfo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.timeLoading = false
                        this.userRealTimeOnLineInfo = res.userRealTimeOnLineInfo
                    }
                })
            },
            countryChange (val) {
                console.log(val)
                this.countryCode = val
                this.getUserRealTimeOnLineInfo()
            },
            getCsStaffList () {
                let params = {
                    selectParam: this.customerId
                }
                CsStaffList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let list =  res.csStaffInfo
                        list.unshift({
                            staffId: '',
                            staffNickName: '总计' 
                        })
                        this.csStaffInfo = list
                    }
                })
            },
            customerChange (val) {
                console.log(val)
                this.customerId = val
                this.getCsStaffPersonalData()
            },
            getCsStaffPersonalData () {
                let params = {
                    staffId: this.customerId
                }
                CsStaffPersonalData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.csStaffPersonalData =res.csStaffPersonalData
                    }
                })
            },
            getDayConsultationVolume () {
                DayConsultationVolume({}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let series = []
                        let xAxis = []
                        let data = res.dayConsultationVolumeInfo
                        for (let index = 0; index < data.length; index++) {
                            xAxis.push(data[index].dateTime)          
                        }
                        let keyList = []
                        for (const key in data[0]) {
                            keyList.push(key)
                        }
                        keyList.splice('dateTime',1)
                        for (let i = 0; i < keyList.length; i++) {
                            series.push([])
                        }
                        for (let index = 0; index < data.length; index++) {
                            series[0].push(data[index].userReqNum)
                            series[1].push(data[index].transferLaborNum)
                            series[2].push(data[index].csPickUpNum)
                            series[3].push(data[index].abandonmentQuantity)
                            
                        }
                        this.lineDataMap= {
                            series: series,
                            xAxis: xAxis
                        }
                        console.log(this.lineDataMap)
                    }
                })
            }
        },    
    }
</script>
<style lang="scss" scoped>
    .customer-service{
        background-color: rgb(237,239,242);
        overflow: auto;
        .statue-title{
            margin: 10px 10px 10px 7px;
            font-size: 18px;
            font-weight: 600;
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
                cursor: pointer;  
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
            cursor: pointer;
        }
        .num{
            font-size: 24px;
            font-weight: 500;
            cursor: pointer;
        }
        .human-num:hover{
            color: rgb(24,148,236)
        }
        .user-data,.customer-data{
            display: flex;
            align-items: center;
        }
    }
</style>