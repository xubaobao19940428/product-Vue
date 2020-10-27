<template>
    <el-dialog
        title="取消出库单"
        :visible.sync="toggle"
        width="50%"
        :before-close="cancel"
        class="cacel-dialog">
        <div class="prompt">
            说明：出库单取消不会联动订单取消，请确保订单及用户已知晓，取消后无法恢复，请谨慎操作。
        </div>
        <el-form :rules="rules" label-width="150px" :model="queryData">
            <el-form-item prop="resource" label="是否释放预占库存：" class="filter-item">
                <el-radio-group v-model="queryData.resource">
                    <el-radio label="是"></el-radio>
                    <el-radio label="否"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="desc" label="取消原因：" class="filter-item">
                 <el-input type="textarea" v-model="queryData.desc" maxlength="100" show-word-limit></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="comfirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { CancelOutOrder } from '@/request/warehouse'

    export default {
        data () {
            return {
                queryData: {
                    resource: '是',
                    desc: ''
                },
                rules: {
                    resource: [{required: true, message: '请选择是否释放预占库存', trigger: 'change'}],
                    desc: [{required: true, message: '请填写取消原因', trigger: 'blur'}]
                }
            }
        },
        props: {
            dialogVisible: Boolean,
            cancelSockOutNo: String
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
            cancel () {
                this.$emit('on-cancel')
            },
            comfirm () {
                this.CancelOutOrder()
            },
            CancelOutOrder () {
                if (this.queryData.desc === '') {
                    this.$message.error('请填写取消原因!')
                    return
                }
                let params = {
                    outNo: this.cancelSockOutNo,
                    cancelReason : this.queryData.desc,
                    isRelease: this.queryData.resource === '是'? 1:2
                }
                CancelOutOrder(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('取消成功！')
                        this.$emit('on-comfirm')
                    }
                })
            }
        },
    }
</script>
<style lang="scss">
    .cacel-dialog{
        .el-form-item__label{
            text-align: left;
        }
    }
</style>
<style lang="scss" scoped>
    .cacel-dialog{
        .prompt{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            background-color: rgb(249,223,228);
            color: rgb(215,40,70);
        }
    }
</style>