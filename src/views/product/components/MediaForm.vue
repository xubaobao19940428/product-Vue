<template>
    <div class="media-form-wrapper">
        <el-form  ref="mediaForm" :model="mediaForm" :rules="ruleValidate" label-width="100px" class="media-form">
            <el-form-item label="商品主图：" prop="rotationPics">
                <p class="tips">建议710*270像素以上，大小2M以下；支持jpg、jpeg、png；至少3张最多8张，第一张为主图；支持拖拽排序</p>
                <draggable :list="mediaForm.rotationPics" :disabled="!enabled" class="list-group image-show" ghost-class="ghost" :move="checkMove" @start="dragging = true" @end="dragging = false" v-bind="getOptions()">
                    <div class="list-group-item image-box" v-for="(element, index) in mediaForm.rotationPics" :key="element.originalLink" @click="openPreview('rotationPics', index)">
                        <div class="darg-item">
                            <el-image :src="element.src" class="image-item"></el-image>
                            <div class="operate-area">
                                <i class="el-icon-delete" @click.stop="delDetailImgItem('rotation', index)"></i>
                            </div>
                        </div>
                    </div>
                    <div slot="footer" class="upload-box nodrag">
                        <el-upload
                          action=""
                          list-type="picture-card"
                          multiple
                          :accept="IMG_ACCEPT"
                          :http-request="uploadRotationPic"
                          :show-file-list="false"
                          :before-upload="onImgBeforeUpload"
                          :on-preview="handlePictureCardPreview">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </draggable>
            </el-form-item>
            <el-form-item label="商品视频：" prop="video">
                <p class="tips">建议720*1080像素以上，大小10M以下；支持mp4、avi</p>
                <div class="product-video">
                    <div class="video-wrap" v-if="videoInfo.src != ''">
                        <video ref="media" width="100%" height="100%">
                            <source :src="videoInfo.src" />
                            <object :data="videoInfo.src" width="100%" height="100%" >
                                <embed :src="videoInfo.src" width="100%" height="100%">
                            </object>
                        </video>
                        <div class="operate-area">
                            <i class="el-icon-video-play" @click="showVideo()"></i>
                            <i class="el-icon-delete" @click="delVideoItem()"></i>
                        </div>
                    </div>
                    <div class="upload-box"  v-show="videoInfo.src === ''">
                        <el-upload
                          action=""
                          list-type="picture-card"
                          multiple
                          :accept="VIDEO_ACCEPT"
                          :http-request="uploadVideo"
                          :show-file-list="false">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="商品详情图：" prop="detailImg">
                <p class="tips">建议710*270像素以上，大小2M以下；支持jpg、jpeg、png；支持拖拽排序</p>
                <draggable :list="mediaForm.detailPics" :disabled="!enabled" class="list-group image-show" ghost-class="ghost" :move="checkMove" @start="dragging = true" @end="dragging = false" v-bind="getOptions()">
                    <div class="list-group-item image-box" v-for="(element, index) in mediaForm.detailPics" :key="element.originalLink" @click="openPreview('detailPics', index)">
                        <div class="darg-item">
                            <el-image :src="element.src" class="image-item"></el-image>
                            <div class="operate-area">
                                <i class="el-icon-delete" @click.stop="delDetailImgItem('detail',index)"></i>
                            </div>
                        </div>
                    </div>
                    <div slot="footer" class="upload-box nodrag">
                        <el-upload
                          action=""
                          list-type="picture-card"
                          multiple
                          :accept="IMG_ACCEPT"
                          :http-request="uploadDetailPic"
                          :show-file-list="false"
                          :before-upload="onImgBeforeUpload">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </draggable>
            </el-form-item>
            <el-form-item label="文本描述：" prop="description">
                <p class="tips">
                    如有需要可为商品填写文本描述，它将展示在详情图上方，可为不同国家不同语言单独设置
                    <el-button v-if="languageCode === 'cn'" :loading="transLoading" type="primary" size="mini" plain @click="translate(mediaForm.desc)">一键翻译</el-button>
                </p>
                <el-input v-model="mediaForm.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入内容" ></el-input>
                <!-- <table class="table table-bordered table-info">
                    <tbody>
                        <tr v-for="(item, index) in languageList" :key="index">
                            <th> {{item.name}}{{item.code}} </th>
                            <td>
                                <el-input v-model="mediaForm.desc[item.code]" clearable size="medium" placeholder="请输入"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table> -->
            </el-form-item>
        </el-form>

        <el-dialog title="" :visible.sync="videoDialog" width="800px" :before-close="handleCloseVideo">
            <d-player ref="player" :options="options"  @play="play"></d-player>
                <span slot="footer" class="dialog-footer"></span>
            </el-dialog>
        <!-- <el-button type="success" size="mini" @click="getMediaFormData">当前模块数据</el-button> -->
        <image-preview v-show="image.show" :close="closePreview" :index="image.index" :list="image.list">
        </image-preview>
    </div>
