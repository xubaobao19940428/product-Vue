<template>
    <div class="product-media-wrapper">
        <!-- <el-button type="success" size="mini" @click="getAllMediaFormData">当前模块数据</el-button> -->
        <div class="batch-operation">
            <el-button type="primary" size="mini" plain @click="batchUpload">一键传图</el-button>
            <!-- <el-button type="primary" size="mini" plain @click="batchSyncOtherLanguage">同步至其他语言</el-button> -->
            <el-button type="primary" size="mini" plain @click="showSyncMedia">同步至其他语言</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane v-for="(item, index) in languageList" :key="index" :label="item.desc" :name="item.desc">
                <media-form :ref="'mediaForm' + item.code" :languageCode="item.code" :batchData="batchMediaData" :media="mediaFormList[item.code]" :video="videoList[item.code]"
                    @on-translate="handleTranslate"></media-form>
            </el-tab-pane>
        </el-tabs>
        <batch-upload-img-dialog :orgUrl="orgUrl" :dialogVisible="dialogVisible" @on-cancle="onCancleBatchUpload" @on-submit="onSubmitBatchUpload"></batch-upload-img-dialog>
        <sync-media-dialog :dialogVisible="syncDialogVisible" @on-cancle="onCancleSync" @on-confirm="onSubmitSync"></sync-media-dialog>
    </div>
</template>

