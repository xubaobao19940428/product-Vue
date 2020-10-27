<template>
    <div class="sku-cover-select-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="900px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="mediaForm" label-width="120px" style="padding-bottom: 30px;">
                <el-form-item label="从主图选取：">
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
                <el-form-item label="从详情图选取：">
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
                <el-form-item label="从本地上传：">
                    <div class="cover-image-wrapper" style="width: 120px;">
                        <div class="cover-image" v-if="skuCover">
                            <el-image :src="dealShowFileSrc(skuCover)" fit="contain"></el-image>
                            <div class="operate-area">
                                <i class="el-icon-delete" @click="delCover()"></i>
                            </div>
                        </div>
                        <el-upload
                            v-else
                            class="standard-img"
                            :action="''"
                            :limit="1"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                            :http-request="uploadCoverPic"
                            :disabled="cover != ''"
                            list-type="picture-card">
                          <i v-if="cover == ''" class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="confirm" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { uploadFileRequest } from '@/request/file'

    export default {
        // SKU cover图上传
        name: 'SkuCoverSelectDialog',
        data() {
            return {
                dialogTitle: '上传SKU规格图',
                fetching: false,
                rotationPicList: [],
                detailPicList: [],
                loading: false,
                skuCover: '',
                cover: ''
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        components: {},
        computed: {
            toggle: {
                get: function() {
                    let mediaInfo = JSON.parse(this.getStore('productMediaInfo'))
                    if(mediaInfo){
                     _.forEach(mediaInfo.rotationPics, item => {
                        item.check = false
                    })
                     _.forEach(mediaInfo.detailPics, item => {
                        item.check = false
                    })
                    this.rotationPicList = mediaInfo.rotationPics
                    this.detailPicList = mediaInfo.detailPics
                    }
                   
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
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                let resultCover = ''
                if (this.cover != '') {
                    resultCover = this.cover
                } else if (this.skuCover != '') {
                    resultCover = this.skuCover
                }
                this.$emit('on-confirm', resultCover)
                this.reset()
            },
            reset() {
                this.rotationPicList = []
                this.detailPicList = []
                this.skuCover = '',
                this.cover = ''
            },
            choiceItem(item, index) {
                console.log(this.skuCover)
                if (this.skuCover != '') {
                    this.$message.warning('已从本地上传了，如需从主图中选取请先移除本地上传图片')
                    return
                }
                if (!this.rotationPicList[index].check && this.cover != '') {
                    this.$message.warning('最多选择1张')
                    return
                }
                if (!this.rotationPicList[index].check && this.rotationPicChecked.length >= 1) {
                    this.$message.warning('最多选择1张')
                    return
                }
                let check = this.rotationPicList[index].check
                this.rotationPicList[index].check = check === true ? false : true
                console.log(check)
                if (!check) {
                    this.cover = this.rotationPicList[index].originalLink
                } else (
                    this.cover = ''
                )
            },
            choiceDetailItem(item, index) {
                if (this.skuCover != '') {
                    this.$message.warning('已从本地上传了，如需从详情图中选取请先移除本地上传图片')
                    return
                }
                if (!this.detailPicList[index].check && this.cover != '') {
                    this.$message.warning('最多选择1张')
                    return
                }
                if (!this.detailPicList[index].check && this.detailPicChecked.length >= 1) {
                    this.$message.warning('最多选择1张')
                    return
                }
                let check = this.detailPicList[index].check
                this.detailPicList[index].check = check === true ? false : true
                if (!check) {
                    this.cover = this.detailPicList[index].originalLink
                } else (
                    this.cover = ''
                )
            },
            uploadCoverPic(file) {
                if (this.cover != '') {
                    this.$message.warning('已从主图或详情中选取，如需本地上传请先移除已选图片')
                    return
                }
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
                        this.skuCover = res.original_link
                        console.log(this.skuCover )
                        // this.cover = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delCover() {
                this.skuCover = ''
            }
        }
    }
</script>

<style lang="scss">
    .sku-cover-select-dialog {
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



