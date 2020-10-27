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
                           v-if="hasPermission('BTN_SERVICE_COPY_ADD')"
                           icon="el-icon-plus"
                           @click="showEditDialog()">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="danger"
                           icon="el-icon-delete"
                           v-if="hasPermission('BTN_SERVICE_COPY_DELETE')"
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
                <el-table-column prop="name" label="服务文案" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{ getMultiLangShowInfo(scope.row.serviceDesc) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" align="center" min-width="100px" ></el-table-column>
                <el-table-column label="国家" min-width="100px"  align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="字体色值" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div class="flex">
                            <span :style="{ backgroundColor: scope.row.color, width: '20px', height: '20px', display: 'flex' }"></span>
                            <span>{{ scope.row.color }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="排序" align="center" width="220px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort"
                                         controls-position="right"
                                         :min="0" size="mini"
                                         :precision="0"></el-input-number>
                        <el-button type="primary" plain
                                   @click="toSort(scope.row.sort, scope.row.id)"
                                   size="mini"
                                   v-if="hasPermission('BTN_BANNER_LIST_SORT')"
                                   style="margin-left:5px">排序</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="180px">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_SERVICE_COPY_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_SERVICE_COPY_COPY')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_SERVICE_COPY_DELETE')"
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
        <edit-serve-dialog :dialogVisible="dialog.show" :langList="langList" :countryList="countryList" :propParam="dialog.param" @close="dialog.show = false" @confirm="confirmEditItem"></edit-serve-dialog>
    </div>
</template>
<script>
    import { deleteCopyWrite, listCopyWrite, changeCopyWriteSort } from '@/request/promotion.js'
    import common from '@/js/common/mixins.js'
    import editServeDialog from './serviceCopyEdit'
    export default {
        props: {
            countryList: Array,
            langList: Array
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
                    bannerType: 1,
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
            editServeDialog
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
                listCopyWrite(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.copyWriteInfo
                        this.totals = res.total
                    }
                })
            },
            showEditDialog (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    this.dialog.param = JSON.parse(JSON.stringify(data))
                } else if (type == 'copy') {
                    this.dialog.param = JSON.parse(JSON.stringify(data))
                    this.dialog.param.id = null
                }
                this.dialog.show = true
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
                this.$confirm('此操作将永久删除所选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCopyWrite({ 'id': this.dataListId }).then(res => {
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
                changeCopyWriteSort({
                    sort: sort,
                    id: id
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
                this.$confirm('此操作将永久删除所选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCopyWrite({ 'id': [row.id] }).then(res => {
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