<script>
    import MediaForm from './MediaForm';
    import BatchUploadImgDialog from './BatchUploadImgDialog'
    import SyncMediaDialog from './SyncMediaDialog'
    export default {
        // 商品图片视频
        name: 'ProductMedia',
        props: {
            mediaInfo: {
                type: Object,
                default: () => {}
            },
            videoInfo: {
                type: Object,
                default: () => {}
            },
            orgUrl: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                activeName: '简体中文',
                activeLanguageCode: 'cn',
                allMediaFormData: {},
                dataValid: false,
                dialogVisible: false,
                batchMediaData: {},
                syncDialogVisible: false
                // videoList: {},
                // mediaFormList: {}
            }
        },
        computed: {
        },
        components: {
            MediaForm,
            BatchUploadImgDialog,
            SyncMediaDialog
        },
        computed: {
            languageList() {
                // let languageList = this.$store.state.dict.languageList
                let languageList = JSON.parse(this.getStore('languageList'))
                _.forEach(languageList, item => {
                    let videoInfo =  {
                        src: ''
                    }
                    let mediaInfo = {
                        rotationPics: [], //商品主图（轮播图）
                        detailPics: [], //商品详情图
                        desc: ''
                    }
                    // this.$set(this.videoList, item.code, videoInfo)
                    // this.$set(this.mediaFormList, item.code, mediaInfo)
                })
                return languageList
            },
            mediaFormList() {
                return this.mediaInfo
            },
            videoList() {
                return this.videoInfo
            }
        },
        methods: {
            getAllMediaFormData() {
                this.removeStore('productMediaInfo')
                // console.log('this.mediaInfo:',this.mediaInfo)
                // console.log('this.videoList:',this.videoList)
                let allMediaForm = this.$refs
                _.forEach(allMediaForm, (item, key)=> {
                    // 触发表单校验
                    if (item.length > 0) {
                        item[0].getMediaFormData()
                        this.allMediaFormData[key.substr(9)] = item[0].mediaFormData
                    }
                })
                // 校验商品主图是否为空
                let languageName = []
                let languageList = [{code: "cn", name: "简体中文", desc: "简体中文"},{code: "en", name: "English", desc: "英语"}]

                let flag = true
                _.forEach(languageList, (language) => {
                    if (this.allMediaFormData[language.code].rotationPics && this.allMediaFormData[language.code].rotationPics.length < 3) {
                        languageName.push(language.name)
                        flag = false
                    }
                })
                this.dataValid = flag
                if (languageName.length > 0) {
                    let languageNameStr = languageName.join('、')
                    this.$message.error(`${languageNameStr}商品主图不能少于3张`)
                }
                console.log('产品影音数据',this.allMediaFormData)
                this.setStore('productMediaInfo', this.mediaInfo['cn'])
            },
            handleTabClick(tab) {
                this.activeLanguageCode = this.languageList[tab.index].code
            },
            batchUpload () {
                this.dialogVisible = true
            },
            onCancleBatchUpload () {
                this.dialogVisible = false
            },
            onSubmitBatchUpload (mediaData) {
                this.dialogVisible = false
                this.batchMediaData = _.cloneDeep(mediaData)
                let refName = 'mediaForm' + this.activeLanguageCode
                setTimeout(() => {
                    this.$refs[refName][0].updataMediaInfo()
                }, 100)
            },
            batchSyncOtherLanguage () {
                let refName = 'mediaForm' + this.activeLanguageCode

                // 图片、描述同步
                let sourceMediaForm = {}
                sourceMediaForm = this.$refs[refName][0].mediaForm
                // 描述文案不覆盖
                _.forEach(this.languageList, item => {
                    if (this.activeLanguageCode != item.code) {
                        let targetMediaForm = this.$refs['mediaForm' + item.code][0].mediaForm

                        if (targetMediaForm.desc === '') {
                            targetMediaForm =  _.cloneDeep(sourceMediaForm)
                        } else {
                            targetMediaForm.detailPics = sourceMediaForm.detailPics
                            targetMediaForm.rotationPics = sourceMediaForm.rotationPics
                        }
                        this.$set(this.mediaFormList, item.code, targetMediaForm)
                    }
                })
                // 视频同步
                let sourcVideoInfo = {}
                sourcVideoInfo = this.$refs[refName][0].videoInfo
                _.forEach(this.languageList, item => {
                    this.$set(this.videoList, item.code, _.cloneDeep(sourcVideoInfo))
                })
                this.$message.success('图片视频一键同步至其他语言成功！')
            },
            batchSyncOtherLanguageNew (sourceLang, targetLangList) {
                let refName = 'mediaForm' + sourceLang

                // 图片、描述同步
                let sourceMediaForm = {}
                sourceMediaForm = this.$refs[refName][0].mediaForm
                // 描述文案不覆盖
                _.forEach(targetLangList, item=> {
                    if (sourceLang != item) {
                        let targetMediaForm = this.$refs['mediaForm' + item][0].mediaForm

                        if (targetMediaForm.desc === '') {
                            targetMediaForm =  _.cloneDeep(sourceMediaForm)
                        } else {
                            targetMediaForm.detailPics = sourceMediaForm.detailPics
                            targetMediaForm.rotationPics = sourceMediaForm.rotationPics
                        }
                        // this.$set(this.mediaFormList, item, JSON.parse(JSON.stringify(targetMediaForm)))
                        this.$set(this.mediaFormList, item, targetMediaForm)
                    }
                })
                // 视频同步
                let sourcVideoInfo = {}
                sourcVideoInfo = this.$refs[refName][0].videoInfo
                _.forEach(targetLangList, item => {
                    this.$set(this.videoList, item, _.cloneDeep(sourcVideoInfo))
                })
                this.$message.success('图片视频一键同步至其他语言成功！')
            },
            handleTranslate(translateResult) {
                _.forEach(translateResult, (value, key) => {
                    this.$set(this.mediaFormList[key], 'desc', value)
                })
                this.$message.success('商品文本描述一键翻译成功！')
            },
            showSyncMedia() {
                this.syncDialogVisible = true
            },
            onCancleSync() {
                this.syncDialogVisible = false
            },
            onSubmitSync(data) {
                this.syncDialogVisible = false
                this.batchSyncOtherLanguageNew(data.sourceLang, data.targetLang)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .product-media-wrapper {
        padding: 10px 60px;
        .batch-operation {
            width: 1000px;
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
