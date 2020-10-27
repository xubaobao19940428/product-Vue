<template>
    <div class="app-container">
        <div class="filter-container">
        <el-form label-width="100px" inline>
            <el-form-item label="订单号：">
                <el-input v-model="orderCommission.param.orderNo" clearable size="medium" placeholder="请输入订单号" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="得钱用户ID：">
                <el-input v-model="orderCommission.param.userId" clearable size="medium" placeholder="请输入用户ID" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="买家ID：">
                <el-input v-model="orderCommission.param.buyerId" clearable size="medium" placeholder="请输入买家ID" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <span v-show="drop">
                <el-form-item label="返佣类型：">
                    <el-select v-model="orderCommission.param.commissionType" clearable size="medium">
                        <el-option v-for="(val, key) in orderCommission.commissionType" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="返佣状态：">
                    <el-select v-model="orderCommission.param.commissionStatus" clearable size="medium">
                        <el-option v-for="(val, key) in orderCommission.commissionStatus" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间段：">
                    <el-date-picker v-model="orderCommission.timeList" value-format="timestamp" type="daterange" size="medium" align="right" unlink-panels
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" size="medium" @click="search">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        </div>
        <el-table border :data="orderCommission.dataList" v-loading="loading" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" height="100%">
            <el-table-column type="index" width="50" align="center">
            </el-table-column>
            <el-table-column prop="orderNo" min-width="180px" label="订单号" align="center">
                <template slot-scope="scope">
                    <div class="link" @click="triggerToOderList(scope.row.orderNo)">{{ scope.row.orderNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="buyerId" align="center" label="买家id">
                <template slot-scope="scope">
                    <div class="link" @click="clickToMemberInfo(scope.row.buyerId)">
                        {{scope.row.buyerId}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="userId" min-width="130px" align="center" label="得钱用户ID">
                <template slot-scope="scope">
                    <div class="link" @click="clickToMemberInfo(scope.row.userId)">
                        {{scope.row.userId}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="orderSumYuan" align="center" label="订单金额">
            </el-table-column>
            <el-table-column prop="memberLevel" align="center" label="会员等级">
            </el-table-column>
            <el-table-column prop="commissionAmountYuan" label="佣金(￥)" align="center">
            </el-table-column>
            <el-table-column prop="commissionStatusDesc" min-width="200px" align="center" label="返佣状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.commissionStatus === 1" size="mini"  close-transition>
                        {{scope.row.commissionStatusDesc}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.commissionStatus === 2" type="success" size="mini" close-transition>
                        {{scope.row.commissionStatusDesc}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.commissionStatus === 3" type="danger" size="mini" close-transition>
                        {{scope.row.commissionStatusDesc}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.commissionStatus === 4" type="warning" size="mini" close-transition>
                        {{scope.row.commissionStatusDesc}}
                    </el-tag>
                    <el-tag v-else-if="scope.row.commissionStatus === 5" type="info" size="mini" close-transition>
                        {{scope.row.commissionStatusDesc}}
                    </el-tag>
                    <el-tag v-else size="mini" close-transition>
                        {{scope.row.commissionStatusDesc}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="commissionTypeDesc" min-width="150px" align="center" label="返佣类型">
            </el-table-column>
            <el-table-column prop="createTime" min-width="180px" align="center" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | secondTimeFormat}}
                </template>
            </el-table-column>
        </el-table>
    <div class="page-wrapper">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="orderCommission.param.page.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="orderCommission.param.page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="orderCommission.totals">
        </el-pagination>
    </div>
  </div>
</template>

<script>
    import { listOrderCommissionByPage } from '@/request/user'

    export default {
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                orderCommission: {
                    timeList: [],
                    dataList: [],
                    totals: 0,
                    commissionType: {
                        1: '商品返利',
                        2: '介绍费',
                        4: 'Affiliate购买返利',
                        5: '团队销售奖励',
                        6: '培训津贴',
                        7: '介绍费+培训津贴',
                        8: '团队培训津贴',
                        9: '系统奖励',
                        10: '销售培训津贴',
                        11: '大礼包奖励',
                        12: '大礼包团队启动奖',
                        13: '大礼包团队管理奖励',
                        14: '大礼包伯乐奖',
                        15: '提现',
                        16: '提现失败',
                        17: '积分支付'
                    },
                    commissionStatus: {
                        1: '付款完成，待返佣',
                        2: '已返佣',
                        3: '订单被取消，取消反佣',
                        4: '售后中',
                        5: '退款成功，取消返佣'
                    },
                    param: {
                        page: {
                            pageNum: 1,
                            pageSize: 20,
                            pagingSwitch: true
                        },
                        commissionType: '',
                        orderNo: '',
                        commissionStatus: '',
                        userId: '',
                        buyerId: ''
                    }
                }
            }
        },
        created () {
            this.orderCommissionQuery()
            this.orderCommission.timeList = [this.lastWeek, this.nowEnd]
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastWeek () {
                return this.$store.state.globalNum.lastWeek
            }
        },
        methods: {
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            resetSearch () {
                this.orderCommission.timeList = [this.lastWeek, this.nowEnd]
                this.orderCommission.param = {
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    },
                    commissionType: '',
                    orderNo: '',
                    commissionStatus: '',
                    userId: '',
                    buyerId: ''
                }
                this.orderCommissionQuery()
            },
            search () {
                this.orderCommission.param.page.pageNum = 1
                this.orderCommissionQuery()
            },
            // 返佣记录查询
            orderCommissionQuery () {
                this.loading = true
                this.orderCommission.timeList = this.orderCommission.timeList ? this.orderCommission.timeList : []
                let params = this.filterData(Object.assign(this.orderCommission.param, {
                    startTime: !this.orderCommission.timeList[0] ? null : (this.orderCommission.timeList[0]).toString(),
                    endTime: !this.orderCommission.timeList[1] ? null : (this.orderCommission.timeList[1]).toString()
                }))
                console.log(params)
                listOrderCommissionByPage(params).then((response) => {
                    this.loading = false
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.orderCommission.totals = res.total
                        this.orderCommission.dataList = res.orderCommissionResp
                    }
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            },
            handleCurrentChange (val) {
                this.orderCommission.param.page.pageNum = val || this.orderCommission.param.page.pageNum
                this.orderCommissionQuery()
            },
            handleSizeChange (val) {
                this.orderCommission.param.page.pageSize = val
                this.orderCommissionQuery()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-wrapper {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
</style>
