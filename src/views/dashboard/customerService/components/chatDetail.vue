<template>
    <div class="chat-detail">
        <div class="box-title">
            <div @click="timeChange()" class="line-chart-time">
                {{dateRangeVariousTimeStamp[0]}}~{{dateRangeVariousTimeStamp[1]}}
                <i class="iconfont">&#xe65b;</i>
            </div>
            <div class="lang">
                <div>客服姓名：</div>
                <el-select v-model="queryData.staffId" size="mini" filterable clearable @change="customerChange">
                    <el-option v-for="item in csStaffInfo" :key="item.staffId" :label="item.staffNickName" :value="item.staffId"></el-option>
                </el-select>
            </div>
            <div class="lang">
                <div class="user-id">用户userID：</div>
                <el-input v-model="queryData.userId" placeholder="请输入" size="mini"></el-input>
            </div>
            <div class="lang">
                <div class="user-id">聊天记录ID：</div>
                <el-input v-model="queryData.chatRecordId" placeholder="请输入" size="mini"></el-input>
            </div>
            <div class="lang">
                <div>聊天时长：</div>
                <el-select v-model="queryData.duration" placeholder="请选择" size="mini">
                    <el-option v-for="(item, i) in chatTime" :key="i" :label="item.label" :value="item.val"></el-option>
                </el-select>
            </div>
            <div class="lang">
                <div>客户终端语言：</div>
                <el-select v-model="queryData.language" placeholder="请选择" size="mini">
                    <el-option v-for="(item, i) in languageList" :key="i" :label="item.desc" :value="item.code"></el-option>
                </el-select>
            </div>
            <div class="country">
                <div>客户国家：</div>
                <el-select v-model="queryData.countryCode" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </div>
            <!-- <div class="lang">
                <div>等待时长：</div>
                <el-select v-model="queryData.waitTimeTotal" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in waitingTime" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
            </div> -->
            <div class="country">
                <div>客户评价：</div>
                <el-select v-model="queryData.userEvaluation" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in reviews" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
            </div>
            <div class="country" v-if="queryData.userEvaluation !== '' && queryData.userEvaluation === 'SATISFIED'">
                <div>评价标签：</div>
                <el-select v-model="queryData.evaluationTag" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in goodList" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
            </div>
            <div class="country" v-if="queryData.userEvaluation !== '' && queryData.userEvaluation === 'DISSATISFIED'">
                <div>评价标签：</div>
                <el-select v-model="queryData.evaluationTag" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in badList" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="searcher" class="btn" size="small">搜索</el-button>
                <el-button @click="research" class="btn" size="small">重置</el-button>
                <el-button type="primary" @click="exportData" class="btn" size="small">导出数据</el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border v-loading="loading">
            <el-table-column label="聊天记录Id" width="180" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>{{ scope.row.chatRecordId }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="客服组" width="180" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>{{ scope.row.customerGroup }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="客服" prop="csStaffName" width="180" align="center"> </el-table-column>
            <el-table-column label="客户userId" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.userId }}</div>
                </template>
            </el-table-column>
            <el-table-column label="客户终端选择语言" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.appLanguage }}</div>
                </template>
            </el-table-column>
            <el-table-column label="App版本" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.appVersion || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="客户国家" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.userCountry || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="排队等待时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ formatSecondsTo(scope.row.queueWaitTime,0) || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="聊天开始时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.chatStartTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="聊天结束时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.chatEndTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="聊天时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ formatSecondsTo(scope.row.chatEndTime,scope.row.chatStartTime)  }}</div>
                </template>
            </el-table-column>
            <el-table-column label="首次响应时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ formatSecondsTo(scope.row.firstResptTime,0) }}</div>
                </template>
            </el-table-column>
            <el-table-column label="平均响应时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ formatSecondsTo(scope.row.averageResptTime,0) }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="客户姓名" width="180" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>{{ scope.row.userId }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="评价" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.evaluation || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="评价标签" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <div>{{ scope.row.evaluationTag || '-' }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagenation">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5, 10, 15, 20]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <time-chose v-if="dialogVisible" :dialogVisible="dialogVisible" :timeMark="timeMark" :dateRangeVariousTimeStamp="dateRangeVariousTimeStamp" @on-cancle="cancleTime" @on-confirms="confirmTime"></time-chose>
    </div>
