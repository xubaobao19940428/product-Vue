<template>
    <el-dialog 
        class="send-coupon-dialog"
        title="发券"
        width="560px"
        :visible="dialogVisible"
        @close="handleClose"
    >
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="导表发放" name="tableSend" v-show="currentView === 'tableSend'">
                <el-form label-width="90px">
                    <el-form-item label="导表上传：">
                        <el-upload class="upload-demo"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            :headers="headers"
                            :name="uploadFileName"
                            :data="uploadParam"
                            :action="uploadFileUrl"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-success="uploadSuccess"
                            :before-upload="beforeFileUpload"
                            :file-list="fileList">
                            <el-button icon="el-icon-upload2" size="small" type="primary">选择文件</el-button>
                            <div slot="tip" class="el-upload__tip tip">
                                通过上传表格，可批量完成优惠券发放，且系统为整体发放，如有一张发放失败则整体发放失败，无需担心发重发漏；因此请<a download="文件" href="https://file.fingo.shop/fingo/templates/VoucherImportTemplate.xlsx" class="link">下载模板</a>并按照模板中的指导说明制作表格。
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="手动发放" name="handSend" v-show="currentView === 'handSend'">
                <el-form label-position="right"
                    label-width="90px"
                    :rules="rules"
                    :model="param"
                    ref="sendCouponForm">
                    <el-form-item label="优惠券ID："
                                prop="couponId">
                        <el-input placeholder="请输入优惠券ID"
                                    v-model="param.couponId"></el-input>
                    </el-form-item>
                    <el-form-item label="用户id："
                                prop="userId">
                        <el-input placeholder="请输入用户id,多个用户使用,号隔开" v-model="param.userId"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" @click="confitmSendUserCoupon" size="small" :loading="saving">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { addOldUserCoupon, uploadCoupon } from '@/request/coupon.js'

export default {
    props: {
        dialogVisible: Boolean
    },
    data () {
        return {
            currentView: 'tableSend',
            param: {
                couponId: '',
                couponPackageId: '',
                userId: ''
            },
            rules: {
                couponId: [{ required: true, message: '必填', trigger: 'change' }],
                couponPackageId: [{ required: true, message: '必填', trigger: 'change'}],
                userId: [{ required: true, message: '必填', trigger: 'change' }]
            },
            uploadFileUrl: `${process.env.VUE_APP_FILE_URL}/file/rest/uploadservices/uploadfile`,
            uploadParam: {},
            fileList: [],
            headers: this.$headers,
            uploadFileName: 'file',
            url: '',
            saving: false
        }
    },
    methods: {
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        reset () {
            this.fileList = []
            this.uploadParam = {}
            this.url = ''
            this.$refs['sendCouponForm'].resetFields()
        },
        beforeFileUpload (file) {
            Object.assign(this.uploadParam, {
                param: JSON.stringify({
                    type: 'other',
                    fileName: file.name
                })
            })
        },
        uploadSuccess (res) {
            if (res.status == 600) {
                this.url = res.original_link
            }
        },
        handleExceed (files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        },
        confitmSendUserCoupon () {
            if (this.currentView === 'handSend') {
                this.$refs['sendCouponForm'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        let resParam = JSON.parse(JSON.stringify(this.param))
                        resParam.userId = resParam.userId.split(',')

                        let res = this.filterData(resParam)

                        addOldUserCoupon({ oldUserCouponReqPb: res}).then((res) => {
                            this.saving = false
                            if (res.ret.errcode === 1) {
                                this.$message.success('添加成功')
                                this.reset()
                                this.$emit('confirm')
                            }
                        }).catch(() => {
                            this.saving = false
                        })
                    }
                })
            } else {
                if (!this.url) {
                    return this.$message.warning('请选择文件')
                }
                this.saving = true

                uploadCoupon({
                    url: this.url
                }).then((res) => {
                    this.saving = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('上传成功')
                        this.reset()
                        this.$emit('confirm')
                    }
                }).catch(() => {
                    this.saving = false
                })
            }
        }
    }
}
</script>

<style lang="scss" scope>
    .tip {
        font-size: 14px;
        line-height: 22px;
        color: #888;
    }
</style>