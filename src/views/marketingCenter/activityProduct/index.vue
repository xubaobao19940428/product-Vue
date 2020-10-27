<template>
    <div class="app-container">
        <div class="main-content-tab-box">
            <div class="tab-l">
                <el-tabs v-model="activeName" @tab-click="getList(1)">
                    <el-tab-pane label="全部活动商品" name="-1"></el-tab-pane>
                    <el-tab-pane v-for="(item, key) in activeProductStatusEnum" :key="key" :label="item" :name="key"></el-tab-pane>
                </el-tabs>
                <!-- <el-button :class="['search-btn', 'mar-l-10', showSearchParam ? 'active' : '']" icon="el-icon-search" size="small"
                           @click="showSearchParam = !showSearchParam">搜索</el-button> -->
            </div>
            <div class="tab-r">
                <el-button v-if="hasPermission('BTN_ACTIVITY_PRODUCT_DOWNLOAD')" @click="batchInsertDialog.show = true" icon="el-icon-upload" type="primary" size="medium">批量上传</el-button>
                <el-button v-if="hasPermission('BTN_ACTIVITY_PRODUCT_ADD')" @click="editDialogAction('add')" icon="el-icon-plus" type="primary" size="medium" >新建</el-button>
            </div>
        </div>
        <el-collapse-transition>
            <!-- <div v-if="showSearchParam"> -->
                <el-form inline label-width="90px">
                    <el-form-item label="商品ID：">
                        <el-input placeholder="请输入" size="medium" v-model="param.productId"></el-input>
                    </el-form-item>
                    <el-form-item label="活动ID：">
                        <el-select v-model="param.activeId" clearable @change="getActivityLabel" filterable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in activityList"
                                       :key="index"
                                       :label="item.activeName"
                                       :value="item.activeId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品角标：">
                        <el-input placeholder="请输入" size="medium" v-model="param.productCorner"></el-input>
                    </el-form-item>
                    <span v-show="drop">
                        <el-form-item label="商品标题：">
                            <el-input placeholder="请输入" size="medium" v-model="param.productName"></el-input>
                        </el-form-item>
                        <el-form-item label="促销ID：">
                             <el-input placeholder="请输入" size="medium" v-model="param.promotionId"></el-input>
                        </el-form-item>
                        <el-form-item label="分组标签：">
                            <el-select v-model="param.groupLabelId" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in activityLabel"
                                           :key="index"
                                           :label="getMultiLangShowInfo(item.name)"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="国家：">
                            <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in countryList"
                                        :key="index"
                                        :label="item.nameEn + '/' + item.nameCn "
                                        :value="item.shortCode"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="页面时效：">
                            <el-date-picker type="daterange" value-format="timestamp"
                                            start-placeholder="开始时间" end-placeholder="结束时间"
                                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </span>
                    <el-form-item class="filter-item" style="margin-left: 20px;">
                        <el-button type="primary" size="medium"
                                    icon="el-icon-search"
                                @click="getList(1)">搜索
                        </el-button>
                        <el-button size="medium"
                                    icon="el-icon-refresh-left"
                                @click="resetSearch">重置
                        </el-button>
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                            {{dropDownContent}}
                            <i :class="dropDownIcon"></i>
                        </el-link>
                        <!--<el-button plain type="success" size="small"-->
                                <!--@click="download">下载-->
                        <!--</el-button>-->
                    </el-form-item>
                </el-form>
            <!-- </div> -->
        </el-collapse-transition>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :loading="loading"
                      :data="dataList">
                <el-table-column label="商品ID" prop="productId" align="center" min-width="180px"></el-table-column>
                <el-table-column label="商品信息" align="center" min-width="260px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                              <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                              <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.productName}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="国家" align="center" width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="活动价" align="center" width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.activePrice }}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" width="160px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.startTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" width="160px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.endTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="活动ID" prop="activeId" min-width="130px" header-align="center"></el-table-column>
                <el-table-column label="活动名称" prop="activeName" min-width="130px" align="center"></el-table-column>
                <el-table-column label="促销ID" prop="promotionId" min-width="130px" header-align="center"></el-table-column>
                <el-table-column label="分组标签" prop="groupLabel" min-width="170px" header-align="center">
                    <template slot-scope="scope">
                        <span>{{ getMultiLangShowInfo(scope.row.groupLabel) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品角标" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        <span>{{ getMultiLangShowInfo(scope.row.productCorner) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="营销主图" min-width="180px" align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            trigger="hover">
                            <img :src="getMultiLangShowInfo(scope.row.promotionCover, 'image')" class="previewImage">
                            <img :src="getMultiLangShowInfo(scope.row.promotionCover, 'image')" class="thumbnail" slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operationName" min-width="100px" align="center"></el-table-column>
                <el-table-column label="更新时间" width="160px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="130px">
                    <template slot-scope="scope">
                        <div class="table-action-btn-box">
                            <el-button v-if="hasPermission('BTN_ACTIVITY_PRODUCT_SKU_DETAIL')" @click="showSkuDetail(scope.row)"  type="text" size="mini">规格详情</el-button>
                            <el-button v-if="hasPermission('BTN_ACTIVITY_PRODUCT_EDIT')" @click="editDialogAction('edit', scope.row)" type="text" size="mini">编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="param.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="param.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <transition name="el-fade-in">
            <activity-product-edit v-if="editDialog.show"
                                   :propShowDialog="editDialog.show"
                                   :propParam="editDialog.param"
                                   :defaultSkuList="defaultSkuList"
                                   :activityList="activityList"
                                   :curType="curType"
                                   @confirm="confirmAddItem"
                                   @close="closeEditDialog"></activity-product-edit>
        </transition>
        <transition name="el-fade-in">
            <sku-detail-dialog v-if="skuDialog.show" :propShowDialog="skuDialog.show" :defaultSkuList="defaultSkuList" @close="closeSkuDetail"></sku-detail-dialog>
        </transition>
        <upload-excel-dialog :propShowDialog="batchInsertDialog.show" @close="closeBatchInsertDialog" @confirm="confirmAddItem"></upload-excel-dialog>
    </div>
</template>
<script>
    import activityProductEdit from './components/activityProductEdit'
    import uploadExcelDialog from './components/uploadExcelDialog'
    import skuDetailDialog from './components/skuDetailDialog'
    import { listActiveProduct, selectActive, getActiveProductSku, listAllActiveGroup } from '@/request/marketing.js'
    import common from '@/js/common/mixins'
    export default {
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                param: {
                    activeId: '',
                    productId: '',
                    productCorner: '',
                    productName: '',
                    promotionId: '',
                    groupLabelId: '',
                    countryCode: '',
                    status: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                showSearchParam: false,
                activeName: '-1',
                totals: 0,
                activeProductStatusEnum: {
                    0: '即将开始',
                    1: '进行中',
                    2: '已结束'
                },
                dataList: [],
                timeList: [],
                activityList: [], // 活动列表
                promotionList: [], // 促销列表
                editDialog: {
                    show: false,
                    param: {}
                },
                defaultSkuList: [],
                skuDialog: {
                    show: false,
                    list: []
                },
                batchInsertDialog: {
                    show: false
                },
                activityLabel: [],
                loading: false,
                curType: 'add' // 当前操作状态
            }
        },
        mixins: [common],
        components: {
            activityProductEdit,
            uploadExcelDialog,
            skuDetailDialog
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        created () {
            this.getActivityList()
            this.getList()
            this.getActivityLabel()
        },
        methods: {
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
            // 获取活动列表
            getActivityList () {
                selectActive({}).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityList = res.activeSelectInfo
                    }
                })
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.loading = true
                this.param.page.pageNum = page || this.param.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                this.param.status = this.activeName == '-1' ? null : parseInt(this.activeName)
                listActiveProduct(this.filterData(Object.assign(this.param, {
                    startTime: !this.timeList[0] ? null : this.timeList[0],
                    endTime: !this.timeList[1] ? null : this.timeList[1]
                }))).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.dataList = res.activeProductInfo
                        this.totals = res.total
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            resetSearch () {
                this.param = {
                    activeId: '',
                    productId: '',
                    productCorner: '',
                    productName: '',
                    promotionId: '',
                    groupLabelId: '',
                    countryCode: '',
                    status: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.timeList = []
            },
            download () {
            },
            getActivityLabel () {
                listAllActiveGroup(this.filterData({
                    activeId: this.param.activeId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityLabel = res.groupInfo
                    }
                })
            },
            editDialogAction (type, data) {
                console.log(data)
                switch (type) {
                    case 'add':
                        this.editDialog.param = {}
                        this.curType = 'add'
                        break
                    case 'edit':
                        this.getActiveProSku(data.productId, data.activeId)
                        this.editDialog.param = JSON.parse(JSON.stringify(data))
                        if (!this.editDialog.param.groupLabelId) {
                            this.editDialog.param.groupLabelId = ''
                        }
                        this.curType = 'edit'
                        break
                }
                this.editDialog.show = true
            },
            closeEditDialog () {
                this.editDialog.show = false
            },
            confirmAddItem () {
                this.editDialog.show = false
                this.batchInsertDialog.show = false
                this.getList()
            },
            showSkuDetail (data) {
                this.skuDialog.show = true
                this.getActiveProSku(data.productId, data.activeId)
            },
            // 获取活动商品sku
            getActiveProSku (productId, activeId) {
                getActiveProductSku({
                    activeId: activeId,
                    productId: productId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log('getActiveProSku')
                        this.defaultSkuList = res.activeProductSkuInfo
                    }
                })
            },
            closeSkuDetail () {
                this.skuDialog.show = false
            },
            closeBatchInsertDialog () {
                this.batchInsertDialog.show = false
            }
        }
    }
</script>
<style lang="scss" scoped></style>
