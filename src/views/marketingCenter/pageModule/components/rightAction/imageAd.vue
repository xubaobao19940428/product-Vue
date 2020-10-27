<template>
    <div class="page-image-ad">
        <div class="head">
            <h5>图片广告</h5>
            <p>为页面添加图片、热区、跳转链接</p>
        </div>
        <div class="content">
            <el-form :model="info">
                <el-form-item label="组件名称" class="label-line border-line">
                    <el-select v-model="nameLang" style="width: 31%">
                        <el-option v-for="(item, index) in languageList" 
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in name" v-show="nameLang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleNameChange({ currentComponentIndex, name })"/>
                    </div>
                </el-form-item>
                <el-form-item label="选择样式" class="border-line label-line">
                    <el-radio-group v-model="info.style">
                        <el-radio-button label="one">一行一个</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="label-line">
                    <template slot="label">
                        <span>模块倒角</span>
                        <span class="common-text" style="margin-left: 24px;">{{ info.isRadius ? '圆角' : '直角' }}</span>
                    </template>
                    <el-radio-group v-model="info.isRadius" @change="(val) => handleInitParamChange({isRadius: val})">
                        <el-radio-button :label="false">直角</el-radio-button>
                        <el-radio-button :label="true">圆角</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上下边距">
                    <div class="margin-left">
                        <el-input-number 
                            v-model="info.btPadding"
                            placeholder="允许0-16" 
                            :max="16" 
                            :min="0" 
                            @change="(val) => handleInitParamChange({btPadding: val})"
                            :controls="false"></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="左右边距">
                    <div class="margin-left">
                        <el-input-number 
                            v-model="info.rlPadding"
                            placeholder="允许0-16" 
                            :max="16" 
                            :min="0" 
                            @change="(val) => handleInitParamChange({rlPadding: val})"
                            :controls="false"></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="选择图片" class="label-line border-line">
                    <p>最多添加 10 张图片，且需保证图片尺寸完全一致，拖拽调整图片顺序</p>
                    <div class="ticker-box">
                        <ul class="ticker-img-wrapper image-ad-box-active">
                            <li v-for="(item, index) in info.imgDetailList" :key="item.pos" @click="handleEditImg(item.imgList, index)" class="item">
                                <img :src="dealShowFileSrc(getImgCn(item.imgList))"/>
                            </li>
                        </ul>
                        <el-button type="primary" class="add-btn" @click="handleAddImg" v-show="info.imgDetailList.length <= 10" icon="el-icon-plus">添加图片</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="图片热区">
                    <div class="margin-left">
                        <span class="common-text">{{ info.isShowHot ? '启用' : '不启用' }}</span>
                        <el-checkbox class="right" v-model="info.isShowHot" @change="(val) => handleInitParamChange({isShowHot: val})"></el-checkbox>
                    </div>
                    <p>双击图片设置关联链接</p>
                    <el-tabs tab-position="bottom" v-show="info.isShowHot">
                        <el-tab-pane v-for="(item, index) in info.imgDetailList" :key="index" :label="'图片' + (index + 1)">
                            <div class="common-img-box">
                                <img :src="dealShowFileSrc(getLangSrc(item.imgList))" @dblclick="handleShowImgHot(item)"/>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
            </el-form>
        </div>

        <img-hot-dialog 
            v-if="dialogVisible" 
            :dialogVisible="dialogVisible" 
            :imgUrl="imgUrl"
            :pos="pos"
            :linkList="linkList"
            @saveUrl="saveUrl"
            @cancel="dialogVisible = false"
        ></img-hot-dialog>

        <country-img-dialog
            v-if="showCountryImg"
            :showCountryImg="showCountryImg"
            :languageList="languageList"
            :imgList="imgList"
            @close="showCountryImg = false"
            @confirm="handleImgConfirm"
        ></country-img-dialog>
    </div>
