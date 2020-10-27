<template>
    <div class="supplier-voice">
        <div class="supplier-voice-top">
            <div class="supplier-voice-title">供应商发货单跟踪</div>
            <div class="supplier-voice-refresh" @click="supplierVoiceRefresh">刷新</div>
        </div>
        <div class="supplier-voice-select">
            <div class="supplier-voice-select-title">供应商：</div>
            <el-select v-model="supplierId" :remote-method="getSupplierList"
                filterable clearable remote reserve-keyword placeholder="请输入供应商" size="mini" @change="search()" class="ware-select">
                <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
            </el-select>
            <div class="supplier-voice-select-title">收货仓库：</div>
            <el-select v-model="warehouseNo" placeholder="选择收货仓库" size="mini" @change="wareHouseChange" class="ware-select">
            <el-option
                v-for="(item,index) in wareHouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseNo">
            </el-option>
        </el-select>
        </div>
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
                        <div @click="tableClick(scope)">{{scope.$index==0?item.unSign:scope.$index==1?item.unIncome:item.abnormal}}</div>
                    </template>
                </el-table-column>
            </div>
            <!-- <el-table-column label="今日" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][0].unSign:scope.$index==1?table[scope.$index][0].unIncome:table[scope.$index][0].abnormal}}</div>
                </template>
            </el-table-column>
            <el-table-column label="昨日" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][1].unSign:scope.$index==1?table[scope.$index][1].unIncome:table[scope.$index][1].abnormal}}</div>
                </template>
            </el-table-column>
            <el-table-column label="2-3天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][2].unSign:scope.$index==1?table[scope.$index][2].unIncome:table[scope.$index][2].abnormal}}</div>
                </template>
            </el-table-column>
            <el-table-column label="3-5天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][3].unSign:scope.$index==1?table[scope.$index][3].unIncome:table[scope.$index][3].abnormal}}</div>
                </template>
            </el-table-column>
            <el-table-column label="超过5天" width="180">
                <template slot-scope="scope">
                    <div @click="tableClick(scope)">{{scope.$index==0?table[scope.$index][4].unSign:scope.$index==1?table[scope.$index][4].unIncome:table[scope.$index][4].abnormal}}</div>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>
<script>
    import { supplierBasePage } from '@/request/supplier'
    import { warehousePage } from '@/request/warehouse'
    import { IncomeOrderStat } from '@/request/performanceMonitoring'

    export default {
        data () {
            return {
                supplierId: '',
                supplierName: '',
                supplierList: [],
                table: [],
                directMail: ['未签收', '未入库', '入库异常'],
                warehouseNo: '',
                wareHouseList: [],
                refresh: 2,
                pageData: {
                    pageSize: 10,
                    pageNum: 1
                },
                loading: false
            }
        },
        mounted () {
            // this.getSupplierList()
            this.getWarehouseList()
            this.getIncomeOrderStat()
        },
        methods: {
            search (val) {
                console.log(val)
                this.supplierName = val
                this.table.splice(0)
                this.getIncomeOrderStat()
            },
            // 获取供应商列表
            getSupplierList (query) {
                let params = {
                    supplierName: query
                }
                supplierBasePage(this.filterData(params)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.supplierList = res.list
                    }
                })
            },
            wareHouseChange (val) {
                console.log(val)
                this.warehouseNo = val
                this.table.splice(0)
                this.getIncomeOrderStat()
            },
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
            getIncomeOrderStat () {
                this.loading = true
                let params = {
                    supplierId: this.supplierId,
                    warehouseNo: this.warehouseNo,
                    refresh: this.refresh
                }
                IncomeOrderStat(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.loading = false
                        let scopeOne = []
                        let scopeTwo = []
                        let scopeThree = []
                        for (const i in res.stat) {
                            scopeOne.push(res.stat[i])
                            scopeTwo.push(res.stat[i])
                            scopeThree.push(res.stat[i])
                        }
                        this.table.push(scopeOne)
                        this.table.push(scopeTwo)
                        this.table.push(scopeThree)
                        console.log(this.table)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            supplierVoiceRefresh () {
                this.refresh = 1
                this.table.splice(0)
                this.getIncomeOrderStat()
            },
            tableClick (val) {
                let params={
                    signStatus: val.$index===0?'2':'1',
                    incomeStatus: val.$index===1?'2':'',
                    status: val.$index===2?[1,2]:[],
                    supplierId: this.supplierId,
                    warehouseNo:this.warehouseNo,
                    lastMonthDate: this.TimeRange(val.column.label, val.row, 'last'),
                    nowEndDate: this.TimeRange(val.column.label, val.row, 'now')
                }
                if (val.$index === 2) {
                    this.$router.push({name:'abnormalOrder', query: params})
                } else {
                    this.$router.push({name:'logisticsSheet', query: params})
                }
                // if (val.$index === 0) {
                //     if (this.warehouseNo === '' && this.supplierId === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus: '2', supplierId: '', warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else if (this.warehouseNo === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus: '2', supplierId: this.supplierId, warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId, warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId, warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId, warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId, warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId, warehouseNo:'', lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else if (this.supplierId === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus: '2', supplierId: '', warehouseNo: this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     }else {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     }
                // } else if (val.$index === 1) {
                //     if (this.warehouseNo === '' && this.supplierId === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus: '2', supplierId: '', warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '', warehouseNo:'', lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else if (this.warehouseNo === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:'', lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else if (this.supplierId === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus: '2', supplierId: '', warehouseNo: this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: '',warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'logisticsSheet', query: {signStatus:'1',incomeStatus:'2', supplierId: this.supplierId,warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     }
                // }else if (val.$index === 2) {
                //     if (this.warehouseNo === '' && this.supplierId === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo: '', status:[1,2],lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else if (this.warehouseNo === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:'', status:[1,2],lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else if (this.supplierId === '') {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'abnormalOrder', query: {supplierId: '', warehouseNo: this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'abnormalOrder', query: {supplierId: '',warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '',warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '',warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '',warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: '',warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     } else {
                //         switch (val.column.label) {
                //             case "今日" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                //             case "昨日" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                //             // case "1-2天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                //             case "2-3天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                //             case "3-5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                //             case "超过5天" : this.$router.push({name:'abnormalOrder', query: {supplierId: this.supplierId,warehouseNo:this.warehouseNo, status:[1,2],lastMonthDate: this.TimeRange('超过5天', val.row, 'last'), nowEndDate: this.TimeRange('超过5天', val.row, 'now')}});break;
                //         }
                //     }
                // }
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
    .supplier-voice{
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
    .supplier-voice{
        .supplier-voice-top{
            display: flex;
            justify-content:flex-start;
            margin-bottom: 10px;
        }
        .supplier-voice-title{
            font-size:16px;
            font-weight: 600;
            margin-right: 10px;
        }
        .supplier-voice-refresh{
            height:24px;
            line-height:24px;
            font-size: 12px;
            color: #409EFF;
            cursor: pointer;
        }
        .supplier-voice-select{
            margin:10px 0;
            display: flex;
            justify-content: flex-start;
            .ware-select{
                margin-right: 10px;
            }
        }
        .supplier-voice-select-title{
            height: 30px;
            line-height: 30px;
            font-size: 12px;
        }
        .table-cell-title{
            color: #303133;
            font-weight: 600;
        }
    }
</style>
