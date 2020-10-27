<template>
    <div class="out-bound">
        <div class="out-bound-top">
            <div class="out-bound-title">出货单跟踪</div>
            <div class="out-bound-refresh" @click="outboundRefresh">刷新</div>
        </div>
        <el-select v-model="warehouseNo" placeholder="选择仓库" size="mini" @change="wareHouseChange" class="ware-select">
            <el-option
                v-for="(item,index) in wareHouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseNo">
            </el-option>
        </el-select>
        <el-table
            :data="table"
            border
            style="width: 100%"
            v-loading="loading">
            <el-table-column label="" width="180" fixed="left">
                <template slot-scope="scope">
                    <div class="table-cell-title">{{directMail[scope.$index]}}</div>
                </template>
            </el-table-column>
            <div v-for="(item, index) in table[0]" :key="index">
                <el-table-column :label="item.title" width="180" >
                    <template slot-scope="scope">
                        <!-- {{item}} -->
                        <div @click="tableClick(scope)">{{scope.$index==0?item.syncFail:item.unOut}}</div>
                    </template>
                </el-table-column>
            </div>
            <!-- <el-table-column label="今日" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][0].syncFail:table[scope.$index][0].unOut}}</div>
                </template>
            </el-table-column>
            <el-table-column label="昨日" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][1].syncFail:table[scope.$index][1].unOut}}</div>
                </template>
            </el-table-column>
            <el-table-column label="2-3天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][2].syncFail:table[scope.$index][2].unOut}}</div>
                </template>
            </el-table-column>
            <el-table-column label="3-6天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][3].syncFail:table[scope.$index][3].unOut}}</div>
                </template>
            </el-table-column>
            <el-table-column label="6-10天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][4].syncFail:table[scope.$index][4].unOut}}</div>
                </template>
            </el-table-column>
            <el-table-column label="超过10天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][5].syncFail:table[scope.$index][5].unOut}}</div>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>
<script>
    import { OutOrderStat } from '@/request/performanceMonitoring'
    import { warehousePage } from '@/request/warehouse'

    export default {
        data () {
            return {
                warehouseNo: '',
                wareHouseList: [],
                refresh: 2,
                pageData: {
                    pageSize: 10,
                    pageNum: 1
                },
                directMail: ['同步失败', '未出库'],
                table: [],
                loading: false
            }
        },
        created () {
            this.getWarehouseList()
            console.log(this.formatTime)
        },
        mounted () {
            this.getOutOrderStat()  
        },
        methods: {
            getWarehouseList () {
                let params = {
                    page: this.pageData
                }
                warehousePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.wareHouseList = res.list
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            wareHouseChange (val) {
                console.log(val)
                this.warehouseNo = val
                this.table.splice(0)
                this.getOutOrderStat()
            },
            getOutOrderStat () {
                this.loading = true
                let params = {
                    warehouseNo: this.warehouseNo,
                    refresh: this.refresh
                }
                OutOrderStat(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        let scopeOne = []
                        let scopeTwo = []
                        for (const i in res.stat) {
                            scopeOne.push(res.stat[i])
                            scopeTwo.push(res.stat[i])
                        }
                        this.table.push(scopeOne)
                        this.table.push(scopeTwo)
                        console.log(this.table)
                    }
                })
            },
            outboundRefresh () {
                this.refresh = 1
                this.table.splice(0)
                this.getOutOrderStat()
            },
            tableClick (val) {
                console.log(val)
                let params={
                    syncStatus: val.$index===0?'3':'',
                    outStatus: val.$index===1?'2':'',
                    warehouseNo:this.warehouseNo,
                    lastMonthDate: this.TimeRange(val.column.label, val.row, 'last'),
                    nowEndDate: this.TimeRange(val.column.label, val.row, 'now')
                }
                this.$router.push({name:'sockOutOrder', query: params}) 
                if (val.$index === 0) {
                    // if (this.warehouseNo === '') {
                    //     switch (val.column.label) {
                    //         case "今日" : this.$router.push({name:'sockOutOrder', query: {syncStatus: '3', warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                    //         case "昨日" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                    //         case "2-3天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                    //         case "3-6天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:'', lastMonthDate: this.TimeRange('3-6天', val.row, 'last'), nowEndDate: this.TimeRange('3-6天', val.row, 'now')}});break;
                    //         case "6-10天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:'', lastMonthDate: this.TimeRange('6-10天', val.row, 'last'), nowEndDate: this.TimeRange('6-10天', val.row, 'now')}});break;
                    //         case "超过10天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:'', lastMonthDate: this.TimeRange('超过10天', val.row, 'last'), nowEndDate: this.TimeRange('超过10天', val.row, 'now')}});break;
                    //     }
                    // }else {
                    //     switch (val.column.label) {
                    //         case "今日" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                    //         case "昨日" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                    //         case "2-3天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                    //         case "3-6天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-6天', val.row, 'last'), nowEndDate: this.TimeRange('3-6天', val.row, 'now')}});break;
                    //         case "6-10天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('6-10天', val.row, 'last'), nowEndDate: this.TimeRange('6-10天', val.row, 'now')}});break;
                    //         case "超过10天" : this.$router.push({name:'sockOutOrder', query: {syncStatus:'3',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('超过10天', val.row, 'last'), nowEndDate: this.TimeRange('超过10天', val.row, 'now')}});break;
                    //     }
                    // }
                } else if (val.$index === 1) {
                    // if (this.warehouseNo === '') {
                    //     switch (val.column.label) {
                    //         case "今日" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                    //         case "昨日" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                    //         case "2-3天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                    //         case "3-6天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:'', lastMonthDate: this.TimeRange('3-6天', val.row, 'last'), nowEndDate: this.TimeRange('3-6天', val.row, 'now')}});break;
                    //         case "6-10天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:'', lastMonthDate: this.TimeRange('6-10天', val.row, 'last'), nowEndDate: this.TimeRange('6-10天', val.row, 'now')}});break;
                    //         case "超过10天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:'', lastMonthDate: this.TimeRange('超过10天', val.row, 'last'), nowEndDate: this.TimeRange('超过10天', val.row, 'now')}});break;
                    //     }
                    // }else {
                    //     switch (val.column.label) {
                    //         case "今日" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                    //         case "昨日" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                    //         case "2-3天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                    //         case "3-6天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-6天', val.row, 'last'), nowEndDate: this.TimeRange('3-6天', val.row, 'now')}});break;
                    //         case "6-10天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('6-10天', val.row, 'last'), nowEndDate: this.TimeRange('6-10天', val.row, 'now')}});break;
                    //         case "超过10天" : this.$router.push({name:'sockOutOrder', query: {outStatus:'2',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('超过10天', val.row, 'last'), nowEndDate: this.TimeRange('超过10天', val.row, 'now')}});break;
                    //     }
                    // }
                    
                }
            },
            TimeRange (title, val, timeTitle) {
                for (const i of val) {
                    if (title === i.title) {
                        if (timeTitle === "last") {
                            return i.beginTime
                        } else if (timeTitle === "now") {
                            return i.endTime
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
    .out-bound{
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
    .out-bound{
        .out-bound-top{
            display: flex;
            justify-content:flex-start;
            margin-bottom: 10px;
        }
        .out-bound-title{
            font-size:16px;
            font-weight: 600;
            margin-right: 10px;
        }
        .out-bound-refresh{
            height:24px;
            line-height:24px;
            font-size: 12px;
            color: #409EFF;
            cursor: pointer;
        }
        .ware-select{
            margin:10px 0;
        }
        .table-cell-title{
            color: #303133;
            font-weight: 600;
        }
    }
</style>