<template>
    <div class="upload-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="430px">
            <div slot="title">
                {{title}}
            </div>
             <el-upload action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                <el-button icon="el-icon-upload2" :loading="uploadLoading" :disable="uploadLoading"
                    size="medium" plain>
                    选择文件
                </el-button>
            </el-upload>
            <div class="el-upload__tip tip">
                通过上传表格，可批量修改未被商品使用的{{text}}名称； 请<span class="link" @click="downloadTemp">下载模板</span>并按照模板中的指导说明制作表格
            </div>
            <span class="file-name">{{fileUrl}}</span>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    import { uploadAttrTranslate, uploadAttrValueTranslate } from '@/request/product'
    export default {
        data() {
            return {
                fileUrl: '',
                uploadLoading: false,
                text: '属性',
                tempUrl: 'https://file.fingo.shop/upload/others/2020-02/06/18298469759992971395072.xlsx'
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            }
        },
        computed: {
            toggle: {
                get: function() {
                    if (this.type === 'attr') {
                        this.tempUrl = ' https://file.fingo.shop/upload/others/2020-02/06/18298469759992971395072.xlsx'
                        this.text = '属性'
                    } else {
                        this.tempUrl = 'https://file.fingo.shop/upload/others/2020-02/06/18298469760076953944064.xlsx'
                        this.text = '属性值'
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            },
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
            comfirm() {
                let params = {
                    uploadUrl: this.fileUrl
                }
                if (this.type === 'attr') {
                    uploadAttrTranslate(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                            this.$message.success('导表修改成功！')
                            this.fileUrl = ''
                        }

                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    uploadAttrValueTranslate(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                            this.$message.success('导表修改成功！')
                            this.fileUrl = ''
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
                this.$emit('on-comfirm')
            },
            downloadTemp() {
                window.open(this.tempUrl);
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
</style>
