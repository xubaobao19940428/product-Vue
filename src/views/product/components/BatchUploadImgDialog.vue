<template>
    <div class="batch-upload-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="900px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="mediaForm" label-width="120px" >
                <el-form-item label="原始链接或源码：">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}" v-model="urlSource" size="medium" clearable
                        placeholder="请输入1688的链接或者1688商品页面上的网页源码" style="width: 600px; margin-right: 10px;"></el-input>
                    <el-link type="primary" :underline="false" :disabled="fetching " @click="fetchImg">开始抓图</el-link>
                </el-form-item>
                <el-form-item label="商品主图：">
                    <p>已选({{rotationPicChecked.length}} /{{rotationPicList.length}})</p>
                    <div class="image-show">
                        <div class="list-group-item image-box" v-for="(element, index) in rotationPicList" :key="element.name" >
                            <div class="darg-item" @click="choiceItem(element, index)">
                                <el-image :src="element.src" class="image-item"></el-image>
                                <div :class="{active: element.check}">
                                    <div>
                                        <i class="el-icon-circle-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="商品详情图：">
                    <p>已选({{detailPicChecked.length}} /{{detailPicList.length}})</p>
                    <div class="image-show">
                        <div class="list-group-item image-box" v-for="(element, index) in detailPicList" :key="element.name" >
                            <div class="darg-item" @click="choiceDetailItem(element, index)">
                                <el-image :src="element.src" class="image-item"></el-image>
                                <div :class="{active: element.check}">
                                    <div>
                                        <i class="el-icon-circle-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" :disabled="!(rotationPicChecked.length > 0 || detailPicChecked.length > 0)"
                    :loading="loading" @click="confirm" size="small">确定上传</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    // import axios from 'axios'
    import { get1688Pic } from '@/request/product'
    import { uploadFileRequestByUrl } from '@/request/file'

    export default {
        // 一键传图
        name: 'BatchUploadDialog',
        data() {
            return {
                dialogTitle: '一键传图',
                fetching: false,
                urlSource: '', // 1688的链接或者1688商品页面上的网页源码
                rotationPicList: [],
                detailPicList: [],
                videoUrlList: [],
                mediaResult: {},
                loading: false
            }
        },
        props: {
            editType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            orgUrl: {
                type: String,
                default: ''
            }
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            rotationPicChecked() {
                let checked = []
                _.forEach(this.rotationPicList, (item) => {
                    if (item.check) {
                        checked.push(item)
                    }
                })
                return checked
            },
            detailPicChecked() {
                let checked = []
                _.forEach(this.detailPicList, (item) => {
                    if (item.check) {
                        checked.push(item)
                    }
                })
                return checked
            }
        },
        watch:{
            orgUrl: function (newValue, oldValue) {
                this.urlSource = newValue
            }
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                this.loading = true
                let self = this
                let rotationListParmas = []
                _.forEach(this.rotationPicList, (item) => {
                    let paramsItem = {
                        type: 'product'
                    }
                    paramsItem.fileName = this.getFileNameByUrl(item.src)
                    paramsItem.url = item.src
                    if (item.check) {
                        rotationListParmas.push(paramsItem)
                    }
                })

                let detailListParmas = []
                _.forEach(this.detailPicList, (item) => {
                    let paramsItem = {
                        type: 'product'
                    }
                    paramsItem.fileName = this.getFileNameByUrl(item.src)
                    paramsItem.url = item.src
                    if (item.check) {
                        detailListParmas.push(paramsItem)
                    }
                })
                if (this.videoUrlList[0]) {
                    axios.all([ this.uploadVideo(this.videoUrlList[0]), this.uploadImg(rotationListParmas, 'rotation'), this.uploadImg(detailListParmas, 'detail')])
                        .then(axios.spread(function ( video, rotation, detail) {
                            self.loading = false
                            if (video.status === '600') {
                                let videoInfo = {}
                                videoInfo.originalLink = video.original_link
                                videoInfo.coverLink = video.cover_link
                                self.mediaResult.video = videoInfo
                            }
                            if (rotation.status === '600') {
                                let resultMap = rotation.resultMap
                                let resultList = []
                                _.forEach(rotationListParmas, rotation => {
                                    let resultItem = {}
                                    if (resultMap[rotation.url]) {
                                        resultItem.originalLink = resultMap[rotation.url].original_link
                                        resultItem.smallLink = resultMap[rotation.url].small_link
                                        resultList.push(resultItem)
                                    }
                                })
                                self.mediaResult['rotation'] = resultList
                            }
                            if (detail.status === '600') {
                                let resultMap = detail.resultMap
                                let resultList = []
                                _.forEach(detailListParmas, detail => {
                                    let resultItem = {}
                                    if (resultMap[detail.url]) {
                                        resultItem.originalLink = resultMap[detail.url].original_link
                                        resultItem.smallLink = resultMap[detail.url].small_link
                                        resultList.push(resultItem)
                                    }
                                })
                                self.mediaResult['detail'] = resultList
                            }
                            self.$emit('on-submit', self.mediaResult)
                            self.loading = false

                    }));
                } else {
                    axios.all([this.uploadImg(rotationListParmas, 'rotation'), this.uploadImg(detailListParmas, 'detail')])
                        .then(axios.spread(function (rotation, detail) {
                            self.loading = false
                            if (rotation.status === '600') {
                                let resultMap = rotation.resultMap
                                let resultList = []
                                _.forEach(rotationListParmas, rotation => {
                                    let resultItem = {}
                                    if (resultMap[rotation.url]) {
                                        resultItem.originalLink = resultMap[rotation.url].original_link
                                        resultItem.smallLink = resultMap[rotation.url].small_link
                                        resultList.push(resultItem)
                                    }
                                })

                                self.mediaResult['rotation'] = resultList
                            }
                            if (detail.status === '600') {
                                let resultMap = detail.resultMap
                                let resultList = []
                                _.forEach(detailListParmas, detail => {
                                    let resultItem = {}
                                    if (resultMap[detail.url]) {
                                        resultItem.originalLink = resultMap[detail.url].original_link
                                        resultItem.smallLink = resultMap[detail.url].small_link
                                        resultList.push(resultItem)
                                    }
                                })
                                self.mediaResult['detail'] = resultList
                            }
                            self.$emit('on-submit', self.mediaResult)
                            self.loading = false
                    }));
                }
            },

            reset() {
                this.urlSource = ''
                this.rotationPicList = []
                this.detailPicList = []
                this.videoUrlList = []
            },
            fetchImg() {
                if (this.urlSource === '') {
                    this.$message.warning('请输入1688的链接或者1688商品页面上的网页源码')
                    return
                }
                this.fetching = true
                let params = {
                    content: this.urlSource
                }
                this.rotationPicList = []
                this.detailPicList = []
                this.videoUrlList = []
                get1688Pic(this.filterData(params)).then((response) => {
                    this.fetching = false
                    if (response.ret.errcode === 1) {
                        _.forEach(response.rotationPic, (item, index) => {
                            let rotationItem = {
                                id: index,
                                src: item,
                                check: false
                            }
                            if (index < 8) {
                                rotationItem.check = true
                            }
                            this.rotationPicList.push(rotationItem)
                        })
                        _.forEach(response.detailPic, (item, index) => {
                            let detailItem = {
                                id: index,
                                src: item,
                                check: false
                            }
                            if (index < 20) {
                                detailItem.check = true
                            }
                            this.detailPicList.push(detailItem)
                        })
                        _.forEach(response.videoUrl, (item, index) => {
                            let detailItem = {
                                id: index,
                                src: item,
                                check: false
                            }
                            this.videoUrlList.push(detailItem)
                        })
                    }
                    console.log(this.rotationPicList)
                }).catch((err) => {
                    console.error(err)
                    this.fetching = false
                })
            },
            choiceItem(item, index) {
                if (!this.rotationPicList[index].check && this.rotationPicChecked.length >= 8) {
                    this.$message.warning('最多选择8张')
                    return
                }
                let check = this.rotationPicList[index].check
                this.rotationPicList[index].check = check === true ? false : true
            },
            choiceDetailItem(item, index) {
                if (!this.detailPicList[index].check && this.detailPicChecked.length >= 20) {
                    this.$message.warning('最多选择20张')
                    return
                }
                let check = this.detailPicList[index].check
                this.detailPicList[index].check = check === true ? false : true
            },
            uploadImg(fileList, type) {
                if (fileList.length < 0) {
                    return
                }
                let params = new FormData();
                params.append('urlParam', JSON.stringify(fileList));
                let url = '/file/rest/uploadservices/uploadfileByUrlBatch'
                return uploadFileRequestByUrl(url, params)
            },
            uploadVideo(file) {
                let fileName = this.getFileNameByUrl(file.src)
                let params = new FormData();
                let fileInfo = {
                    fileName: fileName,
                    type: 'video'
                }
                params.append('url',file.src);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfileByUrl'
                return uploadFileRequestByUrl(url, params)
            },
            getFileNameByUrl(url) {
                let fileName = ''
                let index = url.lastIndexOf('/')
                if (index > 0) {
                    fileName = url.substring(index+1, url.length)
                }
                return fileName
            },

        }
    }
</script>

<style lang="scss">
    .batch-upload-dialog {
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
        .image-show {
            display: flex;
            flex-wrap: wrap;
            width: 750px;
            overflow: hidden;
            .darg-item {
                height: 100px;
                width: 100px;
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
                .active {
                    position: absolute;
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
                    opacity: .5;
                    transition: opacity .3s;
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 6px;
                }
            }
            .upload-box {
                height: 100px;
                width: 100px;
                margin: 10px;
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



