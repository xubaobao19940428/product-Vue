<template>
    <div class="service-info-item">
        <el-form ref="serviceInfoItemForm" :model="serviceInfoItemForm" :rules="ruleValidateInfo" label-width="80px">
            <el-form-item label="售后政策：" prop="afterSalePledge">
                <el-select v-model="serviceInfoItemForm.afterSalePledge" size="medium" filterable clearable placeholder="请选择" style="width: 260px" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                    <el-option v-for="(item, index) in afterSaleList" :key="index" :label="item.name" :value="item.afterSaleId"></el-option>
                </el-select>
                <span class="tips">此承诺将展示在APP商品详情页中</span>
            </el-form-item>
            <el-form-item label="到货承诺：" prop="arrivalPledge">
                <el-select v-model="serviceInfoItemForm.arrivalPledge" size="medium" filterable clearable placeholder="请选择" style="width: 260px" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                    <el-option v-for="(item, index) in arrivalList" :key="index" :label="item.name" :value="item.arrivalId"></el-option>
                </el-select>
                <span class="tips">此承诺将展示在APP商品详情页、搜索列表页、购物车、订单详情页中</span>
            </el-form-item>
            <el-form-item label="运费模板：" prop="freightId">
                <el-radio-group v-model="serviceInfoItemForm.freightType" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                    <div class="radio-item">
                        <el-radio :label="2"> 运费模板</el-radio>
                        <el-select v-model="serviceInfoItemForm.freightId" size="medium" filterable clearable placeholder="请选择" style="width: 260px" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                            <el-option v-for="(item, index) in freightTemplateList" :key="index" :label="item.templateName" :value="item.templateId"></el-option>
                        </el-select>
                    </div>
                    <div class="radio-item">
                        <el-radio :label="0"> 包邮 </el-radio>
                    </div>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { listAfterSale, listArrival } from '@/request/pledge'
    import { freightTemplateListPage } from '@/request/freight'
    export default {
        // 服务承诺item
        name: 'ServiceInfoItem',
        props: {
            type: {
                type: String,
                default: 'add'
            },
            serviceInfoItemForm: {
                type: Object,
                default: () => {}
            },
            shortCode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                ruleValidateInfo: {},
                ruleValidate: {
                    afterSalePledge: [{
                        required: true,
                        trigger: 'change',
                        message: '售后政策不能为空'
                    }],
                    freightId: [{
                        // required: true,
                        // trigger: 'change',
                        // message: '运费模板不能为空'
                    }]
                },
                // 售后政策
                afterSaleList: [],
                // 到货承诺类型
                arrivalList: [],
                // 运费模板列表
                freightTemplateList: [],
                serviceInfoItemFormData: {},
                freightType: ''
            }
        },
        computed: {
            countryShortCode() {
                return this.shortCode
            }
        },
        components: {
        },
        created() {
            if (this.type === 'check') {
                this.ruleValidateInfo = {}
            } else {
                this.ruleValidateInfo = this.ruleValidate
            }
            this.getAfterSaleList()
            this.getArrivalList()
            this.getFreightTemplateListPage()
        },
        methods: {
            getAfterSaleList() {
                let params = {
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                listAfterSale(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.afterSaleList = res.afterSalePledge
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getArrivalList() {
                let params = {
                    countryCode: this.countryShortCode,
                    type: 2,
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                listArrival(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.arrivalList = res.arrivalPledge
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getFreightTemplateListPage() {
                let params = {
                    countryCode: this.countryShortCode,
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                freightTemplateListPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.freightTemplateList = res.freightTemplateUnit
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getServiceInfoItemData() {
                this.$refs.serviceInfoItemForm.validate((valid) => {
                    if (valid) {
                        this.serviceInfoItemFormData = this.serviceInfoItemForm
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .service-info-item {
        .tips { margin-left: 10px; }
        .radio-item {
            height: 50px;
        }
    }


</style>
