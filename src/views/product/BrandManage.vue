<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="brandFilterForm" inline label-width="90px" :model="queryData">
                <el-form-item label="品牌名：" class="filter-item" prop="name">
                    <el-input v-model="queryData.name" placeholder="请输入品牌名" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态：" class="filter-item" prop="status">
                    <el-select v-model="queryData.status" size="medium" clearable>
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="operator-container">
                <el-button icon="el-icon-plus" type="primary" v-if="hasPermission('BTN_BRAND_MANAGE_ADD')" @click="addBand" class="operator-item" size="small">新增品牌</el-button>
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table height="100%" :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="comeFrom" label="来源" align="center" width="180">
                </el-table-column>
                <el-table-column prop="nameCn" label="中文名称" align="center">
                </el-table-column>
                <el-table-column prop="nameEn" label="英文名称" align="center">
                </el-table-column>
                <el-table-column prop="statusDesc" label="状态" align="center" width="180">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" size="mini">有效</el-tag>
                        <el-tag v-if="scope.row.status === 2" size="mini" type="info">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="240">
                     <template slot-scope="scope">
                        <template  v-if="hasPermission('BTN_BRAND_MANAGE_FORBIDDEN')">
                              <el-button plain type="primary" size="mini" @click="enableBrand(scope.row)" v-if="scope.row.status == 2">启用</el-button>
                              <el-button plain type="warning" size="mini" @click="disableBrand(scope.row)" v-else>禁用</el-button>
                        </template>
                      <el-button plain type="primary" size="mini" v-if="hasPermission('BTN_BRAND_MANAGE_EDIT')" @click="editBrand(scope.row)" >编辑</el-button>
                      <el-button plain type="danger" size="mini" v-if="hasPermission('BTN_BRAND_MANAGE_DELETE')" @click="deleteBrand(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
        <brand-edit-dialog :dialogVisible="editDialogVisible" :title="editDailogTitle" :brandData="brandData"
            @on-cancle="handleCancleEdit" @on-confirm="handleConfirmEdit">
        </brand-edit-dialog>
    </div>
</template>

<script>
    import { brandInfoAdd, brandInfoModify, brandInfoGet, brandChangeStatus, brandDelete } from '@/request/product'
    import BrandEditDialog from './components/BrandEditDialog'
    export default {
        name: 'brandManage',
        data() {
            return {
                loading: false,
                queryData: {
                    name: '',
                    status: null, // 有效状态, 1有效, 2 无效
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                brandName: '',
                tableData: [],
                totalCount: 0,
                statusList: [{
                        name: '有效',
                        value: 1
                    },
                    {
                        name: '失效',
                        value: 2
                    }
                ],
                status: '',
                editDialogVisible: false,
                editDailogTitle: '',
                brandData: {
                    brandId: '',
                    nameCn: '',
                    nameEn: '',
                    comeFrom: '',
                    memo: '',
                    logo: ''
                },
                editType: 'add'
            }
        },
        components: {
            BrandEditDialog
        },
        mounted() {
            this.getBrandList()
        },
        methods: {
            search() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getBrandList()
            },
            resetSearch() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.$refs.brandFilterForm.resetFields()
                this.getBrandList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getBrandList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getBrandList()
            },
            /**
             * 获取商品类型
             */
            getBrandList() {
                this.loading = true
                let params = this.queryData
                brandInfoGet(this.filterData(params)).then((response) => {
                    this.loading = false
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.tableData = res.brandInfo
                        this.totalCount = res.total
                    }
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            addBand() {
                this.editType = "add"
                this.editDialogVisible = true
                this.editDailogTitle = '新增品牌'
                this.brandData = {
                    brandId: '',
                    nameCn: '',
                    nameEn: '',
                    comeFrom: '',
                    memo: '',
                    logo: ''
                }
            },
            editBrand(rowData) {
                this.editType = "edit"
                this.editDialogVisible = true
                this.editDailogTitle = '编辑品牌'
                this.brandData.brandId = rowData.brandId
                this.brandData.nameCn = rowData.nameCn
                this.brandData.nameEn = rowData.nameEn
                this.brandData.comeFrom = rowData.comeFrom
                this.brandData.memo = rowData.memo
                this.brandData.logo = rowData.logo
            },
            deleteBrand(rowData) {
                this.$confirm('是否删除此品牌', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.brandDelete(rowData.brandId)
                }).catch(() => {
                })
            },
            enableBrand(rowData) {
                this.$confirm('是否启用此品牌', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.changeBrandStatus(rowData.brandId, 1)
                }).catch(() => {
                })
            },
            disableBrand(rowData) {
                this.$confirm('是否禁用此品牌', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.changeBrandStatus(rowData.brandId, 2)
                }).catch(() => {
                })
            },
            handleCancleEdit() {
                this.editDialogVisible = false
            },
            handleConfirmEdit(data) {
                this.editDialogVisible = false
                if (this.editType === 'add') {
                    this.addBrandInfo(data)
                } else {
                    this.modifyBrandInfo(data)
                }

            },
            addBrandInfo(params) {
                brandInfoAdd(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('品牌新增成功！')
                        this.getBrandList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            modifyBrandInfo(params) {
                brandInfoModify(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('品牌修改成功！')
                        this.getBrandList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            brandDelete(brandId) {
                let params = {
                    brandId: brandId
                }
                brandDelete(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('品牌删除成功！')
                        this.getBrandList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            changeBrandStatus(brandId, status) {
                let params = {
                    brandId: brandId,
                    status: status
                }
                brandChangeStatus(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('品牌状态修改成功！')
                        this.getBrandList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>

