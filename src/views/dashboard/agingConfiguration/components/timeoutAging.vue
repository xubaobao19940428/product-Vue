<template>
    <div class="timeout-aging">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column label="系统" width="300">
                <template slot-scope="scope">
                    <div>{{scope.row.sysName}}</div>
                </template>
            </el-table-column>
            <el-table-column label="时效名称" width="300">
                <template slot-scope="scope">
                    <div>{{showTimeName(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="时效值" width="300">
                <template slot-scope="scope">
                    <div>{{showTime(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div @click="editTimeAging(scope.row)" class="modify-btn">修改</div>
                </template>
            </el-table-column>
        </el-table>
        <timeout-dialog v-if="dialogVisible" :dialogVisible="dialogVisible" :timeMessage="timeMessage" @on-cancel="cancelTimeout" @on-confirm="confirmTimeout"></timeout-dialog>
    </div>
</template>
<script>
    import { QueryTimeoutInfo, TimeoutUpdate } from '@/request/prescription'
    import timeoutDialog from './timeoutDialog'

    export default {
        data () {
            return {
                tableData: [],
                dialogVisible: false,
                timeMessage: {}
            }
        },
        components: {
            timeoutDialog
        },
        mounted () {
            this.getQueryTimeoutInfo()
        },
        methods: {
            getQueryTimeoutInfo () {
                let params = {}
                QueryTimeoutInfo(params).then(res =>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.timeoutInfo
                    }
                })
            },
            showTime (val) {
                if (val.timeType === "LOGI") {
                    return "物流时效"
                } else if (val.timeType === "CUSTOM") {
                    return val.minDay+'-'+val.maxDay+'天'
                }
            },
            editTimeAging (val) {
                this.timeMessage = Object.assign({},val)
                this.dialogVisible = true
            },
            showTimeName (val) {
                if (val.sysName === '订单' ) {
                    if (val.timeName === 'DELIVERY') {
                        return '超时发货'
                    }
                } else if (val.sysName === '采购' ) {
                    if (val.timeName === 'PURCHASE') {
                        return '超时采购'
                    } else if (val.timeName === 'DELIVERY') {
                        return '超时发货'
                    } else if (val.timeName === 'INCOME') {
                        return '超时入库'
                    }
                } else if (val.sysName === '仓库' ) {
                    if (val.timeName === 'OUT') {
                        return '超时出库'
                    }
                } 
            },
            cancelTimeout () {
                this.dialogVisible = false
            },
            confirmTimeout () {
                this.dialogVisible = false
                this.getQueryTimeoutInfo()
            }
        }
    }
</script>
<style lang="scss">
    .timeout-aging{
        .el-table td, .el-table th.is-leaf{
            text-align: center;
        }
        .el-table--enable-row-transition .el-table__body td{
            text-align: center;
        }
    }
</style>
<style lang="scss" scoped>
    .timeout-aging{
        .modify-btn{
            color: #409EFF;
            cursor: pointer;
        }
    }
</style>