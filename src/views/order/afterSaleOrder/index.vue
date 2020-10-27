<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="afterSaleOrderFilter" inline label-width="100px" :model="queryData">
                <el-form-item label="订单号：" prop="orderId" class="filter-item">
                    <el-input v-model="queryData.orderId" clearable placeholder="请输入订单号" size="medium" style="width: 200px;"></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="商品名称：" prop="productName" class="filter-item">
                        <el-input v-model="queryData.productName" clearable placeholder="请输入商品名称" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="买家手机号：" prop="userPhone" class="filter-item">
                        <el-input v-model="queryData.userPhone" clearable placeholder="请输入买家手机号" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人手机号：" prop="receiverPhone" class="filter-item">
                        <el-input v-model="queryData.receiverPhone" clearable placeholder="请输入收货人手机号" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="上级手机号：" prop="prarentPhone" class="filter-item">
                        <el-input v-model="queryData.prarentPhone" clearable placeholder="请输入上级手机号" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态：" prop="afterStatus" class="filter-item">
                        <el-select v-model="queryData.afterStatus" clearable size="medium">
                            <el-option v-for="(item, key) in afterStatusList" :key="key" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </span>
                <el-form-item label="售后时间：" prop="timeList" class="filter-item">
                    <el-date-picker value-format="timestamp" v-model="timeList" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button icon="el-icon-download" v-if="hasPermission('BTN_AFTER_SALE_ORDER_EXPORT')" plain type="primary" size="medium" @click="clickToExportOrder">导出</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="orderList" height="100%" border>
                <el-table-column fixed="left" label="售后单号" align="center" prop="afterId" width="180px">
                </el-table-column>
                <el-table-column fixed="left" label="订单号" align="center" prop="orderId" width="180px">
                </el-table-column>
                <el-table-column label="商品信息" align="center" min-width="350px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center after-order-item" v-for="(item, index) in scope.row.productItem" :key="index">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(item.skuCover)" class="previewImage">
                                <img :src="dealShowFileSrc(item.skuCover)" class="image-box thumbnail" slot="reference">
                            </el-popover>
                            <div class="block-right">
                                <div class="pointer">
                                    <el-tooltip class="item" effect="dark" :content="item.productName" placement="top">
                                        <span
                                            style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 1;-webkit-box-orient: vertical">
                                            名称：{{ item.productName || '-' }}
                                        </span>
                                    </el-tooltip>
                                </div>
                                <el-tooltip class="item" effect="dark" :content="item.attr.toString()" placement="top">
                                    <span
                                        style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 1;-webkit-box-orient: vertical">
                                        规格：{{ item.attr.toString() || '-' }}
                                    </span>
                                </el-tooltip>
                                <div>数量：{{item.num}}</div>
                                <div>实际金额：{{scope.row.currency}} {{item.paied}}</div>
                                <div>下单时间：{{item.orderTime | secondTimeFormat}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品状态" prop="" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isReceived">已收货</span>
                        <span v-else>未收货</span>
                    </template>
                </el-table-column>
                <el-table-column label="退款信息" min-width="240px">
                    <template slot-scope="scope">
                        <div>预计退款金额：{{scope.row.currency}} {{ scope.row.refundInfo.applyRefund }}</div>
                        <div>应退款金额：{{scope.row.currency}} {{ scope.row.refundInfo.finalRefund }}</div>
                        <div>应退运费：{{scope.row.currency}} {{ scope.row.freight || '-'}}</div>
                        <div>退款理由：{{ scope.row.refundInfo.reason || '-'}}</div>
                        <div>退款描述：{{ scope.row.refundInfo.remark || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="退款方式" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.refundType === 0">退到银行卡</span>
                        <span v-if="scope.row.refundType === 1">退到积分</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户凭证" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <div class="list-img-box" v-for="(url, i) in scope.row.pictures" @click="previewImg(scope.row.pictures, 0)" v-if="i == 0" :key="i">
                            <img :src="dealShowFileSrc(url)" />
                            <span>{{scope.row.pictures.length}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="银行信息"  min-width="360px">
                    <template slot-scope="scope">
                        <div>用户名： {{ scope.row.bankInfo.cardholder || '-' }}</div>
                        <div>银行卡号： {{ scope.row.bankInfo.cardNo || '-' }}</div>
                        <div>银行名称： {{ scope.row.bankInfo.bankName || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="用户Id" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <div class="pointer">
                            {{ scope.row.userId }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="物流单号" prop="expressNo"  align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{scope.row.expressNo || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.afterStatus === 0">审核中</span>
                        <span v-if="scope.row.afterStatus === 1">审核通过</span>
                        <span v-if="scope.row.afterStatus === 2">售后成功</span>
                        <span v-if="scope.row.afterStatus === 3">售后关闭(用户取消)</span>
                        <span v-if="scope.row.afterStatus === 4">售后驳回(拒绝)</span>
                        <span v-if="scope.row.afterStatus === 5">售后失败(信息有误，重新填写)</span>
                        <span v-if="scope.row.afterStatus === -1">没有售后</span>
                    </template>
                </el-table-column>
                <el-table-column label="售后发起时间" prop="applyTime"  align="center" min-width="160px">
                    <template slot-scope="scope">
                        <div> {{ scope.row.applyTime | secondTimeFormat}}</div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <!-- <div>
                        </div> -->
                        <div>
                            <el-button plain type="primary" size="mini" v-if="scope.row.afterStatus < 1 && hasPermission('BTN_AFTER_SALE_ORDER_REFUND_REFUSED')"  @click="clickToRefusedOrder(scope.row)">拒绝售后</el-button>
                        </div>
                        <div style="margin-top:5px">
                            <el-button plain type="primary" size="mini" v-if="scope.row.afterStatus < 2 && hasPermission('BTN_AFTER_SALE_ORDER_REFUND_COMPLETED')"  @click="showRefund(scope.row)">完成退款</el-button>
                        </div>
                        <div style="margin-top:5px">
                            <el-button plain type="primary" size="mini" v-if="scope.row.afterStatus < 1 && hasPermission('BTN_AFTER_SALE_ORDER_REFUND_FAIL')"   @click="clickToRejectRefund(scope.row)">退款失败</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrapper">
            <el-pagination
                @size-change="handleSizeChanges"
                @current-change="handleCurrentChanges"
                :current-page="queryData.page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="totals">
            </el-pagination>
        </div>

        <image-preview v-show="image.show" :close="closePreview" :index="image.index" :list="image.list"> </image-preview>

        <!--退款方式选择-->
        <el-dialog :title="title" :visible.sync="show" width="700px" @close="show = false">
            <el-form label-width="110px" ref="Refund" :model="param" :rules="rules" >
                <el-form-item label="预计退款金额：">
                    {{applyRefund}}
                </el-form-item>
                <el-form-item label="退款金额：" prop="amount">
                    <el-input-number v-model="param.amount" clearable :min="0" :controls="false" size="medium" ></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="clickToResolveRefund" size="small">确认</el-button>
                    <el-button @click="show = false;param.amount = 0 " size="small">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import list from '@/mixins/List'
    import imagePreview from '@/components/imagePreview'
    import { viewAfterList, handlerAfter, DownloadAfterSalePage } from '@/request/order'
    import { param } from '@/utils/index'

    export default {
        name: 'orderList',
        components: {
            imagePreview
        },
        mixins: [list],
        extends: {},
        props: {},
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                title: '退款方式',
                show: false,
                orderList: [],
                queryData: {
                    orderId: '',
                    productName: '',
                    userPhone: '',
                    receiverPhone: '',
                    prarentPhone: '',
                    afterStatus: null,
                    timeList: [],
                    startTime: '',
                    endTime: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                totals: 0,
                afterStatusList: [{
                    label: '审核中',
                    value: 0

                }, {
                    label: '审核通过',
                    value: 1

                }, {
                    label: '售后成功',
                    value: 2

                }, {
                    label: '售后关闭(用户取消)',
                    value: 3

                }, {
                    label: '售后驳回(拒绝)',
                    value: 4

                }, {
                    label: '售后失败(信息有误，重新填写)',
                    value: 5

                }, {
                    label: '售后驳回(拒绝)',
                    value: -1

                }],
                statusList: {
                    'REFUND_SUCCESS': '退款成功',
                    'REFUND_FAIL': '退款失败',
                    'REFUND_CANCEL': '取消退款',
                    'APPLY_REJECTED': '申请驳回',
                    'WAIT_REFUND': '退款中'
                },
                paywayList: {
                    'ARTIFICIAL_MONEY': '人工打款',
                    'INTEGRAL': '积分支付'
                },
                orderDetail: {},
                saleOrderDialogVisible: false,
                timeList: [],
                image: {
                    show: false,
                    index: 0,
                    list: []
                },
                param: {
                },
                afterId: '',
                applyRefund: '',
                rules: {
                    amount: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
                }
            }
        },
        computed: {
            lastPartMonth () {
                return this.$store.state.globalNum.lastPartMonth
            },
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            }
        },
        directives: {},
        filters: {},
        created () {
            this.timeList = [this.lastPartMonth, this.nowEnd]
            this.getAfterSaleOrderList()
        },
        methods: {
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            getAfterSaleOrderList () {
                let params = this.queryData
                viewAfterList(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.totals = res.total
                        this.orderList = res.afterItem
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getAfterSaleOrderList()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getAfterSaleOrderList()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
                this.getAfterSaleOrderList()
            },
            // 显示完成退款弹框
            showRefund (data) {
                this.title = '退款'
                this.orderId = data.orderId
                this.afterId = data.afterId
                this.applyRefund = data.refundInfo.applyRefund
                Object.assign(this.param, {
                    refundApplyCode: data.refundApplyCode,
                    refundAmount: data.actualPayment,
                    refundContent: data.refundReason,
                    refundPayWay: data.refundWay
                })
                this.show = true
            },
            closePreview () {
                this.image.index = 0
                this.image.show = false
            },
            previewImg (imgList, i) {
                this.image.list = imgList
                this.image.index = i
                this.image.show = true
            },
            resetSearch () {
                this.$refs.afterSaleOrderFilter.resetFields()
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.timeList = []
                this.getAfterSaleOrderList()
            },
            clickToExportOrder () {
                if (!this.timeList || this.timeList.length !== 2) {
                    this.$message({
                        type: 'warning',
                        message: '请选择导出日期范围'
                    })
                    return
                }
                let params = {
                    id: this.queryData.orderId,
                    startTime: this.timeList[0],
                    endTime: this.timeList[1],
                    page:this.queryData.page
                }
                console.log(params)
                DownloadAfterSalePage(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        window.open(`${res.url}`)
                    }
                })
                // let href = `${process.env.VUE_APP_API}/manage/orders_manage/selledOrderExport?` + param(this.filterData(Object.assign(
                //     this.param, {
                //         startTime: this.timeList[0],
                //         endTime: this.timeList[1]
                //     }
                // )))
                // let a = document.createElement('a')
                // a.href = href
                // a.click()
            },
            async clickToRefusedOrder ({
                orderId, afterId
            }) {
                this.$confirm('确认拒绝售后?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.handlerAfterRequest(orderId, afterId, 2)
                })
            },
            async clickToRejectOrder ({
                afterId
            }) {
                this.$confirm('确认驳回售后?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.handlerAfterRequest(afterId, 3)
                })
            },
            /// /退款成功
            clickToResolveRefund () {
                this.$refs['Refund'].validate((valid) => {
                    if (valid) {
                        if (Number(this.param.amount) > Number(this.applyRefund)) {
                            this.$message.warning('退款金额不能大于总金额！')
                        } else {
                            this.handlerAfterRequest(this.orderId, this.afterId, 0, this.param.amount+'')
                        }
                    } else {
                        return false
                    }
                })
            },
            clickToRejectRefund ({
                orderId, afterId
            }) {
                this.$confirm('确认退款失败?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.handlerAfterRequest(orderId, afterId, 1)
                })
            },
            handlerAfterRequest (orderId, afterId, handlerType, amount) {
                let params = {
                    orderId: orderId,
                    afterId: afterId,
                    handlerType: handlerType,
                    amount: amount
                }
                handlerAfter(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        this.show = false
                        this.getAfterSaleOrderList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .image-box {
        height: 100px;
        width: 100px;
    }
    .block-right {
        height: auto;
    }
    .after-order-item {
        height: 140px;
    }
</style>
