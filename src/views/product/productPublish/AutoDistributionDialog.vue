<template>
    <div class="auto-distribution-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="600px">
            <div slot="title">
                {{title}}
            </div>
            <div class="type-switch">
                <el-radio-group v-model="distributionType" style="margin-bottom: 30px;">
                    <el-radio-button label="single">手动上货</el-radio-button>
                    <el-radio-button label="batch">批量上货</el-radio-button>
                </el-radio-group>
            </div>
            <el-form ref="autoDistributionForm" v-if="distributionType === 'single'" :model="autoDistributionModel" :rules="ruleValidate" label-width="120px">
                <el-form-item prop="keyword" label="搜索词：">
                    <el-input v-model="autoDistributionModel.keyword" clearable
                        placeholder="示例：运动鞋 透气" style="width: 300px" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item prop="target" label="目标数量：">
                    <el-input v-model="autoDistributionModel.target" clearable
                        placeholder="" style="width: 300px" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item v-if="type === 'create'" prop="categoryIds" label="归属类目：">
                    <el-cascader style="width: 300px"
                        clearable
                        filterable
                        :props="{label: 'cateName', children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getBackSubCategory}"
                        placeholder="请选择归属后台类目"
                        :options="backCategoryOptions"
                        v-model="autoDistributionModel.categoryIds"
                        @change="setBackCateId"
                        class="normalOperatorBox"
                        size="medium">
                    </el-cascader>
                </el-form-item>
                <el-form-item v-if="type === 'copy'" prop="" label="归属类目：">
                    {{autoDistributionModel.categoryName}}
                </el-form-item>
                <el-form-item prop="productAttrs" label="规格属性：">
                    <el-input v-model="autoDistributionModel.productAttrs" clearable
                        placeholder="请输入规格属性，多个以英文逗号,分割" style="width: 300px; margin-right: 10px;" size="medium">
                    </el-input>
                    <el-tooltip class="item" effect="dark" content="请填写该类目的非销售属性（如材质、款式），支持输入多个，请以英文逗号,分割。" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="单品重量(kg)："  prop="weight">
                    <el-input v-model="autoDistributionModel.minWeight"
                        placeholder="最低重量" style="width:120px; margin-right: 10px;" size="medium">
                    </el-input> ~
                    <el-input v-model="autoDistributionModel.maxWeight"
                        placeholder="最大重量" style="width:120px; margin-left: 10px;" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="供货价(RMB)：">
                    <el-input v-model="autoDistributionModel.minPrice" clearable
                        placeholder="最低价" style="width:120px; margin-right: 10px;" size="medium">
                    </el-input> ~
                    <el-input v-model="autoDistributionModel.maxPrice" clearable
                        placeholder="最高价" style="width:120px; margin-left: 10px;" size="medium">
                    </el-input>
                </el-form-item>
            </el-form>

            <el-form v-else label-width="120px">
                <el-form-item label="导表上传：">
                    <p>{{fileUrl}}</p>
                    <el-upload v-if="!fileUrl" action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                        <el-button icon="el-icon-upload2" :loading="uploadLoading" :disable="uploadLoading"
                            size="medium" plain>
                            选择文件
                        </el-button>
                    </el-upload>
                    <p class="download-tip">
                        通过上传表格，可批量创建上货任务；请<span @click="downloadTemp">下载模板</span>并按照模板中的指导说明制作表格。
                    </p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" size="medium" style="float: left;" @click="showTaskQueue">任务队列</el-button>
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small" :loading="confirmLoading">确 定</el-button>
            </div>
            <task-queue-dialog :dialogVisible="taskVisible" @on-close="handleClose" @on-copy="handleCopy"></task-queue-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import { categoryListGet, createUploadTask, batchAddTask} from '@/request/product'
    import { uploadFileRequest } from '@/request/file'
    import TaskQueueDialog from './TaskQueueDialog'
    export default {
        data() {
            return {
                title: '搜索上货',
                distributionType: 'single',
                autoDistributionModel: {
                    keyword: '',
                    categoryIds: [],
                    categoryId: null,
                    categoryName: '',
                    target: null,
                    productAttrs: '',
                    minWeight: 0.01,
                    maxWeight: 5,
                    minPrice: '',
                    maxPrice: '',
                    weight: 1
                },
                ruleValidate: {
                    keyword: [{
                        required: true,
                        trigger: 'blur',
                        message: '搜索词不能为空'
                    }],
                    target: [{
                        required: true,
                        trigger: 'blur',
                        message: '目标数量不能为空'
                    }, {
                        type: 'integer',
                        message: '请输入正确的正整数',
                        trigger: 'blur',
                        transform: (value) => {
                            const parsed = parseInt(value, 10);
                            if (parsed <= 0) {
                                return false;
                            } else {
                                return isNaN(parsed) || parsed.toString().length !== value.length ? value : parsed;
                            }
                        }
                    }],
                    categoryIds: [{
                        required: true,
                        trigger: 'change',
                        message: '请选择归属类目'
                    }],
                    productAttrs: [{
                        required: true,
                        trigger: 'blur',
                        message: '规格属性不能为空'
                    }],
                    weight: [{
                        required: true,
                        trigger: 'blur',
                        message: ''
                    }]
                },
                backCategoryOptions: [],
                fileUrl: '',
                uploadLoading: false,
                taskVisible: false,
                userInfo: {},
                type: 'create',
                confirmLoading: false
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
                    if (this.dialogVisible) {
                        this.fetchCategory({
                            level: 1,
                            cateType: 2,
                            resolve: (data) => {
                                this.backCategoryOptions = data
                            }
                        })
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        components: {
            TaskQueueDialog
        },
        created() {
            this.userInfo = JSON.parse(this.getStore('adminUserInfo'))
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.fileUrl = ''
                this.$refs.autoDistributionForm.resetFields()
                this.type = 'create'
                this.autoDistributionModel.minWeight = 0.01
                this.autoDistributionModel.maxWeight = 5
                this.autoDistributionModel.minPrice = ''
                this.autoDistributionModel.maxPrice = ''
                
            },
            confirm() {
                console.log(this.fileUrl)
                if (this.distributionType === 'single') {
                    this.$refs.autoDistributionForm.validate((valid) => {
                        if (valid) {
                            if (this.autoDistributionModel.minWeight == '' || this.autoDistributionModel.maxWeight == '') {
                                this.$message.warning('重量不能为空')
                                return
                            }
                            if (!(this.validateNum(this.autoDistributionModel.minWeight) && this.validateNum(this.autoDistributionModel.maxWeight))) {
                                this.$message.warning('重量必须是大于0的数值')
                                return
                            }
                            if (Number(this.autoDistributionModel.minWeight) > Number(this.autoDistributionModel.maxWeight)) {
                                this.$message.warning('最低重量要小于等于最高重量')
                                return
                            }
                            if (!(this.validateNum(this.autoDistributionModel.minPrice) && this.validateNum(this.autoDistributionModel.maxPrice))) {
                                this.$message.warning('价格必须是大于0的数值')
                                return
                            }
                            if (Number(this.autoDistributionModel.minPrice) > Number(this.autoDistributionModel.maxPrice)) {
                                this.$message.warning('最低价要小于等于最高价格')
                                return
                            }
                            let params = {
                                keyword: this.autoDistributionModel.keyword,
                                target: Number(this.autoDistributionModel.target),
                                categoryId: this.autoDistributionModel.categoryId,
                                categoryName: this.autoDistributionModel.categoryName,
                                productAttr: this.autoDistributionModel.productAttrs.split(','),
                                minPrice: this.autoDistributionModel.minPrice+'',
                                maxPrice: this.autoDistributionModel.maxPrice+'',
                                minWeight: this.autoDistributionModel.minWeight+'',
                                maxWeight: this.autoDistributionModel.maxWeight+'',
                                creatorId: this.userInfo.id,
                                creatorName: this.userInfo.account
                           }
                           this.createUploadTaskRequest(params)
                        }
                    })
                } else {
                    this.confirmLoading = true
                    if (this.fileUrl === '') {
                        this.$message.warning('请上传任务表')
                        return
                    }
                    let params = {
                        creatorId: this.userInfo.id,
                        creatorName: this.userInfo.account,
                        filename: this.fileUrl
                    }
                    batchAddTask(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('批量上货成功！')
                            this.$emit('on-confirm')
                            this.fileUrl = ''
                            this.confirmLoading = false
                        }
                    }).catch((err) => {
                        console.log(err)
                        this.confirmLoading = false
                    })
                }
                
            },
            fetchCategory ({ id, cateType, level, pid, page, resolve }) {
                categoryListGet(this.filterData({
                    pid: pid,
                    id: id,
                    level: level,
                    cateType: cateType,
                    page: page
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.categoryUnit.length; i++) {
                            res.categoryUnit[i]['levelValue'] = []
                            let item = res.categoryUnit[i].cateNameValue.find((val) => {
                                return val.languageCode == 'cn'
                            })
                            res.categoryUnit[i]['cateName'] = item ? item.name : ''
                            res.categoryUnit[i]['prop'] = JSON.stringify({
                                cateId: String(res.categoryUnit[i].cateId),
                                cateName: item ? item.name : ''
                            })
                            if (cateType == 2) {
                                res.categoryUnit[i]['leaf'] = level > 2
                            } else {
                                res.categoryUnit[i]['leaf'] = level > 1
                            }
                        }
                        resolve && resolve(res.categoryUnit, res)
                    }
                })
            },
            getBackSubCategory (data, resolve) {
                if (data.level == 0) {
                    return
                }
                let value = JSON.parse(data.value)
                this.fetchCategory({
                    pid: parseInt(value.cateId),
                    cateType: 2,
                    level: data.level + 1,
                    resolve
                })
            },
            setBackCateId () {
                if (this.autoDistributionModel.categoryIds && this.autoDistributionModel.categoryIds.length > 0) {
                    let cateInfo = JSON.parse(this.autoDistributionModel.categoryIds[this.autoDistributionModel.categoryIds.length - 1])
                    this.autoDistributionModel.categoryId = Number(cateInfo.cateId)
                    let categoryNameList = []
                    _.forEach(this.autoDistributionModel.categoryIds, item => {
                        categoryNameList.push(JSON.parse(item).cateName)
                    })
                    this.autoDistributionModel.categoryName = categoryNameList.join('>>')
                    console.log(this.autoDistributionModel.categoryName)
                } else {
                    this.autoDistributionModel.categoryId = null
                    this.autoDistributionModel.categoryName = ''
                }
            },
            createUploadTaskRequest(params) {
                this.confirmLoading = true
                createUploadTask(this.filterData(params)).then((res) => {
                    this.confirmLoading = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('上货成功！')
                        this.$emit('on-confirm')
                        this.$refs.autoDistributionForm.resetFields()
                        this.type = 'create'
                        this.autoDistributionModel.minWeight = 0.01
                        this.autoDistributionModel.maxWeight = 5
                        this.autoDistributionModel.minPrice = ''
                        this.autoDistributionModel.maxPrice = ''
                    }
                }).catch((err) => {
                    this.confirmLoading = false
                    console.log(err)
                })
            },
            validateNum(str) {
                let flag = false
                if (isNaN(Number(str))) {
                    flag = false
                } else if (Number(str) < 0) {
                    flag = false
                } else {
                    flag = true
                }
                return flag
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
                let url = '/fingo/carrier/batch_upload_template.xlsx'
                window.open(`${this.dealShowFileSrc(url)}`);
            },
            showTaskQueue() {
                this.taskVisible = true
            },
            handleClose() {
                this.taskVisible = false
            },
            handleCopy(data) {
                this.taskVisible = false
                this.distributionType = 'single'
                this.type = 'copy'
                this.autoDistributionModel.keyword = data.keyword
                this.autoDistributionModel.categoryId = data.categoryId
                this.autoDistributionModel.categoryName = data.categoryName
                this.autoDistributionModel.productAttrs = data.productAttr.join(',')
                this.autoDistributionModel.target = data.target
                this.autoDistributionModel.minPrice = data.minPrice
                this.autoDistributionModel.maxPrice = data.maxPrice
                this.autoDistributionModel.minWeight = data.minWeight
                this.autoDistributionModel.maxWeight = data.maxWeight
            }
        }
    }
</script>

<style lang="scss">
    .auto-distribution-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }

    }
</style>

<style lang="scss" scoped>
    .auto-distribution-dialog {
        .type-switch {
            text-align: center;
        }
        .tips {
            margin-left: 120px;
            width: 500px;
            p {
                margin-bottom: 6px;
                span {
                    color: #D9001B;
                }
            }
        }
        .download-tip {
            margin-top: 10px;
            line-height: 18px;
            color: #aaa;
            span {
                color: #409EFF;
                cursor: pointer;
            }
        }
    }
</style>

