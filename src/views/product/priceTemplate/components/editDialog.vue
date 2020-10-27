<template>
    <el-dialog :title="title"
               width="900px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                     :rules="rules"
                     :model="param">
                <el-form-item label="模板名称" prop="templateNameCn">
                    <el-input v-model="param.templateNameCn" show-word-limit maxlength="200" type="text" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="适用国家" prop="countryCode">
                    <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                        <el-option v-for="(item, index) in countryList"
                                   :key="index"
                                   :label="item.nameEn + '/' + item.nameCn "
                                   :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汇率模板" prop="exchangeRateTemplateId">
                    <el-select v-model="param.exchangeRateTemplateId" clearable placeholder="请选择" size="medium">
                        <el-option v-for="(item, index) in rateList"
                                   :key="index"
                                   :label="item.templateCode"
                                   :value="item.templateCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用类目" prop="category">
                    <div>
                        <el-tag v-for="(tag, i) in param.category"
                                :key="tag.id"
                                @close="removeCategory(tag, i)"
                                closable>{{tag.name}}
                        </el-tag>
                    </div>
                    <el-cascader style="width: 45%"
                                 filterable
                                 clearable
                                 remote
                                 @visible-change="clearSelectCategory"
                                 @change="addCategory"
                                 :props="{label: 'cateName',multiple: true, checkStrictly: false, children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
                                 placeholder="请选择商品后台分组"
                                 :options="categoryOptions"
                                 v-model="selectedOptions"
                                 class="normalOperatorBox"
                                 size="medium">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="国内物流费" prop="domesticExpressFee">
                    <el-input v-model="param.domesticExpressFee" size="small" type="text">
                        <i slot="suffix">元(CNY)</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="国内仓储费" prop="domesticWarehousingFee">
                    <el-input v-model="param.domesticWarehousingFee" size="small" type="text">
                        <i slot="suffix">元(CNY)</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="国际物流费" prop="airVolumePrice">
                    <div class="form-tips">在为商品计算空运费用时，系统将分别按照货物体积和重量计算并采取二者更大的金额</div>
                    <div class="flex">
                        <span>空运计价：</span>
                        <div class="flex1">
                            <div class="flex">
                                <el-form-item prop="airVolumePrice">
                                    <el-input v-model="param.airVolumePrice" size="small" type="text">
                                        <i slot="suffix">元(CNY)</i>
                                    </el-input>
                                </el-form-item>
                                <span class="mar-l-20 mar-r-20">/</span>
                                <el-form-item prop="airVolumeUnit">
                                    <el-input v-model="param.airVolumeUnit" size="small" type="text">
                                        <i slot="suffix">cm³</i>
                                    </el-input>
                                </el-form-item>
                            </div>
                            <div class="flex">
                                <el-form-item prop="airWeightPrice">
                                    <el-input v-model="param.airWeightPrice" size="small" type="text">
                                        <i slot="suffix">元(CNY)</i>
                                    </el-input>
                                </el-form-item>
                                <span class="mar-l-20 mar-r-20">/</span>
                                <el-form-item prop="airWeightUnit">
                                    <el-input v-model="param.airWeightUnit" size="small" type="text">
                                        <i slot="suffix">kg</i>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="flex">
                        <span>海运计价：</span>
                        <div class="flex1 flex">
                            <el-form-item prop="oceanVolumeUnit">
                                <el-input v-model="param.oceanVolumeUnit" size="small" type="text">
                                    <i slot="suffix">元(CNY)</i>
                                </el-input>
                            </el-form-item>
                            <span class="mar-l-20 mar-r-20">/</span>
                            <el-form-item prop="oceanVolumePrice">
                                <el-input v-model="param.oceanVolumePrice" size="small" type="text">
                                    <i slot="suffix">cm³</i>
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="国际仓储费" prop="internationalWarehousingFee">
                    <el-input v-model="param.internationalWarehousingFee" size="small" type="text">
                        <i slot="suffix">元(CNY)</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="支付通道费" prop="paymentPassageFee">
                    <el-input v-model="param.paymentPassageFee" size="small" type="text">
                        <i slot="suffix">%</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="划线价毛利率" prop="grossInterestRate">
                    <el-input v-model="param.grossInterestRate" size="small" type="text">
                        <i slot="suffix">%</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="提现手续费" prop="cashServiceFee">
                    <el-input v-model="param.cashServiceFee" size="small" type="text">
                        <i slot="suffix">%</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="VIP价毛利率" prop="vipGrossInterestRate">
                    <el-input v-model="param.vipGrossInterestRate" size="small" type="text">
                        <i slot="suffix">%</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="运营开支" prop="operatingFee">
                    <el-input v-model="param.operatingFee" size="small" type="text">
                        <i slot="suffix">%</i>
                    </el-input>
                </el-form-item>
                <el-form-item label="活动毛利率" prop="activeGrossInterestRate">
                    <el-input v-model="param.activeGrossInterestRate" size="small" type="text">
                        <i slot="suffix">%</i>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { addNewProductPriceTemplate, updateProductPriceTemplate, exchangeGetRecentRateTemplate } from '@/request/product'
    import productCommon from '../../common/common'
    export default {
        props: {
            propShowDialog: Boolean,
            propParam: {
                type: Object,
                default: () => { return {} }
            },
            title: {
                type: String,
                default: '模板编辑'
            }
        },
        data () {
            return {
                rules: {
                    templateNameCn: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    exchangeRateTemplateId: [{ required: true, message: '不能为空', trigger: 'change' }],
                    category: [{ required: true, message: '不能为空', trigger: 'change' }],
                    domesticExpressFee: [{ required: true, message: '不能为空', trigger: 'change' }],
                    domesticWarehousingFee: [{ required: true, message: '不能为空', trigger: 'change' }],
                    airVolumePrice: [{ required: true, message: '不能为空', trigger: 'change' }],
                    airVolumeUnit: [{ required: true, message: '不能为空', trigger: 'change' }],
                    airWeightUnit: [{ required: true, message: '不能为空', trigger: 'change' }],
                    airWeightPrice: [{ required: true, message: '不能为空', trigger: 'change' }],
                    oceanVolumeUnit: [{ required: true, message: '不能为空', trigger: 'change' }],
                    oceanVolumePrice: [{ required: true, message: '不能为空', trigger: 'change' }],
                    internationalWarehousingFee: [{ required: true, message: '不能为空', trigger: 'change' }],
                    paymentPassageFee: [{ required: true, message: '不能为空', trigger: 'change' }],
                    grossInterestRate: [{ required: true, message: '不能为空', trigger: 'change' }],
                    cashServiceFee: [{ required: true, message: '不能为空', trigger: 'change' }],
                    vipGrossInterestRate: [{ required: true, message: '不能为空', trigger: 'change' }],
                    operatingFee: [{ required: true, message: '不能为空', trigger: 'change' }],
                    activeGrossInterestRate: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                param: {
                    category: [],
                    templateNameCn: '',
                    templateId: '',
                    countryCode: '',
                    exchangeRateTemplateId: '',
                    categoryId: [],
                    domesticExpressFee: '',
                    domesticWarehousingFee: '',
                    airVolumePrice: '',
                    airVolumeUnit: '',
                    airWeightUnit: '',
                    airWeightPrice: '',
                    oceanVolumeUnit: '',
                    oceanVolumePrice: '',
                    internationalWarehousingFee: '',
                    paymentPassageFee: '',
                    grossInterestRate: '',
                    cashServiceFee: '',
                    vipGrossInterestRate: '',
                    operatingFee: '',
                    activeGrossInterestRate: ''
                },
                rateList: [],
                selectedOptions: [],
                categoryOptions: []
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        watch: {
            propParam (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                }
            }
        },
        mixins: [productCommon],
        created () {
            this.getExchangeTemplate()
            this.fetchCategory({
                cateType: 2,
                level: 1,
                resolve: (data) => {
                    this.categoryOptions = data
                }
            })
        },
        methods: {
            getExchangeTemplate () {
                exchangeGetRecentRateTemplate({}).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.rateList = [res]
                    }
                })
            },
            close () {
                this.param = {
                    category: [],
                    templateId: '',
                    templateNameCn: '',
                    countryCode: '',
                    exchangeRateTemplateId: '',
                    categoryId: [],
                    domesticExpressFee: '',
                    domesticWarehousingFee: '',
                    airVolumePrice: '',
                    airVolumeUnit: '',
                    airWeightUnit: '',
                    airWeightPrice: '',
                    oceanVolumeUnit: '',
                    oceanVolumePrice: '',
                    internationalWarehousingFee: '',
                    paymentPassageFee: '',
                    grossInterestRate: '',
                    cashServiceFee: '',
                    vipGrossInterestRate: '',
                    operatingFee: '',
                    activeGrossInterestRate: ''
                }
                this.$emit('close')
            },
            confirm () {
                let bindId = []
                for (let i = 0; i < this.param.category.length; i++) {
                    bindId.push(String(this.param.category[i].id))
                }
                this.param.categoryId = bindId
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        let fetchUrl = addNewProductPriceTemplate
                        if (this.param.templateId) {
                            fetchUrl = updateProductPriceTemplate
                        }
                        fetchUrl(this.filterData(this.param)).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('操作成功')
                                this.close()
                            }
                        })
                    }
                })
            },
            addCategory () {
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    let data = JSON.parse(this.selectedOptions[i][2])
                    let item = this.param.category.find((val) => {
                        return val.id == data.cateId
                    })
                    if (!item) {
                        this.param.category.push({
                            id: data.cateId,
                            name: data.cateName
                        })
                    }
                }
            },
            clearSelectCategory (show) {
                if (!show) {
                    this.selectedOptions = []
                }
            },
            removeCategory (tag, i) {
                this.param.category.splice(i, 1)
            }
        }
    }
</script>
<style lang="scss" scoped>
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
</style>
