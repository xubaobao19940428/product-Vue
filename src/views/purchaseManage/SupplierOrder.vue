<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleTabChange" type="card">
            <el-tab-pane label="待发货" name="PURCHASED"></el-tab-pane>
            <el-tab-pane label="缺货" name="STOCKOUT"></el-tab-pane>
            <el-tab-pane label="已发货" name="SHIP"></el-tab-pane>
        </el-tabs>
        <div class="filter-container">
            <el-form ref="supplierOrderFilterForm" inline label-width="110px" :model="queryData">
                <el-form-item prop="purchaseOrderNo" label="采购单号：">
                    <el-input v-model="queryData.purchaseOrderNo" clearable placeholder="请输入采购单号" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <el-form-item prop="skuCode" label="skuCode：">
                    <el-input  v-model="queryData.skuCode" placeholder="请输入skuCode" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <el-form-item prop="supplierOrderNo" label="供应商订单号：">
                    <el-input v-model="queryData.supplierOrderNo" clearable placeholder="请输入供应商订单号" size="medium" @keyup.enter.native="search()" ></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item prop="logiCode" label="物流单号：" v-if="queryData.supplierOrderStatus=='SHIP'">
                        <el-input v-model="queryData.logiCode" clearable placeholder="请输入物流单号" size="medium" ></el-input>
                    </el-form-item>
                    <el-form-item prop="supplierId" label="供应商：" v-if="hasPermission('BTN_SUPPLIER_ID')">
                        <el-select v-model="queryData.supplierId"  :remote-method="getSupplierList" filterable clearable remote reserve-keyword placeholder="请输入供应商" @change="search">
                            <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="warehouseNo" label="收货仓库：">
                        <el-select v-model="queryData.warehouseNo" clearable size="medium" placeholder="请选择仓库" @change="search">
                            <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="timeList" label="订单时间：">
                        <el-date-picker v-model="queryData.timeList"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            size="medium"
                            clearable
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button v-if="queryData.supplierOrderStatus=='PURCHASED' && hasPermission('BTN_SUPPLIER_MORESTOCKOUT')" icon="el-icon-receiving" type="primary" size="medium"  @click="showshipmore">批量发货</el-button>
                    <el-button v-if="hasPermission('BTN_ORDER_BATCH_EXPORT')" :loading="exportLoading" icon="el-icon-download"  type="primary" size="medium" @click="clickToExportOrder">订单批量导出</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table v-loading="loading" :data="orderList"  border height="100%" row-key="itemKey" current-row-key="itemKey" @selection-change="handleSelectionChange">
                <el-table-column key="1" type="selection" width="40">
                </el-table-column>
                <el-table-column key="2" label="供应商订单号" width="200px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.supplierOrderNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="3" label="采购单号" width="200px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.purchaseOrderNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="4" label="物流信息" v-if="queryData.supplierOrderStatus=='SHIP'" min-width="280px">
                    <template slot-scope="scope">
                        <div v-for="(item, index) in scope.row.logi" :key="index">
                            <div class="block-right flex1">
                                <div>{{getCompanyName(item.logiCompany || '-')}}：{{item.logiCode}}</div>
                                <div>发货数量：{{item.count}}</div>
                                <div v-if="scope.row.logi.length==1"></div>
                                <hr v-else>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column key="5" label="收货仓库" align="center"  min-width="100px" prop="warehouseName">
                </el-table-column>
                <template v-if="queryData.supplierOrderStatus==='PURCHASED'">
                    <el-table-column key="6" label="剩余发货时间" min-width="180px" align="center">
                        <template slot-scope="scope">
                            <div :class="judgeTime(scope.row.shipWarningTime)">
                                {{ scope.row.shipWarningTime}}
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column key="7" label="skuCode" width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.skuCode}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="8" prop="cover" label="商品信息" align="center" min-width="260px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.skuCover)" class="image-box" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.nameCn" placement="top">
                                <span class="block-right"
                                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.nameCn}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column key="9" label="供应商货号" min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.supplierCode || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="10" label="商品sku规格" min-width="140px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.standardAttr}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="11" label="商品条形码" width="160px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.qrCode || '-'}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="12" label="商品链接" width="180px" align="center">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.orgLink" class="item" effect="dark" :content="scope.row.orgLink" placement="top">
                            <a :href="scope.row.orgLink" target="_blank" style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:150px;">{{ scope.row.orgLink}}</a>
                        </el-tooltip>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column key="13" label="采购单价" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div> {{ scope.row.purchasePrice }}</div>
                    </template>
                </el-table-column>
                <el-table-column key="14" label="采购金额" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div> {{scope.row.totalPrice }}</div>
                    </template>
                </el-table-column>
                <el-table-column key="15" label="采购数量" min-width="100px" align="center" v-if="queryData.supplierOrderStatus != 'STOCKOUT'">
                    <template slot-scope="scope">
                        <div> {{ scope.row.purchaseCount}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="22" label="发货数量" min-width="100px" align="center" v-if="queryData.supplierOrderStatus != 'STOCKOUT'">
                    <template slot-scope="scope">
                        <div> {{ scope.row.shipCount}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="23" label="缺货数量" min-width="100px" align="center" v-if="queryData.supplierOrderStatus != 'SHIP'">
                    <template slot-scope="scope">
                        <div> {{ scope.row.stockoutCount}}</div>
                    </template>
                </el-table-column>
                <template v-if="queryData.supplierOrderStatus==='SHIP'">
                    <el-table-column key="16" label="实际总发货数量" min-width="150px" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.shipCount}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column key="17" label="发货日期" min-width="160px" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.shipTime | secondTimeFormat}}</div>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column key="18" label="状态" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.supplierOrderStatus === 'PURCHASED'" type="warning" size="mini">待发货</el-tag>
                        <el-tag v-if="scope.row.supplierOrderStatus === 'STOCKOUT'" type="danger" size="mini">缺货</el-tag>
                        <el-tag v-if="scope.row.supplierOrderStatus === 'SHIP'" type="success" size="mini">已发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column key="19" label="供应商" min-width="130px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.supplierName}}</div>
                    </template>
                </el-table-column>
                <el-table-column key="20" label="创建日期" min-width="160px" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.createTime | secondTimeFormat }}</div>
                    </template>
                </el-table-column>
                <el-table-column key="21" v-if="queryData.supplierOrderStatus=='PURCHASED'"
                    fixed="right" label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.supplierOrderStatus == 'PURCHASED'">
                            <el-button type="text" size="mini" v-if="hasPermission('BTN_SUPPLIER_SHIP')" @click="showship(scope.row)">发货
                            </el-button>
                        </span>
                        <span style="margin-left:10px" v-if="scope.row.supplierOrderStatus == 'PURCHASED'">
                            <el-button type="text" size="mini" v-if="hasPermission('BTN_SUPPLIER_STOCKOUT')" @click="clickToSupplierStockout(scope.row)">缺货
                            </el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                :page-sizes="[10,20, 30, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="发货信息" width="900px" :visible.sync="ship.show" @close="ship.show = false">
            <el-button class="button-sync-tag mar-t-20" v-if="this.ship.isSyncNow == true" size="mini" type="primary" @click="SyncNow()">一键同步
            </el-button>
            <el-form label-position="left" label-width="90px" :model="ship.param" ref="ship" style="margin-left:10px">
                <el-form-item label="物流信息：">
                    <div class="logistics-info-wrapper">
                        <div style="width: 500px">订单号：{{ ship.param.supplierOrderNo }}</div>
                        <div v-for="(item, i) in ship.logi" class="mar-b-10 logistics-info-item" :key="i">
                            <div class="flex">
                                <el-select v-model="item.logiCompany" style="margin-left: 10px" filterable placeholder="物流公司" size="medium">
                                    <el-option v-for="item in logisticsCompany" :key="item.id" :label="item.companyName" :value="item.logiCompany"></el-option>
                                </el-select>
                                <el-input v-model="item.logiCode" style="width: 24%; margin-left: 10px" placeholder="请输入物流单号" size="medium"></el-input>
                                <el-input v-model="item.count" style="width: 23%; margin-left: 10px" placeholder="输入发货数量" size="medium"></el-input>
                                <div>
                                    <i class="el-icon-circle-close" style="margin-left: 10px" @click="deleteDeliver(i)"> </i>
                                </div>
                                <div>
                                    <el-button type="text" size="mini" style="margin-left: 10px" @click="addMag(item)">物流拆分
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ship.show = false" size="small">取 消</el-button>
                <el-button type="primary" @click="clickToSupplierShip()" size="small" v-loading="loading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量发货信息" width="1150px" :visible.sync="ship.showMore" @close="ship.showMore = false">
            <el-button class="button-sync-tag mar-t-20" v-if="this.ship.isSyncNow == true" size="mini" type="primary"  @click="SyncNowMore()">一键同步物流公司及物流单号
            </el-button>
            <el-form ref="ship" label-position="left" label-width="90px" :model="ship.param"  style="margin-left:10px">
                <el-form-item>
                    <div class="logistics-info-wrapper">
                        <div v-for="(item, i) in ships"  class="mar-b-10 logistics-info-item" :key="i+item.supplierOrderNo">
                            <div class="flex" style="margin-left: -86px;">
                                <div style="width: 230px">订单号：{{item.supplierOrderNo}}</div>
                                <div>
                                    <div v-for="(skuItem, j) in item.logi" :key="j+skuItem">
                                        <div class="flex align-center">
                                            <el-select v-model="skuItem.logisticsType" placeholder="物流类型" class="mar-l-10 " filterable size="medium">
                                                <el-option v-for="(val, key) in logisticsType" :key="key" :label="val" :value="key">
                                                </el-option>
                                            </el-select>
                                            <el-select v-if="skuItem.logisticsType == 'DOMESTIC'"
                                                       v-model="skuItem.logiCompany"
                                                       style="margin-left: 10px"
                                                       placeholder="物流公司"
                                                       size="medium"
                                                       filterable
                                                       clearable>
                                                <el-option v-for="val in logiCompany" :key="val.code" :label="val.name" :value="val.code">
                                                </el-option>
                                            </el-select>
                                            <el-input v-else
                                                      v-model="skuItem.logiCompany"
                                                      style="width: 23%; margin-left: 10px"
                                                      placeholder="输入物流公司"
                                                      size="medium"></el-input>
                                            <el-input v-model="skuItem.logiCode"
                                                      style="width: 24%; margin-left: 10px"
                                                      placeholder="请输入物流单号"
                                                      @blur="validateJyh(skuItem.logiCode)"
                                                      size="medium"></el-input>
                                            <el-input v-model="skuItem.count"
                                                      style="width: 23%;"
                                                      class="mar-l-10 "
                                                      @blur="checkLogistics(skuItem.count)"
                                                      placeholder="输入发货数量"
                                                      size="medium"></el-input>
                                            <i class="el-icon-circle-close"
                                               style="margin: 0 10px 0 10px "
                                               @click="deleteDeliverSku(item,i,j)">
                                            </i>
                                            <div>
                                                <el-button type="text" @click="addSkuMag(item)" size="mini">物流拆分</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ship.showMore = false" size="small">取 消 </el-button>
                <el-button type="primary" @click="clickToSupplierShipMore()" size="small" v-loading="loading">确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="一键创建入库单"
                   :visible.sync="oneKeySync.show"
                   width="500px"
                   style="margin-top: 300px"
                   @close="oneKeySync.show = false">
            <div>批量创建入库单后,物流单号将推送至第三方仓库系统,无法修改!</div>
            <div>建议每天录入工作完成之后发送!</div>
            <div>是否继续批量创建入库单?</div>
            <div slot="footer" class="dialog-footer">
                <div slot="footer" class="dialog-footer">
                    <el-button @click="oneKeySync.show=false" size="small">取 消</el-button>
                    <el-button type="primary" @click="clickToPutCheck" size="small">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { supplierOrderPage, orderDeliver, orderStockout, supplierBasePage, exportOrder } from '@/request/supplier'
    import { warehousePage } from '@/request/warehouse'
    import { getLogiCompanyList } from '@/request/logi'
    import logiCompany from '@/data/company.js'
    import table from '@/components/Table'
    import imagePreview from '@/components/imagePreview'
    export default {
        name: 'orderList',
        components: {
            'table-list': table,
            imagePreview
        },
        extends: {},
        props: {},
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                logiCompany: logiCompany,
                activeName: 'PURCHASED',
                loading: false,
                queryData: {
                    supplierOrderNo: '', // 供应商订单号
                    purchaseOrderNo: '', // 采购单号
                    supplierId: '', // 供应商ID
                    skuCode: '',
                    logiCode: '', // 物流单号
                    warehouseNo: '',
                    supplierOrderStatus: 'PURCHASED', // 订单状态,SHIP-已发货|STOCKOUT-缺货|PURCHASED-待发货
                    timeList: [],
                    startTime: '',
                    endTime: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                pagingSwitch: true,
                total: 0,
                showSearchParam: false,
                selection: [],
                supplierId: [],
                supplierList: [],
                oneKeySync: {
                    show: false
                },
                warehouseList: [],
                logisticsType: {
                    'DOMESTIC': '国内',
                    'INTERNATIONAL': '国际',
                    'LOCAL': '当地'
                },
                ships: [],
                ship: {
                    showMore: false,
                    isSyncNow: false,
                    logi: [],
                    shipList: [],
                    List: [],
                    show: false,
                    logisticsType: {
                        'DOMESTIC': '国内',
                        'INTERNATIONAL': '国际',
                        'LOCAL': '当地'
                    },
                    param: {
                        supplierOrderNo: ''
                    }
                },
                orderList: [],
                param: {
                    purchaseOrderNo: '',
                    supplierOrderNo: '',
                    productCount: '',
                    supplierId: [],
                    purchaseOrderProductSelectParam: '',
                    orderSwitch: '',
                    supplierOrderStatus: 'PURCHASED'
                },
                statusList: {
                    'SHIP': '已发货',
                    'STOCKOUT': '缺货',
                    'PURCHASED': '待发货'
                },
                orderDetail: {},
                saleOrderDialogVisible: false,
                timeList: [],
                exportLoading: false,
                logisticsCompany: []
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
            this.getWarehouseList()
        },
        mounted () {
            this.getSupplierOrderList()
            this.getLogisticsCompany()
        },
        methods: {
            // 获取物流公司
            getLogisticsCompany () {
                // TODO 分页
                getLogiCompanyList({
                    type: 2,
                    cooperateStatus: 1,
                    page: {
                        pageNum: 1,
                        pageSize: 100,
                        pagingSwitch: false
                    }
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.logisticsCompany = res.logiCompany
                    }
                })
            },
            // 获取物流公司名称
            getCompanyName (item) {
                let data = this.logisticsCompany.find((val) => {
                    return val.logiCompany == item
                })
                return data ? data.companyName : item
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
            handleTabChange (tab) {
                this.queryData.supplierOrderStatus = tab.name
                this.getSupplierOrderList()
            },
            /**
             * 获取供应商订单
            */
            getSupplierOrderList () {
                this.loading = true
                let params = this.queryData
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                supplierOrderPage(params).then((res) => {
                    this.loading = false
                    this.orderList = []
                    if (res.ret.errcode === 1) {
                        this.total = res.total
                        this.orderList = res.list
                        for (let i = 0; i < this.orderList.length; i++) {
                            Object.assign(this.orderList[i], {
                                itemKey: i
                            })
                        }
                    } else {
                        (
                            this.$message.error(res.message)
                        )
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            // 分页
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getSupplierOrderList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getSupplierOrderList()
            },
            resetSearch () {
                this.$refs.supplierOrderFilterForm.resetFields()
                this.getSupplierOrderList()
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
                })
            },
            // 限制输入格式
            checkLogistics (data) {
                if (data == '') {
                    this.$alert('输入不可为空')
                }
            },
            // 物流单号格式判断
            validateJyh (glhm) {
                var reg = /^[A-Za-z0-9]{1,30}$/
                if (!reg.test(glhm)) {
                    this.$alert('请输入字母或数字组成的物流单号,不能有空格')
                    // this.form.glhm = '';
                }
            },
            // 判断时间趋势
            judgeTime (time) {
                if (time.indexOf('超时') < 0) {
                    return 'security'
                } else {
                    return 'warning'
                }
            },
            // 秒数转换时分秒
            formatSeconds (value) {
                var secondTime = parseInt(value) // 秒
                var minuteTime = 0 // 分
                var hourTime = 0 // 小时
                if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
                    // 获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt(secondTime / 60)
                    // 获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt(secondTime % 60)
                    // 如果分钟大于60，将分钟转换成小时
                    if (minuteTime > 60) {
                        // 获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt(minuteTime / 60)
                        // 获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt(minuteTime % 60)
                    }
                }
                var result = '' + parseInt(secondTime) + '秒'

                if (minuteTime > 0) {
                    result = '' + parseInt(minuteTime) + '分' + result
                }
                if (hourTime > 0) {
                    result = '' + parseInt(hourTime) + '小时' + result
                }
                return result
            },
            search () {
                this.getSupplierOrderList()
            },
            setCompanyInfo (item, i) {
                let data = this.logiCompany.find((val) => {
                    return val.code == item.logiCompany
                })
                Object.assign(this.deliverAlert.logisticsSingle[i], {
                    logiCompanyCn: data.name
                })
            },
            // 新增一条物流单号记录
            addMag (item) {
                this.ship.logi.push({
                    logisticsType: 'DOMESTIC',
                    logiCompany: '',
                    logiCode: '',
                    count: null
                })
            },
            // 删除一条发货信息
            deleteDeliver (i) {
                this.ship.logi.splice(i, 1)
            },
            // 单个发货接口触发
            clickToSupplierShip () {
                if (this.ship.logi == '') {
                    this.$alert('未填写发货信息,不可发货')
                } else {
                    this.loading = true
                    this.ship.List = []
                    this.ship.List.push({
                        logi: this.ship.logi,
                        supplierOrderNo: this.ship.param.supplierOrderNo
                    })
                    let params = {}
                    params.deliver = this.ship.List
                    orderDeliver(this.filterData(params)).then((res) => {
                        this.loading = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('发货成功！')
                            this.ship.show = false
                            this.getSupplierOrderList()
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch((err) => {
                        this.loading = false
                        console.log(err)
                    })
                }
            },
            // 批量发货接口触发
            clickToSupplierShipMore () {
                for (let i = 0; i < this.ships.length; i++) {
                    for (let j = 0; j < this.ships[i].logi.length; j++) {
                        if (this.ships[i].logi[j] == 0) {
                            return this.$message.warning('信息不能为空')
                        }
                    }
                }
                if (this.ships == '') {
                    this.$alert('未填写发货信息,不可发货')
                } else {
                    this.loading = true
                    let params = {}
                    params.deliver = this.ships
                    orderDeliver(this.filterData(params)).then((res) => {
                        this.loading = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('发货成功！')
                            this.ship.showMore = false
                            this.getSupplierOrderList()
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch((err) => {
                        this.loading = false
                        console.log(err)
                    })
                }
            },
            // 批量选择
            handleSelectionChange (val) {
                this.selection = val
            },
            // 显示多选发货信息弹窗
            showshipmore () {
                if (this.selection.length == 0) {
                    return this.$message.warning('请选择发货订单')
                } else {
                    var val = this.selection
                    this.ship.isSyncNow = true
                    this.ships = []
                    for (let i = 0; i < val.length; i++) {
                        this.ships.push({
                            supplierOrderNo: val[i].supplierOrderNo,
                            logi: [{
                                logisticsType: 'DOMESTIC',
                                logiCompany: '',
                                logiCode: '',
                                count: val[i].purchaseCount - val[i].stockoutCount - val[i].shipCount
                            }]
                        })
                    }
                    console.log(this.ships)
                    this.ship.showMore = true
                }
            },
            // 新增一条物流单号记录
            addSkuMag (skuItem) {
                skuItem.logi.push({
                    logisticsType: 'DOMESTIC',
                    logiCompany: '',
                    logiCode: '',
                    count: 0
                })
            },
            // 删除一条Sku发货信息
            deleteDeliverSku (skuItem, i, j) {
                skuItem.logi.splice(j, 1)
                if (skuItem.logi == '') {
                    this.ships.splice(i, 1)
                }
            },
            // 缺货
            clickToSupplierStockout ({
                supplierOrderNo
            }) {
                this.$confirm('确认缺货?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.handlerOrderStockout(supplierOrderNo)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消点击缺货'
                    })
                })
            },
            handlerOrderStockout (data) {
                let params = {
                    supplierOrderNo: data
                }
                orderStockout(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('缺货操作成功！')
                        this.getSupplierOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            // 显示发货信息弹窗
            showship (data) {
                this.ship.isSyncNow = true
                let item = JSON.parse(JSON.stringify(data))
                this.ship.logi = []
                this.ship.param.supplierOrderNo = item.supplierOrderNo
                this.ship.logi.push({
                    logisticsType: 'DOMESTIC',
                    logiCompany: '',
                    logiCode: '',
                    count: data.purchaseCount - data.stockoutCount - data.shipCount
                })
                this.ship.show = true
            },
            // 复制到所有商品
            SyncNow () {
                if (this.ship.logi[0].logiCode) {
                    for (let j = 0; j < this.ship.logi.length; j++) {
                        var subData = this.ship.logi[j]
                        subData.logiCode = this.ship.logi[0].logiCode
                        subData.logiCompany = this.ship.logi[0].logiCompany
                    }
                }
            },
            // 复制到所有商品
            SyncNowMore () {
                if (this.ships[0].logi[0].logiCode) {
                    for (let i = 0; i < this.ships.length; i++) {
                        for (let j = 0; j < this.ships[i].logi.length; j++) {
                            var subData = this.ships[i].logi[j]
                            subData.logiCode = this.ships[0].logi[0].logiCode
                            subData.logiCompany = this.ships[0].logi[0].logiCompany
                        }
                    }
                }
            },
            clickToPutCheckShow () {
                this.oneKeySync.show = true
            },
            // 一键创建入库单
            clickToPutCheck () {
                supplierOnekey().then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$alert(res.data)
                        this.getSupplierOrderList()
                    }
                })
                this.oneKeySync.show = false
            },
            // 导出数据
            clickToExportOrder () {
                this.exportLoading = true
                let params = this.queryData
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                exportOrder(params).then((res) => {
                    this.exportLoading = false
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.fileUrl
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        (
                            this.$message.error(res.message)
                        )
                    }
                }).catch((err) => {
                    this.exportLoading = false
                    console.log(err)
                })
            }
        }

    }
</script>
