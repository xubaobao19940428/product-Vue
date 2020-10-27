<template>
    <div class="img-cropper-dialog">
        <el-dialog :title="title" append-to-body :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" top="2vh" width="900px">
            <div slot="title">
                {{title}}
            </div>
            <div class="corpper">
                <vueCropper
				    ref="cropper"
				    :img="option.img"
				    :outputSize="option.size"
				    :outputType="option.outputType"
                    :autoCrop="option.autoCrop"
					:autoCropWidth="option.autoCropWidth"
					:autoCropHeight="option.autoCropHeight"
                    :high="option.high"
                    :centerBox="option.centerBox"
                    :original="option.original"
			    ></vueCropper>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { VueCropper }  from 'vue-cropper'
    import { ocrRequest } from '@/request/ocr'
    export default {
        data() {
            return {
                title: '图片识别',
                option: {
                    img: '',
                    size: 0.7,
                    outputType: 'jpeg',
                    autoCrop: true,
                    autoCropWidth: 300,
                    autoCropHeight: 30,
                    high: false,
                    centerBox: true,
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            imgUrl: {
                type: String,
                default: ''
            }
        },
        computed: {
            toggle: {
                get: function() {
                    if (this.dialogVisible) {
                        this.option.img = this.imgUrl
                        console.log(this.option)
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        components: {
            VueCropper
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                this.$refs.cropper.getCropData(data => {
                    console.log(data)
                    this.getOcrText(data.split(',')[1])
                });
            },
            getOcrText(params) {
                ocrRequest(params).then(res => {
                    console.log(res)
                    if (res.status === 200) {

                        let result = res.data
                        if (result != '') {
                            this.$emit('on-confirm', result)
                        } else {
                            this.$message.warning('未识别到内容，请选取交易号区域')
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
        }
    }
</script>

<style lang="scss">
    .img-cropper-dialog {
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
    .corpper {
        height: 670px;
    }
</style>

