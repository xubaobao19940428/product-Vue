<template>
    <div class="deal-dialog">
        <el-dialog title="异常处理" :append-to-body="false" :visible="propShowDialog" width="800px" @close="close" class="propShowDialog">
            <el-form label-position="right" label-width="130px">
                <el-form-item label="物流单号：">
                    <span>{{ param.logiCode }}</span>
                </el-form-item>
                <el-form-item label="异常类型：">
                    <span>{{ param.abnormalReason }}</span>
                </el-form-item>
                <el-form-item label="处理备注：">
                    <el-input :disabled="dealType == 'edit' ? false : true" v-model="param.content" size="medium" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="图片上传：">
                    <c-upload :limit=6 ref="abnormalImg" :fileList="param.imgs" @setData="setCoverImg"></c-upload>
                </el-form-item>
            </el-form>
            <el-timeline>
                <el-timeline-item v-for="(item, i) in param.process"
                                  :type="i == param.process.length - 1 ? 'primary' : 'info'"
                                  :key="i"
                                  :timestamp="item.createTime | formatTime" placement="top">
                    <el-card>
                        <div class="flex-between">
                            <span>处理人：{{ item.userName }}</span>
                            <span>{{ item.createTime | formatTime }}</span>
                        </div>
                        <div class="mar-t-10">{{ item.content }}</div>
                        <div class="list-img-box" v-for="(url, i) in formatImg(item.imgs)"
                             @click="previewImg(formatImg(item.imgs), 0)" v-if="i == 0"
                             :key="i">
                            <img :src="dealShowFileSrc(url)"/>
                            <span>{{ formatImg(item.imgs).length }}</span>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
            <div slot="footer" class="dialog-footer">
                <div slot="footer" class="dialog-footer">
                    <el-button @click="close" size="small">取 消</el-button>
                    <el-button type="primary" @click="dealAbnormal" v-preventReClick="500" size="small" :loading="loading">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <image-preview v-show="image.show" :close="closePreview" :index="image.index" :list="image.list" class="imagePreview"></image-preview>
    </div>
</template>
<script>
    import cUpload from '@/components/fileUpload/'
    import { purchaseDealAbnormal } from '@/request/warehouse'
    import imagePreview from '@/components/imagePreview'
    export default {
        props: {
            propShowDialog: Boolean,
            propParam: Object,
            dealType: String
        },
        data () {
            return {
                param: {
                    logiCode: '',
                    abnormalReason: '',
                    abnormalNo: '',
                    content: '',
                    imgs: '',
                    process: []
                },
                loading: false,
                image: {
                    show: false,
                    index: 0,
                    list: []
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    Object.assign(this.param, val)
                },
                deep: true
            }
        },
        components: {
            cUpload,
            imagePreview
        },
        methods: {
            closePreview () {
                this.image.index = 0
                this.image.show = false
            },
            previewImg (imgs, i) {
                this.image.list = imgs
                this.image.index = i
                this.image.show = true
            },
            formatImg (imgStr) {
                if (imgStr) {
                    return imgStr.split(',')
                }
                return []
            },
            close () {
                this.reset()
                this.$emit('close')
            },
            reset () {
                this.param = {
                    imgs: '',
                    logiCode: '',
                    abnormalReason: '',
                    content: '',
                    process: []
                }
                this.loading = false
            },
            setCoverImg (res) {
                this.param.imgs = res.data
            },
            dealAbnormal () {
                if (this.dealType != 'edit') {
                    this.close()
                    return
                }
                this.loading = true
                purchaseDealAbnormal(this.filterData(this.param)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.$refs.abnormalImg.setFileList(this.param.imgs)
                        this.reset()
                        this.$refs.abnormalImg.setFileList(this.param.imgs)
                        this.$emit('confirm')
                    }
                }).catch(() => {
                    this.loading = true
                })
            }
        }
    }
</script>
<style lang="scss">
    .deal-dialog{
        .el-collapse-item__wrap{
            .el-timeline-item:last-child{
                .el-timeline-item__node{
                    background: #3a8ee6;
                }
                .el-card{
                    font-weight: bold;
                }
            }
        }
        .file-a {
            color: #4f91d8;
            margin:0 16px;
            &:hover {
                color: #0076f5;
            }
        }
        .flex-between{
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>
