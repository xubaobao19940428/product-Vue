<template>
    <div class="upload-file">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="900px" :before-close="cancle" :close-on-click-modal="false">
            <div>
                上传：
                <el-upload v-if="!fileUrl" action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                    <el-button icon="el-icon-upload2" :loading="uploadLoading" :disable="uploadLoading"
                        size="medium" plain>
                        选择文件
                    </el-button>
                </el-upload>
                <span class="file-name">{{fileName}}</span>
            </div>
            <div class="notice">
                <div>注意：</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、导入字段包括：<i class="iconfont">&#xe69b;</i>采购单号、供应商名称、<i class="iconfont">&#xe69b;</i>skuCode、商家商品Id、商家skuId、商品名称、商品链接、sku规格属性、<i class="iconfont">&#xe69b;</i>单价、系统数量、<i class="iconfont">&#xe69b;</i>采购数量、<i class="iconfont">&#xe69b;</i>运费、第三方订单号。</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、请确认导入的采购单状态为未采购，并且手动采购。</div>
                <div @click="downloadTemp" class="download">下载导入模板</div>
                <el-progress :percentage="percentage"></el-progress>
                <div class="message"><span>{{message}}</span></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    import { ImportBatchPurchase, ExportPurEnsureTemplate } from '@/request/purchase'

    export default {
        data() {
            return {
                dialogTitle: '导入确认采购',
                uploadLoading: false,
                fileUrl: '',
                errorDialog: false,
                percentage:0,
                fileName: '',
                message:''
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        methods: {
            cancle() {
                this.fileUrl = ''
                this.$emit('on-cancle')
            },
            uploadFile(file) {
                console.log(file)
                this.fileName = file.file.name
                this.uploadLoading = true
                let params = new FormData();
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'other'
                }
                params.append('file',file.file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    this.uploadLoading = false
                    if (res.status === '600') {
                        this.fileUrl = res.original_link
                        console.log(this.fileUrl)
                            this.getImportShip(res.original_link)
                        this.percentage = 100
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            getImportShip (url) {
                let params = {
                    uploadUrl: url
                }
                ImportBatchPurchase(params).then(res => {
                    if(res.ret.errcode === 1){
                        this.message = res.message
                        this.$message.success('导入已提交，请去任务管理页查看进度')
                    }else{
                        this.message = res.message
                        this.$message.error(res.message)
                    }
                }) 
            },
            downloadTemp(){
                ExportPurEnsureTemplate({}).then(res => {
                    if (res.ret.errcode === 1) {
                        let url = this.dealShowFileSrc(res.fileUrl)
                        console.log(url)
                        window.open(`${url}`)
                    }
                })
            },
            confirmUploadPresale() {
                let params = {
                    uploadUrl: this.fileUrl
                }
            }
        }
    }
</script>
<style lang="scss">
    .upload-file {
        .upload-file-dialog {
            width: 300px;
        }
        .el-progress{
            width: 300px;
        }
    }
</style>
<style lang="scss">
    .upload-file {
        .upload-wrapper {
            display: inline-block;
        }
        .file-name {
            color: #409EFF;
        }
        .notice {
            margin-top: 10px;
            // padding: 0 40px;
            line-height: 18px;
            div{
                padding: 5px 0;
            }
            .iconfont{
                color: red;
                font-size: 12px;
            }
       }
       .download {
            width: 100px;
            font-weight: 400;
            color: #409EFF;
            cursor: pointer;
        }
        .message{
            color: red;
        }
    }

</style>