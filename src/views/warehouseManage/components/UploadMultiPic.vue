<template>
    <div class="image-upload-wrapper">
        <div class="image-box" v-for="(element, index) in imageList" :key="element">
            <div class="image-item-area">
                <el-image :src="dealShowFileSrc(element)" class="image-item"></el-image>
                <div class="operate-area">
                    <i class="el-icon-delete" @click.stop="delImgItem(index)"></i>
                </div>
            </div>
        </div>
        <div class="image-box upload-box">
            <el-upload
                action=""
                list-type="picture-card"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                :http-request="uploadImage"
                :show-file-list="false"
                :before-upload="onImgBeforeUpload">
                <i class="el-icon-plus"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
import { uploadFileRequest } from '@/request/file'

export default {
    props: {
        index: {
            type: Number
        }
    },
    data() {
        return {
            imageList: []
        }
    },
    methods: {
        uploadImage(file) {
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
                    this.imageList.push(res.original_link)
                    let imageObj = {
                        index: this.index,
                        imgs: this.imageList.join(',')
                    }
                    this.$emit('update-image', imageObj)
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        delImgItem(index) {
            this.imageList.splice(index, 1)
        },
        reset() {
            this.imageList = []
        }
    }
}
</script>

<style lang="scss" scoped>
    .image-box {
        position: relative;
        display: inline-block;
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
</style>
