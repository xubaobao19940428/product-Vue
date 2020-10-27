<template>
    <div class="merchant-inventory">
        <el-form ref="merchantInventory" inline label-width="80px" :model="queryData">
            <el-form-item class="filter-item" label="">
                <el-select v-model="queryData.choseType" placeholder="请选择" @change="optionChange">
                    <el-option v-for="(item, index) in productOptionList" :key="index" :label="item.name" :value="item.code" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item">
                <el-input placeholder="请输入" clearable v-model="queryData.value" class="input-with-select"></el-input>
            </el-form-item>
            <el-form-item prop="outNo" label="供应商：" class="filter-item">
                <el-select v-model="queryData.supplierId" filterable clearable remote reserve-keyword  :remote-method="getSupplierList" placeholder="请输入供应商" size="medium" @change="search">
                    <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="skuCode" width="240" fixed="left" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.skuCode}}</div>
                </template>
            </el-table-column>
            <el-table-column label="商品" width="400" align="center">
                <template slot-scope="scope">
                    <div class="produt">
                        <img :src="dealShowFileSrc(scope.row.skuPic)" />
                        <div class="product-content">
                            <div class="product-content-name">{{scope.row.skuName}}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.standardAttr}}
                </template>
            </el-table-column>
            <el-table-column label="供应商" width="300" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.supplierName}}</div>
                    <div>供应商ID：{{scope.row.supplierId}}</div>
                </template>
            </el-table-column>
                <el-table-column label="供应商国家" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.supplierCountry}}
                </template>
            </el-table-column>
            <el-table-column label="剩余可售" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.stockQty}}
                </template>
            </el-table-column>
            <el-table-column label="发货方式" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.deliveryWay === 1 ? '平台发货':'直邮'}}
                </template>
            </el-table-column>
            <el-table-column label="销售状态" width="100" align="center">
                <template slot-scope="scope">
                    {{scope.row.saleStatus === 1?'在售':'停售'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="stockFlow(scope.row)">库存流水</el-button>
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
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { supplierBasePage } from '@/request/supplier'
    import { QuerySupplierInventoryByCondition, QuerySupplierInventoryRecordByCondition } from '@/request/inventory'

    export default {
        data () {
            return {
                queryData: {
                    choseType:'1',
                    supplierId: '',
                    value: '',
                    skuCode: '',
                    skuName: '',
                    productId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                total: 0,
                supplierList: [],
                productOptionList: [{
                    name: 'skuCode',
                    code: '1'
                },
                {
                    name: '商品名称',
                    code: '2'
                },
                {
                    name: '商品ID',
                    code: '3'
                }],
                tableData: []
            }
        },
        mounted() {
            // this.getSupplierList()
            this.getQuerySupplierInventoryByCondition()
        },
        methods: {
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
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getQuerySupplierInventoryByCondition()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getQuerySupplierInventoryByCondition()
            },
            optionChange (val) {
                console.log(val)
                this.queryData.choseType = val
                switch (this.queryData.choseType) {
                    case '1' :this.queryData.skuName = '',this.queryData.productId = '';break
                    case '2' :this.queryData.skuCode = '',this.queryData.productId = '';break
                    case '3' :this.queryData.skuCode = '',this.queryData.skuName = '';break
                }
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getQuerySupplierInventoryByCondition()
            },
            resetSearch () {
                this.queryData.choseType = '1'
                this.supplierId = ''
                this.queryData.value= ''
                this.queryData.skuCode= ''
                this.queryData.skuName= ''
                this.queryData.productId= ''
            },
            getQuerySupplierInventoryByCondition () {
                switch (this.queryData.choseType) {
                    case '1' :this.queryData.skuCode = this.queryData.value;break
                    case '2' :this.queryData.skuName = this.queryData.value;break
                    case '3' :this.queryData.productId = this.queryData.value;break
                }
                let params = {
                    page: this.queryData.page,
                    skuCode: this.queryData.skuCode,
                    skuName: this.queryData.skuName,
                    productId: this.queryData.productId,
                    supplierId: this.queryData.supplierId,
                }
                QuerySupplierInventoryByCondition(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.inventoryDataPB
                        this.total = res.totalCount
                    }
                })
            },
            stockFlow (value) {
                this.$router.push({
                    name: 'inventoryFlow',
                    params: {
                        skuCode: value.skuCode,
                        supplierId: value.supplierId,
                        snapCode: value.snapCode,
                        activeName: 'merchant'
                    }
                })
            }
        },
    }
</script>
<style lang="scss" scoped>
    .merchant-inventory{
        overflow: scroll;
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
    }
</style>
