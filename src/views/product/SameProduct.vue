<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="sameProductForm" inline label-width="90px" :model="queryData" style="width: 800px; margin: 0 auto;">
                <el-form-item label="目标商品：" class="filter-item" prop="">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" style="width: 400px;" placeholder="请输入内容" v-model="queryData.targets">
                    </el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button type="primary" @click="submit" size="medium">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="tableList" v-loading="loading" border fit highlight-current-row height="100%" style="width: 800px; margin: 0 auto;">
                <el-table-column label="任务ID" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{scope.row.taskId}}
                    </template>
                </el-table-column>
                <el-table-column label="进度" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <span>{{scope.row.progress}} %</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0">排队中</span>
                        <span v-if="scope.row.status === 1">进行中</span>
                        <span v-if="scope.row.status === 2">已完成</span>
                        <span v-if="scope.row.status === 3">错误</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDetail(scope.row)">
                            查看结果
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <same-task-detail :dialogVisible="dialogVisible" :taskId="taskId" @on-close="handleClose"></same-task-detail>
    </div>
</template>

<script>
    import { createSameKindTask, sameKindTaskList} from '@/request/product'
    import SameTaskDetail from './components/SameTaskDetail'
    export default {
        name: 'SameProduct',
        data () {
            return {
                tableList: [],
                queryData: {
                    page: {
                        pageSize: 20,
                        pageNum: 1
                    }
                },
                total: 0,
                loading: false,
                dialogVisible: false,
                taskId: ''
            }
        },
        components: {
            SameTaskDetail
        },
        computed: {
        },
        watch: {
        },
        created () {
        },
        mounted () {
            this.getSameKindTaskList()
        },
        methods: {
            submit() {
                if (this.queryData.targets === '') {
                    return
                }
                let params = {
                    productId: this.queryData.targets.split(',')
                }
                createSameKindTask(this.filterData(params)).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        this.getSameKindTaskList()
                    }
                }).catch((err) => {
                    console.log(err)
                })
                this.queryData.targets = ''
            },
            getSameKindTaskList() {
                let params = {}
                sameKindTaskList(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.tableList = res.task
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            showDetail(row) {
                this.taskId = row.taskId
                this.dialogVisible = true
            },
            handleClose() {
                this.dialogVisible = false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
