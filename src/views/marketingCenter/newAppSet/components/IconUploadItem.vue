<template>
    <div >
        <div class="item-row">
            <label><span>*</span>未选中：</label>
            <div class="image-wrapper" style="width: 80px;">
                <div class="cover-image" v-if="item.unselected != ''">
                    <el-image :src="dealShowFileSrc(item.unselected)" fit="contain"></el-image>
                    <div class="operate-area">
                        <i class="el-icon-delete" @click="delUnselected()"></i>
                    </div>
                </div>
                <el-upload
                    v-else
                    class="icon-upload"
                    :action="''"
                    :limit="1"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    :http-request="uploadUnselectPic"
                    :disabled="item.unselected != ''"
                    list-type="picture-card">
                    <i v-if="item.unselected == ''" class="el-icon-plus"></i>
                </el-upload>
            </div>
        </div>
        <div class="item-row">
            <label><span>*</span>已选中：</label>
            <div class="image-wrapper" style="width: 80px;">
                <div class="cover-image" v-if="item.selected != ''">
                    <el-image :src="dealShowFileSrc(item.selected)" fit="contain"></el-image>
                    <div class="operate-area">
                        <i class="el-icon-delete" @click="delSelected()"></i>
                    </div>
                </div>
                <el-upload
                    v-else
                    class="icon-upload"
                    :action="''"
                    :limit="1"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    :http-request="uploadSelectPic"
                    :disabled="item.selected != ''"
                    list-type="picture-card">
                    <i v-if="item.selected == ''" class="el-icon-plus"></i>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>

    import { uploadFileRequest } from '@/request/file'
    export default {
        name: 'IconUploadItem',
        props: {
            item: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                cover: ''
            }
        },
        components: {},
        computed: {

        },
        methods: {
            uploadUnselectPic(file) {
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
                        this.item.unselected = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delUnselected() {
                this.item.unselected = ''
            },
            uploadSelectPic(file) {
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
                        this.item.selected = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delSelected() {
                this.item.selected = ''
            },
        }
    }
</script>

<style lang="scss">
    .item-row {
        height: 100px;
        span {
            color: #F56C6C;
        }
    }
    .image-wrapper {
        display: inline-block;
        position: absolute;
        width: 80px;
        height: 80px;
        overflow: hidden;
        .cover-image {
            width: 80px;
            height: 80px;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            padding: 4px;
            text-align: center;
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
                height: 80px;
                line-height: 80px;
                top: -1px;
                left: -1px;
                width: 80px;
                box-sizing: border-box;
                color: #fff;
                font-size: 16px;
            }
        }
    }
    .icon-upload {
        width: 80px;
        height: 80px;
        display: inline-block;
        .el-upload--picture-card {
            width: 80px;
            height: 80px;
            line-height: 90px;
        }
        .el-upload-list--picture-card .el-upload-list__item {
            width: 80px;
            height: 80px;
        }
    }
</style>



