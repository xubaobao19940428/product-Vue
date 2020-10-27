<template>
    <div class="content-edit-wrapper">
        <div class="tar">
            <el-button type="text" @click="close" v-loading="pending" size="medium">取 消</el-button>
            <el-button type="primary" size="medium" @click="submitData" v-loading="pending">保 存</el-button>
        </div>
        <div class="page-edit-content">
            <div class="components-nav-box" v-if="pageData.contentType == 1">
                <c-nav></c-nav>
            </div>
            <div class="components-preview-box">
                <div class="components-preview-btn-box">
                    <!-- <button @click="showSync"> 一键同步 </button>
                    <button @click="showSync"> 一键翻译 </button> -->
                    <el-button @click="showSync">一键同步</el-button>
                    <el-button v-if="pageData.contentType == 3" @click="translationClick">一键翻译</el-button>
                </div>
                <div class="components-preview-content-box">
                    <div class="article-lang-box">
                        <ul>
                            <li v-for="(item, i) in articleLangInfos" @click="switchLangIndex(i)" :class="currentLangIndex == i ? 'active' : ''" :key="item.language + '_' + i">{{ getLangName(item.language) }}</li>
                        </ul>
                        <button @click="addLanguage"> + 编辑语言 </button>
                    </div>
                    <c-preview></c-preview>
                    <ul class="tip-icon-box">
                        <li @click="handleSet(-1)" :class="currentComponentIndex === -1 ? 'active' : ''">
                            <i class="el-icon-tickets"></i>
                            页面设置
                        </li>
                        <div v-if="pageData.contentType == 3">
                            <li @click="handleSet(-2)" :class="currentComponentIndex === -2 ? 'active' : ''">头像设置</li>
                            <li @click="handleSet(0)" :class="currentComponentIndex === 0 ? 'active' : ''">图片设置</li>
                            <li @click="handleSet(1)" :class="currentComponentIndex === 1 ? 'active' : ''">商品设置</li>
                            <li @click="handleSet(2)" :class="currentComponentIndex === 2 ? 'active' : ''">内容设置</li>
                        </div>
                    </ul>
                </div>
            </div>
            <div class="components-action-box">
                <c-action></c-action>
            </div>
        </div>
        <el-dialog
            title="选择语言"
            :visible="showSelectLang"
            width="460px"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <el-form :model="form" label-width="128px" ref="countryForm" :rules="rules">
                <el-form-item label="语言：" prop="lang">
                    <el-select v-model="form.lang"
                               filterable
                               multiple
                               size="medium">
                        <el-option v-for="item in languageList"
                                   :key="item.code"
                                   :label="item.desc"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button size="medium" @click="closeLangDialog">取消</el-button>
                <el-button type="primary" size="medium" @click="selectDefaultLang">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择语言"
            :visible="showSyncDialog"
            width="460px"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <el-form label-width="128px" ref="countryForm" v-if="currentLangIndex != -1">
                <el-form-item label="当前语言：">
                    <span>{{ getLangName(articleLangInfos[currentLangIndex].language) }}</span>
                </el-form-item>
                <el-form-item label="同步至：">
                    <el-checkbox-group v-model="selectLangList">
                        <el-checkbox v-for="item in languageList"
                                     :key="item.code"
                                     :disabled="item.code == articleLangInfos[currentLangIndex].language"
                                     :label="item.code">{{ item.desc }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button size="medium" @click="showSyncDialog = false">取消</el-button>
                <el-button type="primary" size="medium" @click="syncLangContent">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import cNav from './editComponents/leftNavBox'
    import cPreview from './editComponents/previewBox'
    import cAction from './editComponents/rightActionBox'
    import { AddArticle, EditArticle, ViewArticleDetail } from '@/request/manage'
    import { getOneKeyTranslation } from '@/request/i18n'
    import { createRandomId } from '@/utils/index.js'

    export default {
        data () {
            return {
                pending: false,
                showSelectLang: false,
                showSyncDialog: false,
                form: {
                    type: 'add',
                    lang: ['cn','en','ms','th','id']
                },
                rules: {
                    lang: [{ required: true, message: '请选择' }]
                },
                selectLangList: []
            }
        },
        components: {
            cNav,
            cPreview,
            cAction
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                languageList: state => state.dict.languageList,
                articleLangInfos: state => state.contentManage.articleLangInfos,
                currentLangIndex: state => state.contentManage.currentLangIndex,
                currentComponentIndex: state => state.contentManage.currentComponentIndex,
                baseLayout: state => state.contentManage.baseLayout,
                pageData: state => state.contentManage.pageData,
                leftNavList: state => state.contentManage.leftNavList,
                waterfallBaseComponents: state => state.contentManage.waterfallBaseComponents,
                initData: state => state.contentManage.initData,
                shareDescirbeDeafult: state => state.contentManage.shareDescirbeDeafult,
                shareTitleDeafult: state => state.contentManage.shareTitleDeafult
            }),
            componentsData () {
                if (this.currentLangIndex != -1 && this.articleLangInfos.length > 0) {
                    return this.articleLangInfos[this.currentLangIndex].contentComponents
                }
                return []
            }
        },
        created () {
            if (this.$route.query.articleCode) {
                this.getArticleInfo()
            } else {
                this.$store.dispatch('resetArticleInfo')
                if (this.$route.query.contentType) {
                    this.$store.dispatch('updateArticlePageData', {
                        contentType: this.$route.query.contentType
                    })
                }
                this.showSelectLang = true
            }
        },
        methods: {
            // 关闭
            close () {
                this.$store.dispatch('resetArticleInfo')
                this.$router.go(-1)
                // console.log(this.pageData)
                // this.$router.push({
                //     name: 'contentManage',
                //     query:{
                //         specialColumnId: this.pageData.specialColumnId,
                //         specialSubjectId: this.pageData.specialSubjectId,
                //         contentType: this.pageData.contentType,
                //         countryCode: this.initData.countryCode
                //     }
                // })
            },
            // 关闭语言弹窗
            closeLangDialog () {
                if (this.form.type == 'edit') {
                    this.showSelectLang = false
                } else {
                    this.close()
                }
            },
            // 添加语言
            addLanguage () {
                this.form.type = 'edit'
                this.form.lang = []
                for (let i = 0; i < this.articleLangInfos.length; i++) {
                    this.form.lang.push(this.articleLangInfos[i].language)
                }
                this.showSelectLang = true
            },
            // 获取语言名称
            getLangName (code) {
                let item = this.languageList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            // 选择语言
            selectDefaultLang () {
                if (this.form.lang.length <= 0) {
                    return this.$message.warning('请至少选择一门语言')
                }
                let newArticleLangInfos = []
                for (let i = 0; i < this.form.lang.length; i++) {
                    let val = JSON.parse(JSON.stringify(this.baseLayout))
                    val.language = this.form.lang[i]
                    val.shareTitle = this.shareTitleDeafult[val.language]
                    val.shareDescribe = this.shareDescirbeDeafult[this.form.lang[i]]
                    val.moduleId = createRandomId()
                    let item = this.articleLangInfos.find((data) => {
                        return data.language == val.language
                    })
                    if (item) {
                        newArticleLangInfos.push(item)
                    } else {
                        if (this.$route.query.contentType == 3) {
                            let waterfallBaseComponents = [{
                                componentType: 2,
                                componentLocation: '0',
                                moduleId: createRandomId(),
                                componentValue: JSON.stringify({
                                    componentName: 'swipe',
                                    data: {
                                        video: '',
                                        videoCover: '',
                                        img: ''
                                    }
                                })
                            }, {
                                componentType: 2,
                                componentName: 'productList',
                                componentLocation: '1',
                                moduleId: createRandomId(),
                                componentValue: JSON.stringify({
                                    componentName: 'productList',
                                    isChange: true,
                                    data: []
                                })
                            }, {
                                componentType: 2,
                                componentName: 'topic',
                                componentLocation: '2',
                                moduleId: createRandomId(),
                                componentValue: JSON.stringify({
                                    componentName: 'topic',
                                    data: ''
                                })
                            }]
                            val.contentComponents = waterfallBaseComponents
                            newArticleLangInfos.push(val)
                        } else {
                            newArticleLangInfos.push(val)
                        }
                    }
                }
                console.log(newArticleLangInfos)
                this.$store.dispatch('langArticleAction', newArticleLangInfos)
                this.switchLangIndex(0)
                this.showSelectLang = false
            },
            showSync () {
                this.showSyncDialog = true
                this.selectLangList = []
            },
            // 语言内容同步
            syncLangContent () {
                let articleLangInfos = JSON.parse(JSON.stringify(this.articleLangInfos))
                for (let i = 0; i < this.selectLangList.length; i++) {
                    let curLangArticle = JSON.parse(JSON.stringify(articleLangInfos[this.currentLangIndex]))
                    let itemI = articleLangInfos.findIndex((val) => {
                        return val.language == this.selectLangList[i]
                    })
                    if (itemI != -1) {
                        articleLangInfos[itemI] = curLangArticle
                        articleLangInfos[itemI].language = this.selectLangList[i]
                    } else {
                        articleLangInfos.push(Object.assign(curLangArticle, {
                            language: this.selectLangList[i]
                        }))
                    }
                }
                this.$store.dispatch('langArticleAction', articleLangInfos)
                this.showSyncDialog = false
                console.log(articleLangInfos)
            },
            // 切换语言
            switchLangIndex (i) {
                this.$store.dispatch('updateArticleLangIndex', i)
                this.$store.dispatch('updateArticleComponentsIndex', -1)
            },
            getMultiLangShowInfo (data) {
                if (this.currentLangIndex != -1) {
                    let lang = this.articleLangInfos[this.currentLangIndex].language
                    let item = data.find((val) => {
                        return val.language == lang
                    })
                    return item ? item.content : ''
                }
                return data.length > 0 ? data[0].content : ''
            },
            // 获取文章信息
            getArticleInfo () {
                ViewArticleDetail({
                    articleCode: this.$route.query.articleCode
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        let contentTag = []
                        for (let i = 0; i < res.contentTag.length; i++) {
                            contentTag.push({
                                id: res.contentTag[i].tagId,
                                tagName: this.getMultiLangShowInfo(res.contentTag[i].tagName)
                            })
                            res.contentTag[i] = res.contentTag[i].tagId
                        }
                        this.$store.commit('UPDATE_CONTENT_TAG', contentTag)
                        this.$store.dispatch('updateArticlePageData', res)
                        for (let i = 0; i < res.articleLangInfo.length; i++) {
                            for (let j = 0; j < res.articleLangInfo[i].contentComponents.length; j++) {
                                let data = this.leftNavList.find((val) => {
                                    return val.componentType == res.articleLangInfo[i].contentComponents[j].componentType
                                })
                                res.articleLangInfo[i].contentComponents[j]['moduleId'] = createRandomId()
                                res.articleLangInfo[i].contentComponents[j]['componentName'] = data.basicName
                            }
                        }
                        this.$store.dispatch('langArticleAction', res.articleLangInfo)
                        this.switchLangIndex(0)
                    }
                })
            },
            //一键翻译
            translationClick () {
                console.log(this.articleLangInfos)
                let componentValue = []
                for (const iterator of this.articleLangInfos) {
                    if (iterator.language !== 'cn') {
                        componentValue.push({
                            fromLanguageCode: 'cn',
                            toLanguageCode: iterator.language,
                            originContent:`${iterator.articleTitle}～${iterator.shareTitle}～${iterator.shareDescribe}～${JSON.parse(iterator.contentComponents[2].componentValue).data}`
                        })
                    }
                }
                console.log(componentValue)
                getOneKeyTranslation({oneKeyTranslationUnit:componentValue}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        for (const iterator of this.articleLangInfos) {
                            for (const val of res.oneKeyTranslationUnit) {
                                if (val.toLanguageCode === iterator.language) {
                                    let data = val.translation.split('~')
                                    iterator.articleTitle = data[0]
                                    iterator.shareTitle = data[1].trim()
                                    iterator.shareDescribe = data[2].trim()
                                    iterator.contentComponents[2].componentValue = JSON.stringify(Object.assign(JSON.parse(iterator.contentComponents[2].componentValue),{data:data[3]}))
                                }
                            }
                        }
                        console.log(this.articleLangInfos)
                        this.$message.success('翻译成功！')
                    }else {
                        this.$message.error('翻译失败！')
                    }
                })
            },
            // 保存
            submitData () {
                let param = JSON.parse(JSON.stringify(this.pageData))
                param['articleLangInfos'] = JSON.parse(JSON.stringify(this.articleLangInfos))
                if (this.pageData.contentType == 1) {
                    if (param.userLevel.length <= 0) {
                        this.$message.warning('请选择用户等级')
                        return false
                    }
                    for (let i = 0; i < param.articleLangInfos.length; i++) {
                        let item = param.articleLangInfos[i]
                        let langName = this.getLangName(item.language)
                        if (!item.articleTitle) {
                            this.$message.warning('请输入' + langName + '文章标题')
                            return false
                        } else if (item.coverPic.length <= 0) {
                            this.$message.warning('请上传' + langName + '封面图')
                            return false
                        } else if (!item.shareTitle) {
                            this.$message.warning('请输入' + langName + '分享标题')
                            return false
                        } else if (!item.shareDescribe) {
                            this.$message.warning('请输入' + langName + '分享描述')
                            return false
                        } else if (!item.sharePic) {
                            this.$message.warning('请上传' + langName + '分享图片')
                            return false
                        }
                    }
                } else if (this.pageData.contentType == 3) {
                    // if (param.userLevel.length <= 0) {
                    //     this.$message.warning('请选择用户等级')
                    //     return false
                    // }
                    for (let i = 0; i < param.articleLangInfos.length; i++) {
                        let item = param.articleLangInfos[i]
                        let langName = this.getLangName(item.language)
                        let img = []
                        for (let j = 0; j < item.contentComponents.length; j++) {
                            let componentData = JSON.parse(item.contentComponents[j].componentValue)
                            if (componentData.componentName == 'swipe') {
                                if (componentData.data.img) {
                                    img = img.concat(componentData.data.img.split(','))
                                }
                                if (componentData.data.videoCover) {
                                    img.push(componentData.data.videoCover)
                                }
                                if (img.length <= 0) {
                                    img = ['https://file.fingo.shop/fingo/webassets/videoCover.jpg']
                                }
                                break
                            }
                        }
                        item.coverPic = img
                        item.sharePic = img[0]
                        if (!item.articleTitle) {
                            this.$message.warning('请输入' + langName + '文章标题')
                            return false
                        } else if (!item.shareTitle) {
                            this.$message.warning('请输入' + langName + '分享标题')
                            return false
                        } else if (!item.shareDescribe) {
                            this.$message.warning('请输入' + langName + '分享描述')
                            return false
                        }
                    }
                }
                this.fetchData(param)
            },
            // 提交数据
            fetchData (param) {
                let fetchUrl = AddArticle
                if (this.$route.query.articleCode) {
                    fetchUrl = EditArticle
                }
                fetchUrl(this.filterData(param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.close()
                    }
                })
            },
            // 页面设置
            handleSet (i) {
                console.log(i)
                this.$store.dispatch('updateArticleComponentsIndex', i)
            },
            getComponentName (item) {
                let data = this.leftNavList.find((val) => {
                    return val.basicName == item.componentName
                })
                return data ? data.title : item.componentName
            }
        }
    }
