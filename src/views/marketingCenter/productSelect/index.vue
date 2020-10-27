<template>
    <el-dialog
        title="添加商品"
        :visible="dialogVisible"
        width="800px"
        :close-on-click-modal="false"
        @close="handleClose"
        :append-to-body="true"
        >
        <div class="editGoodsGounp">
            <el-form label-width="100px">
                <el-form-item label="商品ids：">
                    <div class="flex">
                        <el-input class="flex1" v-model="searchParam.productIds" placeholder="请输入id用,号隔开" size="medium"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="商品名称：">
                    <div class="flex">
                        <el-input class="flex1 mar-r-10" v-model="searchParam.titleKey" placeholder="请输入商品名称" size="medium"></el-input>
                        <el-button icon="el-icon-search" plain  @click="getList(1)" size="small">搜索</el-button>
                    </div>
                </el-form-item>
                <el-form-item v-if="this.dataListId.length" label="当前已选中：">
                    <el-tag v-for="item in this.dataListId" :key="item" closable @close="handleSelectClose(item)">{{ item }}</el-tag>
                </el-form-item>
            </el-form>
            <el-table :data="dataList"
                      ref="multipleProductSTable"
                      border
                      v-if="contentEdit && contentEdit==='radio'"
                      highlight-current-row
                      @current-change="handleCurrentChange"
                      width= "100%"
                      :row-key="getRowKeys"
                      v-loading="loadData"
                      style="margin-top:16px">
                <el-table-column prop="productId" label="商品ID"></el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <span class="block-right">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                            <img :src="dealShowFileSrc(scope.row.cover)" class="thumbnail"  slot="reference" style="width:50px">
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="dataList"
                      ref="multipleProductSTable"
                      border
                      v-else
                      @selection-change="handleSelectionChange"
                      width= "100%"
                      :row-key="getRowKeys"
                      v-loading="loadData"
                      style="margin-top:16px">
                <el-table-column  type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column prop="productId" label="商品ID"></el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <span class="block-right">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                            <img :src="dealShowFileSrc(scope.row.cover)" class="thumbnail"  slot="reference" style="width:50px">
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
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
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="handleClose">取 消</el-button>
            <el-button size="small" type="primary" @click="confirmAddItem">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { getProductSpu } from '@/request/product.js'
    import {
        splitData
    } from '@/utils/index'
    export default {
        props: {
            dialogVisible: Boolean,
            countryCode: String,
            contentEdit:String
        },
        data () {
            return {
                searchParam: {
                    productIds: '',
                    productId: [],
                    titleKey: '',
                    countryCode: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                loadData: false,
                dataList: [],
                multipleSelection: [],
                dataListId: [],
                totals: 0,
                selectAll: false
            }
        },
        watch: {
            multipleSelection: function () {
                this.dataListId = []
                for (let i in this.multipleSelection) {
                    this.dataListId.push(this.multipleSelection[i].productId)
                }
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
                this.loadData = true
                this.selectAll = false
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                this.searchParam.countryCode = this.countryCode
                this.searchParam.productId = this.searchParam.productIds ? splitData(this.searchParam.productIds) : []
                getProductSpu(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.spu
                        this.totals = res.total
                    }
                    this.loadData = false
                }).catch(err => {
                    this.loadData = false
                })
            },
            handleSelectClose (item) {
                let row = this.multipleSelection.find(i => i.productId == item)
                this.$refs.multipleProductSTable.toggleRowSelection(row, false)
            },
            handleSelectionChange (val) {
                console.log(val)
                this.multipleSelection = val
            },
            handleCurrentChange(val) {
                console.log(val)
                this.multipleSelection=[val] 
            },
            getRowKeys (row) {
                return row.productId
            },
            handleClose () {
                this.$emit('close')
            },
            confirmAddItem () {
                if (this.dataListId.length <= 0) {
                    return this.$message.warning('请选择商品')
                }
                this.$emit('confirm', this.dataListId)
            }
        }
    }
</script>
