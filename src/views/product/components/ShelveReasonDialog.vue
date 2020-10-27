<template>
    <div class="shelve-off-reason-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="600px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="shelveOffReasonForm" :rules="ruleValidate" :model="shelveOffReasonModel">
                <el-form-item label="下架原因：" prop="offReason">
                    <el-select v-model="shelveOffReasonModel.offReason" placeholder="请选择" style="width: 260px;">
                        <el-option v-for="item in reasonOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确认下架</el-button>
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
                dialogTitle: '商品下架',
                shelveOffReasonModel: {
                    offReason: ''
                },
                ruleValidate: {
                    offReason: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择下架原因'
                    }]
                },
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                reasonOptions: [{
                    value: 1,
                    label: '暂时缺货'
                }, {
                    value: 2,
                    label: '永久缺货'
                }, {
                    value: 3,
                    label: '侵权/违禁/敏感产品'
                }, {
                    value: 4,
                    label: '滞销'
                }, {
                    value: 5,
                    label: '质量/色差/尺码等产品问题'
                }, {
                    value: 6,
                    label: '供应商不合作'
                }, {
                    value: 7,
                    label: '其他原因'
                }]
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
                this.$refs.shelveOffReasonForm.resetFields()
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                console.log(this.shelveOffReasonModel)
                this.$refs.shelveOffReasonForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.shelveOffReasonModel)
                        this.reset()
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .shelve-off-reason-dialog {
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



