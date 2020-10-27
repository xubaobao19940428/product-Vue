<template>
    <div class="app-container">
        <el-tabs v-model="activeCountry" type="card" @tab-click="handleTabClick">
            <el-tab-pane v-for="(item, index) in countryList" :key="index" :label="item.nameCn" :name="item.shortCode"></el-tab-pane>
        </el-tabs>
        <div class="filter-container">
            <el-form ref="shelveFilterForm" inline label-width="100px" :model="queryData">
                <el-form-item label="商品ID：" class="filter-item" prop="productId">
                    <el-input placeholder="多个商品ID用英文逗号,隔开" size="medium" clearable v-model="queryData.productId" @keyup.enter.native="search" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="销售方式：" class="filter-item" prop="saleWay">
                    <el-select v-model="queryData.saleWay" filterable clearable style="width: 200px" size="medium" placeholder="选择类型">
                        <el-option v-for="(item, index) in saleWayList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="后台类目：" class="filter-item" prop="categoryIds">
                    <el-cascader style="width: 200px"
                        clearable
                        filterable
                        :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true }"
                        placeholder="请选择后台类目"
                        :options="backCategoryOptions"
                        v-model="queryData.categoryIds"
                        @change="setBackCateId"
                        class="normalOperatorBox"
                        size="medium">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="" class="filter-item" prop="radio">
                    <el-radio-group v-model="queryData.radio" @change="handleRadioGroupChange">
                        <el-radio :label="1">只看应该下架商品</el-radio>
                        <el-radio :label="2">只看应该上架商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="operation">
                <el-button type="primary" size="medium" @click="batchAdviceCheck" v-if="hasPermission('BTN_BATCH_ADVICE')">
                    批量采纳建议
                </el-button>
                <el-button type="primary" size="medium" @click="batchOnCheck" v-if="hasPermission('BTN_BATCH_ON_SHELVE')">
                    批量上架
                </el-button>
                <el-button type="primary" size="medium" @click="batchOff" v-if="hasPermission('BTN_BATCH_OFF_SHELVE')">
                    批量下架
                </el-button>
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table ref="productTable" border height="100%" :data="dataList" v-loading="loading" @selection-change="handleAttrSelectionChange"
                row-key="id" :tree-props="{children: 'skuUnit', hasChildren: 'hasChildren'}">
                <el-table-column type="selection" :selectable='checkboxSelect' width="50" align="center" fixed="left"></el-table-column>
                <el-table-column key="1" prop="productId" label="商品ID" align="center" min-width="120px" fixed="left">
                    <template slot-scope="scope">
                        <span v-if="scope.row.hasSku" :class="(scope.row.suggest === 1 && scope.row.shelveStatus === 2) || (scope.row.suggest === 2 && scope.row.shelveStatus === 1) ? 'row-warning' : ''">{{scope.row.productId}}</span>
                        <span v-else :class="(scope.row.suggest === 3 && scope.row.saleStatus === 2) || (scope.row.suggest === 4 && scope.row.saleStatus === 1) ? 'row-warning' : ''">{{scope.row.skuId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  key="12" prop="title" label="商品信息" align="center" min-width="260px" >
                     <template slot-scope="scope">
                        <div class="flex flex-item--center" v-if="scope.row.hasSku">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                              <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                              <img :src="dealShowFileSrc(scope.row.cover)" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                                <span class="block-right" :class="(scope.row.suggest === 1 && scope.row.shelveStatus === 2) || (scope.row.suggest === 2 && scope.row.shelveStatus === 1) ? 'row-warning' : ''"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical"
                                    >
                                    {{scope.row.title}}
                                </span>
                            </el-tooltip>
                        </div>
                        <div v-else :class="(scope.row.suggest === 3 && scope.row.saleStatus === 2) || (scope.row.suggest === 4 && scope.row.saleStatus === 1) ? 'row-warning' : ''">
                            {{scope.row.attrValueNameText}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column key="4" prop="stock" label="可售库存" align="center" min-width="80px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.suggest != 5" :class="(scope.row.suggest === 1 && scope.row.shelveStatus === 2) || (scope.row.suggest === 2 && scope.row.shelveStatus === 1)  || (scope.row.suggest === 3 && scope.row.saleStatus === 2) || (scope.row.suggest === 4 && scope.row.saleStatus === 1)  ? 'row-warning' : ''">{{scope.row.stock}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column key="5" prop="" label="库存建议" align="center" width="120px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.suggest === 1" :class="(scope.row.suggest === 1 && scope.row.shelveStatus === 2) || (scope.row.suggest === 2 && scope.row.shelveStatus === 1) ? 'row-warning' : ''">建议上架</span>
                        <span v-if="scope.row.suggest === 2" :class="(scope.row.suggest === 1 && scope.row.shelveStatus === 2) || (scope.row.suggest === 2 && scope.row.shelveStatus === 1) ? 'row-warning' : ''">建议下架</span>
                        <span v-if="scope.row.suggest === 3" :class="(scope.row.suggest === 3 && scope.row.saleStatus === 2) || (scope.row.suggest === 4 && scope.row.saleStatus === 1) ? 'row-warning' : ''">建议在售</span>
                        <span v-if="scope.row.suggest === 4" :class="(scope.row.suggest === 3 && scope.row.saleStatus === 2) || (scope.row.suggest === 4 && scope.row.saleStatus === 1) ? 'row-warning' : ''">建议停售</span>
                        <span v-if="scope.row.suggest === 5" class="no-suggess">边售边采</span>
                        <span v-if="scope.row.suggest === 6" class="no-suggess">预售商品</span>
                    </template>
                </el-table-column>
                <el-table-column key="6" prop="" label="当前状态" align="center" width="120px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.hasSku" :class="(scope.row.suggest === 1 && scope.row.shelveStatus === 2) || (scope.row.suggest === 2 && scope.row.shelveStatus === 1) ? 'row-warning' : ''">
                            <span v-if="scope.row.shelveStatus === 1">已上架</span>
                            <span v-if="scope.row.shelveStatus === 2">已下架</span>
                        </div>
                        <div v-else :class="(scope.row.suggest === 3 && scope.row.saleStatus === 2) || (scope.row.suggest === 4 && scope.row.saleStatus === 1) ? 'row-warning' : ''">
                            <span v-if="scope.row.saleStatus === 1">在售中</span>
                            <span v-if="scope.row.saleStatus === 2">已停售</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column key="7" fixed="right" label="操作" align="center" width="250px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.hasSku">
                            <el-button type="danger" plain size="mini" v-if="hasPermission('BTN_BATCH_ADVICE')" :disabled="((scope.row.suggest === scope.row.shelveStatus || scope.row.suggest === 5) || scope.row.suggest === 6)" @click="singleAcceptAdviceCheck(scope.row.productId)">采纳建议</el-button>
                            <el-button v-if="scope.row.shelveStatus === 1 && hasPermission('BTN_BATCH_OFF_SHELVE') " type="success" plain size="mini" @click="showShelveReason(scope.row)">下架</el-button>
                            <el-button v-if="scope.row.shelveStatus === 2 && hasPermission('BTN_BATCH_ON_SHELVE')" type="warning" plain size="mini" @click="singleOnShelveCheck(scope.row.productId)">上架</el-button>
                        </div>
                        <div v-else>
                            <el-button v-if="scope.row.saleStatus === 1 && hasPermission('BTN_OFF_SALE')" type="warning" plain size="mini" @click="changeSaleStatusRequest(scope.row, 2)">停售</el-button>
                            <el-button v-if="scope.row.saleStatus === 2 && hasPermission('BTN_ON_SALE')" type="success" plain size="mini" @click="changeSaleStatusRequest(scope.row, 1)">在售</el-button>
                        </div>
                        <!-- <el-button type="text" size="mini" @click="handleToggleRowExpansion(scope.row)">展开SKU</el-button> -->
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
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancle" @on-confirm="comfirm"></confirm-dialog>
        <shelve-reason-dialog :dialogVisible="reasonVisible" @on-cancle="cancleReason" @on-confirm="confirmReason"></shelve-reason-dialog>
        <confirm-shelve-dialog :dialogVisible="confirmShelveVisible" :dialogType="dialogType" :checkResult="checkResult" :countryCode="activeCountry"
            @on-cancle="cancleConfirmShelve" @on-confirm="confirmShelve"></confirm-shelve-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import ShelveReasonDialog from './components/ShelveReasonDialog'
    import ConfirmShelveDialog from './components/ConfirmShelveDialog'

    import { categoryListGet, createUploadTask, getShelveList, batchAcceptShelveAdviceCheck,
        batchAcceptShelveAdvice, batchOnShelveCheck, batchOnShelve, batchOffShelve, changeSaleStatus } from '@/request/product'

    export default {
        // 商品上下架管理
        name: 'ShelveManage',
        data() {
            return {
                countryList: [],
                activeCountry: 'MY',
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                total: 0,
                attrId: '',
                queryData: {
                    countryCode: 'MY',
                    saleWay: '',
                    categoryIds: [],
                    radio: null,
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                saleWayList: [{
                    value: '1',
                    label: '售完即止'
                }, {
                    value: '2',
                    label: '边售边采'
                }],
                backCategoryOptions: [],
                dataList: [{
                    productId: '123322323',
                    title: '蓝牙耳机 5.0双耳通话蓝牙',
                    hasChildren: true,
                    children: [{
                        productId: '1233223223',
                        title: '蓝牙耳机 5.0双耳通话蓝牙',
                    }]
                }],
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                confirmType: '',
                reasonVisible: false,
                selectedRow: [],
                confirmShelveVisible: false,
                checkResult: [],
                dialogType: ''
            }
        },
        components: {
            ConfirmDialog,
            ShelveReasonDialog,
            ConfirmShelveDialog
        },
        computed: {
            languageList() {
                return this.$store.state.dict.languageList
            }
        },
        created() {
            this.countryList = JSON.parse(this.getStore('countryList'))
            this.fetchCategory({
                level: 1,
                cateType: 2,
                resolve: (data) => {
                    this.backCategoryOptions = data
                }
            })
        },
        mounted() {
            this.getShelveListRequest()
        },
        methods: {
            handleTabClick(tab, event) {
                this.resetSearch()
                this.activeCountry = tab.name
                this.queryData.countryCode = tab.name
                this.getShelveListRequest()
            },
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            /**
             * 条件搜索
            */
            search() {
                this.queryData.page.pageNum = 1
                this.getShelveListRequest()
            },
            resetSearch() {
                this.$refs.shelveFilterForm.resetFields()
                this.queryData.cateId = null
                this.queryData.showShouldOffShelve = null
                this.queryData.showShouldOnShelve = null
                this.getShelveListRequest()
            },
            getShelveListRequest() {
                this.loading = true
                let params = this.queryData
                getShelveList(this.filterData(params)).then((res) => {
                    this.loading = false
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        _.forEach(res.spuUnit, item => {
                            if (item.skuUnit.length>0) {
                                item.hasSku = true
                                _.forEach(item.skuUnit, unit => {
                                    unit.id = unit.skuId
                                    let attrValueName = []
                                    _.forEach(unit.skuAttr, attr => {
                                        attrValueName.push(attr.valueName)
                                    })
                                    unit.attrValueNameText = attrValueName.join('、')
                                })
                            }
                            item.id = item.productId
                        })
                        this.dataList = res.spuUnit
                        this.total = res.total
                    }
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getShelveListRequest()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getShelveListRequest()
            },
            cancle() {
                this.confirmVisible = false
            },
            comfirm() {
                this.confirmVisible = false
                if (this.confirmType === 'attr') {
                    this.delProductAttr()
                } else {
                    this.delProductAttrValue()
                }
            },
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
            setBackCateId () {
                if (this.queryData.categoryIds && this.queryData.categoryIds.length > 0) {
                    let cateInfo = JSON.parse(this.queryData.categoryIds[this.queryData.categoryIds.length - 1])
                    this.queryData.cateId = cateInfo.cateId
                    // this.queryData.cateId = '926'
                } else {
                    this.queryData.cateId = null
                    this.queryData.radio = null
                    this.queryData.showShouldOffShelve = null
                    this.queryData.showShouldOnShelve = null
                }
            },
            handleRadioGroupChange(val) {
                if (this.queryData.categoryIds.length === 0) {
                    this.$message.warning('请选择后台类目')
                    this.queryData.radio = null
                    return
                } else {
                    if (val === 1) {
                        this.queryData.showShouldOffShelve = 'ture'
                        this.queryData.showShouldOnShelve = null
                    } else {
                        this.queryData.showShouldOffShelve = null
                        this.queryData.showShouldOnShelve = 'ture'
                    }
                }

            },
            handleAttrSelectionChange(val) {
                console.log(val)
                this.selectedRow = val
            },
            load(tree, treeNode, resolve) {
                setTimeout(() => {
                  resolve([
                    {
                      productId: 31,
                      title: 'title 1519'
                    }, {
                      productId: 32,
                      title: 'title'
                    }
                  ])
                }, 1000)
            },
            checkboxSelect(row) {
                if (row.hasOwnProperty('hasSku')){
                    return true
                } else {
                    return false
                }
            },
            handleToggleRowExpansion(row) {
                console.log(row)
                this.$refs.productTable.toggleRowExpansion(row, false);
            },
            changeSaleStatusRequest(row, saleStatus) {
                let params = {
                    productId: row.productId,
                    skuId: row.skuId,
                    countryCode: this.activeCountry,
                    saleStatus: saleStatus,
                }
                changeSaleStatus(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        _.forEach(this.dataList, item => {
                            if (row.productId === item.productId) {
                                _.forEach(item.skuUnit, sku => {
                                    if (row.skuId === sku.skuId) {
                                        sku.saleStatus = saleStatus
                                    }
                                })
                            }
                        })
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            singleAcceptAdviceCheck(productId) {
                let params = {
                    productId: [productId],
                    countryCode: this.activeCountry
                }
                this.batchAcceptAdviceCheck(params)
            },
            /**
             * 批量采纳建议检查
            */
            batchAcceptAdviceCheck(params) {
                batchAcceptShelveAdviceCheck(this.filterData(params)).then((res) => {
                    let reasonList = []
                    if (res.ret.errcode === 1) {
                        reasonList = res.reason
                        this.checkResult = reasonList
                        this.confirmShelveVisible = true
                        this.dialogType = 'acceptAdvice'
                        console.log(reasonList)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 批量采纳建议
            */
            batchAcceptAdvice(params) {
                batchAcceptShelveAdvice(this.filterData(params)).then((res) => {

                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 批量上架检查
            */
            batchOnShelveCheckRequest(params) {
                batchOnShelveCheck(this.filterData(params)).then((res) => {
                    let reasonList = []
                    if (res.ret.errcode === 1) {
                        reasonList = res.reason
                        this.checkResult = reasonList
                        this.confirmShelveVisible = true
                        this.dialogType = 'onShelve'
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 批量上架确认
            */
            batchOnShelveConfirm(row) {
                let params = {
                    productId: [row.productId],
                    countryCode: this.activeCountry
                }
                batchOnShelve(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 批量下架
            */
            batchOffShelveConfirm(params) {
                batchOffShelve(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('下架操作成功！')
                        this.getShelveListRequest()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            showShelveReason(row) {
                this.reasonVisible = true
                this.selectedRow = [row]
            },
            cancleReason() {
                this.reasonVisible = false
            },
            confirmReason(data) {
                this.reasonVisible = false
                let productIds = []
                _.forEach(this.selectedRow, item => {
                    // 过滤已下架状态的
                    if (item.shelveStatus === 1) {
                        productIds.push(item.productId)
                    }
                })
                let params = {
                    productId: productIds,
                    countryCode: this.activeCountry,
                    offReason: data.offReason
                }
                this.batchOffShelveConfirm(params)
            },
            singleOnShelveCheck (productId) {
                let params = {
                    productId: [productId],
                    countryCode: this.activeCountry
                }
                this.batchOnShelveCheckRequest(params)
            },
            onShelveCheck() {
                let productIds = []
                _.forEach(this.selectedRow, item => {
                    // 过滤已上架的、库存为0的商品
                    if ((item.shelveStatus === 2 && item.stock != 0) || (item.shelveStatus === 2 && item.suggest === 5) || (item.shelveStatus === 2 && item.suggest === 6)) {
                        productIds.push(item.productId)
                    }
                })
                if (productIds.length === 0) {
                    this.$message.warning('未勾选【未上架】商品')
                    return
                }
                let params = {
                    productId: productIds,
                    countryCode: this.activeCountry
                }
                this.batchOnShelveCheckRequest(params)
            },
            batchOff() {
                if (this.selectedRow.length === 0) {
                    this.$message.warning('请选择需要批量下架的商品')
                    return
                }
                let productIds = []
                _.forEach(this.selectedRow, item => {
                    // 过滤
                    if (item.shelveStatus === 1) {
                        productIds.push(item.productId)
                    }
                })
                if (productIds.length === 0) {
                    this.$message.warning('未勾选【未上架】商品')
                    return
                }
                this.reasonVisible = true
            },
            batchOnCheck() {
                if (this.selectedRow.length === 0) {
                    this.$message.warning('请选择需要批量上架的商品')
                    return
                }
                this.onShelveCheck()
            },
            cancleConfirmShelve() {
                this.confirmShelveVisible = false
                this.getShelveListRequest()
            },
            confirmShelve() {
                this.confirmShelveVisible = false
                this.getShelveListRequest()
            },

            batchAdviceCheck() {
                let productIds = []
                _.forEach(this.selectedRow, item => {
                    // 过滤
                    if ((item.suggest != item.shelveStatus) && item.suggest != 5 && item.suggest != 6)  {
                        productIds.push(item.productId)
                    }
                })
                if (productIds.length === 0) {
                    this.$message.warning('请选择需要可批量【采纳建议】的商品')
                    return
                }
                let params = {
                    productId: productIds,
                    countryCode: this.activeCountry
                }
                this.batchAcceptAdviceCheck(params)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .operation {
        margin-bottom: 10px;
    }
    .no-suggess {
        color: #d3d3d3;
    }
    .row-warning {
        color: #D9001B;
    }
</style>

