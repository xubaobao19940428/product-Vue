<template>
    <div class="app-container">
        <div class="sales-filter-container">
            <el-form ref="salesFilterForm" inline label-width="90px" :model="queryData">
                <el-form-item label="商品：" class="filter-item" prop="value">
                    <el-input placeholder="请输入" size="medium" clearable v-model="queryData.value" class="input-with-select">
                        <el-select v-model="queryData.type" clearable slot="prepend" placeholder="请选择">
                            <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="增长倍数：" class="filter-item" prop="multiple">
                    <el-input placeholder="请输入倍数值" size="medium" clearable v-model="queryData.multiple" class="input-with-select">
                        <el-select v-model="queryData.multipleType" clearable slot="prepend" placeholder="请选择">
                            <el-option v-for="(item, index) in multipleTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="operation">
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList" v-loading="loading">
                <el-table-column prop="productId" label="商品ID" align="center" min-width="80px"></el-table-column>
                <el-table-column prop="cover" label="商品信息" align="center" min-width="180px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.cover)" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.title}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="growthStatus" label="增长状态" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.growthStatus === 1" size="mini">增长中</el-tag>
                        <el-tag type="info" v-if="scope.row.growthStatus === 2" size="mini">停止</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="multiple" label="增长倍数" align="center" width="270px">
                    <template slot-scope="{row}">
                        <template v-if="row.edit" >
                            <el-input-number size="mini" v-model="row.multiple" :min="0" :max="99999"></el-input-number>
                            <el-button class="cancel-btn" size="small" type="text" @click="cancelEdit(row)">
                              取消
                            </el-button>
                        </template>
                        <span v-else>{{ row.multiple }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="grandTotal" label="累计增长销量" align="center" width="170px">
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="130px">
                    <template slot-scope="{row}">
                        <el-button v-if="row.edit && hasPermission('BTN_SALES_MANAGE_EDIT_SAVE')" type="text" size="small"  @click="confirmEdit(row)">
                            保存
                        </el-button>
                        <el-button v-else type="text" size="small" @click="row.edit=!row.edit">
                            编辑
                        </el-button>
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
                :total="total"
                class="pagination">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import _ from 'lodash'
    import { setProductSalesConfig, getProductSales } from '@/request/sales'

    export default {
        // 商品销量管理
        name: 'SalesManage',
        data() {
            return {
                loading: false,
                total: 0,
                queryData: {
                    type: '',
                    value: '',
                    multipleType: null,
                    multiple: null,
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                typeList: [
                    {
                        name: '商品id',
                        code: '1'
                    },
                    {
                        name: 'skuId',
                        code: '2'
                    },
                    {
                        name: 'skuCode',
                        code: '3'
                    },
                    {
                        name: '商品名称',
                        code: '4'
                    }
                ],
                multipleTypeList: [
                    {
                        label: '=',
                        value: 1
                    }, {
                        label: '>',
                        value: 2
                    }, {
                        label: '<',
                        value: 3
                    }

                ],
                dataList: [
                    {
                        productId: '123',
                        productName: 'dddd',
                        cover: '',
                        growthStatus: '增长中',
                        multiple: 12,
                        originalMultiple: 12,
                        grandTotal: 1233,
                        edit: false
                    }
                ]
            }
        },
        components: {
        },
        computed: {

        },
        mounted() {
            this.getSalesManageList();
        },
        methods: {
            /**
             * 条件搜索
            */
            search() {
                this.getSalesManageList()
            },
            resetSearch() {
                this.$refs.salesFilterForm.resetFields()
                this.queryData.type = ''
                this.queryData.multipleType = null
                this.getSalesManageList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getSalesManageList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getSalesManageList()
            },
            getSalesManageList() {
                this.loading = true
                let params = {}
                switch (this.queryData.type) {
                    case '1':
                        params.productId = this.queryData.value
                    break;
                    case '2':
                        params.attrId = this.queryData.value
                    break;
                    case '3':
                        params.skuCode = this.queryData.value
                    break;
                    case '4':
                        params.title = this.queryData.value
                    break;
                    default:
                    break
                }
                params.multipleType = this.queryData.multipleType
                params.multiple = this.queryData.multiple
                params.page = this.queryData.page
                getProductSales(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        let sales = res.sales
                        _.forEach(sales, item => {
                            item.edit = false
                            item.originalMultiple = item.multiple
                        })
                        this.dataList = sales
                        this.total = res.total
                    }
                    console.log(res)
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            },
            cancelEdit(row) {
                console.log(row)
                row.multiple = row.originalMultiple
                row.edit = false
            },
            confirmEdit(row) {
                row.edit = false
                row.originalMultiple = row.multiple
                let params = row
                setProductSalesConfig(params).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.$message.success('修改成功')
                        this.getSalesManageList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .operation {
        margin-top: 20px;
    }
    .edit-input {
        padding-right: 50px;
    }
    .cancel-btn {
      position: absolute;
      right: 15px;
    }

</style>

<style lang="scss">
    .sales-filter-container {
        .el-select .el-input {
            width: 110px;
        }
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .image-box {
        height: 70px;
        width: 70px;
    }
    .block-right {
         height: 70px;
    }
</style>
