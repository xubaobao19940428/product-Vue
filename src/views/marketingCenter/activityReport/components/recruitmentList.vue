<template>
    <div>
        <div>
            <el-button type="primary">录用</el-button>
            <el-button type="danger">驳回</el-button>
            <el-button type="primary" icon="el-icon-edit">批量编辑</el-button> 
            <el-button type="danger">冲图校验</el-button>
        </div>
        <el-table :data="tableData" ref="subjectTable" style="width: 100%;height:100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :show-overflow-tooltip="true" width="55" fixed="left"></el-table-column>           
            <el-table-column align="center" label="商品ID" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品信息" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="类目" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="预热时间" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="开始时间" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="结束时间" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="分组" width="150">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="营销文案" width="250">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品角标" width="120">
                <template slot-scope="scope">
                    <div>{{}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="提报人" width="200">
                <template slot-scope="scope">
                    <div></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="提报时间" width="200">
                <template slot-scope="scope">
                    <div></div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="冲图校验" width="200">
                <template slot-scope="scope">
                </template>
            </el-table-column>
             <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text">编辑</el-button>
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