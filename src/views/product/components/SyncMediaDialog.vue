<template>
    <div class="auto-pricing-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="autoPricingForm" :rules="ruleValidate" :model="syncModel" label-width="100px">
                <el-form-item label="从：" prop="">
                    <el-radio-group v-model="syncModel.sourceLang">
                        <el-radio label="en">英文</el-radio>
                        <el-radio label="cn">中文</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="同步到：" prop="">
                    <el-checkbox-group v-model="syncModel.targetLang" :min="1" >
                        <el-checkbox v-for="language in languageList" :label="language.code" :key="language.code">{{language.desc}}</el-checkbox>
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
        // 图片和视频同步
        name: 'SyncMediaDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogTitle: '图片和视频同步',
                syncModel: {
                    sourceLang: 'en',
                    targetLang: []
                },
                ruleValidate: {
                    checkedCountry: [{
                        required: true,
                        trigger: 'change',
                        message: '至少选择一个国家'
                    }],
                    priceType: [{
                        required: true,
                        trigger: 'change',
                        message: '不能为空'
                    }],
                    templateId: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择定价模板'
                    }],
                    transport: [{
                        required: true,
                        trigger: 'change',
                        message: '不能为空'
                    }]
                },

            }
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    if (this.dialogVisible) {
                        let langList = []
                        _.forEach(this.languageList, language => {
                            langList.push(language.code)

                        })
                        this.syncModel.targetLang = langList
                    }
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
                this.$emit('on-confirm', this.syncModel)
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