</template>
<script>
    import imgHotDialog from './components/imgHotDialog'
    import countryImgDialog from './components/countryImgDialog'
    import { mapState } from 'vuex'
    import Sortable from 'sortablejs'

    export default {
        components: {
            countryImgDialog,
            imgHotDialog
        },
        props: {
            data: [Object, Array],
            handleNameChange: Function,
            currentComponentIndex: [String, Number]
        },
        computed: {
            ...mapState({
                languageList: state => state.dict.languageList
            })
        },
        data () {
            return {
                dialogVisible: false,
                imgUrl: '',
                pos: 0,
                imgDescItem: {},
                navList: [],
                name: [],
                nameLang: 'cn',
                showCountryImg: false, // 图片上传弹窗
                info: {
                    isRadius: false,
                    isShowHot: false,
                    btPadding: 0,
                    rlPadding: 0,
                    style: 'one',
                    imgDetailList: []
                },
                sortable: null,
                curEditImgIndex: -1,
                curType: 'add',
                imgList: [] // 当前正在编辑的图片列表
            }
        },
        watch: {
            data: {
                handler (val) {
                    let {info, name} = val
                    Object.assign(this.info, {
                        isRadius: false,
                        isShowHot: false,
                        btPadding: 0,
                        rlPadding: 0,
                        style: 'one',
                        imgDetailList: []
                    }, info)
                    this.name = name
                },
                deep: true
            }
        },
        created () {
            let {info, name} = this.data
            Object.assign(this.info, {
                isRadius: false,
                isShowHot: false,
                btPadding: 0,
                rlPadding: 0,
                style: 'one',
                imgDetailList: []
            }, info)
            this.name = name
        },
        mounted () {
            let $el = this.$el.querySelector('.image-ad-box-active')
            this.sortable = Sortable.create($el, {
                group: {
                    name: 'image-ad',
                    pull: false,
                    put: true
                },
                sort: true,
                ghostClass: 'image-ad-class',
                onUpdate: (e) => {
                    let temp = { ...this.info }
                    let tempList = temp.imgDetailList.splice(e.oldIndex, 1)
                    temp.imgDetailList.splice(e.newIndex, 0, ...tempList)
                    
                    // let oldItem = temp.imgDetailList[e.oldIndex]
                    // temp.imgDetailList[e.oldIndex] = temp.imgDetailList[e.newIndex]
                    // temp.imgDetailList[e.newIndex] = oldItem

                    this.$store.dispatch('updateInitParam', {
                        index: this.currentComponentIndex,
                        info: {imgDetailList: temp.imgDetailList}
                    })
                }
            })
        },
        methods: {
            initLangData () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let item = this.languageList[i]
                    let findItem = this.name.find(val => val.languageCode == item.code)
                    if (!findItem) {
                        this.name.push({
                            languageCode: item.code,
                            name: ''
                        })
                    }
                }
            },
            getImgCn (list) {
                let resItem = list.filter(item => item.languageCode == 'cn')

                return resItem[0].name
            },
            handleInitParamChange (obj) {
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: obj
                })
            },
            getLangSrc (list) {
                let res = ''
                res = list.find(item => item.languageCode === 'cn')

                return res ? res.name : ''
            },
            // 确认保存图片
            handleImgConfirm (data) {
                if (this.curType == 'edit') { // 编辑
                    this.info.imgDetailList.splice(this.curEditImgIndex, 1, {
                        imgList: data,
                        pos: this.curEditImgIndex
                    })
                } else {
                    this.info.imgDetailList.push({
                        imgList: data,
                        pos: this.info.imgDetailList.length
                    })
                }
                
                this.showCountryImg = false
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: {imgDetailList: this.info.imgDetailList}
                })
            },
            // 新增图片
            handleAddImg () {
                this.showCountryImg = true
                this.imgList = []
                this.curType = 'add'
            },
            // 编辑图片
            handleEditImg (list, index) {
                this.showCountryImg = true
                this.curEditImgIndex = index
                this.imgList = list
                this.curType = 'edit'
            },
            handleShowImgHot (item) {
                this.dialogVisible = true
                this.linkList = item.linkList || []
                this.pos = item.pos
                this.imgUrl = this.getLangSrc(item.imgList)
            },
            saveUrl (data) {
                this.info.imgDetailList[data.pos].linkList = data.linkList
                this.info.imgDetailList[data.pos].existShare = data.existShare
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: {imgDetailList: this.info.imgDetailList}
                })
                this.dialogVisible = false
            }
        }
    }
</script>
<style lang="scss">
.page-image-ad {
    p {
        line-height: 20px;
        color: #999;
        font-size: 14px;
    }
    .content {
        .ticker-box {
            background-color: #f1f2f3;
            padding: 12px;
            .add-btn {
                width: 100%;
            }
        }
        .ticker-img-wrapper {
            display: flex;
            flex-wrap: wrap;
            .item {
                flex: 0 0 32%;
                margin: 0 4px 6px 0;
                img {
                    width: 100%;
                }
            }
            .item:hover {
                border: 2px solid #409eff;
            }
        }

        .common-img-box {
            background-color: #f1f2f3;
            padding: 12px;
            overflow: auto;
            max-height: 154px;
            img {
                width: 100%;
            }
        }
    }
}
</style>
