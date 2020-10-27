<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form inline ref="orderFilterForm" label-width="90px" :model="queryData">
                <el-form-item label="订单编号：" class="filter-item" prop="orderId">
                    <el-input placeholder="订单编号" 
                        style="width: 240px"
                        size="medium" v-model="queryData.orderId" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <!-- <el-form-item label="返佣状态：" class="filter-item" prop="returnType">
                    <el-select size="medium" v-model="queryData.returnType" placeholder="请选择">
                        <el-option v-for="item in commissionStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="订单状态：" class="filter-item" prop="orderType">
                    <el-select size="medium" v-model="queryData.status" placeholder="请选择">
                        <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="reset" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-list">
            <el-table border :data="dataList" max-height="600" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" v-loading="loading">
                <el-table-column prop="orderId" label="订单编号" align="center" min-width="100px"></el-table-column>
                <el-table-column label="下单时间" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.orderTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderAmount" label="下单金额" align="center" min-width="150px"></el-table-column>
                <el-table-column prop="address" label="收货地址" align="center" min-width="180px"></el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{ orderStatusEnum[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="120px" v-if="hasPermission('BTN_USER_MEG_OPERATION_SEE_DETAIL')">
                    <template slot-scope="scope">
                        <el-button plain type="primary" size="mini" @click="handleOperation(scope.row.orderId)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :current-page="queryData.page.pageNum"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="queryData.page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totals">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { memberOrderList, memberOrderDetail} from '@/request/order'
    export default {
        name: 'orderList',
        data() {
            return {
                loading: false,
                dataList: [],
                totals: 0,
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    userId: '',
                    orderId: '',
                    status: null
                },
                commissionStatusList: [
                    {
                        value: 0,
                        label: '已返佣'
                    },
                    {
                        value: 1,
                        label: '未返佣'
                    }
                ],
                orderStatusEnum: {
                    0: '待支付',
                    1: '待发货',
                    2: '待收货',
                    3: '交易成功',
                    4: '交易关闭',
                    5: '部分发货'
                },
                statusList: [
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未付款'
                    },
                    {
                        value: 1,
                        label: '未发货'
                    },
                    {
                        value: 2,
                        label: '已发货'
                    },
                    {
                        value: 3,
                        label: '订单完成'
                    }
                ]
            }
        },
        computed: {
        },
        created() {
            if (this.$route.query.userId) {
                this.queryData.userId = this.$route.query.userId
            }
        },
        methods: {
            search() {
                this.queryData.page.pageNum = 1
                this.getUserOrderList()
            },
            reset() {
                this.queryData.status = null
                this.queryData.orderId = ''
                // this.$refs.orderFilterForm.resetFields()
            },
            handleCurrentChange(value) {
                this.queryData.page.pageNum = value
                this.getUserOrderList()
            },
            handleOperation (orderId) {
                this.$router.push({
                    name: 'orderDetail',
                    query: {
                        orderNo: orderId
                    }
                })
            },
            handleSizeChange(value) {
                this.queryData.page.pageSize = value
                this.queryData.page.pageNum = 1
                this.getUserOrderList()
            },
            getUserOrderList() {
                this.loading = true
                let temp = { ...this.queryData }
                temp.status = temp.status === null ? [] : [temp.status]
                memberOrderList(this.filterData(temp)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.orderItem
                        this.totals = res.total
                    }
                    this.loading = false
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pagination {
        margin: 20px;
        float: right;
    }
</style>
