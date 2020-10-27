<template>
    <div class="sensitive-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="sensitiveEditForm" :rules="ruleValidate" :model="sensitiveModel" label-width="100px">
                <el-form-item label="语种：" prop="languageCode">
                    <el-radio-group v-model="sensitiveModel.languageCode">
                        <el-radio v-for="language in languageList" :label="language.code" :key="language.code">{{language.desc}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="敏感词：" prop="word">
                    <el-input v-model="sensitiveModel.word" placeholder="请输入敏感词：" size="medium" clearable  style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="屏蔽对象：" prop="senseType">
                    <el-radio-group v-model="sensitiveModel.senseType">
                        <el-radio :label="1">商品标题</el-radio>
                        <el-radio :label="2">商品属性</el-radio>
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
        // 敏感词
        name: 'sensitiveEditDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            sensitiveModel: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                dialogTitle: '敏感词',
                ruleValidate: {
                    languageCode: [{
                        required: true,
                        trigger: 'change',
                        message: ''
                    }],
                    word: [{
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    }],
                    senseType: [{
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
            },
            confirm() {
                this.loading = true
                this.$refs.sensitiveEditForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.sensitiveModel)
                        this.loading = false
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .sensitive-edit-dialog {
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