</template>

<script>

    import draggable from 'vuedraggable'
    import { uploadFileRequest } from '@/request/file'
    import { getOneKeyTranslation } from '@/request/i18n'
    import VueDPlayer from 'vue-dplayer'
    import 'vue-dplayer/dist/vue-dplayer.css'
    import imagePreview from '@/components/imagePreview'

    const MAX_ROTATION_LENGTH = 8 //商品主图大张数
    const MAX_DETAIL_LENGTH = 20 //商品详情图大张数

    export default {
        // 商品图片视频
        name: 'MediaForm',
        props: {
            batchData: {
                type: Object,
                default: () => {}
            },
            // 图片和描述信息
            media: {
                type: Object,
                default: () => {}
            },
            video: {
                type: Object,
                default: () => {}
            },
            languageCode: {
                type: String,
                default: () => {}
            }
        },
        data() {
            return {
                transLoading: false,
                // mediaForm: {
                //     rotationPics: [], //商品主图（轮播图）
                //     detailPics: [], //商品详情图
                //     desc: ''
                // },
                ruleValidate: {
                    // rotationPics: [{
                    //     required: true,
                    //     message: '请上传商品主图'
                    // }]
                },
                enabled: true,
                dragging: false,
                IMG_ACCEPT: '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP',
                VIDEO_ACCEPT: '.mp4,.avi,.MP4,.AVI',
                videoDialog: false,
                player: null,
                options: {
                    video: {
                      url: '',
                      pic: ''
                    },
                    autoplay: true,
                    contextmenu: [
                        {
                            text: '',
                            link: ''
                        }
                    ]
                },
                image: {
                    show: false,
                    index: 0,
                    list: []
                },
                mediaFormData: null,
                dataValid: false
            }
        },
        computed: {
            languageList() {
                return this.$store.state.dict.languageList
            },
            videoInfo() {
                return this.video
            },
            mediaForm() {
                return this.media
            },
            batchMediaData() {
                return this.batchData
            }
        },
        components: {
            draggable,
            'd-player': VueDPlayer,
            imagePreview
        },
        mounted() {

        },
        methods: {
            checkMove: function(e) {
                window.console.log("index: " + e.draggedContext.futureIndex);
            },
            getOptions() {
                return {animation: 150, handle:'.darg-item', ghostClass:'ghostClass'}
            },
            handlePictureCardPreview(){},
            handleRemove() {},
            uploadRotationPic(file) {
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
                        let length = this.mediaForm.rotationPics.length
                        if (length < MAX_ROTATION_LENGTH) {
                            let picObj = {
                                id: length,
                                originalLink: res.original_link,
                                src: this.dealShowFileSrc(res.small_link)
                            }
                            this.mediaForm.rotationPics.push(picObj)
                        } else {
                            this.$message.warning(`商品主图最多${MAX_ROTATION_LENGTH}张！`)
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            uploadDetailPic(file) {
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
                        let length = this.mediaForm.detailPics.length
                        if (length < MAX_DETAIL_LENGTH) {
                            let picObj = {
                                id: length,
                                originalLink: res.original_link,
                                src: this.dealShowFileSrc(res.small_link)
                            }
                            this.mediaForm.detailPics.push(picObj)
                        } else {
                            this.$message.warning(`商品详情图最多${MAX_DETAIL_LENGTH}张！`)
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            uploadVideo(file) {
                let params = new FormData();
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'video'
                }
                params.append('file',file.file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        this.videoInfo.originalLink = res.original_link
                        this.videoInfo.src = this.dealShowFileSrc(res.original_link)
                        this.videoInfo.coverLink = this.dealShowFileSrc(res.coverLink)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delVideoItem() {
                if (this.videoInfo.src) {
                    this.videoInfo.src = ''
                    this.videoInfo.originalLink = ''
                }
                this.$set(this.mediaForm, 'video', '')
            },
            // 播放视频
            showVideo() {
                this.videoDialog = true
                this.options.video.url = this.videoInfo.src
                this.options.video.pic = this.videoInfo.coverLink
                this.$nextTick(() => {
                    this.player = this.$refs.player.dp
                })
            },
            play() {
                console.log('play callback')
            },
            handleCloseVideo() {
                this.videoDialog = false
                this.$refs.player.dp.pause()
                this.$refs.player.dp.seek(0);
            },
            uploadDetailSuccess(file) {
                console.log(file)
            },
            delDetailImgItem(type, index) {
                console.log(this.mediaForm)
                if (type === 'rotation') {
                    this.mediaForm.rotationPics.splice(index, 1)
                } else {
                    this.mediaForm.detailPics.splice(index, 1)
                }
            },
            /**
             * 一键翻译
             */
            translate(originContent) {
                if (_.isEmpty(originContent)) {
                    this.$message.warning('请先填写中文内容')
                    return
                }
                this.transLoading = true
                let result = {}
                let params = this.formatTranslateParam('cn', originContent)
                getOneKeyTranslation(this.filterData(params)).then((res) => {
                    let oneKeyTranslationUnit = res.oneKeyTranslationUnit
                    result = this.formatTranslateResult(oneKeyTranslationUnit)
                    this.$emit('on-translate', result)
                    this.transLoading = false
                }).catch((err) => {
                    console.log(err)
                })
            },
            formatTranslateParam(fromLanguageCode, originContent) {
                let result = {}
                let oneKeyTranslationUnitList = []
                let languageCodeList = []
                _.forEach(this.languageList, (item) => {
                    if (item.code !== 'cn') {
                        languageCodeList.push(item.code)
                    }
                })
                _.forEach(languageCodeList, (item) => {
                    let unit = {}
                    unit.fromLanguageCode = fromLanguageCode
                    unit.originContent = originContent
                    unit.toLanguageCode = item
                    oneKeyTranslationUnitList.push(unit)
                })
                result.oneKeyTranslationUnit = oneKeyTranslationUnitList
                return result
            },
            formatTranslateResult(result) {
                let translate = {}
                _.forEach(result, (item) => {
                    translate[item.toLanguageCode] = item.translation
                })
                return translate
            },
            fillEmptyDesc(result) {
                _.forEach(result, (value, key) => {
                   _.forEach(this.mediaForm.desc, (titleValue, titleKey) => {
                       if(key === titleKey && _.isEmpty(titleValue)) {
                           this.$set(this.mediaForm.desc, titleKey, value)
                       }
                   })
                })
            },
            getMediaFormData() {
                // console.log(this.mediaForm)
                this.$refs.mediaForm.validate((valid) => {
                    if (valid) {
                        this.mediaFormData = this.mediaForm
                        this.mediaFormData.video = this.videoInfo.originalLink
                        this.dataValid = true
                    }
                })
            },
            openPreview(type, index) {
                this.image.show = true
                let imageList = []
                _.forEach(this.mediaForm[type], (item) => {
                    imageList.push(item.originalLink)
                })
                this.image.list = imageList
                this.image.index = index
            },
            closePreview () {
               this.image.index = 0
               this.image.show = false
               this.image.list = []
            },
            updataMediaInfo () {
                console.log(this.batchMediaData)
                let detail = this.batchMediaData.detail
                let rotation = this.batchMediaData.rotation
                let video = this.batchMediaData.video

                let rotationList = []
                _.forEach(rotation, (item, index) => {
                    let rotationItem = {}
                    rotationItem.id = index
                    rotationItem.originalLink = item.originalLink
                    rotationItem.src = this.dealShowFileSrc(item.smallLink)
                    rotationList.push(rotationItem)
                })

                let detailList = []
                _.forEach(detail, (item, index) => {
                    let detailItem = {}
                    detailItem.id = index
                    detailItem.originalLink = item.originalLink
                    detailItem.src = this.dealShowFileSrc(item.smallLink)
                    detailList.push(detailItem)
                })

                this.mediaForm.rotationPics = rotationList
                this.mediaForm.detailPics = detailList
                this.videoInfo.originalLink = video.originalLink
                this.videoInfo.src = this.dealShowFileSrc(video.originalLink)
                this.videoInfo.coverLink = this.dealShowFileSrc(video.coverLink)
            }
        }
    }
</script>

<style lang="scss">
    .upload-box {
        .el-upload--picture-card {
            width: 100px;
            height: 100px;
            line-height: 100px;
        }
    }
</style>

<style lang="scss" scoped>
    .media-form-wrapper {
        width: 1000px;
        .image-show {
            display: flex;
            flex-wrap: wrap;
            width: 800px;
            .darg-item {
                height: 100px;
                width: 100px;
            }
            .nodrag {
                user-select: none;
                user-drag: none;
            }
            .image-box {
                position: relative;
                height: 100px;
                width: 100px;
                margin: 10px;
                line-height: 170px;
                text-align: center;
                color: #fff;
                transition: transform .3s;
                .image-item {
                    width: 100px;
                    height: 100px;
                    border: 1px dashed #c0ccda;
                    border-radius: 6px;
                    padding: 4px;
                }
                .media-img {
                    width: 100%;
                }
                &:hover {
                    .operate-area {
                        opacity: .5;
                        transition: opacity .3s;
                        border-bottom-left-radius: 6px;
                        border-bottom-right-radius: 6px;
                    }
                    cursor: move;
                }
                .operate-area {
                    position: absolute;
                    opacity: 0;
                    background: #000000;
                    height: 40px;
                    line-height: 40px;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 0 10px;
                    box-sizing: border-box;
                    color: #fff;
                    font-size: 14px;
                    span {
                        cursor: pointer;
                    }
                }
            }
            .upload-box {
                height: 100px;
                width: 100px;
                margin: 10px;
            }
        }
        .product-video {
            display: flex;
            flex-wrap: wrap;
            .video-wrap {
                width: 150px;
                height: 120px;
                border: 1px dashed #c0ccda;
                border-radius: 6px;
                padding: 4px;
                &:hover {
                    .operate-area {
                        opacity: .5;
                        transition: opacity .3s;
                    }
                }
                .operate-area {
                    height: 120px;
                    width: 150px;
                    line-height: 120px;
                    position: absolute;
                    opacity: 0;
                    background: #000000;
                    bottom: 0;
                    left: 0;
                    box-sizing: border-box;
                    color: #fff;
                    font-size: 14px;
                    text-align: center;
                    font-size: 24px;
                    i {
                        padding: 8px;
                    }
                }
            }
            .upload-box {
                padding-top: 10px;
                margin-left: 10px;
            }
        }

        .table {
            width: 100%;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            th {
                background: #f2f2f2;
                width: 120px;
                border: 1px solid #DCDFE6;
            }
            tr td {
                border: 1px solid #DCDFE6;
            }
            td {
                padding: 0 10px;
            }
            .limit {
                width: 120px;
                text-align: center;
            }
            .required {
                font-size: 16px;
                color: red;
                vertical-align: middle;
            }
        }
    }
</style>
