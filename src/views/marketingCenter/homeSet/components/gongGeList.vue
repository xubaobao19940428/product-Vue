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
                               :label="item.nameCn"
                               :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="primary"
                           icon="el-icon-plus"
                           v-if="hasPermission('BTN_GONG_GE_ADD')"
                           @click="showEditDialog('add')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="danger"
                           icon="el-icon-delete"
                           v-if="hasPermission('BTN_GONG_GE_DELETE')"
                           @click="toDeleteAll()">批量删除</el-button>
            </el-form-item>
        </el-form>
        <bg-set-list  dialogType="8" :countryList="countryList" :countryCode="searchParam.countryCode"></bg-set-list>
        <div class="main-content-wrapper">
            <el-table
                border
                height="100%"
                :data="dataList"
                ref="multipleTable"
                @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <el-table-column label="标题" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{ getMultiLangShowInfo(scope.row.title) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="副标题" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{ getMultiLangShowInfo(scope.row.subTitle) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" align="center" min-width="100px" ></el-table-column>
                <el-table-column label="跳转类型" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ urlType[scope.row.urlType]}}
                    </template>
                </el-table-column>
                <el-table-column label="跳转链接" min-width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.urlType == 2 ? appPageEnum[scope.row.url] : scope.row.url }}
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" align="center" min-width="180px">
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
                <el-table-column label="排序"
                                 align="center"
                                 width="220px">
                    <template slot-scope="scope">
                        <el-input-number
                            v-model="scope.row.sort"
                            controls-position="right"
                            :min="0"
                            size="mini"
                            :precision="0"
                        ></el-input-number>
                        <el-button
                            type="primary"
                            plain
                            v-if="hasPermission('BTN_GONG_GE_SORT')"
                            @click="toSort(scope.row.sort, scope.row.id)"
                            size="mini"
                            style="margin-left:5px"
                        >排序</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right"
                                 label="操作"
                                 align="center"
                                 min-width="180px">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"
                                   v-if="hasPermission('BTN_GONG_GE_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button type="text" size="mini"
                                   v-if="hasPermission('BTN_GONG_GE_COPY')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button type="text" size="mini"
                                   v-if="hasPermission('BTN_GONG_GE_DELETE')"
                                   @click="toDelete([scope.row.id])">删除</el-button>
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
        <edit-dialog :dialogVisible="dialog.show" :marketingGridType="marketingGridType" :urlType="urlType" :appPageEnum="appPageEnum" :countryList="countryList" :propParam="dialog.param" @close="closeEditDialog" :langList="langList" @confirm="confirmEditItem"></edit-dialog>
    </div>
</template>
<script>
    import { ListMarketingGrid, DeleteMarketingGrid, SortMarketingGrid } from '@/request/promotion.js'
    import editDialog from './gongGerEdit'
    import mixins from '@/js/common/mixins.js'
    import common from '../../common/common'
    import BgSetList from './bgSetList'
    export default {
        props: {
            countryList: Array,
            langList: Array
        },
        mixins: [common, mixins],
        data () {
            return {
                searchParam: {
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                dialog: {
                    show: false,
                    param: {}
                },
                marketingGridType: {
                    1: '限时特惠',
                    2: '其他宫格',
                    3: '新人专享',
                    4: '爆款好物'
                },
                totals: 0,
                dataList: [],
                dialogVisible: false,
                multipleSelection: [],
                dataListId: []
            }
        },
        components: {
            editDialog,
            BgSetList
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
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                ListMarketingGrid(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataList = res.marketingGrid
                        this.totals = res.total
                    }
                })
            },
            toSort (sort, id) {
                SortMarketingGrid({
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
            showEditDialog (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, data)
                    this.dialog.param.spuId = this.dialog.param.spuId ? this.dialog.param.spuId.join(',') : ''
                } else if (type == 'copy') {
                    Object.assign(this.dialog.param, data)
                    this.dialog.param.id = null
                    this.dialog.param.spuId = this.dialog.param.spuId ? this.dialog.param.spuId.join(',') : ''
                }
                this.dialog.show = true
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getList()
            },
            toDeleteAll () {
                if (this.dataListId.length === 0) {
                    this.$message('请先勾选您需操作的选项')
                    return
                }
                this.toDelete(this.dataListId)
            },
            toDelete (ids) {
                this.$confirm('此操作将永久删除所选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DeleteMarketingGrid({ 'id': ids }).then(res => {
                        if (res.ret.errcode === 1) {
                            this.getList()
                            this.$message.success('删除成功')
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
