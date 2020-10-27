<template>
    <div class="app-container split-order-list-wrapper">
        <el-tabs v-model="activeName" @tab-click="getShipOrderList()">
            <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
            <el-tab-pane v-for="(item, key) in orderStatusEnum" :key="key" :label="item" :name="key"></el-tab-pane>
        </el-tabs>
        <el-form ref="splitOrderForm" inline label-width="90px" :model="queryData">
            <el-form-item label="订单号：" prop="orderIdsStr" class="filter-item" @keyup.enter.native="getShipOrderList()">
                <el-input v-model="queryData.orderIdsStr" clearable placeholder="多条查询时用,隔开" size="medium" ></el-input>
            </el-form-item>
            <el-form-item label="子单号：" prop="suborderIdsStr" class="filter-item" @keyup.enter.native="getShipOrderList()">
                <el-input v-model="queryData.suborderIdsStr" clearable placeholder="多条查询时用,隔开" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="供应商：" class="filter-item" prop="supplierIdsStr">
                <el-select v-model="queryData.supplierIdsStr"  :remote-method="getSupplierList" filterable clearable remote reserve-keyword placeholder="请输入供应商" @change="getShipOrderList()">
                    <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                </el-select>
            </el-form-item>
            <span v-show="drop">
                <el-form-item label="收货人名称：" prop="receiveName" class="filter-item" @keyup.enter.native="getShipOrderList()">
                    <el-input v-model="queryData.receiveName" clearable placeholder="请输入收货人名称" size="medium" ></el-input>
                </el-form-item>
                <el-form-item label="收货人电话：" prop="receiverPhone" class="filter-item" @keyup.enter.native="getShipOrderList()">
                    <el-input v-model="queryData.receiverPhone" clearable placeholder="请输入收货人电话" size="medium" ></el-input>
                </el-form-item>
                <el-form-item label="发货方式：" prop="shipType" class="filter-item">
                    <el-select v-model="queryData.shipType" clearable  placeholder="请选择发货方式" @change="getShipOrderList">
                        <el-option v-for="(item, key) in shipList" :key="key" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间：" prop="timeList" class="filter-item">
                    <el-date-picker v-model="queryData.timeList"
                        size="medium"
                        value-format="timestamp"
                        type="daterange"
                        start-placeholder="开始日期"
                        :default-time="['00:00:00', '23:59:59']"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="getShipOrderList" size="small">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="small">重置</el-button>
                <el-button   v-if="hasPermission('BTN_SPLITORDER_EXPORT')" :loading="exportLoading" icon="el-icon-download" type="primary" size="small" @click="exportPurchaseOrder">导出订单
                </el-button>
                <el-upload
                    action=""
                    multiple
                    :http-request="uploadFile"
                    :show-file-list="false"
                    style="display: inline; margin-left: 10px;">
                    <el-button icon="el-icon-upload"
                               v-if="hasPermission('BTN_SPLIT_ORDER_LOGISTICS_IMPORT')"
                               :loading="uploadLoading"
                               :disable="uploadLoading"
                               type="primary"
                               size="small">批量上传物流单
                    </el-button>
                </el-upload>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table :data="orderList" border v-loading="loading" row-key="orderNo" current-row-key="orderNo" height="100%">
                <el-table-column fixed="left" label="订单信息" width="260px">
                    <template slot-scope="scope">
                        <div>订单号：{{ scope.row.orderId }}</div>
                        <div>子订单：{{ scope.row.suborderId }}</div>
                        <!-- <div  v-for="(item, key) in scope.row.expressInfo" :key="key">
                            物流公司：{{item.expressCompany }}
                            物流单号：{{item.expressNo }}
                        </div> -->
                        <div>下单时间：{{ scope.row.orderTime | secondTimeFormat}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.orderStatus === 0" effect="dark" type="danger" size="mini">待支付</el-tag>
                        <el-tag v-if="scope.row.orderStatus === 1" effect="dark" size="mini">待发货</el-tag>
                        <el-tag v-if="scope.row.orderStatus === 2" effect="dark" type="warning" size="mini">待收货</el-tag>
                        <el-tag v-if="scope.row.orderStatus === 3" effect="dark" type="success" size="mini">交易成功</el-tag>
                        <el-tag v-if="scope.row.orderStatus === 4" effect="dark" type="info" size="mini">交易关闭</el-tag>
                        <el-tag v-if="scope.row.orderStatus === 5" type="warning"  size="mini">部分发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="子单状态" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.subStatus === 0" effect="dark" type="danger" size="mini">待支付</el-tag>
                        <el-tag v-if="scope.row.subStatus === 1" effect="dark" size="mini">待发货</el-tag>
                        <el-tag v-if="scope.row.subStatus === 2" effect="dark" type="warning" size="mini">待收货</el-tag>
                        <el-tag v-if="scope.row.subStatus === 3" effect="dark" type="success" size="mini">交易成功</el-tag>
                        <el-tag v-if="scope.row.subStatus === 4" effect="dark" type="info" size="mini">交易关闭</el-tag>
                        <el-tag v-if="scope.row.subStatus === 5" type="warning"  size="mini">部分发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="商品信息" align="center" min-width="300px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center split-order-item" v-for="(item, index) in scope.row.productInfo" :key="index">
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
                                <div class="pointer">skuCode：{{ item.skuCode || '-' }}</div>
                                <div>规格：{{item.attribute}}</div>
                                <div>数量：{{ item.count }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="收货信息" min-width="250px">
                    <template slot-scope="scope">
                        <div>收货人：{{ scope.row.receiverName || '-' }}</div>
                        <div>手机号：{{ scope.row.receiverPhone || '-' }}</div>
                        <div>地址：{{ scope.row.address || '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="发货方式" min-width="120px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.shipType === 0" >-</span>
                        <el-tag v-if="scope.row.shipType === 1" effect="dark" type="danger" size="mini">商家直邮</el-tag>
                        <el-tag v-if="scope.row.shipType === 2" effect="dark" size="mini">平台发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="130px">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" v-if="hasPermission('BTN_SPLIT_ORDER_LOGISTICS_SEE')" @click="clickToSeeLogistic(scope.row)">
                            查看物流
                        </el-button>
                        <el-button type="text" size="mini" v-if="hasPermission('BTN_SPLIT_ORDER_LOGISTICS_EDIT') && scope.row.shipType != 2 " @click="showUploadLogisticsDialog(scope.row)">
                            填写物流信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totals"
                class="pagination">
            </el-pagination>
        </div>
        <!--查看物流-->
        <view-logistics-dialog :dialogVisible="viewLogisticsShow" :expressList="expressInfoList" :suborderId="suborderId"  @on-close="onHandleCloseViewDialog"></view-logistics-dialog>
        <upload-logi-info-dialog :dialogVisible="dialogVisible" :logiInfo="logiInfo" @on-confirm="onConfirmUploadLogi" @on-cancle="onCancleUploadLogi"></upload-logi-info-dialog>
    </div>
</template>
<script>
    // import moment from 'moment'
    import UploadLogiInfoDialog from './components/UploadLogiInfoDialog'
    import ViewLogisticsDialog from './components/ViewLogisticsDialog'
    import { supplierBasePage } from '@/request/supplier'
    import { param } from '@/utils/index'
    import logisticsCompany from '@/data/company.js'
    import { shipOrderList, addExpressNo, uploadExpressNo,exportShipOrderList } from '@/request/order'
    import { uploadFileRequest } from '@/request/file'

    export default {
        components: {
            UploadLogiInfoDialog,
            ViewLogisticsDialog
        },
        extends: {},
        props: {},
        data () {
            return {
                activeName: '-1',
                exportLoading: false,
                supplierList: [],
                viewLogisticsShow: false,
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                queryData: {
                    orderIdsStr: '',
                    shipType: '', // 发货方式
                    suborderIdsStr: '',
                    supplierIdsStr: '',
                    receiveName: '',
                    receiverPhone: '',
                    receiver: '',
                    subStatus: [],
                    timeList: [],
                    orderTimeStart: null,
                    orderTimeEnd: null,
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                totals: 0,
                dialogVisible: false,
                logiInfo: {
                    suborderId: '',
                    orderId: '',
                    expressInfo: [{
                        // expressCompany: '',
                        expressNo: '',
                        expressCode: ''
                    }]
                },
                loading: false,
                orderList: [],
                deliveryWay: {
                    'CONSOLIDATION': '集货',
                    'DIRECT_SHIPMENT': '直发'
                },
                timeList: [],
                orderStatusEnum: {
                    0: '待支付',
                    1: '待发货',
                    2: '待收货',
                    3: '交易成功',
                    4: '交易关闭'
                },
                shipList: [ {
                    label: '商家直邮',
                    value: 1
                }, {
                    label: '平台发货',
                    value: 2
                }],
                param: {
                    orderNos: '',
                    splitOrderCodes: '',
                    splitOrderStatus: [],
                    forwarderCompanyIds: '',
                    supplierCompanyIds: '',
                    userInfoParam: ''
                },
                logisticsCompany: logisticsCompany,
                uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
                headers: this.$headers,
                forwarderCompany: [],
                logisticsType: {
                    'DOMESTIC': '国内',
                    'INTERNATIONAL': '国际',
                    'LOCAL': '当地'
                },
                deliverAlert: {
                    show: false,
                    companyDisable: false,
                    rules: {
                        forwarderCompanyId: [{
                            required: true,
                            message: '货代公司不能为空',
                            trigger: 'change'
                        }]
                    },
                    logisticsSingle: [],
                    param: {
                        forwarderCompanyId: '',
                        deliveryWay: 'DIRECT_SHIPMENT',
                        splitOrderCode: ''
                    }
                },
                uploadLoading: false,
                expressInfoList: [],
                suborderId: ''
            }
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastPartMonth () {
                return this.$store.state.globalNum.lastPartMonth
            }
        },
        created () {
            this.queryData.timeList = [this.lastPartMonth, this.nowEnd]
            this.getShipOrderList()
            // this.getSupplierList()
        },
        methods: {
            // 导出订单
            exportPurchaseOrder () {
                this.exportLoading = true
                let params = this.queryData
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                exportShipOrderList(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.exportLoading = false
                        let fileUrl = res.url
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.exportLoading = false
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    this.exportLoading = false
                    console.log(err)
                })
            },
            /**
             * 获取供应商列表
             */
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
            // 重置
            resetSearch () {
                this.$refs.splitOrderForm.resetFields()
                this.queryData.timeList = [this.lastPartMonth, this.nowEnd]
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
                this.queryData.orderId = null
                this.queryData.suborderId = null
                this.queryData.supplierId = null
                this.getShipOrderList()
            },
            handleSizeChange (val) {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = val
                this.getShipOrderList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageSize = 10
                this.queryData.page.pageNum = val
                this.getShipOrderList()
            },
            showUploadLogisticsDialog (row) {
                this.logiInfo.orderId = row.orderId
                this.logiInfo.suborderId = row.suborderId
                this.logiInfo.expressInfo = [{
                    // expressCompany: '',
                    expressNo: '',
                    expressCode: ''
                }]
                this.dialogVisible = true
            },
            onCancleUploadLogi () {
                this.dialogVisible = false
            },
            onConfirmUploadLogi (logiInfo) {
                let params = logiInfo
                addExpressNo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('物流信息添加成功！')
                        this.getShipOrderList()
                        this.dialogVisible = false
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            exportOutOrderData () {
                if (!this.timeList || this.timeList.length !== 2) {
                    this.$message({
                        type: 'warning',
                        message: '请选择导出日期范围'
                    })
                    return
                }
                let time = new Date(this.timeList[1]) - new Date(this.timeList[0])
                let days = Math.floor(time / (24 * 3600 * 1000))
                if (days > 7) {
                    this.$message({
                        type: 'warning',
                        message: '导出日期范围最多7天'
                    })
                    return
                }
                let href = `${process.env.VUE_APP_API}/manage/logistics/shoppingListExport?` + param(this.filterData({
                    startDate: this.timeList[0],
                    endDate: this.timeList[1],
                    userInfoParam: this.userInfoParam,
                    supplierCompanyIds: this.supplierCompanyIds,
                    forwarderCompanyIds: this.forwarderCompanyIds,
                    splitOrderStatus: this.splitOrderStatus,
                    splitOrderCodes: this.splitOrderCodes,
                    orderNos: this.orderNos
                }))
                let a = document.createElement('a')
                a.href = href
                a.click()
            },
            // 获取物流公司名称
            getCompanyName (item) {
                let data = this.logisticsCompany.find((val) => {
                    return val.code == item
                })
                return data ? data.name : item
            },
            uploadBefore () {
                this.loading = true
            },
            uploadError (err) {
                console.log(err)
                this.loading = false
            },
            // 新增一条物流单号记录
            addLogistics () {
                this.deliverAlert.logisticsSingle.push({
                    logisticsCompany: '',
                    logisticsSingleCode: '',
                    logisticsType: 'LOCAL'
                })
            },
            deleteLogistics (i) {
                this.deliverAlert.logisticsSingle.splice(i, 1)
            },
            // 查看物流
            clickToSeeLogistic (rowData) {
                this.expressInfoList = rowData.expressInfo
                this.suborderId = rowData.suborderId
                this.viewLogisticsShow = true
            },
            getShipOrderList () {
                this.loading = true
                let params = this.queryData
                if (params.orderIdsStr) {
                    params.orderId = params.orderIdsStr.split(',')
                }
                if (params.suborderIdsStr) {
                    params.suborderId = params.suborderIdsStr.split(',')
                }
                if (params.supplierIdsStr) {
                    params.supplierId = params.supplierIdsStr.split(',')
                }
                let startTime = params.timeList ? params.timeList[0] : null
                let endTime = params.timeList ? params.timeList[1] : null

                if (startTime) {
                    params.orderTimeStart = moment(startTime).valueOf().toString()
                } else {
                    params.orderTimeStart = null
                }

                if (endTime) {
                    params.orderTimeEnd = moment(endTime).valueOf().toString()
                } else {
                    params.orderTimeEnd = null
                }
                params.subStatus = this.activeName == '-1' ? [] : [parseInt(this.activeName)]
                shipOrderList(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.orderList = res.orderItem
                        this.totals = res.totalCount
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            uploadFile (file) {
                this.uploadLoading = true
                let params = new FormData()
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'other'
                }
                params.append('file', file.file)
                params.append('param', JSON.stringify(fileInfo))
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        console.log(res)
                        this.uploadLoading = false
                        let params = {
                            url: res.original_link
                        }
                        uploadExpressNo(params).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('导入成功')
                                this.getShipOrderList()
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                        this.uploadLoading = false
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            onHandleCloseViewDialog () {
                this.viewLogisticsShow = false
            }
        }
    }
</script>

<style lang="scss">
    .split-order-list-wrapper {
        .block-right {
            flex: 1;
        }
        .order-btn-box .el-button+.el-button {
            margin: 10px 0 0 0;
        }
        .action-box {
            .el-form-item__content {
                display: flex;
            }
        }
        .avatar-uploader {
            width: 150px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 8px;
        }
        .logistics-info-wrapper {
            .logistics-info-item {
                align-items: center;
                i {
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
            .el-select {
                flex: 1;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .split-order-list-wrapper {
        .operate-container {
            padding-bottom: 10px;
        }
    }
    .image-box {
        padding: 10px;
        height: 90px;
        width: 90px;
    }
    .split-order-item {
        margin-bottom: 10px;
    }
</style>
