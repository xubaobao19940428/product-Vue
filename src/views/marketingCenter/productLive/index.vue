<template>
    <div class="app-container product-list">
        <div class="filter-container">
            <el-form ref="liveFilter" inline label-width="80px" :model="queryModel" class="live-filter">
                <el-form-item label="商品ID：" prop="productId">
                    <el-input v-model="queryModel.productId" clearable size="medium" placeholder="请输入商品ID"></el-input>
                </el-form-item>
                <el-form-item label="直播链接：" prop="productId">
                    <el-input v-model="queryModel.liveUrl" clearable size="medium" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="站点：" class="filter-item" prop="countryCode">
                    <el-select v-model="queryModel.countryCode" size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <div class="operate-container">
                <el-button type="primary" v-if="hasPermission('BTN_PRODUCT_LIVE_ADD')" size="medium" icon="el-icon-plus" @click="addLimit">新增</el-button>
            </div>
            <el-table border :data="tableData" v-loading="loading" height="100%">
                <el-table-column prop="productId" label="商品ID" align="center" min-width="80px"></el-table-column>
                <el-table-column prop="limitName" label="商品信息" align="center" min-width="200px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.productPic)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.productPic)" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                                <span class="block-right" style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.productName}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="国家"  align="center" min-width="130px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="liveLink" label="直播链接" align="center" min-width="130px">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.liveUrl" class="item" effect="dark" :content="scope.row.liveUrl" placement="top">
                            <a :href="scope.row.liveUrl" target="_blank" style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:150px;">{{ scope.row.liveUrl}}</a>
                        </el-tooltip>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="hasPermission('BTN_PRODUCT_LIVE_EDIT')" @click="editLimit(scope.row)">编辑</el-button>
                        <el-button type="text" v-if="hasPermission('BTN_PRODUCT_LIVE_DEL')" @click="deleteLimit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="getProductLiveList"
                @size-change="handleSizeChange"
                :page-sizes="[20, 50, 100]"
                :current-page="queryModel.page.pageNum"
                :page-size="queryModel.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <product-live-edit-dialog :dialogVisible="dialogVisible" :title="dialogTitle" :liveData="liveData"
                                  @on-confirm="onEditConfirm" @on-cancel="dialogVisible = false">
        </product-live-edit-dialog>
    </div>
</template>

<script>
    import ProductLiveEditDialog from './components/ProductLiveEditDialog'
    import { LiveProductList, DeleteLiveProduct } from '@/request/product'

    export default {
        data () {
            return {
                loading: false,
                total: 0,
                queryModel: {
                    liveUrl: '',
                    countryCode: '',
                    productId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                tableData: [],
                liveData: {
                    productId: '',
                    countryCode: '',
                    startTime: null,
                    adviceTime: '',
                    liveUrl: ''
                },
                editType: 'add',
                dialogVisible: false,
                dialogTitle: ''
            }
        },
        components: {
            ProductLiveEditDialog
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        mounted () {
            this.getProductLiveList()
        },
        methods: {
            search () {
                this.getProductLiveList()
            },
            resetSearch () {
                this.$refs.liveFilter.resetFields()
                this.getProductLiveList()
            },
            handleSizeChange (value) {
                this.queryModel.page.pageSize = value
                this.getProductLiveList(1)
            },
            addLimit () {
                this.editType = 'add'
                this.dialogTitle = '新增商品直播'
                this.dialogVisible = true
                this.liveData = {
                    productId: '',
                    countryCode: '',
                    startTime: null,
                    adviceTime: '',
                    liveUrl: ''
                }
            },
            editLimit (row) {
                this.editType = 'edit'
                this.liveData = JSON.parse(JSON.stringify(row))
                this.dialogTitle = '编辑商品直播'
                this.dialogVisible = true
            },
            onEditConfirm () {
                this.dialogVisible = false
                this.getProductLiveList()
            },
            getProductLiveList () {
                this.loading = true
                LiveProductList(this.filterData(this.queryModel)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.tableData = res.liveProductPbs
                        this.total = res.total
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            // 删除
            deleteLimit (row) {
                this.$confirm(`是否确定删除[${row.productId}]?`, '删除直播', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DeleteLiveProduct({
                        id: row.id
                    }).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功！')
                            this.getProductLiveList()
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch(() => {
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

<style lang="scss">
    .live-filter {
        .el-select .el-input {
            width: 110px;
        }
        .input-with-select .el-input-group__prepend {
            background-color: #fff;
        }
    }
    .image-box {
        height: 70px;
        width: 70px;
    }
    .block-right {
         height: 70px;
    }

</style>
