<template>
    <div class="add-bankcard-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="800px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="addBandCardForm" label-width="110px" :model="bankCardInfo" :rules="ruleValidate">
                <el-form-item label="账户名：" prop="accountName">
                    <el-input v-model="bankCardInfo.accountName" style="width: 320px"></el-input>
                </el-form-item>
                <el-form-item label="卡号：" prop="accountNo">
                    <el-input v-model="bankCardInfo.accountNo" style="width: 320px"></el-input>
                </el-form-item>
                <el-form-item label="国家：" prop="countryCode">
                    <el-select v-model="bankCardInfo.countryCode" @change="getBankList" size="medium" placeholder="请选择">
                        <el-option v-for="(item, key) in countryList" :key="key" :label="item.nameCn" :value="item.shortCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行名称：" prop="bankCode">
                    <el-select v-model="bankCardInfo.bankCode"  @change="setBankName" placeholder="请选择" style="width: 320px">
                        <el-option v-for="item in bankList" :key="item.bankCode" :label="item.bankName" :value="item.bankCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="bankCardInfo.email" style="width: 320px"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="bankCardInfo.mobile" style="width: 320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { listBanksOfCountry, addUserBank } from '@/request/polypay'
    export default {
        // 添加银行卡
        name: 'AddBankCardDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            userId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                dialogTitle: '添加银行卡',
                bankCardInfo: {
                    bankCode: ''
                },
                bankList: [],
                ruleValidate: {
                    accountName: [{
                        required: true,
                        trigger: 'blur',
                        message: '账户名(持卡人)不能为空'
                    }],
                    accountNo: [{
                        required: true,
                        trigger: 'blur',
                        message: '卡号不能为空'
                    }],
                    countryCode: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择国家'
                    }],
                    bankCode: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择银行'
                    }],
                    email: [{
                        required: true,
                        trigger: 'blur',
                        message: '邮箱不能为空'
                    }],
                    mobile: [{
                        required: true,
                        trigger: 'blur',
                        message: '手机号不能为空'
                    }]
                }
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
        created() {
            this.countryList = JSON.parse(this.getStore('countryList'))
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.$refs.addBandCardForm.resetFields()
            },
            confirm() {
                console.log(this.userId)
                this.$refs.addBandCardForm.validate((valid) => {
                    if (valid) {
                        let params = this.bankCardInfo
                        params.userId = this.userId
                        addUserBank(params).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('添加成功')
                                this.$emit('on-confirm')
                                this.$refs.addBandCardForm.resetFields()
                            }
                        }).catch(err => {
                            console.log(err)
                        })

                    } else {
                        return false;
                    }
                });

            },
            getBankList() {
                let params = {
                    countryCode: this.bankCardInfo.countryCode
                }
                listBanksOfCountry(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.bankCardInfo.bankCode = ''
                        this.bankList = res.bankSimple
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            setBankName(value) {
                _.forEach(this.bankList, item => {
                    if (item.bankCode) {
                        this.bankCardInfo.bankName = item.bankName
                    } else {
                        this.bankCardInfo.bankName = ''
                    }
                })
                console.log(this.bankCardInfo)
            }
        }
    }
</script>

<style lang="scss">
.add-bankcard-dialog {
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




