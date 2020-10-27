<template>
    <div class="one-key-upload-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="800px">
            <div slot="title">
                {{title}}
            </div>
            <el-form ref="oneKeyUploadForm" :model="oneKeyUploadModel" :rules="ruleValidate" label-width="120px">
                <el-form-item prop="source" label="商品来源：">
                    <el-radio-group v-model="oneKeyUploadModel.source">
                        <!-- <el-radio :label="1">手工录入/自营</el-radio>
                        <el-radio :label="2">甩宝</el-radio> -->
                        <el-radio :label="3">1688</el-radio>
                        <!-- <el-radio :label="4">拼多多</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="productIds" label="商品ID：">
                    <el-input v-model="oneKeyUploadModel.productIds" type="textarea" :rows="4"
                        clearable placeholder="请输入商品ID, 多个商品ID时，请用英文逗号,隔开" style="width: 320px" size="medium"></el-input>
                </el-form-item>
            </el-form>
            <div class="tips">
                <p>1. 上传多个商品ID时，请用英文逗号,隔开；</p>
                <p>2. 一次最多支持上传20个商品ID；</p>
                <p>3. 商品ID从商品链接中获取，一般为纯数字；</p>
                <p>示例1688：</p>
                <p>https://detail.1688.com/offer/<span>525395652086</span>.html?spm=a26317.12815169.jxsum3a1.2.29a435618cXmUS&scm=1007.26309.139606.0&udsPoolId=1263941&resourceId=1041521</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    const MAX_LENGTH = 20
    export default {
        data() {
            return {
                title: 'ID上货',
                oneKeyUploadModel: {
                    source: 3,
                    productIds: ''
                },
                ruleValidate: {
                    source: [{
                        required: true,
                        trigger: 'change',
                        message: '商品来源'
                    }],
                    productIds: [{
                        required: true,
                        trigger: 'blur',
                        message: '商品ID不能为空'
                    }]
                },
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
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
                this.$refs.oneKeyUploadForm.resetFields()
            },
            comfirm() {
                let sourceResult = {
                    source: this.oneKeyUploadModel.source,
                    orgId: []
                }

                this.$refs.oneKeyUploadForm.validate((valid) => {
                    if (valid) {
                        let productIdList = this.oneKeyUploadModel.productIds.split(',')
                        _.forEach(productIdList, productId => {
                            if (productId != '') {
                                sourceResult.orgId.push(_.trim(productId))
                            }
                        })
                        sourceResult.orgId = _.uniq(sourceResult.orgId)
                        if (sourceResult.orgId.length > MAX_LENGTH) {
                            this.$message.warning(`一次最多支持上传${MAX_LENGTH}个商品ID`)
                            return
                        }
                        this.$emit('on-confirm', sourceResult)
                        this.$refs.oneKeyUploadForm.resetFields()
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .one-key-upload-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
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
    .one-key-upload-dialog {
        .tips {
            margin-left: 120px;
            width: 500px;
            p {
                margin-bottom: 6px;
                span {
                    color: #D9001B;
                }
            }
        }
    }
</style>

