<template>
    <div>
        <h5 class="mar-b-10">上传视频</h5>
        <c-upload :fileList="componentVal.url" ref="urlUpload" @setData="setUrl"></c-upload>
        <h5 class="mar-b-10">上传封面</h5>
        <c-upload :fileList="componentVal.cover" ref="coverUpload" @setData="setCover"></c-upload>
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
                try {
                    return JSON.parse(this.data.componentValue)
                } catch (e) {
                    return {
                        url: this.data.componentValue,
                        cover: ''
                    }
                }
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
            setUrl (res) {
                let oldVal = JSON.parse(JSON.stringify(this.componentVal))
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(Object.assign(oldVal, {
                        url: res.data
                    }))
                })
            },
            setCover (res) {
                let oldVal = JSON.parse(JSON.stringify(this.componentVal))
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(Object.assign(oldVal, {
                        cover: res.data
                    }))
                })
            }
        }
    }
</script>
