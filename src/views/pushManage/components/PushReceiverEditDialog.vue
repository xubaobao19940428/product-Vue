<template>
    <div class="push-receiver-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <div class="push-receiver-edit">
                <el-radio-group v-model="receiverData.groupType" @change="handleChange">
                    <div class="user-type">
                        <el-radio :label="1">全量用户</el-radio>
                    </div>
                    <div class="user-type">
                        <el-radio :label="2">等级</el-radio>
                        <el-checkbox-group v-model="receiverData.userLevel" v-show="receiverData.groupType === 2" class="type-item">
                            <el-checkbox v-for="(item, index) in memberLevel" :key="index" :label="item.value" >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="user-type">
                        <el-radio :label="3">用户ID</el-radio>
                        <el-input
                            v-show="receiverData.groupType === 3"
                            type="textarea"
                            class="type-item"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="可填写多个用户id，id之间用英文','隔开"
                            v-model="receiverData.userId"
                            style="width: 350px">
                        </el-input>
                    </div>
                    <div class="user-type">
                        <el-radio :label="4">用户画像分组</el-radio>
                        <el-select v-show="receiverData.groupType === 4"  v-model="receiverData.userGroupId" filterable remote reserve-keyword :remote-method="remoteMethod" placeholder="请选择">
                            <el-option
                            v-for="item in receiverData.idList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-radio-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        // 接收用户
        name: 'PushReceiverDialog',
        data() {
            return {
                dialogTitle: '接收用户',
                pushTimeEditForm: {
                    pushPlanTime: ''
                },
                ruleValidate: {
                    pushPlanTime: [
                        { required: true, message: '请选择发送时间', trigger: 'change' }
                    ]
                },
                memberLevel: [{
                    label: 'SH',
                    value: 2
                }, {
                    label: 'PS',
                    value: 3
                }, {
                    label: 'AM',
                    value: 4
                }, {
                    label: 'AT',
                    value: 5
                }],
                receiverIdList: '',
                receiverCheckList: [],
                
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            receiverTypeModel: {
                type: Number
            },
            receiverModel: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            receiverData: {
                get: function() {
                    return this.receiverModel;
                },
                set: function() {}
            }
        },
        methods: {
            remoteMethod (val) {
                console.log(val)
                this.$parent.getUserGroupInfo(val,'')
            },
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                console.log(this.receiverData)
                this.$emit('on-confirm', this.receiverData)
            },
            handleChange() {
                this.reset()
            },
            reset() {
                this.receiverIdList = '',
                this.receiverCheckList = []
            }
        }
    }
</script>

<style lang="scss">
    .push-receiver-edit-dialog {
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
    .push-receiver-edit {
        .user-type {
            margin: 20px 0;
        }
        .type-item {
            display: block;
            padding-left: 26px;
            padding-top: 4px;
        }
        .radio-id{
            margin: 10px 10px 10px 0;
        }
    }
</style>

