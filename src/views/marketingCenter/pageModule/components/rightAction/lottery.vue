<template>
    <div class="lottery-wrapper">
        <div class="head">
            <h5>抽奖</h5>
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

                <el-form-item label="选择样式">
                    <div class="tar">
                        <el-button type="text" @click="showTip = true">示例图</el-button>
                    </div>
                    <el-radio-group v-model="info.type">
                        <el-radio-button :label="1">九宫格</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="抽奖工具" class="label-line">
                    <div class="common-box">
                        <el-button type="primary" style="width: 100%" @click="handleSelectDraw" plain>
                            <template v-if="info.luckDrawId">{{ `${info.luckDrawId} - ${info.luckDrawName}` }}</template>
                            <template v-else>
                                <i class="el-icon-plus el-icon--left"></i>
                                选择抽奖工具
                            </template>
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item label="奖品内容" class="label-line border-line">
                    <ul class="common-box">
                        <li v-show="allPrizeData[data.moduleId] && allPrizeData[data.moduleId].length === 8" v-for="item in allPrizeData[data.moduleId]" :key="item.luckPrizeId">
                            {{ luckPrizeTypeMap[item.luckPrizeType] }} 一 <span class="prize-name">{{ getName(item.luckPrizeName, 'cn') }}</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="上传背景" class="label-line">
                    <div class="common-box">
                        <ul class="total-bg-ul df">
                            <li class="item-li">
                                <c-upload
                                    :fileList="info.bgImg1"
                                    isRequired
                                    textDesc="整体背景A"
                                    ref="bgImg1"
                                    @setData="(val) => handleInitParamChange({bgImg1: val.data})"></c-upload>
                            </li>
                            <li class="item-li">
                                <c-upload
                                    :fileList="info.bgImg2"
                                    ref="bgImg2"
                                    textDesc="整体背景B"
                                    @setData="(val) => handleInitParamChange({bgImg2: val.data})"></c-upload>
                            </li>
                        </ul>
                        <ul class="prize-bg-ul df">
                            <li class="item-li">
                                <c-upload
                                    :fileList="info.prizeBgImg"
                                    isRequired
                                    ref="prizeBgImg"
                                    textDesc="奖品背景"
                                    @setData="(val) => handleInitParamChange({prizeBgImg: val.data})"></c-upload>
                            </li>
                            <li class="item-li">
                                <c-upload
                                    :fileList="info.prizeActiveBgImg"
                                    isRequired
                                    ref="prizeActiveBgImg"
                                    textDesc="奖品选中"
                                    @setData="(val) => handleInitParamChange({prizeActiveBgImg: val.data })"></c-upload>
                            </li>
                        </ul>
                        <div class="btn-li">
                            <el-button v-if="!info.btnBg.cn" @click="showUploadDialog('btnBg')" type="text"><span class="red">*</span>添加按钮图片</el-button>
                            <div class="btn-img" @click="showUploadDialog('btnBg')" v-else>
                                <img :src="dealShowFileSrc(info.btnBg.cn)"/>
                            </div>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="上边距">
                    <el-input-number
                        class="margin-left"
                        v-model="info.padT"
                        :controls="false"
                        :min="0"
                        @change="(val) => handleInitParamChange({padT: val})"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="左右边距">
                    <el-input-number
                        class="margin-left"
                        v-model="info.padLR"
                        :controls="false"
                        :min="0"
                        @change="(val) => handleInitParamChange({padLR: val})"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="下边距">
                    <el-input-number
                        class="margin-left"
                        v-model="info.padB"
                        :controls="false"
                        :min="0"
                        @change="(val) => handleInitParamChange({padB: val})"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="宫格圆角">
                    <el-input-number
                        class="margin-left"
                        v-model="info.borderRadius"
                        :controls="false"
                        :min="0"
                        @change="(val) => handleInitParamChange({borderRadius: val})"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="抽奖记录按钮背景图">
                    <div class="margin-left-label">
                        <i class="iconfont" @click="showTip = true">&#xe680;</i>
                        <span class="common-text" style="marginLeft: 16px">{{ info.showRecord ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.showRecord" @change="(val) => handleInitParamChange({showRecord: val})"></el-checkbox>
                    </div>
                    <div class="btn-li" v-if="info.showRecord">
                        <el-button v-if="!info.recordBg.cn" @click="showUploadDialog('recordBg')" type="text"><span class="red">*</span>添加查看中奖记录图片</el-button>
                        <div class="btn-img" @click="showUploadDialog('recordBg')" v-else>
                            <img :src="dealShowFileSrc(info.recordBg.cn)"/>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="晒奖跑马灯">
                    <div class="margin-left">
                        <span class="common-text">{{ info.showPaoMaDeng ? '显示' : '不显示' }}</span>
                        <el-checkbox class="right" v-model="info.showPaoMaDeng" @change="(val) => handleInitParamChange({showPaoMaDeng: val})"></el-checkbox>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog
            :visible="showTip"
            title="示例图"
            @close="showTip = false"
            width="600px"
        >
            <img src="@/assets/img/tip.png" style="width: 100%;"/>
        </el-dialog>

        <luck-draw-dialog
            v-if="showDrawDialog"
            :showDrawDialog="showDrawDialog"
            :countryCode="countryCode"
            :curLuckDrawId="info.luckDrawId"
            @close="showDrawDialog = false"
            @confirm="handleInitParamChange"
        ></luck-draw-dialog>

        <country-img-dialog
            v-if="showAddImg"
            :showCountryImg="showAddImg"
            :languageList="languageList"
            :imgList="info[curUploadKey]"
            curType="object"
            @close="showAddImg = false"
            @confirm="handleImgConfirm"
        ></country-img-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import LuckDrawDialog from './components/LuckDrawDialog'
import cUpload from '@/components/fileUpload'
import countryImgDialog from './components/countryImgDialog'
import initData from '@/utils/pageEditInitData.js'

export default {
    props: {
        data: [Object, Array],
        handleNameChange: Function,
        currentComponentIndex: [String, Number]
    },
    data () {
        return {
            nameLang: 'cn',
            name: [],
            info: JSON.parse(JSON.stringify(initData.lottery)),
            prizeList: [],
            showAddImg: false,
            luckPrizeTypeMap: {
                1: '优惠券',
                2: '奖品',
                3: '非奖品',
                4: '保险栓',
                5: '积分'
            },
            showTip: false,
            showDrawDialog: false,
            curUploadKey: ''
        }
    },
    computed: {
        ...mapState({
            countryCode: state => state.pageEdit.pageData.countryCode,
            languageList: state => state.dict.languageList,
            allPrizeData: state => state.pageEdit.allPrizeData
        })
    },
    components: {
        LuckDrawDialog,
        countryImgDialog,
        cUpload
    },
    watch: {
        data: {
            handler (val) {
                let {info, name} = val
                this.init(info, name)
            },
            deep: true
        }
    },
    created () {
        let {info, name} = this.data
        this.init(info, name)
    },
    methods: {
        init (info, name) {
            Object.assign(this.info, JSON.parse(JSON.stringify(initData.lottery)), info)
            this.name = name
            this.$refs.bgImg1 && this.$refs.bgImg1.setFileList(this.info.bgImg1)
            this.$refs.bgImg2 && this.$refs.bgImg2.setFileList(this.info.bgImg2)
            this.$refs.prizeBgImg && this.$refs.prizeBgImg.setFileList(this.info.prizeBgImg)
            this.$refs.prizeActiveBgImg && this.$refs.prizeActiveBgImg.setFileList(this.info.prizeActiveBgImg)
        },
        getName (list, type) {
            if (!list || !list.length) return ''
            let item = null
            item = list.find(a => a.languageCode === 'cn')

            return item ? item.name : ''
        },
        handleSelectDraw () {
            this.showDrawDialog = true
        },
        showUploadDialog (key) {
            this.curUploadKey = key
            this.showAddImg = true
        },
        handleImgConfirm (btnBgobj) {
            let obj = {}
            obj[this.curUploadKey] = btnBgobj
            this.handleInitParamChange(obj)
            this.showAddImg = false
        },
        handleInitParamChange (obj) {
            if (this.info.luckDrawId == obj.luckDrawId) {
                this.showDrawDialog = false
                return
            }
            // 默认是不需要重新请求接口的
            let newObj = Object.assign({ isChange: false }, obj)
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: newObj
            })
            this.showDrawDialog = false
        },

    }
}
</script>

<style lang="scss">
.lottery-wrapper {
    .tar {
        text-align: right;
    }
    .total-bg-ul {
        .item-li {
            background: transparent;
            padding: 0;
            margin-bottom: 0;
            margin-right: 8px;
        }
    }
    .prize-bg-ul {
        .item-li {
            background: transparent;
            padding: 0;
            margin-bottom: 0;
            margin-right: 6px;
            .avatar-uploader, .el-upload--picture-card {
                width: 80px;
                height: 80px;
                line-height: 80px;
            }
        }
    }
    .el-upload-list--picture-card .el-upload-list__item {
        height: 100%;
        width: 100%;
    }
    .btn-li {
        width: 24%;
        .red {
            font-size: 16px;
            color: #f56c6c;
        }
        .btn-img {
            cursor: pointer;
            img {
                width: 100%;
            }
            &:hover {
                border: 2px solid #409eff;
            }
        }
    }
    .prize-name {
        color: #333333;
        font-size: 16px;
    }
    .margin-left-label {
        margin-left: 58px;
        i {
            cursor: pointer;
        }
    }
}
</style>