</template>
<script>
    import timeChose from './timeChose'
    import { CustomerChatDetailData, CustomerServiceAllDataDetailToExcel, GetDataCenterTypeData } from '@/request/customerService'
    import { RouteAndExport } from "@/request/fileCenter";

    export default {
        data () {
            return {
                dateRangeVariousTimeStamp: [moment().subtract('days', 1).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().subtract('days', 1).endOf('day').format('YYYY-MM-DD HH:mm:ss')],
                queryData: {
                    userId: '',
                    language: '',
                    countryCode: '',
                    chatRecordId: '',
                    staffId: '',
                    duration: '',
                    userEvaluation: '',
                    evaluationTag: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                total:0,
                dialogVisible: false,
                tableData: [],
                loading: true,
                timeMark: 'miss',
                chatTime: [{
                    val: 1,
                    label: '全选'
                },{
                    val: 2,
                    label: '1分钟内'
                },{
                    val: 3,
                    label: '1～5分钟'
                },{
                    val: 4,
                    label: '5～15分钟'
                },{
                    val: 5,
                    label: '15～60分钟'
                },{
                    val: 6,
                    label: '60分钟以上'
                }],
                reviews: [],
                goodList: [],
                badList: []
            }
        },
        props: {
            csStaffInfo: Array,
            countryList: Array,
            languageList: Array
        },
        components: {
            timeChose
        },
        mounted () {
            this.getDataCenterTypeData()
            this.getCustomerChatDetailData()
        },
        methods:{
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val;
                this.getCustomerChatDetailData();
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val;
                this.getCustomerChatDetailData();
            },
            formatSecondsTo (now,ms) {
                let mss = Number(now) - Number(ms)
                let duration
                let days = parseInt(mss / (1000 * 60 * 60 * 24))
                let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
                let seconds = parseInt((mss % (1000 * 60)) / 1000)
                if (days > 0)  duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
                else if (hours > 0)  duration = hours + "小时" + minutes + "分" + seconds + "秒"
                else if (minutes > 0) duration = minutes + "分" + seconds + "秒"
                else if (seconds > 0) duration = seconds + "秒"
                // console.log(duration)
                return duration
            },
            getDataCenterTypeData () {
                GetDataCenterTypeData({}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.reviews = res.dataHouseConfig[1].dataHouseComponent[6].dataHouseItemConfig[0].dataHouseItemConfig
                        let evaluationTagList = res.dataHouseConfig[1].dataHouseComponent[6].dataHouseItemConfig[1].dataHouseItemConfig
                        for (let index = 0; index < evaluationTagList.length; index++) {
                            if (index <= 2) {
                                this.goodList.push(evaluationTagList[index])
                            } else {
                                this.badList.push(evaluationTagList[index])
                            }
                        }
                    }
                })
            },
            timeChange () {
                this.dialogVisible = true
            },
            cancleTime () {
                this.dialogVisible = false
            },
            confirmTime (timeMark, dateRangeTwo, dateRangeTimeStamp) {
                if (timeMark === 'miss') {
                    this.dateRangeVariousTimeStamp = dateRangeTwo
                    console.log(this.dateRangeVariousTimeStamp)
                }
                this.dialogVisible = false
                this.getCustomerChatDetailData()
            },
            getCustomerChatDetailData (type) {
                if (type === 1 ) {
                    this.queryData.page.pageNum = 1
                }
                this.loading = true
                let chatTimeStart = ''
                let chatTimeEnd = ''
                switch(this.queryData.duration){
                    case 2: chatTimeStart = 0;chatTimeEnd=60000;break;
                    case 3: chatTimeStart = 60000;chatTimeEnd=300000;break;
                    case 4: chatTimeStart = 300000;chatTimeEnd=900000;break;
                    case 5: chatTimeStart = 900000;chatTimeEnd=3600000;break;
                    case 6: chatTimeStart = 3600000;chatTimeEnd='';break;
                }
                let params = {
                    chatStartTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    chatEndTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    staffId: this.queryData.staffId,
                    userId: this.queryData.userId,
                    chatRecordId: this.queryData.chatRecordId,
                    appLanguage: this.queryData.language,
                    userCountry: this.queryData.countryCode,
                    userEvaluation: this.queryData.userEvaluation,
                    evaluationTag: this.queryData.evaluationTag,
                    chatTimeStart,
                    chatTimeEnd,
                    page: this.queryData.page
                }
                CustomerChatDetailData(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.tableData = res.data
                        this.total = res.total
                    }
                })
            },
            searcher () {
                this.getCustomerChatDetailData(1)
            },
            research () {
                this.queryData.userId= ''
                this.queryData.language= ''
                this.queryData.countryCode= ''
                this.queryData.chatRecordId= ''
                this.queryData.staffId= ''
                this.queryData.duration= ''
                this.queryData.userEvaluation= ''
                this.queryData.evaluationTag= ''
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
                this.getCustomerChatDetailData()
            },
            exportData () {
                let chatTimeStart = ''
                let chatTimeEnd = ''
                switch(this.queryData.duration){
                    case 2: chatTimeStart = 0;chatTimeEnd=60000;break;
                    case 3: chatTimeStart = 60000;chatTimeEnd=300000;break;
                    case 4: chatTimeStart = 300000;chatTimeEnd=900000;break;
                    case 5: chatTimeStart = 900000;chatTimeEnd=3600000;break;
                    case 6: chatTimeStart = 3600000;chatTimeEnd='';break;
                }
                let params = {
                    chatStartTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    chatEndTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    staffId: this.queryData.staffId,
                    userId: this.queryData.userId,
                    chatRecordId: this.queryData.chatRecordId,
                    appLanguage: this.queryData.language,
                    userCountry: this.queryData.countryCode,
                    userEvaluation: this.queryData.userEvaluation,
                    evaluationTag: this.queryData.evaluationTag,
                    chatTimeStart,
                    chatTimeEnd
                }
                RouteAndExport({
                    type: 4,
                    param: JSON.stringify(this.filterData(params))
                }).then(response => {
                    if (response.ret.errcode == 1) {
                        switch (response.code) {
                        case 1:
                        case 2:
                        case 3:
                            this.$notify({
                            title: "生成导出任务成功",
                            message:
                                "导出的数据文件正在生成中，请至文件中心查看进度并下载",
                            type: "success",
                            onClose: () => {
                                this.$router.push("/fileCenter/exportList");
                            },
                            duration: 1500
                            });
                            break;
                        case 4:
                            this.$notify({
                            title: "生成导出任务失败",
                            message: "任务生成失败，请稍后再试",
                            type: "info"
                            });
                            break;
                        case 5:
                            this.$notify({
                            title: "导出限制",
                            message: "相同参数的导出任务，同个用户15分钟内只允许导出一次",
                            type: "info"
                            });
                            break;

                        case 6:
                            this.$notify({
                            title: "请勿反复提及导出任务",
                            message: "请勿重复提交，30秒后再尝试",
                            type: "info"
                            });
                        default:
                            break;
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .chat-detail{
        .box-title{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 10px;
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
        .lang{
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
            .user-id{
                width: 100px;
            }
        }
        .country{
            display: flex;
            align-items: center;
            margin-top: 10px;
            margin-left: 10px;
            font-size: 12px;
        }
        .btn{
            margin-left: 10px;
        }
        .pagenation{
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
    }
</style>
