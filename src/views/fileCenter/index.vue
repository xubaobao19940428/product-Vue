<template>
    <div class="app-container">
        <div class="tip">提示：文件中心的文件默认保存30天，上限100条，超出后旧记录会自动删除</div>
        <div class="filter-container">
            <el-button type="danger" @click="deleteRecords">批量删除</el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table
                :data="tableData"
                style="width: 100%"
                fit
                highlight-current-row
                @selection-change="handleSelectionChange"
            >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="导出编号" prop="exportId"></el-table-column>
                <el-table-column align="center" label="导出时间">
                    <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
                </el-table-column>
                <el-table-column align="center" label="相关模块" prop="type"></el-table-column>
                <el-table-column align="center" label="导出人" prop="operationName"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            style="color: #F56C6C;"
                            v-if="scope.row.status == 3"
                            type="text"
                            size="mini"
                            @click="deleteRecord(scope.row)"
                        >删除文件</el-button>
                        <el-button v-if="scope.row.status == 3" type="text" size="mini">
                            <a :href="dealShowFileSrc(scope.row.fileAddress)">下载文件</a>
                        </el-button>
                        <span
                            class="status-text"
                            v-if="scope.row.status == 2 || scope.row.status == 1"
                        >正在生成文件，完成后可下载</span>
                        <span
                            class="status-text"
                            v-if="scope.row.status == 4"
                        >{{scope.row.failReason}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="page"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                class="pagination"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import { ListExportRecordByPage, DeleteExportTask } from "@/request/fileCenter";
export default {
    name: "exportList",
    data() {
        return {
            //表格数据
            tableData: [],
            //分页相关
            total: 2,
            pageNum: 1,
            pageSize: 5,
            selectionList: [] //选中列表
        };
    },
    mounted() {
        this.queryTableData();
    },
    methods: {
        //查询列表数据
        queryTableData() {
            ListExportRecordByPage({
                page: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
            })
                .then(response => {
                    if (response.ret.errcode == 1) {
                        this.total = response.total;
                        this.tableData = response.exportRecordPb;
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        /**
         * 删除单条记录
         */
        deleteRecord(record) {
            this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deleteExportTask([record.exportId]);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        /**
         * 批量删除记录
         */
        deleteRecords() {
            //判断是否选择记录
            if (this.selectionList.length <= 0) {
                this.$message({
                    type: "info",
                    message: "请选择删除项"
                });
                return;
            }

            const ids = []; //删除的id集合
            for (let i = 0; i < this.selectionList.length; i++) {
                const item = this.selectionList[i];
                ids.push(item.exportId);
            }

            this.$confirm("此操作将删除选中的文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deleteExportTask(ids);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        /**
         * 调用删除接口
         * @param {Array} ids 删除对象的id集合
         */
        deleteExportTask(ids) {
            DeleteExportTask({ exportId: ids })
                .then(response => {
                    //成功
                    if (response.ret.errcode == 1) {
                        // let arr = [];

                        // for (let i = 0; i < this.tableData.length; i++) {
                        //     const item = this.tableData[i];
                        //     if (ids.indexOf(item.id) < 0) {
                        //         arr.push(item);
                        //         continue;
                        //     }
                        // }

                        // this.tableData = arr;
                        // this.total = arr.length;
                        this.queryTableData();

                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },
        //选中事件回调函数
        handleSelectionChange(selection) {
            this.selectionList = selection;
        },
        //表格页码变化回调
        handleCurrentChange(page) {
            this.pageNum = page;
            this.queryTableData();
        },
        //表格显示条数变化回调
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.queryTableData();
        }
    }
};
</script>
<style scoped lang="scss">
.tip {
    line-height: 36px;
    color: red;
    font-size: 14px;
}
.status-text {
    color: #909399;
}
</style>