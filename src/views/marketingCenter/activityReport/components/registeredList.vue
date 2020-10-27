<template>
    <div>
        <div>
           <el-button type="primary" @click="submitApply">提交报名</el-button>
            <el-button type="danger">废弃</el-button>
            <el-button type="primary" icon="el-icon-edit">批量编辑</el-button> 
            <el-button type="text">切换直SKU</el-button>
        </div>
        <el-table :data="tableData" ref="subjectTable" style="width: 100%;height:100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :show-overflow-tooltip="true" width="55" fixed="left"></el-table-column>
            <el-table-column align="center" label="主图" width="150" fixed="left">
                <template slot-scope="scope">
                    <div><img :src="dealShowFileSrc(scope.row.coverPic[0])" /></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品信息" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品ID" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="类目" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动时间" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="分组" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="成本价" width="250">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="VIP价" width="120">
                <template slot-scope="scope">
                    <div>{{}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="建议活动价" width="200">
                <template slot-scope="scope">
                    <div></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动价" width="200">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动佣金率" width="250">
                <template slot-scope="scope">
                    
                </template>
            </el-table-column>
            <el-table-column align="center" label="估算毛利" width="250">
                <template slot-scope="scope">
                    
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动库存" width="250">
                <template slot-scope="scope">
                    
                </template>
            </el-table-column>
        </el-table>
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
        data () {
            return {
                queryData: {
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                total: 0
            }
        },
        methods: {
            submitApply () {

            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getProductList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getProductList()
            },
        }
    }
</script>
<style lang="scss" scoped>

</style>