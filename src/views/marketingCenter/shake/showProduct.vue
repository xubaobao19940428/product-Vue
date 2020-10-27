<template>
    <div class="show-product-share-wrapper">
        <div class="operator-container mar-t-10">
            <div class="mar-b-10">展示商品（只展示抽不中）</div>
            <el-button icon="el-icon-plus" type="primary"
                size="medium"
                @click="handleAdd"
                class="operator-item"
            >
                新增
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" v-loading="load">
                <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                <el-table-column label="奖品名称" align="center">
                    <template slot-scope="scope">
                        <span>{{ formatItem(scope.row.name) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="图片"
                    align="center"
                    min-width="100px">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="dealShowFileSrc(formatItem(scope.row.icon))" class="previewImage">
                            <img :src="dealShowFileSrc(formatItem(scope.row.icon))" class="thumbnail" slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="商品价值" align="center">
                    <template slot-scope="scope">
                        {{ getText(scope.row.type) }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.operation || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
                        <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="page.pageNum"
                :page-size="page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>

        <show-product-dialog v-if="showProductDialog" :showProductDialog="showProductDialog" :propParam="propParam" :countryCode="countryCode" :priceList="priceList" @close="showProductDialog = false" @confirm="handleConfirm"></show-product-dialog>
    </div>
</template>

<script>
    import showProductDialog from './components/showProductDialog'
    import { showProductList, removeShowProductList } from '@/api/shake.js'
    import common from '@/js/common/mixins.js'
    export default {
        props: {
            countryCode: String
        },
        mixins: [common],
        data () {
            return {
                showProductDialog: false,
                load: false,
                priceList: [{
                    key: 3,
                    label: '高价值'
                }, {
                    key: 2,
                    label: '中价值'
                }, {
                    key: 1,
                    label: '低价值'
                }],
                dataList: [],
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                totals: 0,
                propParam: {}
            }
        },
        components: {
            showProductDialog
        },
        methods: {
            handleSizeChange (val) {
                Object.assign(this.page, {
                    pageSize: val,
                    pageNum: 1
                })
                this.getList()
            },
            formatItem (item) {
                let data = JSON.parse(item)
                return data['cn'] ? data['cn'] : data['en']
            },
            getList (pageNum) {
                this.load = true
                this.page.pageNum = pageNum ? pageNum : 1
                console.log(this.page)
                showProductList(Object.assign({
                    countryCode: this.countryCode
                }, this.page)).then((res) => {
                    console.log(res)
                    this.load = false
                    if (res.ret.errCode === 0) {
                        this.dataList = res.data.list
                        this.totals = res.data.total
                    }
                }).catch(() => {
                    this.load = false
                })
            },
            handleDel (item) {
                this.$confirm('确认删除该商品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeShowProductList({
                        id: item.id
                    }).then((res) => {
                        if (res.ret.errCode === 0) {
                            this.getList()
                        }
                    })
                }).catch(() => {})
            },
            getText (item) {
                let data = this.priceList.find((val) => {
                    return val.key == item
                })
                return data ? data.label : ''
            },
            handleEdit (item) {
                this.propParam = item
                this.showProductDialog = true
            },
            handleAdd () {
                this.propParam = {}
                this.showProductDialog = true
            },
            handleConfirm () {
                this.showProductDialog = false
                this.getList()
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
