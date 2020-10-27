<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form label-width="100px" inline>
                <el-form-item label="订单/提现号：">
                    <el-input v-model="userCommission.param.sourceId" clearable size="medium" placeholder="请输入订单号" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="用户ID：">
                    <el-input v-model="userCommission.param.userId" clearable size="medium" placeholder="请输入用户ID" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="时间段：">
                    <el-date-picker v-model="userCommission.timeList" value-format="timestamp" clearable size="medium" type="daterange"
                                    unlink-panels align="right" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="收益类型：">
                    <el-select v-model="userCommission.param.sourceType" clearable size="medium">
                        <el-option v-for="(val, key) in userCommission.sourceType" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model="userCommission.param.detailType" clearable size="medium">
                        <el-option v-for="(val, key) in userCommission.detailType" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" size="medium" @click="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table border :data="userCommission.dataList" v-loading="loading" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" height="100%">
            <el-table-column type="index" width="50" align="center" fixed="left">
            </el-table-column>
            <el-table-column prop="userId" align="center" label="用户ID" fixed="left">
            </el-table-column>
            <el-table-column prop="sourceId" min-width="200px" align="center" label="订单/提现号">
                <template slot-scope="scope">
                    <div class="link" v-if="scope.row.sourceId" @click="triggerToOderList(scope.row.sourceId)">{{ scope.row.sourceId}}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column prop="accountDetailNo" min-width="240px" align="center" label="流水号">
            </el-table-column>
            <el-table-column prop="amount" align="center" label="金额">
            </el-table-column>
            <el-table-column label="类型" align="center" min-width="140px">
                <template slot-scope="scope">
                    <el-tag type="plain" size="mini" close-transition>
                        {{scope.row.sourceType}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isDelete === '0'"  type="Info" size="mini"  close-transition>
                        失效
                    </el-tag>
                    <el-tag v-else size="mini" close-transition>
                        有效
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="流水类型" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.detailType === '收入'"  type="success" size="mini"  close-transition>
                        收入
                    </el-tag>
                    <el-tag v-else type="warning" size="mini"  close-transition>
                        支出
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="120px">
                <template slot-scope="scope">
                    {{scope.row.memo || '-'}}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="160px" align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | secondTimeFormat}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="80" align="center" v-if="hasPermission('MENU_USER_INCOME_RECORD_ROLL_BACK')">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleRollBack(scope.row)" type="danger">回滚</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="userCommission.param.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="userCommission.param.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="userCommission.totals">
            </el-pagination>
        </div>
  </div>
</template>

<script>
    import { listAccountDetailByPage, accountDetailRollBack } from '@/request/polypay'

    export default {
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                userCommission: {
                    totals: 0,
                    detailType: {
                        'income': '收入',
                        'expense': '支出'
                    },
                    sourceType: {
                        1: '商品返利',
                        2: '介绍费',
                        4: 'Affiliate购买返利',
                        5: '团队销售奖励',
                        6: '培训津贴',
                        7: '介绍费+培训津贴',
                        8: '团队培训津贴',
                        9: '系统奖励',
                        10: '销售培训津贴',
                        // 11: '大礼包奖励',
                        // 12: '大礼包团队启动奖',
                        // 13: '大礼包团队管理奖励',
                        // 14: '大礼包伯乐奖',
                        // 17: '积分支付',
                        20: '活动积分',
                        99: '提现失败',
                        100: '提现',
                        101: '订单支付',
                        102: '订单退款',
                        103: '拼团订单退款',
                        104: '订单退款佣金扣除',
                        110: '订单售后单退款'
                    },
                    dataList: [],
                    timeList: [],
                    param: {
                        page: {
                            pageNum: 1,
                            pageSize: 20
                        },
                        sourceId: '',
                        userId: '',
                        sourceType: '',
                        detailType: ''
                    }
                }
            }
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastWeek () {
                return this.$store.state.globalNum.lastWeek
            }
        },
        created () {
            this.userCommission.timeList = [this.lastWeek, this.nowEnd]
            this.getUserIncomeList()
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
            handleRollBack (item) {
                const { accountDetailNo } = item
                accountDetailRollBack({ accountDetailNo }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('回滚成功')
                        this.getUserIncomeList()
                    }
                })
            },
            resetSearch () {
                this.userCommission.timeList = [this.lastWeek, this.nowEnd]
                this.userCommission.param = {
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    sourceId: '',
                    userId: '',
                    sourceType: '',
                    detailType: ''
                }
                this.getUserIncomeList()
            },
            search () {
                this.getUserIncomeList()
            },
            getUserIncomeList () {
                this.loading = true
                this.userCommission.timeList = this.userCommission.timeList ? this.userCommission.timeList : []
                let params = this.filterData(Object.assign(this.userCommission.param, {
                    startTime: !this.userCommission.timeList[0] ? null : (this.userCommission.timeList[0]).toString(),
                    endTime: !this.userCommission.timeList[1] ? null : (this.userCommission.timeList[1]).toString()
                }))
                listAccountDetailByPage(params).then((response) => {
                    this.loading = false
                    console.log(response)
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.userCommission.dataList = res.data
                        this.userCommission.totals = res.total
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            },
            handleCurrentChange (val) {
                this.userCommission.param.page.pageNum = val || this.userCommission.param.page.pageNum
                this.getUserIncomeList()
            },
            handleSizeChange (val) {
                this.userCommission.param.page.pageSize = val
                this.getUserIncomeList()
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
