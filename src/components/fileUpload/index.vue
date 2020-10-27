<template>
    <div class="file-upload-wrapper">
        <el-upload
            v-if="listType === 'text'"
            :action="uploadFileUrl"
            :limit="uploadLimit"
            :multiple="limit == 1 ? false : true"
            :name="uploadFileName"
            :data="uploadParam"
            :ref="refsName"
            :file-list="fileData"
            v-loading="loading"
            :on-exceed="handleExceed"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :on-progress="handleProgress"
            :before-upload="beforeFileUpload"
        >
            <el-button icon="el-icon-upload2" size="small" type="primary">上传附件</el-button>
        </el-upload>
        <el-upload
            v-else
            :headers="headers"
            :limit="uploadLimit"
            :class="limit == 1  ? 'avatar-uploader' : ''"
            :multiple="limit == 1 ? false : true"
            :name="uploadFileName"
            :data="uploadParam"
            drag
            :action="uploadFileUrl"
            :file-list="fileData"
            :accept="accept"
            :ref="refsName"
            :on-error="uploadError"
            :on-exceed="handleExceed"
            :on-success="uploadSuccess"
            :on-progress="handleProgress"
            :before-upload="beforeFileUpload"
            v-loading="loading"
            list-type="picture-card">
                <div slot="default" @click="uploadInit">
                    <i class="el-icon-plus"></i>
                    <div class="upload-text" v-show="textDesc">
                        <span class="red" v-show="isRequired">*</span>
                        <span>{{ textDesc }}</span>
                    </div>
                </div>
                <div slot="file" slot-scope="{file}">
                    <el-progress type="circle" :percentage="file.uploadProgress" v-if="file.uploadProgress < 100"></el-progress>
                    <video v-if="getFileType(file) == 'video'" class="el-upload-list__item-thumbnail"
                        :src="dealShowFileSrc(file.url)" data-name="videobox"></video>
                    <div v-else-if="getFileType(file) == 'audio'" class="file-audio" data-name="audiobox">
                        <i class="iconfont">&#xe6ed;</i>
                    </div>
                    <img v-else-if="getFileType(file) == 'image'" class="el-upload-list__item-thumbnail"
                        :src="dealShowFileSrc(file.url)" alt="" data-name="imgbox">
                    <span v-else>{{ file.url }}</span>
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="previewFile(file)">
                        <i class="el-icon-zoom-in"></i>
                        </span>
                        <span class="el-upload-list__item-delete" @click="downloadFile(file)">
                        <i class="el-icon-download"></i>
                        </span>
                        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
                        </span>
                        <span class="el-upload-list__item-delete" @click="reUploadFile(refsName, file)">
                        <i class="el-icon-upload"></i>
                        </span>
                    </span>
                </div>
        </el-upload>
        <image-preview v-show="image.show"
                       :fileType="image.fileType"
                       :close="closePreview"
                       :index="image.index"
                       :list="image.list">
        </image-preview>
    </div>
