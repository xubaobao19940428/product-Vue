<template>
    <div class="media-form-wrapper">
        <div class="product-video">
            <div class="video-wrap" v-if="videoInfo.src != ''">
                <video ref="media" width="100%" height="100%">
                    <source :src="dealShowFileSrc(videoInfo.src)" />
                    <object :data="dealShowFileSrc(videoInfo.src)" width="100%" height="100%" >
                        <embed :src="dealShowFileSrc(videoInfo.src)" width="100%" height="100%">
                    </object>
                </video>
                <div class="operate-area">
                    <i class="el-icon-video-play" @click="showVideo()"></i>
                    <i class="el-icon-delete" @click="delVideoItem()"></i>
                </div>
            </div>
            <div class="upload-box" v-show="videoInfo.src === ''">
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
        <el-dialog title="" :visible.sync="videoDialog" width="800px" :before-close="handleCloseVideo" append-to-body>
            <d-player ref="player" :options="options"  @play="play"></d-player>
            <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
    </div>
</template>

<script>

    import { uploadFileRequest } from '@/request/file'
    import VueDPlayer from 'vue-dplayer'
    import 'vue-dplayer/dist/vue-dplayer.css'

    export default {
        // 内容视频
        name: 'ContentVideo',
        props: {
            batchData: {
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
                // videoInfo: {
                //     src: '',
                //     coverLink: ''
                // },
                enabled: true,
                dragging: false,
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
                dataValid: false
            }
        },
        computed: {
            batchMediaData() {
                return this.batchData
            },
            videoInfo () {
                return this.video
            }
        },
        components: {
            'd-player': VueDPlayer,
        },
        mounted() {
        },
        methods: {
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
                this.options.video.url = this.dealShowFileSrc(this.videoInfo.src)
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
