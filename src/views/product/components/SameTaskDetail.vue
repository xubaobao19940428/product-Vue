<template>
    <div class="task-queue-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="true" width="800px"  append-to-body @close="handleDialogClose">
            <div slot="title">
                {{title}}
            </div>
            <el-table :data="tableList" v-loading="loading" border fit highlight-current-row height="500" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column label="原1688链接" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <el-link :href="scope.row.orgLink" target="_blank" type="primary">{{scope.row.orgLink}}</el-link>

                    </template>
                </el-table-column>
                <el-table-column label="同款1688链接" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.targetLink === '未找到满足条件的同款低价商品'">
                            未找到满足条件的同款低价商品
                        </span>
                        <el-link v-else :href="scope.row.targetLink" target="_blank" type="primary" :underline="false">{{scope.row.targetLink}}</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { sameKindResult} from '@/request/product'

    export default {
        data() {
            return {
                title: '任务详情',
                tableList: [],
                loading: false,
                queryData: {
                },
                total: 0
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            taskId: {
                type: String,
                default: ''
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
                    this.getSameKindResult()
                }
            }
        },
        methods: {
            getSameKindResult() {
                let params = {
                    taskId: this.taskId
                }
                sameKindResult(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let item = {}
                        let result = []
                        _.forEach(res.result, (value, key) => {
                            item.orgLink = `https://detail.1688.com/offer/${key}.html`
                            item.targetLink = value
                            result.push(item)
                        })
                        this.tableList = result
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            handleDialogClose() {
                this.$emit('on-close')
            }
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

