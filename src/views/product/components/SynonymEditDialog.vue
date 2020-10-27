<template>
    <div class="synonym-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="synonymEditForm" :rules="ruleValidate" :model="synonymModel" label-width="100px">
                <el-form-item label="语种：" prop="languageCode">
                    <el-radio-group v-model="synonymModel.languageCode">
                        <el-radio v-for="language in languageList" :label="language.code" :key="language.code">{{language.desc}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="目标词：" prop="leftWord">
                    <el-input v-model="synonymModel.leftWord" placeholder="请输入目标词" size="medium" clearable  style="width: 220px;"></el-input>
                    <i class="el-icon-sort word-change" @click="exchangeWord"></i>
                </el-form-item>
                <el-form-item label="同义词：" prop="rightWord">
                    <el-input v-model="synonymModel.rightWord" placeholder="请输入同义词：" size="medium" clearable  style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="匹配方向：" prop="flag">
                    <el-radio-group v-model="synonymModel.flag">
                        <el-radio :label="1">单向</el-radio>
                        <el-radio :label="0">双向</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" :loading="loading" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        // 同义词
        name: 'synonymEditDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            synonymModel: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                dialogTitle: '同义词',
                ruleValidate: {
                    languageCode: [{
                        required: true,
                        trigger: 'change',
                        message: ''
                    }],
                    leftWord: [{
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    }],
                    rightWord: [{
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    }],
                    flag: [{
                        required: true,
                        trigger: 'change',
                        message: ''
                    }]
                },
                loading: false
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
                let languageList = JSON.parse(this.getStore('languageList'))
                return languageList
            },
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.$refs.synonymEditForm.resetFields()
            },
            confirm() {
                this.loading = true
                this.$refs.synonymEditForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.synonymModel)
                        this.loading = false
                        this.$refs.synonymEditForm.resetFields()
                    }
                })
            },
            exchangeWord() {
                let leftWordCopy = this.synonymModel.leftWord
                let rightWordCopy = this.synonymModel.rightWord
                this.synonymModel.leftWord = rightWordCopy
                this.synonymModel.rightWord = leftWordCopy
            }
        }
    }
</script>

<style lang="scss">
    .synonym-edit-dialog {
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
        .word-change {
            position: absolute;
            font-size: 20px;
            top: 45px;
            padding-left: 6px;
            font-weight: 700;
            color: #409EFF;
            cursor: pointer
        }
    }
</style>



