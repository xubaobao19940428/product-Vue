<template>
    <div class="app-container product-list">
        <div class="filter-container">
            <el-form ref="limitFilter" inline label-width="80px" :model="queryModel">
                <el-form-item label="状态：" class="filter-item" prop="type">
                    <el-select v-model="queryModel.type" filterable clearable size="medium" placeholder="状态选择">
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品ID：" class="filter-item" prop="productId">
                    <el-input v-model="queryModel.productId" size="medium" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="getPurchaseLimitList(1)" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <div class="operate-container">
                <el-button type="primary" v-if="hasPermission('BTN_PURCHASE_LIMIT_ADD')" size="medium" icon="el-icon-plus" @click="addLimit">新增限购</el-button>
            </div>
            <el-table border :data="tableData" v-loading="loading" height="100%">
                <el-table-column prop="limitId" label="限购ID" align="center" min-width="80px"></el-table-column>
                <el-table-column prop="limitName" label="限购名称" align="center" min-width="200px"></el-table-column>
                <el-table-column label="限购时间" align="center" min-width="200px">
                    <template slot-scope="scope" >
                        <span> {{scope.row.startTime | secondTimeFormat}} ~ {{scope.row.endTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="activeType" label="状态" align="center" width="100px">
                    <template slot-scope="scope" >
                        <el-tag v-if="scope.row.activeType === 1" type="info" size="mini">未开始</el-tag>
                        <el-tag v-if="scope.row.activeType === 2" type="danger" size="mini">进行中</el-tag>
                        <el-tag v-if="scope.row.activeType === 3" type="success" size="mini">已结束</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="operationName" label="更新人" align="center" width="150px">
                    <template slot-scope="scope" >
                        <span> {{scope.row.operationName || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="200px">
                    <template slot-scope="scope" >
                        <span> {{scope.row.updateTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="140px">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_PURCHASE_LIMIT_EDIT')"  type="text" @click="editLimit(scope.row)">编辑</el-button>
                        <el-button v-if="hasPermission('BTN_PURCHASE_LIMIT_DEL')"  type="text" @click="deleteLimit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="getPurchaseLimitList"
                @size-change="handleSizeChange"
                :page-sizes="[20, 50, 100]"
                :current-page="queryModel.page.pageNum"
                :page-size="queryModel.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <purchase-limit-edit-dialog :dialogVisible="dialogVisible" :title="dialogTitle" :limitData="limitData"
                                    @on-comfirm="onEditComfirm" @on-cancle="onEditCancle">
        </purchase-limit-edit-dialog>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText"
                        @on-cancle="cancleDel" @on-confirm="confirmDel">
        </confirm-dialog>
    </div>
</template>

<script>
    // import moment from 'moment'
    import PurchaseLimitEditDialog from './components/PurchaseLimitEditDialog'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import { addPurchaseLimitConfig, listPurchaseLimitConfig, deletePurchaseLimitConfig, updatePurchaseLimitConfig } from '@/request/promotion'

    export default {
        // 商品限购
        name: 'PurchaseLimit',
        data () {
            return {
                loading: false,
                total: 0,
                statusList: [{
                    label: '全部状态',
                    value: null
                }, {
                    label: '未开始',
                    value: '1'
                }, {
                    label: '进行中',
                    value: '2'
                }, {
                    label: '已结束',
                    value: '3'
                }],
                queryModel: {
                    type: '',
                    productId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }

                },
                settingVisible: false,
                tableData: [],
                limitData: {
                    limitName: '',
                    groupType: 1,
                    countryCode: '',
                    datetimeRange: [],
                    limitQuantity: null,
                    cateId: [],
                    productId: [],
                    purchaseLimitRuleType: 1
                },
                editType: 'add',
                dialogVisible: false,
                dialogTitle: '',
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                rowData: ''
            }
        },
        components: {
            PurchaseLimitEditDialog,
            ConfirmDialog
        },
        mounted () {
            this.getPurchaseLimitList()
        },
        methods: {
            resetSearch () {
                this.$refs.limitFilter.resetFields()
                this.queryModel.page.pageNum = 1
                this.queryModel.page.pageSize = 20
                this.getPurchaseLimitList()
            },
            handleSizeChange (value) {
                this.queryModel.page.pageSize = value
                this.getPurchaseLimitList(1)
            },
            addLimit () {
                this.editType = 'add'
                this.dialogTitle = '新增限购'
                this.limitData = {
                    limitName: '',
                    groupType: 1,
                    countryCode: '',
                    datetimeRange: [],
                    limitQuantity: null,
                    cateId: [],
                    productId: [],
                    purchaseLimitRuleType: 1
                }
                this.dialogVisible = true
            },
            editLimit (row) {
                this.editType = 'edit'
                this.rowData = row
                this.limitData.limitName = row.limitName
                this.limitData.groupType = row.groupType
                this.limitData.countryCode = row.countryCode
                let start = new Date(Number(row.startTime))
                let end = new Date(Number(row.endTime))
                this.limitData.datetimeRange = [start, end]
                this.limitData.limitQuantity = row.limitQuantity
                this.limitData.productId = row.productId
                this.limitData.cateId = row.categoryUnit
                this.limitData.purchaseLimitRuleType = row.purchaseLimitRuleType
                this.dialogTitle = '编辑商品限购'
                this.dialogVisible = true
            },
            onEditComfirm (data) {
                let limitData = {}
                limitData.limitName = data.limitName
                limitData.groupType = data.groupType
                limitData.countryCode = data.countryCode
                limitData.startTime = moment(data.datetimeRange[0]).valueOf() + ''
                limitData.endTime = moment(data.datetimeRange[1]).valueOf() + ''
                limitData.limitQuantity = data.limitQuantity
                limitData.productId = data.productId
                limitData.cateId = data.cateId
                limitData.purchaseLimitRuleType = data.purchaseLimitRuleType
                if (this.editType === 'add') {
                    this.addPurchaseLimit(limitData)
                } else {
                    this.updatePurchaseLimit(limitData)
                }
                this.dialogVisible = false
            },
            onEditCancle () {
                this.dialogVisible = false
            },
            getPurchaseLimitList (page) {
                this.queryModel.page.pageNum = page || this.queryModel.page.pageNum
                let params = this.queryModel
                this.loading = true
                listPurchaseLimitConfig(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.tableData = res.purchaseLimitConfig
                        this.total = res.total
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            addPurchaseLimit (limitData) {
                let params = limitData
                addPurchaseLimitConfig(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('添加成功！')
                        this.getPurchaseLimitList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            updatePurchaseLimit (limitData) {
                let params = limitData
                params.limitId = this.rowData.limitId
                updatePurchaseLimitConfig(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('更新成功！')
                        this.getPurchaseLimitList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            deleteLimit (row) {
                this.rowData = row
                this.confirmVisible = true
                this.confirmDialogTitle = '删除限购规则'
                this.confirmDialogText = `是否确定删除[${row.limitName}]?`
            },
            cancleDel () {
                this.confirmVisible = false
            },
            confirmDel () {
                this.confirmVisible = false
                let params = {
                    limitId: this.rowData.limitId
                }
                deletePurchaseLimitConfig(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('删除成功！')
                        this.getPurchaseLimitList()
                    }
                    console.log(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .product-list {
        .operate-container {
            padding: 20px 0;
        }
    }
</style>
