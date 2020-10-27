<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="productFilterForm" inline label-width="90px" :model="queryData">
                <el-form-item label="商品：" class="filter-item" prop="type">
                    <el-select v-model="queryData.type" filterable clearable style="width: 110px" size="medium" placeholder="选择类型">
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="queryData.value" style="width: 200px; margin-right: 20px;" size="medium" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="上架状态：" class="filter-item" prop="shelveStatus">
                    <el-select v-model="queryData.shelveStatus" size="medium" style="width: 110px;">
                        <el-option v-for="(item, index) in shelveStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售国家：" class="filter-item" prop="countryCode">
                    <el-select v-model="queryData.countryCode" size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="前台类目：" class="filter-item" prop="frontCate">
                        <el-cascader style="width: 280px"
                            clearable
                            filterable
                            :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getFrontSubCategory}"
                            placeholder="请选择商品前台分组"
                            :options="frontCategoryOptions"
                            @change="setFrontCateId"
                            v-model="queryData.frontCate"
                            class="normalOperatorBox"
                            size="medium">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="后台类目：" class="filter-item" prop="backCate">
                        <el-cascader  style="width: 300px"
                            clearable
                            filterable
                            :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true}"
                            placeholder="请选择商品后台分组"
                            :options="backCategoryOptions"
                            v-model="queryData.backCate"
                            @change="setBackCateId"
                            class="normalOperatorBox"
                            size="medium">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="销售方式：" class="filter-item" prop="saleWay">
                        <el-select v-model="queryData.saleWay" size="medium">
                            <el-option v-for="(item, index) in saleWayList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品类型：" class="filter-item" prop="productType">
                        <el-select v-model="queryData.productType" size="medium">
                            <el-option v-for="(item, index) in productTypeList" :key="index" :label="item.name" :value="item.productType"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应商：" class="filter-item" prop="supplierId">
                        <el-select v-model="queryData.supplierId" size="medium" :remote-method="getSupplierList" filterable clearable remote reserve-keyword>
                            <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品来源：" class="filter-item" prop="sourceKey">
                        <el-select v-model="queryData.sourceKey" size="medium">
                            <el-option v-for="(item, index) in sourceOption" :key="index" :label="item.name" :value="item.source"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="原始链接：" class="filter-item" prop="productUrl">
                        <el-input v-model="queryData.productUrl" clearable size="medium" placeholder="请输入原始链接"></el-input>
                    </el-form-item>
                    <el-form-item label="时间查询：" class="filter-item" prop="timeList">
                        <el-select v-model="queryData.timeType" filterable clearable style="width: 110px" size="medium" placeholder="选择类型">
                            <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-date-picker v-model="queryData.timeList"
                            size="medium"
                            type="daterange"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
            <div class="operate-container">
                <el-button v-if="hasPermission('BTN_PRODUCT_ADD')" type="primary" size="medium" icon="el-icon-plus" @click="addProduct">新增商品</el-button>
                <el-button v-if="hasPermission('BTN_PRODUCT_EXPORT')" plain type="primary" size="medium" icon="el-icon-download" style="float: right;" @click="downloadProduct">导出</el-button>
                <!-- <el-button type="primary" size="medium" icon="el-icon-edit-outline" style="float: right;">批量编辑</el-button> -->
                <el-button type="primary" size="medium" icon="el-icon-setting" style="float: right;" @click="listSetting">列表设置</el-button>
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="productTableList" v-loading="loading" border fit highlight-current-row height="100%" style="width: 100%">
                <el-table-column v-for="col in tableCols" :prop="col.value" :min-width="col.minWidth" align="center" :key="col.value" :label="col.lable">
                    <template slot-scope="scope" >
                        <div v-if="col.value === 'productId'">
                            {{scope.row.productId}}
                        </div>
                        <div class="flex flex-item--center" v-if="col.value === 'title'">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                              <img :src="scope.row.spuCover" class="previewImage">
                              <img :src="scope.row.spuMiniCover" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.title}}
                                </span>
                            </el-tooltip>
                        </div>
                        <div v-if="col.value === 'orgUrl'">
                            <el-tooltip v-if="scope.row.orgUrl" class="item" effect="dark" :content="scope.row.orgUrl" placement="top">
                                <a :href="scope.row.orgUrl" target="_blank" style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:150px;">{{ scope.row.orgUrl}}</a>
                            </el-tooltip>
                            <span v-else>-</span>
                        </div>
                        <div v-if="col.value === 'backCategory'">
                            {{scope.row.backCategory || '-'}}
                        </div>
                        <div v-if="col.value === 'frontCategory'">
                            <el-tooltip v-if="scope.row.frontCategory" class="item" effect="dark" :content="scope.row.frontCategory" placement="top">
                                <span style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.frontCategory}}
                                </span>
                            </el-tooltip>
                            <span v-else>-</span>
                        </div>
                        <div v-if="col.value === 'saleCountry'">
                            {{scope.row.saleCountry || '-'}}
                        </div>
                        <div v-if="col.value === 'shelveStatusMY'">
                            <el-tag v-if="scope.row.shelveStatusCodeMY === 1" type="success" plain size="mini">上架</el-tag>
                            <el-tag v-if="scope.row.shelveStatusCodeMY === 2" type="danger" plain size="mini">下架</el-tag>
                        </div>
                        <div v-if="col.value === 'shelveStatusTH'">
                            <el-tag v-if="scope.row.shelveStatusCodeTH === 1" type="success" plain size="mini">上架</el-tag>
                            <el-tag v-if="scope.row.shelveStatusCodeTH === 2" type="danger" plain size="mini">下架</el-tag>
                        </div>
                        <div v-if="col.value === 'shelveStatusSG'">
                            <el-tag v-if="scope.row.shelveStatusCodeSG === 1" type="success" plain size="mini">上架</el-tag>
                            <el-tag v-if="scope.row.shelveStatusCodeSG === 2" type="danger" plain size="mini">下架</el-tag>
                        </div>
                        <div v-if="col.value === 'priceMY'">
                            {{scope.row.priceMY || '-'}}
                        </div>
                        <div v-if="col.value === 'priceTH'">
                            {{scope.row.priceTH || '-'}}
                        </div>
                        <div v-if="col.value === 'priceSG'">
                            {{scope.row.priceSG || '-'}}
                        </div>
                        <div v-if="col.value === 'priceVipMY'">
                            {{scope.row.priceVipMY || '-'}}
                        </div>
                        <div v-if="col.value === 'priceVipTH'">
                            {{scope.row.priceVipTH || '-'}}
                        </div>
                        <div v-if="col.value === 'priceVipSG'">
                            {{scope.row.priceVipSG || '-'}}
                        </div>
                        <div v-if="col.value === 'commissionMY'">
                            {{scope.row.commissionMY || '-'}}
                        </div>
                        <div v-if="col.value === 'commissionTH'">
                            {{scope.row.commissionTH || '-'}}
                        </div>
                        <div v-if="col.value === 'commissionSG'">
                            {{scope.row.commissionSG || '-'}}
                        </div>
                        <div v-if="col.value === 'sales'">
                            {{scope.row.sales || '-'}}
                        </div>
                        <div v-if="col.value === 'brand'">
                            {{scope.row.brand || '-'}}
                        </div>
                        <div v-if="col.value === 'supplier'">
                            {{scope.row.supplier || '-'}}
                        </div>
                        <div v-if="col.value === 'createTime'">
                            {{scope.row.createTime | secondTimeFormat}}
                        </div>
                        <div v-if="col.value === 'updateTime'">
                            {{scope.row.updateTime | secondTimeFormat}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  fixed="right" label="操作" align="center" width="160px">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="modifyProduct(scope.row.productId)">查看</el-button>
                        <el-button v-if="hasPermission('BTN_PRODUCT_ADD')" type="text" size="mini" @click="copyProduct(scope.row.productId)">复制</el-button>
                        <el-button v-if="hasPermission('BTN_PRODUCT_EDIT')"  type="text" size="mini" @click="modifyProduct(scope.row.productId)">编辑</el-button>
                        <el-button v-if="hasPermission('BTN_PRODUCT_DELETE')" type="text" size="mini" @click="delProduct(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <product-list-setting :dialogVisible="settingVisible" :setting="settingModel" @on-cancle="settingVisible=false" @on-confirm="handleOnSettingConfirm"></product-list-setting>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleDel" @on-confirm="confirmDelProduct"></confirm-dialog>
    </div>
</template>

<script>
    import { listProduct, viewProductInfo, disableProduct, getProductTypeList, productExport, categoryListGet, getProductEnumInfo } from '@/request/product'
    import { getCountryList, getLanguageList } from '@/request/i18n'
    import { supplierBasePage } from '@/request/supplier'
    import ProductListSetting from './components/ProductListSetting'
    import ConfirmDialog from '@/components/ConfirmDialog'
    const defaultFormThead = ['商品ID', '商品信息', 'banana']
    import PageSearchStatus from '@/mixins/PageSearchStatus';
    export default {
        name: 'ProductList',
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                total: 0,
                page: 1,
                pageSize: 10,
                visible: false,
                productId: '',
                confirmVisible: false,
                confirmDialogTitle: '是否确定删除商品？',
                confirmDialogText: '',
                frontCategoryOptions: [],
                backCategoryOptions: [],
                typeList: [{
                    label: '商品ID',
                    value: '1'
                }, {
                    label: 'skuId',
                    value: '2'
                }, {
                    label: 'skuCode',
                    value: '3'
                }, {
                    label: '商品名称',
                    value: '4'
                }],
                shelveStatusList: [{
                    label: '上架',
                    value: 1
                },
                {
                    label: '下架',
                    value: 2
                }],
                productTypeList: [],
                timeTypeList: [{
                    label: '创建时间',
                    value: 1
                },
                {
                    label: '更新时间',
                    value: 2
                }],
                saleWayList: [{
                    label: '售完即止',
                    value: 1
                }, {
                    label: '边售边采',
                    value: 2
                }],
                productTypeList: [],
                frontCategoryList: [],
                backCategoryList: [],
                sourceOption: [],
                supplierList: [],
                queryData: {
                    type: '',
                    value: '',
                    titleKey: '',
                    productIdKey: '',
                    standardIdKey: '',
                    skuIdKey: '',
                    skuCodeKey: '',
                    shelveStatus: null,
                    frontCate: '',
                    frontCateId: '',
                    backCate: '',
                    backCateId: '',
                    countryCode: '',
                    saleWay: null,
                    productType: null,
                    timeType: null,
                    sourceKey: null,
                    timeList: [],
                    startTime: '',
                    endTime: '',
                    supplierId: '',
                    productUrl: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                settingVisible: false,
                productTableList: [],
                // 列表项初始化信息
                settingModel: {
                    checkedCountry: [ 'MY'],
                    checkedItem: ['商品ID', '商品信息', '原始链接', '后台类目', '销售国家', '上架状态', '划线价', 'VIP价', '累计销量']
                },
                allCols: [
                    {
                        lable: '商品ID',
                        name: '商品ID',
                        value: 'productId',
                        minWidth: 180,
                        disabled: true
                    },
                    {
                        lable: '商品信息',
                        name: '商品信息',
                        value: 'title',
                        minWidth: 250,
                        disabled: true

                    }, {
                        lable: '原始链接',
                        name: '原始链接',
                        value: 'orgUrl',
                        minWidth: 180,
                        disabled: false
                    }, {
                        lable: '后台类目',
                        name: '后台类目',
                        value: 'backCategory',
                        minWidth: 180,
                        disabled: false
                    }, {
                        lable: '前台类目',
                        name: '前台类目',
                        value: 'frontCategory',
                        minWidth: 180,
                        disabled: false
                    }, {
                        lable: '销售国家',
                        name: '销售国家',
                        value: 'saleCountry',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '上架状态(MY)',
                        name: '上架状态',
                        value: 'shelveStatusMY',
                        shortCode: 'MY',
                        minWidth: 120,
                        disabled: false
                    }, {
                        lable: '划线价(MY)',
                        name: '划线价',
                        value: 'priceMY',
                        shortCode: 'MY',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: 'VIP价(MY)',
                        name: 'VIP价',
                        value: 'priceVipMY',
                        shortCode: 'MY',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: '佣金率(MY)',
                        name: '佣金率',
                        value: 'commissionMY',
                        shortCode: 'MY',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: '上架状态(TH)',
                        name: '上架状态',
                        value: 'shelveStatusTH',
                        shortCode: 'TH',
                        minWidth: 120,
                        disabled: false
                    }, {
                        lable: '划线价(TH)',
                        name: '划线价',
                        value: 'priceTH',
                        shortCode: 'TH',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: 'VIP价(TH)',
                        name: 'VIP价',
                        value: 'priceVipTH',
                        shortCode: 'TH',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: '佣金率(TH)',
                        name: '佣金率',
                        value: 'commissionTH',
                        shortCode: 'TH',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: '上架状态(SG)',
                        name: '上架状态',
                        value: 'shelveStatusSG',
                        shortCode: 'SG',
                        minWidth: 120,
                        disabled: false
                    }, {
                        lable: '划线价(SG)',
                        name: '划线价',
                        value: 'priceSG',
                        shortCode: 'SG',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: 'VIP价(SG)',
                        name: 'VIP价',
                        value: 'priceVipSG',
                        shortCode: 'SG',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: '佣金率(SG)',
                        name: '佣金率',
                        value: 'commissionSG',
                        shortCode: 'SG',
                        minWidth: 100,
                        disabled: false
                    }, {
                        lable: '累计销量',
                        name: '累计销量',
                        value: 'sales',
                        minWidth: 80,
                        disabled: false
                    }, {
                        lable: '品牌',
                        name: '品牌',
                        value: 'brand',
                        minWidth: 150,
                        disabled: false
                    }, {
                        lable: '供应商',
                        name: '供应商',
                        value: 'supplier',
                        minWidth: 150,
                        disabled: false
                    }, {
                        lable: '创建时间',
                        name: '创建时间',
                        value: 'createTime',
                        minWidth: 160,
                        disabled: false
                    }, {
                        lable: '更新时间',
                        name: '更新时间',
                        value: 'updateTime',
                        minWidth: 160,
                        disabled: false
                    }
                ],
                // 商品列表列，初始值
                tableCols: [{
                                lable: '商品ID',
                                name: '商品ID',
                                value: 'productId',
                                minWidth: 180
                            },
                            {
                                lable: '商品信息',
                                name: '商品信息',
                                value: 'title',
                                minWidth: 250

                            }, {
                                lable: '原始链接',
                                name: '原始链接',
                                value: 'orgUrl',
                                minWidth: 180
                            }, {
                                lable: '后台类目',
                                name: '后台类目',
                                value: 'backCategory',
                                minWidth: 180
                            }, {
                                lable: '销售国家',
                                name: '销售国家',
                                value: 'saleCountry',
                                minWidth: 180
                            }, {
                                lable: '上架状态(MY)',
                                name: '上架状态',
                                value: 'shelveStatusMY',
                                minWidth: 120,
                                disabled: false
                            }, {
                                lable: '划线价(MY)',
                                name: '划线价',
                                value: 'priceMY',
                                minWidth: 120,
                                disabled: false
                            }, {
                                lable: 'VIP价(MY)',
                                name: 'VIP价',
                                value: 'priceVipMY',
                                minWidth: 120,
                                disabled: false
                            }, {
                                lable: '佣金率(MY)',
                                name: '佣金率',
                                value: 'commissionMY',
                                minWidth: 120,
                                disabled: false
                            }, {
                                lable: '累计销量',
                                name: '累计销量',
                                value: 'sales',
                                minWidth: 180
                            }]
            }
        },
        components: {
            ProductListSetting,
            ConfirmDialog
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastPartMonth () {
                return this.$store.state.globalNum.lastPartMonth
            }
        },
        mixins: [PageSearchStatus],
        watch: {
        },
        created () {
            if (this.getStore('productListColumn')) {
                this.tableCols = JSON.parse(this.getStore('productListColumn'))
                let checkedItem = []
                _.forEach(this.tableCols, col => {
                    checkedItem.push(col.name)
                })
                console.log(_.uniq(checkedItem))
                this.settingModel.checkedItem = _.uniq(checkedItem)
            }
            if (this.getStore('productSaleCountry')) {
                let productSaleCountry = JSON.parse(this.getStore('productSaleCountry'))
                let checkedCountry = []
                _.forEach(productSaleCountry, country => {
                    checkedCountry.push(country.shortCode)
                })
                this.settingModel.checkedCountry = checkedCountry
            }
            this.fetchCategory({
                level: 1,
                cateType: 1,
                resolve: (data) => {
                    this.frontCategoryOptions = data
                }
            })
            this.fetchCategory({
                level: 1,
                cateType: 2,
                resolve: (data) => {
                    this.backCategoryOptions = data
                }
            })
            this.getCountryList()
            this.getLanguageList()

            let currentState = this.getPageSearchStatus();
            if (currentState) {
                this.queryData = _.cloneDeep(currentState)
                this.queryData.backCateId = ''
                this.queryData.frontCateId = ''
            }
            if(this.$route.query.productId){
                this.queryData.value = this.$route.query.productId
                this.queryData.type='1'
                this.search()
            }else{
                this.getProductList()
            }
            
            console.log(this.queryData)
            
            this.getProductEnumInfo()
            // this.getSupplierList()
        },
        mounted () {
        },
        methods: {
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            // 获取国家数据字典
            getCountryList() {
                let params = {
                    pageSize: 100,
                    pageNum: 1
                }
                getCountryList(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.setStore("countryList", res.countryInfo)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            // 获取语言
            getLanguageList() {
                let params = {
                    pageSize: 100,
                    pageNum: 1
                }
                getLanguageList(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.setStore("languageList", res.languageInfo)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            // 获取下一级分类
            getFrontSubCategory (data, resolve) {
                if (data.level == 0) {
                    return
                }
                let value = JSON.parse(data.value)
                this.fetchCategory({
                    pid: parseInt(value.cateId),
                    cateType: 1,
                    level: data.level + 1,
                    resolve
                })
            },
            getBackSubCategory (data, resolve) {
                if (data.level == 0) {
                    return
                }
                let value = JSON.parse(data.value)
                this.fetchCategory({
                    pid: parseInt(value.cateId),
                    cateType: 2,
                    level: data.level + 1,
                    resolve
                })
            },
            // 获取分类
            fetchCategory ({ id, cateType, level, pid, page, resolve }) {
                categoryListGet(this.filterData({
                    pid: pid,
                    id: id,
                    level: level,
                    cateType: cateType,
                    page: page
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.categoryUnit.length; i++) {
                            res.categoryUnit[i]['levelValue'] = []
                            let item = res.categoryUnit[i].cateNameValue.find((val) => {
                                return val.languageCode == 'cn'
                            })
                            res.categoryUnit[i]['cateName'] = item ? item.name : ''
                            res.categoryUnit[i]['prop'] = JSON.stringify({
                                cateId: String(res.categoryUnit[i].cateId),
                                cateName: item ? item.name : ''
                            })
                            if (cateType == 2) {
                                res.categoryUnit[i]['leaf'] = level > 2
                            } else {
                                res.categoryUnit[i]['leaf'] = level > 1
                            }
                        }
                        resolve && resolve(res.categoryUnit, res)
                    }
                })
            },
            /**
             * 获取供应商列表
            */
            getSupplierList(query) {
                let params = {
                    // page: {
                    //     pageSize: 10000,
                    //     pageNum: 1
                    // },
                    supplierName: query
                }
                supplierBasePage(this.filterData(params)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.supplierList = res.list
                    }
                })
            },
            setFrontCateId () {
                if (this.queryData.frontCate && this.queryData.frontCate.length > 0) {
                    let cateInfo = JSON.parse(this.queryData.frontCate[this.queryData.frontCate.length - 1])
                    this.queryData.frontCateId = cateInfo.cateId
                } else {
                    this.queryData.frontCateId = ''
                }
            },
            setBackCateId () {
                if (this.queryData.backCate && this.queryData.backCate.length > 0) {
                    let cateInfo = JSON.parse(this.queryData.backCate[this.queryData.backCate.length - 1])
                    this.queryData.backCateId = cateInfo.cateId
                } else {
                    this.queryData.backCateId = ''
                }
            },
            search () {
                this.queryData.page.pageNum = 1
                this.getProductList()
                this.setPageSearchStatus(this.queryData)
            },
            resetSearch () {
                this.queryData.type = ''
                this.queryData.value = ''
                this.queryData.titleKey = ''
                this.queryData.productIdKey = ''
                this.queryData.standardIdKey = ''
                this.queryData.skuIdKey = ''
                this.queryData.skuCodeKey = ''
                this.queryData.shelveStatus = null
                this.queryData.sourceKey = ''
                this.queryData.backCate = ''
                this.queryData.backCateId = ''
                this.queryData.frontCate = ''
                this.queryData.frontCateId = ''
                this.queryData.countryCode = ''
                this.queryData.saleWay = null
                this.queryData.productType = null
                this.queryData.timeType = null
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.queryData.timeList = []
                this.queryData.supplierId = ''
                this.queryData.productUrl = ''
                this.getProductList()
                this.removePageSearchStatus()
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getProductList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getProductList()
            },
            handleOptionsFront () {},
            handleOptionsBack () {},
            moreOption () {
                this.visible = true
            },
            listSetting () {
                this.settingVisible = true
            },
            handleOnSettingConfirm (data) {
                this.settingVisible = false
                this.tableCols = []
                let checkedItem = _.uniq(data.checkedItem)
                let checkedCountry = data.checkedCountry
                let checkedClos = []
                _.forEach(checkedItem, (item) => {
                    _.forEach(this.allCols, col => {
                        if (col.name === item) {
                            if (col.shortCode && checkedCountry.indexOf(col.shortCode) != -1) {
                                checkedClos.push(col)
                            }
                            if (!col.shortCode) {
                                checkedClos.push(col)
                            }
                        }
                    })
                })
                this.tableCols = checkedClos
                this.setStore('productListColumn', checkedClos)
                this.setStore('productSaleCountry', countryList)
            },
            addProduct () {
                this.$store.commit('SET_SALE_COUNTRY_LIST', [])
                this.$router.push({
                    name: 'productEditNew'
                })
            },
            getProductList () {
                this.loading = true
                let params = this.queryData
                switch (this.queryData.type) {
                     case '1':
                        params.productIdKey = this.queryData.value
                        params.skuIdKey = ''
                        params.skuCodeKey = ''
                        params.titleKey = ''
                     break;
                     case '2':
                        params.productIdKey = ''
                        params.skuIdKey = this.queryData.value
                        params.skuCodeKey = ''
                        params.titleKey = ''
                     break;
                     case '3':
                        params.productIdKey = ''
                        params.skuIdKey = ''
                        params.skuCodeKey = this.queryData.value
                        params.titleKey = ''
                     break;
                     case '4':
                        params.productIdKey = ''
                        params.skuIdKey = ''
                        params.skuCodeKey = ''
                        params.titleKey = this.queryData.value
                     break;
                     default:
                        params.productIdKey = this.$route.query.productId ? this.$route.query.productId :''
                        params.skuIdKey = ''
                        params.skuCodeKey = ''
                        params.titleKey = ''
                     break;
                }
                if ( params.timeList.length > 0) {
                    params.startTime = params.timeList ? params.timeList[0] + '' : null
                    params.endTime = params.timeList ? params.timeList[1] + '': null
                }
                
                listProduct(this.filterData(params)).then((response) => {
                    
                    if (response.ret.errcode === 1) {
                        this.loading = false
                        this.total = response.total
                        let listSpuUnit = response.listSpuUnit
                        let spuUnitList = []
                        _.forEach(listSpuUnit, spuUnit => {
                            let spuUnitTemp = {}
                            spuUnitTemp.title = spuUnit.title
                            spuUnitTemp.spuCover = this.dealShowFileSrc(spuUnit.spuCover)
                            spuUnitTemp.spuMiniCover = this.dealShowFileSrc(spuUnit.spuCover)
                            spuUnitTemp.orgUrl = spuUnit.orgUrl
                            if (spuUnit.backCate) {
                                spuUnitTemp.backCategory = spuUnit.backCate.parentPathName.join('>') + `>${spuUnit.backCate.cateName}`
                            }
                            spuUnitTemp.brand = `${spuUnit.brandInfo.brandNameCn}/${spuUnit.brandInfo.brandNameEn}`
                            if (spuUnit.frontCate && spuUnit.frontCate.length > 0) {
                                let frontCateList = []
                                _.forEach(spuUnit.frontCate, item => {
                                    let frontCateItem = ''
                                    frontCateItem = item.parentPathName[0] + '>' + item.cateName
                                    frontCateList.push(frontCateItem)
                                })
                                spuUnitTemp.frontCategory = frontCateList.join(' ; ')
                            }
                            spuUnitTemp.productId = spuUnit.productId
                            spuUnitTemp.supplier = spuUnit.supplierName
                            let saleCountryList = []
                            _.forEach(spuUnit.spuCountry, item => {
                                saleCountryList.push(item.countryCode)
                                spuUnitTemp['priceVip' + item.countryCode] = item.priceVip
                                spuUnitTemp['price' + item.countryCode] = item.price
                                if (item.shelveStatus === 1) {
                                    spuUnitTemp['shelveStatus' + item.countryCode] = '上架'
                                    spuUnitTemp['shelveStatusCode' + item.countryCode] = 1
                                } else if (item.shelveStatus === 2) {
                                    spuUnitTemp['shelveStatusCode' + item.countryCode] = 2
                                    spuUnitTemp['shelveStatus' + item.countryCode] = '下架'
                                }
                            })
                            _.forEach(spuUnit.sku[0].skuCountry, item => {
                                spuUnitTemp['commission' + item.countryCode] = item.commission
                            })
                            spuUnitTemp.saleCountry = saleCountryList.join('/')
                            spuUnitTemp.createTime = spuUnit.createTime
                            spuUnitTemp.updateTime = spuUnit.updateTime

                            spuUnitList.push(spuUnitTemp)
                        })
                        this.productTableList = spuUnitList
                        console.log(spuUnitList)
                    }
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            },
            copyProduct (productId) {
                this.$store.commit('SET_SALE_COUNTRY_LIST', [])
                this.$router.push({
                    path: '/product/productEditNew',
                    query: { copyId: productId }
                })
                this.setPageSearchStatus(this.queryData)
                // this.getProductDetailById('430522984659161088')
            },
            modifyProduct (productId) {
                this.$store.commit('SET_SALE_COUNTRY_LIST', [])
                this.$router.push({
                    path: '/product/productEditNew',
                    query: { productId: productId }
                })
                this.setPageSearchStatus(this.queryData)
                // this.getProductDetailById('430522984659161088')
            },
            delProduct (product) {
                this.confirmVisible = true
                this.productId = product.productId
            },
            cancleDel () {
                this.confirmVisible = false
            },
            confirmDelProduct () {
                this.confirmVisible = false

                let params = {
                    productId: this.productId
                }
                disableProduct(params).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        this.$message.success('删除成功！')
                        this.getProductList()
                    } else {
                        this.$message.error('删除失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getProductDetailById (productId) {
                let params = {
                    productId: this.productId
                }
                viewProductInfo(params).then((response) => {
                    console.log(response)
                }).catch((err) => {
                    console.log(err)
                })
            },
            downloadProduct () {
                if (this.queryData.countryCode === '') {
                    this.$message.warning('请选择一个国家')
                    return
                }
                let params = _.pick(this.queryData, ['titleKey', 'productIdKey', 'standardIdKey', 'skuCodeKey',
                                                     'shelveStatus', 'saleWay', 'frontCateId', 'backCateId', 'timeType',
                                                     'startTime', 'endTime', 'productType', 'languageCode'])
                params.countryCode = [this.queryData.countryCode]
                productExport(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.fileUrl
                        window.open(`${this.dealShowFileSrc(fileUrl)}`)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getProductEnumInfo() {
                let params = {}
                getProductEnumInfo(this.filterData(params)).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        let productTypes = []
                        let sourceOptions = []
                        _.forEach(response.source, item => {
                            item.source = item.source + ''
                            sourceOptions.push(item)
                        })
                        this.sourceOption = sourceOptions
                        _.forEach(response.productType, item => {
                            item.productType = item.productType + ''
                            productTypes.push(item)
                        })
                        this.productTypeList = productTypes
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .image-box {
        height: 70px;
        width: 70px;
    }
    .block-right {
         height: 70px;
    }
</style>
