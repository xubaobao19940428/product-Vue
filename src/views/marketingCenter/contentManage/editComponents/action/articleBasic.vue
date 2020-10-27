<template>
    <div>
        <!-- 瀑布流-->
        <template v-if="pageData.contentType == 3">
            <el-form ref="pageInfo" :rules="rules" :model="pageInfo" label-width="82px">
                <div class="type-title">基础信息</div>
                <el-form-item label="当前国家：">{{ getCountryName() }}</el-form-item>
                <!-- <el-form-item label="用户分级：" prop="userLevel">
                    <el-checkbox-group v-model="pageInfo.userLevel" @change="updatePageInfo">
                        <el-checkbox v-for="(item, key) in levelList" :label="item.id" :key="key">{{ item.value }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item> -->
                <el-form-item label="内容标签： ">
                    <el-select v-model="pageInfo.contentTag" multiple
                               :filterable="true"
                               remote
                               :remote-method="getTagList"
                               :multiple-limit="6"
                               @change="setContentTag"
                               placeholder="多选">
                        <el-option v-for="item in contentTag" :key="item.id" :value="item.id" :label="item.tagName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专栏：">
                    {{ columnList.specialColumnName }}
                </el-form-item>
                <el-form-item label="话题： ">
                    <el-select v-model="pageInfo.articleTopicId"
                               :filterable="true"
                               @change="updatePageInfo">
                        <el-option v-for="item in topics" :key="item.topicId" :value="item.topicId" :label="getMultiLangShowInfo(item.topicName)"></el-option>
                    </el-select>
                </el-form-item>
                <div class="type-title">数据展示</div>
                <el-form-item label="收藏基数：" prop="collectBaseNumber">
                    <el-input v-model="pageInfo.collectBaseNumber" @change="updatePageInfo"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="articleInfo" :model="articleBaseInfo" :rules="articleRule" label-width="80px">
                <div class="type-title">文章信息</div>
                <el-form-item label="文章标题：" prop="articleTitle">
                    <el-input v-model="articleBaseInfo.articleTitle" @change="updateLangBaseInfo"></el-input>
                </el-form-item>
                <div class="type-title">分享设置</div>
                <el-form-item label="标题：" prop="shareTitle">
                    <el-input v-model="articleBaseInfo.shareTitle"  @change="updateLangBaseInfo"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="shareDescribe">
                    <el-input type="textarea" v-model="articleBaseInfo.shareDescribe"  @change="updateLangBaseInfo"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <!-- 图文-->
        <template v-else>
            <el-form ref="pageInfo" :rules="rules" :model="pageInfo" label-width="82px">
                <el-form-item label="当前国家：">{{ getCountryName() }}</el-form-item>
                <el-form-item label="用户分级：" prop="userLevel">
                    <el-checkbox-group v-model="pageInfo.userLevel" @change="updatePageInfo">
                        <el-checkbox v-for="(item, key) in levelList" :label="item.id" :key="key">{{ item.value }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="内容标签： ">
                    <el-select v-model="pageInfo.contentTag" multiple
                               :filterable="true"
                               remote
                               :remote-method="getTagList"
                               :multiple-limit="6"
                               @change="setContentTag"
                               placeholder="多选">
                        <el-option v-for="item in contentTag" :key="item.id" :value="item.id" :label="item.tagName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专栏：">
                    {{ columnList.specialColumnName }}
                </el-form-item>
                <el-form-item label="专题：">
                    {{ columnList.specialSubjectName }}
                </el-form-item>
                <div class="type-title">数据展示</div>
                <el-form-item label="浏览基数：" prop="browserBaseNumber">
                    <el-input v-model="pageInfo.browserBaseNumber" @change="updatePageInfo"></el-input>
                </el-form-item>
                <el-form-item label="分享基数：" prop="shareBaseNumber">
                    <el-input v-model="pageInfo.shareBaseNumber" @change="updatePageInfo"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="articleInfo" :model="articleBaseInfo" :rules="articleRule" label-width="80px">
                <div class="type-title">基础信息</div>
                <el-form-item label="文章标题：" prop="articleTitle">
                    <el-input v-model="articleBaseInfo.articleTitle" @change="updateLangBaseInfo"></el-input>
                </el-form-item>
                <el-form-item label="封面图片：" prop="coverPic">
                    <c-upload class="dealPicDarg" ref="coverImg" :fileList="articleBaseInfo.coverPicString" @setData="setCoverImg" :limit="1" accept="image/jpeg,image/jpg,image/png,image/gif"></c-upload>
                </el-form-item>
                <div class="type-title">分享设置</div>
                <el-form-item label="分享标题：" prop="shareTitle">
                    <el-input v-model="articleBaseInfo.shareTitle"  @change="updateLangBaseInfo"></el-input>
                </el-form-item>
                <el-form-item label="分享描述：" prop="shareDescribe">
                    <el-input type="textarea" v-model="articleBaseInfo.shareDescribe"  @change="updateLangBaseInfo"></el-input>
                </el-form-item>
                <el-form-item label="分享图片：" prop="sharePic">
                    <c-upload :fileList="articleBaseInfo.sharePic" ref="shareImg" @setData="setShareImg" :limit="1" accept="image/jpeg,image/jpg,image/png,image/gif"></c-upload>
                </el-form-item>
            </el-form>
        </template>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import cUpload from '@/components/fileUpload/'
    import { FindAllSearchTag } from '@/request/manage.js'

    export default {
        props: {
            columnList: Object,
            topics: Array
        },
        data () {
            return {
                pageInfo: {
                    contentType: 1, // 图文
                    userLevel: [],
                    contentTag: [],
                    browserBaseNumber: '0',
                    shareBaseNumber: '0',
                    collectBaseNumber: '0',
                    articleTopicId: ''
                },
                rules: {
                    // userLevel: [{ required: true, message: '请至少选择一个', trigger: 'change' }]
                },
                articleBaseInfo: {
                    articleTitle: '',
                    articleDescribe: '',
                    coverPicString: '',
                    coverPic: [],
                    shareTitle: '',
                    shareDescribe: '',
                    sharePic: ''
                },
                articleRule: {
                    articleTitle: [{ required: true, message: '不能为空', trigger: 'change' }],
                    articleDescribe: [{ required: true, message: '不能为空', trigger: 'change' }],
                    coverPic: [{ required: true, message: '不能为空', trigger: 'change' }],
                    shareTitle: [{ required: true, message: '不能为空', trigger: 'change' }],
                    shareDescribe: [{ required: true, message: '不能为空', trigger: 'change' }],
                    sharePic: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                contentTag: [],
                topicList: []
            }
        },
        computed: {
            ...mapState({
                levelList: state => state.contentManage.levelList,
                countryList: state => state.dict.countryList,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                pageData: state => state.contentManage.pageData,
                currentLangIndex: state => state.contentManage.currentLangIndex,
                storeContentTag: state => state.contentManage.contentTag
            }),
            curLangData () {
                return this.articleLangInfos[this.currentLangIndex]
            }
        },
        components: {
            cUpload
        },
        watch: {
            pageData (val) {
                this.pageInfo = val
            },
            curLangData () {
                this.init()
            },
            storeContentTag (val) {
                console.log('===>',val)
                this.contentTag = val.concat(this.contentTag)
                console.log('===>',this.contentTag)
                let result = [];
                let obj = {};
                for(var i =0; i<this.contentTag.length; i++){
                    if(!obj[this.contentTag[i].id]){
                        result.push(this.contentTag[i]);
                        obj[this.contentTag[i].id] = true;
                    }
                }
                this.contentTag = [].concat(result)
                console.log(this.contentTag)
            }
        },
        created () {
            this.pageInfo = this.pageData
            this.init()
            // this.getTagList()
            this.topicList = localStorage.topicList ? JSON.parse(localStorage.topicList) : []
        },
        mounted () {
            this.getTagList()
        },
        methods: {
            init () {
                if (this.currentLangIndex != -1) {
                    this.articleBaseInfo = this.articleLangInfos[this.currentLangIndex]
                    this.articleBaseInfo['coverPicString'] = this.articleBaseInfo.coverPic && this.articleBaseInfo.coverPic.length > 0 ? this.articleBaseInfo.coverPic[0] : ''
                    if (this.$refs.coverImg) {
                        this.$refs.coverImg.setFileList(this.articleBaseInfo.coverPicString)
                    }
                    if (this.$refs.shareImg) {
                        this.$refs.shareImg.setFileList(this.articleBaseInfo.sharePic)
                    }
                }
            },
            setContentTag () {
                this.$store.commit('UPDATE_CONTENT_TAG', this.contentTag)
                this.updatePageInfo()
            },
            getCountryName () {
                let item = this.countryList.find((val) => {
                    return val.shortCode == this.$route.query.countryCode
                })
                return item ? item.nameLocal : this.$route.query.countryCode
            },
            setCoverImg (res) {
                this.articleBaseInfo.coverPicString = res.data
                this.articleBaseInfo.coverPic = [res.data]
                this.updateLangBaseInfo()
            },
            setShareImg (res) {
                this.articleBaseInfo.sharePic = res.data
                this.updateLangBaseInfo()
            },
            updateLangBaseInfo () {
                this.$store.dispatch('updateArticleLangData', this.articleBaseInfo)
            },
            updatePageInfo () {
                this.$store.dispatch('updateArticlePageData', this.pageInfo)
            },
            getTagList (query) {
                // if (!query) {
                //     return
                // }
                FindAllSearchTag({
                    pageInfo: {
                        pageNum: 1,
                        pageSize: 500,
                        pagingSwitch: true
                    },
                    tagName: query? query:'',
                    tagId: []
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        // if (res.tags.length !==0) {
                        //     for (let i = 0; i < res.tags.length; i++) {
                        //         let item = this.contentTag.find((val) => {
                        //             return val.id == res.tags[i].id
                        //         })
                        //         if (!item) {
                        //             this.contentTag.unshift(res.tags[i])
                        //         }else{

                        //         }
                        //     }
                        // }else {
                            this.contentTag = [].concat(res.tags)
                            let result = [];
                            let obj = {};
                            for(var i =0; i<this.contentTag.length; i++){
                                if(!obj[this.contentTag[i].id]){
                                    result.push(this.contentTag[i]);
                                    obj[this.contentTag[i].id] = true;
                                }
                            }
                            this.contentTag = [].concat(result)
                        // }
                        console.log(this.contentTag)
                    }
                })
            },
            getMultiLangShowInfo (data) {
                if (this.currentLangIndex != -1) {
                    let lang = this.articleLangInfos[this.currentLangIndex].language
                    let item = data.find((val) => {
                        return val.language == lang
                    })
                    return item ? item.content : ''
                }
                return ''
            }
        }
    }
</script>
<style lang="scss">
    .edit-content-type{
        .el-form-item__label{
            text-align: left !important;
            color: #333333;
        }
        .el-form-item__content{
            margin-left: 0px;
        }
        .el-checkbox-button__inner{
            padding: 12px 10px;
        }
        .el-checkbox-button.is-disabled:first-child .el-checkbox-button__inner{
            color: #FFF;
            background-color: #409EFF;
            border-color: #409EFF;
        }
    }
</style>
<style lang="scss" scoped>
    .edit-content-type{
        .type-title{
            padding: 0 0 10px 0;
            font-weight: 500;
            font-size: 16px;
        }
        .type-title-prompt{
            padding: 5px 0 10px 0;
            font-size: 12px;
            color: #b0b0b0;
        }
    }
</style>
