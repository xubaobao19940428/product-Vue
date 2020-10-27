<template>
    <el-dialog
        title="修改退款方式"
        :visible.sync="toggle"
        width="40%"
        :before-close="cancel"
        class="refund-method">
        <el-form label-position="left" label-width="80px" :model="queryData" :rules="rules">
             <el-form-item prop="product" label="退款账户：">
                <el-radio-group v-model="queryData.refundType">
                    <el-radio label='1'>积分</el-radio>
                    <el-radio label='0'>银行卡</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="queryData.refundType === '0'" class="bank-content">
                <el-form-item prop="refundCardNo" label="银行卡号：">
                    <el-select v-model="queryData.refundCardNo" placeholder="请选择" size="small" @change="cardChange">
                        <el-option
                        v-for="item in refundCardNoList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="refundBankName" label="银行名称：">
                    <el-select v-model="queryData.refundBankName" placeholder="请选择" size="small" @change="bankChange">
                        <el-option
                        v-for="item in refundBankNameList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="refundCardholder" label="账户名称">
                    <el-input v-model="queryData.refundCardholder" size="small"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="联系电话：">
                    <el-input v-model="queryData.mobile" size="small" disabled></el-input>
                </el-form-item>
                <el-form-item prop="email" label="电子邮箱：">
                    <el-input v-model="queryData.email" size="small" disabled></el-input>
                </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { GetUserBankList } from '@/request/afterSale'

    export default {
        data () {
            return {
                queryData: {
                    refundType: this.refund.refundType.toString(),
                    refundCardNo: this.refund.refundCardNo,
                    refundBankName: this.refund.refundBankName,
                    refundCardholder: this.refund.refundCardholder,
                    mobile: this.refund.mobile,
                    email: this.refund.email
                },
                type: true,
                rules: {
                    refundCardNo: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    refundBankName: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    refundCardholder: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    mobile: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    email: [{ required: true, message: '请至少选择一个', trigger: 'change' }]
                },
                refundBankNameList: [],
                refundCardNoList: [],
                bankList:[]
            }
        },
        props: {
            dialogVisible: Boolean,
            refund: {
                type: Object,
                default: () => { return {} }
            }
        },
        mounted() {
            this.getUserBankList()
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {}
            }
        },
        methods: {
            getUserBankList () {
                let params = {
                    userId: this.refund.userId
                }
                GetUserBankList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.bankList = res.data
                        this.refundCardNoList.splice(0)
                        this.refundBankNameList.splice(0)
                        for (let index = 0; index < res.data.length; index++) {
                            this.refundCardNoList.push({val:res.data[index].accountNo,label:res.data[index].accountNo})
                            this.refundBankNameList.push({val:res.data[index].bankName,label:res.data[index].bankName})
                        }   
                        console.log(this.refundCardNoList)
                        console.log(this.refundBankNameList)
                    }
                })
            },
            cardChange (val) {
                console.log(val)
                for (const iterator of this.bankList) {
                    if (val === iterator.accountNo) {
                        this.queryData.refundBankName = iterator.bankName
                        this.queryData.refundCardholder = iterator.accountName
                        this.queryData.mobile = iterator.mobile
                        this.queryData.email = iterator.email
                    }
                }
            },
            bankChange (val) {
                console.log(val)
                for (const iterator of this.bankList) {
                    if (val === iterator.bankName) {
                        this.queryData.refundCardNo = iterator.accountNo
                        this.queryData.refundCardholder = iterator.accountName
                        this.queryData.mobile = iterator.mobile
                        this.queryData.email = iterator.email
                    }
                }
            },
            cancel () {
                this.$emit('on-cancel')
            },
            confirm () {
                this.$emit('on-confirm',this.queryData)
            }
        }
    }
</script>
<style lang="scss">
    .refund-method{
        .el-input__inner,.el-input--small {
            width: 200px
        }
        .el-form-item__content{
            margin-left: 0px !important;
        }
    }
</style>
<style lang="scss" scoped>
    .refund-method{
        .bank-content{
            margin-left: 80px;
        }
    }
</style>