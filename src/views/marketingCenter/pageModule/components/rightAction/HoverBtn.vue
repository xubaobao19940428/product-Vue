<template>
    <div class="page-hover-btn">
        <div class="head">
            <h5>悬浮按钮</h5>
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
                        <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleNameChange({currentComponentIndex, name})"/>
                    </div>
                </el-form-item>
                <el-form-item label="按钮图片" class="label-line border-line">
                    <div class="common-box">
                        <ul v-if="info.imgDetailList && info.imgDetailList.length">
                            <li v-for="(item, index) in info.imgDetailList" :key="index">
                                <div class="common-img-box">
                                    <img :src="dealShowFileSrc(getLangSrc(item.imgList))" @click="handleEditImg(item.imgList, index)"/>
                                </div>
                            </li>
                        </ul>
                        <el-button v-else icon="el-icon-plus" @click="handleAddImg">添加图片</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="按钮交互" class="border-line">
                    <el-button class="right" @click="handleSet" type="text">去设置</el-button>
                </el-form-item>
                <el-form-item label="动效设置" class="label-line border-line col-num">
                    <el-radio-group v-model="info.effect" @change="(val) => handleInitParamChange({colNum: val})">
                        <el-radio-button label="static">静态</el-radio-button>
                        <el-radio-button label="dync">呼吸</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="按钮位置">
                </el-form-item>
                <el-form-item label="左边距">
                    <div class="margin-left">
                        <el-input-number
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.left"
                            @change="(val) => handleInitParamChange({left: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="右边距">
                     <div class="margin-left">
                        <el-input-number
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.right"
                            @change="(val) => handleInitParamChange({right: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="下边距" class="border-line">
                    <div class="margin-left">
                        <el-input-number
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.bottom"
                            @change="(val) => handleInitParamChange({bottom: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="出现位置" class="label-line">
                    <p class="tip">不选中则代表一直显示,双击可取消选中</p>
                    <ul class="common-box">
                        <li
                            v-for="item in componentsData" :key="item.moduleId"
                            :class="[
                                'pointer',
                                {
                                    'floor-is-checked': item.moduleId === info.selectModuleId,
                                }
                            ]"
                            @click="handleInitParamChange({selectModuleId: item.moduleId})"
                            @dblclick="handleInitParamChange({selectModuleId: ''})"
                        >
                            {{ basicDetail[item.basicName].title }} 一 <span style="fontWeight: 600">{{ getCn(item.name) }}</span>
                        </li>
                    </ul>
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
import countryImgDialog from './components/countryImgDialog'
import imgHotDialog from './components/imgHotDialog'
import { mapState } from 'vuex'

export default {
    props: {
        data: [Object, Array],
        handleNameChange: Function,
        currentComponentIndex: [String, Number]
    },
    data () {
        return {
            showCountryImg: false,
            imgList: [],
            curType: 'add',
            dialogVisible: false,
            imgUrl: '',
            pos: 0,
            linkList: [],
            name: [],
            nameLang: 'cn',
            info: {
                imgDetailList: [],
                bottom: 0,
                left: 0,
                right: 0,
                selectModuleId: '',
                effect: 'static'
            }
        }
    },
    components: {
        countryImgDialog,
        imgHotDialog
    },
    watch: {
        data: {
            handler (val) {
                let {info, name} = val
                Object.assign(this.info, {
                    imgDetailList: [],
                    bottom: 0,
                    left: 0,
                    right: 0,
                    effect: 'static',
                    selectModuleId: ''
                }, info)
                this.name = name
            },
            deep: true
        }
    },
    created () {
        let {info, name} = this.data
        Object.assign(this.info, {
            imgDetailList: [],
            bottom: 0,
            left: 0,
            right: 0,
            effect: 'static',
            selectModuleId: ''
        }, info)
        this.name = name
    },
    computed: {
        ...mapState({
            languageList: state => state.dict.languageList,
            componentsData: state => state.pageEdit.componentsData,
            basicDetail: state => state.pageEdit.basicDetail
        })
    },
    methods: {
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
        handleSet () {
            let tempList = [...this.info.imgDetailList]
            if (!tempList || !tempList.length) {
                this.$toast('请先上传图片')
                return
            }
            this.dialogVisible = true
            this.linkList = tempList[0].linkList || []
            this.pos = 0
            this.imgUrl = this.getLangSrc(tempList[0].imgList)
        },
        saveUrl (data) {
            this.info.imgDetailList[data.pos].linkList = data.linkList
            this.info.imgDetailList[data.pos].existShare = data.existShare
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: {imgDetailList: this.info.imgDetailList}
            })
            this.dialogVisible = false
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
        getLangSrc (list) {
            let res = ''
            res = list.find(item => item.languageCode === 'cn')

            return res ? res.name : ''
        },
        handleInitParamChange (obj) {
            let newObj = Object.assign({ isChange: false }, obj)
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: newObj
            })
        },
        getIsChecked (item) {
            return res
        },
        getCn (data) {
            let res = ''
            if (data && data.length) {
                res = data.find(item => item.languageCode === 'cn')

                if (!res) {
                    res = data[0].name
                }
            }

            return res ? res.name : ''
        }
    }
}
</script>

<style lang="scss">
.page-hover-btn {
    .pointer {
        cursor: pointer;
    }
    .common-box {
        .floor-is-checked {
            color: #409eff;
            border-color: #409eff;
            background-color: #ecf5ff;
        }
    }
    .tip {
        color: #aaa;
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
</style>