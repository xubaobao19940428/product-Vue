<template>
    <div class="upload-file-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="600px" @close="cancle" :close-on-click-modal="false">
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
                通过上传表格，可批量录入或修改预售商品数据；请<span @click="downloadTemp">下载模板</span>并按照模板中的指导说明制作表格。
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
    import { advanceSaleUpload } from '@/request/product'
    export default {
        // 上传文件
        name: 'UploadFile',
        data() {
            return {
                dialogTitle: '',
                uploadLoading: false,
                fileUrl: ''
            }
        },
        props: {
            editType: {
                type: String,
                default: 'add'
            },
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
            }
        },
        methods: {
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
                let url = 'https://file.fingo.shop/upload/others/2020-01/08/18269459324603773222912.xlsx'
                window.open(`${url}`);
            },
            confirmUploadPresale() {
                let params = {
                    uploadUrl: this.fileUrl
                }
                advanceSaleUpload(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$emit('on-confirm')
                        this.$message.success('预售批量导入成功！')
                        this.fileUrl = ''
                    }
                }).catch(err => {
                    console.log(err)
                })
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



