<template>
    <div class="content-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="800px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="contentForm" :model="contentModel" :rules="ruleValidate" label-width="160px" size="mini" style="width:1000px">
                <el-form-item prop="countryName" label="国家：">{{countryName}}</el-form-item>
                <el-form-item prop="productId" label="关联商品ID：">
                    <el-input v-model="contentModel.productId" size="medium" style="width: 400px;"></el-input>
                </el-form-item>
                <el-form-item prop="contentType" label="内容类型：">
                    <el-radio-group v-model="contentModel.contentType" :disabled="radioDisabled">
                        <el-radio :label="1">图片</el-radio>
                        <el-radio :label="2">视频</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="contentPic" label="图片：" v-if="contentModel.contentType === 1">
                    <p class="content-tips">建议710*270像素以上；支持jpg、jpeg、png；支持拖拽排序；</p>
                    <el-tabs v-model="activeName" @tab-click="handleTabClick" style="width: 400px;">
                        <el-tab-pane v-for="(item, index) in languageList" :key="index" :label="item.desc" :name="item.desc">
                            <content-image-item :ref="'imageItem' + item.code" :languageCode="item.code" :mediaList="coverObj[item.code]" :max="6"></content-image-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
                <el-form-item label="视频：" v-if="contentModel.contentType === 2">
                    <p class="content-tips">建议大小100M以下；支持mp4、avi；</p>
                    <el-tabs v-model="activeName" @tab-click="handleTabClick" style="width: 400px;">
                        <el-tab-pane v-for="(item, index) in languageList" :key="index" :label="item.desc" :name="item.desc">
                            <content-video-item :ref="'videoItem' + item.code" :languageCode="item.code" :video="videoObj[item.code]"></content-video-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
                <el-form-item label="视频封面：" v-if="contentModel.contentType === 2">
                    <p class="content-tips">建议710*270像素以上，大小2M以下；支持jpg、jpeg、png；</p>
                    <el-tabs v-model="activeName" @tab-click="handleTabClick" style="width: 400px;">
                        <el-tab-pane v-for="(item, index) in languageList" :key="index" :label="item.desc" :name="item.desc">
                            <content-image-item :ref="'videoCover' + item.code" :languageCode="item.code" :mediaList="videoCoverObj[item.code]" :max="1"></content-image-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
                <el-form-item prop="sharePic" label="分享图片：">
                    <p class="content-tips">建议大小512Kb以下；</p>
                    <el-tabs v-model="activeName" @tab-click="handleTabClick" style="width: 400px;">
                        <el-tab-pane v-for="(item, index) in languageList" :key="index" :label="item.desc" :name="item.desc">
                            <content-image-item :ref="'shareItem' + item.code" :languageCode="item.code" :mediaList="shareObj[item.code]" :max="1"></content-image-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
                <el-form-item prop="shareBaseNumber" label="虚拟分享基数：">
                    <el-input-number v-model="contentModel.shareBaseNumber" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item prop="browserBaseNumber" label="虚拟阅读基数：">
                    <el-input-number v-model="contentModel.browserBaseNumber" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <span v-for="(item, index) in languageList" :key="index">
                    <el-form-item :prop="'title'+item.code" :label="'标题(' + item.desc +')：'">
                        <el-input v-model="contentModel['title'+item.code]" clearable placeholder="请输入标题" size="medium"  maxlength="500" show-word-limit style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item :prop="'content'+item.code" :label="'内容(' + item.desc + ')：'">
                        <el-input  v-model="contentModel['content'+item.code]" type="textarea" :rows="3" placeholder="请输入内容" clearable size="medium"  maxlength="2000" show-word-limit style="width: 400px;"></el-input>
                    </el-form-item>
                    <el-form-item :prop="'shareTitle'+item.code" :label="'分享标题(' + item.desc + ')：'">
                        <el-input  v-model="contentModel['shareTitle'+item.code]" type="textarea" :rows="3" placeholder="请输入内容" clearable size="medium"  maxlength="500" show-word-limit style="width: 400px;"></el-input>
                    </el-form-item>
                    <el-form-item :prop="'shareDescribe'+item.code" :label="'分享副标题(' + item.desc + ')：'">
                        <el-input  v-model="contentModel['shareDescribe'+item.code]" type="textarea" :rows="3" placeholder="请输入内容" clearable size="medium"  maxlength="500" show-word-limit style="width: 400px;"></el-input>
                    </el-form-item>
                </span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { uploadFileRequest } from '@/request/file'
    import { mapState } from 'vuex'
    import ContentImageItem from './ContentImageItem'
    import ContentVideoItem from './ContentVideoItem'
    export default {
        props: {
            editType: {
                type: String,
                default: ''
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            columnId: {
                type: String,
                default: ''
            },
            languageList: Array,
            // contentDataModel: {
            //     type: Object,
            //     default:  () => {return {}}
            // },
            contentDetail: {
                type: Object,
                default:  () => {return {}}
            }
        },
        data () {
            return {
                activeName: '简体中文',
                videoActiveName: '简体中文',
                activeLanguageCode: 'cn',
                contentModel: {
                    productId: '',
                    shareBaseNumber: 0,
                    browserBaseNumber: 0,
                    contentType: 1
                },
                ruleValidate: {
                    // productId: [
                    //     { required: true, message: '请填写商品ID', trigger: 'blur' },
                    // ],
                    contentType: [
                        { required: true, message: '请选择内容类型', trigger: 'change' }
                    ],
                    titlecn: [
                        { required: true, message: '请输入标题（简体中文）', trigger: 'blur' }
                    ],
                    contentcn: [
                        { required: true, message: '请输入内容（简体中文）', trigger: 'blur' }
                    ],
                    shareTitlecn: [
                        { required: true, message: '请输入分享标题（简体中文）', trigger: 'blur' }
                    ],
                    shareDescribecn: [
                        { required: true, message: '请输入分享副标题（简体中文）', trigger: 'blur' }
                    ],
                    titleen: [
                        { required: true, message: '请输入标题（英文）', trigger: 'blur' }
                    ],
                    contenten: [
                        { required: true, message: '请输入内容（英文）', trigger: 'blur' }
                    ],
                    shareTitleen: [
                        { required: true, message: '请输入分享标题（英文）', trigger: 'blur' }
                    ],
                    shareDescribeen: [
                        { required: true, message: '请输入分享副标题（英文）', trigger: 'blur' }
                    ],
                    titleth: [
                        { required: true, message: '请输入标题（泰文）', trigger: 'blur' }
                    ],
                    contentth: [
                        { required: true, message: '请输入内容（泰文）', trigger: 'blur' }
                    ],
                    shareTitleth: [
                        { required: true, message: '请输入分享标题（泰文）', trigger: 'blur' }
                    ],
                    shareDescribeth: [
                        { required: true, message: '请输入分享副标题（泰文）', trigger: 'blur' }
                    ],
                    titlems: [
                        { required: true, message: '请输入标题（马来文）', trigger: 'blur' }
                    ],
                    contentms: [
                        { required: true, message: '请输入内容（马来文）', trigger: 'blur' }
                    ],
                    shareTitlems: [
                        { required: true, message: '请输入分享标题（马来文）', trigger: 'blur' }
                    ],
                    shareDescribems: [
                        { required: true, message: '请输入分享副标题（马来文）', trigger: 'blur' }
                    ],
                    titleid: [
                        { required: true, message: '请输入标题（印尼文）', trigger: 'blur' }
                    ],
                    contentid: [
                        { required: true, message: '请输入内容（印尼文）', trigger: 'blur' }
                    ],
                    shareTitleid: [
                        { required: true, message: '请输入分享标题（印尼文）', trigger: 'blur' }
                    ],
                    shareDescribeid: [
                        { required: true, message: '请输入分享副标题（印尼文）', trigger: 'blur' }
                    ],
                },
                allImageItemData: {},
                allShareItemData: {},
                allVideoItemData: {},
                allVideoCoverItemData: {},
                coverObj: {
                    cn: [],
                    en: [],
                    ms: [],
                    th: [],
                    id: [],
                },
                videoObj: {
                    cn: {
                        src: ''
                    },
                    en: {
                        src: ''
                    },
                    ms: {
                        src: ''
                    },
                    th: {
                        src: ''
                    },
                    id: {
                        src: ''
                    }
                },
                videoCoverObj: {
                    cn: [],
                    en: [],
                    ms: [],
                    th: [],
                    id: [],
                },
                shareObj: {
                    cn: [],
                    en: [],
                    ms: [],
                    th: [],
                    id: [],
                },
                radioDisabled: false
            }
        },
        computed: {
            toggle: {
                get: function() {
                    if (this.dialogVisible) {
                        _.forEach(this.languageList, item => {
                            this.$set(this.contentModel, 'title'+item.code, '')
                            this.$set(this.contentModel, 'content'+item.code, '')
                            this.$set(this.contentModel, 'shareTitle'+item.code, '')
                            this.$set(this.contentModel, 'shareDescribe'+item.code, '')
                        })
                    }
                    if (this.dialogVisible && this.editType != 'add') {
                        this.fillContentData()
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            },
            dialogTitle: {
                get: function() {
                    if (this.editType === 'add') {
                        return `新增内容`
                    } else {
                        return `编辑内容`
                    }
                },
                set: function() {}
            },
             ...mapState({
                countryName:state=>state.contentManage.initData.countryName,
                countryCode:state=>state.contentManage.initData.countryCode,
            }),
            // languageList: {
            //     get: function() {
            //         let languageList = JSON.parse(this.getStore('languageList'))
            //         return languageList
            //     },
            //     set: function() {}
            // },
            contentDetailModel: {
                get: function() {
                    return this.contentDetail;
                },
                set: function() {}
            },
        },
        components: {
            ContentImageItem,
            ContentVideoItem
        },
        watch: {
        },
        created () {
            this.languageList = JSON.parse(this.getStore('languageList'))
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                console.log(this.contentModel)
                if (this.contentModel.contentType === 1) {
                    this.getAllImageItemData()
                } else {
                    this.getAllVideoItemData()
                    this.getAllVideoCoverItemData()
                }
                this.getAllShareItemData()
                let contentData = this.handleContentData()
                console.log(contentData)
                this.$refs.contentForm.validate(valid => {
                    if (valid) {
                        if (this.validateContentData(contentData) <= 0) {
                            this.$emit('on-confirm', contentData)
                        }
                    }
                })
            },
            reset() {
                this.activeName = '简体中文'
                this.contentModel = {
                    productId: '',
                    shareBaseNumber: 0,
                    browserBaseNumber: 0,
                    contentType: 1
                },
                this.coverObj = {cn: [], en: [], ms: [], th: [], id: []},
                this.videoObj = {cn: { src: '' }, en: { src: '' }, ms: { src: '' }, th: { src: '' }, id: { src: ''}}
                this.videoCoverObj = {cn: [], en: [], ms: [], th: [], id: []},
                this.shareObj = {cn: [], en: [], ms: [], th: [], id: []},
                this.radioDisabled = false
                this.$refs.contentForm.resetFields()
            },
            uploadPic(file) {
                let params = new FormData();
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'product'
                }
                params.append('file',file.file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        console.log(res)
                        this.contentModel.pushPic = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delPic() {
            },
            handleTabClick() {},
            getAllImageItemData() {
                let allImageItem = {}
                _.forEach(this.$refs, (item, key)=> {
                    if (key.indexOf('imageItem') > -1) {
                        allImageItem[key] = item
                    }
                })
                console.log(allImageItem)
                _.forEach(allImageItem, (item, key)=> {
                    console.log(item,key)
                    if (item[0]) {
                        this.allImageItemData[key.substr(9)] = item[0].picList
                    }
                })
            },
            getAllVideoItemData() {
                let allVideoItem = {}
                _.forEach(this.$refs, (item, key)=> {
                    if (key.indexOf('videoItem') > -1) {
                        allVideoItem[key] = item
                    }
                })
                _.forEach(allVideoItem, (item, key)=> {
                    if (item[0]) {
                        this.allVideoItemData[key.substr(9)] = [item[0].videoInfo]
                    }
                })
                console.log(this.allVideoItemData)
            },
            getAllVideoCoverItemData() {
                let allVideoCoverItem = {}
                _.forEach(this.$refs, (item, key)=> {
                    if (key.indexOf('videoCover') > -1) {
                        allVideoCoverItem[key] = item
                    }
                })
                _.forEach(allVideoCoverItem, (item, key)=> {
                    if (item[0]) {
                        this.allVideoCoverItemData[key.substr(10)] = item[0].picList
                    }
                })
            },
            getAllShareItemData() {
                let allShareItem = {}
                _.forEach(this.$refs, (item, key)=> {
                    if (key.indexOf('shareItem') > -1) {
                        allShareItem[key] = item
                    }
                })
                _.forEach(allShareItem, (item, key)=> {
                    if (item[0]) {
                        this.allShareItemData[key.substr(9)] = item[0].picList
                    }
                })
            },
            handleContentData() {
                let articleRequestObj = {}
                articleRequestObj.contentType = 2 // 1 图文，2 Feed
                articleRequestObj.specialColumnId = this.columnId
                if (this.validateProductId(_.trim(this.contentModel.productId))) {
                    if (_.trim(this.contentModel.productId) != '') {
                        articleRequestObj.productIds = [_.trim(this.contentModel.productId)]
                    } else {
                        articleRequestObj.productIds = []
                    }
                } else {
                    this.$message.warning('商品ID格式有误！')
                    return
                }
                if (this.contentModel.shareBaseNumber === undefined || this.contentModel.browserBaseNumber === undefined){
                    this.$message.warning('请填写虚拟数据')
                    return
                }
                articleRequestObj.shareBaseNumber = this.contentModel.shareBaseNumber + ''
                articleRequestObj.browserBaseNumber = this.contentModel.browserBaseNumber + ''

                let articleLangInfoList = []
                 _.forEach(this.languageList, language => {
                    let articleLangInfo = {}
                    if (this.contentModel.contentType === 1) {
                        let coverPicList = []
                        console.log(language.code)
                        _.forEach(this.allImageItemData[language.code], item => {
                            coverPicList.push(item.originalLink)
                        })
                        articleLangInfo.coverPic = coverPicList
                    } else {
                        if (this.allVideoItemData[language.code].length > 0) {
                            articleLangInfo.videoUrl = this.allVideoItemData[language.code][0].src
                        }
                        if (this.allVideoCoverItemData[language.code].length > 0) {
                            articleLangInfo.videoCover = this.allVideoCoverItemData[language.code][0].originalLink
                        }
                    }

                    if (this.allShareItemData[language.code].length > 0) {
                        articleLangInfo.sharePic = this.allShareItemData[language.code][0].originalLink
                    }
                    if (this.contentModel.contentType === 1) {
                        if (this.contentModel['title'+language.code] || articleLangInfo.coverPic.length > 0) {
                            articleLangInfo.language = language.code
                            articleLangInfo.articleTitle = this.contentModel['title'+language.code]
                            articleLangInfo.articleDescribe = this.contentModel['content'+language.code]
                            articleLangInfo.shareTitle = this.contentModel['shareTitle'+language.code]
                            articleLangInfo.shareDescribe = this.contentModel['shareDescribe'+language.code]
                            articleLangInfoList.push(articleLangInfo)
                        }
                    } else {
                        if (this.contentModel['title'+language.code] || articleLangInfo.videoUrl != '') {
                            articleLangInfo.language = language.code
                            articleLangInfo.articleTitle = this.contentModel['title'+language.code]
                            articleLangInfo.articleDescribe = this.contentModel['content'+language.code]
                            articleLangInfo.shareTitle = this.contentModel['shareTitle'+language.code]
                            articleLangInfo.shareDescribe = this.contentModel['shareDescribe'+language.code]
                            articleLangInfoList.push(articleLangInfo)
                        }
                    }

                })
                articleRequestObj.articleLangInfos = articleLangInfoList
                return articleRequestObj
            },
            fillContentData() {
                this.contentModel.articleCode = this.contentDetailModel.articleCode
                console.log(this.contentDetailModel)
                if (this.contentDetailModel.productIds.length > 0) {
                    this.contentModel.productId = this.contentDetailModel.productIds[0]
                } else {
                    this.contentModel.productId = ''
                }
                this.radioDisabled = true
                console.log(this.contentDetailModel.articleLangInfo[0])
                if (this.contentDetailModel.articleLangInfo.length > 0 && this.contentDetailModel.articleLangInfo[0].videoUrl === '') {
                    this.contentModel.contentType = 1
                } else {
                    this.contentModel.contentType = 2
                }
                this.contentModel.shareBaseNumber = parseInt(this.contentDetailModel.shareBaseNumber)
                this.contentModel.browserBaseNumber = parseInt(this.contentDetailModel.browserBaseNumber)
                _.forEach(this.languageList, language => {
                    _.forEach(this.contentDetailModel.articleLangInfo, articleLang => {
                        if (language.code === articleLang.language) {
                            this.contentModel['title'+language.code] = articleLang.articleTitle
                            this.contentModel['content'+language.code] = articleLang.articleDescribe
                            this.contentModel['shareTitle'+language.code] = articleLang.shareTitle
                            this.contentModel['shareDescribe'+language.code] = articleLang.shareDescribe
                            let coverItemList = []
                            _.forEach(articleLang.coverPic, (item, index)=> {
                                let coverItem = {}
                                coverItem.id = index
                                coverItem.originalLink = item
                                coverItem.src = this.dealShowFileSrc(item)
                                coverItemList.push(coverItem)
                            })
                            this.coverObj[language.code] = coverItemList
                            let shareItemList = []
                            let shareItem = {
                                id: 1,
                                src: this.dealShowFileSrc(articleLang.sharePic),
                                originalLink: articleLang.sharePic
                            }
                            shareItemList.push(shareItem)
                            this.shareObj[language.code] = shareItemList

                            let videoItemList = []
                            let videoItem = {
                                src: articleLang.videoUrl,
                            }
                            videoItemList.push(videoItem)
                            this.videoObj[language.code] = videoItem

                            let videoCoverItemList = []
                            let videoCoverItem = {
                                id: 1,
                                src: this.dealShowFileSrc(articleLang.videoCover),
                                originalLink: articleLang.videoCover
                            }
                            videoCoverItemList.push(videoCoverItem)
                            this.videoCoverObj[language.code] = videoCoverItemList
                        }
                    })
                })
            },
            validateContentData(data) {
                console.log(data)
                let flag = 0
                let articleLangInfos = data.articleLangInfos
                if (this.contentModel.contentType === 1) {
                    _.forEach(articleLangInfos, langInfo => {
                        if (langInfo.language === 'cn' || langInfo.language === 'en') {
                            if (langInfo.coverPic.length === 0) {
                                flag++
                                 this.$message.warning('图片（中文或英文）不能为空！')
                            }
                            if (!langInfo.sharePic || langInfo.sharePic === '') {
                                flag++
                                this.$message.warning('分享图片（中文或英文）不能为空！')
                            }
                        } else {
                            if (langInfo.articleTitle != '' || langInfo.articleDescribe != '' || langInfo.shareTitle != '' || langInfo.coverPic.length > 0) {
                                if (!(langInfo.articleTitle != '' && langInfo.articleDescribe != '' && langInfo.shareTitle != '' &&  langInfo.coverPic.length > 0 && (langInfo.sharePic && langInfo.sharePic != ''))) {
                                    flag++
                                    let langName = ''
                                    if (langInfo.language === 'ms') {
                                        langName = '马来语'
                                    } else if (langInfo.language === 'th') {
                                        langName = '泰语'
                                    } else if (langInfo.language === 'id') {
                                        langName = '印尼语'
                                    }
                                    this.$message.warning(`请检查数据，【${langName}】部分文案和图片不能为空！`)
                                }
                            }
                        }
                    })
                } else {
                    _.forEach(articleLangInfos, langInfo => {
                        if (langInfo.language === 'cn' || langInfo.language === 'en') {
                            if (!langInfo.videoUrl || langInfo.videoUrl === '') {
                                flag++
                                this.$message.warning('视频（中文或英文）不能为空！')
                            }
                            if (!langInfo.videoCover || langInfo.videoCover === '') {
                                flag++
                                 this.$message.warning('视频封面（中文或英文）不能为空！')
                            }
                            if (!langInfo.sharePic || langInfo.sharePic === '') {
                                flag++
                                this.$message.warning('分享图片（中文或英文）不能为空！')
                            }
                        } else {
                            if (langInfo.articleTitle != '' || langInfo.articleDescribe != '' || langInfo.shareTitle != '' || langInfo.shareDescribe != '' || langInfo.videoUrl != '') {
                                if (!(langInfo.articleTitle != '' && langInfo.articleDescribe != '' && langInfo.shareTitle != '' && langInfo.shareDescribe != '' &&  langInfo.videoUrl != '' && (langInfo.videoCover && langInfo.videoCover != '') && (langInfo.sharePic && langInfo.sharePic != ''))) {
                                    flag++
                                    let langName = ''
                                    if (langInfo.language === 'ms') {
                                        langName = '马来语'
                                    } else if (langInfo.language === 'th') {
                                        langName = '泰语'
                                    } else if (langInfo.language === 'id') {
                                        langName = '印尼语'
                                    }
                                    this.$message.warning(`请检查数据，【${langName}】部分文案和图片不能为空！`)
                                }
                            }
                        }
                    })

                }

                return flag
            },
            validateProductId(value) {
                let flag = false
                if ( value != '') {
                    if (isNaN(value))  {
                        flag = false
                    } else {
                        const parsed = parseInt(value, 10)
                        if (parsed <= 0) {
                            flag = false
                        } else {
                            flag = true
                        }
                    }
                } else {
                    flag = true
                }
                return flag
            }
        }
    }
</script>

<style lang="scss">
    .content-edit-dialog {
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
    .push-cover-image-wrapper {
        display: inline-block;
        width: 110px;
        height: 110px;
        overflow: hidden;
        .el-upload--picture-card {
            width: 110px;
            height: 110px;
            line-height: 110px;
        }
        .cover-image {
            width: 110px;
            height: 110px;
            margin-left: 10px;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            padding: 4px;
            overflow: hidden;
            &:hover {
                .operate-area {
                    opacity: .5;
                    transition: opacity .3s;
                    border-radius: 6px;
                }
            }
            .operate-area {
                text-align: center;
                position: absolute;
                opacity: 0;
                background: #000000;
                height: 110px;
                line-height: 110px;
                top: -1px;
                left: 10px;
                width: 110px;
                box-sizing: border-box;
                color: #fff;
                font-size: 16px;
            }
        }
    .standard-img {
        margin-left: 10px;
    }
}
</style>

<style lang="scss" scoped>
    .content-edit-dialog {
        .info-title {
            color: #303133;
            span {
                font-size: 12px;
                color: #666;
            }
        }
        .content-tips {
            color: #aaa;
        }
    }
</style>
