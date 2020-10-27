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
                <el-table-column label="国家" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button plain
                                   type="primary"
                                   v-if="hasPermission('BTN_QY_OPTIMIZATION_EDIT')"
                                   size="mini"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button plain type="danger" size="mini"
                                   @click="clickToDelete(scope.row)">删除</el-button>
                        <el-button plain type="primary"
                                   size="mini"
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
        <edit-dialog :dialogVisible="dialog.show" :countryList="countryList" :propParam="dialog.param"
                     @close="closeDialog" @confirm="confirmAddItem"></edit-dialog>
    </div>
</template>
<script>
    import { listOperate, deleteQuality } from '@/request/marketing'
    import editDialog from './qyOptimizationEdit'
    export default {
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
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
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
                    Object.assign(this.dialog.param, data)
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
