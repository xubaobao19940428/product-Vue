<template>
    <div class="customer-data-card">
        <div class="box-title">
            <div @click="timeChange()" class="line-chart-time">
                {{dateRangeVariousTimeStamp[0]}}~{{dateRangeVariousTimeStamp[1]}}
                <i class="iconfont">&#xe65b;</i>
            </div>
            <div class="lang">
                <div>客服姓名：</div>
                <el-select v-model="queryData.customerServiceName" size="mini" filterable clearable @change="customerChange">
                    <el-option v-for="item in csStaffInfo" :key="item.staffId" :label="item.staffNickName" :value="item.staffId"></el-option>
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
            <el-table-column label="客服" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.customerServiceName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="登陆时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.loginTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="退出时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.logoutTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="登陆时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.loginTimeTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="接线量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.pickTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="在线时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.onLineTotal }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="平均等待时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.averageWaitTime }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="忙绿时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.busyTotl }}</div>
                </template>
            </el-table-column>
            <el-table-column label="置忙次数" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.busyStatusTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="客服利用率" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.customerServiceRate }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="首次响应时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.firstPickUpTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="平均响应时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.averagePickUpTotal }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="总聊天时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.chatTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="平均聊天时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.averageChatTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="评价量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.commentTotal }}</div>
                </template>
            </el-table-column>
            <el-table-column label="评价率" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.commentRate }}</div>
                </template>
            </el-table-column>
            <el-table-column label="好评量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.goodComment }}</div>
                </template>
            </el-table-column>
            <el-table-column label="好评率" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.goodCommentRate }}</div>
                </template>
            </el-table-column>
            <el-table-column label="差评量" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.badComment }}</div>
                </template>
            </el-table-column>
            <el-table-column label="差评率" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <div>{{ scope.row.badCommentRate }}</div>
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
        <time-chose :dialogVisible="dialogVisible" :timeMark="timeMark" @on-cancle="cancleTime" @on-confirm="confirmTime"></time-chose>
    </div>
</template>
<script>
    import timeChose from '../../memberTeam/components/timeChose'
    import { CustomerServiceEachDetailData, CustomerServiceAllDataDetailToExcel } from '@/request/customerService'

    export default {
        data () {
            return {
                dialogVisible: false,
                dateRangeVariousTimeStamp: [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
                queryData: {
                    customerServiceName: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                total: 0,
                tableData: [],
                loading: true,
                reportName:'',
                timeMark:'user'
            }
        },
        props: {
            csStaffInfo: Array
        },
        components: {
            timeChose
        },
        mounted() {
            this.getCustomerServiceEachDetailData()
        },
        methods: {
            customerChange (val) {
                console.log(val)
            },
            timeChange () {
                this.dialogVisible = true
            },
            getCustomerServiceEachDetailData () {
                this.loading = true
                let params = {
                    startTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    endTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    customerServiceName: this.queryData.customerServiceName,
                    page: this.queryData.page
                }
                CustomerServiceEachDetailData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.tableData = res.customerServiceEachDetailDataList
                        this.total = Number(res.total)
                    }
                })
            },
            handleCurrentChange (val) {
                console.log(val)
                this.queryData.page.pageNum = val
                this.getCustomerServiceEachDetailData()
            },
            handleSizeChange (val) {
                console.log(val)
                this.queryData.page.pageSize = val
                this.getCustomerServiceEachDetailData()

            },
            search () {
                this.getCustomerServiceEachDetailData()
            },
            research () {
                this.queryData.customerServiceName = ''
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
            },
            exportData () {
                let params = {
                    startTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    endTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    reportName: '8',
                    customerServiceName: this.queryData.customerServiceName,
                    chatTotal: '',
                    chatId : '', //	聊天记录id
                    userId : '', //	用户userId
                    comment : '', //	客户评价
                    language : '', //	客户终端语言
                    countryCode : '', //	客户国家
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
                this.getCustomerServiceEachDetailData()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .customer-data-card{
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
        .pagenation{
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
    }
</style>