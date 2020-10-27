<template>
    <div class="task-detail">
        <el-table :data="tableData" border style="width: 100%" >
            <el-table-column label="任务单号" width="240" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>{{scope.row.importNo || '-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="执行时间" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.executeTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="采购单号" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.purchaseOrderNo}}</div>
                </template>
            </el-table-column>
            <el-table-column label="skuCode" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.skuCode}}
                </template>
            </el-table-column>
            <el-table-column label="处理结果" width="180" align="center">
                <template slot-scope="scope">
                    {{importStatus[scope.row.importStatus]}}
                </template>
            </el-table-column>
            <el-table-column label="备注" width="300" align="center">
                <template slot-scope="scope">
                    {{scope.row.remark}}
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-pagination
                @size-change="handleSizeChanges"
                @current-change="handleCurrentChanges"
                :current-page="queryData.page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { PurEnsureImportDetailPage } from '@/request/purchase'

    export default {
        data () {
            return {
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    } 
                },
                total: 0,
                tableData: [],
                importStatus: {
                    1: "导入处理中",
                    2: "导入失败",
                    3: "导入成功"
                },
                importNo: ''
            }
        },
        mounted () {
            this.importNo = this.$route.query.importNo
            this.getPurEnsureImportDetailPage(this.$route.query.importNo)
        },
        methods: {
            getPurEnsureImportDetailPage (importNo) {
                let params = {
                    page: this.queryData.page,
                    importNo:importNo?importNo:this.importNo
                }
                PurEnsureImportDetailPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.list
                        this.total = res.total
                    }
                })
            },
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getPurEnsureImportDetailPage()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getPurEnsureImportDetailPage()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .task-detail{
        overflow: scroll;
    }
</style>