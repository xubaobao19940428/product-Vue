<template>
    <div class="upload-dialog">
        <el-dialog :title="title" :visible.sync="propShowDialog" :close-on-click-modal="false" :show-close="false" width="430px">
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
                    通过上传表格，可批量修改活动商品； 请<a download="文件" :href="dealShowFileSrc('/fingo/marketing/ActiveProductTemplate_20191225.xlsx')" class="link">下载模板</a>并按照模板中的指导说明制作表格
                </div>
            </el-upload>

            <div slot="footer" class="dialog-footer">
                <el-button @click="close" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { UploadActiveProduct, downloadActiveProductTemplate } from '@/request/marketing.js'
    export default {
        data () {
            return {
                fileList: [],
                uploadFileName: 'file',
                headers: this.$headers,
                uploadFileUrl: `${process.env.VUE_APP_FILE_URL}/file/rest/uploadservices/uploadfile`,
                uploadParam: {},
                fileUrl: ''
            }
        },
        props: {
            propShowDialog: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '批量上传'
            }

        },
        methods: {
            reset () {
                this.fileList = []
                this.uploadParam = {}
                this.fileUrl = ''
            },
            close () {
                this.reset()
                this.$emit('close')
            },
            confirm () {
                if (!this.fileUrl) {
                    return this.$message.warning('请选择文件')
                }
                UploadActiveProduct({
                    url: this.fileUrl
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        if (res.ret.msg) {
                            this.$message.warning({
                                message: '上传成功' + res.ret.msg,
                                customClass: 'break-all',
                                duration: 0,
                                showClose: true
                            })
                        } else {
                            this.$message.success('上传成功')
                        }
                        this.reset()
                        this.$emit('confirm')
                    }
                })
            },
            downLoadTemplate () {
                downloadActiveProductTemplate({}).then((res) => {
                    if (res.ret.errcode === 1) {
                        let a = document.createElement('a')
                        a.download = this.dealShowFileSrc(res.url)
                        a.href = this.dealShowFileSrc(res.url)
                        a.click()
                    }
                })
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
                    this.fileUrl = res.original_link
                }
            },
            handleExceed (files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
            }
        }
    }
</script>

<style lang="scss">
    .upload-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
    }
</style>

<style lang="scss" scoped>
    .tip {
        font-size: 14px;
        line-height: 18px;
    }
    .link {
        &:hover {
            color: #0070e0;
        }
    }
</style>
