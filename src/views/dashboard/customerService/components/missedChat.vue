<template>
    <div class="missed-chat">
        <div class="box-title">
            <div @click="timeChange()" class="line-chart-time">
                {{dateRangeVariousTimeStamp[0]}}~{{dateRangeVariousTimeStamp[1]}}
                <i class="iconfont">&#xe65b;</i>
            </div>
            <div class="lang">
                <div class="user-id">用户userID：</div>
                <el-input v-model="queryData.userId" placeholder="请输入" size="mini"></el-input>
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
            <div class="lang">
                <div>等待时长：</div>
                <el-select v-model="queryData.waitTimeTotal" placeholder="请选择" filterable clearable size="mini">
                    <el-option v-for="item in waitingTime" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="searcher" class="btn">搜索</el-button>
                <el-button @click="research" class="btn">重置</el-button>
                <el-button type="primary" @click="exportData" class="btn">导出数据</el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border v-loading="loading">
            <el-table-column label="用户userId" width="180" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>{{ scope.row.userId }}</div>
                </template>
            </el-table-column>
            <el-table-column label="等待开始时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.waitStartTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="等待结束时间" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.waitEndTime }}</div>
                </template>
            </el-table-column>
            <el-table-column label="等待时长" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.waitTimeTotal }}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="App版本" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.version }}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="客户终端选择语言" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.language }}</div>
                </template>
            </el-table-column>
            <el-table-column label="客户国家" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.countryCode }}</div>
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
        <time-chose v-if="dialogVisible" :dialogVisible="dialogVisible" :timeMark="timeMark" @on-cancle="cancleTime" @on-confirms="confirmTime"></time-chose>
    </div>
</template>
<script>
    import timeChose from '../../memberTeam/components/timeChose'
    import { CustomerServiceUnPickDetailData, CustomerServiceAllDataDetailToExcel, GetDataCenterTypeData } from '@/request/customerService'

    export default {
        data () {
            return {
                dateRangeVariousTimeStamp: [moment().subtract('days', 30).format('YYYY-MM-DD HH:mm:ss'), moment().subtract('days', 1).format('YYYY-MM-DD HH:mm:ss')],
                queryData: {
                    userId: '',
                    language: '',
                    countryCode: '',
                    waitTimeTotal: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                total:0,
                dialogVisible: false,
                reportName:'',
                waitingTime: [],
                tableData: [],
                loading: true,
                timeMark: 'miss'
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
            this.getCustomerServiceUnPickDetailData()
        },
        methods: {
            timeChange () {
                this.dialogVisible = true
            },
            getDataCenterTypeData () {
                GetDataCenterTypeData({}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.reportName = '10'
                        this.waitingTime = res.dataHouseConfig[1].dataHouseComponent[7].dataHouseItemConfig[0].dataHouseItemConfig
                    }
                })
            },
            getCustomerServiceUnPickDetailData () {
                this.loading = true
                let params = {
                    page: this.queryData.page,
                    startTime: moment(this.dateRangeVariousTimeStamp[0]).valueOf().toString(),
                    endTime: moment(this.dateRangeVariousTimeStamp[1]).valueOf().toString(),
                    language: this.queryData.language,
                    countryCode: this.queryData.countryCode,
                    userId: this.queryData.userId,
                    waitTimeTotal: this.queryData.waitTimeTotal,
                    chatSource: '',
                    operationSystem: ''
                }
                CustomerServiceUnPickDetailData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.tableData = res.customerServiceUnPickDetailDataList
                        this.total = Number(res.total)
                    }
                })
            },
            handleCurrentChange (val) {
                console.log(val)
                this.queryData.page.pageNum = val
                this.getCustomerServiceUnPickDetailData()
            },
            handleSizeChange (val) {
                console.log(val)
                this.queryData.page.pageSize = val
                this.getCustomerServiceUnPickDetailData()
            },
            searcher () {
                this.getCustomerServiceUnPickDetailData()
            },
            research () {
                this.queryData.userId= ''
                this.queryData.language= ''
                this.queryData.countryCode= ''
                this.queryData.waitTimeTotal= ''
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
                    userId : this.queryData.userId, //	用户userId
                    comment : '', //	客户评价
                    language : this.queryData.language, //	客户终端语言
                    countryCode : this.queryData.countryCode, //	客户国家
                    operationSystem : '', //	操作系统 暂时不用
                    chatSource : '', //	聊天来源 暂时不用
                    customerServiceGroup: '', //客服组
                    commentTag : '', //	评价标签
                    waitTimeTotal : this.queryData.waitTimeTotal, //等待时长
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
            confirmTime (timeMark, dateRangeTwo, dateRangeTimeStamp) {
                console.log(timeMark, dateRangeTwo, dateRangeTimeStamp)
                if (timeMark === 'miss') {
                    this.dateRangeVariousTimeStamp = dateRangeTwo
                    console.log(this.dateRangeVariousTimeStamp)
                } 
                this.dialogVisible = false
                this.getCustomerServiceUnPickDetailData()
            },
        },
    }
</script>
<style lang="scss" scoped>
    .missed-chat{
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