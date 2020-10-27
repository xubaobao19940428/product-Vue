<template>
    <div class="page-title">
        <div class="head">
            <h5>页面设置</h5>
        </div>
        <div class="content">
            <el-form :model="info">
                <el-form-item label="适用国家">
                    <div class="margin-left">
                        <span class="common-text">{{ info.countryCode | countryFilter }}</span>
                    </div>
                </el-form-item>
                <el-form-item label="页面标题" class="label-line">
                    <el-select v-model="nameLang" style="width: 31%">
                        <el-option v-for="(item, index) in languageList"
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in info.title" v-show="nameLang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input v-model="item.name"
                            @change="handleChange({title: info.title})"
                            type="text"
                            placeholder="请输入"/>
                    </div>
                </el-form-item>
                <el-form-item label="显示方式" class="label-line">
                    <el-radio-group v-model="info.showType" @change="(val) => handleChange({showType: info.showType})">
                        <el-radio-button :label="1">固定在顶部</el-radio-button>
                        <!-- <el-radio-button :label="2">下滑时显示</el-radio-button> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="label-line border-line">
                    <template slot="label">
                        <span>背景颜色</span>
                        <show-color style="marginLeft: 24px;" :color="info.background"></show-color>
                    </template>
                    <el-radio-group v-model="backgroundType" @change="handleBackgroundChange">
                        <el-radio-button label="transparent">透明</el-radio-button>
                        <el-radio-button label="white">白色</el-radio-button>
                        <el-radio-button label="custom">自定义</el-radio-button>
                    </el-radio-group>
                    <el-color-picker
                        v-show="backgroundType === 'custom'"
                        v-model="info.background"
                        @change="(val) => handleChange({background: val})"
                    ></el-color-picker>
                </el-form-item>
                <el-form-item label="页面时效" class="label-line is-required">
                    失效时间
                    <el-date-picker
                        v-model="info.endTime"
                        type="datetime"
                        value-format="timestamp"
                        @change="(val) => handleChange({endTime: val.toString()})"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="页面分享">
                    <div class="margin-left">
                        <span class="common-text">{{ info.share == 1 ? '启用' : '不启用' }}</span>
                        <el-checkbox class="right"
                            v-model="info.share"
                            :true-label="1"
                            :false-label="2"
                            @change="(val) => handleChange({share: val})"
                        ></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="分享标题" class="label-line" v-show="info.share === 1">
                    <el-select v-model="titleLang" style="width: 31%">
                        <el-option v-for="(item, index) in languageList"
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in info.shareTitle" v-show="titleLang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input
                            v-model="item.name"
                            type="text"
                            placeholder="请输入"
                            @change="handleChange({shareTitle: info.shareTitle})"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="分享描述" class="label-line" v-show="info.share === 1">
                    <el-select v-model="descLang" style="width: 31%">
                        <el-option v-for="(item, index) in languageList"
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in info.shareDescription" v-show="descLang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input
                            v-model="item.name"
                            show-word-limit
                            type="text"
                            placeholder="请输入"
                            @change="handleChange({shareDescription: info.shareDescription})"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="分享图片" class="label-line" v-show="info.share === 1">
                    <multi-lang-file-upload
                        :propFileList="info.shareImg"
                        @setData="setShareImg"
                        accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import showColor from '../common/showColor'
    import { mapState } from 'vuex'
    export default {
        components: {
            multiLangFileUpload,
            showColor
        },
        data() {
            return {
                nameLang: 'cn',
                titleLang: 'cn',
                descLang: 'cn',
                backgroundType: 'white',
                info: {
                    countryCode: '',
                    background: '',
                    showType: 0,
                    title: [],
                    share: 2, // 分享是否启用 1- 启用 2 - 停用
                    shareTitle: [],
                    shareDescription: [], // 分享描述也是多语言
                    shareImg: [], // 分享图片也是多语言的
                    endTime: ''
                }
            }
        },
        watch: {
            pageData: {
                handler (val, oldVal) {
                    Object.assign(this.info, {
                        countryCode: '',
                        background: '',
                        showType: 0,
                        share: 2, // 分享是否启用 1- 启用 2 - 停用
                        shareImg: [], // 分享图片也是多语言的
                        endTime: ''
                    }, val)
                    this.initList(val)
                },
                deep: true
            }
        },
        computed: {
            ...mapState({
                languageList: state => state.dict.languageList,
                pageData: state => state.pageEdit.pageData
            }),
            langList (data) {
                let temp = []
                for (let i = 0; i < this.languageList.length; i++) {
                    let item = this.languageList[i]
                    temp.push({
                        languageCode: item.code,
                        name: ''
                    })
                }

                return temp
            }
        },
        created () {
            Object.assign(this.info, {
                countryCode: '',
                background: '',
                showType: 0,
                share: 2, // 分享是否启用 1- 启用 2 - 停用
                endTime: ''
            }, this.pageData)
            // 刚进来的时候，需要考虑背景色的选项
            if (this.pageData.background == 'transparent') {
                this.backgroundType = 'transparent'
            } else if (this.pageData.background == '#FFF') {
                this.backgroundType = 'white'
            } else {
                this.backgroundType = 'custom'
            }
            this.initList(this.pageData)
        },
        methods: {
            handleBackgroundChange (val) {
                switch (val) {
                    case 'transparent':
                        this.info.background = 'transparent'
                        break
                    case 'white':
                        this.info.background = '#FFF'
                        break
                }
                this.handleChange({background: this.info.background})
            },
            handleChange(obj) {
                this.$store.dispatch('updateWholePageData', obj)
            },
            setShareImg (data) {
                this.info.shareImg = data

                this.$store.dispatch('updateWholePageData', {shareImg: data})
            },
            initList (data) {
                if (!data.title || !data.title.length) {
                    this.info.title = JSON.parse(JSON.stringify(this.langList))
                }

                if (!data.shareTitle || !data.shareTitle.length) {
                    this.info.shareTitle = JSON.parse(JSON.stringify(this.langList))
                }

                if (!data.shareDescription || !data.shareDescription.length) {
                    this.info.shareDescription = JSON.parse(JSON.stringify(this.langList))
                }
            }
        }
    }
</script>
<style lang="scss">
    .page-title {
        .content {
            .el-color-picker {
                display: block;
                margin-top: 8px;
            }
            .margin-left {
                margin-left: 86px;
            }
        }
    }
</style>
