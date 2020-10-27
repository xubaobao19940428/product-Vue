<template>
    <div class="app-container">
        <div class="table-list">
            <el-table border :data="dataList"  v-loading="loading" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="productId" label="商品id" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="title" label="商品名称" align="center" min-width="220px">
                    <template slot-scope="scope" >
                        <div class="flex flex-item--center">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.cover)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.cover)" class="thumbnail" slot="reference">
                            </el-popover>
                            <span class="block-right">{{scope.row.title}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="收藏时间" align="center" min-width="160px">
                    <template slot-scope="scope" >
                        <span>{{scope.row.createTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { listUserProductCollect } from '@/request/collect'
    export default {
        name: 'favoriteList',
        data() {
            return {
                loading: false,
                dataList: [],
                queryData: {
                    userId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                totalCount: 0,
                userId: ''
            }
        },
        computed: {
        },
        created() {
            if (this.$route.query.userId) {
                this.userId = this.$route.query.userId
            }
        },
        mounted() {
        },
        methods: {
            handleCurrentChange(value) {
                this.queryData.page.pageNum = value
                this.getUserProductCollectList()
            },
            handleSizeChange(value) {
                this.queryData.page.pageSize = value
                this.queryData.page.pageNum = 1
                this.getUserProductCollectList()
            },
            getUserProductCollectList() {
                this.loading = true
                let params = this.queryData
                params.userId = this.userId
                listUserProductCollect(params).then((response) => {
                    this.loading = false
                    if (response.ret.errcode === 1) {
                        this.totalCount = response.total
                        this.dataList = response.collectProductInfo
                    }
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    .pagination {
        margin: 20px;
        float: right;
    }
</style>
