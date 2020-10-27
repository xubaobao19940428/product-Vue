<template>
    <div class="upload-file-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="600px" :before-close="cancle" :close-on-click-modal="false">
            <div>
                上传：
                <el-upload v-if="!fileUrl" action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                    <el-button icon="el-icon-upload2" :loading="uploadLoading" :disable="uploadLoading"
                        size="medium" plain>
                        选择文件
                    </el-button>
                </el-upload>
                <span class="file-name">{{fileUrl}}</span>
            </div>
            <p>
                通过上传表格，可批量新增货代工作号信息；请<span @click="downloadTemp">下载模板</span>并按照模板中的必填信息制作表格。
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" :disabled="!fileUrl" @click="confirmUploadPresale" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    import { ImportPurchaseFreight,ImportCostGoFreight,B2BImportTemplate } from '@/request/logi'
    export default {
        // 上传文件
        name: 'UploadFile',
        data() {
            return {
                dialogTitle: '',
                uploadLoading: false,
                fileUrl: '',
                templateUrl:''
            }
        },
        props: {
            editType: {
                type: String,
                default: 'first'
            },
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
        watch:{
            editType:{
                handler(newVal,oldVal){
                    if(newVal){
                        this.getB2BImportTemplate()
                    }
                },
                deep:true
            }
        },
        mounted(){
            this.getB2BImportTemplate()
        },
        methods: {
            getB2BImportTemplate(){
                var params={
                    reqType:'2'
                }
                if(this.editType=='first'){
                    params.reqType='2'
                }else{
                    params.reqType='1'
                }
                B2BImportTemplate(params).then(resultes=>{
                    if(resultes.ret.errcode==1){
                        this.templateUrl = resultes.fileUrl
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            cancle() {
                this.fileUrl = ''
                this.$emit('on-cancle')
            },
            uploadFile(file) {
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
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            downloadTemp(){
                let url = this.dealShowFileSrc(this.templateUrl)
                window.open(`${url}`);
            },
            confirmUploadPresale() {
                let params = {
                    fileUrl: this.fileUrl
                }
                if(this.editType=='first'){
                   ImportPurchaseFreight(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$emit('on-confirm')
                        this.$message.success('采购货代导入成功！')
                        this.fileUrl = ''
                    }
                }).catch(err => {
                    console.log(err)
                }) 
                }else{
                    ImportCostGoFreight(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$emit('on-confirm')
                        this.$message.success('costgo货代导入成功！')
                        this.fileUrl = ''
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
    .upload-file-dialog {
        .upload-wrapper {
            display: inline-block;
        }
        .file-name {
            color: #409EFF;
        }
        p {
            margin-top: 10px;
            padding: 0 40px;
            line-height: 18px;
            color: #aaa;
            span {
                color: #409EFF;
                cursor: pointer;
            }
       }
    }

</style>



