<template>
    <div class="recharge-manage">
        <el-form ref="recharge" inline label-width="80px" :model="queryData">
            <el-form-item prop="id" label="订单号：" class="filter-item">
                <el-input v-model="queryData.orderId" clearable placeholder="请输入" size="medium" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="id" label="用户Id：" class="filter-item">
                <el-input v-model="queryData.userId" clearable placeholder="请输入" size="medium" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="refundId" label="状态：" class="filter-item">
                <el-select v-model="queryData.status" placeholder="请选择">
                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.val" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="订单号" width="180" align="center" fixed="left">
                <template slot-scope="scope">
                    {{scope.row.orderNo}}
                </template>
            </el-table-column>
            <el-table-column label="reload_id" width="100" align="center">
                <template slot-scope="scope">
                    {{scope.row.reloadId}}
                </template>
            </el-table-column>
            <el-table-column label="用户ID" width="100" align="center">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column label="充值账号" width="150" align="center">
                <template slot-scope="scope">
                    {{scope.row.account}}
                </template>
            </el-table-column>
            <el-table-column label="运营商" width="100" align="center">
                <template slot-scope="scope">
                    {{scope.row.prodName}}
                </template>
            </el-table-column>
            <el-table-column label="充值金额（RM）" width="150" align="center">
                <template slot-scope="scope">
                    {{scope.row.faceValue}}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="150" align="center">
                <template slot-scope="scope">
                    <div :class="{'success': scope.row.status === 2,'err': scope.row.status === 3,'pend': scope.row.status === 1}">{{objStatus[scope.row.status]}}</div>
                </template>
            </el-table-column>
            <el-table-column label="充值时间" width="160" align="center">
                <template slot-scope="scope">
                    {{scope.row.sendTime | formatTime}}
                </template>
            </el-table-column>
            <el-table-column label="信息" width="200" align="center">
                <template slot-scope="scope">
                    {{scope.row.msg}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="retryClick(scope.row)">重试</el-button>
                    <el-button type="text" @click="refundClick(scope.row)">退款</el-button>
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
                :total="queryData.total">
            </el-pagination>
        </div>
        <retry-dialog v-if="retryDialog" :dialogVisible="retryDialog" :reCharge="reCharge" @on-cancle="cancleRetry" @on-confirm="confirmRetry"></retry-dialog>
        <confirm-operate v-if="confirmOperateDialog" :dialogVisible="confirmOperateDialog" :reCharge="reCharge"  @on-cancle="cancleOperate" @on-confirm="confirmOperate"></confirm-operate>
    </div>
</template>
<script>
    import confirmOperate from './components/confirmOperate'
    import retryDialog from './components/retryDialog'
    import { GetChargeRecordList, RefundForCharge } from '@/request/polypay'

    export default {
        data () {
            return {
                queryData: {
                    orderId: '',
                    userId: '',
                    status: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    },
                    total: 0
                },
                tableData: [],
                retryDialog: false,
                confirmOperateDialog: false,
                statusList: [{
                    val: '0',
                    label: '未发送'
                },{
                    val: '1',
                    label: '已发送'
                },{
                    val: '2',
                    label: '充值成功'
                },{
                    val: '3',
                    label: '充值失败'
                },{
                    val: '4',
                    label: '充值退款成功'
                }],
                objStatus: {
                    0: '待发送',
                    1: '已发送待同步结果',
                    2: '充值成功',
                    3: '充值失败',
                    4: '已退款'
                },
                reCharge: {
                    account: '',
                    id: '',
                    orderNo: '',
                    faceValue: '',
                    prodName: ''
                }
            }
        },
        components: {
            confirmOperate,
            retryDialog
        },
        mounted () {
            this.getChargeRecordList()
        },
        methods: {
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getChargeRecordList()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getChargeRecordList()
            },
            getChargeRecordList () {
                let params = {
                    startTime: '',
                    endTime: '',
                    userId: this.queryData.userId,
                    orderId: this.queryData.orderId,
                    status: this.queryData.status,
                    page: this.queryData.page
                }
                GetChargeRecordList (params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.tableData = res.chargeInfo
                        this.queryData.total = res.total
                    }
                })
            },
            search () {
                this.getChargeRecordList()
            },
            resetSearch () {
                this.queryData.userId = ''
                this.queryData.orderId = ''
                this.queryData.status = ''
                Object.assign(this.queryData.page,{
                    pageNum: 1,
                    pageSize: 10
                }) 
                this.getChargeRecordList()
            },
            retryClick (val) {
                Object.assign(this.reCharge,{
                    id: val.id,
                    orderNo: val.orderNo,
                    faceValue: val.faceValue,
                    prodName: val.prodName,
                    account: val.account
                })
                this.retryDialog = true
            },
            refundClick (val) {
                this.$confirm('确定要将其标记为已退款吗?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    RefundForCharge({id: val.id, orderNo: val.orderNo}).then(res=>{
                        if (res.ret.errcode === 1) {
                            this.$message.success('退款成功！')
                            this.getChargeRecordList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '退款失败'
                    })
                })
            },
            cancleRetry () {
                this.retryDialog = false
            },
            confirmRetry (val) {
                console.log(val)
                Object.assign(this.reCharge,{
                    account: val
                })
                this.retryDialog = false
                this.confirmOperateDialog = true
            },
            cancleOperate () {
                this.confirmOperateDialog = false
            },
            confirmOperate () {
                this.confirmOperateDialog = false
                this.getChargeRecordList()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .recharge-manage{
        .success{
            color: rgb(118,166,50);
        }
        .err{
            color: rgb(192,55,54);
        }
        pend{
            color: rgb(240,193,137);
        }
    }
</style>