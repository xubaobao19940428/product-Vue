<template>
    <div class="apply-refund-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="800px" @close="cancle" :close-on-click-modal="false">
           <el-form ref="applyRefund" label-width="110px" :model="refundInfoModel" :rules="ruleValidate">
                <el-form-item label="银行卡：" prop="bankCardId">
                    <template>
                        <el-select v-model="refundInfoModel.bankCardId" placeholder="请选择">
                            <el-option v-for="item in userBankCardList" :key="item.id" :label="item.accountNo + '/' + item.id" :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="订单编号：" prop="orderId">
                    <span>{{ refundInfoModel.orderId }}</span>
                </el-form-item>
                <el-form-item  v-if="operateType === 'part'" label="skuId：" prop="skuId">
                    <span>{{ refundInfoModel.skuId }}</span>
                </el-form-item>
                <el-form-item label="退款说明：" prop="remark" style="width: 450px">
                    <el-input  type="textarea" :rows="3" v-model="refundInfoModel.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button plain type="primary" @click="addBankCard" size="small" style="float: left">添加银行卡</el-button>
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <add-bank-card-dialog :dialogVisible="bankCardDialog" :userId="refundInfoModel.userId" @on-cancle="cancleAddBankCard" @on-confirm="confirmAddBankCard"></add-bank-card-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { getUserBankList } from '@/request/polypay'
    import AddBankCardDialog from './AddBankCardDialog'
    export default {
        // 申请退款
        name: 'ApplyRefundDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            operateType: {
                type: String,
                default: ''
            },
            refundInfo: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        components: {
            AddBankCardDialog
        },
        data() {
            return {
                dialogTitle: '申请退款',
                bankCardDialog: false,
                userBankCardList: [],
                ruleValidate: {
                    bankCardId: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择银行卡'
                    }]
                },
                refundInfoModel: this.refundInfo
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            }
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.$refs.applyRefund.resetFields()
            },
            confirm() {
                this.$refs.applyRefund.validate((valid) => {
                    if (valid) {
                        let data = _.cloneDeep(this.refundInfoModel)
                        data.operateType = this.operateType
                        this.$emit('on-confirm', data)
                        this.$refs.applyRefund.resetFields()
                    }
                })
            },
            getUserBankList() {
                let params = {
                    userId: this.refundInfo.userId
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
            confirmAddBankCard(cardInfo) {
                this.bankCardDialog = false
                this.getUserBankList()
            }
        }
    }
</script>

<style lang="scss">
.apply-refund-dialog {
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
    .logistics-info-wrapper {
        padding-left: 70px;
        .logiItem {
            margin-bottom: 10px;
        }
    }
</style>




