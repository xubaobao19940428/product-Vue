<template>
    <div class="subject-ediit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <table class="table table-bordered table-info">
                <tbody>
                    <tr v-for="(item, index) in languageList" :key="index">
                        <th><span class="required" v-if="item.code === 'cn' || item.code === 'en'">*</span> {{item.desc}}{{item.code}} </th>
                        <td>
                            <el-input v-model="subject[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mt10">
                拼团类型：<el-select v-model="groupActivity" placeholder="请选择" size="medium">
                    <el-option v-for="item in groupActivityTypeArray" :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>
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
        // 新增属性值
        name: 'SubjectEdiitDialog',
        data() {
            return {
                dialogTitle: '编辑专题',
                groupActivityTypeArray: [{
                    key: 0,
                    name: '普通拼团'
                }, {
                    key: 1,
                    name: '一元购'
                }, {
                    key: 2,
                    name: '半价购'
                }],
                groupActivity: this.groupActivityType
                // subject: this.subjectObject
            }
        },
        props: {
            editType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            subjectObject: {
                type: Object,
                default: () => { return {} }
            },
            groupActivityType: {
                type: [Number, String],
                default: 0
            }
        },
        watch: {
            groupActivityType (val) {
                this.groupActivity = val
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            languageList() {
                // 多语言
                let languageList = JSON.parse(this.getStore('languageList'))
                // _.forEach(languageList, item => {
                //     this.$set(this.subject, item.code, '')
                // })
                return languageList
            },
            subject() {
                return this.subjectObject
            }
        },
        methods: {
            reset() {
                _.forEach(this.languageList, item => {
                    this.$set(this.subject, item.code, '')
                })
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                if (this.subject.cn === '') {
                    this.$message.error('专题中文不能为空！')
                    return
                }
                if (this.subject.en === '') {
                    this.$message.error('专题名英文不能为空！')
                    return
                }
                console.log(this.subject)
                this.$emit('on-confirm', _.cloneDeep({subjectInfo: this.subject, groupActivityType: this.groupActivity}))
            }
        }
    }
</script>

<style lang="scss">
    .mt10 {
        margin-top: 10px;
    }
    .subject-ediit-dialog {
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
        .table {
            width: 100%;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            th {
                background: #f2f2f2;
                width: 120px;
                border: 1px solid #DCDFE6;
            }
            tr td {
                border: 1px solid #DCDFE6;
            }
            td {
                padding: 2px 10px;
            }
            .limit {
                width: 120px;
                text-align: center;
            }
            .required {
                font-size: 16px;
                color: red;
                vertical-align: middle;
            }
        }
    }
</style>



