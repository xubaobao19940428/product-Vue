<template>
    <div class="app-container">
        <el-form inline>
            <el-form-item label="国家：">
                <el-select v-model="param.countryCode" @change="getList(1)" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in countryList"
                               :key="index"
                               :label="item.nameEn + '/' + item.nameCn "
                               :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="primary"
                           icon="el-icon-plus"
                           v-if="hasPermission('BTN_QY_OPTIMIZATION_ADD')"
                           @click="showEditDialog('add')">新增</el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList">
                <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
                <el-table-column prop="serialNo" label="ID" align="center" min-width="100px" ></el-table-column>
                <el-table-column label="国家" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="排序"
                                 align="center"
                                 width="220px">
                    <template slot-scope="scope">
                        <el-input-number
                            v-model="scope.row.cateSort"
                            controls-position="right"
                            :min="0"
                            size="mini"
                            :precision="0"
                        ></el-input-number>
                        <el-button
                            type="primary"
                            plain
                            v-if="hasPermission('BTN_QY_OPTIMIZATION_SORT')"
                            @click="toSort(scope.row)"
                            size="mini"
                            style="margin-left:5px"
                        >排序</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="200px" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-if="hasPermission('BTN_QY_OPTIMIZATION_HIDDEN')"
                            style="margin-right: 10px"
                            v-model="scope.row.showStatus"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="2"
                            @change="changeSwitchstate(scope.row)">
                        </el-switch>
                        <el-button type="text"  size="mini"
                                   v-if="hasPermission('BTN_QY_OPTIMIZATION_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button type="text"  size="mini"
                                   v-if="hasPermission('BTN_QY_OPTIMIZATION_EDIT')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button type="text" size="mini"
                                   @click="clickToDelete(scope.row)">删除</el-button>
                        <el-button type="text" size="mini"
                                   v-if="hasPermission('BTN_QY_OPTIMIZATION_PRODUCT_MANAGE')"
                                   @click="toLinkGdOperatione(scope.row)">商品管理</el-button>
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
        <edit-dialog :dialogVisible="dialog.show" :countryList="countryList" :propParam="dialog.param" :langList="langList"
                     @close="closeDialog" @confirm="confirmAddItem"></edit-dialog>
    </div>
</template>
<script>
    import { listOperate, deleteQuality, marketingCategoryHideShow, marketingCategorySetSort } from '@/request/marketing'
    import editDialog from './qyOptimizationEdit'
    export default {
        props: {
            langList: Array,
            countryList: Array
        },
        data () {
            return {
                dataList: [],
                imgList: [],
                uploadFileUrl: `${process.env.VUE_APP_UPLOAD_API}`,
                uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
                dialogVisible: false,
                productsOperate: {},
                types: '',
                headers: this.$headers,
                param: {
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
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                listOperate(this.filterData(this.param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.categoryInfos
                        this.totals = res.total
                    }
                })
            },
            showEditDialog (type, data) {
                this.dialog.show = true
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                } else if (type == 'copy') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                    this.dialog.param.id = null
                }
            },
            closeDialog () {
                this.dialog.show = false
            },
            confirmAddItem () {
                this.dialog.show = false
                this.getList()
            },
            clickToDelete (data) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    deleteQuality({
                        serialNo: data.serialNo
                    }).then((res) => {
                        if (res.success === 1) {
                            this.getList()
                        }
                    })
                    this.getList()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            toSort (data) {
                marketingCategorySetSort({
                    serialNo: data.serialNo,
                    sort: data.cateSort
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                    }
                })
            },
            changeSwitchstate (data) {
                marketingCategoryHideShow({
                    serialNo: data.serialNo,
                    showStatus: data.showStatus
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                    }
                })
            },
            toLinkGdOperatione (row) {
                this.$router.push({
                    path: 'qyOptimizationProduct',
                    query: {
                        categorySerialNo: row.serialNo,
                        countryCode: row.countryCode
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .editGoodsGounp {
        width: 100%;
        height: auto;
        padding: 20px 0;

    }
</style>