<template>
    <div class="purchase-tracke">
        <div class="purchase-tracke-top">
            <div class="purchase-tracke-title">采购跟踪</div>
            <div class="purchase-tracke-refresh" @click="purchaseTrackeRefresh">刷新</div>
        </div>
        <el-select v-model="warehouseNo" placeholder="选择仓库" @change="wareHouseChange" size="mini" class="ware-select">
            <el-option
                v-for="(item,index) in wareHouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseNo">
            </el-option>
        </el-select>
        <el-table
            :data="systemTable"
            border
            style="width: 100%"
            v-loading="loading">
            <el-table-column label="系统采购单" width="130">
                <template slot-scope="scope">
                    <div class="table-cell-title">{{directMail[scope.$index]}}</div>
                </template>
            </el-table-column>
            <el-table-column label="今日" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][0][0].title)">{{scope.$index==0?systemTable[scope.$index][0][0].purchase:scope.$index==1?systemTable[scope.$index][0][1].purchase:systemTable[scope.$index][0][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][0][0].sku:scope.$index==1?systemTable[scope.$index][0][1].sku:systemTable[scope.$index][0][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][0][0].order:scope.$index==1?systemTable[scope.$index][0][1].order:systemTable[scope.$index][0][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="昨日" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][1][0].title)">{{scope.$index==0?systemTable[scope.$index][1][0].purchase:scope.$index==1?systemTable[scope.$index][1][1].purchase:systemTable[scope.$index][1][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][1][0].sku:scope.$index==1?systemTable[scope.$index][1][1].sku:systemTable[scope.$index][1][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][1][0].order:scope.$index==1?systemTable[scope.$index][1][1].order:systemTable[scope.$index][1][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="2-3天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][2][0].title)">{{scope.$index==0?systemTable[scope.$index][2][0].purchase:scope.$index==1?systemTable[scope.$index][2][1].purchase:systemTable[scope.$index][2][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][2][0].sku:scope.$index==1?systemTable[scope.$index][2][1].sku:systemTable[scope.$index][2][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][2][0].order:scope.$index==1?systemTable[scope.$index][2][1].order:systemTable[scope.$index][2][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="3-5天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][3][0].title)">{{scope.$index==0?systemTable[scope.$index][3][0].purchase:scope.$index==1?systemTable[scope.$index][3][1].purchase:systemTable[scope.$index][3][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][3][0].sku:scope.$index==1?systemTable[scope.$index][3][1].sku:systemTable[scope.$index][3][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][3][0].order:scope.$index==1?systemTable[scope.$index][3][1].order:systemTable[scope.$index][3][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="5-7天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][4][0].title)">{{scope.$index==0?systemTable[scope.$index][4][0].purchase:scope.$index==1?systemTable[scope.$index][4][1].purchase:systemTable[scope.$index][4][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][4][0].sku:scope.$index==1?systemTable[scope.$index][4][1].sku:systemTable[scope.$index][4][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][4][0].order:scope.$index==1?systemTable[scope.$index][4][1].order:systemTable[scope.$index][4][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="7-10天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][5][0].title)">{{scope.$index==0?systemTable[scope.$index][5][0].purchase:scope.$index==1?systemTable[scope.$index][5][1].purchase:systemTable[scope.$index][5][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][5][0].sku:scope.$index==1?systemTable[scope.$index][5][1].sku:systemTable[scope.$index][5][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][5][0].order:scope.$index==1?systemTable[scope.$index][5][1].order:systemTable[scope.$index][5][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="10-15天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][6][0].title)">{{scope.$index==0?systemTable[scope.$index][6][0].purchase:scope.$index==1?systemTable[scope.$index][6][1].purchase:systemTable[scope.$index][6][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][6][0].sku:scope.$index==1?systemTable[scope.$index][6][1].sku:systemTable[scope.$index][6][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][6][0].order:scope.$index==1?systemTable[scope.$index][6][1].order:systemTable[scope.$index][6][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="15天以上" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableClick(scope,systemTable[scope.$index][7][0].title)">{{scope.$index==0?systemTable[scope.$index][7][0].purchase:scope.$index==1?systemTable[scope.$index][7][1].purchase:systemTable[scope.$index][7][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][7][0].sku:scope.$index==1?systemTable[scope.$index][7][1].sku:systemTable[scope.$index][7][2].sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?systemTable[scope.$index][7][0].order:scope.$index==1?systemTable[scope.$index][7][1].order:systemTable[scope.$index][7][2].order}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-select v-model="warehouseNoTwo" placeholder="选择仓库" @change="wareChange" size="mini" class="ware-select-t">
            <el-option
                v-for="(item,index) in wareHouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseNo">
            </el-option>
        </el-select>
        <el-select v-model="deliveryWay" clearable placeholder="发货方式" size="mini" @change="deliveryWayChange" class="ware-select-t">
            <el-option v-for="item in deliveWayList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-table
            :data="artificialData"
            border
            style="width: 100%"
            v-loading="artificialLoading">
            <el-table-column label="人工单/补单" width="130">
                <template slot-scope="scope">
                    <div class="table-cell-title">{{directMail[scope.$index]}}</div>
                </template>
            </el-table-column>
            <el-table-column label="今日" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][0][0].title)">{{scope.$index==0?artificialData[scope.$index][0][0].purchase:scope.$index==1?artificialData[scope.$index][0][1].purchase:artificialData[scope.$index][0][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][0][0].sku:scope.$index==1?artificialData[scope.$index][0][1].sku:artificialData[scope.$index][0][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][0][0].order:scope.$index==1?artificialData[scope.$index][0][1].order:artificialData[scope.$index][0][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="昨日" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][1][0].title)">{{scope.$index==0?artificialData[scope.$index][1][0].purchase:scope.$index==1?artificialData[scope.$index][1][1].purchase:artificialData[scope.$index][1][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][1][0].sku:scope.$index==1?artificialData[scope.$index][1][1].sku:artificialData[scope.$index][1][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][1][0].order:scope.$index==1?artificialData[scope.$index][1][1].order:artificialData[scope.$index][1][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="2-3天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][2][0].title)">{{scope.$index==0?artificialData[scope.$index][2][0].purchase:scope.$index==1?artificialData[scope.$index][2][1].purchase:artificialData[scope.$index][2][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][2][0].sku:scope.$index==1?artificialData[scope.$index][2][1].sku:artificialData[scope.$index][2][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][1][0].order:scope.$index==1?artificialData[scope.$index][2][1].order:artificialData[scope.$index][2][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="3-5天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][3][0].title)">{{scope.$index==0?artificialData[scope.$index][3][0].purchase:scope.$index==1?artificialData[scope.$index][3][1].purchase:artificialData[scope.$index][3][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][3][0].sku:scope.$index==1?artificialData[scope.$index][3][1].sku:artificialData[scope.$index][3][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][3][0].order:scope.$index==1?artificialData[scope.$index][3][1].order:artificialData[scope.$index][3][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="5-7天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][4][0].title)">{{scope.$index==0?artificialData[scope.$index][4][0].purchase:scope.$index==1?artificialData[scope.$index][4][1].purchase:artificialData[scope.$index][4][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][4][0].sku:scope.$index==1?artificialData[scope.$index][4][1].sku:artificialData[scope.$index][4][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][4][0].order:scope.$index==1?artificialData[scope.$index][4][1].order:artificialData[scope.$index][4][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="7-10天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][5][0].title)">{{scope.$index==0?artificialData[scope.$index][5][0].purchase:scope.$index==1?artificialData[scope.$index][5][1].purchase:artificialData[scope.$index][5][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][5][0].sku:scope.$index==1?artificialData[scope.$index][5][1].sku:artificialData[scope.$index][5][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][5][0].order:scope.$index==1?artificialData[scope.$index][5][1].order:artificialData[scope.$index][5][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="10-15天" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][6][0].title)">{{scope.$index==0?artificialData[scope.$index][6][0].purchase:scope.$index==1?artificialData[scope.$index][6][1].purchase:artificialData[scope.$index][6][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][6][0].sku:scope.$index==1?artificialData[scope.$index][6][1].sku:artificialData[scope.$index][6][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][6][0].order:scope.$index==1?artificialData[scope.$index][6][1].order:artificialData[scope.$index][6][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column label="15天以上" width="130">
                <el-table-column label="采购单数" width="80">
                    <template slot-scope="scope">
                        <div @click="tableArtificialClick(scope,artificialData[scope.$index][7][0].title)">{{scope.$index==0?artificialData[scope.$index][7][0].purchase:scope.$index==1?artificialData[scope.$index][7][1].purchase:artificialData[scope.$index][7][2].purchase}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="SKU数" width="80">
                    <template slot-scope="scope">
                        <div class="table-cell-sku">{{scope.$index==0?artificialData[scope.$index][7][0].sku:scope.$index==1?artificialData[scope.$index][7][1].sku:artificialData[scope.$index][7][2].sku}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="涉及订单" width="100">
                    <template slot-scope="scope">
                        <div>{{scope.$index==0?artificialData[scope.$index][7][0].order:scope.$index==1?artificialData[scope.$index][7][1].order:artificialData[scope.$index][7][2].order}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { warehousePage } from '@/request/warehouse'
    import { SystemPurchaseOrderStat, ArtificialPurchaseOrderStat } from '@/request/performanceMonitoring'

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
                systemTable: [],
                artificialData: [],
                warehouseNoTwo: '',
                deliveryWay: '', // 发货方式
                directMail: ['未采购', '未发货', '未入库'],
                loading: false,
                artificialLoading: false,
                deliveWayList: [
                    {
                        value: '1',
                        label: '海运'
                    }, {
                        value: '2',
                        label: '空运'
                    }
                ],
            }
        },
        created () {
            this.getWarehouseList()
        },
        mounted () {
            this.getSystemPurchaseOrderStat()
            this.getArtificialPurchaseOrderStat()
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
                this.systemTable.splice(0)
                this.getSystemPurchaseOrderStat()
            },
            getSystemPurchaseOrderStat () {
                this.loading = true
                let params = {
                    warehouseNo: this.warehouseNo,
                    refresh: this.refresh
                }
                console.log(params)
                SystemPurchaseOrderStat(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.loading = false
                        let scopeOne = [[], [], [], [], [], [], [], []]
                        for (const i in res.stat) {
                            switch (res.stat[i].title){
                                case "今日" : scopeOne[0].push(res.stat[i]);break;
                                case "昨日" : scopeOne[1].push(res.stat[i]);break;
                                case "2-3天" : scopeOne[2].push(res.stat[i]);break;
                                case "3-5天" : scopeOne[3].push(res.stat[i]);break;
                                case "5-7天" : scopeOne[4].push(res.stat[i]);break;
                                case "7-10天" : scopeOne[5].push(res.stat[i]);break;
                                case "10-15天" : scopeOne[6].push(res.stat[i]);break;
                                case "15天以上" : scopeOne[7].push(res.stat[i]);break;
                            }
                        }
                        for (let i = 0; i < 3; i++) {
                            this.systemTable.push(scopeOne)
                        }
                        console.log(this.systemTable)
                    }
                })
            },
            wareChange (val) {
                console.log(val)
                this.warehouseNoTwo = val
                this.artificialData.splice(0)
                this.getArtificialPurchaseOrderStat()
            },
            deliveryWayChange (val) {
                this.deliveryWay = val
                this.artificialData.splice(0)
                this.getArtificialPurchaseOrderStat()
            },
            getArtificialPurchaseOrderStat () {
                this.artificialLoading = true
                let params = {
                    warehouseNo: this.warehouseNoTwo,
                    deliveWay: this.deliveryWay,
                    refresh: this.refresh
                }
                ArtificialPurchaseOrderStat(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.artificialLoading = false
                        let scopeOne = [[], [], [], [], [], [], [], []]
                        for (const i in res.stat) {
                            switch (res.stat[i].title){
                                case "今日" : scopeOne[0].push(res.stat[i]);break;
                                case "昨日" : scopeOne[1].push(res.stat[i]);break;
                                case "2-3天" : scopeOne[2].push(res.stat[i]);break;
                                case "3-5天" : scopeOne[3].push(res.stat[i]);break;
                                case "5-7天" : scopeOne[4].push(res.stat[i]);break;
                                case "7-10天" : scopeOne[5].push(res.stat[i]);break;
                                case "10-15天" : scopeOne[6].push(res.stat[i]);break;
                                case "15天以上" : scopeOne[7].push(res.stat[i]);break;
                            }
                        }
                        for (let i = 0; i < 3; i++) {
                            this.artificialData.push(scopeOne)
                        }
                        console.log(this.artificialData)
                    }
                })
            },
            purchaseTrackeRefresh () {
                this.refresh = 1
                this.systemTable.splice(0)
                this.artificialData.splice(0)
                this.getSystemPurchaseOrderStat()
                this.getArtificialPurchaseOrderStat()
            },
            tableClick (val, title) {
                console.log(val, title)
                console.log(this.warehouseNo)
                if (val.$index === 0) {
                    if (this.warehouseNo === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus: 'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    } else {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['SYSTEM'], warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }
                } else if (val.$index === 1) {
                    if (this.warehouseNo === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    } else {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }  
                } else if (val.$index === 2) {
                    if (this.warehouseNo === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    } else {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['SYSTEM'],warehouseNo:this.warehouseNo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }  
                }
            },
            tableArtificialClick (val, title) {
                console.log(this.warehouseNoTwo)
                if (val.$index === 0) {
                    if (this.warehouseNoTwo === '' && this.deliveryWay === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus: 'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }else if (this.deliveWay === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus: 'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }else if (this.warehouseNoTwo === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus: 'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo: '', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    } else {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'WAIT_PURCHASE', purchaseType: ['ARTIFICIAL','SUPPLEMENT'], deliveWay: this.deliveryWay,warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }
                } else if (val.$index === 1) {
                    if (this.warehouseNoTwo === '' && this.deliveryWay === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }else if (this.deliveWay === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }
                    else if (this.warehouseNoTwo === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    } else {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'PURCHASED', purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }  
                } else if (val.$index === 2) {
                    if (this.warehouseNoTwo === '' && this.deliveryWay === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }
                    else if (this.deliveWay === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: '',warehouseNo:this.warehouseNoTwo, lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }
                    else if (this.warehouseNoTwo === '') {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],deliveWay: this.deliveryWay,warehouseNo:'', lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    } else {
                        switch (title) {
                            case "今日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('今日', val.row, 'last'), nowEndDate: this.TimeRange('今日', val.row, 'now')}});break;
                            case "昨日" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('昨日', val.row, 'last'), nowEndDate: this.TimeRange('昨日', val.row, 'now')}});break;
                            case "1-2天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('1-2天', val.row, 'last'), nowEndDate: this.TimeRange('1-2天', val.row, 'now')}});break;
                            case "2-3天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('2-3天', val.row, 'last'), nowEndDate: this.TimeRange('2-3天', val.row, 'now')}});break;
                            case "3-5天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('3-5天', val.row, 'last'), nowEndDate: this.TimeRange('3-5天', val.row, 'now')}});break;
                            case "5-7天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('5-7天', val.row, 'last'), nowEndDate: this.TimeRange('5-7天', val.row, 'now')}});break;
                            case "7-10天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('7-10天', val.row, 'last'), nowEndDate: this.TimeRange('7-10天', val.row, 'now')}});break;
                            case "10-15天" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('10-15天', val.row, 'last'), nowEndDate: this.TimeRange('10-15天', val.row, 'now')}});break;
                            case "15天以上" : this.$router.push({name:'purchaseOrder', query: {purchaseOrderStatus:'SHIPPED',purchaseType: ['ARTIFICIAL','SUPPLEMENT'],warehouseNo:this.warehouseNoTwo, deliveWay: this.deliveryWay,lastMonthDate: this.TimeRange('15天以上', val.row, 'last'), nowEndDate: this.TimeRange('15天以上', val.row, 'now')}});break;
                        }
                    }  
                }
            },
            TimeRange (title, val, timeTitle) {
                for (const i of val) {
                    if (title === i[0].title) {
                        console.log(i)
                        console.log(title)
                        if (timeTitle === "last") {
                            return i[0].beginTime
                        } else if (timeTitle === "now") {
                            return i[0].endTime
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
    .purchase-tracke{
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
    .purchase-tracke{
        .purchase-tracke-top{
            display: flex;
            justify-content:flex-start;
            margin-bottom: 10px;
        }
        .purchase-tracke-title{
            font-size:16px;
            font-weight: 600;
            margin-right: 10px;
        }
        .purchase-tracke-refresh{
            height:24px;
            line-height:24px;
            font-size: 12px;
            color: #409EFF;
            cursor: pointer;
        }
        .ware-select{
            margin-bottom: 10px;
        }
        .ware-select-t{
            margin:10px 10px 10px 0;
        }
        .table-cell-title{
            color: #303133;
            font-weight: 600;
        }
        .table-cell-sku{
            color: #303133;
        }
    }
</style>