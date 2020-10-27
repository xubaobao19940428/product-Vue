<template>
    <div class="base-info-wrapper">
        <el-form ref="productBaseInfoForm" :model="baseInfoForm" :rules="ruleValidateInfo" label-width="80px">
            <el-form-item label="商品分类：" prop="cateId">
                {{baseInfoForm.categoryLinkStr}}
                <!--新建商品时，允许修改分类；但修改分类当前页面数据不会被保留，等于重新录入；编辑商品时，不支持在此处修改分类-->
                <el-link v-if="type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT'))" :underline="false" type="primary" @click="modifyCategory"> 修改分类</el-link>
            </el-form-item>
            <el-form-item label="销售国家：" prop="productSaleCountry">
                <el-checkbox-group v-model="baseInfoForm.productSaleCountry" @change="handleSaleCountryChange">
                    <p v-for="(item, index) in countryList" :key="index">
                        <el-checkbox :label="item.shortCode" :key="index" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || countryShelveMapStatus[item.shortCode].disabled" @change="handelCheckboxChange" >{{item.nameLocal}}
                            <span class="putaway" v-show="countryShelveMapStatus[item.shortCode].show">
                                <el-radio-group v-model="countryShelveMapStatus[item.shortCode].shelveStatus">
                                    <el-radio :label="1">上架</el-radio>
                                    <el-radio :label="2">下架</el-radio>
                                </el-radio-group>
                            </span>
                        </el-checkbox>
                    </p>
                </el-checkbox-group>
            </el-form-item>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="商品类型：" prop="productType">
                        <el-select v-model="baseInfoForm.productType" filterable clearable placeholder="请选择" size="medium" style="width: 260px" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                            <el-option v-for="(item, index) in productTypeList" :key="index" :label="item.name" :value="item.productType"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌：" prop="brandId">
                        <el-select v-model="baseInfoForm.brandId" filterable clearable placeholder="请选择" size="medium" @change="handleChangeBrand" style="width: 260px" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                            <el-option v-for="(item, index) in brandList" :key="index" :label="item.nameCn" :value="item.brandId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="货物性质：" prop="nature">
                        <el-radio-group v-model="baseInfoForm.nature" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
                            <el-radio :label="1">普货</el-radio>
                            <el-radio :label="2">敏感货</el-radio>
                            <el-radio :label="3">违禁品</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="供应商：" prop="supplierId" class="filter-item">
                        <el-select v-model="baseInfoForm.supplierId" :remote-method="getSupplierList"
                            filterable clearable remote reserve-keyword placeholder="请输入供应商" style="width: 260px"
                            :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                            >
                            <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="商品标题：">
                <p class="tips">
                    请仔细填写商品标题，一键翻译功能将帮助你从中文快速翻译到其他语种，且不会覆盖您已填写的内容
                    <el-button type="primary" size="mini" plain :loading="titleTransLoading" @click="translate(baseInfoForm.title.cn, 'title')">一键翻译</el-button>
                </p>
                <table class="table table-bordered table-info">
                    <tbody>
                        <tr v-for="(item, index) in languageList" :key="index">
                            <th><span class="required" v-if="(item.code === 'cn' || item.code === 'en') && type != 'check'">*</span> {{item.desc}}{{item.code}} </th>
                            <td>
                                <el-input v-model="baseInfoForm.title[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                            </td>
                            <!-- <td class="limit">(0/60)</td> -->
                        </tr>
                    </tbody>
                </table>
            </el-form-item>
            <el-form-item label="宣传文案：">
                <p class="tips">
                    如有需要可为商品填写宣传文案，它将展示在商品标题的下方
                    <el-button type="primary" size="mini" plain :loading="subTitleTransLoading" @click="translate(baseInfoForm.subTitle.cn, 'subTitle')">一键翻译</el-button>
                </p>
                <table class="table table-bordered table-info">
                    <tbody>
                        <tr v-for="(item, index) in languageList" :key="index">
                            <th>{{item.desc}}{{item.code}} </th>
                            <td>
                                <el-input v-model="baseInfoForm.subTitle[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                            </td>
                            <!-- <td class="limit">(0/60)</td> -->
                        </tr>
                    </tbody>
                </table>
            </el-form-item>
            <el-form-item label="原始链接：">
                <el-input v-model="baseInfoForm.orgUrl" clearable size="medium" :disabled="!(type != 'edit' || (type == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"></el-input>
            </el-form-item>

        </el-form>
        <!-- <el-button type="success" size="mini" @click="getBaseInfoData">当前模块数据</el-button> -->
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleModify" @on-confirm="confirmModify"></confirm-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import {
        mapState
    } from 'vuex';
    import ConfirmDialog from '@/components/ConfirmDialog'
    import {
        brandInfoGet,
        getProductTypeList,
        getProductEnumInfo
    } from '@/request/product'
    import {
        getOneKeyTranslation
    } from '@/request/i18n'
    import { supplierBasePage } from '@/request/supplier'

    export default {
        // 商品基本信息
        name: 'ProductBaseInfo',
        props: {
            type: {
                type: String,
                default: 'add'
            },
            baseInfo: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            countryShelveMap: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        data() {
            return {
                titleTransLoading: false,
                subTitleTransLoading: false,
                countrys: [],
                radio: 1,
                productTypeList: [],
                supplierList: [],
                brandList: [],
                confirmVisible: false,
                confirmDialogTitle: '是否修改分类？',
                confirmDialogText: '修改分类当前页面数据不会被保留',
                ruleValidateInfo: {},
                ruleValidate: {
                    cateId: [{
                        required: true,
                        message: '请选择商品分类'
                    }],
                    productSaleCountry: [{
                        required: true,
                        message: '至少选择一个销售国家国家'
                    }],
                    productType: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择商品类型'
                    }],
                    brandId: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择品牌'
                    }],
                    nature: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择货物性质'
                    }],
                    supplierId: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择供应商'
                    }]
                },
                baseInfoResult: {},
                dataValid: false
            }
        },
        computed: {
            countryList() {
                let countryList = JSON.parse(this.getStore('countryList'))
                _.forEach(countryList, (item) => {
                    let saleCountry = {}
                    saleCountry.countryCode = item.shortCode
                    saleCountry.shelveStatus = null
                    saleCountry.show = false
                    // if (_.findIndex(this.countryShelveStatus, {countryCode: item.shortCode}) === -1) {
                    //     this.countryShelveStatus.push(saleCountry)
                    // }
                })
                return countryList
            },
            languageList() {
                return JSON.parse(this.getStore('languageList'))
            },
            baseInfoForm() {
                if (this.type === 'add') {
                    _.forEach(this.languageList, (item) => {
                        this.$set(this.baseInfo.title, item.code, '')
                        this.$set(this.baseInfo.subTitle, item.code, '')
                    })
                }
                return this.baseInfo
            },
            countryShelveMapStatus() {
                return this.countryShelveMap
            }
        },
        components: {
            ConfirmDialog
        },
        watch:{
            'baseInfoForm.title.cn': function (newValue, oldValue) {
                this.$emit('on-title-change', newValue)
            },
            'baseInfoForm.orgUrl': function (newValue, oldValue) {
                let url = this.handleOrgUrl(newValue)
                this.baseInfoForm.orgUrl = url
                this.$emit('on-orgurl-change', url)
            },
            'baseInfoForm.supplierId': function (newValue) {
                if (newValue) {
                    this.getSupplierList('', this.baseInfoForm.supplierId)
                }
            }
        },
        created() {
            if (this.type === 'check') {
                this.ruleValidateInfo = {}
            } else {
                this.ruleValidateInfo = this.ruleValidate
            }
            this.getBrandList()
            this.getProductTypeList()
            // this.getSupplierList()
        },
        mounted() {
        },
        methods: {
            modifyCategory() {
                this.confirmVisible = true
                if (this.type === 'edit' || this.type === 'check') {
                    this.confirmDialogText = ''
                }
            },
            cancleModify() {
                this.confirmVisible = false
            },
            confirmModify() {
                this.$emit('on-modify')
                if (this.type === 'add') {
                    this.$store.commit('SET_SALE_COUNTRY_LIST', []);
                }
            },
            /**
             * 获取供应商列表
            */
            getSupplierList(query, supplierId) {
                let params = {
                    supplierName: query,
                    supplierId: supplierId
                }
                supplierBasePage(this.filterData(params)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.supplierList = res.list
                    }
                })
            },
            /**
             * 销售国家切换
             */
            handleSaleCountryChange(data) {
                // TODO 切换增加二次确认
                console.log(this.countryShelve)
                console.log(data)
                let saleCountryList = []
                _.forEach(data, (item) => {
                    _.forEach(this.countryList, (country) => {
                        if (item === country.shortCode) {
                            saleCountryList.push(country)
                        }
                    })
                })

                _.forEach(this.countryShelveMap, (countryShelve, country) => {
                    if (_.includes(data, country)) {
                        this.countryShelveMapStatus[country].show = true
                    } else {
                        this.countryShelveMapStatus[country].show = false
                        this.countryShelveMapStatus[country].shelveStatus = null
                    }
                })
                this.$store.commit('SET_SALE_COUNTRY_LIST', saleCountryList);
            },
            handelCheckboxChange(data) {
                console.log(data)
            },
            /**
             * 获取商品类型
             */
            getBrandList() {
                let params = {
                    page: {
                        pageSize: 10000,
                        pageNum: 1
                    }
                }
                brandInfoGet(params).then((response) => {
                    let res = response
                    this.brandList = res.brandInfo
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 获取品牌类型列表
             */
            getProductTypeList() {
                let params = {}
                getProductEnumInfo(this.filterData(params)).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.productTypeList = response.productType
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            handleChangeBrand(data) {
                let brandInfo = {}
                _.forEach(this.brandList, (brand) => {
                    if (brand.brandId === data) {
                        brandInfo = brand
                    }
                })
                this.$emit('on-brand-change', brandInfo)
            },
            /**
             * 一键翻译
             */
            translate(originContent, item) {
                if (_.isEmpty(originContent)) {
                    this.$message.warning('请先填写中文内容')
                    return
                }

                if (item === 'title') {
                    this.titleTransLoading = true
                } else {
                    this.subTitleTransLoading = true
                }
                let result = {}
                let params = this.formatTranslateParam('cn', originContent)
                getOneKeyTranslation(this.filterData(params)).then((res) => {
                    let oneKeyTranslationUnit = res.oneKeyTranslationUnit
                    console.log(this.formatTranslateResult(oneKeyTranslationUnit))
                    result = this.formatTranslateResult(oneKeyTranslationUnit)
                    if (item === 'title') {
                        this.fillEmptyTitle(result)
                        this.titleTransLoading = false
                    }
                    if (item === 'subTitle') {
                        this.fillEmptySubTitle(result)
                        this.subTitleTransLoading = false
                    }
                })
            },
            formatTranslateParam(fromLanguageCode, originContent) {
                let result = {}
                let oneKeyTranslationUnitList = []
                let languageCodeList = []
                _.forEach(this.languageList, (item) => {
                    if (item.code !== 'cn') {
                        languageCodeList.push(item.code)
                    }
                })
                _.forEach(languageCodeList, (item) => {
                    let unit = {}
                    unit.fromLanguageCode = fromLanguageCode
                    unit.originContent = originContent
                    unit.toLanguageCode = item
                    oneKeyTranslationUnitList.push(unit)
                })
                console.log(oneKeyTranslationUnitList)
                result.oneKeyTranslationUnit = oneKeyTranslationUnitList
                return result
            },
            formatTranslateResult(result) {
                let translate = {}
                _.forEach(result, (item) => {
                    translate[item.toLanguageCode] = item.translation
                })
                return translate
            },
            fillEmptyTitle(result) {
                _.forEach(result, (value, key) => {
                   _.forEach(this.baseInfoForm.title, (titleValue, titleKey) => {
                       if(key === titleKey) {
                           this.$set(this.baseInfoForm.title, titleKey, value)
                       }
                   })
                })
            },
            fillEmptySubTitle(result) {
                _.forEach(result, (value, key) => {
                   _.forEach(this.baseInfoForm.subTitle, (titleValue, titleKey) => {
                       if(key === titleKey) {
                           this.$set(this.baseInfoForm.subTitle, titleKey, value)
                       }
                   })
                })
            },
            // 基本信息模块最终结构数据
            getBaseInfoData() {
                this.$refs.productBaseInfoForm.validate((valid) => {
                    if (valid) {
                        // 过滤未勾选国家
                        let selectedSaleCountry = []
                        _.forEach(this.countryShelveMapStatus, (countryShelve, key) => {
                            let selectedSaleCountryItem = {}
                            selectedSaleCountryItem.countryCode = key
                            selectedSaleCountryItem.shelveStatus = countryShelve.shelveStatus
                            if (countryShelve.show) {
                                selectedSaleCountry.push(selectedSaleCountryItem)
                            }
                        })
                        if (this.type != 'check') {
                            // 检查商品上下架状态
                            if (_.find(selectedSaleCountry, { 'shelveStatus': null }) ) {
                                this.$message.error('请设置商品上下架状态！')
                                return
                            }

                            if (this.baseInfoForm.title.cn === '') {
                                this.$message.error('商品标题中文不能为空！')
                                return
                            }
                            if (this.baseInfoForm.title.en === '') {
                                this.$message.error('商品标题英文不能为空！')
                                return
                            }
                        }
                        // 转换数据结构
                        let productTitleList = []
                        _.forEach(this.baseInfoForm.title, (value, key) => {
                            let nameAndCode = {}
                            nameAndCode.languageCode = key
                            nameAndCode.name = value
                            productTitleList.push(nameAndCode)
                        })

                        let productSubTitleList = []
                        _.forEach(this.baseInfoForm.subTitle, (value, key) => {
                            let nameAndCode = {}
                            nameAndCode.languageCode = key
                            nameAndCode.name = value
                            productSubTitleList.push(nameAndCode)
                        })

                        // 构造基本信息模块数据
                        let infoResult = {}
                        infoResult = _.pick(this.baseInfoForm, ['cateId', 'productType', 'brandId', 'nature', 'supplierId', 'orgUrl'])
                        infoResult.title = productTitleList
                        infoResult.subTitle = productSubTitleList
                        infoResult.saleCountry = selectedSaleCountry
                        this.baseInfoResult = infoResult
                        this.dataValid = true
                    }
                })
            },
            handleOrgUrl(url) {
                let index = url.indexOf('?')
                if (index > -1) {
                    url = url.substring(0, index)
                }
                return url
            }
        }
    }
</script>

<style lang="scss">
    .base-info-wrapper {
        .el-form-item__label {
            color: #333333;
        }
    }
</style>

<style lang="scss" scoped>
    .base-info-wrapper {
        width: 1000px;
        padding: 10px 30px;
        .tips {
            color: #7F7F7F;
        }
        .putaway {
            margin-left: 20px;
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
                padding: 0 10px;
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