</template>
<script>
    import { stringToArray, arrayToString } from '@/js/common/filter'
    import imagePreview from '@/components/imagePreview'
    import Sortable from 'sortablejs'


    export default {
        props: {
            fileList: {
                type: String,
                default: ''
            },
            listType: {
                type: String,
                default: 'picture-card'
            },
            signCode: String,
            accept: String,
            limit: {
                type: Number,
                default: 1
            },
            refsName: {
                type: String,
                default: 'fileUpload'
            },
            iscopy: {
                type: Boolean
            },
            getType: String,
            textDesc: String,
            isRequired: Boolean
        },
        data () {
            return {
                uploadFileName: 'file',
                headers: this.$headers,
                uploadFileUrl: `${process.env.VUE_APP_FILE_URL}/file/rest/uploadservices/uploadfile`,
                uploadParam: {},
                fileData: [],
                reUploadIndex: -1,
                uploadLimit: this.limit,
                image: {
                    show: false,
                    index: 0,
                    fileType: 'img',
                    list: []
                },
                loading: false
            }
        },
        components: {
            imagePreview
        },
        created () {
            this.setFileList(this.fileList)
        },
        methods: {
            setFileList (val) {
                if (val) {
                    this.fileData = stringToArray(JSON.parse(JSON.stringify(val)))
                }
                if (val == '') {
                    this.fileData = []
                }
            },
            setSort () {
                this.$nextTick(() => {
                    let el = this.$el.querySelector('.el-upload-list')
                    let obj=this.iscopy?{group: {
                            name: 'shared',
                            pull: 'clone',
                            put: false
                        },
                        sort: false,}:{ghostClass: 'sortable-ghost'}
                    this.sortable = Sortable.create(el, {
                        ...obj,
                        onUpdate: e => {
                            let tempIndex = this.fileData.splice(e.oldIndex, 1)
                            this.fileData.splice(e.newIndex, 0, ...tempIndex)
                            this.$emit('setData', {
                                data: arrayToString(this.fileData),
                                signCode: this.signCode
                            })
                        }
                    })
                })

            },
            // 上传之前校验
            beforeFileUpload (file) {
                let fileType = file.type.split('/')[0]
                if (fileType == 'image') { // 图片都限制在2MB
                    const isLt2M = file.size / 1024 / 1024 < 2
                    if (!isLt2M) {
                        this.$message.error(`上传图片大小不能超过 2MB!`)
                        return false
                    }
                } else {
                    const isLt30M = file.size / 1024 / 1024 < 30
                    if (!isLt30M) {
                        this.$message.error(`上传文件大小不能超过 30MB!`)
                        return false
                    }
                }
                /*
                 *fileType: image gif audio video location other
                 */
                if (file.type === 'image/gif') {
                    fileType = 'gif'
                } else if (fileType != 'image' && fileType != 'video' && fileType != 'audio') {
                    fileType = 'other'
                }
                Object.assign(this.uploadParam, {
                    param: JSON.stringify({
                        type: fileType,
                        fileName: file.name
                    })
                })
                this.loading = true
                return true
            },
            uploadInit () {
                console.log(this.reUploadIndex)
                if (this.reUploadIndex != -1) {
                    this.uploadLimit -= 1
                    this.reUploadIndex = -1
                }
            },
            uploadError () {
                this.$message.warning('上传失败' + (this.signCode ? this.signCode : ''))
                this.loading = false
            },
            // 上传成功
            uploadSuccess (response, file, fileList) {
                if (response.status == '600') {
                    let mappedFileList = []
                    if (this.reUploadIndex != -1) {
                        fileList[this.reUploadIndex] = fileList[fileList.length - 1]
                        fileList.splice(fileList.length - 1, 1)
                        this.uploadLimit -= 1
                    }
                    if (this.getType) {
                        mappedFileList = fileList.map((mappingfile) => {
                            if (mappingfile.response !== undefined) {
                                mappingfile.url = mappingfile.response[this.getType] || mappingfile.response.original_link
                            }
                            return mappingfile
                        })
                    } else {
                        mappedFileList = fileList.map((mappingfile) => {
                            if (mappingfile.response !== undefined) {
                                mappingfile.url = mappingfile.response.original_link
                            }
                            return mappingfile
                        })
                    }
                    this.fileData = mappedFileList
                    this.setSort()
                    this.$emit('setData', {
                        data: arrayToString(this.fileData),
                        signCode: this.signCode
                    })
                } else {
                    let itemI = fileList.find((item) => {
                        return item == file
                    })
                    if (itemI != -1) {
                        fileList.splice(itemI, 1)
                    }
                }
                this.reUploadIndex = -1
                this.loading = false
            },
            // 上传进度
            handleProgress (event, file) {
                file.uploadProgress = parseInt(event.percent)
            },
            handleExceed () {
                this.$message.warning(`最多上传${this.limit}个文件`)
            },
            // 删除
            handleRemove (file) {
                let index = this.fileData.findIndex((val) => {
                    return val.url == file.url
                })
                if (index != -1) {
                    this.fileData.splice(index, 1)
                    this.$emit('setData', {
                        data: arrayToString(this.fileData),
                        signCode: this.signCode
                    })
                }
            },
            getFileType (file) {
                return file.raw ? file.raw.type.split('/')[0] : 'image'
            },
            // 预览
            previewFile (file) {
                this.image.fileType = this.getFileType(file)
                this.image.list = [this.dealShowFileSrc(file.url)]
                this.image.show = true
            },
            // 关闭预览
            closePreview () {
                this.image.show = false
            },
            // 重新上传
            reUploadFile (refsName, file) {
                this.reUploadIndex = this.fileData.findIndex((val) => {
                    return val.url == file.url
                })
                this.uploadLimit += 1
                let input = this.$refs[refsName].$refs['upload-inner'].$refs['input']
                input.value = null
                input.click()
            },
            // 下载
            downloadFile (file) {
                let a = document.createElement('a')
                a.download = this.dealShowFileSrc(file.url)
                a.href = this.dealShowFileSrc(file.url)
                a.click()
            }
        }
    }
</script>
<style lang="scss">
    .file-upload-wrapper{
        position: relative;
        .iconfont{
            font-size: 70px;
        }
        .file-audio{
            display: flex;
            justify-content: center;
        }
        .upload-text {
            display: flex;
            align-items: center;
            line-height: 18px;
            position: absolute;
            bottom: 6px;
            left: 50%;
            transform: translateX(-50%);
            .red {
                font-size: 16px;
                color: #f56c6c;
            }
            span {
                margin-left: 4px;
                font-size: 12px;
                word-break: keep-all;
            }
        }
    }
</style>
