<template>
    <div class="app-container">
        <div class="text-content-wrapper">
            <el-row :gutter="20">
                <el-col :span="8" class="text-common">今日新用户注册成本：{{ currencyUnit + dayAmount }}</el-col>
                <!-- <el-col :span="6" class="text-common">今日拉新效率：{{ todayNewUserRate }}</el-col> -->
                <el-col :span="8" class="text-common">今日新增注册用户：{{ invite }}人</el-col>
                <el-col :span="8" class="text-common">累计拉新人数：{{ totalNewUser }}人</el-col>
                <el-col :span="8" class="text-common">累计拉新成本：{{ currencyUnit + totalAmount }}</el-col>
            </el-row>
            <el-button
                v-if="hasPermission('BTN_RED_BAG_BEFORE_SUCCESS')"
                size="medium"
                type="primary"
                @click="getSuccessConfig"
            >提前拆成功概率配置</el-button>
            <el-button
                v-if="hasPermission('BTN_RED_BAG_SYSTEM_CONFIG')"
                size="medium"
                type="primary"
                @click="handleSystemConfig"
            >动态算法配置</el-button>
        </div>
        <!-- <a download="文件" href="https://file-test.fingo.shop/data/nfs/fingo/marketing/2019-11/30/test-7527825150554526.xlsx">文件</a> -->
        <el-form inline label-widht="80px">
            <el-form-item label="状态：">
                <el-select v-model="searchParam.status"
                    clearable
                >
                    <el-option v-for="(value, label) in statusList" :key="label" 
                        :label="value"
                        :value="parseInt(label)"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发起人用户id：">
                <el-input v-model="searchParam.userId"/>
            </el-form-item>
            <el-form-item label="发起时间：">
                <el-date-picker type="daterange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    v-model="createTimeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="拆成时间：">
                <el-date-picker type="daterange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    v-model="successTimeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="看板：">
                <el-select v-model="paneType" @change="handlePaneChange(paneType)">
                    <el-option 
                        v-for="item in paneTypeList" 
                        :key="item.key" 
                        :value="item.key" 
                        :label="item.name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px">
                <el-button type="primary"
                    @click="handleSearch"
                    icon="el-icon-search"
                    size="medium"
                >查询</el-button>
                <el-button type="primary" plain 
                    icon="el-icon-download"
                    @click="handleDownload"
                    v-if="hasPermission('BTN_RED_BAG_DOWNLOAD')"
                >下载</el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <div class="consist-table-wrapper">
                <div class="table-box" v-for="(item, index) in allConsistList" :key="index" v-show="!paneType">
                    <p class="table-title">{{`红包团类型：${currencyUnit} ${item.amount}`}}</p>
                    <el-table :data="item.statisticsInfo" border>
                        <el-table-column label="新用户数范围" align="center" prop="scop"></el-table-column>
                        <el-table-column label="平均老用户数范围" align="center" prop="oldUserNumAvg"></el-table-column>
                        <el-table-column label="开包人分享次数" align="center" prop="shareNum"></el-table-column>
                        <el-table-column label="红包团数" align="center" prop="count"></el-table-column>
                    </el-table>
                </div>
                <!-- tab的展示形式 -->
                <!-- <div class="table-title">红包团类型</div>
                <el-tabs type="border-card">
                    <el-tab-pane :label="`${currencyUnit} ${item.amount}`" v-for="(item, index) in allConsistList" :key="index">
                        <el-table :data="item.statisticsInfo" border>
                            <el-table-column label="新用户数范围" align="center" prop="scop"></el-table-column>
                            <el-table-column label="平均老用户数范围" align="center" prop="oldUserNumAvg"></el-table-column>
                            <el-table-column label="开包人分享次数" align="center" prop="shareNum"></el-table-column>
                            <el-table-column label="红包团数" align="center" prop="count"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs> -->
            </div>
            <el-table :data="dataList" v-loading="load" v-show="paneType">
                <el-table-column label="ID" prop="id" align="center" fixed="left"></el-table-column>
                <el-table-column label="发起用户" align="center" min-width="160" fixed="left">
                    <template slot-scope="scope">{{ scope.row.nickName }}（{{scope.row.userId}}）</template>
                </el-table-column>
                <el-table-column label="红包金额" prop="amount" align="center"></el-table-column>
                <el-table-column label="已拆金额" prop="successAmount" align="center"></el-table-column>
                <el-table-column label="邀新指标" prop="inviteNum" align="center"></el-table-column>
                <el-table-column label="分享次数" prop="shareNum" align="center"></el-table-column>
                <el-table-column label="老用户数" prop="oldUserNum" align="center"></el-table-column>
                <el-table-column label="新用户数" prop="newUserNum" align="center"></el-table-column>
                <el-table-column label="已邀用户" prop="successNum" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{ statusList[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column label="玩家拆成功次数" align="center" prop="thisPlayerHasSuccessedNum" width="120"></el-table-column>
                <el-table-column label="发起时间" align="center" min-width="180">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="拆成时间" min-width="180" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.successTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="红包到账时间" min-width="180" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.incomeTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="mini"
                            @click="handleShowDetail(scope.row.serialId)"
                            v-if="hasPermission('BTN_RED_BAG_DETAIL')"
                        >助力详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box" v-show="paneType">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>
        <detail-dialog :detail-dialog="detailDialog" @close="handleClose"></detail-dialog>
        <before-success-dialog
            v-if="successDialog.show"
            :beforeSuccessShow="successDialog.show"
            :successDialog="successDialog"
            @close="handleSuccessClose"
            @confirm="handleSuccessConfirm"
        ></before-success-dialog>
    </div>
</template>

<script>
import { 
    findOpenRedbagInfoList, 
    listManageBack, 
    download, 
    getRedbagStatistics, 
    getRedbagStatisticsList,
    getAheadSuccessConfig,
    saveAheadSuccessConfig
} from '@/request/marketing'
import DetailDialog from './detailDialog'
import beforeSuccessDialog from './beforeSuccessDialog'
export default {
    components: {
        DetailDialog,
        beforeSuccessDialog
    },
    props: {
        countryCode: '',
        currencyUnit: '',
        nameCn: ''
    },
    data () {
        return {
            load: false,
            dayAmount: 0,
            invite: 0,
            todayNewUserRate: 0,
            totalAmount: 0,
            totalNewUser: 0,
            searchParam: {
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                status: null,
                userId: ''
            },
            successDialog: {
                show: false,
            },
            paneType: 1,
            paneTypeList: [{key: 0, name: '红包拉人构成'},{key: 1, name: '拼团流水'}],
            createTimeList: [],
            successTimeList: [],
            statusList: {
                1: '进行中',
                2: '已成功',
                3: '已失效',
                4: '未到账'
            },
            detailDialog: {
                show: false,
                detailList: []
            },
            totals: 0,
            dataList: [],
            allConsistList: []
        }
    },
    mounted () {
        this.getStatistics()
        this.getList(1)
    },
    methods: {
        handleSizeChange (value) {
            this.searchParam.page.pageSize = value
            this.getList(1)
        },
        handleSystemConfig () {
            this.$router.push({
                name: 'redBagConfig',
                query: {
                    countryCode: this.countryCode,
                    nameCn: this.nameCn
                }
            })
        },
        normalizeSearchParam () {
            this.createTimeList = this.createTimeList || []
            this.successTimeList = this.successTimeList || []
            let resParam = {}
            resParam = this.filterData(Object.assign(this.searchParam, {
                startCreateTime: !this.createTimeList[0] ? null : this.createTimeList[0] + '',
                endCreateTime: !this.createTimeList[1] ? null : this.createTimeList[1] + '',
                startSuccessTime: !this.successTimeList[0] ? null : this.successTimeList[0] + '',
                endSuccessTime: !this.successTimeList[1] ? null : this.successTimeList[1] + '',
                countryCode: this.countryCode
            }))

            return resParam
        },
        handleSuccessClose () {
            Object.assign(this.successDialog, {
                inviteNumber: 0,
                rate: 0,
                maxSuccessNumber: 0,
                show: false
            })
        },
        handleSuccessConfirm (data) {
            saveAheadSuccessConfig(data).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('设置提前拉新成功概率配置成功')
                    this.handleSuccessClose()
                }
            })
        },
        getSuccessConfig () {
            getAheadSuccessConfig({countryCode: this.countryCode}).then(res => {
                if (res.ret.errcode === 1) {
                    Object.assign(this.successDialog, {
                        inviteNumber: res.inviteNumber,
                        rate: res.rate,
                        maxSuccessNumber: res.maxSuccessNumber,
                        countryCode: res.countryCode
                    }, {
                        show: true
                    })
                }
            })
        },
        arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
            // 合并单元格的操作
            if (columnIndex == 0) {
                if (row.rowspan) {
                    return {
                        rowspan: row.rowspan, // 要合并几行数,所以这个rowspan只适用于放在相同数据的第一个中
                        colspan: 1 // 保持一列
                    }
                } else {
                    return {
                        rowspan: 0, // 相同的数据中，其他行的去掉展示
                        colspan: 0
                    }
                }
            }
        },
        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            
            let resParam = this.normalizeSearchParam()
            listManageBack(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.backManageInfos
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                console.error(err)
                this.load = false
            })
        },
        getConsistList () {
            let otherLoading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let searchParam = {}
            this.createTimeList = this.createTimeList || []
            searchParam.startCreateTime = !this.createTimeList[0] ? null : this.createTimeList[0] + ''
            searchParam.endCreateTime = !this.createTimeList[1] ? null : this.createTimeList[1] + ''
            searchParam.countryCode = this.countryCode

            getRedbagStatisticsList(searchParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.allConsistList = res.statisticsInfos
                    this.totals = 0
                }
                otherLoading.close()
            }).catch(err => {
                otherLoading.close()
            })
        },
        handleSearch (page) {
            if (this.paneType) {
                this.getList(page)
            } else {
                this.getConsistList()
            }
        },
        handlePaneChange (val) {
            if (val) {
                this.getList()
            } else {
                this.getConsistList()
            }
        },
        getStatistics () {
            getRedbagStatistics({countryCode: this.countryCode}).then(res => {
                if (res.ret.errcode === 1) {
                    this.dayAmount = res.todayNewUserCost
                    this.invite = res.todayNewUserCount
                    this.todayNewUserRate = res.todayNewUserRate
                    this.totalAmount = res.totalAmount
                    this.totalNewUser = res.totalNewUser
                }
            })
        },
        handleDownload () {
            let resParam = this.normalizeSearchParam()
            download(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    let a = document.createElement('a')
                    a.download = '文件'
                    a.href = this.dealShowFileSrc(res.url)
                    a.click()
                }
            })
        },
        handleShowDetail (serialId) {
            findOpenRedbagInfoList({serialId}).then(res => {
                if (res.ret.errcode === 1) {
                    Object.assign(this.detailDialog, {
                        show: true,
                        detailList: res.openRedbagInfo
                    })
                }
            })
        },
        handleClose () {
            Object.assign(this.detailDialog, {
                show: false,
                detailList: []
            })
        }
    }
}
</script>

<style lang="scss" scope>
    .text-content-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 8px;
        border-radius: 8px;
        border: 1px solid #f1f2f3;
        margin-bottom: 16px;
        .text-common {
            margin: 0 32px 8px 0;
            font-weight: 500;
            font-size: 20px;
        }
    }
    .main-content-wrapper {
        .consist-table-wrapper {
            display: flex;
            flex-flow: wrap;
            align-items: flex-start;
            justify-content: space-around;
        }
        .table-box {
            width: 46%;
            .table-title {
                text-align: center;
                font-size: 18px;
                font-weight: 600;
                line-height: 30px;
                padding: 16px 0 6px 0;
            }
        }
    }
</style>