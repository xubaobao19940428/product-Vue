<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="presaleFilterForm" inline label-width="90px" :model="queryData">
                <el-form-item label="商品：" class="filter-item" prop="type">
                    <el-select v-model="queryData.type" filterable clearable style="width: 110px" size="medium" placeholder="选择类型">
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="queryData.value" style="width: 200px; margin-right: 20px;" size="medium" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="销售国家：" class="filter-item" prop="countryCodeKey">
                    <el-select v-model="queryData.countryCodeKey" clearable size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预售状态：" class="filter-item" prop="advanceStatusKey">
                    <el-select v-model="queryData.advanceStatusKey" clearable size="medium">
                        <el-option v-for="(item, index) in advanceStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采购控制：" class="filter-item" prop="purchaseConfigKey">
                    <el-select v-model="queryData.purchaseConfigKey" clearable size="medium">
                        <el-option v-for="(item, index) in purchaseConfigList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出库仓库：" class="filter-item" prop="warehouseNoKey">
                    <el-select v-model="queryData.warehouseNoKey" clearable ize="medium">
                        <el-option v-for="(item, index) in warehouseList" :key="index" :label="item.warehouseName" :value="item.warehouseNo"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="" class="filter-item" prop="operatorId">
                    <el-checkbox v-model="queryData.only">只看超时未推单商品</el-checkbox>
                </el-form-item> -->
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button plain type="primary" icon="el-icon-download" @click="downloadPresale" size="medium">下载</el-button>
                </el-form-item>
            </el-form>
            <div class="operate-container">
                <el-button v-if="hasPermission('BTN_PRODUCT_PRESALE_ADD')" type="primary" size="medium" icon="el-icon-plus" @click="addPresale">新增预售商品</el-button>
                <el-button v-if="hasPermission('BTN_PRODUCT_PRESALE_BATCH_ADD')" plain type="primary" size="medium" icon="el-icon-upload2" @click="batchImport">批量导入</el-button>
                <el-button v-if="hasPermission('BTN_PRODUCT_PRESALE_PUSH_PURCHASE')" type="primary" size="medium" style="float: right;"  @click="pushPurchase">手动推采购单</el-button>
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="tableData" v-loading="loading" border fit highlight-current-row height="100%" style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="advanceId" fixed="left" label="预售ID" align="center" width="130px">
                    <template slot-scope="scope">
                         <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.advanceId }}
                         </span>
                    </template>
                </el-table-column>
                <el-table-column prop="skuCode" fixed="left" label="skuCode" align="center" width="130px">
                    <template slot-scope="scope">
                         <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.skuCode }}
                         </span>
                    </template>
                </el-table-column>
                <el-table-column prop="productId" label="商品ID" align="center" width="130px">
                    <template slot-scope="scope">
                         <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.productId }}
                         </span>
                    </template>
                </el-table-column>
                <el-table-column label="商品信息" align="center" width="260px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                              <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                              <img :src="dealShowFileSrc(scope.row.cover)" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical"
                                    :class="scope.row.isWarning ? 'row-warning' : ''">
                                    {{scope.row.name}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="skuValue" label="规格信息" align="center" width="120px">
                    <template slot-scope="scope">
                         <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.attrValueList }}
                         </span>
                    </template>
                </el-table-column>
                <el-table-column prop="countryCode" label="预售国家" align="center" width="100px">
                    <template slot-scope="scope">
                         <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.countryCode | countryFilter }}
                         </span>
                    </template>
                </el-table-column>
                <el-table-column prop="advanceStatus" label="状态" align="center" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.advanceStatus === 0" :class="scope.row.isWarning ? 'row-warning' : ''">-</span>
                        <span v-if="scope.row.advanceStatus === 1" :class="scope.row.isWarning ? 'row-warning' : ''">未开始</span>
                        <span v-if="scope.row.advanceStatus === 2" :class="scope.row.isWarning ? 'row-warning' : ''">预售中</span>
                        <span v-if="scope.row.advanceStatus === 3" :class="scope.row.isWarning ? 'row-warning' : ''">已结束</span>
                    </template>
                </el-table-column>
                <el-table-column prop="productId" label="预售开始时间" align="center" width="160px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.startTime | secondTimeFormat }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="预售结束时间" align="center" width="160px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.endTime | secondTimeFormat }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseConfig" label="采购控制" align="center" min-width="80px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.purchaseConfig === 1" :class="scope.row.isWarning ? 'row-warning' : ''">自动推单</span>
                        <span v-if="scope.row.purchaseConfig === 2" :class="scope.row.isWarning ? 'row-warning' : ''">手动推单</span>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseDeadline" label="最迟推单时间" align="center" width="160px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.purchaseDeadline | secondTimeFormat }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="deliveryDeadline" label="最迟发货时间" align="center" width="160px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.deliveryDeadline | secondTimeFormat }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="出库仓库" align="center" width="120px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.warehouseName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="预售库存/预售库存预留" align="center" width="130px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.advanceStock }}/ {{scope.row.restAdvanceStock}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="已售子单量/待推采购单/超时未推单" align="center" width="170px">
                    <template slot-scope="scope">
                        <span :class="scope.row.isWarning ? 'row-warning' : ''">
                            {{ scope.row.soldChildOrderCount }}/ {{scope.row.readyToPushPurchaseOrderCount}} / {{scope.row.overduePurchaseOrderCount}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-button  v-if="hasPermission('BTN_PRODUCT_PRESALE_EDIT')" type="text" size="mini" @click="editPresale(scope.row)" >编辑</el-button>
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
        <product-presale-edit :dialogVisible="presaleDialogVisible" :title="presaleTitle" :editType="editType" :presaleData="presaleData"
            @on-confirm="handleConfirm" @on-cancle="handleCancle">
        </product-presale-edit>
        <upload-file-dialog :dialogVisible="uploadDialogVisible" @on-confirm="handleUploadConfirm" @on-cancle="handleUploadCancle"></upload-file-dialog>
    </div>
</template>

<script>
    import { advanceSaleList, advanceSaleDownload, manualPushAdvancePurchase } from '@/request/product'
    import { warehousePage } from '@/request/warehouse'
    import ProductPresaleEdit from './ProductPresaleEdit.vue'
    import UploadFileDialog from './components/UploadFileDialog.vue'
    export default {
        // 商品预售
        name: 'presale',
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                total: 0,
                visible: false,
                draftId: '',
                operatorList: [],
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
                advanceStatusList: [
                    {
                        label: '未开始',
                        value: '1'
                    }, {
                        label: '预售中',
                        value: '2'
                    }, {
                        label: '已结束',
                        value: '3'
                    }
                ],
                purchaseConfigList: [
                    {
                        label: '自动推单',
                        value: '1'
                    }, {
                        label: '手动推单',
                        value: '2'
                    }
                ],
                warehouseList: [],
                queryData: {
                    type: '',
                    value: '',
                    productIdKey: '',
                    skuIdKey: '',
                    skuCodeKey: '',
                    nameKey: '',
                    countryCodeKey: '',
                    advanceTypeKey: '',
                    purchaseConfigKey: '',
                    warehouseNoKey: '',
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                tableData: [],
                presaleDialogVisible: false,
                presaleTitle: '',
                editType: '',
                presaleData: null,
                uploadDialogVisible: false,
                presaleSkuList: []
            }
        },
        components: {
            ProductPresaleEdit,
            UploadFileDialog
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        watch: {
        },
        created () {
            this.getWarehouseList()
        },
        mounted () {
            this.getPresaleList()
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
            /**
             * 获取仓库列表
            */
            getWarehouseList () {
                let params = {
                    page: {
                        pageSize: 100,
                        pageNum: 1
                    }
                }
                warehousePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        // res.list.map((item,index)=>{
                        //     if(item.warehouseNo!='0005'){
                        //         res.list.splice(index,1)
                        //     }
                        // })
                        this.warehouseList = res.list
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getPresaleList() {
                let params = this.filterData(this.queryData)
                switch (this.queryData.type) {
                     case '1':
                        params.productIdKey = this.queryData.value
                        params.skuIdKey = ''
                        params.skuCodeKey = ''
                        params.nameKey = ''
                     break;
                     case '2':
                        params.productIdKey = ''
                        params.skuIdKey = this.queryData.value
                        params.skuCodeKey = ''
                        params.nameKey = ''
                     break;
                     case '3':
                        params.productIdKey = ''
                        params.skuIdKey = ''
                        params.skuCodeKey = this.queryData.value
                        params.nameKey = ''
                     break;
                     case '4':
                        params.productIdKey = ''
                        params.skuIdKey = ''
                        params.skuCodeKey = ''
                        params.nameKey = this.queryData.value
                     break;
                     default:
                        params.productIdKey = ''
                        params.skuIdKey = ''
                        params.skuCodeKey = ''
                        params.nameKey = ''
                     break;
                }
                advanceSaleList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.tableData = res.advanceUnit
                        _.forEach(this.tableData, item => {
                            // 若某预售商品的最迟推单时间比当前时间早，且待推采购单数量>0，则整行标红显示。
                            let now = new Date().getTime()
                            if (now > item.purchaseDeadline && item.readyToPushPurchaseOrderCount > 0) {
                                item.isWarning = true
                            }
                            let attrValueList = []
                            _.forEach(item.skuValue, skuValueItem => {
                                attrValueList.push(skuValueItem.valueName)
                            })
                            item.attrValueList = attrValueList.join('、')
                        })
                        this.total = res.total
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            search () {
                this.queryData.page.pageNum = 1
                this.getPresaleList()
            },
            resetSearch () {
                this.$refs.presaleFilterForm.resetFields()
                this.queryData.value = ''
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getPresaleList()
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getPresaleList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getPresaleList()
            },
            addPresale() {
                this.presaleDialogVisible = true
                this.presaleTitle = '新增预售商品'
                this.editType = 'add'
            },
            handleConfirm() {
                this.presaleDialogVisible = false
                this.getPresaleList()
            },
            handleCancle() {
                this.presaleDialogVisible = false
            },
            batchImport() {
                this.uploadDialogVisible = true
            },
            handleUploadConfirm() {
                this.uploadDialogVisible = false
                this.getPresaleList()
            },
            handleUploadCancle() {
                this.uploadDialogVisible = false
            },
            editPresale(data) {
                this.editType = 'edit'
                this.presaleData = {
                    advanceId: data.advanceId,
                    productId: data.productId,
                    countryCode: data.countryCode
                }
                this.presaleTitle = '编辑预售商品'
                this.presaleDialogVisible = true
            },
            handleSelectionChange(val) {
                this.presaleSkuList = val
            },
            downloadPresale() {
                switch (this.queryData.type) {
                     case '1':
                        this.queryData.productIdKey = this.queryData.value
                        this.queryData.skuIdKey = ''
                        this.queryData.skuCodeKey = ''
                        this.queryData.nameKey = ''
                     break;
                     case '2':
                        this.queryData.productIdKey = ''
                        this.queryData.skuIdKey = this.queryData.value
                        this.queryData.queryDatarams.skuCodeKey = ''
                        this.queryData.nameKey = ''
                     break;
                     case '3':
                        this.queryData.productIdKey = ''
                        this.queryData.skuIdKey = ''
                        this.queryData.skuCodeKey = this.queryData.value
                        this.queryData.nameKey = ''
                     break;
                     case '4':
                        this.queryData.productIdKey = ''
                        this.queryData.skuIdKey = ''
                        this.queryData.skuCodeKey = ''
                        this.queryData.nameKey = this.queryData.value
                     break;
                     default:
                        this.queryData.productIdKey = ''
                        this.queryData.skuIdKey = ''
                        this.queryData.skuCodeKey = ''
                        this.queryData.nameKey = ''
                     break;
                }
                let params = _.pick(this.queryData, ['productIdKey', 'skuIdKey', 'skuCodeKey', 'nameKey',
                                                     'countryCodeKey', 'advanceTypeKey', 'purchaseConfigKey', 'warehouseNoKey'])
                let advanceItemList = []
                _.forEach(this.presaleSkuList, item => {
                    let advanceItem = {
                        advanceId: item.advanceId,
                        skuId: item.skuId
                    }
                    advanceItemList.push(advanceItem)
                })
                params.advanceItem = advanceItemList
                advanceSaleDownload(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.downloadUrl
                        window.open(`${this.dealShowFileSrc(fileUrl)}`)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 手动推采购单
            pushPurchase() {
                let skuList = []
                _.forEach(this.presaleSkuList, item => {
                    let sku = {
                        advanceId: item.advanceId,
                        skuCode: item.skuCode
                    }
                    skuList.push(sku)
                })
                let params = {
                    sku: skuList
                }
                manualPushAdvancePurchase(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('采购单推送成功')
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .row-warning {
        color: #D9001B;
    }
</style>
