<template>
    <div class="app-container split-order-list-wrapper">
        <el-form ref="sockOutOrderFilter" inline label-width="100px" :model="queryData">
            <el-form-item prop="orderNo" label="订单号：" class="filter-item">
                <el-input v-model="queryData.orderNo" clearable placeholder="输入订单号" size="medium" style="width: 200px" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item prop="outNo" label="出库单编号：" class="filter-item">
                <el-input v-model="queryData.outNo" clearable placeholder="输入出库单编号" size="medium" style="width: 230px"  @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item prop="skuCode" label="skuCode查询：" class="filter-item">
                <el-input v-model="queryData.skuCode" clearable placeholder="输入skuCode" size="medium" style="width: 230px"  @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item prop="bizType" label="业务类型：" class="filter-item">
                <el-select v-model="queryData.bizType" clearable size="medium" placeholder="请选择仓库" @change="search">
                    <el-option v-for="(val, key) in bizTypeList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <span v-show="drop">
                 <el-form-item prop="warehouseNo" label="仓库：" class="filter-item">
                    <el-select v-model="queryData.warehouseNo" clearable size="medium" placeholder="请选择仓库" @change="search">
                        <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="crossOutNo" label="跨境单号：" class="filter-item">
                    <el-input  v-model="queryData.crossOutNo" clearable placeholder="输入跨境单号" size="medium" style="width: 160px"  @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item prop="logiOutNo" label="宅配单号：" class="filter-item">
                    <el-input  v-model="queryData.logiOutNo" clearable placeholder="输入跨宅配单号" size="medium" style="width: 160px"  @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item prop="outStatus" label="出库单状态：" class="filter-item">
                    <el-select v-model="queryData.outStatus" clearable size="medium" placeholder="请选择出库单状态" @change="search">
                        <el-option v-for="(val, key) in statusList" :key="key" :label="val" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="syncStatus" label="同步状态：" class="filter-item">
                    <el-select v-model="queryData.syncStatus" clearable size="medium" placeholder="请选择同步状态" @change="search">
                        <el-option v-for="(val, key) in syncStatusList" :key="key" :label="val" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="productType" label="商品类型：" class="filter-item">
                    <el-select v-model="queryData.productType" clearable size="medium" placeholder="请选择商品类型" @change="search">
                        <el-option v-for="item in productTypeList" :key="item.val" :label="item.label" :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="productType" label="异常类型：" class="filter-item">
                    <el-select v-model="queryData.errorType" clearable size="medium" placeholder="请选择异常类型" @change="search">
                        <el-option v-for="(val, key) in errorTypeList" :key="key" :label="val" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="outType" label="出库单类型：" class="filter-item">
                    <el-select v-model="queryData.outType" clearable size="medium" placeholder="请选择出库单类型" @change="search">
                        <el-option v-for="(val, key) in outTypeList" :key="key" :label="val" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="timeChose" label="时间类型：" class="filter-item">
                    <el-select v-model="queryData.timeChose" size="medium" @change="search">
                        <el-option v-for="item in timeChoseList" :key="item.val" :label="item.label" :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="timeList" label="" class="filter-item">
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
                <el-button icon="el-icon-refresh" @click="withdraw.show = true" size="medium" type="primary">拆单撤回</el-button>
                <el-button @click="exportTable" size="medium" type="primary">导出</el-button>
