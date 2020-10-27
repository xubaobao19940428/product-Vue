<template>
    <div class="add-product-dialog">
        <el-dialog
            title="添加商品"
            :visible="showAddProduct"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <el-tabs v-model="activeTab" type="card" @tab-click="handleClick(activeTab)">
                <template v-if="activityType == 'groupActivity'">
                    <!-- 添加拼团专题商品-->
                    <el-tab-pane label="添加专题" name="groupActivityData" :disabled="!!(selectedType && selectedType != 'groupActivityData')">
                        <div class="activity-input">
                            <el-input
                                placeholder="输入拼团专题"
                                v-model="groupActivityData.value"
                                @keyup.enter.native="getSubjectData(1)"
                                style="width: 80%"
                                clearable
                            >
                                <i slot="suffix" class="el-icon-search el-input__icon" @click="getSubjectData(1)"></i>
                            </el-input>
                            <p class="center">当前已选中：<el-tag v-for="item in selectedId" :key="item" closable @close="selectedId = []">{{ item }}</el-tag></p>
                            <p class="cr">单选，点击对应列表项即可选中</p>
                        </div>
                        <el-table
                            :data="groupActivityData.dataList"
                            v-loading="load"
                            ref="groupActivityTable"
                            highlight-current-row
                            @current-change="(val) => handleSimpleSelect(val, 'subjectSerialId')"
                        >
                            <el-table-column label="专题ID" prop="subjectSerialId" align="center"></el-table-column>
                            <el-table-column label="专题名称" prop="subjectNameCn" align="center"></el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination @size-change="(val) => handleSizeChange(val, 'groupActivityData')"
                                           @current-change="getSubjectData"
                                           :current-page="groupActivityData.page.pageNum"
                                           :page-sizes="[5, 10, 20, 50]"
                                           :page-size="groupActivityData.page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="groupActivityData.totals">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <!-- 添加拼团商品-->
                    <el-tab-pane label="添加拼团商品" name="groupActivityProductData" :disabled="!!(selectedType && selectedType != 'groupActivityProductData')">
                        <div class="activity-input">
                            商品ID: <el-input
                            v-model="groupActivityProductData.value"
                            placeholder="输入商品ID搜索"
                            style="width: 72%"
                            clearable
                            @keyup.enter.native="getGroupActivityProduct(1)">
                        </el-input>
                            <el-button type="primary" @click="getGroupActivityProduct(1)">确定</el-button>
                            <p class="center">当前已选中：<el-tag v-for="item in selectedId" :key="item">{{ item }}</el-tag></p>
                        </div>
                        <el-table
                            :data="groupActivityProductData.dataList"
                            @selection-change="handleSelectionChange"
                            row-key="groupItemSerialId"
                            ref="groupActivityProductTable"
                            v-loading="load">
                            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                            <el-table-column label="拼团商品序列号" prop="groupItemSerialId" align="center"></el-table-column>
                            <el-table-column label="商品ID" prop="spuId"  align="center"></el-table-column>
                            <el-table-column label="商品名称" :show-overflow-tooltip="true" prop="groupSpuTitleCn"  align="center"></el-table-column>
                            <el-table-column label="商品图片" align="center">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="top-start"
                                        trigger="hover">
                                        <img :src="dealShowFileSrc(scope.row.groupSpuCover)" class="previewImage">
                                        <img :src="dealShowFileSrc(scope.row.groupSpuCover)" class="thumbnail"  slot="reference" style="width:50px">
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="专题名称" :show-overflow-tooltip="true" prop="groupSubjectNameCn" align="center"></el-table-column>
                            <el-table-column label="开始时间" width="160px" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.groupSpuStartTime | formatTime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="结束时间" width="160px" align="center">
                                <template slot-scope="scope">
                                    {{ scope.row.groupSpuEndTime | formatTime }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination @size-change="(val) => handleSizeChange(val, 'groupActivityProductData')"
                                           @current-change="getGroupActivityProduct"
                                           :current-page="groupActivityProductData.page.pageNum"
                                           :page-sizes="[5, 10, 20, 50]"
                                           :page-size="groupActivityProductData.page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="groupActivityProductData.totals">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </template>
                <template v-else>
                    <!-- 绑定活动全部商品 -->
                    <el-tab-pane label="绑定活动全部商品" name="activityData" :disabled="!!(selectedType && selectedType != 'activityData')">
                        <div class="activity-input">
                            <el-select v-model="activityData.type" style="width: 110px" placeholder="选择类型">
                                <el-option v-for="(item, index) in activityTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-input
                                placeholder="输入活动ID/活动名称搜索"
                                v-model="activityData.value"
                                @keyup.enter.native="getActivityList(1)"
                                style="width: 80%"
                                clearable
                            >
                                <i slot="suffix" class="el-icon-search el-input__icon" @click="getActivityList(1)"></i>
                            </el-input>
                            <p class="center">当前已选中：<el-tag v-for="item in selectedId" :key="item" closable @close="selectedId = []">{{ item }}</el-tag></p>
                            <p class="cr">单选，点击对应列表项即可选中</p>
                        </div>
                        <el-table
                            :data="activityData.dataList"
                            v-loading="load"
                            highlight-current-row
                            @current-change="(val) => handleSimpleSelect(val, 'activeId')"
                        >
                            <el-table-column label="活动ID" prop="activeId" align="center"></el-table-column>
                            <el-table-column label="活动名称" prop="activeName" align="center"></el-table-column>
                            <el-table-column label="商品数量" prop="productCount" width="120"></el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination @size-change="(val) => handleSizeChange(val, 'activityData')"
                                           @current-change="getActivityList"
                                           :current-page="activityData.page.pageNum"
                                           :page-sizes="[5, 10, 20, 50]"
                                           :page-size="activityData.page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="activityData.totals">
                            </el-pagination>
                        </div>
                    </el-tab-pane>

                    <!-- 绑定活动分组商品 -->
                    <el-tab-pane label="绑定活动分组商品" name="groupData" :disabled="!!(selectedType && selectedType != 'groupData')">
                        <div class="activity-input">
                            <el-select v-model="groupData.type" style="width: 134px" placeholder="选择类型">
                                <el-option v-for="(item, index) in groupTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-input
                                v-model="groupData.value"
                                @keyup.enter.native="getGroupList(1)"
                                clearable
                                style="width: 74%"
                                placeholder="输入活动分组ID/活动分组名称搜索">
                                <i slot="suffix" class="el-icon-search el-input__icon" @click="getGroupList(1)"></i>
                            </el-input>
                            <p class="center">当前已选中：<el-tag v-for="item in selectedId" :key="item" closable @close="selectedId = []">{{ item }}</el-tag></p>
                            <p class="cr">单选，点击对应列表项即可选中</p>
                        </div>
                        <el-table
                            :data="groupData.dataList"
                            style="width: 100%"
                            v-loading="load"
                            highlight-current-row
                            @current-change="(val) => handleSimpleSelect(val, 'groupLabelId')"
                        >
                            <el-table-column label="活动分组ID" prop="groupLabelId" align="center"></el-table-column>
                            <el-table-column label="活动分组名称" prop="groupLabelName" align="center"></el-table-column>
                            <el-table-column label="活动名称" prop="activeName" align="center"></el-table-column>
                            <el-table-column label="商品数量" prop="productCount" widht="100" align="center"></el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination @size-change="(val) => handleSizeChange(val, 'groupData')"
                                           @current-change="getGroupList"
                                           :current-page="groupData.page.pageNum"
                                           :page-sizes="[5, 10, 20, 50]"
                                           :page-size="groupData.page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="groupData.totals">
                            </el-pagination>
                        </div>
                    </el-tab-pane>

                    <!-- 添加活动商品 -->
                    <el-tab-pane label="添加活动商品" name="activityProductData" :disabled="!!(selectedType && selectedType != 'activityProductData')">
                        <div class="activity-input">
                            商品ID: <el-input
                            v-model="activityProductData.value"
                            placeholder="输入商品ID搜索"
                            style="width: 72%"
                            clearable
                            @keyup.enter.native="getActivityProduct(1)">
                        </el-input>
                            <el-button type="primary" @click="getActivityProduct(1)">确定</el-button>
                            <p class="center">当前已选中：<el-tag v-for="item in selectedId" :key="item">{{ item }}</el-tag></p>
                        </div>
                        <el-table
                            :data="activityProductData.dataList"
                            @selection-change="handleSelectionChange"
                            row-key="id"
                            ref="activityProductTable"
                            v-loading="load">
                            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                            <el-table-column label="商品ID" prop="productId" align="center"></el-table-column>
                            <el-table-column label="商品信息" width="280">
                                <template slot-scope="scope">
                                    <div class="flex flex-item--center">
                                        <el-popover
                                            placement="top-start"
                                            trigger="hover"
                                        >
                                            <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage"/>
                                            <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail"  slot="reference" style="width:50px"/>
                                        </el-popover>
                                        <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                                            <span class="title">{{ scope.row.productName }}</span>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="活动名称" prop="activeName"></el-table-column>
                            <el-table-column label="活动价">
                                <template slot-scope="scope">
                                    {{ scope.row.activePrice }} {{ pageData.unit }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination @size-change="(val) => handleSizeChange(val, 'activityProductData')"
                                           @current-change="getActivityProduct"
                                           :current-page="activityProductData.page.pageNum"
                                           :page-sizes="[5, 10, 20, 50]"
                                           :page-size="activityProductData.page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="activityProductData.totals">
                            </el-pagination>
                        </div>
                    </el-tab-pane>

                    <!-- 添加非活动商品 -->
                    <el-tab-pane label="添加非活动商品" name="noActivityProductData" :disabled="!!(selectedType && selectedType != 'noActivityProductData')">
                        <div class="activity-input">
                            商品ID: <el-input
                            v-model="noActivityProductData.value"
                            placeholder="输入商品ID搜索"
                            style="width: 72%"
                            clearable
                            @keyup.enter.native="getNoActivityProduct(1)">
                        </el-input>
                            <el-button type="primary" @click="getNoActivityProduct(1)">确定</el-button>
                            <p class="center">当前已选中：<el-tag v-for="item in selectedId" :key="item">{{ item }}</el-tag></p>
                        </div>
                        <el-table
                            :data="noActivityProductData.dataList"
                            v-loading="load"
                            row-key="productId"
                            ref="noActivityProductTable"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                            <el-table-column label="商品ID" prop="productId" align="center" width="170"></el-table-column>
                            <el-table-column label="商品图片" align="center">
                                <template slot-scope="scope">
                                    <div class="img-box">
                                        <img :src="dealShowFileSrc(scope.row.cover)"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" align="center" prop="title"></el-table-column>
                            <el-table-column :label="`VIP价(${pageData.unit})`" align="center" prop="priceVip"></el-table-column>
                        </el-table>
                        <div class="pagination-box">
                            <el-pagination @size-change="val => handleSizeChange(val, 'noActivityProductData')"
                                           @current-change="getNoActivityProduct"
                                           :current-page="noActivityProductData.page.pageNum"
                                           :page-sizes="[5, 10, 20, 50]"
                                           :page-size="noActivityProductData.page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="noActivityProductData.totals">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </template>
            </el-tabs>

            <span slot="footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { selectActiveAndGroupLabel, listActiveProduct, getSubjectsForPage, getGroupProductForPage } from '@/request/marketing'
    import { getProductSpu } from '@/request/product'
    import { splitData } from '@/utils/index'
    export default {
        props: {
            showAddProduct: Boolean,
            selectedType: String,
            activityType: String
        },
        data () {
            return {
                activeTab: 'activityData',
                selectedId: [],
                load: false,
                activityData: {
                    activeId: [],
                    value: '',
                    activeName: '',
                    type: '1',
                    queryType: 1,
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                },
                activityTypeList: [{
                    label: '活动ID',
                    value: '1'
                }, {
                    label: '活动名称',
                    value: '2'
                }],
                groupData: {
                    value: '',
                    type: '1',
                    groupLabelName: '',
                    queryType: 2,
                    groupLabelId: [],
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                },
                groupTypeList: [
                    {
                        label: '活动分组ID',
                        value: '1'
                    }, {
                        label: '活动分组名称',
                        value: '2'
                    }
                ],
                activityProductData: {
                    value: '',
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                },
                noActivityProductData: {
                    value: '',
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                },
                groupActivityData: {
                    value: '',
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                },
                groupActivityProductData: {
                    value: '',
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                }
            }
        },
        computed: {
            pageData () {
                return this.$store.state.pageEdit.pageData
            }
        },
        created () {
            if (this.selectedType) {
                this.activeTab = this.selectedType
            } else {
                if (this.activityType == 'groupActivity') {
                    this.activeTab = 'groupActivityData'
                } else {
                    this.activeTab = 'activityData'
                }
            }
        },
        methods: {
            reset () {

            },
            handleSimpleSelect (val, type) {
                if (val) {
                    this.selectedId = [val[type]] // 选中的id 可以是活动也可以是分组
                } else {
                    this.selectedId = []
                }
                console.log(val)
            },
            handleSizeChange (value, type) {
                Object.assign(this[type].page, {
                    pageSize: value,
                    pageNum: 1
                })
                this.getData(type)
            },
            handleConfirm () {
                console.log(this.selectedId)
                if (this.selectedId && this.selectedId.length) {
                    let param = {
                        selectedId: this.selectedId,
                        selectedType: this.activeTab,
                        isChange: true
                    }
                    this.$emit('confirm', param)
                } else {
                    this.$message.error('请先选择对应的项')
                }
            },
            // 获取活动数据
            getActivityList (page) {
                let temp = { ...this.activityData }
                if (!temp.value) return
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    queryType: temp.queryType,
                    page: temp.page,
                    countryCode: this.pageData.countryCode
                }

                switch (temp.type) {
                    case '1':
                        params.activeId = splitData(temp.value)
                        break
                    case '2':
                        params.activeName = temp.value
                        break
                }

                selectActiveAndGroupLabel(this.filterData(params)).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.activityData.dataList = res.activeAndGroupLabelInfo
                        this.activityData.totals = res.total
                    }
                }).catch(err => {
                    this.load = false
                })
            },
            handleSelectionChange (val) {
                if (this.activeTab == 'groupActivityProductData') {
                    this.selectedId = val.map(item => item.groupItemSerialId)
                } else {
                    this.selectedId = val.map(item => item.productId)
                }
            },
            // 获取分组数据
            getGroupList (page) {
                let temp = { ...this.groupData }
                if (!temp.value) return
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    queryType: temp.queryType,
                    page: temp.page,
                    countryCode: this.pageData.countryCode
                }

                switch (temp.type) {
                    case '1':
                        params.groupLabelId = splitData(temp.value)
                        break
                    case '2':
                        params.groupLabelName = temp.value
                        break
                }

                selectActiveAndGroupLabel(this.filterData(params)).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.groupData.dataList = res.activeAndGroupLabelInfo
                        this.groupData.totals = res.total
                    }
                }).catch(err => {
                    this.load = false
                })
            },
            getActivityProduct (page) {
                let temp = { ...this.activityProductData }
                if (!temp.value) return
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    page: temp.page,
                    productIdList: splitData(temp.value),
                    countryCode: this.pageData.countryCode
                }
                listActiveProduct(this.filterData(params)).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.activityProductData.dataList = res.activeProductInfo
                        this.activityProductData.totals = res.total
                    }
                }).catch(err => {
                    this.load = false
                })
            },
            // 拼团专题
            getSubjectData (page) {
                let temp = { ...this.groupActivityData }
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    page: temp.page,
                    subjectName: temp.value,
                    countryCode: this.pageData.countryCode
                }
                getSubjectsForPage(params).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.groupActivityData.dataList = res.groupSubjectUnit
                        this.groupActivityData.totals = res.total
                    }
                }).catch(err => {
                    this.load = false
                })
            },
            // 拼团商品
            getGroupActivityProduct (page) {
                let temp = { ...this.groupActivityProductData }
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    page: temp.page,
                    spuId: splitData(temp.value),
                    countryCode: this.pageData.countryCode
                }
                getGroupProductForPage(this.filterData(params)).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.groupActivityProductData.dataList = res.groupProductUnit
                        this.groupActivityProductData.totals = res.total
                    }
                }).catch(err => {
                    this.load = false
                })
            },
            getNoActivityProduct (page) {
                let temp = { ...this.noActivityProductData }
                if (!temp.value) return
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    page: temp.page,
                    productId: splitData(temp.value),
                    countryCode: this.pageData.countryCode
                }

                getProductSpu(this.filterData(params)).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.noActivityProductData.dataList = res.spu
                        this.noActivityProductData.totals = res.total
                    }
                }).catch(err => {
                    this.load = false
                })
            },
            handleClose () {
                this.reset()
                this.$emit('cancel')
            },
            handleClick (val) {
                // 切换tab的时候，只是清空选中的东西
                this.selectedId = []
                this.$refs['noActivityProductTable'] && this.$refs['noActivityProductTable'].clearSelection()
                this.$refs['activityProductTable'] && this.$refs['activityProductTable'].clearSelection()
                this.$refs['groupActivityTable'] && this.$refs['groupActivityTable'].clearSelection()
                this.$refs['groupActivityProductTable'] && this.$refs['groupActivityProductTable'].clearSelection()
            },
            getData (val) {
                switch (val) {
                    case 'activityData':
                        this.getActivityList()
                        break
                    case 'groupData':
                        this.getGroupList(1)
                        break
                    case 'activityProductData':
                        this.getActivityProduct(1)
                        break
                    case 'noActivityProductData':
                        this.getNoActivityProduct(1)
                        break
                    case 'groupActivityData':
                        this.getSubjectData(1)
                        break
                    case 'groupActivityProductData':
                        this.getGroupActivityProduct(1)
                        break
                }
            }
        }
    }
</script>

<style lang="scss">
.add-product-dialog {
    width: 100%;
    .el-dialog{
        width: 80%;
    }
    .activity-input {
        padding: 0 16px 8px;
        margin: 0 auto;
        text-align: center;
    }

    .cr {
        color: #f56c6c;
        margin-top: 8px;
    }
    .center {
        text-align: center;
    }
    .pagination-box {
        padding: 8px 0 16px 0;
    }

    .img-box {
        width: 60px;
        height: 60px;
        display: inline-block;
        img {
            width: 100%;
        }
    }

    .el-table{
        max-height: 100%;
        height: 100%;
        .el-table__header{
            th{
                background:#F5F7FA;
                color: #606266;
            }
        }
    }

    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
}
</style>
