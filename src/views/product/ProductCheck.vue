<template>
    <div class="app-container check-wrapper">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="一键上传" name="oneKeyPublish"></el-tab-pane>
            <el-tab-pane label="商家发布" name="supplierPublish"></el-tab-pane>
        </el-tabs>
        <div class="filter-container">
            <el-form ref="productCheckFilterForm" v-if="activeTab === 'oneKeyPublish'" inline label-width="90px" :model="queryData">
                <!-- <el-form-item label="销售国家：" class="filter-item" prop="countryCode">
                    <el-select v-model="queryData.countryCode" size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item> -->
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
                <el-form-item label="创建人：" class="filter-item" prop="operatorId">
                    <el-select v-model="queryData.operatorId" size="medium">
                        <el-option v-for="(item, index) in operatorList" :key="index" :label="item.operationName" :value="item.operatorId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <el-form ref="supplierProductCheckFilterForm" v-else inline label-width="90px" :model="supplierQueryData">
                <el-form-item label="时间查询：" class="filter-item" prop="timeList">
                    <el-select v-model="supplierQueryData.timeType" filterable clearable style="width: 110px" size="medium" placeholder="选择类型">
                        <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-date-picker v-model="supplierQueryData.timeList"
                        size="medium"
                        type="daterange"
                        value-format="timestamp"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="后台类目：" class="filter-item" prop="backCate">
                    <el-cascader  style="width: 300px"
                        clearable
                        filterable
                        :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true}"
                        placeholder="请选择商品后台分组"
                        :options="backCategoryOptions"
                        v-model="supplierQueryData.backCate"
                        @change="setBackCateId"
                        class="normalOperatorBox"
                        size="medium">
                    </el-cascader>
                </el-form-item>
                 <el-form-item label="供应商：" class="filter-item" prop="supplierId">
                    <el-select v-model="supplierQueryData.supplierId" size="medium" :remote-method="getSupplierList" filterable clearable remote reserve-keyword>
                        <el-option v-for="(item, index) in supplierList"  :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="更新人：" class="filter-item" prop="operatorId">
                    <el-select v-model="supplierQueryData.operatorId" size="medium">
                        <el-option v-for="(item, index) in updaterList" :key="index" :label="item.operationName" :value="item.operatorId"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="国家：" class="filter-item" prop="countryCode">
                    <el-select v-model="supplierQueryData.countryCode" size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-wrapper main-content-wrapper">
            <div class="content-header" v-if="activeTab === 'supplierPublish'">
              <el-tabs v-model="moduleTabActive" @tab-click="switchModuleTab">
                  <el-tab-pane label="全部" name="0"></el-tab-pane>
                  <el-tab-pane label="待审核" name="5"></el-tab-pane>
                  <el-tab-pane label="审核通过" name="6"></el-tab-pane>
                  <el-tab-pane label="审核不通过" name="4"></el-tab-pane>
                  <el-tab-pane label="草稿" name="3"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="content">
            <el-table v-if="activeTab === 'oneKeyPublish'" :data="draftTableList" v-loading="loading" border fit highlight-current-row height="100%" style="width: 100%">
                <el-table-column label="商品信息" align="center" min-width="260px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                              <img :src="scope.row.cover" class="previewImage">
                              <img :src="scope.row.cover" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.title}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="发布方式" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.publishType === 1" size="mini">手工录入</el-tag>
                        <el-tag v-if="scope.row.publishType === 2" size="mini" type="success">一键上传</el-tag>
                        <el-tag v-if="scope.row.publishType === 3" size="mini" type="warning">供应商上传</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="商品来源" align="center" width="110px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.source === 1" >手工录入/自营</span>
                        <span v-if="scope.row.source === 2" type="warning">甩宝</span>
                        <span v-if="scope.row.source === 3" type="success">1688</span>
                        <span v-if="scope.row.source === 4" type="danger">拼多多</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="商品原始链接" align="center" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.orgUrl" class="item" effect="dark" :content="scope.row.orgUrl" placement="top">
                            <a :href="scope.row.orgUrl" target="_blank" style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:150px;">{{ scope.row.orgUrl}}</a>
                        </el-tooltip>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="后台类目" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{scope.row.cateNameList}}
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.creatorName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.operatorName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.updateTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column  fixed="right" label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.draftStatus === 3 && hasPermission('BTN_PRODUCT_DRAFT_CHECK')"  type="text" size="mini" @click="checkProduct(scope.row.draftId)">去审核</el-button>
                        <el-button v-if="hasPermission('BTN_PRODUCT_DRAFT_DEL')" type="text" size="mini" @click="delProduct(scope.row.draftId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else :data="supplierTableList" v-loading="loading" border fit highlight-current-row height="100%" style="width: 100%">
                <el-table-column label="商品信息" align="center" min-width="260px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                        <!--1是活动商品，0不是-->
                             
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                              <img :src="dealShowFileSrc(scope.row.productPic)" class="previewImage">
                              <img :src="dealShowFileSrc(scope.row.productPic)" class="image-box" slot="reference">
                            </el-popover>
                           <div style="display:flex;flex-direction: column;">
                               <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 2;-webkit-box-orient: vertical">
                                    {{scope.row.productName}}
                                </span>
                            </el-tooltip>
                               <el-tag type="danger" size="mini" v-if="scope.row.activity==1" style="width:40px;text-align:center;padding:0;margin-left:10px;">活动</el-tag>
                           </div>
                            
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="供货价" align="center" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.productPrice+'('+scope.row.currencyCode+')'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布方式" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag size="mini" type="warning">供应商上传</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="后台类目" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{scope.row.cateName}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{scope.row.supplierName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="商品来源" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.draftType==0">-</span>
                        <span v-else-if="scope.row.draftType==1">新增商品</span>
                        <span v-else-if="scope.row.draftType==2">修改商品</span>
                        <span v-else-if="scope.row.draftType==3">上下架商品</span>
                    </template>
                </el-table-column>
                <el-table-column label="国家" align="center" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.countryCode | countryFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" align="center" width="200" :key="Math.random()" v-if="moduleTabActive==4">
                    <template slot-scope="scope">
                        <p>审核不合格</p>
                        <span style="font-size:14px;color:#cccccc">{{scope.row.message}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.createTime }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.operator || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.updateTime }}
                    </template>
                </el-table-column>
                <el-table-column  fixed="right" label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.draftStatus === 3 && hasPermission('BTN_PRODUCT_DRAFT_CHECK')"  type="text" size="mini" @click="checkSupplierProduct(scope.row.draftId)">去审核</el-button>
                        <el-button v-if="scope.row.draftStatus === 4"  type="text" size="mini" @click="jumpProductDetail(scope.row.productId)">查看</el-button>
                        <el-button v-if="scope.row.draftStatus === 1 || scope.row.draftStatus === 0"  type="text" size="mini" @click="checkSupplierProduct(scope.row.draftId)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </div>
        <div class="pagination-box">
            <el-pagination
                v-if="activeTab === 'oneKeyPublish'"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
            <el-pagination
                v-else
                @current-change="supplierHandleCurrentChange"
                @size-change="supplierHandleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="supplierQueryData.page.pageNum"
                :page-size="supplierQueryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="supplierTotal"
                class="pagination">
            </el-pagination>
        </div>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleDel" @on-confirm="confirmDelProduct"></confirm-dialog>
    </div>
