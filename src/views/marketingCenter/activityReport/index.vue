<template>
    <div class="app-container"> 
        <div class="activity-report">
            <div class="title">{{ title }}（{{ countryList(country) }}）</div>
            <el-tabs v-model="activeTab" type="card" @tab-click="handleTabsClick">
                <!-- <el-tab-pane :key="item.name" v-for="item in tabList" :label="item.title" :name="item.name"></el-tab-pane> -->
                <el-tab-pane v-if="hasPermission('BTN_SEIZE_PEND')" label="待报名" :name="0"></el-tab-pane>
                <el-tab-pane v-if="hasPermission('BTN_SEIZE_RESLOVE')" label="已报名待录用" :name="1"></el-tab-pane>
                <el-tab-pane label="已录用" :name="2"></el-tab-pane>
            </el-tabs>
            <el-button v-if="activeTab == 0" type="primary" size="medium" icon="el-icon-plus" @click="addProduct" class="add-product">新增商品</el-button>
            <el-form inline label-width="90px">
                <el-form-item label="商品ID：">
                    <el-input placeholder="多个商品ID用英文逗号,隔开" size="medium" v-model="queryData.productIds" class="product-id"></el-input>
                </el-form-item>
                <el-form-item label="商品分组：">
                    <el-select v-model="queryData.groupLabelId" clearable placeholder="请选择" size="medium">
                        <el-option v-for="(item, index) in activityLabel"
                                    :key="index"
                                    :label="getMultiLangShowInfo(item.name)"
                                    :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeTab != 0" label="提报人：">
                    <el-select v-model="queryData.signUpOperatorId" filterable clearable size="medium" placeholder="请选择">
                        <el-option v-for="(item, index) in signUpList"
                            :key="index"
                            :label="item.nickName"
                            :value="item.sysUserId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeTab === 2" label="采集人：">
                    <el-select v-model="queryData.gatherOperatorId" filterable clearable size="medium" placeholder="请选择">
                        <el-option v-for="(item, index) in gatherList"
                            :key="index"
                            :label="item.nickName"
                            :value="item.sysUserId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称：">
                    <el-input placeholder="请输入" size="medium" v-model="queryData.productName"></el-input>
                </el-form-item>
                <el-form-item v-if="activeTab === 1" label="价格带：">
                    <div class="price-range">
                        <el-input placeholder="请输入" size="medium" v-model="queryData.activePriceMin"></el-input>
                        &nbsp;～&nbsp;
                        <el-input placeholder="请输入" size="medium" v-model="queryData.activePriceMax"></el-input>
                    </div>
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
                <el-form-item v-if="activeTab !== 2">
                    <el-radio-group v-model="queryData.lookSwitch">
                        <el-radio :label="1"  @click.native.prevent="clickItem(1)">只看价格校验不通过的商品</el-radio>
                        <el-radio :label="2"  @click.native.prevent="clickItem(2)">只看活动冲突商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item v-if="activeTab !== 2">
                    <el-button type="primary" @click="recheckForTime">重新校准活动冲突</el-button>
                    <el-button type="primary" @click="recheckForPrice">重新校准价格冲突</el-button>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px">
                    <el-button type="primary" size="medium" icon="el-icon-search" @click="search">搜索</el-button>
                    <el-button size="medium" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
            <div v-if="activeTab == 0" class="btn-box">
                <div>
                    <el-button type="primary" @click="getSubmitNoSignedProduct">提交报名</el-button>
                    <el-button type="danger" @click="getDeleteProduct">废弃</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="batchEditClcik">批量编辑</el-button> 
                </div>
            </div>
            <div v-if="activeTab == 1" class="btn-box">
                <div>
                    <el-button type="primary" @click="employClick">录用</el-button>
                    <el-button type="danger" @click="getDeleteProduct">废弃</el-button>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-edit" @click="bulkEditClick">批量编辑</el-button> 
                </div>
            </div>
            <div class="main-content-wrapper">
                <el-table :data="tableData" ref="subjectTable" style="width: 100%;height:100%" :cell-class-name="checkbox" v-loading="loading" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" key="1" :show-overflow-tooltip="true" width="55" fixed="left"></el-table-column>
                    <el-table-column key="2" v-if="activeTab == 0" align="center" label="主图" width="100" fixed="left">
                        <template slot-scope="scope">
                            <img :src="dealShowFileSrc(scope.row.signUpBaseProduct.productCover)" class="product-cover"/>
                        </template>
                    </el-table-column>
                    <el-table-column key="3" align="center" label="商品信息" width="250" fixed="left">
                        <template slot-scope="scope">
                            <div class="profuct-content">
                                <img v-if="activeTab != 0" :src="dealShowFileSrc(scope.row.signUpBaseProduct.productCover)" class="product-cover"/>
                                <el-tooltip class="item" effect="dark" :content="scope.row.signUpBaseProduct.productTitle" placement="top">
                                    <div class="product-title">{{ scope.row.signUpBaseProduct.productTitle }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column >
                    <el-table-column key="4" align="center" label="商品ID" width="100" prop="signUpBaseProduct.productId"></el-table-column>
                    <el-table-column key="5" align="center" label="类目" width="200">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="scope.row.signUpBaseProduct.categoryUnit">{{ scope.row.signUpBaseProduct.categoryUnit.backCateFirstName }} > {{ scope.row.signUpBaseProduct.categoryUnit.backCateSecondName }} > {{ scope.row.signUpBaseProduct.categoryUnit.backCateThirdName }}</div>
                                <div v-else>-</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column key="6" v-if="activeTab === 0" align="center" label="状态" width="150">
                        <template slot-scope="scope">
                            <div>{{ scope.row.signUpBaseProduct.shelveStatus === 1 ? '上架' : '下架' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="7" align="center" width="160">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div v-if="activeTab == 0">
                                    预热时间<i class="iconfont icon-font" @click="goEmpty(0)">&#xe671;</i>
                                </div>
                                <div v-else>预热时间</div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div :class="{'timeConflict':scope.row.timeConflict}">{{ scope.row.signUpBaseProduct.spuPreheatTime | formatTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="8" align="center" width="160">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div v-if="activeTab == 0">
                                    开始时间<i class="iconfont icon-font" @click="goEmpty(1)">&#xe671;</i>
                                </div>
                                <div v-else>开始时间</div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div :class="{'timeConflict':scope.row.timeConflict}">{{ scope.row.signUpBaseProduct.startTime | formatTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="9" align="center" width="160">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div v-if="activeTab == 0">
                                    结束时间<i class="iconfont icon-font" @click="goEmpty(2)">&#xe671;</i>
                                </div>
                                <div v-else>结束时间</div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div :class="{'timeConflict':scope.row.timeConflict}">{{ scope.row.signUpBaseProduct.endTime | formatTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="10" align="center" width="150">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div v-if="activeTab == 0">
                                    分组<i class="iconfont icon-font" @click="goEmpty(3)">&#xe671;</i>
                                </div>
                                <div v-else>分组</div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div>{{ showGroup(scope.row.signUpBaseProduct.groupLabel) }}</div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column v-if="activeTab == 0" align="center" label="成本价" width="150">
                        <template slot-scope="scope">
                            <div :class="{'priceConflict':scope.row.priceConflict === 2,'pricePrompt':scope.row.priceConflict === 1}">{{ showPrice(scope.row.supplyPriceMin,scope.row.supplyPriceMax) }}</div>
                        </template>
                    </el-table-column> -->
                    <el-table-column key="11" v-if="activeTab == 0" align="center" label="VIP价" width="150">
                        <template slot-scope="scope">
                            <div :class="{'priceConflict':scope.row.priceConflict,'pricePrompt':scope.row.priceConflict === 1}">{{ showPrice(scope.row.priceVipMin,scope.row.priceVipMax) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="12" v-if="activeTab == 0" align="center" label="建议活动价" width="150">
                        <template slot-scope="scope">
                            <div :class="{'priceConflict':scope.row.priceConflict,'pricePrompt':scope.row.priceConflict === 1}">{{ showPrice(scope.row.adviseActivePriceMin,scope.row.adviseActivePriceMax) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="13" v-if="activeTab == 0" align="center" width="150">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div>
                                    活动价<i class="iconfont icon-font" @click="goEmpty(4)">&#xe671;</i>
                                </div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div :class="{'priceConflict':scope.row.priceConflict,'pricePrompt':scope.row.priceConflict === 1}">{{ showPrice(scope.row.activePriceMin,scope.row.activePriceMax) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="14" v-if="activeTab == 0" align="center" width="150">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div>
                                    活动佣金率<i class="iconfont icon-font" @click="goEmpty(5)">&#xe671;</i>
                                </div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div :class="{'priceConflict':scope.row.priceConflict,'pricePrompt':scope.row.priceConflict === 1}">{{ showPrice(scope.row.activeCommissionRateMin,scope.row.activeCommissionRateMax) }}</div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="估算毛利" width="250">
                        <template slot-scope="scope">
                            <div>{{ showPrice(scope.row.rateOfMarginMin,scope.row.rateOfMarginMax) }}</div>
                        </template>
                    </el-table-column> -->
                    <el-table-column key="15" v-if="activeTab == 0" align="center" width="150">
                        <template slot="header" slot-scope="scope">
                            <div>
                                <div>
                                    活动库存<i class="iconfont icon-font" @click="goEmpty(6)">&#xe671;</i>
                                </div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div>{{ showPrice(scope.row.activeStockMin,scope.row.activeStockMax) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="16" v-if="activeTab != 0" align="center" label="营销文案" width="150">
                        <template slot-scope="scope">
                            <div class="profuct-content">
                                <img v-if="activeTab != 0" :src="dealShowFileSrc(showContent(scope.row.signUpBaseProduct.promotionCover))" class="product-cover"/>
                                <el-tooltip class="item" effect="dark" :content="showContent(scope.row.signUpBaseProduct.promotionDesc)" placement="top">
                                    <div class="product-title">{{ showContent(scope.row.signUpBaseProduct.promotionDesc) }}</div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column key="17" v-if="activeTab != 0" align="center" label="商品角标" width="150">
                        <template slot-scope="scope">
                            <div>
                                {{showContent(scope.row.signUpBaseProduct.productCorner)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column key="18" v-if="activeTab != 0" align="center" label="提报人" width="150">
                        <template slot-scope="scope">
                            <div>{{ scope.row.signUpOperatorName || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="19" v-if="activeTab != 0" align="center" label="提报时间" width="160">
                        <template slot-scope="scope">
                            <div>{{ scope.row.signUpTime | formatTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="20" v-if="activeTab == 2" align="center" label="采集人" width="150">
                        <template slot-scope="scope">
                            <div>{{ scope.row.gatherOperatorName || '-' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="21" v-if="activeTab == 2" align="center" label="采集时间" width="150">
                        <template slot-scope="scope">
                            <div>{{ scope.row.gatherTime | formatTime }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="22" v-if="activeTab != 2" align="center" label="操作" width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="operateEditClick(scope.row)">编辑</el-button>
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
                    :total="total">
                </el-pagination>
            </div>
            <add-product v-if="addProductDialog" :dialogVisible="addProductDialog" :title="title" :country="country" :activeId="activeId" @on-cancel="addCancel" @on-confirm="addConfirm"></add-product>
            <bulk-assistant v-if="batchEditDialog" :dialogVisible="batchEditDialog" :preheat="preheat" :country="country" :activeId="activeId" :activeSpuInfo="activeProductEnterSimpleInfo" @close="bulkAssClose" @confirm="bulkAssConfirm"></bulk-assistant>
            <bulk-edit v-if="bulkEditDialog" :dialogVisible="bulkEditDialog" :preheat="preheat" :country="country" :activeId="activeId" :activeSpuInfo="activeProductEnterSimpleInfo" @on-confirm="bulkConfirm" @on-cancel="bulkCancel"></bulk-edit>
            <transition name="el-fade-in">
                <edit-report-product v-if="propShowDialog" :propShowDialog="propShowDialog" :preheat="preheat" :activeTab="activeTab" :activeId="activeId" :country="country" :curType="'edit'" :defaultSkuList="defaultSkuList" :propParam="propParam" @close="editReportClose" @confirm="editReportConfirm"></edit-report-product>
            </transition>
        </div>
    </div>
    
</template>
<script>
    import { ListActiveProductEnter, ListOperationUser, SubmitNoSignedProduct, DeleteProduct, GetActiveProductEnterSkuDetail, AcceptSignedProduct, ListActiveProductForSignUp, RecheckForTimeConflict, RecheckForPriceConflict, ListGatherUser } from '@/request/activityReport'
    import { categoryListGet } from '@/request/product'
    import { listActiveGroup } from '@/request/marketing'
    import { listSysUserByPage } from '@/request/staff'
    import common from '@/js/common/mixins'
    import recruitmentList from './components/recruitmentList'
    import Hired from './components/Hired'
    import registeredList from './components/registeredList'
    import AddProduct from './components/AddProduct'
    import bulkAssistant from './components/bulkAssistant'
    import bulkEdit from './components/bulkEdit'
    import editReportProduct from './components/editReportProduct'

    export default {
        data () {
            return {
                title: '',
                country: '',
                activeId: '',
                preheat: null,
                activeTab: 0,
                tabList:[{
                    title: '待报名',
                    name: 0
                },{
                    title: '已报名待录用',
                    name: 1
                },{
                    title: '已录用',
                    name: 2
                }],
                queryData: {
                    productIds: '',
                    backCate: [],
                    backCateId: '',
                    lookSwitch: 0,
                    productName: '',
                    groupLabelId: '',
                    activePriceMin: '',
                    activePriceMax: '',
                    signUpOperatorId: '',
                    gatherOperatorId: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                total: 0,
                selectSwitch:[],
                selectSwitchList:[{
                    val: 0,
                    name: false
                },{
                    val: 1,
                    name: false
                },{
                    val: 2,
                    name: false
                },{
                    val: 3,
                    name: false
                },{
                    val: 4,
                    name: false
                },{
                    val: 5,
                    name: false
                },{
                    val: 6,
                    name: false
                }],
                personnelList: [],
                total: 0,
                tableData: [],
                backCategoryOptions: [],
                activityLabel: [],
                addProductDialog: false,
                batchEditDialog: false,
                bulkEditDialog: false,
                propShowDialog: false,
                signUpList: [],
                gatherList: [],
                activeProductEnterSimpleInfo: [],
                serialId: [],
                defaultSkuList: [],
                propParam: {}
            }
        },
        mixins: [common],
        components: {
            recruitmentList,
            registeredList,
            Hired,
            AddProduct,
            bulkAssistant,
            bulkEdit,
            editReportProduct
        },
        created () {
            this.title = this.$route.query.title
            this.country = this.$route.query.country
            this.activeId = this.$route.query.activeId
            this.preheat = this.$route.query.preheat
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
            if (this.hasPermission('BTN_SEIZE_PEND')){
                this.activeTab = 0
            } else if (!this.hasPermission('BTN_SEIZE_PEND') && this.hasPermission('BTN_SEIZE_RESLOVE')) {
                this.activeTab = 1
            } else {
                this.activeTab = 2
            }
            this.getListNoSignedProduct()
            this.getActivityLabel()
            this.getListOperationUser()
            this.getListGatherUser()
        },
        mounted () {
            
        },
        computed: {
            
        },
        methods: {
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getListNoSignedProduct()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getListNoSignedProduct()
            },
            showPrice (min,max) {
                if (min === max) {
                    return min
                } else {
                    return min + '~' + max
                }
            },
            showContent (val) {
                if (val) {
                    for (const iterator of val) {
                        if (iterator.languageCode === 'cn') {
                            if (iterator.name === '') {
                                return '-'
                            }
                            return iterator.name
                        }
                    }
                }else {
                    return ''
                } 
            },
            showGroup (val) {
                if (val.length != 0) {
                    let item = val.find(v =>{
                        return v.languageCode === 'cn'
                    })
                    return item.name
                } else {
                    return '-'
                } 
            },
            clickItem (e) {
                console.log(e)
                e === this.queryData.lookSwitch ? this.queryData.lookSwitch = 0 : this.queryData.lookSwitch = e
            },
            countryList (code) {
                let list = this.$store.state.dict.countryList
                let item = list.find((val)=>{
                    return val.shortCode === code
                })
                return item.nameCn + '站'
            },
            getListOperationUser () {
                let params={
                    activeId: this.activeId,
                    type: this.activeTab
                }
                ListOperationUser(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.signUpList = res.operationUserInfo
                    }
                })
            },
            getListGatherUser () {
                let params={
                    activeId: this.activeId
                }
                ListGatherUser(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.gatherList = res.operationUserInfo
                    }
                })
            },
            getActivityLabel () {
                listActiveGroup(this.filterData({
                    activeId: this.activeId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityLabel = res.groupInfo
                    }
                })
            },
            handleTabsClick (tab, event) {
                this.activeTab = tab.name
                this.activeProductEnterSimpleInfo = []
                this.serialId = []
                Object.assign(this.queryData,{
                    productIds: '',
                    backCate: [],
                    backCateId: '',
                    lookSwitch: 0,
                    productName: '',
                    groupLabelId: '',
                    activePriceMin: '',
                    activePriceMax: '',
                    signUpOperatorId: '',
                    gatherOperatorId: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                })
                this.getListOperationUser()
                this.getListNoSignedProduct()
            },
            addProduct () {
                this.addProductDialog = true
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
            // 获取下一级分类
            getBackSubCategory (data, resolve) {
                console.log(data)
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
            setBackCateId (value) {
                if (this.queryData.backCate && this.queryData.backCate.length > 0) {
                    let cateInfo = JSON.parse(this.queryData.backCate[this.queryData.backCate.length - 1])
                    this.queryData.backCateId = cateInfo.cateId
                } else {
                    this.queryData.backCateId = ''
                }
            },
            goEmpty (val) {
                for (const iterator of this.selectSwitchList) {
                    if (val === iterator.val){
                        iterator.name = !iterator.name
                        if (iterator.name) {
                            this.selectSwitch.push(iterator.val)
                        } else {
                            let i = this.selectSwitch.indexOf(iterator.val)
                            this.selectSwitch.splice(i,1)
                        }
                        console.log(iterator.name,iterator.val)
                    }
                }
                this.getListNoSignedProduct('goEmpty')
            },
            recheckForTime () {
                let params = {
                    activeId: this.activeId,
                    countryCode: this.country
                }
                RecheckForTimeConflict(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('更新成功！')
                        this.getListNoSignedProduct()
                    }
                })
            },
            recheckForPrice () {
                let params = {
                    activeId: this.activeId,
                    countryCode: this.country
                }
                RecheckForPriceConflict(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('更新成功！')
                        this.getListNoSignedProduct()
                    }
                })
            },
            getListNoSignedProduct (val) {
                let list = []
                if (this.queryData.productIds !== '') {
                    list = this.queryData.productIds.split(',')
                }
                console.log(list)
                let params = {
                    activeId: this.activeId,
                    countryCode: this.country,
                    type: this.activeTab,
                    productId: list,
                    selectSwitch: this.selectSwitch,
                    lookSwitch: this.queryData.lookSwitch,
                    backCateId: this.queryData.backCateId,
                    groupLabelId: this.queryData.groupLabelId===''?'':this.queryData.groupLabelId.toString(),
                    productName: this.queryData.productName,
                    activePriceMin: this.queryData.activePriceMin,
                    activePriceMax: this.queryData.activePriceMax,
                    signUpOperatorId: this.queryData.signUpOperatorId === ''?'':this.queryData.signUpOperatorId.toString(),
                    gatherOperatorId: this.queryData.gatherOperatorId=== ''?'':this.queryData.gatherOperatorId.toString(),
                    page: this.queryData.page
                }
                ListActiveProductEnter(params).then(res=> {
                    if (res.ret.errcode === 1) {
                        if (val === 'goEmpty') {
                            this.$message.success('筛选成功！')
                        }
                        this.tableData = res.activeProductEnter
                        this.total = res.total
                    }
                })
            },
            search () {
                this.getListNoSignedProduct()
            },
            resetSearch () {
                Object.assign(this.queryData,{
                    productIds: '',
                    backCate: [],
                    backCateId: '',
                    lookSwitch: 0,
                    productName: '',
                    groupLabelId: '',
                    activePriceMin: '',
                    activePriceMax: '',
                    signUpOperatorId: '',
                    gatherOperatorId: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                })
                this.getListNoSignedProduct()
            },
            // table多选
            handleSelectionChange (val) {
                let list = []
                let idList = []
                for (const iterator of val) {
                   list.push({
                       productEnterSerialId: iterator.signUpBaseProduct.productEnterSerialId,
                       productId: iterator.signUpBaseProduct.productId
                   }) 
                   idList.push(iterator.signUpBaseProduct.productEnterSerialId)
                }
                let obj = {};
                let peon = list.reduce((cur,next) => {
                    obj[next.productEnterSerialId] ? "" : obj[next.productEnterSerialId] = true && cur.push(next);
                    return cur;
                },[]) 
                this.activeProductEnterSimpleInfo = peon
                this.serialId = [...new Set(idList)]
            },
            //提交报名
            getSubmitNoSignedProduct () {
                let params = {
                    activeProductEnterSimpleInfo: this.activeProductEnterSimpleInfo,
                    countryCode: this.country,
                    activeId: this.activeId
                }
                SubmitNoSignedProduct(params).then(res => {
                    if (res.ret.errcode === 1) {
                        if (res.invalidSpu.length === 0 && res.packageSpu.length===0) {
                            this.getListNoSignedProduct()
                            this.$message.success('提交报名成功！')
                        }else if(res.invalidSpu.length !== 0 && res.packageSpu.length!==0) {
                            this.$message.error(`无效商品：${res.invalidSpu}；礼包商品：${res.packageSpu}`)
                        }else if(res.invalidSpu.length !== 0){
                            this.$message.error(`无效商品：${res.invalidSpu}`)
                        }else if(res.packageSpu.length !== 0){
                            this.$message.error(`礼包商品：${res.packageSpu}`)
                        }else{
                            this.$message.error(`无效商品：${res.invalidSpu}；礼包商品：${res.packageSpu}`)
                        }
                    }
                })
            },
            //废弃
            getDeleteProduct () {
                DeleteProduct({productEnterSerialId: this.serialId}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.getListNoSignedProduct()
                        this.$message.success('废弃成功！')
                    }
                })
            },
            //录用
            employClick () {
                let params = {
                    productEnterSerialId: this.serialId,
                    activeId: this.activeId,
                    countryCode: this.country
                }
                AcceptSignedProduct(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        if (res.invalidSpu && res.packageSpu) {
                            if (res.invalidSpu.length === 0 && res.packageSpu.length===0) {
                                this.getListNoSignedProduct()
                                this.$message.success('录用成功！')
                            }else if (res.invalidSpu.length !== 0 && res.packageSpu.length!==0) {
                                this.$message.error(`无效商品：${res.invalidSpu}；礼包商品：${res.packageSpu}`)
                            }else if(res.invalidSpu.length !== 0){
                                this.$message.error(`无效商品：${res.invalidSpu}`)
                            }else if(res.packageSpu.length !== 0){
                                this.$message.error(`礼包商品：${res.packageSpu}`)
                            }
                        }
                    }
                })
            },
            addCancel () {
                this.addProductDialog = false
                this.getListNoSignedProduct()
            },
            addConfirm () {
                this.addProductDialog = false
                this.getListNoSignedProduct()
            },
            checkbox(row){
                if(this.activeTab === 2){
                    return "mycell"
                }
            },
            batchEditClcik () {
                if (this.activeProductEnterSimpleInfo.length === 0) {
                    this.$message.error('请选择商品！')
                    return
                }
                this.batchEditDialog = true
            },
            bulkAssClose () {
                this.batchEditDialog = false
            },
            bulkAssConfirm () {
                this.batchEditDialog = false
                this.getListNoSignedProduct()
            },
            bulkCancel () {
                this.bulkEditDialog = false
            },
            bulkEditClick () {
                if (this.activeProductEnterSimpleInfo.length === 0) {
                    this.$message.error('请选择商品！')
                    return
                }
                this.bulkEditDialog = true
            },
            bulkConfirm () {
                this.bulkEditDialog = false
                this.getListNoSignedProduct()
            },
            editReportClose () {
                this.propShowDialog = false
            },
            editReportConfirm () {
                this.propShowDialog = false
                this.getListNoSignedProduct()
            },
            operateEditClick (val) {
                console.log(val.signUpBaseProduct)
                Object.assign(this.propParam, val.signUpBaseProduct)
                let params = {
                    productEnterSerialId: val.signUpBaseProduct.productEnterSerialId,
                    productId: val.signUpBaseProduct.productId,
                    activeId: this.activeId,
                    countryCode: this.country
                }
                GetActiveProductEnterSkuDetail(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.defaultSkuList = res.skuInfo
                        this.propShowDialog = true
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .activity-report{
        position: relative;
        .title{
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 500;
        }
        .add-product{
            position: absolute;
            right: 0px;
            top: 40px;
        }
        .btn-box{
            display: flex;
            justify-content: space-between;
        }
        .mycell.el-checkbox__input {
            display: none
        }
        .price-range{
            display: flex;
        }
        .profuct-content{
            display: flex;
            align-items: center;
        }
        .product-id{
            width: 205px !important;
        }
        .product-cover{
            width: 80px;
        }
        .product-title{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .icon-font{
            font-size: 12px;
            color: #409EFF;
        }
        .timeConflict,.priceConflict{
            color: red;
        }
        .pricePrompt{
            color: rgb(241,177,9);
        }
    }
</style>