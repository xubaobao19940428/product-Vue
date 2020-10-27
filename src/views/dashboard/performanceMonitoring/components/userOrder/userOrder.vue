<template>
    <div class="user-order">
        <div class="user-order-top">
            <div class="user-order-title">用户订单跟踪</div>
            <div class="user-order-refresh" @click="userOrderRefresh">刷新</div>
        </div>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane
                :key="index"
                v-for="(item, index) in countryList"
                :label="item.nameCn"
                :name="item.shortCode"
            >
                <el-table
                    :data="shipTableData"
                    border
                    style="width: 100%"
                    v-loading="loading">
                    <el-table-column label="平台发货" width="180" fixed="left">
                        <template slot-scope="scope">
                            <div class="table-cell-title">{{shipArr[scope.$index]}}</div>
                        </template>
                    </el-table-column>
                    <div v-for="(item, index) in shipTableData[0]" :key="index">
                        <el-table-column :label="item.timeRange" width="180" >
                            <template slot-scope="scope">
                                <div @click="tableShipClick(scope)">{{scope.$index==0?item.num:shipTableData[1][index].num}}</div>
                            </template>
                        </el-table-column>
                    </div>
                </el-table>
                <el-table
                    :data="directMailTableData"
                    border
                    style="width: 100%;marginTop:20px;"
                    v-loading="loading">
                    <el-table-column label="商家直邮" width="180" fixed="left">
                        <template slot-scope="scope">
                            <div class="table-cell-title">{{directMail[scope.$index]}}</div>
                        </template>
                    </el-table-column>
                    <div v-for="(item, index) in directMailTableData[0]" :key="index">
                        <el-table-column :label="item.timeRange" width="180" >
                            <template slot-scope="scope">
                                <div @click="tableDirectClick(scope)">{{scope.$index==0?item.num:directMailTableData[1][index].num}}</div>
                            </template>
                        </el-table-column>
                    </div>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import { UserOrderTraceReport } from '@/request/performanceMonitoring'

    export default {
        data () {
            return {
                activeTab: 'ALL',
                countryList: [{
                    shortCode: "ALL",
                    nameCn: "全部"
                }],
                wareHouse: '',
                wareHouseList: [],
                commitmentArrival: '',
                commitmentArrivalList: [],
                shipArr: ["待发货","待收货"],
                directMail: ["待发货","待收货"],
                shipTableData: [],
                directMailTableData: [],
                supplier: '',
                supplierList: [],
                loading: true
            }
        },
        created () {
            for (const i in JSON.parse(this.getStore('countryList'))) {
                this.countryList.push(JSON.parse(this.getStore('countryList'))[i]) 
            }
        },
        mounted () {
            this.getUserOrderTraceReport()
        },
        methods: {
            handleClick (val) {
                this.loading = true
                this.activeTab = val.name
                this.shipTableData.splice(0)
                this.directMailTableData.splice(0)
                this.getUserOrderTraceReport()
            },
            userOrderRefresh () {
                this.loading = true
                this.shipTableData.splice(0)
                this.directMailTableData.splice(0)
                this.getUserOrderTraceReport()
            },
            getUserOrderTraceReport () {
                console.log(this.activeTab)
                let params = {
                   countryCode: this.activeTab === "ALL" ? '' : this.activeTab 
                }
                UserOrderTraceReport(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        let tableOne = res.allData[0].statOrder
                        let tableTwo = res.allData[1].statOrder
                        for (const iterator of tableOne) {
                            this.shipTableData.push(iterator.timeData)
                        }
                        for (const iterator of tableTwo) {
                            this.directMailTableData.push(iterator.timeData)
                        }
                        console.log(this.shipTableData)
                        console.log(this.directMailTableData)
                    }
                })
            },
            tableShipClick (val) {
                console.log(val)
                let params={
                    countryCode: this.activeTab === 'ALL' ? '' : this.activeTab,
                    deliveryWay: 1,
                    orderStatus: val.$index === 0 ? ['1'] : ['2'],
                    lastMonthDate: this.TimeRange(val.column.label, val.row, 'last'),
                    nowEndDate: this.TimeRange(val.column.label, val.row, 'now')
                }
                this.$router.push({name:'orderList', query: params}) 
            },
            tableDirectClick (val) {
                console.log(val)
                let params={
                    countryCode: this.activeTab === 'ALL' ? '' : this.activeTab,
                    deliveryWay: 2,
                    orderStatus: val.$index === 0 ? ['1'] : ['2'],
                    lastMonthDate: this.TimeRange(val.column.label, val.row, 'last'),
                    nowEndDate: this.TimeRange(val.column.label, val.row, 'now')
                }
                this.$router.push({name:'orderList', query: params}) 
            },
            TimeRange (title, val, timeTitle) {
                console.log(val)
                for (const i of val) {
                    if (title === i.timeRange) {
                        if (timeTitle === "last") {
                            return i.startOrderTime
                        } else if (timeTitle === "now") {
                            return i.endOrderTime
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
    .user-order{
        .el-table th>.cell{
            text-align: center;
        }
        .el-table--enable-row-transition .el-table__body td{
            color:#409EFF;
            text-align: center;
        }
        .el-table td, .el-table th{
            cursor: pointer;
        }
    }
</style>
<style lang="scss" scoped>
    .user-order{
        .user-order-top{
            display: flex;
            justify-content:flex-start;
            margin-bottom: 10px;
        }
        .user-order-title{
            font-size:16px;
            font-weight: 600;
            margin-right: 10px;
        }
        .user-order-refresh{
            height:24px;
            line-height:24px;
            font-size: 12px;
            color: #409EFF;
            cursor: pointer;
        }
        .table-cell-title{
            color: #303133;
            font-weight: 600;
        }
    }
</style>