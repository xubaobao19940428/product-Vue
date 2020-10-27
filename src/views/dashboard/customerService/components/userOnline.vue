<template>
    <div class="user-online">
        <div class="box-title">
            <div @click="timeChange()" class="line-chart-time">
                {{dateRangeVariousTimeStamp[0]}}~{{dateRangeVariousTimeStamp[1]}}
                <i class="iconfont">&#xe65b;</i>
            </div>
            <div class="lang">
                <div>用户选择语言：</div>
                <el-select v-model="queryData.language" placeholder="请选择" filterable clearable size="mini" @change="change">
                    <el-option v-for="item in languageList" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                </el-select>
            </div>
            <div class="country">
                <div>用户所属国家：</div>
                <el-select v-model="queryData.countryCode" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="search" class="btn">搜索</el-button>
                <el-button @click="research" class="btn">重置</el-button>
                <el-button type="primary" @click="exportData" class="btn">导出数据</el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border v-loading="loading">
            <el-table-column label="日期时间" width="180" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>{{ scope.row.dateDay }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="访问UV" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.uv }}</div>
                </template>
            </el-table-column>
            <el-table-column label="机器人聊天数" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.robotChat }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="转人工客服聊天数" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.humanChat }}</div>
                </template>
            </el-table-column>
            <el-table-column label="人工接起量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.humanPick }}</div>
                </template>
            </el-table-column>
            <el-table-column label="接起率" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.pickRate }}</div>
                </template>
            </el-table-column>
            <el-table-column label="放弃量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.notPickUp }}</div>
                </template>
            </el-table-column>
            <el-table-column label="平均等待时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.averageWaitTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="总聊天时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.totalChatTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="平均聊天时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.averageChatTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="评价量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.commentTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="参评率" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.commentRate }}</div>
                </template>
            </el-table-column>
            <el-table-column label="好评量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.goodCommentTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="好评率" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.goodCommentRate }}</div>
                </template>
            </el-table-column>
            <el-table-column label="差评量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.badCommentTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="差评率" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <div>{{ scope.row.badCommentRate }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagenation-box">
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
        <time-chose :dialogVisible="dialogVisible" :timeMark="timeMark" @on-cancle="cancleTime" @on-confirm="confirmTime"></time-chose>
    </div>
</template>
<script>
    import timeChose from '../../memberTeam/components/timeChose'
    import { CustomerServiceUserOnLineData, CustomerServiceAllDataDetailToExcel, GetDataCenterTypeData } from '@/request/customerService'

    export default {
        data () {
            return {
                dateRangeVariousTimeStamp: [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
                queryData: {
                    language: '',
                    countryCode: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                total: 0,
                tableData: [],
                loading: true,
                dialogVisible: false,
                reportName:'',
                timeMark:'user'
            }
        },
        props: {
            countryList: Array,
            languageList: Array
        },
        components: {
            timeChose
        },
        mounted() {
            this.getDataCenterTypeData()
            this.getCustomerServiceUserOnLineData()
        },
        methods: {
            getDataCenterTypeData () {
                GetDataCenterTypeData({}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.reportName = '7'
                    }
                })
            },
            timeChange () {
                this.dialogVisible = true
            },
            getCustomerServiceUserOnLineData () {
                this.loading = true
                let params = {
                    startTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    endTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    language: this.queryData.language,
                    countryCode: this.queryData.countryCode,
                    page: this.queryData.page
                }
                CustomerServiceUserOnLineData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.tableData = res.customerServiceUserOnLineDataList
                        this.total = Number(res.total)
                    }
                })
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getCustomerServiceUserOnLineData()
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getCustomerServiceUserOnLineData()
            },
            search () {
                this.getCustomerServiceUserOnLineData()
            },
            research () {
                this.queryData.language = ''
                this.queryData.countryCode = ''
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
            },
            exportData () {
                let params = {
                    startTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    endTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    reportName: this.reportName,
                    customerServiceName: '',
                    chatTotal: '',
                    chatId : '', //	聊天记录id
                    userId : '', //	用户userId
                    comment : '', //	客户评价
                    language : this.queryData.language, //	客户终端语言
                    countryCode : this.queryData.countryCode, //	客户国家
                    operationSystem : '', //	操作系统 暂时不用
                    chatSource : '', //	聊天来源 暂时不用
                    customerServiceGroup: '', //客服组
                    commentTag : '', //	评价标签
                    waitTimeTotal : '', //等待时长

                }
                CustomerServiceAllDataDetailToExcel(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(this.dealShowFileSrc(res.excelUrl))
                        window.open(this.dealShowFileSrc(res.excelUrl))
                    }
                })
            },
            cancleTime () {
                this.dialogVisible = false
            },
            confirmTime (timeMark, dateRange, dateRangeTimeStamp) {
                console.log(timeMark, dateRange, dateRangeTimeStamp)
                if (timeMark === 'user') {
                    this.dateRangeVariousTimeStamp = dateRange
                    console.log(this.dateRangeVariousTimeStamp)
                } 
                this.dialogVisible = false
                this.getCustomerServiceUserOnLineData()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .user-online{
        .box-title{
            display: flex;
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
        }
        .country{
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
        }
        .btn{
            margin-left: 10px;
        }
        .pagenation-box{
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
    }
</style>