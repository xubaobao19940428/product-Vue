<template>
    <div>
        <h5 class="mar-b-10">上传图片</h5>
        <c-upload :fileList="data.componentValue" ref="cUpload" @setData="setCoverImg"></c-upload>
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
            componentId () {
                return this.data.moduleId
            }
        },
        watch: {
            componentId () {
                this.init()
            }
        },
        mounted () {
            this.init()
        },
        components: {
            cUpload
        },
        methods: {
            init () {
                if (this.$refs.cUpload) {
                    this.$refs.cUpload.setFileList(this.data.componentValue)
                }
            },
            setCoverImg (res) {
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: res.data
                })
            }
        }
    }
</script>
