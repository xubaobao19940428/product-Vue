<template>
    <div>
        <h5 class="mar-b-10">上传图片</h5>
        <c-upload :fileList="componentValue.piclinkSrc" ref="cUpload" @setData="setCoverImg"></c-upload>
        <h5 class="mar-b-10">跳转链接</h5>
        <el-input v-model="piclinkHref" clearable size="medium" placeholder="请输入" @change="setHref"></el-input>
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
            return {
                piclinkHref: ''
            }
        },
        computed: {
            componentValue () {
                return JSON.parse(this.data.componentValue)
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
        mounted () {
            this.init()
        },
        components: {
            cUpload
        },
        methods: {
            init () {
                if (this.$refs.cUpload) {
                    this.$refs.cUpload.setFileList(this.componentValue.piclinkSrc)
                }
                this.piclinkHref = this.componentValue.piclinkHref
            },
            setCoverImg (res) {
                let oldVal = JSON.parse(JSON.stringify(this.componentValue))
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(Object.assign(oldVal,{
                        piclinkSrc: res.data
                    }))
                })
            },
            setHref () {
                let oldVal = JSON.parse(JSON.stringify(this.componentValue))
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(Object.assign(oldVal, {
                        piclinkHref: this.piclinkHref
                    }))
                })
            }
        }
    }
</script>
