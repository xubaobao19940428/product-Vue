<template>
    <div class="upload-file">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="600px" :before-close="cancle" :close-on-click-modal="false">
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
                <div>
                    通过上传表格，可批量发起售后申请；请<span @click="downloadTemp" class="download">下载导入模板</span>并按照模板中的指导说明制作表格。
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button @click="confirm" type="primary" size="small">确 定</el-button>
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
                dialogTitle: '批量发起售后',
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
            confirm () {
                this.$emit('on-confirm')
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
                window.open('')
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
            color: rgb(179,179,179)
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