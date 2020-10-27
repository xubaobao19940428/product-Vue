<template>
    <div class="add-product-dialog">
        <el-dialog
            title="添加商品"
            :visible="showAddProduct"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <div class="activity-input">
                商品ID: <el-input
                v-model="productData.value"
                placeholder="输入商品ID搜索"
                style="width: 72%"
                clearable
                @keyup.enter.native="getProduct(1)">
            </el-input>
                <el-button class="mar-l-10" type="primary" @click="getProduct(1)">确定</el-button>
                <p class="center mar-t-10">当前已选中：<el-tag v-for="item in selectedId" :key="item">{{ item }}</el-tag></p>
            </div>
            <el-table
                :data="productData.dataList"
                v-loading="load"
                row-key="productId"
                ref="noActivityProductTable"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column label="商品ID" prop="productId" align="center" width="170"></el-table-column>
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <div class="img-box">
                            <img :src="dealShowFileSrc(scope.row.cover)"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" align="center" prop="title"></el-table-column>
                <el-table-column :label="`VIP价(${getCurrencyUnit(countryCode, 'currencyUnit')})`" align="center" prop="priceVip"></el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination @size-change="val => handleSizeChange(val, 'productData')"
                               @current-change="getProduct"
                               :current-page="productData.page.pageNum"
                               :page-sizes="[5, 10, 20, 50]"
                               :page-size="productData.page.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="productData.totals">
                </el-pagination>
            </div>

            <span slot="footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getProductSpu } from '@/request/product'
    import { splitData } from '@/utils/index'
    export default {
        props: {
            showAddProduct: Boolean
        },
        data () {
            return {
                selectedId: [],
                load: false,
                productData: {
                    value: '',
                    dataList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    totals: 0
                }
            }
        },
        computed: {
            countryCode () {
                return this.$route.query.countryCode
            }
        },
        created () {},
        methods: {
            reset () {
            },
            handleSimpleSelect (val, type) {
                if (val) {
                    this.selectedId = [val[type]] // 选中的id 可以是活动也可以是分组
                } else {
                    this.selectedId = []
                }
                console.log(val)
            },
            handleSizeChange (value, type) {
                Object.assign(this[type].page, {
                    pageSize: value,
                    pageNum: 1
                })
                this.getData(type)
            },
            handleConfirm () {
                if (this.selectedId && this.selectedId.length) {
                    let param = {
                        selectedId: this.selectedId,
                        isChange: true
                    }
                    this.$emit('confirm', param)
                } else {
                    this.$message.error('请先选择对应的项')
                }
            },
            handleSelectionChange (val) {
                this.selectedId = val.map(item => item.productId)
            },
            getProduct (page) {
                let temp = { ...this.productData }
                if (!temp.value) return
                this.load = true
                temp.page.pageNum = page || temp.page.pageNum

                let params = {
                    page: temp.page,
                    productId: temp.value ? splitData(temp.value) : [],
                    countryCode: this.countryCode
                }

                getProductSpu(this.filterData(params)).then(res => {
                    this.load = false
                    if (res.ret.errcode === 1) {
                        this.productData.dataList = res.spu
                        this.productData.totals = res.total
                    }
                }).catch(() => {
                    this.load = false
                })
            },
            handleClose () {
                this.reset()
                this.$emit('cancel')
            },
            getData (val) {
                switch (val) {
                    case 'productData':
                        this.getProduct(1)
                        break
                }
            }
        }
    }
</script>

<style lang="scss">
    .add-product-dialog {
        width: 100%;
        .el-dialog{
            width: 80%;
        }
        .activity-input {
            padding: 0 16px 8px;
            margin: 0 auto;
            text-align: center;
        }

        .cr {
            color: #f56c6c;
            margin-top: 8px;
        }
        .center {
            text-align: center;
        }
        .pagination-box {
            padding: 8px 0 16px 0;
        }

        .img-box {
            width: 60px;
            height: 60px;
            display: inline-block;
            img {
                width: 100%;
            }
        }

        .el-table{
            max-height: 100%;
            height: 100%;
            .el-table__header{
                th{
                    background:#F5F7FA;
                    color: #606266;
                }
            }
        }

        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
</style>
