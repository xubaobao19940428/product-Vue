<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form inline>
                <el-form-item label="商品前台分组："
                              class="filter-item">
                    <el-cascader style="width: 100%"
                                 clearable
                                 filterable
                                 :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
                                 placeholder="请选择商品前台分组"
                                 :options="frontCategoryOptions"
                                 @change="getCategoryList"
                                 v-model="frontCategoryId"
                                 class="normalOperatorBox"
                                 size="medium">
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="param.productId" clearable size="medium" placeholder="商品ID,多个之间用,号隔开"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="getList(1)" size="medium">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="productList"
                  border
                  height="100%"
                  style="width: 100%">
            <el-table-column label="商品ID" prop="productId" fixed="left" min-width="120px"></el-table-column>
            <el-table-column fixed="left"
                             label="商品信息"
                             align="center"
                             min-width="200px">
                <template slot-scope="scope">
                    <div class="flex flex-item--center">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.spuCover)" class="previewImage">
                            <img v-popover:popover :src="dealShowFileSrc(scope.row.spuCover)"
                                 class="thumbnail"
                                 slot="reference">
                        </el-popover>
                        <span style="margin-left: 10px">{{scope.row.title}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="前台商品类目" align="center" min-width="120px">
                <template slot-scope="scope">
                    {{ scope.row.frontCate ? scope.row.frontCate.join('/') : '' }}
                </template>
            </el-table-column>
            <el-table-column label="总排序分" prop="totalSort" align="center"></el-table-column>
            <el-table-column label="人工权重分" align="center" min-width="180px">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sort"
                                     controls-position="right"
                                     size="small"
                                     :precision="0"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column fixed="right"
                             v-if="hasPermission('BTN_PRODUCT_CATEGORY_SORT')"
                             label="操作" align="center" width="200px">
                <template slot-scope="scope">
                    <el-button plain
                               type="primary"
                               size="mini"
                               @click="clickToSort(scope.row)">保存</el-button>
                    <el-button plain type="primary" size="mini"
                               @click="placeTop(scope.row)">
                        {{ scope.row.top == 0 ? '置顶' : '取消置顶' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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
    </div>
</template>
<script>
    import productCommon from '../common/common'
    import { listCategoryProduct, changeCategoryProductSort, setCategoryProductTop } from '@/request/product.js'

    export default {
        name: 'productSort',
        mixins: [productCommon],
        data () {
            return {
                frontCategoryId: [],
                frontCategoryList: [],
                frontCategoryOptions: [],
                productList: [],
                totals: 0,
                cateType: 1,
                param: {
                    frontCateId: '',
                    productId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
            }
        },
        created () {
            this.fetchCategory({
                level: 1,
                cateType: this.cateType,
                resolve: (data) => {
                    this.frontCategoryOptions = data
                }
            })
        },
        methods: {
            placeTop (item) {
                setCategoryProductTop(this.filterData({
                    productId: item.productId,
                    type: item.top == 0 ? 1 : 0
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                    }
                })
            },
            getCategoryList () {
                this.param.frontCateId = JSON.parse(this.frontCategoryId[1]).cateId
                this.productList = []
                this.totals = 0
                this.getList(1)
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            splitData (data) {
                let item = data.split(',')
                for (let i = 0; i < item.length; i++) {
                    item[i] = item[i].trim()
                }
                return data ? item : []
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                let param = JSON.parse(JSON.stringify(this.param))
                param.productId = this.splitData(param.productId)
                listCategoryProduct(this.filterData(param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.productList = res.categoryProductUnit
                        this.totals = res.total
                    }
                })
            },
            clickToSort ({ sort, productId }) {
                changeCategoryProductSort({
                    sort,
                    productId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                    }
                })
            }
        }
    }

</script>
<style lang="scss" scoped>
</style>
