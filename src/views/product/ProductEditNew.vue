<template>
    <div class="app-container">
        <div v-if="step === 1">
            <back-category pageName="product" @on-category-link-change="onCategoryLinkChange" @onChangeType="changeType"></back-category>
            <div class="category-info" v-if="activeName=='1'">
                已选：<span>{{categoryLinkStr}}</span>
                <el-button :disabled="disabledStartCreate" type="primary" class="add-btn" @click="startCreat"> 开始创建 </el-button>
            </div>
        </div>
        <div v-if="step === 2" class="product-info" ref="productInfo">
            <!-- <el-card class="operate-btn"> -->
            <el-card class="operate-btn" :style="{width: operateAreaWidth + 'px'}">
                <el-button v-if="hasPermission('BTN_PRODUCT_EDIT') && editType != 'check'" type="primary" size="small" @click="submitProduct" :loading="submitLoading">保存</el-button>
                <el-button v-if="editType != 'check'" type="primary" plain size="small" @click="cancleSubmit">取消</el-button>
                <!-- <el-button type="primary" size="small">预览</el-button> -->
                <el-button v-if="editType === 'check' && hasPermission('BTN_PRODUCT_DRAFT_CHECK')" type="success" size="small" @click="submitCheckDraft" >审核通过</el-button>
                <el-button v-if="editType === 'check' && hasPermission('BTN_PRODUCT_DRAFT_CHECK') && draftStatus === 3" type="warning" size="small" @click="refuseCheckSupplierDraft" >审核不通过</el-button>
                <el-button v-if="editType === 'check' && hasPermission('BTN_PRODUCT_DRAFT_UPDATE') && draftStatus === ''" size="small" @click="updateDraftData" :loading="updateLoading">暂 存</el-button>
            </el-card>
            <el-card class="info-card" style="margin-top: 60px;">
                <div class='info-title'>基本信息</div>
                <product-base-info ref="productBaseInfo" :type="editType" :countryShelveMap="countryShelveMap" :baseInfo="baseInfo"
                    @on-brand-change="handleBrandChange"
                    @on-title-change="handleProductTitleChange"
                    @on-orgurl-change="handleOrgUrlChange"
                    @on-modify="handleModifyCategory">
                </product-base-info>
            </el-card>
            <el-card class="info-card">
                <div class='info-title'>商品参数</div>
                <product-params ref="productParams" :standardAttrs="standardAttrIdList" :type="editType" :productId="productId" :draftId="draftId" :productParams="productParams" :brandInfo="brandInfo" :paramAttrs="paramAttrIdList"></product-params>
            </el-card>
            <el-card class="info-card">
                <div class='info-title'>图片视频</div>
                <product-media ref="productMedia" :mediaInfo="mediaInfo" :videoInfo="videoInfo" :orgUrl="orgUrl"></product-media>
            </el-card>
            <el-card class="info-card">
                <div class='info-title'>服务承诺</div>
                <product-service-info ref="serviceInfo" :type="editType" :allServiceInfoItemForm="allServiceInfoItemForm"></product-service-info>
            </el-card>
            <el-card class="info-card">
                <div class='info-title'>规格属性</div>
                <product-standard-attr ref="standardAttr"
                    :editType="editType"
                    :productTitle="productTitle"
                    :selectedStandardModel="selectedStandardModel"
                    :standardAttrs="standardAttrIdList"
                    :attrValueModelList="attrValueModelList"
                    :supplyCurrencyObj="supplyCurrencyObj"
                    :allCountryTableDataModel="allCountryTableDataModel"
                    :categoryLink="categoryLink"
                    :category="baseInfo.cateId"
                    :productSourceInfo="productSourceInfo"
                    @on-get-media-data="handleGetMediaData">
                </product-standard-attr>
            </el-card>
        </div>
        <refuse-draft-dialog :dialogVisible="refuseDraftDialogVisible" @on-confirm="handleConfirmRefuse" @on-cancle="handleCancleRefuse"></refuse-draft-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import BackCategory from './BackCategory'
    import ProductBaseInfo from './components/ProductBaseInfo'
    import ProductParams from './components/ProductParams'
    import ProductMedia from './components/ProductMedia'
    import ProductServiceInfo from './components/ProductServiceInfo'
    import ProductStandardAttr from './components/ProductStandardAttr'
    import RefuseDraftDialog from './components/RefuseDraftDialog'

    // import axios from 'axios'
    import { uploadFileRequestByUrl } from '@/request/file'

    import {
        getCountryList,
        getLanguageList
    } from '@/request/i18n'
    import {
        getUpperRelatedCategoryById,
        productAttrGetByIdBatch,
        insertProduct,
        viewProductInfo,
        updateProduct,
        getDraftById,
        updateDraft,
        getSupplierDraftById,
        refuseSupplierDraft
    } from '@/request/product'

    export default {
        // 商品编辑
        name: 'ProductEdit',
        data() {
            return {
                activeName:'1',
                editType: 'add',
                checkPass: false,
                submitLoading: false,
                updateLoading: false,
                productId: '',
                step: 1, // 步骤 1：选择类目、2：商品编辑
                categoryLink: [],
                categoryLinkStr: '',
                disabledStartCreate: true, //开始创建按钮disabled状态
                countryList: [],
                languageList: [],
                baseInfo: {
                    cateId: null,
                    productSaleCountry: [],
                    productType: null,
                    brandId: null,
                    nature: null,
                    supplierId: null,
                    title: {},
                    subTitle: {},
                    orgUrl: '',
                    categoryLinkStr: ''
                },
                countryShelveMap: {}, //销售国家上下架状态
                brandInfo: {
                    nameCn: '-',
                    nameEn: '-'
                },
                productTitle: '',
                orgUrl: '',
                levelThreeCateId: null,
                paramAttrIdList: [],

                operateAreaWidth: 1400, //初始化宽度
                productParams: {
                    productType: {}
                },
                mediaInfo: {},
                videoInfo: {},
                allServiceInfoItemForm: {},
                selectedStandardModel: [], // 编辑时，商品已选择的规格
                standardAttrIdList: [], // 当前类目下的属性
                attrValueModelList: [], // 已选规格属性对应的属性值（二维数组）
                supplyCurrencyObj: {
                    'MY': null,
                    'TH': null,
                    'SG': null
                },
                allCountryTableDataModel: {}, // 全部国家SKU数据
                draftId: '',
                orgId: '',
                source: null,
                loading: false,
                // 商家平台上传的商品
                draftType: 0, // 1 新增 2编辑
                refuseDraftDialogVisible: false,
                draftStatus: '',
                productSourceInfo: {
                    source: '',
                    deliveryWay: ''
                }
            }
        },
        components: {
            BackCategory,
            ProductBaseInfo,
            ProductParams,
            ProductMedia,
            ProductServiceInfo,
            ProductStandardAttr,
            RefuseDraftDialog
        },
        computed: {
            // countryList() {
            //     return this.$store.state.dict.countryList
            // },
            saleCountryList() {
                
                let saleCountryList = this.$store.state.dict.saleCountryList
                
                return saleCountryList
            },
            // languageList() {
            //     return this.$store.state.dict.languageList
            // }
        },
        watch: {
            categoryLink: function(newValue, oldValue) {
                this.categoryLinkStr = []
                if (newValue.length === 3) {
                    this.disabledStartCreate = false
                } else {
                    this.disabledStartCreate = true
                }
                _.forEach(newValue, (item, index) => {
                    if (item.cateName) {
                        if (index === newValue.length - 1) {
                            this.categoryLinkStr += item.cateName
                        } else {
                            this.categoryLinkStr += item.cateName + ' >> '
                        }
                    }

                })
            },
            saleCountryList: function(newValue) {
                // 构造服务承诺数据结构
                _.forEach(newValue, country => {
                    let serviceItem = {
                        afterSalePledge: null,
                        arrivalPledge: null,
                        freightId: null,
                        freightType: 2 //运费（0：卖家承担 1:固定运费 2:运费模版）
                    }
                    if (!this.allServiceInfoItemForm[country.shortCode]) {
                        this.$set(this.allServiceInfoItemForm, country.shortCode,  _.cloneDeep(serviceItem))
                    }
                    console.log('运费模版',this.allServiceInfoItemForm)
                })
            }
        },
        created() {
            // this.$store.dispatch('getCountryList')
            // this.$store.dispatch('getLanguageList')
            this.languageList = JSON.parse(this.getStore('languageList'))
            this.countryList = JSON.parse(this.getStore('countryList'))
            this.initCountryShelveMap()
            this.initMediaData()
        },
        mounted() {
            window.addEventListener('resize', _.throttle(this.onResize, 100));
            // 判断是编辑还是新增
            if (this.$route.query.productId) {
                this.step = 2
                this.editType = 'edit'
                this.productId = this.$route.query.productId
                this.currentProductId = this.$route.query.productId
                this.getProductDetailById(this.productId)
                this.calculateWidth();
            } else if (this.$route.query.draftId){
                this.step = 2
                this.editType = 'check'
                this.draftId = this.$route.query.draftId
                if (this.$route.query.source === 'supplier') {
                    this.getSupplierProductDraftById(this.draftId)
                } else {
                    this.getProductDraftById(this.draftId)
                }
                this.calculateWidth();
            } else if (this.$route.query.copyId) {
                this.step = 2
                this.editType = 'copy'
                
                this.productId = this.$route.query.copyId
                this.currentProductId = this.$route.query.copyId
                this.getProductDetailById(this.productId)
                this.calculateWidth();
            } else {
                this.step = 1
                this.editType = 'add'
            }
        },
        methods: {
            changeType(data){
                this.activeName=data
            },
            initCountryShelveMap() {
                _.forEach(this.countryList, item => {
                    let shelveStatus = {
                        disabled: false,
                        show: false,
                        shelveStatus: null
                    }
                    this.$set(this.countryShelveMap, item.shortCode, shelveStatus)
                })
            },
            initMediaData() {
                // 初始化视频和图模块数据
                _.forEach(this.languageList, item => {
                    let video =  {
                        src: ''
                    }
                    let media = {
                        rotationPics: [], //商品主图（轮播图）
                        detailPics: [], //商品详情图
                        desc: ''
                    }
                    this.$set(this.mediaInfo, item.code, media)
                    this.$set(this.videoInfo, item.code, video)
                })
            },
            calculateWidth() {
                this.$nextTick(() => {
                    if (this.$refs.productInfo) {
                        this.operateAreaWidth = this.$refs.productInfo.clientWidth
                    }
                })
            },
            onResize() {
                this.calculateWidth();
            },
            startCreat() {
                this.step = 2
                this.baseInfo.categoryLinkStr = this.categoryLinkStr
                this.levelThreeCateId = this.categoryLink[2].cateId
                this.baseInfo.cateId = this.categoryLink[2].cateId
                this.getUpperRelatedCategoryById(this.levelThreeCateId)
                this.calculateWidth()
            },
            /**
             * 修改分类
            */
            handleModifyCategory() {
                this.step = 1
                if (this.editType === 'add') {
                    this.resetProductData()
                }
                console.log(this.baseInfo)
            },
            resetProductData() {
                // 初始化数据
                this.baseInfo = {
                    cateId: null,
                    productSaleCountry: [],
                    productType: null,
                    brandId: null,
                    nature: null,
                    supplierId: null,
                    title: {},
                    subTitle: {},
                    orgUrl: '',
                    categoryLinkStr: ''
                }
                this.initCountryShelveMap()
                this.brandInfo = {
                    nameCn: '-',
                    nameEn: '-'
                }
                this.paramAttrIdList = []
                this.productParams = {
                    productType: {}
                }
                this.mediaInfo = {}
                this.videoInfo = {}
                this.initMediaData()
                this.allServiceInfoItemForm = {}
                this.selectedStandardModel = []
            },
            handleBrandChange(brandInfo) {
                this.brandInfo = brandInfo
            },
            handleProductTitleChange (title) {
                this.productTitle = title
            },
            handleOrgUrlChange (orgUrl) {
                this.orgUrl = orgUrl
            },
            onCategoryLinkChange(categoryLink) {
                this.categoryLink = categoryLink
            },
            /**
             * 根据当前类目(3级)获取整个类目链路，根据链路获取全部参数属性和规格属性
            */
            getUpperRelatedCategoryById(cateId, productId = null, draftId = null) {
                let params = {
                    cateId: cateId,
                    productId: productId,
                    draftId: draftId
                }
                getUpperRelatedCategoryById(this.filterData(params)).then((response) => {
                    let paramAttrIdList = []
                    let standardAttrIdList = []
                    if (response.ret.errcode === 1) {

                        this.baseInfo.categoryLinkStr = this.productCateStr(response.categoryUnit)
                        _.forEach(response.categoryUnit, (item) => {
                            if (item.paramAttrId && item.paramAttrId !== '') {
                                paramAttrIdList.push(item.paramAttrId.split(','))
                            }
                            if (item.standardAttrId && item.standardAttrId !== '') {
                                standardAttrIdList.push(item.standardAttrId.split(','))
                            }
                        })
                        paramAttrIdList = _.uniq(_.flattenDeep(paramAttrIdList))
                        standardAttrIdList = _.uniq(_.flattenDeep(standardAttrIdList))
                        this.getBatchProductAttr(paramAttrIdList, standardAttrIdList)
                    }

                }).catch((err) => {
                    console.error(err)
                })
            },
            getBatchProductAttr(paramAttrIdList, standardAttrIdList) {
                let params = {
                    paramAttrId: paramAttrIdList,
                    standardAttrId: standardAttrIdList
                }
                productAttrGetByIdBatch(this.filterData(params)).then((response) => {
                    if (response.ret.errcode === 1) {
                        let paramAttr = response.paramAttr
                        let standardAttr = response.standardAttr
                        let paramAttrList = []
                        let standardAttrList = []
                        _.forEach(paramAttr, (item) => {
                            let attrItem = {}
                            attrItem.attrId = item.attrId
                            attrItem.customize = item.customize
                            _.forEach(item.attrName, (subItem, key) => {
                                attrItem[subItem.languageCode] = subItem.name
                            })
                            paramAttrList.push(attrItem)
                        })
                        this.paramAttrIdList = paramAttrList

                        _.forEach(standardAttr, (item) => {
                            let attrItem = {}
                            attrItem.attrId = item.attrId
                            attrItem.customize = item.customize
                            _.forEach(item.attrName, (subItem, key) => {
                                attrItem[subItem.languageCode] = subItem.name
                            })
                            standardAttrList.push(attrItem)
                        })
                        this.standardAttrIdList = standardAttrList
                    }

                })
            },
            submitProduct() {

                // 基本信息模块数据
                let baseInfo = null
                // 商品参数数据
                let attrValueInfo = null
                // 图片视频模块数据
                let allMediaInfo = null
                // 服务承诺模块数据
                let allServiceInfo = null
                // 规格属性模块数据
                let standardAttrInfo = null

                this.$refs.productBaseInfo.getBaseInfoData()
                if (this.$refs.productBaseInfo.dataValid) {
                    baseInfo = this.$refs.productBaseInfo.baseInfoResult
                } else {
                    return
                }

                this.$refs.productParams.getParamsData()
                attrValueInfo = this.$refs.productParams.attrValueInfo

                this.$refs.productMedia.getAllMediaFormData()
                if (this.$refs.productMedia.dataValid) {
                    allMediaInfo = this.$refs.productMedia.allMediaFormData
                } else {
                    return
                }

                this.$refs.serviceInfo.getAllServiceInfoData()
                if (this.$refs.serviceInfo.dataValid) {
                    allServiceInfo = this.$refs.serviceInfo.allServiceInfoData
                } else {
                    return
                }

                this.$refs.standardAttr.getSKUData()
                standardAttrInfo = this.$refs.standardAttr.standardAttrData

                if (this.productId != '') {
                    baseInfo.productId = this.productId
                }
                // console.log('baseInfo: ', baseInfo)
                // console.log('attrValueInfo: ',attrValueInfo)
                // console.log('allMediaInfo: ',allMediaInfo)
                // console.log('allServiceInfo: ',allServiceInfo)
                // console.log('standardAttrInfo: ',standardAttrInfo)

                // 当商品类型为批发商品（商品id为10），单品体积必填
                if (baseInfo.productType === 10) {
                    const specification = standardAttrInfo[0].skuBase.specification.split(",");
                    // 长宽高和体积其中一个为0，则中断提交，提示：批发商品必须填写好单品体积
                    if (specification.indexOf("0") >= 0) {
                        this.$message.error("批发商品必须填写好单品体积");
                        return;
                    }
                }

                if (baseInfo) {
                    this.formatProductData(baseInfo, attrValueInfo, allMediaInfo, allServiceInfo, standardAttrInfo)
                }

            },
            // 构造最终数据
            formatProductData(baseInfo, attrValueInfo, allMediaInfo, allServiceInfo, standardAttrInfo) {
                let productReq = {}
                if (this.productId && this.editType !== 'copy') {
                    productReq.productId = this.productId
                }
                productReq.cateId = baseInfo.cateId + ''
                productReq.saleCountry = baseInfo.saleCountry
                productReq.productType = baseInfo.productType
                productReq.nature = baseInfo.nature
                productReq.brandId = baseInfo.brandId
                productReq.supplierId = baseInfo.supplierId
                productReq.title = baseInfo.title
                productReq.subTitle = baseInfo.subTitle
                productReq.productParams = attrValueInfo
                if (this.editType !== 'copy') {
                    productReq.orgId = this.orgId
                    productReq.orgUrl = baseInfo.orgUrl
                }

                let productCountry = []

                _.forEach(this.saleCountryList, (country) => {
                    // 上下架状态
                    let shelveStatus = null
                    _.forEach(baseInfo.saleCountry, (shelve) => {
                        let productCountryItem = {}
                        productCountryItem.countryCode = shelve.countryCode
                        productCountryItem.shelveStatus = shelve.shelveStatus
                        _.forEach(allServiceInfo, (serviceInfo,key) => {
                            if(shelve.countryCode === key) {
                                productCountryItem.freightType = serviceInfo.freightType
                                if (serviceInfo.freightType === 2) {
                                    productCountryItem.freightId = serviceInfo.freightId
                                } else {
                                    productCountryItem.freightId = '0'
                                }
                            }
                        })
                        productCountry.push(productCountryItem)
                    })
                })
                let picAndVideoList = []
                _.forEach(allMediaInfo, (item, key) => {
                    let picAndVideoItem = {}

                    let rotationPicsList = []
                    _.forEach(item.rotationPics, (rotation) => {
                        rotationPicsList.push(rotation.originalLink)
                    })

                    let detailPicsList = []
                     _.forEach(item.detailPics, (detail) => {
                        detailPicsList.push(detail.originalLink)
                    })

                    picAndVideoItem.languageCode = key
                    picAndVideoItem.cover = rotationPicsList[0] //商品主图 rotation 第一张
                    picAndVideoItem.rotation = rotationPicsList.toString()
                    picAndVideoItem.video = item.video
                    picAndVideoItem.detail = detailPicsList.toString()
                    picAndVideoItem.form = detailPicsList.toString()
                    picAndVideoItem.desc = item.desc
                    picAndVideoList.push(picAndVideoItem)
                })

                let pledgeCountryInfoList = []
                _.forEach(allServiceInfo, (serviceInfo, key) => {
                    let pledgeCountryInfoItem = {}
                    pledgeCountryInfoItem.countryCode = key
                    pledgeCountryInfoItem.afterSalePledge = {
                        pledgeId: serviceInfo.afterSalePledge
                    }
                    pledgeCountryInfoItem.arrivalPledge = {
                        pledgeId: serviceInfo.arrivalPledge
                    }
                    pledgeCountryInfoList.push(pledgeCountryInfoItem)
                })
                productReq.productCountry = productCountry

                productReq.pledgeInfo = pledgeCountryInfoList

                productReq.sku = standardAttrInfo

                productReq.picVideo = picAndVideoList

                // console.log(productReq, '提交数据');

                if (this.editType === 'add' || this.editType === 'copy') {
                    this.addProduct(productReq)
                } else if (this.editType === 'edit') {
                    this.editProduct(productReq)
                } else if (this.editType === 'check') {
                    if (!this.checkPass) {
                        this.updateDraft(productReq)
                    } else {
                        this.handleDraftMediaData(productReq)
                        // this.addProduct(productReq)
                    }
                }
            },
            /**
             * 新增商品
            */
            addProduct(params) {
                this.submitLoading = true
                params.productCountry = this.objectArrReduce(params.productCountry)
                insertProduct(this.filterData(params)).then((response) => {
                    console.log(response)
                    this.submitLoading = false
                    if (response.ret.errcode === 1) {
                        this.$message.success('恭喜，商品创建成功！')
                        this.$router.push({
                            name: 'productListNew'
                        })
                    }
                }).catch((err) => {
                    this.submitLoading = false
                    console.log(err)
                })
            },
            /**
             * 编辑商品
            */
            editProduct(params) {
                this.submitLoading = true
                params.productCountry = this.objectArrReduce(params.productCountry)
                updateProduct(this.filterData(params)).then((response) => {
                    this.submitLoading = false
                    if (response.ret.errcode === 1) {
                        this.$message.success('恭喜，商品更新成功！')
                        this.$router.push({
                            name: 'productListNew'
                        })
                    }
                }).catch((err) => {
                    this.submitLoading = false
                    console.log(err)
                })
            },
            /**
             * 编辑时，根据商品id获取详细的商品信息
            */
            getProductDetailById(productId) {
                let params = {
                   productId: productId
                }
                viewProductInfo(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log('viewProductInfo', res)
                        // 回填基本信息
                        this.getUpperRelatedCategoryById(res.cateId, productId)
                        this.editBaseInfo(res)
                        this.editParamsInfo(res.productParams)
                        this.editMediaInfo(res.picVideo)
                        this.editService(res.pledgeInfo, res.productCountry)
                        this.editStandardAttr(res.skuBase, res.skuCountry)
                        this.orgId = res.orgId
                        this.productSourceInfo.source = res.source
                        if (res.deliveryWay) {
                            this.productSourceInfo.deliveryWay = res.deliveryWay
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            /**
             * 编辑时，根据商品id获取详细的商品信息
            */
            getProductDraftById(draftId) {
                let params = {
                   draftId: draftId
                }
                getDraftById(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log('getDraftById', res)
                        let draftUnit = res.draftUnit
                        this.source = draftUnit.source
                        this.orgId = draftUnit.orgId
                        // 回填基本信息
                        this.getUpperRelatedCategoryById(draftUnit.cateId, null, draftId)
                        this.editBaseInfo(draftUnit)
                        this.editParamsInfo(draftUnit.productParams)
                        this.editMediaInfo(draftUnit.picVideo)
                        this.editService(draftUnit.pledgeInfo, draftUnit.productCountry)
                        this.editStandardAttr(draftUnit.skuBase, draftUnit.skuCountry)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getSupplierProductDraftById(draftId) {
                let params = {
                   draftId: draftId
                }
                getSupplierDraftById(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log('getSupplierDraftById', res)

                        let draftUnit = res.draftUnit
                        this.draftType = draftUnit.draftType
                        this.draftStatus = draftUnit.draftStatus
                        this.source = draftUnit.source
                        this.orgId = draftUnit.orgId
                        // 回填基本信息
                        this.getUpperRelatedCategoryById(draftUnit.cateId, null, draftId)
                        this.editBaseInfo(draftUnit)
                        this.editParamsInfo(draftUnit.productParams)
                        this.editMediaInfo(draftUnit.picVideo)
                        this.editService(draftUnit.pledgeInfo, draftUnit.productCountry)
                        this.editStandardAttr(draftUnit.skuBase, draftUnit.skuCountry)
                        this.productSourceInfo.source = res.draftUnit.source
                        if (res.draftUnit.deliveryWay) {
                            this.productSourceInfo.deliveryWay = res.draftUnit.deliveryWay
                        }
                        if (draftUnit.productId) {
                            this.productId = draftUnit.productId
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 回填基本信息
            editBaseInfo(res) {
                console.log(111,res)
                let titleObj = {}
                _.forEach(res.title, (item) => {
                    this.$set(this.baseInfo.title, item.languageCode, item.name)
                })

                let subTitleObj = {}
                _.forEach(res.subTitle, (item) => {
                    this.$set(this.baseInfo.subTitle, item.languageCode, item.name)
                })
                // 补全其他语言数据
                _.forEach(this.languageList, language => {
                    if (!this.baseInfo.title.hasOwnProperty(language.code)){
                        this.$set(this.baseInfo.title, language.code, '')
                    }
                    if (!this.baseInfo.subTitle.hasOwnProperty(language.code)){
                        this.$set(this.baseInfo.subTitle, language.code, '')
                    }
                })
                let productSaleCountry = []
                let countryShelveStatus = []
                _.forEach(res.saleCountry, (item) => {
                    productSaleCountry.push(item.countryCode)
                    let shelveStatusItem = {}
                    shelveStatusItem.countryCode = item.countryCode
                    shelveStatusItem.shelveStatus = item.shelveStatus
                    shelveStatusItem.show = true
                    countryShelveStatus.push(shelveStatusItem)
                })

                _.forEach(res.saleCountry, (item) => {
                    let countryShelve = {
                        disabled: true,
                        show: true,
                        shelveStatus: item.shelveStatus
                    }
                    this.countryShelveMap[item.countryCode] = countryShelve
                })

                // 根据上架状态 设置销售国家
                let saleCountryList = []
                let saleCountryResultList = []
                _.forEach(this.countryShelveMap, (countryShelve, key) => {
                    if (countryShelve.show) {
                        saleCountryList.push(key)
                    }
                })
                _.forEach(saleCountryList, country => {
                    _.forEach(this.countryList, item => {
                        if(country === item.shortCode) {
                            saleCountryResultList.push(item)
                        }
                    })
                })
                this.$store.commit('SET_SALE_COUNTRY_LIST', saleCountryResultList);

                this.baseInfo.cateId = res.cateId
                this.baseInfo.productSaleCountry = productSaleCountry
                this.baseInfo.productType = res.productType ? res.productType : 0
                this.baseInfo.nature = res.nature
                this.baseInfo.orgUrl = res.orgUrl
                this.baseInfo.supplierId = res.supplierId
                if (res.brandInfo) {
                    this.baseInfo.brandId = res.brandInfo.brandId
                    this.brandInfo.nameCn = res.brandInfo.brandNameCn
                    this.brandInfo.nameEn = res.brandInfo.brandNameEn
                }
                console.log(this.baseInfo)
            },
            // 构造品类链
            productCateStr(cateList) {
                let categoryLinkStr = ''
                _.forEach(cateList, (item, index) => {
                    if (item.cateNameValue[0].name) {
                        if (index === cateList.length - 1) {
                            categoryLinkStr += item.cateNameValue[0].name
                        } else {
                            categoryLinkStr += item.cateNameValue[0].name + ' >> '
                        }
                    }
                })
                this.baseInfo.categoryLinkStr = categoryLinkStr
                return categoryLinkStr
            },
            // 编辑时回填参数
            editParamsInfo(productParams) {
                // productParams数据构造
                let keyList = []
                _.forEach(productParams, (item) => {
                    keyList.push(item.attrId)
                })
                let result = {}
                _.forEach(keyList, key => {
                    let values = []
                    _.forEach(productParams, params => {
                        if (key === params.attrId) {
                            values.push(params.valueId)
                        }
                    })
                    result[key] = values
                })
                _.forEach(result, (item, key) => {
                    this.$set(this.productParams.productType, key, item)
                })
                console.log('【this.productParams】',this.productParams)
            },
            // 编辑时回填 视频图片
            editMediaInfo (mediaInfo) {
                // this.mediaInfo = mediaInfo
                let mediaInfoObj = {}
                let videoInfoObj = {}
                _.forEach(this.languageList, language => {
                    let languageCode = language.code
                    let mediaFilterItem
                    // 防止新增语言类型，旧数据为空出错
                    if ( _.findIndex(mediaInfo, { 'languageCode': languageCode }) > -1){
                        mediaFilterItem = _.find(mediaInfo, { 'languageCode': languageCode })
                    } else {
                        mediaFilterItem = {
                            cover: '',
                            detail: '',
                            form: '',
                            languageCode: languageCode,
                            rotation: ''
                        }
                    }

                    let mediaItem = {}
                    let rotationList = []
                    if (mediaFilterItem.rotation != '') {
                        rotationList = mediaFilterItem.rotation.split(',')
                    }
                    let rotationFormatList = []
                    _.forEach(rotationList, (rotation, index) => {
                        let rotationObj = {}
                        rotationObj.id = index
                        rotationObj.originalLink = rotation
                        if (rotation.indexOf('http') === -1) {
                            rotationObj.src = this.dealShowFileSrc(rotation)
                        } else {
                            rotationObj.src = rotation
                        }
                        rotationFormatList.push(rotationObj)
                    })

                    let detailList = []
                    if (mediaFilterItem.detail) {
                       detailList = mediaFilterItem.detail.split(',')
                    }

                    let detailFormatList = []
                    if (detailList[0] != '' && detailList.length > 0){
                        _.forEach(detailList, (detail, index) => {
                            let detailObj = {}
                            detailObj.id = index
                            detailObj.originalLink = detail
                            if (detail.indexOf('http') === -1) {
                                detailObj.src = this.dealShowFileSrc(detail)
                            } else {
                                detailObj.src = detail
                            }
                            detailFormatList.push(detailObj)
                        })
                    }
                    mediaItem.detailPics = detailFormatList
                    mediaItem.rotationPics = rotationFormatList
                    mediaItem.desc = mediaFilterItem.desc
                    mediaInfoObj[languageCode] = mediaItem

                    let videoFilterItem = {}
                    if (mediaFilterItem.video) {
                        if (mediaFilterItem.video.indexOf('http') === -1) {
                            videoFilterItem.src = this.dealShowFileSrc(mediaFilterItem.video)
                        } else {
                            videoFilterItem.src = mediaFilterItem.video
                        }
                        videoFilterItem.originalLink = mediaFilterItem.video
                    } else {
                        videoFilterItem.src = ''
                        videoFilterItem.originalLink = ''
                    }

                    videoInfoObj[languageCode] = videoFilterItem
                })

                this.mediaInfo = mediaInfoObj
                this.videoInfo = videoInfoObj
            },
            editService(pledgeInfo, productCountry) {
                _.forEach(this.saleCountryList, country => {
                    let serviceItem = {
                        afterSalePledge: null,
                        arrivalPledge: null,
                        freightId: null,
                        freightType: null
                    }
                    _.forEach(pledgeInfo, (item) => {
                        if (item.countryCode === country.shortCode) {
                            serviceItem.afterSalePledge = item.afterSalePledge.pledgeId
                            if (item.arrivalPledge) {
                                serviceItem.arrivalPledge = item.arrivalPledge.pledgeId
                            }
                        }
                    })
                    _.forEach(productCountry, (item) => {
                        if (item.countryCode === country.shortCode) {
                            if (item.freightId === '0') {
                                serviceItem.freightId = null
                            } else {
                                serviceItem.freightId = item.freightId
                            }
                            serviceItem.freightType = item.freightType
                        }
                    })

                    console.log(this.allServiceInfoItemForm)
                    // if (!this.allServiceInfoItemForm[country.shortCode]) {
                        this.$set(this.allServiceInfoItemForm, country.shortCode,  _.cloneDeep(serviceItem))
                    // }
                })
            },
            // 编辑时回填规格属性
            editStandardAttr (skuBase, skuCountry) {
                let attrId = []
                _.forEach(skuBase[0].skuAttrValue, item => {
                    attrId.push(item.attrId)
                    let saleSpecType = {}
                    saleSpecType.attrId = item.attrId
                    saleSpecType.cn = item.attrName
                    saleSpecType.customize = item.customize
                    this.selectedStandardModel.push(saleSpecType)
                    console.log(this.selectedStandardModel)
                })
                // 获取全部规格
                let allSkuAttrValue = []
                _.forEach(skuBase, base => {
                    allSkuAttrValue = _.concat(allSkuAttrValue, base.skuAttrValue)
                })

                _.forEach(this.selectedStandardModel, (item, index) => {
                    let attrValue = []
                    let skuAttrList = []
                    _.forEach(allSkuAttrValue, skuAttr => {
                        if(item.attrId === skuAttr.attrId) {
                            skuAttrList.push(skuAttr)
                        }
                    })
                    // 对属性值根据sort值重新排序
                    let sortSkuAttrList = _.sortBy(skuAttrList, function(item) {
                        return item.sort
                    })
                    _.forEach(sortSkuAttrList, skuAttr => {
                        attrValue.push(skuAttr.valueId)
                    })
                    this.$set(this.attrValueModelList, index, _.uniq(attrValue))
                })

                let allCountryTableData = {}
                let tableData = []
                _.forEach(skuBase, base => {
                    let skuItem = {}
                    skuItem.skuCode = base.skuCode
                    skuItem.skuId = base.skuId
                    skuItem.weight = base.weight/1000
                    skuItem.qrCode = base.qrCode
                    skuItem.currencyCode = base.currencyCode
                    _.forEach(this.supplyCurrencyObj, (value, key) => {
                        this.$set(this.supplyCurrencyObj, key, base.currencyCode)
                    })
                    skuItem.boxSpecification = this.convertSpecificationData(base.boxSpecification)
                    skuItem.specification = this.convertSpecificationData(base.specification)
                    skuItem.supplierCode = base.supplierCode
                    skuItem.supplyPrice = base.supplyPrice
                    if (base.supplierSkuId) {
                        skuItem.supplierSkuId = base.supplierSkuId
                    }
                    if(this.editType=='check'){
                        skuItem.inventory = base.inventory
                    }else{
                        if (base.inventory) {
                            skuItem.inventory = base.inventory
                        }
                    }
                    // 构造销售规格数据
                    let sepcData = this.createSkuSpecData(base.skuAttrValue)
                    skuItem = Object.assign(skuItem, sepcData)
                    tableData.push(skuItem)
                })

                 _.forEach(this.saleCountryList, country => {
                    let countrySku = _.filter(skuCountry, { countryCode: country.shortCode});
                    allCountryTableData[country.shortCode] = countrySku
                })

                _.forEach(allCountryTableData, (countryTable, country) => {
                    _.forEach(countryTable, row => {
                        let baseData = _.find(tableData, { 'skuId': row.skuId});
                        row = Object.assign(row, baseData)
                    })
                })

                this.allCountryTableDataModel = allCountryTableData

                console.log('selectedStandardModel: ' , this.selectedStandardModel)
                console.log('standardAttrIdList: ' , this.standardAttrIdList)
                console.log('attrValueModelList: ' , this.attrValueModelList)
                console.log('allCountryTableDataModel: ' , this.allCountryTableDataModel)
            },
            /*
            * 转换长宽高体积数据
            */
            convertSpecificationData(specification) {
                let specArr = specification.split(',');
                return {l: specArr[0], w: specArr[1], h: specArr[2], v: specArr[3]}
            },
            createSkuSpecData(skuAttrValue) {
                let specData = {}
                _.forEach(skuAttrValue, item => {
                    specData[item.attrId] = item.valueName
                    specData[item.attrId+'_value'] = item.valueId
                })
                return specData
            },
            cancleSubmit() {
                this.$router.push({
                    name: 'productListNew'
                })
            },
            submitCheckDraft() {
                this.checkPass = true
                this.submitProduct()
            },
            updateDraftData() {
                this.checkPass = false
                // 基本信息模块数据
                let baseInfo = null
                // 商品参数数据
                let attrValueInfo = null
                // 图片视频模块数据
                let allMediaInfo = null
                // 服务承诺模块数据
                let allServiceInfo = null
                // 规格属性模块数据
                let standardAttrInfo = null
                this.$refs.productBaseInfo.getBaseInfoData()
                baseInfo = this.$refs.productBaseInfo.baseInfoResult

                this.$refs.productParams.getParamsData()
                attrValueInfo = this.$refs.productParams.attrValueInfo

                this.$refs.productMedia.getAllMediaFormData()
                allMediaInfo = this.$refs.productMedia.allMediaFormData

                this.$refs.serviceInfo.getAllServiceInfoData()
                allServiceInfo = this.$refs.serviceInfo.allServiceInfoData

                this.$refs.standardAttr.getSKUData()
                standardAttrInfo = this.$refs.standardAttr.standardAttrData

                // console.log('baseInfo: ', baseInfo)
                // console.log('attrValueInfo: ',attrValueInfo)
                // console.log('allMediaInfo: ',allMediaInfo)
                // console.log('allServiceInfo: ',allServiceInfo)
                // console.log('standardAttrInfo: ',standardAttrInfo)

                this.formatProductData(baseInfo, attrValueInfo, allMediaInfo, allServiceInfo, standardAttrInfo)
            },
            /**
             * 编辑草稿
            */
            updateDraft(data) {
                this.updateLoading = true
                let params = {
                    draftId: this.draftId,
                    updateDraftUnit: data
                }
                updateDraft(this.filterData(params)).then((response) => {
                    console.log(response)
                    this.updateLoading = false
                    if (response.ret.errcode === 1) {
                        this.$message.success('恭喜，商品草稿更新成功！')
                        this.$router.push({
                            name: 'productCheck'
                        })
                    }
                }).catch((err) => {
                    this.updateLoading = false
                    console.log(err)
                })
            },
            handleDraftMediaData(productData) {
                console.log(productData)
                productData.source = this.source
                productData.orgId = this.orgId
                productData.draftId = this.draftId
                this.submitLoading = true
                let self = this
                let picVideo = productData.picVideo[0]

                let rotation = picVideo.rotation.split(',')
                let detail = picVideo.detail.split(',')
                let video = ''
                let sku = productData.sku

                if (_.startsWith(picVideo.video, 'http')) {
                    video = picVideo.video
                } else {
                    video = this.dealShowFileSrc(picVideo.video)
                }

                // 对商品必填字段进行校验
                if (!this.verifyDriftData(productData)) {
                    self.submitLoading = false
                    return
                }

                let rotationList = []
                let detailList = []
                let videoStr = ''

                let rotationListParmas = []
                _.forEach(rotation, (item) => {
                    let paramsItem = {
                        type: 'product'
                    }
                    paramsItem.fileName = this.getFileNameByUrl(item)
                    if (_.startsWith(item, 'http')) {
                        paramsItem.url = item
                    } else {
                        paramsItem.url = this.dealShowFileSrc(item)
                    }

                    rotationListParmas.push(paramsItem)
                })

                let detailListParmas = []
                _.forEach(detail, (item) => {
                    let paramsItem = {
                        type: 'product'
                    }
                    paramsItem.fileName = this.getFileNameByUrl(item)
                    if (_.startsWith(item, 'http')) {
                        paramsItem.url = item
                    } else {
                        paramsItem.url = this.dealShowFileSrc(item)
                    }
                    if (paramsItem.url != '') {
                        detailListParmas.push(paramsItem)
                    }
                })

                let skuCoverListParmas = []
                let skuCoverList = []
                _.forEach(sku, (item) => {
                    _.forEach(item.skuCountry, (skuCountry) => {
                        skuCoverList.push(skuCountry.cover)
                    })

                })
                _.forEach(_.uniq(skuCoverList), (item) => {
                    let paramsItem = {
                        type: 'product'
                    }
                    paramsItem.fileName = this.getFileNameByUrl(item)
                     if (_.startsWith(item, 'http')) {
                        paramsItem.url = item
                    } else {
                        paramsItem.url = this.dealShowFileSrc(item)
                    }
                    skuCoverListParmas.push(paramsItem)
                })
                axios.all([ this.uploadVideo(video), this.uploadImg(rotationListParmas, 'rotation'), this.uploadImg(detailListParmas, 'detail'), this.uploadImg(skuCoverListParmas, 'skuCover')])
                    .then(axios.spread(function ( video, rotation, detail, skuCover) {
                        if (video.status === '600') {
                            videoStr = video.original_link
                        } else {
                            videoStr = ''
                        }
                        if (rotation.status === '600') {
                            let resultMap = rotation.resultMap
                            let resultList = []
                            _.forEach(rotationListParmas, rotation => {
                                if (resultMap[rotation.url]) {
                                    resultList.push(resultMap[rotation.url].original_link)
                                }
                            })
                            rotationList = resultList
                        }
                        if (detail.status === '600') {
                            let resultMap = detail.resultMap
                            let resultList = []
                            _.forEach(detailListParmas, detail => {
                                if (resultMap[detail.url]) {
                                    resultList.push(resultMap[detail.url].original_link)
                                }
                            })
                            detailList = resultList
                        }

                        if (skuCover.status === '600') {
                            let resultMap = skuCover.resultMap
                            _.forEach(resultMap, (value, key) => {
                                _.forEach(sku, item => {
                                    _.forEach(item.skuCountry, skuCountry => {
                                        if (skuCountry.cover === key) {
                                            skuCountry.cover = value.original_link
                                        }
                                    })
                                })
                            })
                        }
                        _.forEach(productData.picVideo, media => {
                            media.cover = rotationList[0]
                            media.rotation = rotationList.join(',')
                            media.detail = detailList.join(',')
                            media.form = detailList.join(',')
                            media.video = videoStr
                        })
                        if (self.$route.query.source === 'supplier') {
                            if (self.draftType === 1) {
                                self.addProduct(productData)
                            } else if (self.draftType === 2) {
                                self.editProduct(productData)
                            }
                        } else {
                            self.addProduct(productData)
                        }
                }));
            },
            uploadImg(fileList, type) {
                if (fileList.length < 0) {
                    return
                }
                let params = new FormData();
                params.append('urlParam', JSON.stringify(fileList));
                let url = '/file/rest/uploadservices/uploadfileByUrlBatch'
                return uploadFileRequestByUrl(url, params)
            },
            uploadVideo(file) {
                let fileName = this.getFileNameByUrl(file)
                let params = new FormData();
                let fileInfo = {
                    fileName: fileName,
                    type: 'video'
                }
                params.append('url',file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfileByUrl'
                return uploadFileRequestByUrl(url, params)
            },
            getFileNameByUrl(url) {
                let fileName = ''
                let index = url.lastIndexOf('/')
                if (index > 0) {
                    fileName = url.substring(index+1, url.length)
                }
                return fileName
            },
            /**
             * 校验草稿数据（检查必填字段）
            */
            verifyDriftData(driftData) {
                let warningText = []
                if (driftData.productType === '') {
                    warningText.push('请选择商品类型')
                }
                if (driftData.brandId === '') {
                    warningText.push('请选择商品品牌')
                }
                if (driftData.supplierId === '') {
                    warningText.push('请选择供应商')
                }
                _.forEach(driftData.title, title => {
                    if (title.languageCode === 'cn' && title.name === '') {
                        warningText.push('商品中文标题不能为空')
                    }
                    if (title.languageCode === 'en' && title.name === '') {
                        warningText.push('商品英文标题不能为空')
                    }
                })
                _.forEach(driftData.picVideo, picVideo => {
                    if (picVideo.languageCode === 'cn') {
                        if (picVideo.rotation.split(',').length < 3) {
                            warningText.push('商品中文商品主图不能少于3张')
                        }
                    }
                    if (picVideo.languageCode === 'en') {
                        if (picVideo.rotation.split(',').length < 3) {
                            warningText.push('商品英文商品主图不能少于3张')
                        }
                    }
                })

                _.forEach(driftData.pledgeInfo, pledge => {
                    if (pledge.afterSalePledge.pledgeId === null || pledge.afterSalePledge.pledgeId === '') {
                        warningText.push(pledge.countryCode + '售后政策不能为空')
                    }
                })
                if (warningText.length > 0) {
                    this.$message({
                        type: 'warning',
                        duration: 5000,
                        dangerouslyUseHTMLString: true,
                        message: warningText.join('<br>')
                    });
                }

                return warningText.length > 0 ? false : true
            },
            objectArrReduce(arr) {
                let result  = []
                let  obj = {};
				for (let i = 0; i < arr.length; i ++) {
					if(!obj[arr[i].countryCode]){
						result.push(arr[i]);
						obj[arr[i].countryCode] = true;
					}
                }
                return result
            },
            handleGetMediaData() {
                this.$refs.productMedia.getAllMediaFormData()
            },
            getcategoryLink () {
                console.log(this.baseInfo)
            },
            refuseCheckSupplierDraft() {
                this.refuseDraftDialogVisible = true
            },
            handleConfirmRefuse(data) {
                console.log(data)
                let params = {
                    draftId: this.draftId,
                    message: data.message
                }
                refuseSupplierDraft(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.refuseDraftDialogVisible = false
                        this.$message.success('操作成功！')
                        this.$router.push({
                            name: 'productCheck'
                        })
                    }
                })
            },
            handleCancleRefuse() {
                this.refuseDraftDialogVisible = false
            }
        },
        beforeDestroy() {
            this.$EventBus.$off("queryTableData");
        }
    }
</script>

<style lang="scss">
    .operate-btn {
        position: fixed;
        z-index: 99;
        text-align: right;
        .el-card__body {
            padding: 10px;
        }
    }
    .info-card {
        .el-card__body {
            padding: 6px 0;
        }
    }
</style>

<style lang="scss" scoped>
    .category-info {
        width: 1000px;
        margin: 0 auto;
        margin-top: 30px;
        span {
            color: #409EFF;
        }
        .add-btn {
            float: right;
            width: 200px;
        }
    }
    .operate-btn {
        text-align: right;
        .el-card__body {
            padding: 10px;
        }
    }
    .info-card {
        margin-top: 12px;
        .info-title {
            border-left: 4px solid #409EFF;
            height: 28px;
            line-height: 28px;
            padding-left: 10px;
            color: #686868;
        }
    }
    .batch-operation {
        width: 1000px;
        display: flex;
        justify-content: flex-end;
    }

</style>
