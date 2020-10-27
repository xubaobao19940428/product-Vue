<template>
    <div class="by-spe">
        <div class="title">{{ editType === 'add' ? '创建' : '编辑' }}特定用户组</div>
        <div class="operate">
            <div class="operate-title">用户组名称：</div>
            <el-input v-model="userGroupName" placeholder="输入名称"></el-input>
            <el-upload action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                <el-button type="primary" :loading="uploadLoading" :disable="uploadLoading">导入</el-button>
            </el-upload>
            <el-button type="primary" @click="downloadModule">下载模版</el-button>
        </div>
        <div>
            <div class="file-name" v-if="fileUrl"><i class="iconfont">&#xe625;</i> {{fileUrl}} 文件导入成功</div>
            <el-input type="textarea" placeholder="多个userid使用英文逗号隔开" v-model="textarea" v-if="!fileUrl" @blur="computedCount"></el-input>
        </div>
        <div class="footer">
            <div class="count" v-if="!fileUrl">共 {{ count }} 个用户</div>
            <div>
                <el-button type="primary" @click="saveData">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import { uploadFileRequest } from '@/request/file'
    import { AddUserGroupBySpe, EditUserGroupInfo } from '@/request/pushtask'

    export default {
        data () {
            return {
                editType: '',
                userGroupName: '',
                textarea: '',
                uploadLoading: false,
                fileUrl: '',
                count: 'XXX'
            }
        },
        mounted() {
            console.log(this.$route.query)
            this.editType = this.$route.query.editType
            if (this.$route.query.data) {
                this.userGroupName = this.$route.query.data.userGroupName
                this.textarea = this.$route.query.data.userId
            }
        },
        methods: {
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
                    console.log(res)
                    if (res.status === '600') {
                        this.fileUrl = res.original_link
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            downloadModule () {
                let url = this.dealShowFileSrc('/data/nfs/dev/fingo/templates/userId_template.xlsx')
                window.open(url)
            },
            computedCount () {
                let list = this.textarea.split(',')
                console.log(list)
                let toList = list.filter(function (s) {
                    return s && s.trim();
                })
                console.log(toList)
                this.count = toList.length
            },
            cancel () {
                this.$router.push({
                    name: 'userGrouping'
                })
            },
            saveData () {
                if (this.userGroupName === '' ) {
                    this.$message.error('请填写用户组名称！')
                    return
                } else if (this.textarea === '' && this.fileUrl === '') {
                    this.$message.error('请填写userId！')
                    return
                }
                if (this.editType === 'add') {
                    let params = {
                        userGroupName: this.userGroupName,
                        url: this.fileUrl,
                        userInput: this.textarea
                    }
                    AddUserGroupBySpe(params).then(res => {
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.$message.success('新增成功！')
                            this.$router.push({
                                name: 'userGrouping'
                            })
                        }
                    })
                } else {
                    let params = {
                        userGroupId: this.$route.query.data.userGroupId,
                        userGroupType: this.$route.query.data.userGroupType,
                        userGroupName: this.userGroupName,
                        url: this.fileUrl,
                        userInput: this.textarea
                    }
                    EditUserGroupInfo(params).then(res => {
                        if (res.ret.errcode === 1) {
                            console.log(res)
                            this.$message.success('编辑成功！')
                            this.$router.push({
                                name: 'userGrouping'
                            })
                        }
                    })
                }  
            },
        }
    }
</script>
<style lang="scss">
    .by-spe{
        .el-input{
            width: 200px;
        }
        .el-textarea{
            width: 700px !important;
            margin-top: 20px;
        }
        .el-textarea__inner {
            min-height: 300px !important;
        }
    }
</style>
<style lang="scss" scoped>
    .by-spe{
        .title{
            margin: 10px 0 20px 0;
            font-size: 20px;
            font-weight: 600;
        }
        .operate{
            display: flex;
            .operate-title{
                height: 40px;
                line-height: 40px;
                text-align: center;
            }
        }
        .upload-wrapper {
            display: inline-block;
            margin-right: 20px;
            margin-left: 20px;
        }
        .file-name{
            margin-top: 20px;
        }
        .footer{
            display: flex;
            justify-content: space-between;
            width: 700px;
            margin-top: 20px;
            .count{
                color: rgb(115,115,115)
            }
        }
    }
</style>