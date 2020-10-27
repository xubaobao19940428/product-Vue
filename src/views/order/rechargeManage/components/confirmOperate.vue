<template>
    <div class="operate-dialog">
        <el-dialog title="确认操作" :visible.sync="toggle" :before-close="cancle" :close-on-click-modal="false" width="400px" >
            <div class="item">
                <div>订单号：</div>
                <div class="item-content">{{ reCharge.orderNo }}</div>
            </div>
            <div class="item">
                <div>运营商：</div>
                <div class="item-content">{{ reCharge.prodName }}</div>
            </div>
            <div class="item">
                <div>充值金额：</div>
                <div class="item-content">RM {{ reCharge.faceValue }}</div>
            </div>
            <div class="item">
                <div>充值账号：</div>
                <div class="item-content">{{ reCharge.account }}</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确定重试</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { ReChargeForOrder } from '@/request/polypay'

    export default {
        data() {
            return {
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            reCharge: Object
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                ReChargeForOrder(this.reCharge).then(res=>{
                    if (res.ret.errcode === 1) {
                        this.$message.success('重试成功！')
                        this.$emit('on-confirm')
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
.operate-dialog {
    .el-dialog__body {
        padding: 20px 40px;
    }
}
</style>

<style lang="scss" scoped>
.operate-dialog{
    .item{
        display: flex;
        padding: 10px 0;
        font-size: 16px;
    }
    .item-content{
        font-weight: 500;
    }
}
</style>