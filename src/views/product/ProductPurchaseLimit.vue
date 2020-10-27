<template>
    <div class="app-container product-list">
        <div class="filter-container">
            <el-form inline label-width="80px" :model="queryModel">
                <el-form-item label="状态：" class="filter-item" prop="type">
                    <el-select v-model="queryModel.status" filterable clearable size="medium" placeholder="状态选择">
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品ID：" class="filter-item" prop="type">
                    <el-input v-model="queryModel.productId" size="medium" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item class="filter-item">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <div class="operate-container">
                <el-button type="primary" size="medium" icon="el-icon-plus">新增限购</el-button>
            </div>
            <el-table border :data="tableData" v-loading="loading" height="100%">
                <el-table-column prop="limitId" label="限购ID" align="center" min-width="80px"></el-table-column>
                <el-table-column prop="limitRule" label="限购规则" align="center" min-width="200px"></el-table-column>
                <el-table-column prop="limitTime" label="限购时间" align="center" min-width="200px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="100px"></el-table-column>
                <el-table-column prop="update" label="更新人" align="center" width="150px"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="200px"></el-table-column>
                <el-table-column label="操作" align="center" width="200px"></el-table-column>
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
    export default {
        // 商品限购
        name: 'ProductPurchaseLimit',
        data() {
            return {
                loading: false,
                total: 0,
                page: 1,
                pageSize: 10,
                statusList: [{
                    label: '全部状态',
                    value: null
                }, {
                    label: '进行中',
                    value: '1'
                }, {
                    label: '未开始',
                    value: '2'
                }, {
                    label: '已结束',
                    value: '3'
                }],
                queryModel: {
                    status: '',
                    productId: ''
                },
                queryData: {
                    page: {
                        pageSize: 10,
                        pageNum: 1
                    }
                },
                settingVisible: false,
                tableData: [
                    {
                        limitId: 1231,
                        limitRule: '每个用户最多可购买1件',
                        limitTime: '2019-10-01 12:00:22 ~ 2019-10-11 12:00:22',
                        status: '进行中',
                        update: '思平',
                        updateTime: '2019-10-01 12:00:22',
                    }
                ]
            }
        },
        components: {
        },
        watch: {
        },
        methods: {
            search() {},
            resetSearch() {},
            handleSizeChange() {},
            handleCurrentChange() {},
            handleOptionsFront() {}
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
