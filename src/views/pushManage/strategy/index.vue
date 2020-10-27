<template>
    <div class="app-container">
        <div class="title">策略管理</div>
        <div class="filter-container">
            <el-form inline :model="queryData">
                <el-form-item label="策略名称：" class="filter-item">
                    <el-input
                        v-model="queryData.strategyName"
                        placeholder="请输入"
                        size="medium"
                        style="width: 200px"
                    ></el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button type="primary" @click="addStrategy" size="medium">
                        <i class="iconfont">&#xe721;</i> 新增策略
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table
                :data="tableData"
                v-loading="loading"
                border
                height="100%"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    :index="index => index + 1"
                    width="100"
                    align="center"
                    fixed="left"
                ></el-table-column>
                <el-table-column label="策略名称" width="200" align="center" prop="strategyName"></el-table-column>
                <el-table-column label="策略描述" align="center" prop="description"></el-table-column>
                <el-table-column label="编辑者" width="180" align="center" prop="operationName"></el-table-column>
                <el-table-column label="编辑时间" width="200" align="center">
                    <template slot-scope="scope">{{scope.row.updateTime | formatTime}}</template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="deleteStrategy(scope.row.strategyCode)"
                            class="deleteBtn"
                        >删除</el-button>
                        <el-button type="text" @click="editStrategy(scope.row)">编辑</el-button>
                        <el-button type="text" @click="routeTaskList(scope.row.strategyCode)">查看任务</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination"
            ></el-pagination>
        </div>
        <el-dialog
            :title="editForm.strategyCode ? '编辑策略' : '创建策略'"
            :visible.sync="dialogEditFormVisible"
        >
            <el-form :model="editForm">
                <el-form-item required label="策略名称：" label-width="100px">
                    <el-input
                        v-model="editForm.strategyName"
                        autocomplete="off"
                        placeholder="请输入"
                        style="width: 220px;"
                    ></el-input>
                </el-form-item>
                <el-form-item required label="策略描述：" label-width="100px">
                    <el-input
                        type="textarea"
                        v-model="editForm.description"
                        autocomplete="off"
                        placeholder="请输入"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="fetchEditStrategy">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    queryStrategyList,
    addStrategy,
    updateStrategy,
    deleteStrategy
} from "@/request/strategy";
export default {
    name: "strategy",
    data() {
        return {
            queryData: {
                strategyName: "",
                pageNum: 1,
                pageSize: 10
            }, //查询表格数据表单
            tableData: [], //表格数据
            editForm: {
                strategyName: "",
                description: ""
            }, //编辑弹窗form表单
            tableLoading: false, //表格loading
            total: 0, //表格总条数
            dialogEditFormVisible: false // 是否显示新增/编辑弹窗
        };
    },
    mounted() {
        this.queryTableData();
    },
    methods: {
        //查询表格数据
        queryTableData() {
            queryStrategyList({
                pageNum: this.queryData.pageNum,
                pageSize: this.queryData.pageSize,
                name: this.queryData.strategyName
            })
                .then(res => {
                    this.tableData = res.data.results;
                    this.total = res.data.totalCount;
                })
                .catch(err => {
                    //TODO 处理错误信息
                });
        },
        //删除策略
        deleteStrategy(strategyCode) {
            this.$confirm(
                "删除策略后，会一并删除策略下所有生效的任务，请慎重考虑",
                "确认删除这条策略？",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    deleteStrategy(strategyCode)
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.queryTableData();
                        })
                        .catch(err => {});
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //新增策略
        addStrategy() {
            this.editForm.name = "";
            this.editForm.description = "";
            this.editForm.strategyCode = null;
            this.dialogEditFormVisible = true;
        },
        //编辑策略
        editStrategy(row) {
            this.editForm = { ...row };
            this.dialogEditFormVisible = true;
        },
        //请求新增或编辑接口
        fetchEditStrategy() {
            if (!this.editForm.description) {
                this.$message.error("请输入策略名称");
                return;
            }
            if (!this.editForm.strategyName) {
                this.$message.error("请输入策略描述");
                return;
            }
            const resetEditForm = () => {
                this.editForm.strategyName = "";
                this.editForm.description = "";
                this.editForm.strategyCode = null;
                this.dialogEditFormVisible = false;
            };
            if (this.editForm.strategyCode) {
                //编辑接口
                updateStrategy({
                    strategyName: this.editForm.strategyName,
                    description: this.editForm.description,
                    strategyCode: this.editForm.strategyCode
                })
                    .then(res => {
                        resetEditForm();
                        this.resetSearch();
                        this.queryTableData();
                    })
                    .catch(err => {});
            } else {
                //新增接口
                addStrategy({
                    strategyName: this.editForm.strategyName,
                    description: this.editForm.description
                })
                    .then(res => {
                        resetEditForm();
                        this.resetSearch();
                        this.queryTableData();
                    })
                    .catch(err => {});
            }
        },
        //根据id跳转任务列表
        routeTaskList(strategyCode) {
            this.$router.push({
                name: "strategyTaskList",
                query: {
                    strategyCode
                }
            });
        },
        //搜索
        search() {
            this.queryTableData();
        },
        //重置
        resetSearch() {
            this.queryData.strategyName = "";
        },
        //翻页
        handleCurrentChange(page) {
            this.queryData.pageNum = page;
            this.queryTableData();
        },
        //修改单页显示数据条数
        handleSizeChange(pageSize) {
            this.queryData.pageSize = pageSize;
            this.queryTableData();
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    margin: 10px 0 20px 0;
    font-size: 20px;
    font-weight: 600;
}

.deleteBtn {
    color: red;
}
</style>