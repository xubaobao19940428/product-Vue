<template>
    <div class="after-sale">
        <el-form ref="afterSaleFilter" inline label-width="80px" :model="queryData">
            <el-form-item prop="id" label="订单编号：" class="filter-item">
                <el-input v-model="queryData.id" clearable placeholder="支持查询父订单和子订单编号" size="medium" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="refundId" label="售后编号：" class="filter-item">
                    <el-input v-model="queryData.refundId" clearable placeholder="售后编号" size="medium" style="width: 200px"></el-input>
                </el-form-item>
            <span v-show="drop">
                <el-form-item class="filter-item" label="商品：">
                    <el-select v-model="queryData.choseType" placeholder="请选择" @change="optionChange">
                        <el-option v-for="(item, index) in productOptionList" :key="index" :label="item.name" :value="item.code" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item">
                    <el-input placeholder="请输入" clearable v-model="queryData.value" class="input-with-select"></el-input>
                </el-form-item>
                <el-form-item prop="orderNo" label="用户ID：" class="filter-item">
                    <el-input v-model="queryData.userId" clearable placeholder="用户ID" size="medium" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="订单国家：" class="filter-item" prop="countryCode">
                    <el-select v-model="queryData.countryCode" size="medium" clearable>
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" label="订单类型：">
                    <el-select v-model="queryData.orderType" placeholder="请选择">
                        <el-option v-for="val in orderTypeList" :key="val.key" :label="val.value" :value="val.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="timeList" class="filter-item" label="申请时间：">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="queryData.timeList"
                        size="medium"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <!-- <el-button type="primary" @click="initiateSale" size="medium">批量发起售后</el-button> -->
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <el-button v-if="activeTab === 1 || activeTab === 2" type="primary" plain class="batch-pass" @click="batchClick">批量通过</el-button>
        <el-button v-if="activeTab === 3" type="primary" plain class="batch-pass1" @click="batchCRefundlick">批量标记为已退款</el-button>
        <el-button v-if="activeTab === 3" type="primary" plain class="batch-pass" @click="downloadClick">下载</el-button>
        <el-tabs v-model="activeTab" @tab-click="tabClick">
            <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.title" :name="item.name">
                <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortMethod">
                    <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
                    <el-table-column label="单据信息" width="250" fixed="left">
                        <template slot-scope="scope">
                            <div>售后：{{ scope.row.refundId }}</div>
                            <div class="order-num">
                                <div class="order">订单：{{ scope.row.orderId }}</div>
                                <img :src="getCountryImg(scope.row.countryCode)">
                            </div>
                            <div>skuId：{{ scope.row.afterSaleProduct.skuId }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="售后商品" width="400" align="center">
                        <template slot-scope="scope">
                            <div class="produt">
                                <div class="product-pic">
                                    <img :src="dealShowFileSrc(scope.row.afterSaleProduct.picture)" />
                                    <div class="img-mark" v-if="scope.row.afterSaleProduct.type === 1|| scope.row.afterSaleProduct.type === 2 || scope.row.afterSaleProduct.type === 12 || scope.row.afterSaleProduct.type === 10 || scope.row.afterSaleProduct.type === 11 || scope.row.afterSaleProduct.type === 9 || scope.row.afterSaleProduct.type === 14"></div>
                                    <div class="img-mark-content" v-if="scope.row.afterSaleProduct.type === 1|| scope.row.afterSaleProduct.type === 2 || scope.row.afterSaleProduct.type === 12 || scope.row.afterSaleProduct.type === 10 || scope.row.afterSaleProduct.type === 11 || scope.row.afterSaleProduct.type === 9 || scope.row.afterSaleProduct.type === 14">{{ type[scope.row.afterSaleProduct.type] }}</div>
                                </div>
                                <div class="product-content">
                                    <div class="product-content-supplier">商品ID：{{scope.row.afterSaleProduct.productId}}</div>
                                    <div class="product-content-name">{{scope.row.afterSaleProduct.title}}</div>
                                    <div class="product-content-supplier" v-if="scope.row.afterSaleProduct.attr.length !==0">
                                        规格：
                                        <!-- {{ scope.row.afterSaleProduct.attr[0].valueLabel }} -->
                                        <span v-for="item in scope.row.afterSaleProduct.attr" :key="item.attrId">{{item.attrLabel}}：{{ item.valueLabel }} </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="实付单价×数量" width="150" align="center">
                        <template slot-scope="scope">
                            <div>退{{scope.row.refundCurrency}}{{ scope.row.afterSaleProduct.price }} X {{ scope.row.afterSaleProduct.num }}</div>
                            <div>（售 X {{ scope.row.afterSaleProduct.num }}）</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="退款金额" width="150" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.refundCurrency}}{{scope.row.refundAmount}}</div>
                            <div v-if="scope.row.refundFreight !== '0' && scope.row.refundFreight !== '0.00'">（含运费{{ scope.row.refundCurrency }}{{ scope.row.refundFreight }}）</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 1 || activeTab === 2" label="售后原因" width="100" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.refundReason}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 1 || activeTab === 2" label="发货状态" width="100" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderStatus === 2" class="pricess">{{OrderStatus[scope.row.orderStatus]}}</div>
                            <div v-else>{{OrderStatus[scope.row.orderStatus]}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab !== 5" label="等待时长" width="150" align="center">
                        <template slot-scope="scope">
                            {{formatSeconds(scope.row.waitTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 1" label="申请时间" :sortable="'custom'" width="160" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.operateTime | secondTimeFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 2" label="最新留言" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.message}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 2 || activeTab === 3" label="更新时间" :sortable="'custom'" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.operateTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 3 || activeTab === 4" label="退款账户" width="250" align="center">
                        <template slot-scope="scope">
                            <div>银行名称：{{scope.row.refundBankName || '-'}}</div>
                            <div>银行账户名：{{scope.row.refundCardholder || '-'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 4" label="退款时间" :sortable="'custom'" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.refundTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 4" label="创建时间" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 1 || activeTab === 2" label="申请人" width="120" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.operatorType === 1"><i class="iconfont">&#xe69f;</i>{{ scope.row.operatorName }}（{{scope.row.operate}}）</div>
                            <div v-else><i class="iconfont">&#xe673;</i>{{ scope.row.operatorName }}（{{scope.row.operate}}）</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 3" label="联系方式" width="180" align="center">
                        <template slot-scope="scope">
                            <div>联系电话：{{scope.row.mobile}}</div>
                            <div>电子邮箱：{{scope.row.email}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 3" label="更新人" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.operatorName}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 5" label="取消时间" :sortable="'custom'" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.cancelTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab === 5" label="取消人" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.cancelOperator}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeTab !== 5" label="操作" width="120" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="toReview(scope.row)">{{ activeTab === 1 || activeTab === 2 ? '去审核' : '查看详情'}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column v-else label="操作" width="120" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="toReview(scope.row)">{{ activeTab === 1 || activeTab === 2 ? '去审核' : '查看详情'}}</el-button>
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
            </el-tab-pane>
        </el-tabs>
        <upload-file :dialogVisible="dialogVisible" @on-cancel="cancelUpload" @on-confirm="confirmUpload"></upload-file>
        <initiate-sale :dialogVisible="saleVisible"></initiate-sale>
    </div>
</template>
<script>
    import { AfterSalePage, BatchApproved, BatchRefundSuccess, DownloadAfterSalePage } from '@/request/afterSale'
    import uploadFile from './components/uploadFile'
    import initiateSale from './components/initiateSale'

    export default {
        data () {
            return {
                activeTab: 1,
                tabList: [{
                    title: '待审核',
                    name: 1
                },{
                    title: '审核中',
                    name: 2
                },{
                    title: '已通过待退款',
                    name: 3
                },{
                    title: '售后成功',
                    name: 4
                },{
                    title: '售后关闭',
                    name: 5
                }],
                queryData: {
                    choseType:'1',
                    id: '',
                    refundId: '',
                    value: '',
                    skuId: '',
                    productId: '',
                    productName: '',
                    userId: '',
                    orderType: null,
                    timeList: [],
                    countryCode:'',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                total:0,
                OrderStatus: {
                    0: '待支付',
                    1: '待发货',
                    2: '已发货',
                    3: '交易成功',
                    4: '交易关闭',
                    5: '部分发货'
                },
                productOptionList: [{
                    name: '商品ID',
                    code: '1'
                },
                {
                    name: 'skuID',
                    code: '2'
                },
                {
                    name: '商品名称',
                    code: '3'
                }
                ],
                type:{
                    2: '大礼包',
                    1: '小礼包',
                    12: '青春礼包',
                    10: '批发商品',
                    11: '微商商品',
                    9: '虚拟商品',
                    14: '微商礼包'
                },
                orderTypeList: [{
                    key: 0,
                    value: '普通商品订单'
                },{
                    key: 1,
                    value: '小礼包商品订单'
                },{
                    key: 2,
                    value: '大礼包商品订单'
                },{
                    key: 4,
                    value: '拼团订单'
                },{
                    key: 5,
                    value: '直播订单'
                },{
                    key: 8,
                    value: '虚拟商品订单'
                },{
                    key: 9,
                    value: '批发商品订单'
                },{
                    key: 10,
                    value: '微商商品订单'
                },{
                    key: 11,
                    value: '99青春版礼包'
                }],
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                tableData: [],
                refundList: [],
                dialogVisible: false,
                saleVisible: false,
                sortTable: ''
            }
        },
        components: {
            uploadFile,
            initiateSale
        },
        mounted() {
            this.queryData.timeList = [this.lastWeekDate,this.nowEndDate]
            console.log(this.$route.query.refundId)
            if (this.$route.query.refundId) {
                console.log('===>')
                this.queryData.choseType = '2'
                this.queryData.refundId = this.$route.query.refundId
                this.inputChange(this.$route.query.refundId)
            } else {
                this.getAfterSalePage()
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            nowEndDate () {
                return this.$store.state.globalNum.nowEndDate
            },
            lastWeekDate () {
                return this.$store.state.globalNum.lastWeekDate
            }
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
            getCountryImg (code) {
                let item = this.countryList.find((val) => {
                    return val.shortCode == code
                })
                return item ? this.dealShowFileSrc(item.image) : ''
            },
            sortMethod (val) {
                console.log(val)
                if (val.order === 'descending') {
                    this.sortTable = ''
                } else {
                    this.sortTable = 'update_time desc'
                }
                console.log(this.sortTable)
                this.getAfterSalePage()
            },
            formatSeconds (mss) {
                let duration
                let days = parseInt(mss / (1000 * 60 * 60 * 24))
                let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
                let seconds = parseInt((mss % (1000 * 60)) / 1000)
                if (days > 0)  duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
                else if (hours > 0)  duration = hours + "小时" + minutes + "分" + seconds + "秒"
                else if (minutes > 0) duration = minutes + "分" + seconds + "秒"
                else if (seconds > 0) duration = seconds + "秒"
                // console.log(duration)
                return duration
            },
            optionChange (val) {
                this.queryData.choseType = val
                switch (this.queryData.choseType) {
                    case '1' :this.queryData.skuId = '',this.queryData.productName = '';break
                    case '2' :this.queryData.productName = '',this.queryData.productId = '';break
                    case '3' :this.queryData.skuId = '',this.queryData.productId = '';break
                }
            },
            inputChange (val) {
                console.log('===>',val)
                switch (this.queryData.choseType) {
                    case '1' :this.queryData.productId = this.queryData.value;break
                    case '2' :this.queryData.skuId = this.queryData.value;break
                    case '3' :this.queryData.productName = this.queryData.value;break
                }
                console.log(this.queryData.timeList)
                let params = {
                    id: this.queryData.id,
                    startTime: this.queryData.timeList?moment(this.queryData.timeList[0]).valueOf():null,
                    endTime: this.queryData.timeList?moment(this.queryData.timeList[1]).valueOf():null,
                    refundStatus: this.activeTab,
                    orderType: this.queryData.orderType,
                    productId: this.queryData.productId,
                    skuId: this.queryData.skuId,
                    productName: this.queryData.productName,
                    countryCode: this.queryData.countryCode,
                    userId: this.queryData.userId,
                    refundId: val,
                    page: this.queryData.page,
                    orderBy: this.sortTable
                }
                AfterSalePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData.splice(0)
                        let data = res.afterSale
                        let moduleStatus = data[0].refundStatus === 6 ? 5: data[0].refundStatus

                        for (let i= 0; i< data.length;i++) {
                            if (data[i].refundStatus == 6) {
                                Object.assign(data[i],{refundStatus: 5})
                            }
                            if (moduleStatus == data[i].refundStatus) {
                                this.tableData.push(data[i])
                            }
                        }
                        this.activeTab = data[0].refundStatus
                        console.log(this.activeTab)
                        this.total = Number(res.total)
                    }
                })
            },
            getAfterSalePage () {
                switch (this.queryData.choseType) {
                    case '1' :this.queryData.productId = this.queryData.value;break
                    case '2' :this.queryData.skuId = this.queryData.value;break
                    case '3' :this.queryData.productName = this.queryData.value;break
                }
                console.log(this.sortTable)
                let params = {
                    id: this.queryData.id,
                    startTime: this.queryData.timeList?moment(this.queryData.timeList[0]).valueOf():null,
                    endTime: this.queryData.timeList?moment(this.queryData.timeList[1]).valueOf():null,
                    refundStatus: this.activeTab,
                    orderType: this.queryData.orderType,
                    productId: this.queryData.productId,
                    skuId: this.queryData.skuId,
                    productName: this.queryData.productName,
                    countryCode: this.queryData.countryCode,
                    userId: this.queryData.userId,
                    refundId: this.queryData.refundId,
                    page: this.queryData.page,
                    orderBy: this.sortTable
                }
                AfterSalePage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.afterSale
                        this.total = Number(res.total)
                    }
                })
            },
            handleSelectionChange (val) {
                console.log(val)
                this.refundList.splice(0)
                for (const iterator of val) {
                    this.refundList.push(iterator.refundId)
                }
            },
            batchClick () {
                this.getBatchApproved()
            },
            batchCRefundlick () {
                this.getBatchRefundSuccess()
            },
            downloadClick () {
                switch (this.queryData.choseType) {
                    case '1' :this.queryData.productId = this.queryData.value;break
                    case '2' :this.queryData.skuId = this.queryData.value;break
                    case '3' :this.queryData.productName = this.queryData.value;break
                }
                let params = {
                    id: this.queryData.id,
                    startTime: this.queryData.timeList?moment(this.queryData.timeList[0]).valueOf():null,
                    endTime: this.queryData.timeList?moment(this.queryData.timeList[1]).valueOf():null,
                    refundStatus: this.activeTab,
                    orderType: this.queryData.orderType,
                    productId: this.queryData.productId,
                    skuId: this.queryData.skuId,
                    productName: this.queryData.productName,
                    countryCode: this.queryData.countryCode,
                    userId: this.queryData.userId,
                    refundId: this.queryData.refundId,
                    page: this.queryData.page
                }
                DownloadAfterSalePage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        window.open(res.url)
                    }
                })
            },
            getBatchApproved () {
                let params = {
                    refundId: this.refundList
                }
                BatchApproved(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('批量通过成功！')
                        this.getAfterSalePage()
                    }
                })
            },
            getBatchRefundSuccess () {
                let params = {
                    refundId: this.refundList
                }
                BatchRefundSuccess(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('批量标记已退款成功！')
                        this.getAfterSalePage()
                    }
                })
            },
            tabClick () {
                this.sortTable = ''
                this.getAfterSalePage()
            },
            search () {
                this.getAfterSalePage()
            },
            resetSearch () {
                Object.assign(this.queryData, {
                    choseType:'1',
                    id: '',
                    refundId: '',
                    value: '',
                    skuId: '',
                    productId: '',
                    productName: '',
                    userId: '',
                    orderType: null,
                    countryCode:'',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                })
                this.queryData.timeList = [this.lastWeekDate,this.nowEndDate]
                // this.$refs.afterSaleFilter.resetFields()
                this.getAfterSalePage()
            },
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getAfterSalePage()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getAfterSalePage()
            },
            toReview (val) {
                this.$router.push({
                    path: '/order/reviewOperation',
                    query: { 
                        refundId: val.refundId
                    }
                })
            },
            initiateSale () {
                this.dialogVisible = true
            },
            cancelUpload () {
                this.dialogVisible = false
            },
            confirmUpload () {
                this.dialogVisible = false
                this.saleVisible = true
            }
        }
    }
</script>
<style lang="scss" scoped>
    .after-sale {
        position: relative;
        overflow: scroll;
        .order-num{
            display: flex;
            align-items: center;
            .order{
                margin-right: 5px;
            }
            img{
                height: 16px;
            }
        }
        .batch-pass {
            position: absolute;
            right: 10px;
            padding-bottom: 9px;
            z-index: 10;
        }
        .batch-pass1 {
            position: absolute;
            right: 90px;
            padding-bottom: 9px;
            z-index: 10;
        }
        .pricess{
            color: rgb(231,113,129);
        }
        .produt{
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            .product-pic{
                position: relative;
                img{
                    width: 100px;
                    height: 100px;
                }
                .img-mark{
                    position: absolute;
                    bottom: 0px;
                    width: 100%;
                    height: 30px;
                    background-color: rgb(246,210,215);
                    opacity: 0.8; 
                }
                .img-mark-content{
                    position: absolute;
                    bottom: 4px;
                    width: 100%;
                    font-weight: 500;
                    color: red;
                }
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