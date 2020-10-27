<template>
    <div class="app-container">
        <div>
            <el-form inline>
                <el-form-item label="商品ID："
                              class="filter-item">
                    <el-input placeholder="请输入商品ID"
                              size="medium"
                              v-model="searchParam.productId"></el-input>
                </el-form-item>
                <el-form-item label="商品名称："
                              class="filter-item">
                    <el-input placeholder="请输入商品名称"
                              size="medium"
                              v-model="searchParam.productName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" plain
                               type="primary"
                               @click="getList(1)"
                               size="small">搜索
                    </el-button>
                </el-form-item>
            </el-form>
            <el-form inline>
                <el-form-item>
                    <el-button icon="el-icon-plus" plain
                               type="primary"
                               @click="showAddDialog"
                               size="small">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-plus" plain
                               type="primary"
                               @click="toDeleteAll"
                               size="small">批量删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      @selection-change="handleSelectionChange"
                      :data="dataList">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column label="商品信息"
                                 align="center">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.cover)" class="thumbnail"  slot="reference">
                            </el-popover>
                            <span class="block-right">{{scope.row.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="当前排序"
                                 align="center"
                                 min-width="70">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sortNo"
                                         controls-position="right"
                                         :min="0"
                                         size="small"
                                         :precision="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column fixed="right"
                                 label="操作"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button plain type="primary" size="mini"
                                   @click="toSort(scope.row)">保存排序</el-button>
                        <el-button plain type="danger" size="mini"
                                   @click="deleteProduct(scope.row.productId)">删除</el-button>
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
        <select-product :dialogVisible="dialog.show" :countryCode="countryCode" @close="closeEditDialog" @confirm="confirmEditItem"></select-product>
    </div>
</template>
<script>
    import {
        ListProducts,
        BatchDeleteProducts,
        InsetProducts,
        ProductsSortChange
    } from '@/request/promotion'
    import common from '@/js/common/mixins.js'
    import selectProduct from '../productSelect/index'
    export default {
        data () {
            return {
                searchParam: {
                    boxcardId: 2,
                    productId: '',
                    productName: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                multipleSelection: [],
                dataListId: [],
                totals: 0,
                dataList: [],
                countryCode: '',
                dialog: {
                    show: false
                }
            }
        },
        components: {
            selectProduct
        },
        mixins: [common],
        watch: {
            multipleSelection: function () {
                let arr = []
                for (let i in this.multipleSelection) {
                    arr.push(this.multipleSelection[i].productId)
                }
                this.dataListId = arr
            }
        },
        created () {
            this.searchParam.boxcardId = this.$route.query.boxcardId
            this.countryCode = this.$route.query.countryCode
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                ListProducts(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.list
                        this.totals = res.total
                    }
                })
            },
            showAddDialog () {
                this.dialog.show = true
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem (ids) {
                InsetProducts({
                    productIds: ids.join(','),
                    boxcardId: this.searchParam.boxcardId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('添加成功')
                        this.getList()
                        this.dialog.show = false
                    }
                })
            },
            toSort (data) {
                ProductsSortChange({
                    productId: data.productId,
                    sortNo: data.sortNo,
                    boxcardId: this.searchParam.boxcardId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
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
                    this.$message('请先勾选商品')
                    return
                }
                this.deleteProduct(this.dataListId.join(','))
            },
            deleteProduct (ids) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    BatchDeleteProducts({
                        boxcardId: this.searchParam.boxcardId,
                        productIds: ids
                    }).then(res => {
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
