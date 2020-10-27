<template>
    <div class="topic-text">
        <h5 class="mar-b-10">描述：</h5>
        <!-- <quill-editor
            v-model="textContent"
            :options="editorOption"
            ref="myQuillEditor"
            @change="onEditorChange($event)">
        </quill-editor> -->
        <el-input type="textarea" placeholder="请输入内容"  v-model="textContent" @input="editText" ></el-input>
    </div>
</template>
<script>
    import Quill from 'quill'
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    let fonts = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'Arial', 'Times-New-Roman']
    let Font = Quill.import('formats/font')
    Font.whitelist = fonts // 将字体加入到白名单
    export default {
        props: {
            data: [Object, Array],
            curIndex: [Number, String]
        },
        data () {
            return {
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
                            ['blockquote', 'code-block'],
                            [{ header: 1 }, { header: 2 }], // 1、2 级标题
                            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
                            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
                            [{ indent: '-1' }, { indent: '+1' }], // 缩进
                            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                            [{ color: ['#000', '#222', '#333', '#444', '#555', '#666', '#999', '#eee', '#e71f17'] }, { background: ['#F5F6F7', '#F1F2F3', '#e71f17'] }], // 字体颜色、字体背景颜色
                            [{ align: [] }], // 对齐方式
                            ['clean'], // 清除文本格式
                            ['link', 'image', 'video']
                        ]
                    }
                },
                textContent: ''
            }
        },
        components: {
            quillEditor
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
        methods: {
            init () {
                this.textContent = JSON.parse(this.data.componentValue).data
            },
            onEditorChange ({ quill, html, text }) {
                let oldVal = JSON.parse(this.data.componentValue)
                oldVal.data = html
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(oldVal)
                })
            },
            editText (text) {
                let oldVal = JSON.parse(this.data.componentValue)
                oldVal.data = text
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(oldVal)
                })
            }
        }
    }
</script>
<style lang="scss">
    .topic-text{
        .el-textarea__inner{
            min-height: 200px !important;
        }
    }
</style>
