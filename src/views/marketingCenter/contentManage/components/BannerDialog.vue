<template>
    <el-dialog
        :title="isAddBanner?'添加Banner':'编辑Banner'"
        :visible.sync="toggle"
        width="50%"
        :before-close="cancle"
        class="banner-dialog">
        <div>
            <div>国家：{{initData.countryName}}</div>
            <el-form :model="bannerInfo" :rules="rules" ref="ruleForm" label-width="100px" class="banner-form">
                <!-- {{bannerInfo}} -->
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="bannerInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="文章id：" prop="id">
                    <el-input v-model="bannerInfo.id"></el-input>
                </el-form-item>
                <el-form-item label="Banner：" prop="pic">
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="bannerInfo.bannerPic" @setData="bannerImg" accept="image/jpeg,image/jpg,image/png"></multi-lang-file-upload>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { mapState } from 'vuex'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { dealShowFileSrc } from '@/js/common/globalMethod'

    export default {
        data(){
            return{
                rules: {
                    name: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    id: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    pic: [{ required: true, message: '请上传一张图片', trigger: 'change' }]
                },
            }
        },
        props:{
            dialogVisible: {
                type: Boolean,
                default: false
            },
            isAddBanner: {
                type: Boolean,
                default: true
            },
            bannerInfo:[Object,Array]
        },
        components:{
            multiLangFileUpload
        },
        computed:{
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
            ...mapState({
                initData:state=>state.contentManage.initData,
            })
        },
        methods:{
            cancle(){
                this.$emit('on-cancle')
            },
            confirm(){
                this.$emit('on-confirm')
            },
            bannerImg(res){
                console.log(res)
                this.bannerInfo.bannerPic = res
            },
        }
    }
</script>
<style lang="scss">
    .banner-dialog{
        .el-form-item__label{
            text-align: left;
        }
    }
</style>
<style lang="scss" scoped>

</style>