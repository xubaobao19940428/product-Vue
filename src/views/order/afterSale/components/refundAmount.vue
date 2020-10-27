<template>
    <el-dialog
        title="修改退款金额"
        :visible.sync="toggle"
        width="40%"
        :before-close="cancel"
        class="refund-amount">
        <div class="refund-amount-title">如有超额退款需求，请走线下赔付流程</div>
        <el-form label-position="left" label-width="80px" :model="queryData" :rules="rules">
             <el-form-item prop="amount" label="商品：">
                <div class="form-item">
                    {{currency}} <el-input v-model="queryData.amount" size="small" @input="amountChange" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    <div class="more">最多退 {{currency}} {{amount}}</div>
                </div>
            </el-form-item>
            <el-form-item prop="freight" label="运费：" class="form-item">
                <div class="form-item">
                    {{currency}} <el-input v-model="queryData.freight" size="small" @input="freightChange" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    <div class="more">最多退 {{currency}} {{freight}}</div>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="comfirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        props: {
            dialogVisible:Boolean,
            amount: String,
            freight: String,
            currency: String
        },
        data () {
            return {
                queryData: {
                    amount: this.amount,
                    freight: this.freight
                },
                rules: {
                    amount: [
                        { required: true, message: '请输入退款金额', trigger: 'blur' }
                    ],
                    freight: [
                        { required: true, message: '请输入退款运费', trigger: 'blur' }
                    ]
                }
            }
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
            amountChange (val) {
                console.log(this.queryData.amount)
                if (Number(val) > Number(this.amount)) {
                    this.queryData.amount = this.amount
                }
            },
            freightChange (val) {
                if (Number(val) > Number(this.freight)) {
                    this.queryData.freight = this.freight
                }
            },
            cancel () {
                this.$emit('on-cancel')
            },
            comfirm () {
                if (this.queryData.amount === '' || this.queryData.amount === ''){
                    this.$message.error('请输入必填项！')
                } else {
                    this.$emit('on-confirm',{amount:this.queryData.amount,freight:this.queryData.freight,mark:1})
                }
            }
        }
    }
</script>
<style lang="scss">
    .refund-amount{
        .el-input__inner,.el-input--small {
            width: 200px
        }
        .el-form-item__content{
            margin-left: 0px !important;
        }
    }
</style>
<style lang="scss">
    .refund-amount{
        .refund-amount-title{
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
            text-align: center;
            font-weight: 300;
            color: rgb(231,113,129);
            background-color: rgb(246,210,215)
        }
        .form-item{
            display: flex;
        }
        .more{
            margin-left: 10px;
            font-weight: 500;
        }
    }
</style>