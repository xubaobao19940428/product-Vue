<template>
    <div class="swipe-action-box">
        <div class="action-title">轮播组</div>
        <el-card class="box-card video-box-card">
            <div slot="header" class="clearfix">
                <span>视频</span>
            </div>
            <div>
                <h5 class="mar-b-10">上传视频</h5>
                <c-upload :fileList="componentVal.video" ref="videoUpload" @setData="setVideoUrl"></c-upload>
            </div>
            <div>
                <h5 class="mar-b-10">上传视频封面</h5>
                <c-upload :fileList="componentVal.videoCover" ref="coverUpload" @setData="setVideoCover"></c-upload>
            </div>
        </el-card>
        <el-card class="box-card mar-t-10">
            <div slot="header" class="clearfix">
                <span>图片</span>
            </div>
            <h5 class="mar-b-10">上传图片(最多上传6张，支持拖拽排序)</h5>
            <c-upload :fileList="componentVal.img" :limit="6" ref="imgUpload" @setData="setImg"></c-upload>
        </el-card>
    </div>
</template>
<script>
    import cUpload from '@/components/fileUpload/index'
    export default {
        props: {
            data: [Object, Array],
            curIndex: [Number, String]
        },
        data () {
            return {}
        },
        computed: {
            componentVal () {
                let obj = JSON.parse(this.data.componentValue)
                return obj.data
            },
            componentId () {
                return this.data.moduleId
            }
        },
        watch: {
            componentId () {
                this.init()
            }
        },
        components: {
            cUpload
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                if (this.$refs.urlUpload) {
                    this.$refs.urlUpload.setFileList(this.componentVal.url)
                }
                if (this.$refs.coverUpload) {
                    this.$refs.coverUpload.setFileList(this.componentVal.cover)
                }
            },
            submitData (val) {
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(val)
                })
            },
            setVideoUrl (res) {
                let oldVal = JSON.parse(this.data.componentValue)
                oldVal.data.video = res.data
                this.submitData(oldVal)
            },
            setVideoCover (res) {
                let oldVal = JSON.parse(this.data.componentValue)
                oldVal.data.videoCover = res.data
                this.submitData(oldVal)
            },
            setImg (res) {
                let oldVal = JSON.parse(this.data.componentValue)
                oldVal.data.img = res.data
                this.submitData(oldVal)
            }
        }
    }
</script>
<style lang="scss">
    .swipe-action-box{
        .el-upload-list--picture-card .el-upload-list__item{
            width: 100px;
            height: 100px;
        }
        .el-upload--picture-card .el-upload-dragger{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .el-upload--picture-card, .avatar-uploader{
            width: 100px;
            height: 100px;
        }
        .video-box-card .el-card__body{
            display: flex;
            >div{
                margin-right: 10px;
            }
        }
    }
</style>
<style lang="scss" scoped>
    @import "./common";
</style>
