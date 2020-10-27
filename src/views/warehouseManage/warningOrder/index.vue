<template>
    <div class="app-container">
        <el-form inline>
            <el-form-item label="风险时间："
                            class="filter-item">
                <el-select v-model="searchParam.unIncomeDay"
                        size="medium">
                <el-option v-for="(item, index) in timeList"
                            :key="index"
                            :label="item"
                            :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单号：">
                <el-input v-model="searchParam.orderNo"
                    placeholder="请输入订单号"
                    style="min-width: 240px"
                    clearable
                    size="medium"></el-input>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search"
                        type="primary"
                        @click="getList(1)"
                        size="medium">搜索
                </el-button>
                <el-button icon="el-icon-refresh-left"
                        @click="resetSearch"
                        size="medium">重置
                </el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table :data="dataList" border
                v-loading="load"
                height="100%"
                style="width: 100%"
                :span-method="arraySpanMethod"
            >
                <el-table-column label="订单号"
                       fixed="left"
                       align="center"
                       width="200px">
                    <template slot-scope="scope">
                        <div class="pointer blue"
                            @click="handleShowDetail(scope.row)">{{ scope.row.orderNo }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="采购订单号"
                                align="center">
                    <template slot-scope="scope">
                        <div :class="scope.row.warning == 1 ? 'warning-status' : ''">{{ scope.row.purchaseOrderNo }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商品编码"
                                align="center">
                    <template slot-scope="scope">
                        <div :class="scope.row.warning == 1 ? 'warning-status' : ''">{{ scope.row.skuCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="数量"
                                align="center"
                                width="100">
                    <template slot-scope="scope">
                        <div :class="scope.row.warning == 1 ? 'warning-status' : ''">{{ scope.row.num }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间"
                                align="center"
                                width="180">
                    <template slot-scope="scope">
                        <div :class="scope.row.warning == 1 ? 'warning-status' : ''">{{ scope.row.createTime | formatTime }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>
        <purchase-track
            v-if="trackInfo.show"
            :propShowDialog="trackInfo.show"
            :trackInfo="trackInfo"
            @close="handleCloseDetail"
        ></purchase-track>
    </div>
</template>
<script>
    // import { getRiskPo } from '@/request/purchase.js'
    import { GetRiskPo } from '@/request/erp.js'
    import purchaseTrack from '../../order/components/purchaseTrack.vue'
    export default {
        components: {
            purchaseTrack
        },
        data () {
            return {
                dataList: [],
                load: false,
                searchParam: {
                    unIncomeDay: 5,
                    orderNo: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                totals: 0,
                trackInfo: {
                    show: false,
                    orderNo: ''
                },
                timeList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
        },
        created () {
            this.getList()
        },
        methods: {
            resetSearch () {
                this.searchParam = {
                    unIncomeDay: 5,
                    orderNo: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
            },
            getList (page) {
                this.load = true
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                GetRiskPo(this.filterData(this.searchParam)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let data = res.riskOrderInfos || []
                        let resData = []
                        data.forEach(item => {
                            let temp = item.riskPoInfos.map((subItem, index) => {
                                if (index === 0) {
                                    subItem.rowspan = item.riskPoInfos.length
                                }
                                subItem.orderNo = item.orderNo

                                return subItem
                            })
                            resData = resData.concat(temp)
                        })

                        this.dataList = resData
                        this.totals = res.total
                    }
                    this.load = false
                }).catch(err => {
                    console.error(err)
                    this.load = false
                })
            },
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            handleShowDetail ({ orderNo }) {
                Object.assign(this.trackInfo, {
                    show: true,
                    orderNo: orderNo
                })
            },
            handleCloseDetail () {
                Object.assign(this.trackInfo, {
                    show: false,
                    orderNo: ''
                })
            },
            // 合并单元格
            arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
                let activeColumn = [0] // 暂时只合并第一列数据
                let item = activeColumn.find((val) => {
                    return val == columnIndex
                })
                if (item || columnIndex == 0) {
                    if (row.rowspan) {
                        return {
                            rowspan: row.rowspan,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.warning-status{
  color: #f56c6c;
}
.el-step__description.is-success{
  font-size: 14px;
}
</style>
