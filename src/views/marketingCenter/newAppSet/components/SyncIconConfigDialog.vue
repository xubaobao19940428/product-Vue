<template>
    <div class="auto-pricing-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="syncIconForm" :rules="ruleValidate" :model="syncModel" label-width="100px">
                <el-form-item label="从：" prop="sourceCountry">
                    {{countryCode | countryFilter}}
                </el-form-item>
                <el-form-item label="同步到：" prop="targetCountry">
                    <el-checkbox-group v-model="syncModel.targetCountry">
                        <el-checkbox v-for="country in countryList" :label="country.shortCode" :key="country.shortCode">{{country.nameCn}}</el-checkbox>
                    </el-checkbox-group>
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

    export default {
        // 底部Icon同步
        name: 'SyncMediaDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            countryCode: {
                type: String,
                default: 'MY'
            }
        },
        data() {
            return {
                dialogTitle: '同步所选内容',
                syncModel: {
                    sourceCountry: 'MY',
                    targetCountry: []
                },
                countryList: [],
                ruleValidate: {
                    targetCountry: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择国家'
                    }],
                },
            }
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    console.log(this.countryCode)
                    let countryList = this.$store.state.dict.countryList
                    let filterList = []
                    _.forEach(countryList, item => {
                        if (item.shortCode != this.countryCode) {
                            filterList.push(item)
                        }
                    })
                    this.countryList = filterList
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        methods: {
            reset() {
                this.$refs.syncIconForm.resetFields()
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                 this.$refs.syncIconForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.syncModel.targetCountry)
                        this.reset()
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .auto-pricing-dialog {
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