</template>

<script>
    import {listDrafts, deleteDrafts, getDraftOperatorList, supplierAuditList, categoryListGet } from '@/request/product'
    import { supplierBasePage } from '@/request/supplier'
    import ConfirmDialog from '@/components/ConfirmDialog'
    export default {
        name: 'productCheck',
        data () {
            return {
                activeTab: 'oneKeyPublish',
                moduleTabActive: '0',
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                total: 0,
                visible: false,
                draftId: '',
                confirmVisible: false,
                confirmDialogTitle: '是否确定删除商品草稿？',
                confirmDialogText: '',
                frontCategoryOptions: [],
                backCategoryOptions: [],
                operatorList: [],
                updaterList: [],
                timeTypeList: [{
                    label: '创建时间',
                    value: 1
                },
                {
                    label: '更新时间',
                    value: 2
                }],
                productTypeList: [],
                frontCategoryList: [],
                backCategoryList: [],
                draftTableList: [],
                queryData: {
                    timeType: null,
                    timeList: [],
                    operatorId: '',
                    startTime: '',
                    endTime: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                supplierQueryData: {
                    countryCode: 'CN',
                    backCate: null,
                    cateId: null,
                    timeType: null,
                    supplierId: '',
                    countryCode: '',
                    timeList: [],
                    cateId: '',
                    operatorId: '',
                    startTime: '',
                    endTime: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                supplierList: [],
                supplierTableList: [],
                supplierTotal: 0,
                resolve:null,
            }
        },
        components: {
            ConfirmDialog
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        watch: {
        },
        created () {
            this.getDraftOperatorList()
            this.getUpdaterList()
        },
        mounted () {
            this.getDraftList()
            // if(this.getStore('supplierQueryData')){
            //     this.supplierQueryData = JSON.parse(this.getStore('supplierQueryData'))
            //     this.getSupplierList()
            // }
            
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
            handleTabClick(tab, event) {
                if (tab.name === 'oneKeyPublish') {
                    this.getDraftOperatorList()
                } else {
                    console.log('商家发布')
                    this.fetchCategory({
                        level: 1,
                        cateType: 2,
                        resolve: (data) => {
                            this.backCategoryOptions = data
                        }
                    })
                    // this.fetchCategory({pid:Number(JSON.parse(this.supplierQueryData.backCate[0]).cateId),cateType:2,level:2})
                    // this.getBackSubCategory()
                    // this.fetchCategory({pid:Number(JSON.parse(this.supplierQueryData.backCate[1]).cateId),cateType:2,level:3})
                    // this.getBackSubCategory()
                    this.getSupplierAuditList()
                    // this.getSupplierList()
                }
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
            setBackCateId (value) {
                if (this.supplierQueryData.backCate && this.supplierQueryData.backCate.length > 0) {
                    let cateInfo = JSON.parse(this.supplierQueryData.backCate[this.supplierQueryData.backCate.length - 1])
                    this.supplierQueryData.cateId = cateInfo.cateId
                } else {
                    this.supplierQueryData.cateId = ''
                }
            },
            /**
             * 获取供应商列表
            */
            getSupplierList(query) {
                let params = {
                    supplierName: query
                }
                supplierBasePage(this.filterData(params)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.supplierList = res.list
                    }
                })
            },
            switchModuleTab(tab) {
                this.getSupplierAuditList()
            },
            getDraftOperatorList() {
                let params = {
                    operatorType: 1
                }
                getDraftOperatorList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.operatorList = res.operator
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getUpdaterList() {
                let params = {
                    operatorType: 2
                }
                getDraftOperatorList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.updaterList = res.operator
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            search () {
                if (this.activeTab === 'oneKeyPublish') {
                    this.queryData.page.pageNum = 1
                    this.getDraftList()
                } else {
                    
                    this.setStore('supplierQueryData',this.supplierQueryData)
                    this.supplierQueryData.page.pageNum = 1
                    this.getSupplierAuditList()
                }
            },
            resetSearch () {
                if (this.activeTab === 'oneKeyPublish') {
                    this.$refs.productCheckFilterForm.resetFields()
                    this.queryData.timeType = null
                    this.queryData.page.pageNum = 1
                    this.queryData.page.pageSize = 20
                    this.queryData.timeList = []
                    this.getDraftList()
                } else {
                    this.$refs.supplierProductCheckFilterForm.resetFields()
                    this.supplierQueryData.supplierId = ''
                    this.supplierQueryData.timeType = null
                    this.supplierQueryData.page.pageNum = 1
                    this.supplierQueryData.page.pageSize = 20
                    this.supplierQueryData.timeList = []
                    this.getSupplierAuditList()
                }
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getDraftList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getDraftList()
            },
            getDraftList () {
                this.loading = true
                let params = this.filterData(this.queryData)
                if ( params.timeList && params.timeList.length > 0) {
                    params.startTime = params.timeList ? params.timeList[0] + '' : null
                    params.endTime = params.timeList ? params.timeList[1] + '': null
                }
                listDrafts(params).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.draftTableList = res.draftListUnit
                        this.total = res.total
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            checkProduct (draftId) {
                this.$router.push({
                    path: '/product/productEditNew',
                    query: { draftId: draftId }
                })
            },
            checkSupplierProduct (draftId) {
                this.$router.push({
                    path: '/product/productEditNew',
                    query: { draftId: draftId, source: 'supplier' }
                })
            },
            delProduct (draftId) {
                this.confirmVisible = true
                this.draftId = draftId
            },
            cancleDel () {
                this.confirmVisible = false
            },
            confirmDelProduct () {
                this.confirmVisible = false

                let params = {
                    draftId: [this.draftId]
                }
                deleteDrafts(params).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('删除成功！')
                        this.getDraftList()
                    } else {
                        this.$message.error('删除失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getSupplierAuditList() {
                this.loading = true
                let params = {}
                if (this.moduleTabActive === '0') {
                    this.supplierQueryData.status = null
                } else {
                    this.supplierQueryData.status = parseInt(this.moduleTabActive)
                }
                params = this.filterData(this.supplierQueryData)
                params.countryCode = 'CN'
                params.sourceType=0
                if (params.timeList && params.timeList.length > 0) {
                    params.startTime = params.timeList ? params.timeList[0] + '' : null
                    params.endTime = params.timeList ? params.timeList[1] + '': null
                }
                supplierAuditList(params).then((res) => {
                    console.log(params)
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.supplierTableList = res.spuPB
                        this.supplierTotal = res.totalCount
                    }
                })
            },
            supplierHandleSizeChange (val) {
                this.supplierQueryData.page.pageSize = val
                this.getSupplierAuditList()
            },
            supplierHandleCurrentChange (val) {
                this.supplierQueryData.page.pageNum = val || this.supplierQueryData.page.pageNum
                this.getSupplierAuditList()
            },
            jumpProductDetail(productId) {
                this.$router.push({
                    path: '/product/productEditNew',
                    query: { productId: productId }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .image-box {
        height: 70px;
        width: 70px;
    }
    .block-right {
         height: auto;
    }
</style>
<style lang="scss">
.check-wrapper{
    .content-wrapper{

      display: flex;
      flex-direction: column;
      .content-header{
        .el-tabs--border-card{
          border: 0;
          box-shadow: none;
        }
        .el-tabs__content{
          display: none;
        }
        .el-tabs--border-card>.el-tabs__header{
          border: 0;
        }
      }
      .content{
          box-sizing: border-box;
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          .table-wrapper{
              flex: 1;
              overflow: hidden;
          }
      }
    }
  }
</style>

