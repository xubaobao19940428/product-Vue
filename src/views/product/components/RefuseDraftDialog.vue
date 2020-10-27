<template>
    <div class="refuse-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="600px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="refuseForm" :rules="ruleValidate" :model="refuseModel">
                <el-form-item label="拒绝原因：" prop="message">
                    <el-input v-model="refuseModel.message" placeholder="请输入原因" style="width: 400px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        // 商品下架原因
        name: 'ShelveResonDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogTitle: '审核不通过',
                refuseModel: {
                    message: ''
                },
                ruleValidate: {
                    message: [{
                        required: true,
                        trigger: 'blur',
                        message: '请输入原因'
                    }]
                },
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
            }
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        methods: {
            reset() {
                this.$refs.refuseForm.resetFields()
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                console.log(this.refuseModel)
                this.$refs.refuseForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.refuseModel)
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .refuse-dialog {
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

    .tips {
        color: #aaa;
        line-height: 20px;
    }

    .sub-product-table {
        padding: 10px 54px;
    }
</style>



