<template>
    <div class="payment-check-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="1100px">
            <div slot="title">
                {{title}}
            </div>
            <el-row :gutter="10">
                <el-col :span="11">
                    <!-- <el-image
                        style="width: 380px; height: 100%"
                        :src="dealShowFileSrc(checkModel.paymentVoucherPicture)"
                        fit="cover"></el-image> -->
                    <c-upload v-if="toggle" :limit="1"
                        :fileList="checkModel.paymentVoucherPicture"
                        @setData="setFileList">
                    </c-upload>
                </el-col>
                <el-col :span="13">
                    <el-form ref="checkEditForm" :model="checkModel" :rules="ruleValidate" label-width="80px">
                        <el-form-item prop="" label="应付金额：">
                            {{ getCurrencyUnit( checkModel.countryCode, 'currencyUnit') + ' ' + checkModel.amount }}
                        </el-form-item>
                        <el-form-item prop="bank" label="银行：" >
                            <el-select v-model="checkModel.bank" clearable filterable placeholder="请选择" style="width: 300px" size="medium">
                                <el-option v-for="(item, index) in bankList"
                                       :key="index"
                                       :label="item.Name"
                                       :value="item.Code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="serial" label="流水号：" >
                            <el-input v-model="checkModel.serial" clearable placeholder="请输入流水号" style="width: 300px" :maxlength="40" size="medium"></el-input>
                            <el-button type="text" @click="showCropper">自动识别</el-button>
                        </el-form-item>
                    </el-form>
                    <el-divider></el-divider>
                    <div class="check-tips">
                        审核规范：<br>
                        Step1：核对收款银行Fingo Thailand: 0613465979(只显示4位)，是则进入第二步，不是则直接关闭交易并备注“银行账号错误”；<br>
                        Step2：核对付款凭证金额是否跟系统金额匹配，是则进入第三步，不是则直接关闭交易并备注“付款金额错误”；<br>
                        Step3：选择付款银行，填写交易号，核对无误后点击【确定】提交；<br><br>

                        自动识别：<br>
                        选中交易号区域，系统将自动填充识别结果。
                    </div>
                </el-col>
            </el-row>
            <ImgCropperDialog :dialogVisible="ImgCropperDialogVisible" :imgUrl="imgUrl" @on-cancle="handleCancleCropper" @on-confirm="handleConfirmCropper"></ImgCropperDialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import ImgCropperDialog from './ImgCropperDialog.vue'
    import cUpload from './uploadPic'
    export default {
        data() {
            return {
                title: '支付审核',
                ruleValidate: {
                    bank: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择银行'
                    }],
                    serial: [{
                        required: true,
                        trigger: 'blur',
                        message: '流水号不能为空'
                    }]
                },
                bankList: [
                    { 'Name': 'Siam Commercial Bank', 'Code': 'TH0001', 'serialLength': 25 },
                    { 'Name': 'Kasikornbank', 'Code': 'TH0002' , 'serialLength': 18},
                    { 'Name': 'Bangkok Bank', 'Code': 'TH0003' , 'serialLength': 6},
                    { 'Name': 'Krung Thai Bank', 'Code': 'TH0004' , 'serialLength': 12},
                    { 'Name': 'Government Savings Bank', 'Code': 'TH0005', 'serialLength': 24 },
                    { 'Name': 'Bank of Ayudhya (Krungsri)', 'Code': 'TH0006' , 'serialLength': 13},
                    { 'Name': 'Thanachart Bank', 'Code': 'TH0007' , 'serialLength': 20},
                    { 'Name': 'TMB Bank', 'Code': 'TH0008' , 'serialLength': 18},
                    { 'Name': 'Kiatnakin Bank', 'Code': 'TH0009' },
                    { 'Name': 'CIMB (Thai) ', 'Code': 'TH0010' , 'serialLength': 20},
                    { 'Name': 'Standard Chartered Bank (Thai) ', 'Code': 'TH0011' , 'serialLength': 16},
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
                    { 'Name': 'BAAC Bank for Agriculture and Agricultural Cooperation', 'Code': 'TH0037' , 'serialLength': 12},
                    { 'Name': 'LH Bank', 'Code': 'TH0038' },
                    { 'Name': 'Airpay', 'Code': 'TH0039' },
                    { 'Name': 'Government Housing Bank(GH Bank)', 'Code': 'TH0040' }
                ],
                ImgCropperDialogVisible: false,
                imgUrl: ''
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            checkData: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            checkModel: function() {
                return this.checkData
            }
        },
        components: {
            ImgCropperDialog,
            cUpload
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                // this.$refs.checkEditForm.resetFields()
            },
            comfirm() {
                this.$refs.checkEditForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.checkModel)
                    }
                })
            },
            showCropper() {
                this.ImgCropperDialogVisible = true
                this.imgUrl = this.dealShowFileSrc(this.checkData.paymentVoucherPicture)
            },
            handleCancleCropper() {
                this.ImgCropperDialogVisible = false
            },
            handleConfirmCropper(data) {
                this.ImgCropperDialogVisible = false
                this.checkModel.serial = data
                if (this.checkModel.bank != '') {
                    this.verifySerial(data)
                } else {
                     this.$message.success('识别成功,请人工核对一下！')
                }
            },
            setFileList (res) {
                this.checkModel.paymentVoucherPicture = this.dealShowFileSrc(res.data)
            },
            verifySerial(data) {
                _.forEach(this.bankList, item => {
                    if (this.checkModel.bank === item.Code && item.serialLength) {
                        if (data.length != item.serialLength) {
                            this.$message.warning('你识别的区域可能有误，不符合该银行流水号的默认长度！')
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .payment-check-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
        .limit-num-tip {
            color: #000;
        }
        .standard-img {
            width: 110px;
            height: 110px;
            .el-upload--picture-card {
                width: 110px;
                height: 110px;
                line-height: 120px;

            }
            .el-upload-list--picture-card .el-upload-list__item {
                width: 110px;
                height: 110px;
            }
        }
        .el-upload-list--picture-card .el-upload-list__item {
            width: 380px;
            height: 100%;
        }
        .el-upload--picture-card {
            // display: none;
        }
    }
</style>

<style lang="scss" scoped>
    .check-tips {
        color: #000;
        font-size: 12px;
    }
</style>