<!--                <el-button v-if="hasPermission('BTN_NEW_OUTBOUND_ORDER')"  type="primary"  size="medium" icon="el-icon-plus" @click="addSockOut('1','1')">新增出库单</el-button>-->
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
            <div class="operate-container">
                </div>
        </el-form>

        <div class="main-content-wrapper">
            <el-table :data="orderList" height="100%" border>
                <el-table-column fixed="left" label="出库单号" width="200px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.outNo || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单号" width="180px" align="center">
                    <template slot-scope="scope">
                        <router-link target="_blank" :to="{ name:'orderDetail',query:{ orderNo: scope.row.orderNo }}">
                            <div class="order-id">{{ scope.row.orderNo || '-'}}</div>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="出库仓" width="100px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.warehouseName || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="业务类型" width="100px" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.bizType == 0">{{ '-' }}</div>
                            <div v-else>{{ bizTypeList[scope.row.bizType] || '-'}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态时效" width="180px" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.outStatus === 1">{{ statusList[scope.row.outStatus] || '-'}}</div>
                            <el-tooltip v-else-if="scope.row.outStatus === 3" class="item" effect="dark" :content="scope.row.cancelReason" placement="top">
                                <div>{{statusList[scope.row.outStatus]}}</div>
                            </el-tooltip>
                            <div v-else-if="scope.row.errorHappenTime !== ''">{{ statusList[scope.row.outStatus] }} | <span class="error-message">{{  setTimeInter(Number(scope.row.systemTime),Number(scope.row.errorHappenTime),Number(scope.row.aging)) }}</span></div>
                            <div v-else>{{ statusList[scope.row.outStatus] }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="同步状态" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.syncStatus === 3" class="item" effect="dark" placement="top">
                            <div slot="content">
                                {{scope.row.syncRemark}}
                            </div>
                            <el-tag  effect="dark" type="info" size="mini" >同步失败</el-tag>
                        </el-tooltip>
                        <el-tag v-if="scope.row.syncStatus === 2" effect="dark" type="warning" size="mini" >未同步</el-tag>
                        <el-tag v-if="scope.row.syncStatus === 1" effect="dark" type="success" size="mini" >已同步</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="跨境信息" width="250px" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div>跨境公司：{{ scope.row.crossCompany || '-'}}</div>
                            <div>跨境单号：{{ scope.row.crossCode || '-'}}</div>
                            <div>状态：{{ crossState[scope.row.crossStatus] }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="宅配信息" width="250px" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div>宅配公司：{{ scope.row.logiCompany || '-'}}</div>
                            <div>宅配单号：{{ scope.row.logiCode || '-'}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="出库单类型" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.outType === 'B2C_ORDER'" effect="dark" size="mini" >B2C订单</el-tag>
                        <el-tag v-if="scope.row.outType === 'B2B_ORDER'" effect="dark" type="warning" size="mini" >B2B订单</el-tag>
                        <el-tag v-if="scope.row.outType === 'SPILT_ORDER'" effect="dark" type="success" size="mini" >拆单</el-tag>
                        <el-tag v-if="scope.row.outType === 'TRANSFER_ORDER'" effect="dark" type="warning" size="mini" >调仓</el-tag>
                        <el-tag v-if="scope.row.outType === 'REFUND_SPILT_ORDER'" effect="dark" type="success" size="mini" >退款拆单</el-tag>
                        <el-tag v-if="scope.row.outType === 'REISSUE'" effect="dark" type="success" size="mini" >补发</el-tag>
                        <el-tag v-if="scope.row.outType === 'BARTER'" effect="dark" type="success" size="mini" >换货</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="出库单状态" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.outStatus === 3" class="item" effect="dark" :content="scope.row.cancelReason" placement="top">
                            <el-tag effect="dark" type="info" size="mini" >已取消</el-tag>
                        </el-tooltip>
                        <el-tag v-if="scope.row.outStatus === 4" effect="dark" type="success" size="mini" >库存已满足</el-tag>

                        <el-tag v-if="scope.row.outStatus === 1" effect="dark" size="mini" >已出库</el-tag>
                        <el-tag v-if="scope.row.outStatus === 2" effect="dark" type="warning" size="mini" >待库存满足</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column label="商品类型" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <div>{{ scope.row.productType === 1? '普货':scope.row.productType===2?'敏感货':scope.row.productType===3?'违禁品':'' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="异常类型" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.errorMessage" class="error-message">
                                <div>{{ scope.row.errorMessage }}</div>
                                <div>{{ scope.row.errorHappenTime | formatTime }}</div>
                            </div>
                            <div v-else>
                                -
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="时间信息" align="center" min-width="300px">
                    <template slot-scope="scope">
                        <div class="time-message">
                            <div>创建时间：{{ scope.row.createTime | formatTime }}</div>
                            <div>库存满足时间：{{ scope.row.matchTime | formatTime }}</div>
                            <div>出库时间：{{ scope.row.outTime | formatTime }}</div>
                            <div>同步时间：{{ scope.row.syncTime | formatTime }}</div>
                            <div>取消时间：{{ scope.row.cancelTime | formatTime }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="200px" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="(scope.row.syncStatus === 2 ||scope.row.syncStatus === 3)&& scope.row.outStatus == 4 && hasPermission('BTN_SYNCHRONIZATION')" type="text" size="mini" @click="syncSockOut(scope.row)">同步</el-button>
<!--                        <el-button v-if="scope.row.outStatus === 2 && hasPermission('BTN_CANCEL')" type="text" size="mini" @click="cancleSockOut(scope.row)">取消</el-button>-->
                        <el-button v-if="(scope.row.outStatus === 2 || scope.row.outStatus === 4) && hasPermission('BTN_ADJUSTMENT')" type="text" size="mini" @click="adjustmentShow(scope.row)">异常调仓</el-button>
                        <el-button v-if=" hasPermission('BTN_SPILT_ORDER') && (scope.row.outStatus === 2 || scope.row.outStatus === 4)" type="text" size="mini" @click="demolitionOrder(scope.row,'2')">拆单</el-button>
                        <el-button v-if=" hasPermission('BTN_REISSUE') && scope.row.outStatus === 1" type="text" size="mini" @click="replacement(scope.row,'3')">补发</el-button>
                        <el-button v-if=" hasPermission('BTN_BARTER') && (scope.row.outStatus === 2 || scope.row.outStatus === 4) && scope.row.outType != 'BARTER'" type="text" size="mini" @click="exchangeGoods(scope.row,'4')">换货</el-button>
                        <el-button v-if=" hasPermission('BTN_REISSUE_EDIT') && scope.row.outType === 'REISSUE'&& (scope.row.outStatus === 2 || scope.row.outStatus === 4)" type="text" size="mini" @click="replacementEdit(scope.row,'5')">补发编辑</el-button>
                        <el-button v-if=" hasPermission('BTN_BARTER_EDIT') && scope.row.outType === 'BARTER'&& (scope.row.outStatus === 2 || scope.row.outStatus === 4)" type="text" size="mini" @click="exchangeGoodsEdit(scope.row,'6')">换货编辑</el-button>
                        <el-button  type="text" size="mini" @click="loanWorkUpdate(scope.row)">货代工作号</el-button>
                        <el-button v-if="(scope.row.outStatus === 2 || scope.row.outStatus === 4)" type="text" size="mini" @click="cancelSockOut(scope.row)">取消</el-button>
                        <el-button type="text" size="mini" @click="outBoundDetails(scope.row)">详情</el-button>
                        
                        <!-- <el-button v-if=" hasPermission('BTN_CANCEL_STOCK') && scope.row.outType === 'BARTER'&& scope.row.outStatus === 2" type="text" size="mini" @click="cancelSockOut(scope.row)">取消</el-button> -->
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
                layout="total, sizes, prev, pager, next, jumper"
                :total="totals">
            </el-pagination>
        </div>
        <!--新增/拆单-->
        <sock-out-form-edit v-if="sockOutDialogVisible" :dialogVisible="sockOutDialogVisible" :dialogTitle="dialogTitle" :oldOutNo="oldOutNo" :type="type"
            @on-cancle="handleCancleSockOut" @on-confirm="handleConfirmSockOut" @on-saveAddress="saveAddress"></sock-out-form-edit>
        <cancel-sock-out v-if="cancelSockOutDailog" :dialogVisible="cancelSockOutDailog" :cancelSockOutNo="cancelSockOutNo" @on-cancel="cancelDailog" @on-comfirm="confirmDialog"></cancel-sock-out>
        <!--补发/换货-->
       <supplement-sheet-edit v-if="supplementDialogVisible" :dialogVisible="supplementDialogVisible" :dialogTitle="dialogTitle" :oldOutNo="oldOutNo" :type="type"
            @on-cancle="handleCancleSockOut" @on-confirm="handleConfirmSupplement" @on-saveAddress="saveAddress" :countryCode="countryCode"></supplement-sheet-edit>
        <el-dialog title="异常调仓" width="700px" :visible.sync="changewarehouse.show" @close="clickToCancelChange" :close-on-click-modal="false">
            <el-form label-width="100px" :model="changewarehouse" >
                <el-row>
                    <el-col :span="10">
                        <el-form-item  label="原仓：">
                            <el-select v-model="changewarehouse.warehouseNo" clearable size="medium" disabled>
                                <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="新仓：">
                            <el-select v-model="changewarehouse.warehouseNoNew" clearable size="medium">
                                <el-option v-for="(val, key) in warehouseListNew" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="业务类型：" class="filter-item">
                            <el-select v-model="changewarehouse.bizType" clearable size="medium" placeholder="请选择仓库" @change="search">
                                <el-option v-for="(val, key) in bizTypeList" :key="key" :label="val" :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clickToCancelChange()" size="small">取 消</el-button>
                <el-button type="primary" @click="adjustment()" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="拆单撤回" width="500px" :visible.sync="withdraw.show" @close="clickToCancelWithdraw" :close-on-click-modal="false">
            <el-form label-width="100px" :model="withdraw" :rules="withdraw.rules">
                <el-form-item  label="出库单编号："  prop="outNo">
                    <el-input v-model="withdraw.outNo" placeholder="请输入出库单号" size="medium" style="width: 300px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clickToCancelWithdraw()" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmWithdraw()" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--货代工作号弹窗--->
        <AddLoanWork :dialogFormVisible="dialogFormVisible" :form="editLoanForm" @on-cancel="cancelLoanDialog" @on-submit="updateLoanDialog"></AddLoanWork>
        <out-bound-detail-dialog v-if="outBoundDetailDialog" :outId="outId" :dialogVisible="outBoundDetailDialog" @on-cancle="detailCancle"></out-bound-detail-dialog>
    </div>
</template>

<script>
    import { outOrderPage, OutOrderNewPage, ExportList, outOrderDetail, warehousePage, cannelOutOrder, repushOutOrder, createOutOrder, GetTransferWarehouse, TransferOutOrder, SpiltOutOrder, RevokeSpiltOutOrder, GetReissueWarehouse, ReissueOutOrder, BarterOutOrder, EditOutOrder } from '@/request/warehouse'
    import SockOutFormEdit from './components/SockOutFormEdit'
    import supplementSheetEdit from './components/supplementSheetEdit'
    import cancelSockOut from './components/cancelSockout'
    import { formatTime } from '@/js/common/filter'
    import AddLoanWork from './components/addLoanWork'
    import outBoundDetailDialog from './components/outBoundDetailDialog'
    import {EditOutNoFreight} from '@/request/logi'
    export default {
        components: {
            SockOutFormEdit,
            supplementSheetEdit,
            cancelSockOut,
            AddLoanWork,
            outBoundDetailDialog
        },
        props: {},
        data () {
            return {
                countryCode:'',
                //货代工作号弹窗
                dialogFormVisible:false,
                editLoanForm:{
                    logiNo:'',
                    jobNo:'',
                    outNo:'',
                },
                type: '',
                oldOutNo: '',
                withdraw: {
                    outNo: '',
                    show: false,
                    rules: {
                        outNo: [{
                            required: true,
                            message: '请输入出库单号',
                            trigger: 'blur'
                        }]
                    }
                },
                changewarehouse: {
                    warehouseNo: '',
                    outNo: '',
                    warehouseNoNew: '',
                    bizType: null,
                    show: false
                },
                loading: false,
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                totals: 0,
                warehouseList: [],
                warehouseListNew: [],
                queryData: {
                    bizType: null,
                    crossOutNo: '',
                    logiOutNo: '',
                    productType: '',
                    timeChose: 1,
                    // logiCode: '',
                    skuCode: '',
                    orderNo: '',
                    // subOrderNo: '',
                    // userName:'',
                    warehouseNo: '',
                    // countryCode: '',
                    outNo: '',
                    // payType: '',//支付类型
                    outType: '',
                    errorType: '',
                    outStatus: null,
                    syncStatus: null,
                    timeList: [],
                    startTime: '',
                    endTiem: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                orderList: [],
                timeList: [],
                crossState: {
                    '':'-',
                    '1':'未下单',
                    '2':'跨境待揽收',
                    '3':'跨境待到达',
                    '4':'跨境待交付',
                    '5':'已交付宅配',
                    '6':'已取消', 
                    '7':'下单失败', 
                    '8':'出口报关失败', 
                    '9':'进口清关失败'
                },
                errorTypeList: {
                    3:'库存满足超时',
                    2: '出库超时'
                },
                statusList: {
                    1: '已出库',
                    2: '待库存满足',
                    3: '已取消',
                    4: '库存已满足'
                },
                syncStatusList: {
                    1: '已同步',
                    2: '未同步',
                    3: '同步失败'
                },
                outTypeList: {
                    'B2C_ORDER': 'B2C订单',
                    'B2B_ORDER': 'B2B订单',
                    'SPILT_ORDER': '拆单',
                    'TRANSFER_ORDER': '调仓',
                    'REFUND_SPILT_ORDER': '退款拆单',
                    'REISSUE': '补发',
                    'BARTER': '换货'
                },
                payTypeList:{
                    'COD':'COD',
                    'OTHER':'其他'
                },
                bizTypeList: {
                    0: '全部',
                    1: 'JIT',
                    2: '预售',
                    3: '现货',
                    4: 'COSTGO'
                },
                productTypeList: [{
                    val: '1',
                    label: '普货'
                },{
                    val: '2',
                    label: '敏感货'
                },{
                    val: '3',
                    label: '违禁品'
                }],
                timeChoseList: [{
                    val: 1,
                    label: '创建时间'
                },{
                    val: 4,
                    label: '出库时间'
                },{
                    val: 5,
                    label: '库存满足时间'
                },{
                    val: 6,
                    label: '同步成功时间'
                },{
                    val: 7,
                    label: '取消时间'
                }],
                sockOutDialogVisible: false,
                supplementDialogVisible: false,
                dialogTitle: '',
                beginTime: '',
                endTime: '',
                cancelSockOutDailog:false,
                cancelSockOutNo: '',
                outBoundDetailDialog: false,
                outId:''
            }
        },
        created () {
            if (window.location.href.indexOf('?')!==-1) {
                this.queryData.outNo = window.location.href.split('?')[1].split('=')[1]
            } 
            this.queryData.syncStatus = this.$route.query.syncStatus
            this.queryData.warehouseNo = this.$route.query.warehouseNo
            this.queryData.outStatus = this.$route.query.outStatus
            this.beginTime = this.$route.query.lastMonthDate===undefined?'':formatTime(this.$route.query.lastMonthDate)
            this.endTime = this.$route.query.nowEndDate===undefined?'':formatTime(this.$route.query.nowEndDate)
            console.log(this.beginTime)
            console.log(this.endTime)
            if (this.beginTime !== '' || this.endTime !== '') {
                this.queryData.timeList = [this.beginTime, this.endTime]
            } else {
                this.queryData.timeList = [this.lastMonthDate, this.nowEndDate]
            }
            this.getWarehouseList()
            this.getScokOutOrderList()
        },
        activated () {
            
            // this.getScokOutOrderList()
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            nowEndDate () {
                return this.$store.state.globalNum.nowEndDate
            },
            lastMonthDate () {
                return this.$store.state.globalNum.lastMonthDate
            }
        },
        methods: {
            setTimeInter(systemTime, errorHappenTime, aging) {
                let mss = systemTime - errorHappenTime + aging
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
            outBoundDetails (row) {
                this.outId = row.outNo
                this.outBoundDetailDialog = true
            },
            exportTable () {
                let createStartTime,createEndTime,inventoryMatchStartTime,inventoryMatchEndTime,syncStartTime,syncEndTime,cancelStartTime,cancelEndTime,shipStartTime,shipEndTime
                switch(this.queryData.timeChose){
                    case 1:createStartTime =  this.queryData.timeList?this.queryData.timeList[0]:'';createEndTime = this.queryData.timeList?this.queryData.timeList[1]:'';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime='';syncEndTime='';cancelStartTime='';cancelEndTime='';shipStartTime='';shipEndTime='';break;
                    case 4:createStartTime =  '';createEndTime = '';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime='';syncEndTime='';cancelStartTime='';cancelEndTime='';shipStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';shipEndTime=this.queryData.timeList?this.queryData.timeList[1]:'';break;
                    case 5:createStartTime =  '';createEndTime = '';inventoryMatchStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';inventoryMatchEndTime=this.queryData.timeList?this.queryData.timeList[1]:'',syncStartTime='';syncEndTime='';cancelStartTime='';cancelEndTime='';shipStartTime='';shipEndTime='' ;break;
                    case 6:createStartTime =  '';createEndTime = '';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';syncEndTime=this.queryData.timeList?this.queryData.timeList[1]:'';cancelStartTime='';cancelEndTime='';shipStartTime='';shipEndTime='' ;break;
                    case 7:createStartTime =  '';createEndTime = '';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime='';syncEndTime='';cancelStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';cancelEndTime=this.queryData.timeList?this.queryData.timeList[1]:'';shipStartTime='';shipEndTime='' ;break;
                }
                let params = {
                    outNo: this.queryData.outNo,
                    warehouseNo: this.queryData.warehouseNo,
                    orderNo: this.queryData.orderNo,
                    bizType: this.queryData.bizType,
                    queryType: this.queryData.timeChose,
                    outStatus: this.queryData.outStatus,
                    syncStatus: this.queryData.syncStatus,
                    crossOutNo: this.queryData.crossOutNo,
                    logiOutNo: this.queryData.logiOutNo,
                    outType: this.queryData.outType,
                    productType: this.queryData.productType,
                    errorType: this.queryData.errorType,
                    skuCode: this.queryData.skuCode,
                    createStartTime: createStartTime===''?'':moment(createStartTime).valueOf().toString(),
                    createEndTime:createEndTime===''?'':moment(createEndTime).valueOf().toString(),
                    inventoryMatchStartTime:inventoryMatchStartTime===''?'':moment(inventoryMatchStartTime).valueOf().toString(),
                    inventoryMatchEndTime:inventoryMatchEndTime===''?'':moment(inventoryMatchEndTime).valueOf().toString(),
                    syncStartTime:syncStartTime===''?'':moment(syncStartTime).valueOf().toString(),
                    syncEndTime:syncEndTime===''?'':moment(syncEndTime).valueOf().toString(),
                    cancelStartTime:cancelStartTime===''?'':moment(cancelStartTime).valueOf().toString(),
                    cancelEndTime:cancelEndTime===''?'':moment(cancelEndTime).valueOf().toString(),
                    shipStartTime:shipStartTime===''?'':moment(shipStartTime).valueOf().toString(),
                    shipEndTime:shipEndTime===''?'':moment(shipEndTime).valueOf().toString(),
                    page: this.queryData.page
                }
                ExportList(this.filterData(params)).then(res=>{
                    if (res.ret.errcode === 1) {
                        this.$message('请在任务列表中查看导出的出库单！')
                    }
                })
            },
            detailCancle () {
                this.outBoundDetailDialog = false
            },
            cancelLoanDialog(){
                this.dialogFormVisible = false
            },
            updateLoanDialog(data){
                var params={
                    logiNo:data.logiNo,
                    outNo:data.outNo,
                    jobNo:data.jobNo
                }
                EditOutNoFreight(params).then(response=>{
                    if(response.ret.errcode==1){
                        this.$message.success('货代工作号更新成功')
                        this.dialogFormVisible = false
                        this.getScokOutOrderList()
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            loanWorkUpdate(row){
                 this.dialogFormVisible = true
                this.editLoanForm.jobNo = row.jobNo
                this.editLoanForm.outNo = row.outNo
                this.editLoanForm.logiNo = row.logiCode
            },
            //取消出库
            cancelSockOut (val) {
                this.cancelSockOutNo = val.outNo
                this.cancelSockOutDailog = true
            },
            cancelDailog () {
                this.cancelSockOutDailog = false
            },
            confirmDialog () {
                this.cancelSockOutDailog = false
                this.getScokOutOrderList()
            },
            showCod (payAmount,payCurrency) {
                if (payAmount === '' ||  payAmount === '0.00'){
                    return '-'
                }else {
                    if (payCurrency === ''){
                        return payAmount
                    }else {
                        return payAmount + payCurrency
                    }
                }
            },
            clickToCancelChange () {
                this.changewarehouse.warehouseNo = '',
                this.changewarehouse.outNo = '',
                this.changewarehouse.warehouseNoNew = '',
                this.changewarehouse.show = false
            },
            clickToCancelWithdraw () {
                this.withdraw.outNo = ''
                this.withdraw.show = false
            },
            /**
             * 异常调仓显示及新仓列表调用
             */
            adjustmentShow (data) {
                console.log(data)
                this.changewarehouse.show = true
                this.changewarehouse.warehouseNo = data.warehouseNo
                this.changewarehouse.outNo = data.outNo
                console.log(this.changewarehouse)
                let params = {
                    outNo: data.outNo
                }
                GetTransferWarehouse(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.warehouseListNew = res.warehouse
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            /**
             * 拆单撤回
             */
            confirmWithdraw () {
                this.loading = true
                let params = {
                    outNo: this.withdraw.outNo
                }
                RevokeSpiltOutOrder(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.search()
                        this.loading = false
                        this.$message.success('撤回成功')
                        this.withdraw.show = false
                        this.clickToCancelWithdraw()
                    } else {
                        this.loading = false
                        this.$message.error(res.ret.msg)
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            /**
             * 异常调仓
             */
            adjustment () {
                this.loading = true
                if (this.changewarehouse.bizType === '') {
                    this.$message.error('请选择业务类型！')
                    return
                }
                let params = {
                    outNo: this.changewarehouse.outNo,
                    warehouseNo: this.changewarehouse.warehouseNoNew,
                    bizType: this.changewarehouse.bizType
                }
                TransferOutOrder(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.search()
                        this.loading = false
                        this.$message.success('调仓成功')
                        this.changewarehouse.show = false
                        this.clickToCancelChange()
                    } else {
                        this.loading = false
                        this.$message.error(res.ret.msg)
                    }
                }).catch(err => {
                    this.loading = false
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
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getScokOutOrderList()
            },
            handleCurrentChanges (val) {
                this.queryData.page.pageNum = val
                this.getScokOutOrderList()
            },
            // 获取国家名称
            getCountryListName (item) {
                let data = this.countryList.find((val) => {
                    return val.shortCode == item
                })
                return data ? data.nameCn : item
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
            getScokOutOrderList () {
                console.log(this.queryData.timeList)
                let createStartTime,createEndTime,inventoryMatchStartTime,inventoryMatchEndTime,syncStartTime,syncEndTime,cancelStartTime,cancelEndTime,shipStartTime,shipEndTime
                switch(this.queryData.timeChose){
                    case 1:createStartTime =  this.queryData.timeList?this.queryData.timeList[0]:'';createEndTime = this.queryData.timeList?this.queryData.timeList[1]:'';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime='';syncEndTime='';cancelStartTime='';cancelEndTime='';shipStartTime='';shipEndTime='';break;
                    case 4:createStartTime =  '';createEndTime = '';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime='';syncEndTime='';cancelStartTime='';cancelEndTime='';shipStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';shipEndTime=this.queryData.timeList?this.queryData.timeList[1]:'';break;
                    case 5:createStartTime =  '';createEndTime = '';inventoryMatchStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';inventoryMatchEndTime=this.queryData.timeList?this.queryData.timeList[1]:'',syncStartTime='';syncEndTime='';cancelStartTime='';cancelEndTime='';shipStartTime='';shipEndTime='' ;break;
                    case 6:createStartTime =  '';createEndTime = '';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';syncEndTime=this.queryData.timeList?this.queryData.timeList[1]:'';cancelStartTime='';cancelEndTime='';shipStartTime='';shipEndTime='' ;break;
                    case 7:createStartTime =  '';createEndTime = '';inventoryMatchStartTime='';inventoryMatchEndTime='',syncStartTime='';syncEndTime='';cancelStartTime=this.queryData.timeList?this.queryData.timeList[0]:'';cancelEndTime=this.queryData.timeList?this.queryData.timeList[1]:'';shipStartTime='';shipEndTime='' ;break;
                }
                let params = {
                    outNo: this.queryData.outNo,
                    warehouseNo: this.queryData.warehouseNo,
                    orderNo: this.queryData.orderNo,
                    bizType: this.queryData.bizType,
                    queryType: this.queryData.timeChose,
                    outStatus: this.queryData.outStatus,
                    syncStatus: this.queryData.syncStatus,
                    crossOutNo: this.queryData.crossOutNo,
                    logiOutNo: this.queryData.logiOutNo,
                    outType: this.queryData.outType,
                    productType: this.queryData.productType,
                    errorType: this.queryData.errorType,
                    skuCode: this.queryData.skuCode,
                    createStartTime: createStartTime===''?'':moment(createStartTime).valueOf().toString(),
                    createEndTime:createEndTime===''?'':moment(createEndTime).valueOf().toString(),
                    inventoryMatchStartTime:inventoryMatchStartTime===''?'':moment(inventoryMatchStartTime).valueOf().toString(),
                    inventoryMatchEndTime:inventoryMatchEndTime===''?'':moment(inventoryMatchEndTime).valueOf().toString(),
                    syncStartTime:syncStartTime===''?'':moment(syncStartTime).valueOf().toString(),
                    syncEndTime:syncEndTime===''?'':moment(syncEndTime).valueOf().toString(),
                    cancelStartTime:cancelStartTime===''?'':moment(cancelStartTime).valueOf().toString(),
                    cancelEndTime:cancelEndTime===''?'':moment(cancelEndTime).valueOf().toString(),
                    shipStartTime:shipStartTime===''?'':moment(shipStartTime).valueOf().toString(),
                    shipEndTime:shipEndTime===''?'':moment(shipEndTime).valueOf().toString(),
                    page: this.queryData.page
                }
                OutOrderNewPage(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.orderList = res.list
                        this.totals = res.total
                    }
                })
            },
            cancleSockOut (row) {
                this.$confirm('是否取消', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.cannelOutOrderRequest(row)
                }).catch((err) => {
                    console.log(err)
                })
            },
            syncSockOut (row) {
                this.$confirm('是否同步', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.syncSockOutRequest(row)
                }).catch((err) => {
                    console.log(err)
                })
            },
            cannelOutOrderRequest (data) {
                let params = {
                    outNo: data.outNo,
                    cannelReason: ''
                }
                cannelOutOrder(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('取消操作成功！')
                        this.getScokOutOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            syncSockOutRequest (data) {
                let params = {
                    outNo: data.outNo
                }
                repushOutOrder(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('同步操作成功！')
                        this.getScokOutOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getScokOutOrderList()
            },
            // 重置
            resetSearch () {
                Object.assign(this.queryData, {
                    bizType: null,
                    crossOutNo: '',
                    logiOutNo: '',
                    productType: '',
                    timeChose: 1,
                    orderNo: '',
                    warehouseNo: '',
                    outNo: '',
                    outType: '',
                    errorType: '',
                    outStatus: null,
                    syncStatus: null,
                    startTime: '',
                    endTiem: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                })
                console.log(this.queryData)
                // this.$refs.sockOutOrderFilter.resetFields()
                // this.queryData.page.pageNum = 1
                // this.queryData.page.pageSize = 10
                this.getScokOutOrderList()
            },
            // 新增
            addSockOut (data, type) {
                this.type = type
                this.dialogTitle = '新增出库单'
                this.sockOutDialogVisible = true
            },
            // 拆单
            demolitionOrder (data, type) {
                this.dialogTitle = '拆单页'
                this.type = type
                this.oldOutNo = data.outNo
                this.sockOutDialogVisible = true
            },
            // 补发
            replacement (data, type) {
                console.log(data)
                this.dialogTitle = '补发页'
                this.countryCode = data.countryCode
                this.type = type
                this.oldOutNo = data.outNo
                this.supplementDialogVisible = true
            },
            // 换货
            exchangeGoods (data, type) {
                this.dialogTitle = '换货页'
                this.type = type
                this.countryCode = data.countryCode
                this.oldOutNo = data.outNo
                this.supplementDialogVisible = true
            },
            // 补发编辑
            replacementEdit (data, type) {
                console.log(data)
                this.countryCode = data.countryCode
                this.dialogTitle = '补发编辑页'
                this.type = type
                this.oldOutNo = data.outNo
                this.supplementDialogVisible = true
            },
            // 换货编辑
            exchangeGoodsEdit (data, type) {
                this.dialogTitle = '换货编辑页'
                this.type = type
                this.oldOutNo = data.outNo
                this.countryCode = data.countryCode
                this.supplementDialogVisible = true
            },
            saveAddress () {
                this.$message.success('保存成功')
            },
            handleCancleSockOut () {
                this.sockOutDialogVisible = false
                this.supplementDialogVisible = false
            },
            // 新增、拆单接口
            handleConfirmSockOut (data) {
                if (data.type == '2') {
                    let params = data
                    SpiltOutOrder(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('拆单成功')
                            this.sockOutDialogVisible = false
                            this.getScokOutOrderList()
                        } else {
                            this.$message.error(res.ret.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else if (data.type == '1') {
                    let params = data
                    console.log(data)
                    createOutOrder(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('新增出库单成功')
                            this.sockOutDialogVisible = false
                            this.getScokOutOrderList()
                        } else {
                            this.$message.error(res.ret.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            // 补发、换货接口
            handleConfirmSupplement (data) {
                if (data.type == '3') {
                    let params = data
                    ReissueOutOrder(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.$message.success('补发成功')
                            this.supplementDialogVisible = false
                            this.getScokOutOrderList()
                        } else {
                            this.$message.error(res.ret.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else if (data.type == '4') {
                    let params = data
                    BarterOutOrder(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.$message.success('换货成功')
                            this.supplementDialogVisible = false
                            this.getScokOutOrderList()
                        } else {
                            this.$message.error(res.ret.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else if (data.type == '5' || data.type == '6') {
                    let params = data
                    EditOutOrder(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('操作成功')
                            this.supplementDialogVisible = false
                            this.getScokOutOrderList()
                        } else {
                            this.$message.error(res.ret.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        }
    }
</script>
<style lang="scss">
    .split-order-list-wrapper {
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
    .operate-container{
        margin-bottom: 10px;
    }
    .error-message{
        color: red;
    }
    .order-id{
        color: #4f91d8;
        cursor: pointer;
    }
    .time-message{
        text-align: left;
    }
</style>
