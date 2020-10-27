<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="supplierFilterForm" inline label-width="90px" :model="queryData">
                <el-form-item label="供应商名：" class="filter-item" prop="supplierName">
                    <el-input placeholder="请输入供应商名" size="medium" clearable v-model="queryData.supplierName" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="供应简称：" class="filter-item" prop="shortName">
                    <el-input placeholder="请输入供应简称" size="medium" clearable v-model="queryData.shortName" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="合作状态：" class="filter-item" prop="cooperativeStatus">
                    <el-select v-model="queryData.cooperativeStatus" size="medium" clearable @change="search">
                        <el-option v-for="(item, index) in cooperativeStatusList" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" class="filter-item" prop="status">
                    <el-select v-model="queryData.status" size="medium" clearable @change="search">
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button icon="el-icon-plus" type="primary" v-if="hasPermission('BTN_SUPPLIER_MANAGE_ADD')" @click="clickToEditSupplier('','add')" class="operator-item" size="medium">新增供应商</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="tableData" border height="100%" style="width: 100%" v-loading="loading">
                <el-table-column prop="supplierId" align="center" label="供应商ID" min-width="120">
                </el-table-column>
                <el-table-column prop="supplierShortCode" align="center" label="供应商简码" min-width="120">
                </el-table-column>
                <el-table-column prop="supplierName" align="center" label="供应商名称" min-width="190">
                </el-table-column>
                <el-table-column prop="shortName" align="center" label="供应商简称" min-width="140">
                </el-table-column>
                <el-table-column prop="typeDesc" align="center" label="供应商类型" width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type == 1" size="mini">个人</el-tag>
                        <el-tag  v-if="scope.row.type == 2" type="success" size="mini">企业</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="cooperativeStatus" label="合作状态" align="center" width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cooperativeStatus == 1" effect="dark" type="success" size="mini">正常合作</el-tag>
                        <el-tag v-if="scope.row.cooperativeStatus == 2" effect="dark" type="info" size="mini">终止合作</el-tag>
                        <el-tag v-if="scope.row.cooperativeStatus == 9" effect="dark" type="danger" size="mini">黑名单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" size="mini">有效</el-tag>
                        <el-tag v-if="scope.row.status == 2" type="info" size="mini">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="160" fixed="right">
                    <template slot-scope="scope">
                        <template v-if="hasPermission('BTN_SUPPLIER_MANAGE_FORBIDDEN')">
                            <el-button v-if="scope.row.status == 1 && hasPermission('BTN_SUPPLIER_MANAGE_FORBIDDEN')" type="text" size="mini" @click="supplierDisable(scope.row)" >禁用</el-button>
                            <el-button v-if="scope.row.status == 2 && hasPermission('BTN_SUPPLIER_MANAGE_OPEN')" type="text" size="mini" @click="supplierEnable(scope.row)">启用</el-button>
                        </template>
                        <el-button v-if="hasPermission('BTN_SUPPLIER_MANAGE_EDIT')" type="text" size="mini"  @click="clickToEditSupplier(scope.row)" >编辑</el-button>
<!--                        <el-button  v-if="hasPermission('BTN_SUPPLIER_MANAGE_DELETE')" type="text" size="mini" @click="supplierDelete(scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :total="totals">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {
        supplierPage,
        deleteSupplier,
        disableSupplier,
        enableSupplier
    } from '@/request/supplier'
    export default {
        // 供应商管理
        name: 'supplierManage',
        components: {},
        data () {
            return {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                supplierName: '',
                tableData: [],
                totals: 0,
                cooperativeStatusList: [{
                                            name: '正常合作',
                                            value: 1
                                        },
                                        {
                                            name: '终止合作',
                                            value: 2
                                        },
                                        {
                                            name: '黑名单',
                                            value: 9
                                        }
                ],
                statusList: [{
                                 name: '有效',
                                 value: 1
                             },
                             {
                                 name: '无效',
                                 value: 2
                             }
                ],
                status: '',
                queryData: {
                    supplierName: '',
                    shortName: '',
                    cooperativeStatus: null,
                    status: null,
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                }
            }
        },
        mounted () {
            this.getSupplierList()
        },
        methods: {
            // 获取供应商列表
            getSupplierList () {
                this.loading = true
                let params = this.filterData(this.queryData)
                supplierPage(params).then((response) => {
                    console.log(response)
                    this.loading = false
                    if (response.ret.errcode === 1) {
                        this.totals = response.total
                        let supplierList = []
                        supplierList = response.list
                        this.tableData = supplierList
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            handleCurrentChange (value) {
                this.queryData.page.pageSize = 20
                this.queryData.page.pageNum = value
                this.getSupplierList()
            },
            handleSizeChange (value) {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = value
                this.getSupplierList()
            },
            // 新增/编辑供应商
            clickToEditSupplier (value,type) {
                let supplierId = 0
                if (value.supplierId) {
                    supplierId = value.supplierId
                }
                this.$router.push({
                    name: 'supplierEdit',
                    query: {
                        supplierId: supplierId,
                        type:type
                    }
                })
            },
            resetSearch () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.$refs.supplierFilterForm.resetFields()
                this.getSupplierList()
            },
            search () {
                this.getSupplierList()
            },
            supplierDelete (row) {
                this.$confirm('是否删除此供应商', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.delete(row.supplierId)
                }).catch(() => {
                })
            },
            delete (supplierId) {
                let params = {
                    supplierId: supplierId
                }
                deleteSupplier(params).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('供应商删除成功！')
                        this.getSupplierList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            supplierDisable (row) {
                this.$confirm('是否禁用此供应商', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.disable(row.supplierId)
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
                })
            },
            disable (supplierId) {
                let params = {
                    supplierId: supplierId
                }
                disableSupplier(params).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        this.getSupplierList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            supplierEnable (row) {
                this.$confirm('是否启用此供应商', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.enable(row.supplierId)
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
                })
            },
            enable (supplierId) {
                let params = {
                    supplierId: supplierId
                }
                enableSupplier(params).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        this.getSupplierList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>
