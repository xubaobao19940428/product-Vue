<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="changeProInfoFilter" inline label-width="90px" :model="queryData">
                <el-form-item prop="orderId" label="订单号：">
                    <el-input v-model="queryData.orderId" clearable size="medium" style="width: 210px"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="用户手机号：">
                    <el-input v-model="queryData.phone" clearable size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="userId" label="用户ID：">
                    <el-input v-model="queryData.userId" clearable size="medium"></el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="getCustomerOrderList()" size="medium">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
            <div class="main-content-wrapper">
                <el-table :data="dataList" v-loading="loading" border height="100%" :span-method="arraySpanMethod" @selection-change="handleSelectionChange" style="width: 100%">
                    <el-table-column fixed="left" label="订单号" align="center" width="170px">
                        <template slot-scope="scope">
                            <div>{{ scope.row.orderId }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" align="center" min-width="100px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orderStatus | statusFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="实付金额" align="center" width="100px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.productStatus | afterStatusFilter }}</span>
                            {{scope.row.currency}}{{ scope.row.orderAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column label="运费" align="center" width="100px">
                        <template slot-scope="scope">
                           {{scope.row.currency}}{{ scope.row.freight}}
                        </template>
                    </el-table-column>
                    <el-table-column label="skuCode" align="center" min-width="130px" prop="skuCode">
                    </el-table-column>
                    <el-table-column label="sku图片" align="center" min-width="120px">
                        <template slot-scope="scope">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" align="center" min-width="220px" prop="productName">
                    </el-table-column>
                    <el-table-column label="sku规格" align="center" min-width="220px" prop="attribute">
                    </el-table-column>
                    <el-table-column label="商品数量" align="center" min-width="120px" prop="count">
                    </el-table-column>
                    <el-table-column label="实付单价" align="center" min-width="120px" prop="realPrice">
                        <template slot-scope="scope">
                           {{scope.row.currency}}{{ scope.row.realPrice}}
                        </template>
                    </el-table-column>
                     <el-table-column label="已退款数量" align="center" min-width="120px" prop="afterCount">
                    </el-table-column>
                    <el-table-column label="审核中数量" align="center" min-width="120px" prop="reviewCount">
                    </el-table-column>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="退款数量" align="center" min-width="120px" prop="cancelCount">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.cancelCount" :disabled="!scope.row.editable" :controls="false" :min="0" :max="Number(scope.row.count) - scope.row.reviewCount - scope.row.afterCount" size="mini" style="width: 90px"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="退款原因" align="center" width="170px" prop="refundReason">
                         <template slot="header">
                            退款原因
                            <el-tooltip class="item" effect="dark" content="一键同步退款原因" placement="top">
                                <i class="el-icon-refresh" @click="syncData()"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.refundReason" :disabled="!scope.row.editable" placeholder="请选择" size="mini">
                                <el-option
                                  v-for="item in refundReasonMap[scope.row.orderStatus].reason"
                                  :key="item.code"
                                  :label="item.desc"
                                  :value="item.code">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否退运费" align="center" min-width="120px" prop="isRefundFreight">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.isRefundFreight" @change="handleSwitchChange"></el-switch>
                            <!-- <el-radio v-model="scope.row.isRefundFreight" label="1">退运费</el-radio> -->
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" min-width="150px">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 4 || scope.row.orderStatus === 5" type="text" size="mini" @click="immediateRefund(scope.row)">
                                直接退款
                            </el-button>
                            <el-button v-if="scope.row.orderStatus === 2 || scope.row.orderStatus === 3" type="text" size="mini" @click="applyRefund(scope.row)">
                                申请售后
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryData.page.pageNum"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="queryData.page.pageSize"
                    layout="total, sizes, prev, pager, next"
                    :total="totals">
                </el-pagination>
            </div>
        <!-- 申请退款 -->
        <apply-refund-dialog ref="applyRefundDialog" :dialogVisible="applyRefundVisible" :operateType="operateType" :refundInfo="refundInfo"
                             @on-cancle="cancleApplyRefund" @on-confirm="confirmApplyRefund" >
        </apply-refund-dialog>

        <refund-dialog ref="refundDialog" :dialogVisible="refundVisible" :refundType="refundType" :selectedSkuInfo="selectedSkuInfo"
            @on-cancle="cancleRefund" @on-confirm="confirmRefund" >
        </refund-dialog>
    </div>
</template>

<script>
    import { customerOrderList, createAfter, afterReason} from '@/request/order'
    import ApplyRefundDialog from './components/ApplyRefundDialog'
    import RefundDialog from './components/RefundDialog'
    export default {
        data() {
            return {
                queryData: {
                    orderId: '',
                    phone: '',
                    userId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                totals: 0,
                loading: false,
                applyRefundVisible: false,
                refundInfo: {
                    bankCardId: '',
                    orderId: '',
                    skuId: '',
                    remark: ''
                },
                dataList: [],
                entireAfter: false, // 是否整单
                operateType: '',
                load: false,
                //用户订单列表查询
                loading: false,
                userOrderView: {
                    dataList: [],
                    orderStatus: {
                        'Refund': '退款中',
                        'Refund_SUCCESS': '退款成功',
                        'Shopping': '购物状态',
                    },
                    statusList: {
                        'WAIT_PAY': '待支付',
                        'WAIT_SEND': '待发货',
                        'WAIT_RECEIVE': '待收货',
                        'TRADE_SUCCESS': '交易成功',
                        'TRADE_CLOSE': '交易关闭',
                        'REFUND_SUCCESS': '退款成功',
                        'REFUND_FAILUR': '退款失败',
                        'REFUND_CANCEL': '售后订单',
                        'AFTER_SALE': '退款中'
                    },
                    param: {
                        orderNo: '',
                        mobile: '',
                        userId: ''
                    }
                },
                // 用户订单退款申请
                refundAlert: {
                    title: '申请退款',
                    show: false,
                    type: 'part',
                    userBankCard: [],
                    param: {
                        // refundPayWay:'',
                        userId: '',
                        bankAccountId: '',
                        orderNo: '',
                        refundInstructions: '',
                        refundSkuCode: ''
                    },
                    rules: {
                        bankAccountId: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        orderNo: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        refundInstructions: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        refundSkuCode: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }]
                    }
                },
                // 添加用户银行卡
                bankCardAlert: {
                    title: '添加银行卡',
                    show: false,
                    countryMap: {
                        '6': 'Malaysia',
                        '65': 'Singapore'
                    },
                    bankList: [],
                    param: {
                        orderNo: '',
                        accountName: '',
                        countryAreaCode: '6',
                        accountNo: '',
                        bankCode: '',
                        bankName: '',
                        email: '',
                        mobile: '',
                        userId: ''
                    },
                    rules: {
                        accountName: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        accountNo: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        bankCode: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        bankName: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        email: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        mobile: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        userId: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }]
                    }
                },
                // 用户订单修改商品信息
                changeOrderAlert: {
                    title: '修改商品',
                    show: false,
                    dataList: [],
                    param: {
                        newFingoSkuCode: '',
                        oldFingoSkuCode: '',
                        orderNo: ''
                    },
                    rules: {
                        newFingoSkuCode: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        oldFingoSkuCode: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        orderNo: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }]
                    }
                },
                refundVisible: false,
                refundReasonMap: {},
                refundType: '', //outOrder 需要出库单, immediate 直接
                selectionData: [],
                selectedSkuInfo: []
            }
        },
        components: {
            ApplyRefundDialog,
            RefundDialog
        },
        mounted() {
            this.getAfterReasonDict()
        },
        methods: {
            getAfterReasonDict() {
                afterReason().then((res) => {
                    this.refundReasonMap = res.statusReason
                }).catch(err => {
                    console.log(err)
                })
            },
            resetSearch() {
                this.$refs.changeProInfoFilter.resetFields()
            },
            //合并单元格
            arraySpanMethod({
                                row,
                                column,
                                rowIndex,
                                columnIndex
                            }) {
                let activeColumn = [0, 1, 2, 3, 15, 16]
                let item = activeColumn.find((val) => {
                    return val == columnIndex
                })
                if (item || columnIndex == 0) {
                    if (row.rowspan) {
                        return {
                            rowspan: row.rowspan,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            //用户订单退款申请
            confirmRefundOrder() {
                this.$refs['Refund'].validate((valid) => {
                    if (valid) {
                        let param = JSON.parse(JSON.stringify(this.refundAlert.param))
                        if (this.refundAlert.type == 'all') {
                            param.refundSkuCode = []
                        } else {
                            param.refundSkuCode = param.refundSkuCode.split(',')
                        }
                        refundorder(param).then((res) => {
                            if (res.code == 200) {
                                this.$message.success('成功')
                                this.refundAlert.show = false
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            //修改商品信息
            showChangeOrder(data) {
                this.changeOrderAlert.title = '修改商品信息'
                Object.assign(this.changeOrderAlert.param, {
                    newFingoSkuCode: '',
                    oldFingoSkuCode: data.fingoSkuCode,
                    orderNo: data.orderNo
                })
                chooseOrderProduct({
                    orderNo: data.orderNo,
                    changeSkuCode: data.fingoSkuCode
                }).then((res) => {
                    if (res.code == 200) {
                        this.changeOrderAlert.dataList = res.data.userOrderChooseProductSkuDTOList
                    }
                })
                this.changeOrderAlert.show = true
            },
            getUserBankCard() {
                getUserBankCard({
                    orderNo: this.refundAlert.param.orderNo,
                }).then((res) => {
                    if (res.code == 200) {
                        this.refundAlert.userBankCard = res.data
                    }
                })
            },
            //申请退款
            showRefund(data, type) {
                this.refundAlert.title = '申请退款'
                this.refundAlert.type = type
                Object.assign(this.refundAlert.param, {
                    bankAccountId: '',
                    orderNo: data.orderNo,
                    refundInstructions: '',
                    refundSkuCode: data.fingoSkuCode,
                    userId: data.userId
                })
                this.getUserBankCard()
                this.refundAlert.show = true
            },
            setBankName() {
                let item = this.bankCardAlert.bankList.find((val) => {
                    return val.bankCode == this.bankCardAlert.param.bankCode
                })
                if (item) {
                    this.bankCardAlert.param.bankName = item.bankName
                }
            },
            // 异常处理
            dealAbnormal(data, type) {
                this.$confirm('确定处理?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.createAfterRequest(data, type)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            createAfterRequest(data, type) {
                let params = {}
                if (type === 'all') {
                    params.entireAfter = true
                } else {
                    type = false
                    params.skuId = data.skuId
                }
                params.orderId = data.orderId
                params.afterType = 1
                params.refundType = 1

                createAfter(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功')
                        this.getCustomerOrderList()
                    } else if (res.ret.errcode ===1058) {
                        this.$message.warning('用户账户余额操作失败')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getCustomerOrderList() {
                this.loading = true
                let params = this.queryData
                customerOrderList(this.filterData(params)).then((res) => {
                    console.log(res)
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.totals = res.total
                        let data = []
                        for (let i = 0; i < res.orderItem.length; i++) {
                            let item = res.orderItem[i]
                            for (let j = 0; j < item.products.length; j++) {
                                if (j == 0) {
                                    Object.assign(item.products[j], {
                                        rowspan: item.products.length
                                    })
                                }
                                Object.assign(item.products[j], {
                                    index: i + ',' + j,
                                    orderAmount: item.orderAmount,
                                    orderId: item.orderId,
                                    orderStatus: item.orderStatus,
                                    userId: item.userId,
                                    orderUserContent: item.orderUserContent,
                                    sourceList: res.orderItem[i],
                                    entireAfter: item.entireAfter,
                                    freight:item.freight,
                                    userId: item.userId,
                                    payWay: item.payWay,
                                    currency: item.currency,
                                    cancelCount: null,
                                    refundReason: null,
                                    isRefundFreight: null,
                                    editable: false
                                })
                                data.push(item.products[j])
                            }
                        }
                        this.dataList = data
                        console.log(this.dataList)
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getCustomerOrderList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getCustomerOrderList()
            },
            showApplyRefund(rowData, type) {
                this.operateType = type
                console.log()
                this.refundInfo.orderId = rowData.orderId
                this.refundInfo.userId = rowData.userId
                this.refundInfo.skuId = rowData.skuId
                this.applyRefundVisible = true
                this.$refs.applyRefundDialog.getUserBankList()
            },
            cancleApplyRefund() {
                this.applyRefundVisible = false
            },
            confirmApplyRefund(data) {
                let params = {}

                if (data.operateType === 'all') {
                    params.entireAfter = true
                } else {
                    params.entireAfter = false
                    params.skuId = data.skuId
                }

                params.orderId = data.orderId
                params.bankCardId = data.bankCardId
                params.afterType = 1
                params.refundType = 0
                params.remark = data.remark

                createAfter(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功')
                        this.applyRefundVisible = false
                        this.getCustomerOrderList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            showRefundDialog() {
                this.refundVisible = true
            },
            handleSelectionChange (val) {
                console.log(val)
                this.selectionData = val
                let skuIdList = []
                _.forEach(val, item => {
                    skuIdList.push(item.skuId)
                })

                _.forEach(this.dataList, item => {
                    if (skuIdList.indexOf(item.skuId) != -1) {
                        item.editable = true
                    } else {
                        item.editable = false
                    }
                })
                console.log(this.dataList)
            },
            syncData() {
                if (this.selectionData.length > 0) {
                    let sourceRefundReason = this.selectionData[0].refundReason
                    _.forEach(this.selectionData, item => {
                        item.refundReason = sourceRefundReason
                    })
                    this.$message.success('退款原因一键同步成功')
                } else {
                    this.$message.warning('请选择需要处理的sku')
                }
            },
            immediateRefund(row) {
                console.log(row)
                if (this.selectionData.length <= 0) {
                    this.$message.warning('请选择需要退款的商品')
                    return
                } else {
                    if (this.verifyRefundData(this.selectionData)) {
                        if (row.orderStatus === 1 || row.orderStatus === 5) {
                            this.refundType = 'outOrder'
                        } else {
                            this.refundType = 'immediate'
                        }
                        _.forEach(this.selectionData, item => {
                            item.afterType = 3
                        })
                        this.selectedSkuInfo = this.selectionData
                        this.refundVisible = true
                    }
                }
            },
            applyRefund(row) {
                console.log(row)
                if (this.selectionData.length <= 0) {
                    this.$message.warning('请选择需要退款的商品')
                    return
                } else {
                    if (this.verifyRefundData(this.selectionData)) {
                        if (row.orderStatus === 1 || row.orderStatus === 5) {
                            this.refundType = 'outOrder'
                        } else {
                            this.refundType = 'immediate'
                        }
                        _.forEach(this.selectionData, item => {
                            item.afterType = 4
                        })
                        this.selectedSkuInfo = this.selectionData
                        this.refundVisible = true
                    }
                }
            },
            verifyRefundData(data) {
                let cancelCount = 0
                let cancelReason = 0
                _.forEach(data, item => {
                    if (item.cancelCount <= 0) {
                        cancelCount += 1
                    }
                    if (item.refundReason === null) {
                        cancelReason += 1
                    }
                })
                if (cancelCount > 0) {
                    this.$message.warning('已选sku取消数量不能为0')
                    return false
                }
                if (cancelReason > 0) {
                    this.$message.warning('已选sku取消原因不能为空')
                    return false
                }
                return true
            },
            cancleRefund() {
                this.refundVisible = false
            },
            confirmRefund() {
                this.refundVisible = false
                this.getCustomerOrderList()
            },
            handleSwitchChange(val) {
                _.forEach(this.dataList, item => {
                    item.isRefundFreight = val
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .order-btn-box {
        display: flex;
        flex-direction: column;
        .el-button+.el-button {
            margin-left: 0;
        }
        .el-button {
            margin-bottom: 10px;
        }
    }
</style>
