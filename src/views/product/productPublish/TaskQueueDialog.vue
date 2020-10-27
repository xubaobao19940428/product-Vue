<template>
    <div class="task-queue-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="true" width="1200px"  append-to-body @close="handleDialogClose">
            <div slot="title">
                {{title}}
            </div>
            <el-table :data="tableList" v-loading="loading" border fit highlight-current-row height="500" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="keyword" label="搜索词" fixed="left" align="center" width="200px">
                </el-table-column>
                <el-table-column prop="categoryName" label="归属类目" align="center" width="220px">
                </el-table-column>
                <el-table-column label="参数属性" align="center" width="140px">
                    <template slot-scope="scope" >
                        {{scope.row.productAttr.join(',')}}
                    </template>
                </el-table-column>
                <el-table-column label="单品重量(RMB)" align="center" width="140px">
                    <template slot-scope="scope" >
                        {{scope.row.minWeight }} ~ {{scope.row.maxWeight}}
                    </template>
                </el-table-column>
                <el-table-column label="供货价(RMB)" align="center" width="130px">
                    <template slot-scope="scope" >
                        {{scope.row.minPrice }} ~ {{scope.row.maxPrice}}
                    </template>
                </el-table-column>
                <el-table-column prop="target" label="目标数量" align="center" width="80px">
                </el-table-column>
                <el-table-column prop="progress" label="实际上货" align="center" width="80px">
                </el-table-column>
                <el-table-column label="启动时间" align="center" width="160px">
                    <template slot-scope="scope" >
                        {{scope.row.startTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" width="160px">
                    <template slot-scope="scope" >
                        {{scope.row.finishTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column prop="creatorName" label="操作人" align="center" width="130px">
                    <template slot-scope="scope" >
                        {{scope.row.creatorName}}({{scope.row.creatorId}})
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" align="center" width="160px">
                    <template slot-scope="scope" >
                        {{scope.row.operateTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" fixed="right" align="center" width="100px">
                    <template slot-scope="scope" >
                        <el-tag v-if="scope.row.status === 0" type="warning" size="small">排队中</el-tag>
                        <el-tag v-if="scope.row.status === 1" size="small">进行中</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="info" size="small">已停止</el-tag>
                        <el-tag v-if="scope.row.status === 3" type="success" size="small">已完成</el-tag>
                        <el-tag v-if="scope.row.status === 4" type="danger" size="small">错误</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-button :disabled="!(scope.row.status === 0 || scope.row.status === 1)" type="text" size="mini" @click="stopTask(scope.row.taskId)">终止</el-button>
                        <el-button type="text" size="mini" @click="copyTask(scope.row)">复制</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination-box">
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
            </div> -->
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getTaskList, stopTask } from '@/request/product'

    export default {
        data() {
            return {
                title: '任务队列',
                tableList: [],
                loading: false,
                queryData: {
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                total: 0
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        watch: {
            dialogVisible: function(newValue, oldValue) {
                if (newValue) {
                    this.getTaskQueueList()
                }
            }
        },
        methods: {
            getTaskQueueList() {
                let params = {}
                this.loading = true
                getTaskList(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.tableList = res.taskInfo
                    }
                }).catch((err) => {
                    console.log(err)
                    this.loading = false
                })
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getTaskQueueList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getTaskQueueList()
            },
            handleDialogClose() {
                this.$emit('on-close')
            },
            stopTask(taskId) {
                this.$confirm('是否终止此任务', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.stopTaskRequset(taskId)
                }).catch(() => {
                })
            },
            copyTask(row) {
                this.$emit('on-copy', row)
                // this.$confirm('是否复制此任务', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     this.$emit('on-copy', row)
                // }).catch(() => {
                // })
            },
            stopTaskRequset(taskId) {
                let params = {
                    taskId: taskId
                }
                stopTask(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('任务终止成功！')
                        this.getTaskQueueList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
        }
    }
</script>

<style lang="scss">
    .task-queue-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }

    }
</style>

<style lang="scss" scoped>
    .task-queue-dialog {

    }
</style>

