<template>
    <div class="refund-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="850px" @close="cancle" :close-on-click-modal="false">

            <el-steps v-if="refundType === 'outOrder'"  :active="activeStep" align-center>
                <el-step title="分配出库单梳理" description="将需要取消的数量分配至对应出库单"></el-step>
                <el-step title="确认退款方式" description="选择给用户退款的方式"></el-step>
                <el-step title="操作完成" description=""></el-step>
            </el-steps>
            <el-steps v-else :active="activeStep" align-center>
                <el-step title="确认退款方式" description="选择给用户退款的方式"></el-step>
                <el-step title="操作完成" description=""></el-step>
            </el-steps>

            <!--分配出库单数量-->
            <div class="out-order" v-if="refundType === 'outOrder' && activeStep === 1" v-for="(skuItem, index) in selectedSkuInfoList" :key="index">
                <div class='info-title'>{{skuItem.productName}}</div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            skuId: {{skuItem.skuId}}
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <span class="sku-text">sku图片：</span><img class="sku-img" :src="dealShowFileSrc(skuItem.skuCover)">
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            sku规格：{{skuItem.attribute}}
                        </div>
                    </el-col>
                </el-row>
                <el-divider content-position="left">关联出库单</el-divider>
                <div class="out-order-item" v-for="(item, index) in skuItem.skuOutOrderData" :key="index">
                    <p>待分配数量：{{item.skuCount}}</p>
                    <out-order-table :outOrderTableDataModel="item.outOrder"></out-order-table>
                </div>
            </div>

            <!--确认退款方式-->
            <el-form v-if="(refundType === 'immediate' && activeStep === 1) || (refundType === 'outOrder' && activeStep === 2)" ref="applyRefund" class="refund-method" label-width="110px" :model="refundInfoModel" :rules="ruleValidate">
                <el-form-item label="退款方式：" prop="refundType" size="medium" >
                    <el-select v-model="refundInfoModel.refundType" placeholder="请选择" @change="handleRefund" style="width: 300px">
                        <el-option v-for="item in refundWayList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行卡：" prop="bankCardId" v-if="refundInfoModel.refundType === 0 || refundInfoModel.refundType === 2">
                    <el-select v-model="refundInfoModel.bankCardId" placeholder="请选择" size="medium" style="width: 300px">
                        <el-option v-for="item in userBankCardList" :key="item.id" :label="item.accountNo + '/' + item.accountName" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="text" @click="addBankCard" size="small" style="margin-left: 6px">添加银行卡</el-button>
                </el-form-item>
                <el-form-item label="原支付方式：" prop="payWay">
                    <span v-if="refundInfoModel.payWay === 1">molpay</span>
                    <span v-if="refundInfoModel.payWay === 2">积分支付</span>
                    <span v-if="refundInfoModel.payWay === 3">信用卡支付</span>
                    <span v-if="refundInfoModel.payWay === 4">omise</span>
                    <span v-if="refundInfoModel.payWay === 5">OnlineBanking</span>
                    <span v-if="refundInfoModel.payWay === 6">COD</span>
                    <span v-if="refundInfoModel.payWay === 7">组合支付</span>
                </el-form-item>
                <el-form-item label="退回积分：" prop="refundPoint" v-if="refundInfoModel.refundType === 1">
                    {{currency}}{{refundInfoModel.refundPoint | numberFormat}}
                </el-form-item>
                <el-form-item label="订单编号：" prop="orderId">
                    <span>{{ refundInfoModel.orderId }}</span>
                </el-form-item>
                <el-form-item label="退款说明：" prop="remark" style="width: 450px">
                    <el-input  type="textarea" :rows="3" v-model="refundInfoModel.remark"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button v-if="refundType === 'outOrder' && activeStep > 1" type="primary" @click="preStep" size="small">上一步</el-button>
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button v-if="refundType === 'outOrder' && activeStep < 2" type="primary" @click="nextStep" size="small">下一步</el-button>
                <el-button v-if="(refundType === 'outOrder' && activeStep === 2) || (refundType === 'immediate' && activeStep === 1)" type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <add-bank-card-dialog :dialogVisible="bankCardDialog" :userId="refundInfoModel.userId"
            @on-cancle="cancleAddBankCard" @on-confirm="confirmAddBankCard">
        </add-bank-card-dialog>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText"
            @on-cancle="cancleConfirm" @on-confirm="submitConfirm">
        </confirm-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { getUserBankList, addUserBank } from '@/request/polypay'
    import { outOrderList, createAfter} from '@/request/order'
    import AddBankCardDialog from './AddBankCardDialog'
    import OutOrderTable from './OutOrderTable'
    import ConfirmDialog from '@/components/ConfirmDialog'

    export default {
        // 退款操作
        name: 'RefundDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            refundType: {
                type: String,
                default: 'outOrder'
            },
            selectedSkuInfo: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        components: {
            AddBankCardDialog,
            OutOrderTable,
            ConfirmDialog
        },
        filters:{
           numberFormat: function(data){
                return data.toFixed(2)
            }
        },
        data() {
            return {
                activeStep: 1,
                bankCardDialog: false,
                userBankCardList: [],
                ruleValidate: {
                    bankCardId: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择银行卡'
                    }]
                },
                refundInfoModel: {
                    userId: '',
                    refundType: 1,
                    refundPoint: 0,
                    bankCardId: '',
                    payWay: null,
                    orderId: '',
                    remark: ''
                },
                refundWayList: [],
                currency: '',
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                customerAfterData: {
                    // afterType: 3,
                    isReceived: false
                },
                outOrderTableDataModel: [
                    {
                        outId: '22434433',
                        outStatus: 1,
                        count: 1,
                        cancelCount: null
                    }
                ]
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
            dialogTitle: {
                get: function() {
                    if (this.refundType === 'outOrder') {
                        return '分配出库单梳理'
                    } else {
                        return '确认退款方式'
                    }
                },
                set: function() {}
            },
            selectedSkuInfoList: {
                get: function () {
                    return this.selectedSkuInfo;
                },
                set: function () {
                }
            }
        },
        watch: {
            dialogVisible (newVal, oldVal) {
                let skuIdList = []
                let orderId = ''
                let userId = ''
                let payWay = null
                let refundPoint = 0
                let afterType = null
                let isRefundFreight = null
                if (newVal) {
                    _.forEach(this.selectedSkuInfoList, selectedSkuInfo => {
                        orderId = selectedSkuInfo.orderId
                        userId = selectedSkuInfo.userId
                        payWay = selectedSkuInfo.payWay
                        refundPoint = refundPoint + selectedSkuInfo.cancelCount * Number(selectedSkuInfo.realPrice)
                        afterType = selectedSkuInfo.afterType
                        isRefundFreight = selectedSkuInfo.isRefundFreight
                        this.currency = selectedSkuInfo.currency
                        skuIdList.push(selectedSkuInfo.skuId)
                    })
                    if (this.refundType === 'outOrder') {
                        this.getOutOrderList(orderId, skuIdList)
                    }
                    this.getUserBankList()
                    this.refundInfoModel.orderId = orderId
                    this.refundInfoModel.userId = userId
                    this.refundInfoModel.payWay = payWay
                    this.refundInfoModel.refundPoint = refundPoint
                    this.refundInfoModel.afterType = afterType
                    this.refundInfoModel.isRefundFreight = isRefundFreight
                    if (payWay === 1 || payWay === 4 || payWay === 5 ) {
                        this.refundInfoModel.refundType = 0
                        this.refundWayList = [{
                            value: 0,
                            label: '银行卡退款'
                        }, {
                            value: 1,
                            label: '积分退款'
                        }]
                    } else if (payWay === 3) {
                        this.refundInfoModel.refundType = 2
                        this.refundWayList = [{
                            value: 2,
                            label: '信用卡退款'
                        }]
                    } else if (payWay === 2 || payWay === 6){
                        this.refundInfoModel.refundType = 1
                        this.refundWayList = [ {
                            value: 1,
                            label: '积分退款'
                        }]
                    }
                }
            },
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.reset()
                this.customerAfterData = {
                    // afterType: 3,
                    isReceived: false
                }
            },
            confirm() {
                this.customerAfterData.orderId = this.refundInfoModel.orderId
                this.customerAfterData.bankCardId = this.refundInfoModel.bankCardId

                this.customerAfterData.remark = this.refundInfoModel.remark
                this.customerAfterData.refundType = this.refundInfoModel.refundType
                this.customerAfterData.afterType = this.refundInfoModel.afterType

                let skuList = []
                _.forEach(this.selectedSkuInfoList, selectedSku => {
                    let item = {}
                    // item.skuCode = selectedSku.skuCode
                    item.skuId = selectedSku.skuId
                    item.totalCount = selectedSku.cancelCount
                    item.reason = selectedSku.refundReason + ''
                    let outOrderList = []
                    _.forEach(selectedSku.skuOutOrderData, skuOutOrder => {
                        if (skuOutOrder.superSkuId=== item.skuId) {
                            outOrderList.push(skuOutOrder.outOrder)
                        }
                    })
                    item.out = _.flatten(outOrderList)
                    skuList.push(item)
                    this.customerAfterData.isReturnFreight = selectedSku.isRefundFreight
                })
                this.customerAfterData.product = skuList
                this.createAfterRequest(this.customerAfterData)
            },
            reset() {
                if (this.$refs.applyRefund) {
                    this.$refs.applyRefund.resetFields()
                }
                this.activeStep = 1
            },
            preStep() {
                if (this.activeStep > 1) {
                    this.activeStep = this.activeStep - 1
                }
            },
            nextStep() {
                if (this.activeStep < 3) {
                    if (!this.verifyCancelCount()) {
                        this.$message.warning('出库单中的取消数量总和必须等于待分配数量')
                    } else {
                        this.activeStep = this.activeStep + 1
                    }
                }
            },
            getUserBankList() {
                let params = {
                    userId: this.selectedSkuInfoList[0].userId
                }
                getUserBankList(params).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.userBankCardList = res.data
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            addBankCard() {
                this.bankCardDialog = true
            },
            cancleAddBankCard() {
                this.bankCardDialog = false
            },
            confirmAddBankCard() {
                this.bankCardDialog = false
                this.getUserBankList()
            },
            handleRefund(val) {
                this.refundInfoModel.refundType = val
            },
            cancleConfirm() {
                this.confirmVisible = false
            },
            submitConfirm() {
                this.confirmVisible = false
            },
            getOutOrderList(orderId, skuIdList) {
                let params = {
                    orderId: orderId,
                    skuId: skuIdList
                }
                outOrderList(params).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        console.log(this.selectedSkuInfoList)
                       let outOrderList = res.item
                       _.forEach(this.selectedSkuInfoList, selectedSkuInfo => {
                           _.forEach(outOrderList, item => {
                                if (selectedSkuInfo.skuId === item.superSkuId) {
                                    _.forEach(item.sku, sku => {
                                        sku.skuCount = sku.skuCount * selectedSkuInfo.cancelCount
                                        sku.superSkuId = item.superSkuId
                                    })
                                    _.forEach(item.sku, outOrderItem => {
                                        _.forEach(outOrderItem.outOrder, outOrder => {
                                            this.$set(outOrder, 'cancelCount', 0)
                                            this.$set(outOrder, 'skuId', outOrderItem.skuId)
                                        })
                                    })
                                    console.log(item.sku)
                                    this.$set(selectedSkuInfo, 'skuOutOrderData', item.sku)
                                }
                           })
                       })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 校验待分配数量和分配数量是否相等
            verifyCancelCount() {
                console.log(this.selectedSkuInfoList)
                let flag = 0
                _.forEach(this.selectedSkuInfoList, selectedSkuInfoItem => {
                    _.forEach(selectedSkuInfoItem.skuOutOrderData, skuOutOrderItem => {
                        let total = 0
                        _.forEach(skuOutOrderItem.outOrder, outOrderItem => {
                            total += outOrderItem.cancelCount
                        })
                        if (skuOutOrderItem.skuCount !== total) {
                            flag ++
                        }
                    })
                })
                return flag > 0 ? false: true
            },
            createAfterRequest(customerAfterData) {
                createAfter(this.filterData(customerAfterData)).then(res => {
                    let errcode = res.ret.errcode
                    if (errcode === 1) {
                        this.$message.success(res.ret.msg)
                        this.$emit('on-confirm')
                        this.reset()
                    } else {
                        this.$message.warning(res.ret.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss">
.refund-dialog {
    .el-dialog__header {
        border-bottom: 1px solid #ebeef5;
    }
    .el-dialog__body {
        padding: 50px 40px;
    }
    .el-dialog__footer {
        border-top: 1px solid #ebeef5;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
}
</style>
<style lang="scss" scoped>
    .refund-dialog {
        .info-title {
            border-left: 4px solid #409EFF;
            height: 28px;
            line-height: 28px;
            padding-left: 10px;
            color: #333333;
            font-weight: 700;
        }
        .out-order {
            padding: 20px 30px;
            .grid-content {
                height: 100px;
                line-height: 100px;
            }
        }
        .refund-method {
            padding: 20px 30px;
        }
        .sku-text {
            float: left;
        }
        .sku-img {
            float: left;
            height: 100px;
            width: 100px;
        }
        .out-order-item {
            padding-bottom: 10px;
        }
    }

</style>




