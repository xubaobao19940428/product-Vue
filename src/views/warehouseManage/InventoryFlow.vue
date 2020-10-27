<template>
    <div class="inventory-flow">
        <div class="filter-container">
            <el-form ref="inventoryFlowFilterForm" inline label-width="100px" :model="queryData">
                <el-form-item prop="skuCode" label="skuCode：" class="filter-item">
                    <el-input v-model="queryData.skuCode" clearable placeholder="请输入skuCode" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseNo" label="仓库：" class="filter-item">
                    <el-select v-model="queryData.warehouseNo" clearable size="medium" placeholder="请选择仓库" @change="search">
                        <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="qtyType" label="库存类型：" class="filter-item">
                    <el-select v-model="queryData.qtyType" clearable size="medium" placeholder="请选择库存类型" @change="search">
                        <el-option v-for="(item, key) in qtyTypeList" :key="key" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <span v-show="drop">
                      <el-form-item prop="recordType" label="变化类型：" class="filter-item">
                    <el-select v-model="queryData.recordType" clearable size="medium" placeholder="请选择变化类型" @change="search">
                        <el-option v-for="(item, key) in inventoryRecordTypeList" :key="key" :label="item.name" :value="item.type"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item prop="sourceType" label="来源单据：" class="filter-item">
                        <el-select v-model="queryData.sourceType" clearable size="medium" placeholder="请选择来源单据" @change="search">
                            <el-option v-for="(item, key) in qtySourceTypeList" :key="key" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="sourceNo" label="来源单号：" class="filter-item">
                        <el-input v-model="queryData.sourceNo" clearable placeholder="请输入来源单号" size="medium" @keyup.enter.native="search()"></el-input>
                    </el-form-item>
                         <el-form-item prop="timeList" label="时间范围：" class="filter-item">
                        <el-date-picker
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="queryData.timeList"
                            type="daterange"
                            size="medium"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" border v-loading="loading" height="100%" style="width: 100%">
                <el-table-column label="skuCode" fixed="left" align="center" min-width="130px" prop="skuCode">
                </el-table-column>
                <el-table-column label="商品名称" prop="nameCn" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="仓库名称" prop="warehouseName" align="center" min-width="100px"></el-table-column>
                <el-table-column label="库存类型" prop="type" align="center" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.qtyType === 1" >在库库存</span>
                        <span v-if="scope.row.qtyType === 2" >备货库存</span>
                        <span v-if="scope.row.qtyType === 3" >待出库库存</span>
                        <span v-if="scope.row.qtyType === 6" >可分配库存</span>
                        <span v-if="scope.row.qtyType === 7" >已占用库存</span>
                    </template>
                </el-table-column>
                <el-table-column label="库存变化类型" prop="recordType" align="center" width="120px">
                    <template slot-scope="scope">
                        {{getTypeName(scope.row.recordType)}}
<!--                        <span v-if="scope.row.type  === 1">确认采购</span>-->
<!--                        <span v-if="scope.row.type === 2">采购缺货</span>-->
<!--                        <span v-if="scope.row.type === 3">物流单入库</span>-->
<!--                        <span v-if="scope.row.type === 4">发货出库</span>-->
<!--                        <span v-if="scope.row.type === 5">创建订单</span>-->
<!--                        <span v-if="scope.row.type === 6">取消订单</span>-->
<!--                        <span v-if="scope.row.type === 7">后台更新</span>-->
                    </template>
                </el-table-column>
                <el-table-column label="来源单据" prop="sourceType" align="center" width="80px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sourceType === 1">入库单</span>
                        <span v-if="scope.row.sourceType === 2">出库单</span>
                        <span v-if="scope.row.sourceType === 3">订单</span>
                        <span v-if="scope.row.sourceType === 4">采购单</span>
                    </template>
                </el-table-column>
                <el-table-column label="来源单号" prop="sourceNo" align="center" width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.sourceNo || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作数量" prop="count" align="center" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.count > 0"> {{ '+'+scope.row.count || '-'}}</span>
                        <span v-else> {{ scope.row.count || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" align="center" width="160px">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="userName" align="center"  min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.userName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" align="center" width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.remark || '-'}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { warehousePage } from '@/request/warehouse'
    import { inventoryRecordPage, GetRecordType } from '@/request/inventory'
    export default {
        components: {
        },
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                queryData: {
                    warehouseNo: '',
                    skuCode: '',
                    qtyType: null,
                    recordType: null,
                    sourceType: null,
                    sourceNo: '',
                    timeList: [],
                    startTime: '',
                    endTime: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                loading: false,
                total: 0,
                warehouseList: [],
                qtyTypeList: [{
                    value: 1,
                    label: '在库库存'
                }, {
                    value: 2,
                    label: '备货库存'
                }, {
                    value: 3,
                    label: '待出库库存'
                }, {
                    value: 6,
                    label: '可分配库存'
                }, {
                    value: 7,
                    label: '已占用库存'
                }],
                inventoryRecordTypeList: [],
                qtySourceTypeList: [{
                    value: 1,
                    label: '入库单'
                }, {
                    value: 2,
                    label: '出库单'
                }, {
                    value: 3,
                    label: '订单'
                }, {
                    value: 4,
                    label: '采购单'
                }],
                dataList: []
            }
        },
        computed: {
            nowEndDate () {
                return this.$store.state.globalNum.nowEndDate
            },
            lastMonthDate () {
                return this.$store.state.globalNum.lastMonthDate
            }
        },
        created () {
            this.getGetRecordTypeList()
            this.queryData.timeList = [this.lastMonthDate, this.nowEndDate]
            this.getWarehouseList()
            if (this.$route.params.skuCode && this.$route.params.warehouseNo) {
                this.queryData.skuCode = this.$route.params.skuCode
                this.queryData.warehouseNo = this.$route.params.warehouseNo
            }
        },
        mounted () {
            this.getInventoryRecordPageList()
        },
        methods: {
            /**
             * 处理数组显示
             */
            getTypeName (item) {
                let data = this.inventoryRecordTypeList.find((val) => {
                    return val.type == item
                })
                return data ? data.name : item
            },
            /**
             * 获取变化类型列表
             */
            getGetRecordTypeList () {
                let params = {
                    page: {
                        pageSize: 100,
                        pageNum: 1
                    }
                }
                GetRecordType(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.inventoryRecordTypeList = res.type
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            /**
             * 获取仓库列表
            */
            getWarehouseList () {
                let params = {
                    page: {
                        pageSize: 100,
                        pageNum: 1
                    }
                }
                warehousePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.warehouseList = res.list
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            /**
             * 获取库存流水列表
            */
            getInventoryRecordPageList () {
                this.loading = true
                let params = this.queryData
                params.timeList = params.timeList || []
                params.startTime = params.timeList[0]
                params.endTime = params.timeList[1]
                inventoryRecordPage(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.list
                        this.total = res.total
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            // 分页
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getInventoryRecordPageList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getInventoryRecordPageList()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getInventoryRecordPageList()
            },
            resetSearch () {
                this.$refs.inventoryFlowFilterForm.resetFields()
                this.queryData.skuCode = ''
                this.queryData.warehouseNo = ''
                console.log(this.queryData)
                this.getInventoryRecordPageList()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .inventory-flow{
        height: 85%;
        .main-content-wrapper{
            height: 90%;
        }
    }
</style>
