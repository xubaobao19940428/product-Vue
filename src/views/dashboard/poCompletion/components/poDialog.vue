<template>
    <el-dialog
        title="详情"
        :visible.sync="toggle"
        width="50%"
        :before-close="handleClose">
        <div class="export-btn">
            <el-button type="primary" @click="exportTable">导 出</el-button>
        </div>
        <el-table border :data="dataList">
            <el-table-column label="采购单" min-width="100px" align="center">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="{ name:'purchaseOrder',query:{ purchaseOrderNo: scope.row.purchaseOrderId }}">
                        <div class="order-id" @click="purchaseClick">{{ scope.row.purchaseOrderId }}</div>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="采购信息" min-width="100px" align="center">
                <template slot-scope="scope">
                    <div>采购数量：{{ scope.row.purchaseNum }}</div>
                    <div>发货数量：{{ scope.row.shipNum }}</div>
                    <div>入库数量：{{ scope.row.incomeNum }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.pageNum"
                        :page-sizes="[5, 10, 20, 50]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totals">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
        </span>
    </el-dialog>
</template>
<script>
import { PoCompletionRate, PoIncompleteOrderDetail } from "@/request/dataBoard";
import { RouteAndExport } from "@/request/fileCenter";

export default {
    props: {
        dialogVisible: Boolean,
        data: Array,
        queryData: Object,
        state: String,
        time: String
    },
    data () {
        return {
            page: {
                pageNum: 1,
                pageSize: 10
            },
            totals: 0,
            dataList: []
        }
    },
    computed: {
        toggle: {
            get: function () {
                return this.dialogVisible;
            },
            set: function () {
            }
        },
    },
    mounted () {
        this.getPoIncompleteOrderDetail()
    },
    methods: {
        getPoIncompleteOrderDetail () {
            let params = {
                startTime: moment(this.time).valueOf().toString(),
                endTime: moment(this.time).add(1, 'days').valueOf().toString(),
                warehouseName: this.queryData.warehouseName,
                cateOneId: this.queryData.cateId,
                state: this.state,
                page: this.page
            }
            PoIncompleteOrderDetail(this.filterData(params)).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.list
                    this.totals = res.totalNum
                }
            })
        },
        handleSizeChange (val) {
            this.page.pageSize = val
            this.getPoIncompleteOrderDetail()
        },
        handleCurrentChange (val) {
            this.page.pageNum = val
            this.getPoIncompleteOrderDetail()
        },
        exportTable () {
            let params = {
                startTime: moment(this.time).valueOf().toString(),
                endTime: moment(this.time).add(1, 'days').valueOf().toString(),
                warehouseName: this.queryData.warehouseName,
                cateOneId: this.queryData.cateId,
                state: this.state
            }
            RouteAndExport({
                type: 9,
                param: JSON.stringify(params)
            })
            .then(response => {
                if (response.ret.errcode == 1) {
                    switch (response.code) {
                        case 1:
                        case 2:
                        case 3:
                            this.$notify({
                                title: "生成导出任务成功",
                                message:
                                    "导出的数据文件正在生成中，请至文件中心查看进度并下载",
                                type: "success",
                                onClose: () => {
                                    this.$router.push(
                                        "/fileCenter/exportList"
                                    );
                                },
                                duration: 1500
                            });
                            break;
                        case 4:
                            this.$notify({
                                title: "生成导出任务失败",
                                message: "任务生成失败，请稍后再试",
                                type: "info"
                            });
                            break;
                        case 5:
                            this.$notify({
                                title: "导出限制",
                                message:
                                    "相同参数的导出任务，同个用户15分钟内只允许导出一次",
                                type: "info"
                            });
                            break;

                        case 6:
                            this.$notify({
                                title: "请勿反复提及导出任务",
                                message: "请勿重复提交，30秒后再尝试",
                                type: "info"
                            });
                        default:
                            break;
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
        },
        handleClose () {
            this.$emit('on-cancle')
        },
        purchaseClick () {

        }
    }
}
</script>
<style lang="scss" scoped>
.export-btn{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
}
.order-id{
    color: #4f91d8;
    cursor: pointer;
}
</style>