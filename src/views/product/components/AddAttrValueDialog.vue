<template>
    <div class="add-attr-value-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <table class="table table-bordered table-info">
                <tbody>
                    <tr v-for="(item, index) in languageList" :key="index">
                        <th><span class="required" v-if="item.code === 'cn' || item.code === 'en'">*</span> {{item.desc}}{{item.code}} </th>
                        <td>
                            <el-input v-model="attrValue[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
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
        name: 'AddAttrValueDialog',
        data() {
            return {
                dialogTitle: '新增属性值',
                attrValue: {}
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
            languageList() {
                // 多语言
                let languageList = JSON.parse(this.getStore('languageList'))
                _.forEach(languageList, item => {
                    this.$set(this.attrValue, item.code, '')
                })
                return languageList
            }
        },
        methods: {
            reset() {
                _.forEach(this.languageList, item => {
                    this.$set(this.attrValue, item.code, '')
                })
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                if (this.attrValue.cn === '') {
                    this.$message.error('属性值中文不能为空！')
                    return
                }
                if (this.attrValue.en === '') {
                    this.$message.error('属性值英文不能为空！')
                    return
                }
                this.$emit('on-confirm', this.attrValue)
            }
        }
    }
</script>

<style lang="scss">
    .add-attr-value-dialog {
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



