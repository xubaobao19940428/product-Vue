<template>
    <div class="app-container">
        <el-form inline label-width="90px">
            <el-form-item label="商品ID：">
                <el-input 
                    v-model="searchParam.productId" 
                    placeholder="请输入" 
                    clearable
                    size="medium"></el-input>
            </el-form-item>
            <el-form-item label="优惠券包ID：">
                <el-input 
                    v-model="searchParam.couponPackageId" 
                    clearable
                    placeholder="请输入"
                    size="medium"></el-input>
            </el-form-item>
            <el-form-item label="国家站点：">
                <el-select v-model="searchParam.countryCode" placeholder="请选择" size="medium" clearable>
                    <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button type="primary"
                    @click="getList(1)"
                    icon="el-icon-search"
                    size="medium">查询
                </el-button>
                <el-button
                    @click="resetSearchCoupon"
                    icon="el-icon-refresh-left"
                    size="medium">重置
                </el-button>
          </el-form-item>
        </el-form>
        <div class="operator-container">
            <el-button 
                icon="el-icon-plus" 
                type="primary" 
                v-if="hasPermission('BTN_COUPON_RETURN_ADD')"
                size="medium" @click="handleAdd">新增</el-button>
            <el-button 
                plain 
                v-if="hasPermission('BTN_COUPON_RETURN_ALL_DELETE')"
                @click="handelDelAll" 
                type="primary" size="medium" icon="el-icon-delete">批量删除</el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table 
                :data="dataList" 
                border 
                height="100%"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="load">
                <el-table-column type="selection"
                                fixed="left"
                                 width="55">
                </el-table-column>
                <el-table-column fixed="left" align="center" label="商品ID" prop="productId"></el-table-column>
                <el-table-column label="商品信息" align="center" min-width="200px">
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
                <el-table-column label="国家站点" align="center">
                    <template slot-scope="scope">
                       {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="发放优惠券包ID" align="center" prop="couponPackageId" width="160px"></el-table-column>
                <el-table-column label="更新人" align="center" prop="operationName"></el-table-column>
                <el-table-column label="更新时间" align="center" width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="160px">
                    <template slot-scope="scope">
                        <el-button plain
                            type="primary"
                            size="mini"
                            v-if="hasPermission('BTN_COUPON_RETURN_EDIT')"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button plain type="primary" size="mini"
                            v-if="hasPermission('BTN_COUPON_RETURN_DELETE')"
                            @click="handleDel([scope.row.id])"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>

        <return-dialog v-if="dialogShow" 
            :dialog="dialog"
            :dialogVisible="dialogShow"
            @close="dialogShow = false"
            @confirm="handleConfirm"
            :isEdit="isEdit"
            :countryList="countryList"></return-dialog>
    </div>
</template>

<script>
import returnDialog from './returnDialog'
import { mapState } from 'vuex'
import { listByQueryProductCouponWithPage, addProductCouponBoss, deleteProductCoupon, updateProductCoupon } from '@/request/coupon'
export default {
    data () {
        return {
            dataList: [],
            load: false,
            dialogShow: false,
            isEdit: false,
            delIds: [], // 批量删除的id
            dialog: {
                countryCode: 'MY',
                productId: '',
                couponPackageId: ''
            },
            totals: 0,
            searchParam: {
                couponPackageId: '',
                productId: '',
                countryCode: '',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            }
        }
    },
    components: {
        returnDialog
    },
    created () {
        this.getList(1)
    },
    computed: {
        ...mapState({
            countryList: state => state.dict.countryList
        })
    },
    methods: {
        handleSizeChange (value) {
            Object.assign(this.searchParam.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        resetSearchCoupon () {
            this.searchParam = {
                couponPackageId: '',
                productId: '',
                countryCode: '',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            }
        },
        handleSelectionChange (val) {
            this.delIds = val.map(item => item.id)
        },
        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            let resParam = this.filterData(this.searchParam)
            listByQueryProductCouponWithPage(resParam).then((res) => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.productCouponResultPb
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                this.load = false
            })
        },
        handleConfirm (data) {
            let res = { ...data }
            if (this.isEdit) {
                delete res.countryCode
                updateProductCoupon(this.filterData(data)).then(res => {
                    if (res.ret.errcode == 1) {
                        this.dialogShow = false
                        this.$message.success('修改成功')
                        this.getList()
                    }
                })
            } else {
                addProductCouponBoss(this.filterData(data)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.dialogShow = false
                        this.$message.success('新增成功')
                        this.getList(1)
                    }
                })
            }
        },
        handleEdit (item) {
            this.isEdit = true
            this.dialogShow = true
            Object.assign(this.dialog, {
                id: item.id,
                countryCode: item.countryCode,
                productId: item.productId,
                couponPackageId: item.couponPackageId
            })
        },
        handelDelAll () {
            if (!this.delIds.length) {
                this.$message('请先勾选需要删除的记录')
                return
            }
            this.handleDel(this.delIds)
        },
        handleDel (delIds) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteProductCoupon({
                    id: delIds
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('删除记录成功')
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
        handleAdd () {
            this.isEdit = false
            this.dialogShow = true
            Object.assign(this.dialog, {
                id: '',
                countryCode: 'MY',
                productId: '',
                couponPackageId: ''
            })
        }
    }
}
</script>