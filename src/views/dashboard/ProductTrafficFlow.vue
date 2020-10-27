<template>
    <div class="traffic-flow">
        <el-card class="platform-product">
            <h1>平台商品漏斗</h1>
            <div class="filter-container">
                <el-form inline label-width="90px" :model="queryData">
                    <el-form-item label="选择日期：" class="filter-item" prop="value">
                        <el-date-picker
                            v-model="queryData.timeList"
                            size="medium" type="daterange"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            :clearable="false"
                            :picker-options="pickerOptions"
                            @change="getProductFunnelData"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="后台类目：" class="filter-item" prop="multiple">
                        <el-cascader style="width: 220px;" clearable filterable :props="{label: 'cateName', children: 'levelValue', value: 'prop', checkStrictly: true, lazy: true, lazyLoad: getBackSubCategory}" placeholder="请选择商品后台类目" :options="backCategoryOptions" v-model="queryData.backCate"
                            @change="setBackCateId" class="normalOperatorBox">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="商品类型：" class="filter-item" prop="multiple">
                        <el-select v-model="queryData.productType" multiple placeholder="请选择" style="width: 300px;" @change="getProductFunnelData">
                            <el-option v-for="item in productTypeOptions" :key="item.typeCode" :label="item.typename" :value="item.typeCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <el-row :gutter="20" class="funnel-chart-table">
                <div class="flow-left">
                    <funnel-chart :funnelValue="funnelValueList" :funnelConvert="funnelConvertList"></funnel-chart>
                </div>
                <div class="flow-right">
                    <el-table :data="tableData" style="width: 100%" header-align="center">
                        <el-table-column prop="viewDataCount" label="数量" align="center" min-width="100">
                            <template slot-scope="scope" >
                                {{scope.row.viewDataName}}: {{scope.row.viewDataCount}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="viewDataRate" label="总体占比" align="center" min-width="100">
                            <template slot-scope="scope" >
                               {{scope.row.viewDataRate || '-'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="viewDataConversion" label="转化率" align="center" min-width="100">
                            <template slot-scope="scope" >
                                <span>{{conversionText[scope.$index]}}</span>{{scope.row.viewDataConversion}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="viewDataChain" label="环比变化" align="center" min-width="100">
                            <template slot-scope="scope" >
                               {{scope.row.viewDataChain || '-'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="" align="center" min-width="70">
                            <template slot-scope="scope" >
                                <el-button type="text" @click="showDetail(scope.row, scope.$index)">日趋势</el-button><i class="el-icon-s-marketing" style="color: #409EFF;font-size: 14px;"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-row>
        </el-card>
        <el-card class="platform-product" style="margin-top: 20px;">
            <h1>单品详细漏斗</h1>
            <div class="filter-container">
                <el-form ref="singleFilterForm"  inline label-width="90px" :model="detailQueryData">
                    <el-form-item label="" class="filter-item" prop="queryType">
                        <el-select v-model="detailQueryData.queryType" filterable clearable style="width: 110px" size="medium" placeholder="选择类型">
                            <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-input v-model="detailQueryData.queryParam" style="width: 200px; margin-right: 20px;" size="medium" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="后台类目：" class="filter-item" prop="multiple">
                        <el-cascader style="width: 220px;" clearable filterable :props="{label: 'cateName', children: 'levelValue', value: 'prop', checkStrictly: true, lazy: true, lazyLoad: getBackSubCategory}" placeholder="请选择商品后台类目" :options="backCategoryOptions" v-model="detailQueryData.backCate"
                            @change="setDetailBackCateId" class="normalOperatorBox">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="选择日期：" class="filter-item" prop="timeList">
                        <el-date-picker
                            v-model="detailQueryData.timeList"
                            size="medium" type="daterange"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            :picker-options="pickerOptions"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="filter-item" style="margin-left: 20px;">
                        <el-button icon="el-icon-search" type="primary" @click="search" size="medium">查询</el-button>
                        <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
            <el-table border :data="dataList" v-loading="loading" :default-sort = "{prop: 'productView', order: 'descending'}" @sort-change="handleSortChange">
                <el-table-column prop="productName" label="商品名称" align="center" min-width="180px"></el-table-column>
                <el-table-column prop="productId" label="商品ID" align="center" min-width="180px">
                </el-table-column>
                <el-table-column prop="growthStatus" label="后台类目" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.cateOneName}} >> {{scope.row.cateTwoName}} >> {{scope.row.cateThreeName}}
                    </template>
                </el-table-column>
                <el-table-column prop="productView" label="曝光" align="center" width="80px" sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.productView}}
                    </template>
                </el-table-column>
                <el-table-column prop="productClick" label="点击" align="center" width="100px" sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.productClick}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderCreateNum" label="下单" align="center" width="100px" sortable="custom">
                </el-table-column>
                <el-table-column prop="orderPayNum" label="支付" align="center" width="110px" sortable="custom">
                </el-table-column>
                <el-table-column prop="viewClickRate" label="曝光/点击转化率" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.viewClickRate}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="点击/下单转化率" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.clickOrderRate}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderPayRate" label="下单/支付转化率" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.orderPayRate}}
                    </template>
                </el-table-column>
                <el-table-column prop="viewPayRate" label="曝光/支付转化率" align="center" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.viewPayRate}}
                    </template>
                </el-table-column>
                 <el-table-column prop="onSaleStatus" label="在架状态" align="center" width="100px" >
                </el-table-column>
                <el-table-column prop="onSaleCount" label="在架时长" align="center" width="100px" >
                    <template slot-scope="scope">
                        {{scope.row.onSaleCount}} 天
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="detailQueryData.page.pageNum"
                :page-size="detailQueryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        </el-card>
        <TrendChartDialog :title="dialogTitle" :lineData="lineData" :dialogVisible="dialogVisible" @on-close="handleClose"></TrendChartDialog>
    </div>
