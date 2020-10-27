<template>
    <div class="push-time-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="pushTimeEditForm" :model="pushSetting" :rules="ruleValidate" label-width="150px">
                <el-form-item prop="sendTime" :label="'发送时间('+ countryName +')：'">
                    <el-date-picker
                        v-model="pushSetting.sendTime"
                        value-format="timestamp"
                        type="datetime"
                        size="medium"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions">
                    </el-date-picker>
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
    export default {
        // 定时发送
        name: 'PushTimeDialog',
        data() {
            return {
                dialogTitle: '定时发送',
                pushSetting: this.pushSettingModel,
                ruleValidate: {
                    sendTime: [
                        { required: true, message: '请设置发送时间', trigger: 'change' }
                    ]
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            pushSettingModel: {
                type: Object,
                default:  () => {return {}}
            },
            countryName: {
                type: String,
                default: ''
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
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                let now = new Date().getTime()
                if (this.pushSetting.sendTime - now < 30 * 60 * 1000) {
                    this.$message.warning('离发时间要大于半小时')
                    return
                }
                this.$refs.pushTimeEditForm.validate(valid => {
                    if (valid) {
                        this.$emit('on-confirm', this.pushSetting)
                        this.reset()
                    }
                })
            },
            reset() {
                this.$refs.pushTimeEditForm.resetFields()
            }
        }
    }
</script>

<style lang="scss">
    .push-time-edit-dialog {
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

