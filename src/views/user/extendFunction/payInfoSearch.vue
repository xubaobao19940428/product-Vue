<template>
    <div class="app-container">
        <div slot="header" class="clearfix">
            <span>支付流水号查询对应的支付信息列表（限期七日之内）</span>
        </div>
        <div class="filter-container mar-t-20">
            <el-form label-width="100px" inline :model="queryModel" :rules="ruleValidate">
                <el-form-item label="流水号：" prop="statement">
                    <el-select v-model="queryModel.type" filterable clearable style="width: 160px" size="medium" placeholder="请选择类型">
                        <el-option v-for="(val, key) in payTypeList" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                    <el-input v-model="queryModel.serialNumber" style="width: 300px; margin-right: 20px;" size="medium"  placeholder="请输入支付流水号" clearable></el-input>
                </el-form-item>
                <el-form-item label="支付方式：">
                    <el-select v-model="queryModel.payWay" filterable clearable style="width: 160px" size="medium" placeholder="请选择支付方式">
                        <el-option v-for="(val, key) in enumType.payWayInfo" :key="key" :label="val.name" :value="String(val.code)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付状态：">
                    <el-select v-model="queryModel.payStatus" filterable clearable style="width: 160px" size="medium" placeholder="请选择支付状态">
                        <el-option v-for="(val, key) in enumType.payStatusInfo" :key="key" :label="val.name" :value="String(val.code)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="query(1)" size="medium">查询</el-button>
                    <el-button type="text" size="meidum" @click="handleDownload" v-if="hasPermission('BTN_USER_PAY_INFO_COUNT')">审单统计</el-button>
                </el-form-item>
            </el-form>
            <p class="info-tips">支付业务编号：订单号 等，与支付相关的业务编号</p>
            <p class="info-tips">内部支付流水号： 我们系统内部生成，对应用户每发起一次支付，就生成一个支付流水号</p>
            <p class="info-tips">第三方支付流水号：我们使用的第三方支付平台的流水号，如 711 支付凭条上的 编号，积分支付，对应的是账户收支记录中的编号</p>
        </div>
        <el-table border :data="tableDataList" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" height="100%" v-loading="tableLoading">
            <el-table-column prop="bnsOrderNo" min-width="200px" align="center" label="订单号">
                <template slot-scope="scope">
                    <div class="pointer" @click="triggerToOderList(scope.row.bnsOrderNo)">{{ scope.row.bnsOrderNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="transOrderNo" min-width="200px" align="center" label="支付流水号">
            </el-table-column>
            <el-table-column prop="payWay" width="100px" align="center" label="支付方式">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.payWay === 1" size="mini">molpay</el-tag>
                    <el-tag v-else-if="scope.row.payWay === 2" size="mini" type="success">积分支付</el-tag>
                    <el-tag v-else-if="scope.row.payWay === 3" size="mini" type="warning">信用卡</el-tag>
                    <el-tag v-else-if="scope.row.payWay === 4" size="mini">omise</el-tag>
                    <el-tag v-else-if="scope.row.payWay === 5" size="mini">OnlineBanking</el-tag>
                    <el-tag v-else-if="scope.row.payWay === 6" size="mini">COD</el-tag>
                    <el-tag v-else-if="scope.row.payWay === 7" size="mini">组合支付</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="payStatus" width="100px" align="center" label="支付状态">
                <template slot-scope="scope">
                    <!-- <span> {{ getStatus(scope.row.payStatus) }} </span> -->
                    <span v-if="scope.row.payStatus === 0">成功</span>
                    <span v-else-if="scope.row.payStatus === 1">失败</span>
                    <span v-else-if="scope.row.payStatus === 2">支付中</span>
                    <span v-else-if="scope.row.payStatus === 3">待支付</span>
                    <span v-else-if="scope.row.payStatus === 4">退款成功</span>
                    <span v-else-if="scope.row.payStatus === 5">退款失败</span>
                    <span v-else-if="scope.row.payStatus === 7">退款中</span>
                    <span v-else-if="scope.row.payStatus === 8">退款处理</span>
                </template>
            </el-table-column>
            <el-table-column prop="countryCode" align="center" label="国家">
            </el-table-column>
            <el-table-column prop="txnId" align="center" label="第三方支付流水号" width="160">
                <template slot-scope="scope">
                    {{scope.row.txnId || '-'}}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="金额" width="160">
                <template slot-scope="scope">
                    {{ getCurrencyUnit( scope.row.countryCode, 'currencyUnit') + ' ' + scope.row.amount }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="凭证" min-width="160">
                <template slot-scope="scope">
                    <el-popover placement="top-start" trigger="hover">
                        <img :src="dealShowFileSrc(scope.row.paymentVoucherPicture)" class="previewImage">
                        <img :src="dealShowFileSrc(scope.row.paymentVoucherPicture)" class="thumbnail" slot="reference">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
                <template slot-scope="scope">
                    {{scope.row.createTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" align="center" label="更新时间" width="160">
                <template slot-scope="scope">
                    {{scope.row.updateTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="备注信息" width="260">
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" min-width="180px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" v-if="hasPermission('BTN_USER_MEG_OPERATION_SEE_DETAIL')" @click="syncPayStatus(scope.row)" :loading="loading">同步</el-button>
                    <el-button type="text" size="mini"
                               v-if="hasPermission('BTN_USER_MEG_OPERATION_SYNC_PAY_RESULT') && scope.row.payWay == 5 && (scope.row.payStatus === 3 || scope.row.payStatus === 2)"
                               @click="showCheckDialog(scope.row)">手动触发支付成功</el-button>
                    <el-button type="text" size="mini"
                               v-if="hasPermission('BTN_USER_MEG_OPERATION_SYNC_PAY_RESULT') && scope.row.payWay == 5 && (scope.row.payStatus === 3 || scope.row.payStatus === 2)"
                               @click="showFailDialog(scope.row)">关闭</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="query"
                           :current-page="queryModel.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="queryModel.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <el-dialog title="填写提交信息" width="400px"
                   append-to-body
                   :visible="dialog.show"
                   @close="dialog.show = false">
            <div>
                <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                         :rules="dialog.rules"
                         :model="dialog.param">
                    <el-form-item label="支付凭证" prop="paymentVoucherPicture">
                        <c-upload :limit="1"
                                  :fileList="dialog.param.paymentVoucherPicture"
                                  v-if="dialog.show" @setData="setFileList"></c-upload>
                    </el-form-item>
                    <el-form-item label="银行列表">
                        <el-select v-model="dialog.param.bank" clearable filterable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in bankList"
                                       :key="index"
                                       :label="item.Name"
                                       :value="item.Code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="流水号" prop="serial">
                        <el-input v-model="dialog.param.serial" type="text"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialog.show = false">取 消</el-button>
                <el-button size="small" :loading="dialog.loading" type="primary" @click="changePayResult">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="填写备注信息" width="400px"
                   append-to-body
                   :visible="failDialog.show"
                   @close="failDialog.show = false">
            <div>
                <el-form ref="addDialog" label-position="right" label-suffix="："
                         :model="failDialog.param">
                    <el-form-item label="备注" prop="serial">
                        <el-input v-model="failDialog.param.remark" type="text"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="failDialog.show = false">取 消</el-button>
                <el-button size="small" :loading="failDialog.loading" type="primary" @click="confirmSetFail">确 定</el-button>
            </span>
        </el-dialog>
        <payment-check-dialog :dialogVisible="checkDialogVisible" :checkData="checkData" @on-cancle="handleCancleCheck" @on-confirm="handleConfirmCheck"></payment-check-dialog>
        <sum-download-dialog v-if="downloadDialog" :downloadDialog="downloadDialog" @close="downloadDialog = false"></sum-download-dialog>
    </div>
</template>

<script>
    import { searchPayInfo, synPayInfo, manualPaySuccess, payRelatedInfo, manualPayFail } from '@/request/polypay'
    import cUpload from '@/components/fileUpload/'
    import PaymentCheckDialog from './PaymentCheckDialog.vue'
    import sumDownloadDialog from './sumDownloadDialog'
    import _ from 'lodash'
    export default {
        data () {
            return {
                bankList: [
                    { 'Name': 'Siam Commercial Bank', 'Code': 'TH0001' },
                    { 'Name': 'Kasikornbank', 'Code': 'TH0002' },
                    // { 'Name': 'Bangkok Bank', 'Code': 'TH0003' },
                    { 'Name': 'Krung Thai Bank', 'Code': 'TH0004' },
                    { 'Name': 'Government Savings Bank', 'Code': 'TH0005' },
                    // { 'Name': 'Bank of Ayudhya (Krungsri)', 'Code': 'TH0006' },
                    // { 'Name': 'Thanachart Bank', 'Code': 'TH0007' },
                    { 'Name': 'TMB Bank', 'Code': 'TH0008' },
                    { 'Name': 'Kiatnakin Bank', 'Code': 'TH0009' },
                    { 'Name': 'CIMB (Thai) ', 'Code': 'TH0010' },
                    { 'Name': 'Standard Chartered Bank (Thai) ', 'Code': 'TH0011' },
                    { 'Name': 'United Overseas Bank (Thai)', 'Code': 'TH0012' },
                    { 'Name': 'TISCO Bank', 'Code': 'TH0013' },
                    { 'Name': 'Industrial and Commercial Bank of China (Thai)', 'Code': 'TH0014' },
                    { 'Name': 'Mega ICB Thailand branch ', 'Code': 'TH0015' },
                    { 'Name': 'Thai Credit Retail Bank', 'Code': 'TH0016' },
                    { 'Name': 'The Bank of Tokyo-Mitsubishi (Japan)', 'Code': 'TH0017' },
                    { 'Name': 'Citibank (US)', 'Code': 'TH0018' },
                    { 'Name': 'Sumitomo Mitsui (Japan)', 'Code': 'TH0019' },
                    { 'Name': 'Mizuho (Japan)', 'Code': 'TH0020' },
                    { 'Name': 'HSBC', 'Code': 'TH0021' },
                    { 'Name': 'ABN AMRO Bank N.V.', 'Code': 'TH0022' },
                    { 'Name': 'BNP Paribas', 'Code': 'TH0023' },
                    { 'Name': 'Deutsche Bank', 'Code': 'TH0024' },
                    { 'Name': 'Bank of China Ltd.', 'Code': 'TH0025' },
                    { 'Name': 'The Bank of Tokyo-Mitsubishi UFJ, Ltd.', 'Code': 'TH0026' },
                    { 'Name': 'Indian Overseas Bank', 'Code': 'TH0027' },
                    { 'Name': 'Mizuho Corporate Bank, Ltd.', 'Code': 'TH0028' },
                    { 'Name': 'Oversea-Chinese Banking Corporation', 'Code': 'TH0029' },
                    { 'Name': 'RHB Bank Berhad', 'Code': 'TH0030' },
                    { 'Name': 'Sumitomo Mitsui Banking Corporation', 'Code': 'TH0031' },
                    { 'Name': 'Foreign banks (North American)', 'Code': 'TH0032' },
                    { 'Name': 'Bank of America Merrill Lynch', 'Code': 'TH0033' },
                    { 'Name': 'Citibank Thailand', 'Code': 'TH0034' },
                    { 'Name': 'JP Morgan Chase', 'Code': 'TH0035' },
                    { 'Name': 'Scotiabank (Bank of Nova Scotia) - through subsidiary Thanachart Bank', 'Code': 'TH0036' },
                    { 'Name': 'BAAC Bank for Agriculture and Agricultural Cooperation', 'Code': 'TH0037' },
                    { 'Name': 'LH Bank', 'Code': 'TH0038' },
                    { 'Name': 'Airpay', 'Code': 'TH0039' },
                    { 'Name': 'Government Housing Bank(GH Bank)', 'Code': 'TH0040' }
                ],
                queryModel: {
                    type: null,
                    serialNumber: '',
                    payWay: null,
                    payStatus: null,
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                payTypeList: {
                    1: '支付业务编号',
                    2: '内部支付流水号',
                    3: '第三方支付流水号'
                },
                dialog: {
                    show: false,
                    loading: false,
                    param: {
                        bank: '',
                        serial: '',
                        txnId: '',
                        paymentVoucherPicture: ''
                    },
                    rules: {
                        serial: [{ required: true, message: '不能为空', trigger: 'change' }],
                        paymentVoucherPicture: [{ required: true, message: '不能为空', trigger: 'change' }],
                    }
                },
                failDialog: {
                    show: false,
                    loading: false,
                    param: {
                        remark: '',
                        bnsOrderNo: '',
                        transOrderNo: ''
                    }
                },
                enumType: {
                    payStatusInfo: [],
                    payWayInfo: []
                },
                tableDataList: [],
                paymentResult: {
                    param: {
                        orderNo: '',
                        status: ''
                    },
                    status: {
                        0: '待支付',
                        1: '待发货',
                        2: '待收货',
                        3: '交易成功',
                        4: '交易关闭',
                        5: '退款中',
                        6: '退款成功',
                        7: '退款失败',
                        8: '退款失败'
                    }
                },
                ruleValidate: {
                },
                totals: 0,
                loading: false,
                tableLoading: false,
                checkDialogVisible: false,
                checkData: {
                    amount: '',
                    paymentVoucherPicture: '',
                    serial: '',
                    bank: ''
                },
                downloadDialog: false
            }
        },
        created () {
            this.getEnum()
        },
        components: {
            cUpload,
            PaymentCheckDialog,
            sumDownloadDialog
        },
        methods: {
            handleSizeChange (value) {
                this.queryModel.page.pageSize = value
                this.getList(1)
            },
            query (page) {
                this.tableLoading = true
                this.queryModel.page.pageNum = page || this.queryModel.page.pageNum
                let params = JSON.parse(JSON.stringify(this.queryModel))
                if (this.queryModel.serialNumber && !this.queryModel.type) {
                    return this.$message.warning('请选择流水类型')
                }
                if (this.queryModel.type === '1') {
                    params.bnsOrderNo = this.queryModel.serialNumber
                    params.transOrderNo = ''
                    params.txnId = ''
                } else if (this.queryModel.type === '2') {
                    params.bnsOrderNo = ''
                    params.transOrderNo = this.queryModel.serialNumber
                    params.txnId = ''
                } else if (this.queryModel.type === '3') {
                    params.transOrderNo = ''
                    params.transOrderNo = ''
                    params.txnId = this.queryModel.serialNumber
                }
                searchPayInfo(this.filterData(params)).then(res => {
                    this.tableLoading = false
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableDataList = res.searchPayInfos
                        this.totals = res.total
                    }
                }).catch(err => {
                    this.tableLoading = false
                    console.log(err)
                })
            },
            getEnum () {
                payRelatedInfo({}).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.enumType = res
                    }
                })
            },
            handleDownload () {
                this.downloadDialog = true
            },
            setFileList (res) {
                this.dialog.param.paymentVoucherPicture = res.data
                this.$refs['addDialog'].validate()
            },
            showDialog (data) {
                Object.assign(this.dialog.param, {
                    bank: '',
                    serial: '',
                    txnId: '',
                    bnsOrderNo: data.bnsOrderNo,
                    transOrderNo: data.transOrderNo,
                    paymentVoucherPicture: data.paymentVoucherPicture
                })
                this.dialog.show = true
            },
            showCheckDialog(data) {
                console.log(data)
                this.checkData.countryCode = data.countryCode
                this.checkData.amount = data.amount
                this.checkData.paymentVoucherPicture = this.dealShowFileSrc(data.paymentVoucherPicture)
                this.checkData.bnsOrderNo = data.bnsOrderNo
                this.checkData.transOrderNo = data.transOrderNo
                this.checkData.bank = ''
                this.checkData.serial = ''
                console.log(this.checkData)
                this.checkDialogVisible = true
            },
            handleCancleCheck() {
                this.checkDialogVisible = false
            },
            handleConfirmCheck(data) {
                let params = {
                    bnsOrderNo: data.bnsOrderNo,
                    transOrderNo: data.transOrderNo,
                    paymentVoucherPicture: data.paymentVoucherPicture,
                    txnId: data.bank + '_' + data.serial
                }
                this.$confirm('是否确认更改支付结果为支付成功，一旦确认将不可以更改?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    manualPaySuccess(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('操作成功')
                        }
                        this.query()
                        this.checkDialogVisible = false
                    }).catch(err => {
                        this.checkDialogVisible = false
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            showFailDialog (data) {
                this.failDialog.param = {
                    remark: '',
                    bnsOrderNo: data.bnsOrderNo,
                    transOrderNo: data.transOrderNo
                }
                this.failDialog.show = true
            },
            confirmSetFail (data) {
                this.$confirm('是否确认更改支付结果为支付失败，一旦确认将不可以更改?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.failDialog.loading = true
                    manualPayFail(this.filterData(this.failDialog.param)).then((res) => {
                        this.failDialog.loading = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('同步成功')
                            this.query()
                        }
                        this.failDialog.show = false
                    }).catch(err => {
                        this.failDialog.loading = false
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            changePayResult () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        if (this.dialog.loading) {
                            return
                        }
                        this.$confirm('是否确认更改支付结果为支付成功，一旦确认将不可以更改?', '提示', {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.dialog.loading = true
                            let param = JSON.parse(JSON.stringify(this.dialog.param))
                            if (param.bank) {
                                param.txnId = param.bank + '_' + param.serial
                            }
                            manualPaySuccess(this.filterData(param)).then((res) => {
                                this.dialog.loading = false
                                if (res.ret.errcode === 1) {
                                    this.$message.success('同步成功')
                                    this.query()
                                }
                                this.dialog.show = false
                            }).catch(err => {
                                this.dialog.loading = false
                                console.log(err)
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            })
                        })
                    }
                })
            },
            // 同步
            syncPayStatus (param) {
                if (!param.bnsOrderNo) {
                    return this.$message.warning('订单号不能为空')
                }
                this.$confirm('是否确认同步?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    synPayInfo(param).then((res) => {
                        this.loading = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('同步成功')
                            this.query()
                        }
                    }).catch(err => {
                        this.loading = false
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.info-tips {
    margin-left: 45px;
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
}
</style>
