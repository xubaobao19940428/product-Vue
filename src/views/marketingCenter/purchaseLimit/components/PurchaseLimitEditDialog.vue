<template>
    <div class="purchase-limit-eidt-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="800px">
            <div slot="title">
                {{title}}
            </div>
            <el-form ref="limitEditForm" :model="limitModel" :rules="ruleValidate" label-width="120px">
                <el-form-item label="限购名称：" prop="limitName">
                    <el-input v-model="limitModel.limitName" clearable size="medium" maxlength="20" show-word-limit placeholder="请输入限购名称" style="width: 320px"></el-input>
                </el-form-item>
                <el-form-item label="指定人群：" prop="groupType">
                    <el-radio-group v-model="limitModel.groupType">
                        <el-radio :label="1">全部人群</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="限购国家：" prop="countryCode">
                    <el-select v-model="limitModel.countryCode" size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="限购时间：" prop="datetimeRange">
                    <el-date-picker v-model="limitModel.datetimeRange"
                        type="datetimerange"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="限购规则：" prop="limitQuantity">
                    <el-radio-group v-model="limitModel.purchaseLimitRuleType">
                        <el-radio :label="1">
                            <div class="limit-num-tip">
                                指定人群在限购期间<span class="required">累计最多购买</span>
                                <el-input-number v-show="limitModel.purchaseLimitRuleType == 1" v-model="limitModel.limitQuantity" controls-position="right" :min="1" :max="9999" size="mini">
                                </el-input-number> 件（按SPU计）
                            </div>
                        </el-radio>
                        <el-radio :label="2">
                            <div class="limit-num-tip">
                                指定人群在限购期间<span class="required">每单最小购买</span>
                                <el-input-number v-show="limitModel.purchaseLimitRuleType == 2" v-model="limitModel.limitQuantity" controls-position="right" :min="1" :max="9999" size="mini">
                                </el-input-number> 件（按SKU计）
                            </div>
                        </el-radio>
                        <el-radio :label="3">
                            <div class="limit-num-tip">
                                指定人群在限购期间<span class="required">每单最多购买</span>
                                <el-input-number v-show="limitModel.purchaseLimitRuleType == 3" v-model="limitModel.limitQuantity" controls-position="right" :min="1" :max="9999" size="mini">
                                </el-input-number> 件（按SKU计）
                            </div>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择商品：" prop="purchaseLimitRuleType">
                   <product-select v-if="toggle" ref="productSelect" :propProductId="limitModel.productId" :propCateId="limitModel.cateId"></product-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import productSelect from './productSelect'
    export default {
        data() {
            return {
                ruleValidate: {
                    limitName: [{
                        required: true,
                        trigger: 'blur',
                        message: '限购名称不能为空'
                    }],
                    groupType: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择指定人群'
                    }],
                    countryCode: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择限购国家'
                    }],
                    datetimeRange: [{
                        required: true,
                        trigger: 'change',
                        message: '请设置限购时间'
                    }],
                    limitQuantity: [{
                        required: true,
                        trigger: 'blur',
                        message: '限购数量不能为空'
                    }],
                    productIdList: [{
                        required: true,
                        trigger: 'blur',
                        message: '商品不能为空'
                    }],
                    purchaseLimitRuleType: [{
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    }]
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            limitData: {
                type: Object,
                default: function() {
                    return {}
                }
            }

        },
        components: {
            productSelect
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            limitModel: function() {
                return this.limitData
            },
            countryList() {
                return this.$store.state.dict.countryList
            }
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.$refs.limitEditForm.resetFields()
            },
            comfirm() {
                let data = this.$refs.productSelect.getData()
                console.log(data)
                if (data.productId.length <= 0 && data.cateId.length <= 0) {
                    return this.$message.warning('请选择商品')
                }
                Object.assign(this.limitModel, data)
                this.$refs.limitEditForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-comfirm', this.limitModel)
                        this.$refs.limitEditForm.resetFields()
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .purchase-limit-eidt-dialog {
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
        .limit-num-tip {
            color: #000;
        }
        .el-radio{
            display: flex;
            align-items: center;
            margin-top: 10px;
        }
    }
</style>
