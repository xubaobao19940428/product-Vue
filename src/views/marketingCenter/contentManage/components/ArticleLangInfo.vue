<template>
    <div class="article-info">
        <div class="type-title-prompt">以下仅设置当前语言信息</div>
            <div class="type-title">基础信息</div> 
            <el-form ref="articleInfo" :model="articleLangInfo[showFormIndex]" label-width="80px">
                <el-form-item label="标题：" prop="articleTitle" :rules="{ required: articleLangInfo[showFormIndex].language == 'cn' || articleLangInfo[showFormIndex].language == 'en'?true:false, message: '不能为空', trigger: 'blur' }">
                <el-input v-model="articleLangInfo[showFormIndex].articleTitle"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="articleDescribe" :rules="{ required: articleLangInfo[showFormIndex].language == 'cn' || articleLangInfo[showFormIndex].language == 'en'?true:false, message: '不能为空', trigger: 'blur' }">
                    <el-input type="textarea" v-model="articleLangInfo[showFormIndex].articleDescribe"></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" prop="coverPic" :rules="{ required: articleLangInfo[showFormIndex].language == 'cn' || articleLangInfo[showFormIndex].language == 'en'?true:false, message: '请上传一张图片', trigger: 'change' }">
                    <c-upload class="dealPicDarg" :fileList="articleLangInfo[showFormIndex].coverPic.join('')" @setData="setCoverImg" :limit="1" accept="image/jpeg,image/jpg,image/png,image/gif"></c-upload>
                </el-form-item>
                <div class="type-title">分享设置</div>
                <el-form-item label="标题：" prop="shareTitle" :rules="{ required: articleLangInfo[showFormIndex].language == 'cn' || articleLangInfo[showFormIndex].language == 'en'?true:false, message: '不能为空', trigger: 'blur' }">
                    <el-input v-model="articleLangInfo[showFormIndex].shareTitle"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="shareDescribe" :rules="{ required: articleLangInfo[showFormIndex].language == 'cn' || articleLangInfo[showFormIndex].language == 'en'?true:false, message: '不能为空', trigger: 'blur' }">
                    <el-input type="textarea" v-model="articleLangInfo[showFormIndex].shareDescribe"></el-input>
                </el-form-item>
                <el-form-item label="分享图片：" prop="sharePic" :rules="{ required: articleLangInfo[showFormIndex].language == 'cn' || articleLangInfo[showFormIndex].language == 'en'?true:false, message: '请上传一张图片', trigger: 'change' }">
                    <c-upload :fileList="articleLangInfo[showFormIndex].sharePic" @setData="shareImg" :limit="1" accept="image/jpeg,image/jpg,image/png,image/gif"></c-upload>
                </el-form-item>
            </el-form>
    </div>
</template>
<script>
    import cUpload from '@/components/fileUpload/'
    import { dealShowFileSrc } from '@/js/common/globalMethod'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                
            }
        },
        props:{
            showFormIndex:Number
        },
        components:{
            cUpload
        },
        computed: {
            ...mapState({
                articleLangInfo:state=>state.contentManage.articleLangInfo
            })
        },
        methods: {
            setCoverImg(res){
                this.articleLangInfo[this.showFormIndex].coverPic = [this.dealShowFileSrc(res.data)]
                console.log(this.articleLangInfo[this.showFormIndex].coverPic)
            },
            shareImg(res){
                this.articleLangInfo[this.showFormIndex].sharePic = this.dealShowFileSrc(res.data)
            },
            getData () {
                let self = this
                console.log(this.$refs)
                return new Promise((resolve) => {
                    self.$refs['articleInfo'].validate((valid) => {
                        if (valid) {
                            resolve()
                        } else {
                            this.$message.warning('请输入必填项')
                        }
                    })
                })
            },
        },
    }
</script>
<style lang="scss">
    .article-info{
        .el-form-item__label{
            // width: 70px !important;
        }
    }
</style>
<style lang="scss" scoped>
    .article-info{
        .type-title-prompt{
            margin-bottom: 10px;
        }
        .type-title{
            margin-bottom: 10px;
        }
        .required {
            float: left;
            margin-top: 10px;
            margin-right: 3px;
            font-size: 16px;
            color: red;
            vertical-align: middle;
        }
    }
</style>