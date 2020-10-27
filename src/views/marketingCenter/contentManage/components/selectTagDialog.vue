<template>
    <el-dialog
        title="标签选择"
        :visible.sync="propShowDialog"
        width="50%"
        :before-close="close">
        <div>
            <el-form :model="tagParam"  ref="ruleForm" label-width="100px" class="banner-form">
                <el-form-item label="内容标签： ">
                    <el-select v-model="tagParam.contentTag" multiple
                               :filterable="true"
                               remote
                               :remote-method="getTagList"
                               :multiple-limit="6"
                               placeholder="多选">
                        <el-option v-for="item in contentTag" :key="item.id" :value="item.id" :label="item.tagName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { FindAllSearchTag, EditArticleTag } from '@/request/manage.js'
    export default {
        props: {
            propShowDialog: Boolean,
            articleCode: String,
            propContentTag: Array
        },
        data () {
            return {
                tagParam: {
                    contentTag: []
                },
                contentTag: []
            }
        },
        created () {
            this.contentTag = JSON.parse(JSON.stringify(this.propContentTag))
            for (let i = 0; i < this.contentTag.length; i++) {
                this.tagParam.contentTag.push(this.contentTag[i].id)
            }
        },
        mounted () {
            this.getTagList()
        },
        methods: {
            getTagList (query) {
                // if (!query) {
                //     return
                // }
                FindAllSearchTag({
                    tagName: query? query:'',
                    tagId: []
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        // for (let i = 0; i < res.tags.length; i++) {
                        //     let item = this.contentTag.find((val) => {
                        //         return val.id == res.tags[i].id
                        //     })
                        //     if (!item) {
                        //         this.contentTag.unshift(res.tags[i])
                        //     }
                        // }
                        this.contentTag = res.tags
                    }
                })
            },
            close () {
                this.$emit('close')
            },
            confirm () {
                EditArticleTag({
                    articleCode: this.articleCode,
                    contentTag: this.tagParam.contentTag
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('设置成功')
                        this.$emit('confirm')
                    }
                })
            }
        }
    }
</script>
