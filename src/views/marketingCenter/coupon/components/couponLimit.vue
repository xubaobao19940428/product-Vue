<template>
    <div class="app-container">
        <el-form inline label-width="90px" :model="searchParam">
            <el-form-item label="商品ID：">
                <el-input 
                    size="medium"
                    v-model="searchParam.productId" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="优惠券ID：">
                <el-input 
                    size="medium"
                    v-model="searchParam.couponId" placeholder="请输入" clearable></el-input>
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
                v-if="hasPermission('BTN_COUPON_LIMIT_ADD')"
                type="primary" size="medium" @click="handleAdd">新增</el-button>
            <el-button 
                plain 
                v-if="hasPermission('BTN_COUPON_LIMIT_ALL_DELETE')"
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
                <el-table-column label="限制类型" align="center">
                    <template slot-scope="scope">
                        {{ typeObj[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column label="限制优惠券ID" align="center" prop="couponId" width="160px"></el-table-column>
                <el-table-column label="更新人" align="center" prop="operationName"></el-table-column>
                <el-table-column label="更新时间" align="center" width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="160px">
                    <template slot-scope="scope">
                        <el-button plain
                            type="primary"
                            size="mini"
                            @click="handleEdit(scope.row)"
                            v-if="hasPermission('BTN_COUPON_LIMIT_EDIT')"
                        >编辑</el-button>
                        <el-button plain type="primary" size="mini"
                            @click="handleDel([scope.row.id])"
                            v-if="hasPermission('BTN_COUPON_LIMIT_DELETE')"
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

        <limit-dialog v-if="showDialog" 
            :dialog="dialog"
            @confirm="handleConfirm"
            @close="showDialog = false"
            :isEdit="isEdit"
            :countryList="countryList" :dialogVisible="showDialog"></limit-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import limitDialog from './limitDialog'
import { listByQueryCouponWhiteListWithPage, addCouponWhiteList, deleteCouponWhiteList, updateCouponWhiteList } from '@/request/coupon'
export default {
    data () {
        return {
            dataList: [],
            load: false,
            showDialog: false,
            dialog: {
                id: '',
                countryCode: 'MY',
                productId: '',
                couponId: '',
                type: ''
            },
            totals: 0,
            isEdit: false,
            delIds: [],
            searchParam: {
                productId: '',
                couponId: '',
                countryCode: '',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            typeObj: {
                '3': '全部禁用',
                '2': '部分禁用',
                '1': '只可用'
            }
        }
    },
    created () {
        this.getList(1)
    },
    computed: {
        ...mapState({
            countryList: state => state.dict.countryList
        })
    },
    components: {
        limitDialog
    },
    methods: {
        resetSearchCoupon () {
            this.searchParam = {
                productId: '',
                couponId: '',
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
        handleSizeChange (value) {
            Object.assign(this.searchParam.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            let resParam = this.filterData(this.searchParam)
            listByQueryCouponWhiteListWithPage(resParam).then((res) => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.couponWhiteListResultPb
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                this.load = false
            })
        },
        handleAdd () {
            this.isEdit = false
            this.showDialog = true
            Object.assign(
                this.dialog, {
                    id: '',
                    countryCode: 'MY',
                    productId: '',
                    couponId: '',
                    type: 3
                }
            )
        }, 
        handleEdit (item) {
            this.isEdit = true
            this.showDialog = true
            Object.assign(
                this.dialog, {
                    id: item.id,
                    countryCode: item.countryCode,
                    productId: item.productId,
                    couponId: item.couponId,
                    type: Number(item.type)
                }
            )
        },
        handleConfirm (data) {
            let param = { ...data }
            if (this.isEdit) {
                delete param.countryCode
                delete param.productId
                updateCouponWhiteList(this.filterData(data)).then(res => {
                    if (res.ret.errcode == 1) {
                        this.showDialog = false
                        this.$message.success('修改成功')
                        this.getList()
                    }
                })
            } else {
                addCouponWhiteList(this.filterData(data)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.showDialog = false
                        this.$message.success('新增成功')
                        this.getList(1)
                    }
                })
            }
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
                deleteCouponWhiteList({
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
        }
    }
}
</script>