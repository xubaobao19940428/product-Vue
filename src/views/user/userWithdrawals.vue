<template>
    <div class="app-container">
        <el-form inline label-width="80px">
            <el-form-item label="国家：">
                <el-select v-model="queryData.countryCode" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in countryList"
                            :key="index"
                            :label="item.nameCn"
                            :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户id：" class="filter-item">
                <el-input placeholder="请输入用户id" size="medium" style="min-width: 220px" clearable v-model="queryData.userId" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" class="filter-item">
                <el-input placeholder="请输入用户名" size="medium" style="min-width: 220px" clearable v-model="queryData.userName" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="提现时间：" class="filter-item">
                <el-date-picker value-format="timestamp" v-model="timeList"
                                type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="提现状态：" class="filter-item">
                <el-select v-model="queryData.cashStatus" size="medium">
                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <span v-show="drop">
                <el-form-item label="银行卡号：" class="filter-item">
                    <el-input placeholder="请输入银行卡号" size="medium" style="min-width: 200px" clearable v-model="queryData.bankNo" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="银行名称：" class="filter-item">
                    <el-select v-model="queryData.bankName" filterable clearable size="medium">
                        <el-option v-for="(item, index) in bankList" :key="index" :label="item.bankName" :value="item.bankName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱：" class="filter-item">
                    <el-input placeholder="请输入邮箱" size="medium" clearable v-model="queryData.email" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" class="filter-item">
                    <el-input placeholder="请输入手机号" size="medium" clearable v-model="queryData.telNo" @keyup.enter.native="search"></el-input>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <el-button
                    v-if="hasPermission('BTN_USER_WITHDRAWALS_DOWNLOAD')"
                    icon="el-icon-download" type="primary" plain @click="exportDataFile" size="medium">导出</el-button>
                <template v-if="hasPermission('BTN_USER_WITHDRAWALS')">
                    <el-button size="medium" @click="batchSure" type="success">批量成功</el-button>
                    <el-button size="medium" @click="batchFail" type="danger">批量失败</el-button>
                </template>
                <!-- <el-button size="medium" @click="batchWithdrawal" v-if="hasPermission('BTN_USER_WITHDRAWALS')">批量提现</el-button> -->
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed="left" prop="userId" label="用户ID" align="center" min-width="100px">
                </el-table-column>
                <el-table-column fixed="left" prop="userName" label="用户名" align="center" min-width="150px">
                </el-table-column>
                <el-table-column prop="countryCode" fixed="left" label="国家" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="bankName" label="银行名称" align="center" min-width="200px">
                </el-table-column>
                <el-table-column prop="bankNo" label="银行卡号" align="center" width="150px">
                </el-table-column>
                <el-table-column prop="userName" label="银行账户名" align="center" min-width="200px">
                </el-table-column>
                <el-table-column label="提现积分" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ getCurrencyUnit( scope.row.countryCode, 'currencyUnit') + ' ' + scope.row.cashAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="到账积分" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.cashAccountAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="提现手续费" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.fee }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="提现申请时间" align="center" width="170px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column prop="telNo" label="手机号" align="center" min-width="140px">
                </el-table-column>
                <el-table-column prop="email" label="Email" align="center" min-width="200px">
                </el-table-column>
                <el-table-column fixed="right" label="状态" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cashStatus === 0" size="mini"  close-transition>
                            {{scope.row.cashStatusStr}}
                        </el-tag>
                        <el-tag v-if="scope.row.cashStatus === 1" type="success" size="mini" close-transition>
                            {{scope.row.cashStatusStr}}
                        </el-tag>
                        <el-tag v-if="scope.row.cashStatus === 2" type="danger" size="mini" close-transition>
                            {{scope.row.cashStatusStr}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="200px">
                    <template slot-scope="scope" v-if="scope.row.cashStatusStr==='待提现' && hasPermission('BTN_USER_WITHDRAWALS')" >
                        <el-button type="success" size="mini" @click="makeSure(scope.row)"> 提现成功</el-button>
                        <el-button type="danger" size="mini" @click="makeFail(scope.row)"> 提现失败</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="400px" :before-close="handleClose" :close-on-click-modal="false">
            <div class="editGoodsGounp">
                是否提现?
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="info" @click="makeFail">提现失败</el-button>
                <el-button size="mini" type="primary" @click="makeSure">提现成功</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        listBanksOfCountry,
        listUserWithdrawalByPage,
        listUserWithdrawalExport,
        confirmUserWithdrawalApply
    } from '@/request/polypay'

    export default {
        // 用户提现管
        name: 'userWithdrawals',
        data() {
            return {
                countryList: [{
                    nameCn: '马来西亚',
                    shortCode: 'MY'
                },{
                    nameCn: '泰国',
                    shortCode: 'TH'
                },{
                    nameCn: '新加坡',
                    shortCode: 'SG'
                },{
                    nameCn: '印度尼西亚',
                    shortCode: 'ID'
                }],
                loading: false,
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                dataList: [],
                statusList: [{
                    name: '未打款',
                    value: 0
                }, {
                    name: '已打款',
                    value: 1
                }, {
                    name: '打款失败',
                    value: 2
                }],
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    countryCode: 'MY',
                    userId: '',
                    userName: '',
                    bankNo: '',
                    bankName: '',
                    email: '',
                    telNo: '',
                    cashStatus: 0
                },
                total: 0,
                timeList: [],
                dialogVisible: false,
                cashOutCode: '',
                status: '',
                screenlist: {},
                bankList: [],
                multipleSelection: [],
                withdrawalCode: []
            }
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastMonth () {
                return this.$store.state.globalNum.lastMonth
            },
            // countryList () {
            //     return this.$store.state.dict.countryList
            // }
        },
        created() {
            this.timeList = [this.lastMonth, this.nowEnd]
            if (this.$route.query.mobiles === undefined) {
                this.getUserWithdrawal()
            } else {
                this.screenlist = {
                    telNo: this.$route.query.mobiles
                }
                this.queryData.telNo = this.$route.query.mobiles
                this.getUserWithdrawal()
            }
            this.getBankListOfCountry()
        },
        methods: {
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            getBankListOfCountry() {
                let params = {
                    countryCode: 'MY'
                }
                listBanksOfCountry(params).then((response) => {
                    let data = response
                    this.bankList = data.bankSimple
                }).catch((err) => {
                    console.error(err)
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getUserWithdrawal() {
                this.loading = true
                this.timeList = this.timeList ? this.timeList : []
                let params = this.filterData(Object.assign(this.queryData,
                    {startTime: !this.timeList[0] ? null : this.timeList[0]+'',
                    endTime: !this.timeList[1] ? null : this.timeList[1]+''}))
                listUserWithdrawalByPage(params).then((response) => {
                    this.loading = false
                    let res = response
                    this.dataList = res.cashOutRecordDo
                    for (let item of this.dataList) {
                        let status = ['待提现', '提现成功', '提现失败']
                        item.cashStatusStr = status[item.cashStatus]
                    }
                    this.total = res.total
                }).catch((err) => {
                    console.error(err)
                    this.loading = false
                })
            },
            exportDataFile() {
                this.timeList = this.timeList ? this.timeList : []
                let params = this.filterData(Object.assign(this.queryData,
                    {startTime: !this.timeList[0] ? null : this.timeList[0]+'',
                    endTime: !this.timeList[1] ? null : this.timeList[1]+''}))
                listUserWithdrawalExport(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.url
                        // console.log(fileUrl)
                        let a = document.createElement('a')
                        a.src = this.dealShowFileSrc(fileUrl)
                        a.href = this.dealShowFileSrc(fileUrl)
                        a.click()

                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            search() {
                this.getUserWithdrawal()
            },
            resetSearch() {
                this.timeList = []
                this.queryData = {
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    userId: '',
                    userName: '',
                    bankNo: '',
                    bankName: '',
                    email: '',
                    telNo: '',
                    cashStatus: ''
                }
                this.getUserWithdrawal()
            },
            // batchWithdrawal() {
            //     let unWithdrawls = []
            //     _.forEach(this.multipleSelection, item => {
            //         if (item.cashStatus === 0) {
            //             unWithdrawls.push(item.cashOutCode)
            //         }
            //     })
            //     if (unWithdrawls.length > 0) {
            //         this.withdrawalCode = unWithdrawls
            //         this.dialogVisible = true
            //     } else {
            //         this.$message.warning('请选择待提现')
            //     }
            // },
            // toEditProduct(row) {
            //     // this.cashOutCode = row.cashOutCode
            //     this.withdrawalCode = [row.cashOutCode]
            //     this.dialogVisible = true
            // },
            batchFail () {
                let unWithdrawls = []
                _.forEach(this.multipleSelection, item => {
                    if (item.cashStatus === 0) {
                        unWithdrawls.push(item.cashOutCode)
                    }
                })
                if (unWithdrawls.length > 0) {
                    this.withdrawalCode = unWithdrawls
                    this.$confirm('确认提现失败', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            'cashStatus': 2,
                            'remark': '失败',
                            'withdrawalCode': unWithdrawls
                        }
                        confirmUserWithdrawalApply(params).then((response) => {
                            if (response.ret.errcode === 1) {
                                this.dialogVisible = false
                                this.$message.success('操作成功')
                            } else {
                                this.dialogVisible = false
                                this.$message.success('操作失败')
                            }
                            this.getUserWithdrawal()
                        }).catch((err) => {
                            console.error(err)
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                } else {
                    this.$message.warning('请选择待提现')
                }
            },
            batchSure () {
                let unWithdrawls = []
                _.forEach(this.multipleSelection, item => {
                    if (item.cashStatus === 0) {
                        unWithdrawls.push(item.cashOutCode)
                    }
                })
                if (unWithdrawls.length > 0) {
                    this.withdrawalCode = unWithdrawls
                    this.$confirm('确认提现成功', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            'cashStatus': 1,
                            'remark': '成功',
                            'withdrawalCode': unWithdrawls
                        }
                        confirmUserWithdrawalApply(params).then((response) => {
                            if (response.ret.errcode === 1) {
                                this.dialogVisible = false
                                this.$message.success('操作成功')
                            } else {
                                this.dialogVisible = false
                                this.$message.success('操作失败')
                            }
                            this.getUserWithdrawal()
                        }).catch((err) => {
                            console.error(err)
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                } else {
                    this.$message.warning('请选择待提现')
                }
            },
            makeFail (row) {
                this.$confirm('确认提现失败', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        'cashStatus': 2,
                        'remark': '失败',
                        'withdrawalCode': [row.cashOutCode]
                    }
                    confirmUserWithdrawalApply(params).then((response) => {
                        if (response.ret.errcode === 1) {
                            this.dialogVisible = false
                            this.$message.success('操作成功')
                        } else {
                            this.dialogVisible = false
                            this.$message.success('操作失败')
                        }
                        this.getUserWithdrawal()
                    }).catch((err) => {
                        console.error(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            makeSure (row) {
                this.$confirm('确认提现成功', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        'cashStatus': 1,
                        'remark': '成功',
                        'withdrawalCode': [row.cashOutCode]
                    }
                    confirmUserWithdrawalApply(params).then((response) => {
                        if (response.ret.errcode === 1) {
                            this.dialogVisible = false
                            this.$message.success('操作成功')
                        } else {
                            this.dialogVisible = false
                            this.$message.success('操作失败')
                        }
                        this.getUserWithdrawal()
                    }).catch((err) => {
                        console.error(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            handleClose() {
                this.dialogVisible = false
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getUserWithdrawal()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getUserWithdrawal()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .editGoodsGounp {
        width: 100%;
        height: 100px;
        line-height: 60px;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        padding: 20px 0;
    }
</style>
