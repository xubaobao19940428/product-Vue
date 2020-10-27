<template>
    <div class="product-select">
        <el-form inline label-width="100px">
            <el-form-item label="平台选择：">
                <el-select v-model="queryData.source" placeholder="请选择" size="medium" style="width: 110px">
                    <el-option v-for="(item, index) in sourceList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售国家：" class="filter-item">
                <el-select v-model="queryData.countryCode" size="medium">
                    <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：" class="filter-item">
                <el-select v-model="queryData.status" size="medium" clearable="">
                    <el-option v-for="(val, key) in statusList" :key="key" :label="val" :value="Number(key)"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="后台类目：" class="filter-item">
                <el-cascader style="width: 300px"
                    clearable
                    filterable
                    :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true }"
                    placeholder="请选择后台类目"
                    :options="backCategoryOptions"
                    v-model="thirdCate"
                    @change="setBackCateId"
                    class="normalOperatorBox"
                    size="medium">
                </el-cascader>
            </el-form-item>
            <el-form-item label="上架时间：">
                <el-date-picker 
                    type="daterange" 
                    value-format="timestamp"
                    style="width: 252px"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="月销量：">
                <el-input placeholder="请输入" size="medium" v-model="queryData.monthSaleMin" style="width: 120px"></el-input>
                -
                <el-input placeholder="请输入" size="medium" v-model="queryData.monthSaleMax" style="width: 120px"></el-input>
            </el-form-item>
            <el-form-item label="销售价：">
                <el-input placeholder="请输入" size="medium" v-model="queryData.priceMin" style="width: 120px"></el-input>
                -
                <el-input placeholder="请输入" size="medium" v-model="queryData.priceMax" style="width: 120px"></el-input>
            </el-form-item>
            <el-form-item label="商品搜索：">
                <el-input placeholder="商品名称/商品关键字" clearable size="medium" v-model="queryData.productNameKeyword" style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px">
                <el-button type="primary" size="medium"
                            icon="el-icon-search"
                        @click="search">查询
                </el-button>
                <el-button size="medium"
                            icon="el-icon-refresh-left"
                        @click="resetSearch">重置
                </el-button>
                <el-button plain type="primary" size="medium"
                            icon="el-icon-download"
                        @click="exportOrder">导出
                </el-button>
            </el-form-item>
        </el-form>
        <div class="time">数据时间：{{ updateTime | formatTime }}</div>
        <el-table border :data="dataList"  v-loading="loading" :element-loading-text="textLoading?'1688商品匹配中...':''" @sort-change="handleSortChange">
            <el-table-column prop="source" label="平台" align="center" width="100px">
                <template slot-scope="scope">
                    <div>{{ scope.row.source == 1 ? "shopee" : "lazada" }}</div>
                </template>
            </el-table-column>
            <el-table-column label="商品信息" align="center" width="250px">
                <template slot-scope="scope">
                     <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                        <div class="name">商品名称：{{ scope.row.productName }}</div>
                    </el-tooltip>
                    <div @click="urlClick(scope.row.productUrl)" class="open-url">链接：{{scope.row.productUrl}}</div>
                </template>
            </el-table-column>
            <el-table-column label="图片" align="center" width="120px">
                <template slot-scope="scope">
                    <img :src="dealShowFileSrc(scope.row.imageUrl)" class="img"/>
                </template>
            </el-table-column>
            <el-table-column label="fingo类目" align="center" width="120px">
                <template slot-scope="scope">
                    <div v-if="scope.row.categoryUnit">
                        <div>{{ scope.row.categoryUnit.cateName_1 }} ></div>
                        <div>{{ scope.row.categoryUnit.cateName_2 }} ></div>
                        <div>{{ scope.row.categoryUnit.cateName_3 }} ></div>
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="第三方类目" align="center" width="120px">
                <template slot-scope="scope">
                    <div>{{ scope.row.catePath }}</div>
                </template>
            </el-table-column>
            <el-table-column label="销售价" align="center" width="120px" sortable="custom">
                <template slot-scope="scope">
                    <div>{{ scope.row.price }}{{ scope.row.currency }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="monthSale" label="月销量" align="center" width="120px" sortable="custom"></el-table-column>
            <el-table-column label="月销量增长率" align="center" width="140px" sortable="custom">
                <template slot-scope="scope">
                     <div>{{ scope.row.monthSaleRate + '%' }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="daySale" label="近一日销量" align="center" width="140px" sortable="custom"></el-table-column>
            <el-table-column prop="monthPraiseNum" label="月新增点赞数" align="center" width="140px" sortable="custom"></el-table-column>
            <el-table-column label="状态" align="center" width="100px">
                <template slot-scope="scope">
                    <div>
                        <el-tooltip v-if="scope.row.status === 3" class="item" effect="dark" :content="scope.row.failReason" placement="top">
                            <div>{{statusList[scope.row.status]}}</div>
                        </el-tooltip>
                        <div v-else>{{statusList[scope.row.status]}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="阿里巴巴供应商名称" align="center" width="150px">
                <template slot-scope="scope">
                    <div>{{ scope.row.alibabaSupplierName ? scope.row.alibabaSupplierName:'-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="1688商品链接" align="center" width="150px">
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.alibabaId === ''">-</div>
                        <div v-else @click="urlClick(`https://detail.1688.com/offer/${scope.row.alibabaId}.html`)" class="open-url">{{ `https://detail.1688.com/offer/${scope.row.alibabaId}.html` }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="电霸上架时间" align="center" width="200px">
                <template slot-scope="scope">
                    <div>{{scope.row.onShelfTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="200px">
                <template slot-scope="scope">
                    <div class="btn-box">
                        <div v-if="scope.row.status !== 2 && scope.row.status !== 4 && scope.row.status !== 5">   
                            <el-button type="primary" size="small" @click="matchSupplier(scope.row.imageUrl, scope.row.id, scope.row.categoryUnit)">匹配供应商</el-button>
                            <el-button type="danger" size="small" @click="deleteUse(scope.row.id)">弃用</el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <product-select-new v-if="dialogVisible" :dialogVisible="dialogVisible" :list="list" :id="id" :cateId3="cateId3" @on-cancel="cancelDialog"></product-select-new>
    </div>
</template>
<script>
    import { categoryListGet, ListProductSelectPage, DeleteProduct, SearchSupplierByImage, ListProductSelectExport } from '@/request/product'
    import productSelectNew from './components/productSelectNew'

    export default {
        data () {
            return {
                queryData: {
                    source: 1,
                    firstCateId: '',
                    secondCateId: '',
                    thirdCateId: '',
                    monthSaleMin: '',
                    monthSaleMax: '',
                    priceMin: '',
                    priceMax: '',
                    productNameKeyword: '',
                    countryCode: 'MY',
                    status: null
                },
                thirdCate: [],
                page:{
                    pageNum: 1,
                    pageSize: 50,
                    pagingSwitch: true,
                    orderStr: ''
                },
                totals: 0,
                timeList: [],
                sourceList: [{
                    value: 1,
                    label: 'shopee'
                },{
                    value: 2,
                    label: 'lazada'
                }],
                backCategoryOptions: [],
                dataList: [],
                statusList:{
                    1:"待处理", 
                    2:"上架成功",
                    3:"上架失败", 
                    4:"弃用",
                    5:"上架进行中"
                },
                dialogVisible: false,
                list: [],
                id: null,
                cateId3: null,
                updateTime: null,
                loading: false,
                textLoading: false,
            }
        },
        components: {
            productSelectNew
        },
        created() {
            this.timeList = [this.lastPartMonth, this.nowEnd]
            this.fetchCategory({
                level: 1,
                cateType: 2,
                resolve: (data) => {
                    this.backCategoryOptions = data
                }
            })
        },
        mounted () {
            this.getListProductSelectPage()
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastPartMonth () {
                return this.$store.state.globalNum.lastPartMonth
            },
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        methods: {
            handleSortChange (val) {
                console.log(val)
                let order = ''
                if (val.order === "descending") {
                    order = val.order.slice(0,4)
                } else {
                   order = val.order.slice(0,3) 
                }
                switch (val.column.label) {
                    case "销售价": this.page.orderStr = 'price ' + order;break;
                    case "月销量": this.page.orderStr = 'month_sale ' + order;break;
                    case "月销量增长率": this.page.orderStr = 'month_sale_rate ' + order;break;
                    case "近一日销量": this.page.orderStr = 'day_sale ' + order;break;
                    case "月新增点赞数": this.page.orderStr = 'month_praise_num ' + order;break;
                }
                console.log(this.page)
                this.getListProductSelectPage()
            },
            getBackSubCategory (data, resolve) {
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
            fetchCategory ({ id, cateType, level, pid, page, resolve }) {
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
            setBackCateId (value) {
                if (this.thirdCate && this.thirdCate.length > 0) {
                    if (this.thirdCate.length === 1) {
                        let cateInfo = JSON.parse(this.thirdCate[this.thirdCate.length - 1])
                        this.queryData.firstCateId = cateInfo.cateId
                        this.queryData.secondCateId = ''
                        this.queryData.thirdCateId = ''
                    } else if (this.thirdCate.length === 2) {
                        let cateInfo = JSON.parse(this.thirdCate[this.thirdCate.length - 1])
                        this.queryData.secondCateId = cateInfo.cateId
                        this.queryData.firstCateId = ''
                        this.queryData.thirdCateId = ''
                    } else if (this.thirdCate.length === 3) {
                        let cateInfo = JSON.parse(this.thirdCate[this.thirdCate.length - 1])
                        this.queryData.thirdCateId = cateInfo.cateId
                        this.queryData.firstCateId = ''
                        this.queryData.secondCateId = ''
                    }
                } else {
                    this.queryData.firstCateId = ''
                    this.queryData.secondCateId = ''
                    this.queryData.thirdCateId = ''
                }
            },
            getListProductSelectPage () {
                this.loading = true
                let onShelfStartTime,onShelfEndTime
                onShelfStartTime = this.timeList?(this.timeList[0]).toString():null
                onShelfEndTime = this.timeList?(this.timeList[1]).toString():null
                ListProductSelectPage(this.filterData(Object.assign(this.queryData,{
                    onShelfStartTime,
                    onShelfEndTime,
                    page: this.page
                }))).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataList = res.productSelect
                        this.totals = res.total
                        this.updateTime = res.updateTime
                    }
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getListProductSelectPage();
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getListProductSelectPage();
            },
            search () {
                this.getListProductSelectPage()
            },
            resetSearch () {
                this.queryData.status = null
                this.queryData.source = 1
                this.queryData.countryCode = 'MY'
                this.queryData.firstCateId = ''
                this.queryData.secondCateId = ''
                this.queryData.thirdCateId= ''
                this.thirdCate= [],
                this.queryData.monthSaleMin= ''
                this.queryData.monthSaleMax= ''
                this.queryData.priceMin = ''
                this.queryData.priceMax = ''
                this.queryData.productNameKeyword= ''
                this.timeList = [this.lastPartMonth, this.nowEnd]
                this.page.pageNum = 1
                this.page.pageSize = 50
                this.page.orderStr = ''
                this.getListProductSelectPage()
            },
            exportOrder () {
                let onShelfStartTime,onShelfEndTime
                onShelfStartTime = this.timeList?(this.timeList[0]).toString():null
                onShelfEndTime = this.timeList?(this.timeList[1]).toString():null
                ListProductSelectExport(this.filterData(Object.assign(this.queryData,{
                    onShelfStartTime,
                    onShelfEndTime
                }))).then(res => {
                    if (res.message !== '' && res.message) {
                        this.$message.error(`${res.message}`)
                    }
                    if (res.ret.errcode === 1) {
                        window.open(this.dealShowFileSrc(res.fileUrl))
                    } 
                })
            },
            urlClick (url) {
                window.open(url)
            },
            deleteUse (id) {
                DeleteProduct({ deleteId: parseInt(id)}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('弃用成功！')
                        this.getListProductSelectPage()
                    }
                })
            },
            matchSupplier (imageUrl, id, val) {
                this.loading = true
                this.textLoading = true
                if (val) {
                    this.id = id
                    this.cateId3 = val.cateId_3
                    SearchSupplierByImage({imageUrl}).then(res => {
                        this.loading = false
                        this.textLoading = false
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.list = res.alibabaProductSimpleInfo
                            this.dialogVisible = true
                        }
                    })
                } else {
                    this.loading = false
                    this.textLoading = false
                    this.$confirm("该商品没有对应的fingo类目，所以无法匹配供应商！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                }
                
            },
            cancelDialog () {
                this.dialogVisible = false
                this.getListProductSelectPage()
            }
        }
    }
</script>
<style lang="scss" scoped>
.product-select{
    overflow: scroll;
    .img{
        width: 80px;
        height: 80px;
    }
    .btn-box{
        display: flex;
        justify-content: center;
    }
    .name{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .open-url{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #409EFF;
        text-decoration: underline;
        cursor: pointer;
    }
    .time{
        display: flex;
        justify-content: flex-end;
        margin: 10px 0;
    }
}
</style>