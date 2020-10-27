<template>
    <div>
        <el-card class="batch-add-card">
            <el-button type="text" class="batch-add-money" @click="downloadTemp">导入模板下载</el-button>
            <div slot="header" class="clearfix">
                <span>批量导入</span>
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
                    size="medium">批量打钱用户名单导入</el-button>
            </el-upload>
        </el-card>
        <el-card class="basic-info-card">
            <div slot="header" class="clearfix">
                <span>补积分</span>
            </div>
            <el-form label-width="120px" ref="addPointForm" :model="addPointModel" :rules="ruleValidate">
                <el-form-item label="用户ID：" prop="userId">
                    <el-input style="width: 200px" v-model="addPointModel.userId" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="币种：" prop="countryCode" >
                    <el-select v-model="addPointModel.countryCode" filterable clearable size="medium">
                        <el-option v-for="(item, key) in operatorList" :key="key" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收入类型：" prop="sourceType" >
                    <el-select v-model="addPointModel.sourceType" filterable size="medium">
                        <el-option v-for="item in sourceTypeList" :key="item.key" :label="item.val" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额：" prop="amount">
                    <el-input-number v-model="addPointModel.amount" :min="0" :max="999999999" size="medium" :precision="2">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="备注：" prop="memo">
                    <el-input style="width: 200px" v-model="addPointModel.memo" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" :disabled="loading" @click="submit">确认</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>

</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    import { batchAddMoney } from '@/request/user'
    export default {
        name: 'bindCard',
        data() {
            return {
                operatorList: [{
                    label: '马币',
                    value: 'MY'
                }, {
                    label: '新币',
                    value: 'SG'
                },{
                    label: '泰铢',
                    value: 'TH'
                },{
                    label: '印尼盾',
                    value: 'ID'
                }],
                sourceTypeList: [{
                    key: 9,
                    val: '系统奖励'
                }, {
                    key: 20,
                    val: '活动积分'
                }, {
                    key: 29,
                    val: '品牌馆月销售奖励'
                }],
                loading: false,
                uploadLoading: false,
                addPointModel: {
                    userId: '',
                    amount: 0,
                    memo: '',
                    countryCode: 'MY',
                    sourceType: 9
                },
                ruleValidate: {
                    userId: [{
                        required: true,
                        message: 'ID不能为空',
                        trigger: 'blur'
                    }],
                    amount: [{
                        required: true,
                        message: '金额不能为空',
                        trigger: 'blur'
                    }],
                    memo: [{
                        required: true,
                        message: '备注不能为空',
                        trigger: 'blur'
                    }],
                    countryCode: [{
                        required: true,
                        message: '币种不能为空',
                        trigger: 'blur'
                    }],
                    sourceType: [{
                        required: true,
                        message: '收入类型不能为空',
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
                let url = 'https://file.fingo.shop/fingo/member/add_money_demo.xls'
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
                        this.batchAddMoneyRequest(res.original_link)
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                        this.uploadLoading = false
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            batchAddMoneyRequest(url) {
                let params = {
                    url: url
                }
                batchAddMoney(params).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('批量打钱成功！')
                        this.uploadLoading = false
                        let fileUrl = response.url
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.$message.error('批量打钱失败，请重试！')
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
</style>


