<template>
     <el-dialog
        title="版本信息"
        :visible.sync="toggle"
        width="800px"
        :before-close="cancel"
        class="version-edit">
        <el-form ref="versionDetailForm" :model="versionDetail" :rules="ruleValidate" label-width="150px" size="mini" style="width:1000px">
            <el-form-item prop="clientType" label="客户端类型：">
                <el-select v-model="versionDetail.clientType" size="medium" :disabled="editType === 'edit'">
                    <el-option v-for="(item, index) in clientTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="versionDetail.clientType === 1" prop="versionCode" label="安卓安装包：">
                <div class="app-url">
                    <el-upload action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                        <el-button icon="el-icon-upload2" :loading="uploadLoading" :disable="uploadLoading"
                            size="medium" plain>
                            上传文件
                        </el-button>
                    </el-upload>
                    <div class="url-desc">{{versionDetail.appUrl === '' ? '' : `文件名${versionDetail.appUrl}`}}</div>
                </div>
            </el-form-item>
            <el-form-item prop="versionCode" label="版本号：">
                <el-input :disabled="editType === 'edit'" v-model="versionDetail.versionCode" clearable placeholder="请输入内容" size="medium" style="width: 400px"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="url" label="版本ID：">
                <el-input v-model="pushSetting.versionId" clearable placeholder="请输入内容" size="medium" style="width: 400px"></el-input>
            </el-form-item> -->
            <el-form-item prop="updateType" label="更新类型：">
                <el-radio-group v-model="versionDetail.updateType">
                    <el-radio :label="1">常规更新</el-radio>
                    <el-radio :label="2">强制更新</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="country" label="更新国家：">
                <el-checkbox-group v-model="versionDetail.country">
                    <el-checkbox v-for="val in countryList" :label="val.shortCode" :key="val.shortCode">{{val.nameCn}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <span v-for="(item, index) in languageList" :key="index">
                <!-- <el-form-item :prop="versionDetail.contentLang[index].content" :label="'更新描述(' + item.desc +')：'">
                        <el-input type="textarea" v-model="versionDetail.contentLang[index].content" clearable placeholder="请输入版本更新内容，限制字数300字符" size="medium"  maxlength="300" show-word-limit style="width:400px;"></el-input>
                </el-form-item> -->
                <el-form-item :prop="item.code" :label="'更新描述(' + item.desc +')：'">
                        <el-input  v-model="versionDetail[item.code]" type="textarea" :rows="3" placeholder="请输入版本更新内容，限制字数300字符" clearable size="medium"  maxlength="300" show-word-limit style="width: 400px;"></el-input>
                </el-form-item>
            </span>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">保 存</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { EditAppVersion, CreateAppVersion } from '@/request/pushtask'
    import { uploadFileRequest } from '@/request/file'

    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            versionDetailModel: Object,
            editType: String
        },
        data () {
            return {
                versionDetail: {
                    clientType: '',
                    updateType: 1,
                    versionCode: '',
                    appUrl: '',
                    country: ['MY','TH','ID',"SG"],
                    cn: '',
                    en: '',
                    th: '',
                    ms: '',
                    id: '',
                },
                id: '',
                clientTypeList:[{
                    value: 1,
                    label: '安卓'
                },{
                    value: 2,
                    label: 'IOS'
                }],
                fileUrl: '',
                uploadLoading: false,
                ruleValidate: {
                    clientType: [
                        { required: true, message: '请选择客户端类型', trigger: 'change' }
                    ],
                    updateType: [
                        { required: true, message: '请选择更新类型', trigger: 'change' }
                    ],
                    versionCode: [
                        { required: true, message: '请输入版本号', trigger: 'blur' }
                    ],
                    appUrl: [
                        { required: true, message: '请上传安卓安装包', trigger: 'change' }
                    ],
                    country: [
                        { required: true, message: '请选择更新货架', trigger: 'change' }
                    ],
                    cn: [
                        { required: true, message: '请输入更新描述（简体中文）', trigger: 'blur' }
                    ],
                    en: [
                        { required: true, message: '请输入更新描述（简体中文）', trigger: 'blur' }
                    ]
                },
            }
        },
         computed: {
            toggle: {
                get: function() {
                    // if (this.dialogVisible) {
                    //     _.forEach(this.languageList, item => {
                    //         this.$set(this.versionDetail, item.code, '')
                    //         console.log(this.versionDetail)
                    //     })
                    // }
                    if (this.dialogVisible && this.editType != 'add') {
                        this.fillContentData()
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            },
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        watch: {
            versionDetail: {
                handler (val) {},
                deep: true
            }
        },
        methods: {
            fillContentData() {
                this.versionDetail.clientType = this.versionDetailModel.clientType
                this.versionDetail.updateType = this.versionDetailModel.updateType
                this.versionDetail.versionCode = this.versionDetailModel.versionCode
                this.versionDetail.appUrl = this.versionDetailModel.appUrl
                this.versionDetail.country = this.versionDetailModel.country
                this.id = this.versionDetailModel.id
                _.forEach(this.languageList, language => {
                    _.forEach(this.versionDetailModel.contentLang, lang => {
                        if (language.code == lang.language) {
                            this.versionDetail[language.code] = lang.content
                        }
                    })
                })
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
                        this.versionDetail.appUrl = res.original_link
                        console.log(this.fileUrl)
                    } else {
                        this.$message.error('文件上传失败，请重试！')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            cancel () {
                this.versionDetail = Object.assign(this.versionDetail,{
                    clientType: '',
                    updateType: 1,
                    versionCode: '',
                    appUrl: '',
                    country: ['MY','TH','ID',"SG"],
                    cn: '',
                    en: '',
                    th: '',
                    ms: '',
                    id: '',
                })
                this.$emit('closeDialog')
                console.log(this.versionDetail)
            },
            confirm () {
                if (this.versionDetail.clientType === '') {
                    this.$message.error('请选择客户端类型！')
                    return
                }
                if (this.versionDetail.versionCode === '') {
                    this.$message.error('请输入版本号！')
                    return
                }
                if (this.versionDetail.appUrl === '' && this.versionDetail.clientType == 1) {
                    this.$message.error('请上传安卓安装包！')
                    return
                }
                if (this.versionDetail.country.length === 0) {
                    this.$message.error('请选择更新国家')
                    return
                }
                if (this.versionDetail.country.length === 0) {
                    this.$message.error('请选择更新国家')
                    return
                }
                if (this.versionDetail.cn === '') {
                    this.$message.error('请更新描述(简体中文)')
                    return
                }
                if (this.versionDetail.en === '') {
                    this.$message.error('请更新描述(英语)')
                    return
                }
                let lang = [{
                        language: 'cn',
                        content: ''
                    },{
                        language: 'en',
                        content: ''
                    },{
                        language: 'ms',
                        content: ''
                    },{
                        language: 'th',
                        content: ''
                    },{
                        language: 'id',
                        content: ''
                    }]
                for (const iterator of lang) {
                    for (const key in this.versionDetail) {
                        if (iterator.language == key) {
                            iterator.content = this.versionDetail[key]
                        }
                    }
                }
                if (this.editType === 'add') {
                    let params = {
                        clientType: this.versionDetail.clientType,
                        versionCode: this.versionDetail.versionCode,
                        updateType: this.versionDetail.updateType,
                        country: this.versionDetail.country.join(','),
                        appUrl: this.versionDetail.appUrl,
                        lang
                    }
                    CreateAppVersion(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.versionDetail = Object.assign(this.versionDetail,{
                                clientType: '',
                                updateType: 1,
                                versionCode: '',
                                appUrl: '',
                                country: ['MY','TH','ID',"SG"],
                                cn: '',
                                en: '',
                                th: '',
                                ms: '',
                                id: '',
                            })
                            this.id = ''
                            this.$emit('confirmDialog')
                        }
                    })
                } else {
                    let params = {
                        id: this.id,
                        updateType: this.versionDetail.updateType,
                        country: this.versionDetail.country.join(','),
                        appUrl: this.versionDetail.appUrl,
                        lang
                    }
                    EditAppVersion(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.versionDetail = Object.assign(this.versionDetail,{
                                clientType: null,
                                updateType: 1,
                                versionCode: '',
                                appUrl: '',
                                country: ['MY','TH','ID',"SG"],
                                cn: '',
                                en: '',
                                th: '',
                                ms: '',
                                id: '',
                            })
                            this.id = ''
                            console.log(this.versionDetail)
                            this.$emit('confirmDialog')
                        }
                    })
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
    .version-edit{
        .app-url{
            display: flex;
            align-items: center;
            .url-desc{
                margin-left: 10px;
                font-size: 14px;
                color: rgb(162,162,162);
            }
        }
    }
</style>