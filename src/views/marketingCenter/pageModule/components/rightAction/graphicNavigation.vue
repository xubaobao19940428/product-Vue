<template>
    <div class="page-graphic-navigation">
        <div class="head">
            <h5>图文导航</h5>
        </div>
        <div class="content">
            <el-form :model="info">
                <el-form-item label="组件名称" class="label-line border-line">
                    <el-select v-model="nameLang" style="width: 30%">
                        <el-option v-for="(item, index) in languageList" 
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in name" v-show="nameLang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input v-model="item.name" show-word-limit maxlength="10" type="text" placeholder="请输入" @input="handleNameChange({currentComponentIndex, name})"/>
                    </div>
                </el-form-item>
                <el-form-item label="选择样式" class="label-line">
                    <el-radio-group v-model="info.navStyle" @change="(val) => handleInitParamChange({navStyle: val})">
                        <el-radio-button label="word-img">图文导航</el-radio-button>
                        <el-radio-button label="img">图片导航</el-radio-button>
                        <el-radio-button label="word">文字导航</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="导航位置" class="label-line">
                    <el-radio-group v-model="info.position" @change="(val) => handleInitParamChange({position: val})">
                        <el-radio-button label="gn-sticky">吸顶</el-radio-button>
                        <el-radio-button label="gn-sed">沉底</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设置导航" class="label-line">
                    <p>最多添加 10 张图片，且需保证图片尺寸完全一致，拖拽调整图片顺序</p>
                    <ul class="common-box">
                        <li v-for="(item, index) in info.navList" :key="index">
                            <multi-lang-file-upload 
                                v-if="info.navStyle === 'word-img' || info.navStyle === 'img'"
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                :propFileList="item.imgList"
                                @setData="(data) => setImg(data, index)"
                            ></multi-lang-file-upload>
                            <div class="na-box" style="marginLeft: 10px;fontSize: 12px">
                                <div v-show="info.navStyle === 'word-img' || info.navStyle === 'word'">
                                    标题 <el-select v-model="titleLang" style="width: 41%">
                                        <el-option v-for="(item, index) in languageList" 
                                            :key="index"
                                            :label="item.desc"
                                            :value="item.code"
                                        ></el-option>
                                    </el-select>
                                    <div v-for="(subItem, itemIndex) in item.titleList" :key="itemIndex" v-show="titleLang === subItem.languageCode" class="name-input">
                                        <el-input v-model="subItem.name" show-word-limit maxLength="10" type="text" placeholder="请输入" @input="(val) => handleTitleChange(item.titleList, index)"/>
                                    </div>
                                </div>                     
                                链接 <el-input v-model="item.url" style="width: 86%" @change="(val) => handleUrlChange(val, index)"/>
                            </div>
                        </li>
                        <el-button @click="handleAdd" type="primary" plain>添加图文导航</el-button>
                    </ul>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { mapState } from 'vuex'
    export default {
        components: {
            multiLangFileUpload
        },
        props: {
            data: [Object, Array],
            index: Number,
            handleNameChange: Function,
            currentComponentIndex: [String, Number]
        },
        data () {
            return {
                nameLang: 'cn',
                name: [],
                titleLang: 'cn',
                titleList: [],
                info: {
                    position: 'gn-sticky',
                    navStyle: 'word-img',
                    navList: []
                }
            }
        },
        computed: {
            ...mapState({
                languageList: state => state.dict.languageList,
            })
        },
        watch: {
            data: {
                handler (val) {
                    let { info, name } = val
                    Object.assign(this.info, {
                        position: 'gn-sticky',
                        navStyle: 'word-img',
                        navList: []
                    }, info)
                    this.name = name
                },
                deep: true
            }
        },
        created () {
            let { info, name } = this.data
            Object.assign(this.info, {
                position: 'gn-sticky',
                navStyle: 'word-img',
                navList: []
            },info)
            this.name = name
        },
        methods: {
            initLangContent () {
                let res = []
                for (let i = 0; i < this.languageList.length; i++) {
                    let item = this.languageList[i]
                    res.push({
                        languageCode: item.code,
                        name: ''
                    })
                }

                return res
            },
            handleAdd () {
                let item = {
                    url: '',
                    imgList: [],
                    titleList: this.initLangContent()
                }

                this.info.navList.push(item)
            },
            handleInitParamChange (obj) {
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: obj
                })
            },
            setImg (data, index) {
                this.info.navList[index].imgList = data
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: {navList: this.info.navList}
                })
            },
            handleUrlChange (url, index) {
                this.info.navList[index].url = url
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { navList: this.info.navList }
                })
            },
            handleTitleChange (titleList, index) {
                this.info.navList[index].titleList = titleList
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { navList: this.info.navList }
                })
            }
        }
    }
</script>

<style lang="scss">
    .page-graphic-navigation {
        .head {
            margin-bottom: 16px;
            h5 {
                font-size: 20px;
                margin-bottom: 8px;
                font-weight: 500;
            }
        }
        .label-line {
            .el-form-item__label {
                width: 100%;
                text-align: left;
            }
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            color: #409eff;
            background-color: #ecf5ff;
        }

        p {
            line-height: 20px;
            color: #999;
        }
        .content {
            .common-box {
                background-color: #f1f2f3;
                padding: 12px;
                color: #606266;
                display: flex;
                flex-direction: column;
                li {
                    margin-bottom: 4px;
                    display: flex;
                }
            }
            .name-input {
                width: 48%;
                display: inline-block;
            }
            .el-checkbox__inner {
                width: 20px;
                height: 20px;
                &::after {
                    height: 10px;
                    width: 6px;
                    left: 5px;
                }
            }
        }
    }
</style>
