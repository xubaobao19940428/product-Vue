<template>
    <div class="auto-pricing-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="autoPricingForm" :rules="ruleValidate" :model="autoPricingModel" v-if="Object.keys(autoPricingModel).length > 0">
                <el-form-item label="选择国家：" prop="checkedCountry">
                    <el-checkbox-group v-model="autoPricingModel.checkedCountry" @change="handleCheckedCountryChange">
                        <el-checkbox v-for="country in countryList" :label="country.shortCode" :key="country.shortCode" :disabled="!autoPricingModel.template[country.shortCode]">{{country.nameLocal}}
                             <el-select v-model="autoPricingModel.template[country.shortCode]" placeholder="请选择">
                                <div v-if="templateOptions[country.shortCode]">
                                    <el-option v-for="item in templateOptions[country.shortCode]" :key="item.templateId" :label="item.templateNameCn" :value="item.templateId">
                                    </el-option>
                                </div>
                            </el-select>
                         </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item v-if="autoPricingModel" label="运输方式：" prop="transport">
                    <el-radio-group v-model="autoPricingModel.transport">
                        <el-radio :label="2">空运</el-radio>
                        <el-radio :label="1">海运</el-radio>
                    </el-radio-group>
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
    import { getTemplateByCategoryId } from '@/request/price'
    import {getTemplate} from '@/request/freight'

    export default {
        // 自动定价
        name: 'AutoPricingDialog',
        props: {
            editType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            category: {
                type: String,
                default: ''
            },
            autoPricingModel: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                dialogTitle: '自动定价',
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
                    transport: [{
                        required: true,
                        trigger: 'change',
                        message: '不能为空'
                    }]
                },
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                priceTypeList: [{
                    value: '1',
                    label: '划线价'
                }, {
                    value: '2',
                    label: 'VIP价'
                }, {
                    value: '3',
                    label: '建议活动价'
                }],
                templateOptions: {},
                priceTemp: {}
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
            countryList() {
                let countryList = this.$store.state.dict.saleCountryList
                console.log('countryList',countryList)
                return countryList
            },
        },
        mounted(){
            console.log('国家的模版',this.autoPricingModel)
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                _.forEach(this.autoPricingModel.template, (value, key) => {
                    _.forEach(this.templateOptions[key], template => {
                        if (template.templateId === value) {
                            template.transport = this.autoPricingModel.transport
                            this.priceTemp[key] = template
                        }
                    })
                })
                let priceTempResult = {}
                _.forEach(this.autoPricingModel.checkedCountry, country => {
                    if (this.priceTemp[country]) {
                        priceTempResult[country] = this.priceTemp[country]
                    }
                })
                this.$refs.autoPricingForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', priceTempResult)
                    } else {
                        this.$message.warning('必填字段不能为空')
                    }
                })
            },

            cancleDel() {
                this.confirmVisible = false
            },
            confirmDel() {
                this.confirmVisible = false
                this.confirmDelAttrValue()
            },

            delAttrValue(index) {
                let attrValue = '黑色'
                this.confirmVisible = true
                this.confirmDialogTitle = '确定删除该值？'
                this.confirmDialogText = `删除`
            },
            confirmDelAttrValue() {
                if (this.autoPricingModel.attrValueTableData.length <= 1) {
                    this.$message.warning('至少有一条属性值')
                    return
                }
            },
            handleChange() {},
            handleCheckedCountryChange(value) {
                console.log(value)
            },
            handleCheckedPriceTypeChange() {},
            /**
             * 获取当前三级分类下的全部定价模板
             */
            getPriceTemplateByCategoryId() {
                let cateIdList = []
                _.forEach(this.categoryLink, item => {
                    cateIdList.push(item.cateId)
                })
                let params = {
                    categoryId: [Number(this.category)]
                }
                getTemplateByCategoryId(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let resultGroupObj = _.groupBy(res.data, 'countryCode')
                        console.log('111111',resultGroupObj)
                        this.templateOptions = resultGroupObj
                        // 默认勾选第一个
                        _.forEach(this.countryList, country => {
                            _.forEach(resultGroupObj, (result, key) => {
                                if (country.shortCode === key) {
                                    this.autoPricingModel.template[country.shortCode] = resultGroupObj[country.shortCode][0].templateId
                                    this.autoPricingModel.checkedCountry.push(key)
                                }
                            })
                        })
                        this.autoPricingModel.checkedCountry = _.uniq(this.autoPricingModel.checkedCountry)
                        console.log(this.autoPricingModel)

                    }
                }).catch(err => {
                    console.log(err)
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
        .el-checkbox {
            display: block;
            margin-bottom: 10px;
            margin-left: 85px
        }
    }
    .tips {
        color: #aaa;
        line-height: 20px;
    }

    .sub-product-table {
        padding: 10px 54px;
    }
</style>



