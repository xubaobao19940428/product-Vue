<template>
    <div>
        <el-card class="batch-add-card">
            <el-button type="text" class="batch-add-money" @click="downloadTemp">导入模板下载</el-button>
            <div slot="header" class="clearfix">
                <span>批量导入注册</span>
            </div>
            <el-upload
                action=""
                multiple
                :http-request="uploadFile"
                :show-file-list="false">
                <el-button icon="el-icon-upload"
                    :loading="uploadLoading"
                    :disable="uploadLoading"
                    type="primary"
                    size="medium">批量注册用户名单导入</el-button>
                <span class="import-tips"> ( 为避免导入失败，限制单次导入200条以内 ) </span>
            </el-upload>
        </el-card>
    </div>
</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    import { batchRegister } from '@/request/user'
    export default {
        // 批量注册
        name: 'BatchRegister',
        data() {
            return {
                loading: false,
                uploadLoading: false,
                addPointModel: {
                    userId: '',
                    amount: 0,
                    memo: ''
                },
                ruleValidate: {
                    userId: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                    amount: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                    memo: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }]
                },
                FILE_ACCEPT: '.xlsx,.xls'
            }
        },
        methods: {
            submit() {
                this.$refs.addPointForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$emit('on-submit', this.addPointModel)
                    }
                })
            },
            setEnable() {
                this.loading = false
            },
            downloadTemp(){
                let url = 'https://file.fingo.shop/fingo/member/register_template.xls'
                window.open(`${url}`);
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
                    if (res.status === '600') {
                        this.batchRegisterRequest(res.original_link)
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                        this.uploadLoading = false
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            batchRegisterRequest(url) {
                let params = {
                    url: url
                }
                batchRegister(params).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('批量注册成功！')
                        this.uploadLoading = false
                        let fileUrl = response.url
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.$message.error('批量注册失败，请重试！')
                        this.uploadLoading = false
                    }
                }).catch((err) => {
                    this.uploadLoading = false
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .batch-add-card {
        margin-bottom: 20px;
    }
    .import-tips {
        color: red;
        font-size: 14px;
    }
</style>