</template>

<script>
    // import moment from 'moment'
    import {
        categoryListGet
    } from '@/request/product'
    import { getProductFunnelViewData, getProductFunnelViewTradeData, getDataCenterTypeData, getProductViewDataDetail } from '@/request/datacenter'

    import FunnelChart from './components/FunnelChart'
    import TrendChartDialog from './components/TrendChartDialog'
    export default {
        // 商品流量漏斗
        name: 'productTrafficFlow',
        data() {
            return {
                dialogVisible: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() >= moment().startOf('day').unix() * 1000;
                    }
                },
                backCategoryOptions: [],
                productTypeOptions: [],
                queryData: {
                    timeList: [],
                    productType: [],
                    backCate: [],
                    backCateId: ''
                },
                conversionText: ['曝光~点击', '点击~下单', '下单~支付', '曝光~支付'],
                titleText: ['曝光/点击', '点击/下单', '下单/支付', '曝光/支付'],
                funnelValueList: [],
                funnelConvertList: [],
                tableData: [],
                typeList: [{
                    label: '商品ID',
                    value: 'product_id'
                }, {
                    label: '商品名称',
                    value: 'product_name'
                }],
                detailQueryData: {
                    queryType: '',
                    queryParam: '',
                    backCate: '',
                    backCateId: '',
                    timeList: [],
                    orderByName: 'productView',
                    orderByType: 'desc',
                    page: {
                        pagingSwitch: true,
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                dataList: [],
                total: 0,
                loading: false,
                lineData: {
                    series: [],
                    xAxis: []
                },
                dialogTitle: '转化率趋势'
            }
        },
        components: {
            FunnelChart,
            TrendChartDialog
        },
        created() {
            this.initTime()
            this.getDataCenterTypeDataEnum()
            this.fetchCategory({
                level: 1,
                cateType: 2,
                resolve: (data) => {
                    this.backCategoryOptions = data
                }
            })
        },
        mounted() {
            this.getProductFunnelData()
            this.getProductViewDataDetailList()
        },
        methods: {
            initTime() {
                let start = (moment().startOf('day').unix() * 1000 - 7 *24 * 60 *60 *1000 ) + ''
                let end = moment().endOf('day').unix() * 1000 - 24 * 60 * 60 *1000 + ''
                this.queryData.timeList = [start, end]
                this.detailQueryData.timeList = [start, end]
            },
            getBackSubCategory(data, resolve) {
                if (data.level == 0) {
                    return
                }
                let value = JSON.parse(data.value)
                this.fetchCategory({
                    pid: parseInt(value.cateId),
                    cateType: 2,
                    level: data.level + 1,
                    resolve
                })
            },
            // 获取分类
            fetchCategory({
                id,
                cateType,
                level,
                pid,
                page,
                resolve
            }) {
                categoryListGet(this.filterData({
                    pid: pid,
                    id: id,
                    level: level,
                    cateType: cateType,
                    page: page
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.categoryUnit.length; i++) {
                            res.categoryUnit[i]['levelValue'] = []
                            let item = res.categoryUnit[i].cateNameValue.find((val) => {
                                return val.languageCode == 'cn'
                            })
                            res.categoryUnit[i]['cateName'] = item ? item.name : ''
                            res.categoryUnit[i]['prop'] = JSON.stringify({
                                cateId: String(res.categoryUnit[i].cateId),
                                cateName: item ? item.name : ''
                            })
                            if (cateType == 2) {
                                res.categoryUnit[i]['leaf'] = level > 2
                            } else {
                                res.categoryUnit[i]['leaf'] = level > 1
                            }
                        }
                        resolve && resolve(res.categoryUnit, res)
                    }
                })
            },
            setBackCateId() {
                if (this.queryData.backCate && this.queryData.backCate.length > 0) {
                    let cateInfo = JSON.parse(this.queryData.backCate[this.queryData.backCate.length - 1])
                    this.queryData.backCateId = cateInfo.cateId
                } else {
                    this.queryData.backCateId = ''
                }
                this.getProductFunnelData()
            },
            getDataCenterTypeDataEnum() {
                let params = {}
                getDataCenterTypeData(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.productTypeOptions = res.productInfo
                        let productTypeChecked = []
                        _.forEach(this.productTypeOptions, item => {
                            productTypeChecked.push(item.typeCode)
                        })
                        this.queryData.productType = productTypeChecked
                    }
                })
            },
            getProductFunnelData() {
                console.log(this.queryData)
                let params = {
                    startTime: this.queryData.timeList[0] + '',
                    endTime: this.queryData.timeList[1] + '',
                    cateId: this.queryData.backCateId,
                    productType: this.queryData.productType
                }
                getProductFunnelViewData(this.filterData(params)).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.tableData = res.productFunnelViewDatas
                        let valueList = []
                        let rateList = []
                        _.forEach(this.tableData, item => {
                            valueList.push(item.viewDataCount)
                            rateList.push(item.viewDataConversion)
                        })
                        this.funnelValueList = valueList
                        this.funnelConvertList = rateList
                    }
                })
            },
            getProductFunnelViewTradeDataDetail(dataType) {
                console.log(this.queryData)
                let params = {
                    startTime: this.queryData.timeList[0] + '',
                    endTime: this.queryData.timeList[1] + '',
                    cateId: this.queryData.backCateId,
                    productType: this.queryData.productType,
                    dataType: dataType
                }
                getProductFunnelViewTradeData(this.filterData(params)).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let xAxis = []
                        let series = []
                        _.forEach(res.viewDataTrades, item => {
                            xAxis.push(item.dateDay)
                            series.push(Number(item.viewDataConversion))
                        })
                        this.lineData.xAxis = xAxis
                        this.lineData.series = series
                    }
                })
            },
            showDetail(rowData, index) {
                console.log(rowData)
                this.getProductFunnelViewTradeDataDetail(rowData.viewDataTypeCode)
                this.dialogTitle = this.titleText[index] + '转化率趋势'
                this.dialogVisible = true;
            },
            handleClose() {
                this.dialogVisible = false;
            },
            setDetailBackCateId() {
                if (this.detailQueryData.backCate && this.detailQueryData.backCate.length > 0) {
                    let cateInfo = JSON.parse(this.detailQueryData.backCate[this.detailQueryData.backCate.length - 1])
                    this.detailQueryData.backCateId = cateInfo.cateId
                } else {
                    this.detailQueryData.backCateId = ''
                }
            },
            search() {
                this.getProductViewDataDetailList()
            },
            resetSearch() {
                this.$refs.singleFilterForm.resetFields()
                let start = moment(new Date().getTime() - 3600 * 1000 * 24 * 7).format('YYYY-MM-DD HH:mm:ss')
                let end = moment(new Date().getTime()  - 3600 * 1000 * 24).format('YYYY-MM-DD HH:mm:ss')
                this.detailQueryData.timeList = [start, end]
                this.detailQueryData.queryType = ''
                this.detailQueryData.queryParam = ''
                this.detailQueryData.backCate = ''
                this.detailQueryData.backCateId = ''
                this.detailQueryData.orderByName = ''
                this.detailQueryData.orderByType = ''
                this.getProductViewDataDetailList()
            },
            getProductViewDataDetailList() {
                let params = {
                    startTime: this.detailQueryData.timeList.length > 0 ? this.detailQueryData.timeList[0 ] + '' : null,
                    endTime: this.detailQueryData.timeList.length > 0 ? this.detailQueryData.timeList[1] + '' : null,
                    queryType: this.detailQueryData.queryType,
                    queryParam: this.detailQueryData.queryParam,
                    cateId: this.detailQueryData.backCateId,
                    orderByType: this.detailQueryData.orderByType,
                    orderByName: this.detailQueryData.orderByName,
                    page: this.detailQueryData.page
                }
                if (params.queryType === 'product_id' && params.queryParam === '') {
                    this.$message.warning('商品ID不能为空')
                    return
                }
                if (params.queryType === 'product_name' && params.queryParam === '') {
                    this.$message.warning('商品名称不能为空')
                    return
                }
                this.loading = true
                getProductViewDataDetail(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.productFunnelViewDataDetails
                        this.total = parseInt(res.count)
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            handleCurrentChange(val) {
                this.detailQueryData.page.pageNum = val ? val : this.detailQueryData.page.pageNum
                this.getProductViewDataDetailList()
            },
            handleSizeChange(val) {
                this.detailQueryData.page.pageSize = val
                this.getProductViewDataDetailList()
            },
            handleSortChange(column) {
                let orderByType = ''
                if (column.order === 'ascending') {
                    orderByType = 'asc'
                } else if (column.order === 'descending')  {
                    orderByType = 'desc'
                }
                this.detailQueryData.orderByName = column.prop
                this.detailQueryData.orderByType = orderByType
                this.getProductViewDataDetailList()
            }
        }
    }
</script>

<style lang="scss">
.flow-right {
    .el-table th>.cell {
        font-size: 18px;
        color: #000;
    }
    .el-table__body tr, .el-table__body td {
        padding: 0;
        height: 68px;
    }
}
</style>

<style lang="scss" scoped>
    .traffic-flow {
        height: 95vh;
        width: 100%;
        padding: 14px;
        background-position: center;
        overflow: auto;
        .funnel-chart-table {
           .flow-left {
               width: 500px;
               display: inline-block;
           }
           .flow-right {
               display: inline-block;
               float: right;
               height: 350px;
               width: calc(100% - 500px);
               min-width: 400px;
           }
        }
        .platform-product {
            h1 {
                padding: 10px;
                font-size: 20px;
                font-weight: 600;
            }
        }
    }
</style>
