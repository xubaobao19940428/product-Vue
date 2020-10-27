<template>
    <div class="app-container">
        <el-form inline>
            <el-form-item label="国家：">
                <el-select v-model="searchParam.countryCode"
                           @change="getList(1)"
                           filterable
                           clearable>
                    <el-option v-for="item in countryList"
                               :key="item.shortCode"
                               :label="item.nameLocal"
                               :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="primary"
                           v-if="hasPermission('BTN_PRODUCT_LIST_AD_ADD')"
                           icon="el-icon-plus"
                           @click="showEditDialog()">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="danger"
                           icon="el-icon-delete"
                           v-if="hasPermission('BTN_PRODUCT_LIST_AD_BATCH_DELETE')"
                           @click="toDeleteAll()">批量删除</el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList"
                      ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <el-table-column prop="id" label="ID" align="center" min-width="100px" ></el-table-column>
                <el-table-column label="国家" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="类型" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.type == 1 ? '活动列表' : '活动图片' }}
                    </template>
                </el-table-column>
                <el-table-column label="标题(中文)" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ getMultiLangShowInfo(scope.row.title) }}
                    </template>
                </el-table-column>
                <el-table-column label="副标题(中文)" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ getMultiLangShowInfo(scope.row.subTitle) }}
                    </template>
                </el-table-column>
                <el-table-column label="图片(中文)" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="previewImage">
                            <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="thumbnail" slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="跳转类型" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ urlType[scope.row.urlType]}}
                    </template>
                </el-table-column>
                <el-table-column label="跳转链接" min-width="100px" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.urlType == 2 ? appPageEnum[scope.row.url] : scope.row.url }}
                    </template>
                </el-table-column>
                <el-table-column label="展示位商品" min-width="300px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.productId.join(',') }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.updateTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.startTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.endTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="穿插排序" align="center" min-width="220px" fixed="right">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort"
                                         controls-position="right"
                                         :min="0" size="mini"
                                         :precision="0"></el-input-number>
                        <el-button type="primary" plain
                                   @click="toSort(scope.row.sort, scope.row.id)"
                                   size="mini"
                                   v-if="hasPermission('BTN_PRODUCT_LIST_AD_SORT')"
                                   style="margin-left:5px">排序</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="140px">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_PRODUCT_LIST_AD_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_PRODUCT_LIST_AD_BATCH_DELETE')"
                                   @click="toDelete([scope.row.id])">删除</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_PRODUCT_LIST_AD_COPY')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="searchParam.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="searchParam.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <edit-dialog :dialogVisible="dialog.show" :propParam="dialog.param"
                     :urlType="urlType" :appPageEnum="appPageEnum"
                     :countryList="countryList" :langList="langList"
                     @close="dialog.show = false" @confirm="confirmEditItem"></edit-dialog>
    </div>
</template>
<script>
    import { listQualityRecommend, sortQualityRecommend, deleteQualityRecommend } from '@/request/marketing.js'
    import mixins from '@/js/common/mixins.js'
    import common from '../../common/common'
    import editDialog from './productListAdDialog'
    export default {
        props: {
            countryList: Array,
            langList: Array
        },
        mixins: [mixins, common],
        data () {
            return {
                dataList: [],
                dialogVisible: false,
                multipleSelection: [],
                dataListId: [],
                bannerList: '',
                searchParam: {
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                totals: 0,
                dialog: {
                    show: false,
                    param: {}
                }
            }
        },
        components: {
            editDialog
        },
        watch: {
            multipleSelection: function () {
                let arr = []
                for (let i in this.multipleSelection) {
                    arr.push(this.multipleSelection[i].id)
                }
                this.dataListId = arr
            }
        },
        mounted () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                listQualityRecommend(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.qualityRecommendInfo
                        this.totals = res.total
                    }
                })
            },
            showEditDialog (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                    this.dialog.param.productId = this.dialog.param.productId ? this.dialog.param.productId.join(',') : ''
                } else if (type === 'copy') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                    this.dialog.param.id = null
                    this.dialog.param.productId = this.dialog.param.productId ? this.dialog.param.productId.join(',') : ''
                }
                this.dialog.show = true
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getList()
            },
            toSort (sort, id) {
                sortQualityRecommend({
                    'sort': sort,
                    'id': id
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                        this.$message.success('操作成功')
                    }
                })
            },
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            toDeleteAll () {
                if (this.dataListId.length === 0) {
                    this.$message('请先勾选您需操作的列表')
                    return
                }
                this.toDelete(this.dataListId)
            },
            toDelete (ids) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteQualityRecommend({ 'id': ids }).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功')
                            this.getList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    header{
        width: 100%;
        height: 48px;
    }
    article{

    }
</style>
