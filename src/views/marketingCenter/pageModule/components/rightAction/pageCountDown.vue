<template>
    <div class="page-count-down">
        <div class="head">
            <h5>倒计时</h5>
            <p class="text">为页面增加倒计时。若不在倒计时中，该组件会自动消失</p>
        </div>
        <div class="content">
            <el-form :model="info">
                <el-form-item label="时间节点" class="label-line">
                    <div class="common-box">
                        <ul>
                            <li class="item">
                                开始时间 <el-date-picker
                                v-model="info.startTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                style="width: 78%"
                                @change="handleInitParamChange({ startTime: info.startTime })"
                                size="medium" />
                            </li>
                            <li class="item">
                                结束时间 <el-date-picker
                                v-model="info.endTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                style="width: 78%"
                                @change="handleInitParamChange({ endTime: info.endTime })"
                                size="medium" />
                            </li>
                        </ul>
                    </div>
                </el-form-item>
                <el-form-item label="文案设置" class="label-line">
                    <div class="text-box">
                        <div class="text">距开始倒计时文案</div>
                        <el-select v-model="startLang" style="width: 31%">
                            <el-option v-for="(item, index) in languageList"
                                :key="index"
                                :label="item.desc"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                        <div v-for="(item, index) in info.startText" v-show="startLang === item.languageCode" :key="index" class="name-input mar-l-10">
                            <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleInitParamChange({startText: info.startText})"/>
                        </div>
                    </div>
                    <div class="text-box">
                        <div class="text">距结束倒计时文案</div>
                        <el-select v-model="endLang" style="width: 31%">
                            <el-option v-for="(item, index) in languageList"
                                :key="index"
                                :label="item.desc"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                        <div v-for="(item, index) in info.endText" v-show="endLang === item.languageCode" :key="index" class="name-input mar-l-10">
                            <el-input v-model="item.name" type="text" placeholder="请输入" @change="handleInitParamChange({endText: info.endText})"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="背景设置" class="label-line">
                    <div class="common-box">
                        <i class="el-icon-delete del-icon" @click="handleDel" v-if="info.backgroundImg && info.backgroundImg.length"></i>
                        <multi-lang-file-upload
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            :propFileList="info.backgroundImg"
                            @setData="setBackgroundImg"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="样式设置" class="label-line">
                    <ul class="point-wrapper common-box">
                        <li class="item">
                            文案颜色
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.textColor" @change="(val) => handleInitParamChange({ textColor: val })"></el-color-picker>
                            <span class="show-text">{{ info.textColor }}</span>
                        </li>
                        <li class="item">
                            数字颜色
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.numColor" @change="(val) => handleInitParamChange({ numColor: val })"></el-color-picker>
                            <span class="show-text">{{ info.numColor }}</span>
                        </li>
                        <li class="item">
                            数字背景
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.numBackground" @change="(val) => handleInitParamChange({ numBackground: val })"></el-color-picker>
                            <span class="show-text">{{ info.numBackground }}</span>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import multiLangFileUpload from '@/components/multiLangFileUpload/'

export default {
    props: {
        data: [Object, Array],
        currentComponentIndex: [String, Number]
    },
    data () {
        return {
            info: {
                startTime: null,
                endTime: null,
                backgroundImg: [],
                numBackground: '#F7E5C5',
                textColor: '#FFFFFF',
                numColor: '#B12619',
                startText: [],
                endText: []
            },
            startLang: 'cn',
            endLang: 'cn'
        }
    },
    watch: {
        data: {
            handler (val) {
                let { info } = val
                Object.assign(this.info, {
                    startTime: null,
                    endTime: null,
                    backgroundImg: [],
                    numBackground: '#F7E5C5',
                    textColor: '#FFFFFF',
                    numColor: '#B12619',
                    startText: [],
                    endText: []
                }, info)
                this.initList(info)
            }
        }
    },
    components: {
        multiLangFileUpload
    },
    computed: {
        ...mapState({
            languageList: state => state.dict.languageList,
            componentsData: state => state.pageEdit.componentsData
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
        let { info } = this.data
        Object.assign(this.info, {
            startTime: null,
            endTime: null,
            backgroundImg: [],
            numBackground: '#F7E5C5',
            textColor: '#FFFFFF',
            numColor: '#B12619',
            startText: [],
            endText: []
        }, info)
        this.initList(info)
    },
    methods: {
        handleInitParamChange (obj) {
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: obj
            })
        },
        initList (data) {
            if (!data.startText || !data.startText.length) {
                this.info.startText = JSON.parse(JSON.stringify(this.langList))
            }

            if (!data.endText || !data.endText.length) {
                this.info.endText = JSON.parse(JSON.stringify(this.langList))
            }
        },
        setBackgroundImg (data) {
            this.info.backgroundImg = data

            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: { backgroundImg: data }
            })
        },
        handleDel () {
            this.info.backgroundImg = []
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: { backgroundImg: [] }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.page-count-down {
    .text {
        font-size: 14px;
        color: #606266;
    }
    .common-box {
        position: relative;
        .del-icon {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 20px;
            z-index: 9999;
            cursor: pointer;
        }
    }
}
</style>