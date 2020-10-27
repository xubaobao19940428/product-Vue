<template>
    <div class="prize-product-shake-wrapper">
        <div class="operator-container mar-t-10">
            <div class="mar-b-10">中奖商品合集箱子设置</div>
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
                <el-table-column label="抽奖名称" align="center" prop="name"></el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.created | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" align="center" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.operation || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="130px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEditPrizePool(scope.row)">奖池设置</el-button>
                        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
        <prize-product-dialog v-if="showDialog" :showDialog="showDialog" :propParam="propParam" :countryCode="countryCode" @close="showDialog = false" @confirm="confirmEdit"></prize-product-dialog>
    </div>
</template>

<script>
    import prizeProductDialog from './components/prizeProductDialog'
    import { queryBox, delBox } from '@/api/shake.js'
    export default {
        props: {
            countryCode: String
        },
        data () {
            return {
                load: false,
                showDialog: false,
                dataList: [],
                propParam: {},
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                totals: 0
            }
        },
        components: {
            prizeProductDialog
        },
        methods: {
            handleSizeChange (val) {
                Object.assign(this.page, {
                    pageSize: val,
                    pageNum: 1
                })
                this.getList()
            },
            getList (pageNum) {
                this.page.pageNum = pageNum ? pageNum : 1
                this.load = true
                queryBox(Object.assign({
                    countryCode: this.countryCode
                }, this.page)).then((res) => {
                    this.load = false
                    if (res.ret.errCode === 0) {
                        this.dataList = res.data.list
                        this.totals = res.data.total
                    }
                }).catch(() => {
                    this.load = false
                })
            },
            handleAdd () {
                this.showDialog = true
                this.propParam = {}
            },
            handleEdit (data) {
                this.showDialog = true
                this.propParam = data
            },
            handleDelete (item) {
                this.$confirm('确认删除该盒子?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delBox({
                        id: item.id
                    }).then((res) => {
                        if (res.ret.errCode === 0) {
                            this.getList()
                        }
                    })
                }).catch(() => {})
            },
            confirmEdit () {
                this.getList()
                this.showDialog = false
            },
            handleEditPrizePool (row) {
                this.$router.push({
                    name: 'shakePrize',
                    query: {
                        id: row.id,
                        countryCode: this.countryCode
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
