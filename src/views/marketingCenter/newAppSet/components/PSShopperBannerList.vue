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
                           v-if="hasPermission('BTN_BANNER_LIST_ADD')"
                           icon="el-icon-plus"
                           @click="showEditDialog()">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="danger"
                           icon="el-icon-delete"
                           v-if="hasPermission('BTN_BANNER_LIST_BATCH_DELETE')"
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
                <el-table-column prop="name" label="banner标题" align="center" min-width="100px" ></el-table-column>
                <el-table-column prop="bannerId" label="ID" align="center" min-width="100px" ></el-table-column>
                <el-table-column label="国家" min-width="100px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="背景色值" min-width="120px" align="center">
                    <template slot-scope="scope">
                        <div class="flex">
                            <span :style="{ backgroundColor: scope.row.background, width: '20px', height: '20px', display: 'flex' }"></span>
                            <span>{{ scope.row.background }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="打开次数" min-width="100px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.clickNum}}
                    </template>
                </el-table-column>
                <el-table-column label="链接" align="center" prop="url" min-width="200px">
                </el-table-column>
                <el-table-column label="图片" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="getMultiLangShowInfo(scope.row.image, 'image')" class="previewImage">
                            <img :src="getMultiLangShowInfo(scope.row.image, 'image')" class="thumbnail" slot="reference">
                        </el-popover>
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
                <el-table-column label="banner位移动" align="center" width="220px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sortNo"
                                         controls-position="right"
                                         :min="0" size="mini"
                                         :precision="0"></el-input-number>
                        <el-button type="primary" plain
                                   @click="toSort(scope.row.sortNo, scope.row.bannerId)"
                                   size="mini"
                                   v-if="hasPermission('BTN_BANNER_LIST_SORT')"
                                   style="margin-left:5px">排序</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_BANNER_LIST_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_BANNER_LIST_EDIT')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_BANNER_LIST_BATCH_DELETE')"
                                   @click="toDelete(scope.row)">删除</el-button>
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
        <edit-dialog :dialogVisible="dialog.show" bannerType="3" :countryList="countryList" :propParam="dialog.param" @close="closeEditDialog" @confirm="confirmEditItem"></edit-dialog>
    </div>
</template>
<script>
    import { fetchList, fetchBatchDelete, fetchDelete, fetchChangeSort } from '@/request/promotion.js'
    import common from '@/js/common/mixins.js'
    import editDialog from './bannerEdit'
    export default {
        props: {
            countryList: Array
        },
        mixins: [common],
        data () {
            return {
                dataList: [],
                dialogVisible: false,
                multipleSelection: [],
                dataListId: [],
                bannerList: '',
                searchParam: {
                    bannerType: 3,
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
                    arr.push(this.multipleSelection[i].bannerId)
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
                fetchList(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.bannerInfos
                        this.totals = res.total
                    }
                })
            },
            showEditDialog (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                } else if (type == 'copy') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                    this.dialog.param.bannerId = null
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
                    this.$message('请先勾选您需操作的banner')
                    return
                }
                this.$confirm('此操作将永久删除所选banner, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    fetchBatchDelete({ 'bannerIds': this.dataListId }).then(res => {
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
            },
            toSort (sort, id) {
                fetchChangeSort({
                    'sortNo': sort,
                    'bannerId': id
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
            toDelete (row) {
                this.$confirm('此操作将永久删除所选banner, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    fetchDelete({ 'bannerId': row.bannerId }).then(res => {
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
