<template>
    <div class="stock-flow">
        <div class="filter-container">
            <el-form ref="stockFlowFilterForm" inline label-width="100px" :model="queryData">
                <el-form-item prop="skuCode" label="skuCode：" class="filter-item">
                    <el-input v-model="queryData.skuCode" clearable placeholder="请输入skuCode" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <el-form-item prop="supplierId" label="供应商：" class="filter-item">
                    <el-select v-model="queryData.supplierId" :remote-method="getSupplierList" filterable clearable remote reserve-keyword placeholder="请输入供应商" size="medium" @change="search">
                        <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="qtyType" label="库存类型：" class="filter-item">
                    <el-select v-model="queryData.qtyType" clearable size="medium" placeholder="请选择库存类型" @change="search">
                        <el-option v-for="(item, key) in qtyTypeList" :key="key" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item prop="optSource" label="操作来源：" class="filter-item">
                        <el-select v-model="queryData.optSource" clearable size="medium" placeholder="请选择变化类型" @change="search">
                            <el-option v-for="(item, key) in optSourceTypeList" :key="key" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="orderType" label="来源单据：" class="filter-item">
                        <el-select v-model="queryData.orderType" clearable size="medium" placeholder="请选择来源单据" @change="search">
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
                    <template slot-scope="scope">
                        <div>{{ scope.row.skuCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="nameCn" align="center" min-width="180px">
                    <template slot-scope="scope">
                        <div class="produt">
                            <div class="product-content">
                                <div class="product-content-name">{{scope.row.skuName}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="供应商ID" prop="supplierName" align="center" min-width="110px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.supplierId }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库存类型" prop="type" align="center" width="110px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.qtyType }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作来源" prop="type" align="center" width="110px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.optSource }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="来源单据" prop="orderType" align="center" width="80px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.orderType }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="来源单号" prop="sourceNo" align="center" width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.sourceNo || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作数量" prop="opt_qty" align="center" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.changeType === '增加'"> {{ '+'+scope.row.optQty }}</span>
                        <span v-else> {{ '-'+scope.row.optQty }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" align="center" width="160px">
                    <template slot-scope="scope">
                        {{ scope.row.createTime }}
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="userName" align="center"  min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.operatorName || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" align="center" width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.remark || '-'}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
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
    import { supplierBasePage } from '@/request/supplier'
    import { inventoryRecordPage, QuerySupplierInventoryRecordByCondition } from '@/request/inventory'
    export default {
        components: {
        },
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                queryData: {
                    supplierId: '',
                    skuCode: '',
                    snapCode: '',
                    qtyType: null,
                    optSource: null,
                    orderType: null,
                    sourceNo: '',
                    timeList: [],
                    startTime: '',
                    endTime: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                loading: false,
                total: 0,
                supplierList: [],
                qtyTypeList: [{
                    value: 1,
                    label: '锁定库存'
                }, {
                    value: 2,
                    label: '商家库存'
                }, {
                    value: 3,
                    label: '平台库存'
                }],
                optSourceTypeList: [{
                    value: 1,
                    label: '确认采购'
                }, {
                    value: 2,
                    label: '生成jit订单'
                }, {
                    value: 3,
                    label: 'jit订单发货'
                }, {
                    value: 4,
                    label: '采购订单发货'
                }, {
                    value: 5,
                    label: 'jit订单取消'
                }, {
                    value: 6,
                    label: '入库确认'
                }, {
                    value: 7,
                    label: '确认出库'
                }, {
                    value: 8,
                    label: '商家修改库存'
                }, {
                    value: 9,
                    label: '标记缺货'
                }],
                qtySourceTypeList: [{
                    value: 1,
                    label: '采购单'
                }, {
                    value: 2,
                    label: '出库单'
                }, {
                    value: 3,
                    label: '入库单'
                }, {
                    value: 4,
                    label: '直邮订单'
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
            this.queryData.timeList = [this.lastMonthDate, this.nowEndDate]
            if (this.$route.params.skuCode && this.$route.params.supplierId) {
                this.queryData.skuCode = this.$route.params.skuCode
                this.queryData.supplierId = this.$route.params.supplierId
                this.queryData.snapCode = this.$route.params.snapCode
            }
        },
        mounted () {
            this.getQuerySupplierInventoryRecordByCondition()
        },
        methods: {
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
            /**
             * 获取库存流水列表
            */
            getQuerySupplierInventoryRecordByCondition () {
                this.loading = true
                let params = this.queryData
                params.timeList = params.timeList || []
                params.startTime = params.timeList[0]
                params.endTime = params.timeList[1]
                QuerySupplierInventoryRecordByCondition(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.supplierInventoryPB
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
                this.getQuerySupplierInventoryRecordByCondition()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getQuerySupplierInventoryRecordByCondition()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
                this.getQuerySupplierInventoryRecordByCondition()
            },
            resetSearch () {
                this.$refs.stockFlowFilterForm.resetFields()
                console.log(this.queryData)
                this.getQuerySupplierInventoryRecordByCondition()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .stock-flow{
        height: 85%;
        .main-content-wrapper{
            height: 90%;
        }
        .produt{
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            img{
                width: 100px;
                height: 100px;
            }
            .product-content{
                width: 250px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
            }
            .product-content-name{
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                margin-bottom: 10px;
            }
            .product-content-supplier{
                text-align: left;
                color: rgb(120, 120, 120)
            }
        }
        .pagination{
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
