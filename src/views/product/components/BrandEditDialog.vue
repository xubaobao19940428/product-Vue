<template>
    <div class="eidt-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="700px">
            <div slot="title">
                {{title}}
            </div>
            <el-form ref="brandEditForm" :model="brandModel" :rules="ruleValidate" label-width="120px">
                <el-form-item prop="nameCn" label="中文名称：">
                    <el-input v-model="brandModel.nameCn" clearable placeholder="请输入中文品牌名称/最多40个字" style="width: 320px" :maxlength="40" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="nameEn" label="英文名称：" >
                    <el-input v-model="brandModel.nameEn" clearable placeholder="请输入英文品牌名称/最多120个字符" style="width: 320px" :maxlength="120" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="comeFrom" label="产地：" >
                    <el-input v-model="brandModel.comeFrom" clearable placeholder="请输入产地名称/最多40个字" style="width: 320px" :maxlength="40" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="memo" label="备注：">
                    <el-input v-model="brandModel.memo" clearable placeholder="请输入备注" :maxlength="120" style="width: 320px" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="logo" label="logo：">
                    <div class="upload-wapper">
                        <div class="cover-image" v-if="brandModel.logo">
                            <el-image :src="dealShowFileSrc(brandModel.logo)" fit="contain"></el-image>
                            <div class="operate-area">
                                <i class="el-icon-delete" @click="delCover()"></i>
                            </div>
                        </div>
                        <el-upload
                            v-else
                            class="standard-img"
                            action=""
                            :limit="1"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                            :http-request="uploadLogoPic"
                            list-type="picture-card">
                          <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { uploadFileRequest } from '@/request/file'
    export default {
        data() {
            return {
                ruleValidate: {
                    nameCn: [{
                        required: true,
                        trigger: 'blur',
                        message: '中文名称不能为空'
                    }],
                    nameEn: [{
                        required: true,
                        trigger: 'blur',
                        message: '英文名称不能为空'
                    }],
                    comeFrom: [{
                        required: true,
                        trigger: 'blur',
                        message: '产地不能为空'
                    }],
                },
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            brandData: {
                type: Object,
                default: function() {
                    return {}
                }
            }

        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            brandModel: function() {
                return this.brandData
            },
            countryList() {
                return this.$store.state.dict.countryList
            }
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.$refs.brandEditForm.resetFields()
            },
            comfirm() {
                this.$refs.brandEditForm.validate((valid) => {
                    if (valid) {
                        this.$emit('on-confirm', this.brandModel)
                        this.$refs.brandEditForm.resetFields()
                    }
                })
            },
            uploadLogoPic(file) {
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
                        this.brandModel.logo = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delCover() {
                this.brandModel.logo = ''
            }
        }
    }
</script>

<style lang="scss">
    .eidt-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
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
        .limit-num-tip {
            color: #000;
        }
        .standard-img {
            width: 110px;
            height: 110px;
            .el-upload--picture-card {
                width: 110px;
                height: 110px;
                line-height: 120px;

            }
            .el-upload-list--picture-card .el-upload-list__item {
                width: 110px;
                height: 110px;
            }
        }
    }
</style>

<style lang="scss" scoped>
    .upload-wapper {
        overflow: hidden;
    }
    .cover-image {
        width: 110px;
        height: 110px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        padding: 4px;
        &:hover {
            .operate-area {
                opacity: .5;
                transition: opacity .3s;
                border-radius: 6px;
            }
        }
        .operate-area {
            position: absolute;
            opacity: 0;
            background: #000000;
            height: 110px;
            line-height: 110px;
            bottom: 0;
            left: 0px;
            width: 110px;
            box-sizing: border-box;
            color: #fff;
            font-size: 16px;
            text-align: center;
        }
    }
</style>

