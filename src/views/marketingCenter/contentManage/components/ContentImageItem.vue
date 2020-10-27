<template>
    <div class="media-form-wrapper">
        <draggable :list="picList" :disabled="!enabled" class="list-group image-show" ghost-class="ghost" :move="checkMove" @start="dragging = true" @end="dragging = false" v-bind="getOptions()">
            <div class="list-group-item image-box" v-for="(element, index) in picList" :key="element.id" @click="openPreview(index)">
                <div class="darg-item">
                    <el-image :src="element.src" class="image-item"></el-image>
                    <div class="operate-area">
                        <i class="el-icon-delete" @click.stop="delPicItem(index)"></i>
                    </div>
                </div>
            </div>
            <div slot="footer" class="upload-box nodrag" v-if="picList.length < max">
                <el-upload
                  action=""
                  list-type="picture-card"
                  multiple
                  :accept="IMG_ACCEPT"
                  :http-request="uploadPic"
                  :show-file-list="false"
                  :before-upload="onImgBeforeUpload"
                  :on-preview="handlePictureCardPreview">
                  <i class="el-icon-plus"></i>
                </el-upload>
            </div>
        </draggable>
        <image-preview v-show="image.show" :close="closePreview" :index="image.index" :list="image.list">
        </image-preview>
    </div>
</template>

<script>

    import draggable from 'vuedraggable'
    import { uploadFileRequest } from '@/request/file'
    import imagePreview from '@/components/imagePreview'

    const MAX_PIC_LENGTH = 6

    export default {
        // 图片上传
        name: 'ContentImageItem',
        props: {
            batchData: {
                type: Object,
                default: () => {}
            },
            mediaList: {
                type: Array,
                default: () => []
            },
            languageCode: {
                type: String,
                default: () => {}
            },
            max: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                transLoading: false,
                // picList: [],
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
            picList() {
                return this.mediaList
            },
            batchMediaData() {
                return this.batchData
            }
        },
        components: {
            draggable,
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
                        let length = this.picList.length
                        if (length < this.max) {
                            let picObj = {
                                id: length,
                                originalLink: res.original_link,
                                src: this.dealShowFileSrc(res.small_link)
                            }
                            console.log(this.picList)
                            this.picList.push(picObj)
                        } else {
                            this.$message.warning(`最多${this.max}张！`)
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },

            delPicItem(index) {
                console.log(this.picList)
                this.picList.splice(index, 1)
            },
            getMediaFormData() {
                console.log(this.mediaForm)
                this.$refs.mediaForm.validate((valid) => {
                    if (valid) {
                        this.mediaFormData = this.mediaForm
                        this.mediaFormData.video = this.videoInfo.originalLink
                        this.dataValid = true
                    }
                })
            },
            openPreview(index) {
                this.image.show = true
                let imageList = []
                _.forEach(this.picList, (item) => {
                    imageList.push(item.originalLink)
                })
                this.image.list = imageList
                this.image.index = index
            },
            closePreview () {
               this.image.index = 0
               this.image.show = false
               this.image.list = []
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
        width: 400px;
        .image-show {
            display: flex;
            flex-wrap: wrap;
            width: 400px;
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