</script>
<style lang="scss" scoped>
    .content-edit-wrapper {
        width: 100%;
        height: 100%;
        // overflow: auto;
        overflow: hidden;
        .page-edit-content{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 10px 20px 40px;
            .components-nav-box{
                width: 160px;
                height: 100%;
                background: #fff;
                overflow: auto;
            }
            .components-preview-box{
                flex: 1;
                height: 100%;
                background-color: #f7f8fa;
                box-sizing: border-box;
                padding: 10px 0;
                position: relative;
                overflow: scroll;
            }
            .components-preview-btn-box{
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .components-preview-content-box{
                display: flex;
            }
            .article-lang-box{
                // display: flex;
                box-sizing: border-box;
                padding: 0 10px 0 0;
                ul{
                    // display: flex;
                    li{
                        height: 30px;
                        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
                        border-radius: 2px;
                        line-height: 30px;
                        width: 76px;
                        text-align: center;
                        font-size: 12px;
                        color: #303133;
                        background: #fff;
                        // margin-left: 10px;
                        margin: 10px 0 10px 10px;
                        cursor: pointer;
                    }
                    li:nth-child(1) {
                        border-left: none;
                    }
                    .active{
                        color: #fff;
                        background-color: #155bd4;
                    }
                }
                button{
                    background: #FFF;
                    border: 1px solid #DCDFE6;
                    font-size: 12px;
                    border-radius: 2px;
                    height: 30px;
                    width: 76px;
                    margin-left: 10px;
                    cursor: pointer;
                    &:hover{
                        color: #409EFF;
                        border-color: #c6e2ff;
                        background-color: #ecf5ff;
                    }
                }
            }
            .components-list-icon-box {
                top: 100px;
            }
            .tip-icon-box {
                position: absolute;
                top: 80px;
                right: 10px;
                text-align: center;
                font-size: 12px;
                color: #323233;
                z-index: 1;
                .active {
                    background-color: #155bd4;
                    color: #fff;
                }
                li {
                    background-color: #fff;
                    box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
                    border-radius: 2px;
                    width: 86px;
                    height: 32px;
                    line-height: 32px;
                    margin: 10px 0;
                    cursor: pointer;
                    .com-name {
                        overflow: hidden;
                        display: -webkit-box;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }
                }
            }
            .components-list-icon-box {
                top: 160px;
            }
            .components-action-box{
                width: 376px;
                height: 100%;
                overflow: auto;
                box-sizing: border-box;
                padding: 24px 16px;
                background: #fff;
            }
        }
    }
    .tar {
        text-align: right;
    }
</style>
