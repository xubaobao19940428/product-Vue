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
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、导入字段包括：<i class="iconfont">&#xe69b;</i>订单编号、<i class="iconfont">&#xe69b;</i>sku_code、商品名称、规格、订单数量、<i class="iconfont">&#xe69b;</i>发货数量、第三方订单编号、<i class="iconfont">&#xe69b;</i>物流公司、<i class="iconfont">&#xe69b;</i>物流单号。</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、请确认导入的订单状态为：待发货。</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、多个直邮订单不允许使用同一个运单号发货。</div>
                <div @click="downloadTemp" class="download">下载导入模板</div>
                <el-progress :percentage="percentage"></el-progress>
                <!-- <div><span>{{message + ' ，'}}</span><span class="download">点击下载失败列表</span></div> -->
                <div class="message"><span>{{message}}</span></div>
            </div>
                <el-dialog
                    title="错误提示"
                    :visible.sync="errorDialog"
                    width="30%"
                    :before-close="errorDialog = false"
                    append-to-body>
                    <div>导入模版错误</div>
                    <div @click="downloadTemp" class="download">下载导入模板</div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="errorDialog = false">知道了</el-button>
                    </span>
                </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    import { ImportShip, ExportTemplate } from '@/request/directMail'
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                dialogTitle: '导入发货',
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
            },
            mark:String
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            ...mapState({
                lang:state=>state.app.lang,
            })
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
                        if (this.mark === 'onBehalf'){
                            this.getImportOrderDeliver(res.original_link)
                        } else if (this.mark === 'direct') {
                            this.getImportShip(res.original_link)
                        }
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
                    fileUrl: url,
                    languageCode: 'cn',
                    reqType: 1
                }
                ImportShip(params).then(res => {
                    if(res.ret.errcode === 1){
                        this.message = res.message
                        this.$message.success('导入成功')
                    }else{
                        this.message = res.message
                        this.$message.error(res.message)
                    }
                }) 
            },
            getImportOrderDeliver (url) {
                let params = {
                    uploadUrl: url,
                    languageCode: this.lang
                }
                ImportOrderDeliver(params).then(res => {
                    if (res.ret.errcode === 1){
                        console.log(res)
                        this.message = res.message
                        this.$message.error(res.message)
                    }
                })
            },
            downloadTemp(){
                let params ={
                    languageCode: 'cn',
                    reqType: 1
                }
                ExportTemplate(params).then(res => {
                    if (res.ret.errcode === 1){
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
            font-weight: 400;
            color: #409EFF;
            cursor: pointer;
        }
        .message{
            color: red;
        }
    }

</style>