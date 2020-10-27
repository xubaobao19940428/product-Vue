<template>
    <div class="page-floor-anchor">
        <div class="head">
            <h5>楼层锚点</h5>
            <p>将若干个连续的组件组合起来形成楼层锚点</p>
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
                        <el-input v-model="item.name" type="text" placeholder="请输入" @input="handleNameChange({currentComponentIndex, index})"/>
                    </div>
                </el-form-item>
                <el-form-item label="选择楼层" class="label-line">
                    <ul class="common-box">
                        <li
                            v-for="item in componentsData" :key="item.moduleId"
                            :class="[
                                'pointer',
                                {
                                    'floor-is-checked': getIsChecked(item) !== -1,
                                    'floor-is-disable': item.basicName === 'floorAnchor'
                                }
                            ]"
                            @click="handleSelect(JSON.parse(JSON.stringify(item)))"
                        >
                            {{ basicDetail[item.basicName].title }} 一 <span style="fontWeight: 600">{{ getCn(item.name) }}</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="锚点样式" class="label-line">
                    <el-radio-group v-model="pointIndex" @change="handlePointChange">
                        <el-radio-button v-for="(item, index) in ponitList" :key="item.name" :label="index">{{ item.name }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="锚点颜色" class="label-line">
                    <ul class="point-wrapper common-box">
                        <li class="item">
                            默认背景
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.background" @change="(val) => handleChange({ background: val })"></el-color-picker>
                            <span class="show-text">{{ info.background }}</span>
                        </li>
                        <li class="item">
                            默认文字
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.color" @change="(val) => handleChange({ color: val })"></el-color-picker>
                            <span class="show-text">{{ info.color }}</span>
                        </li>
                        <li class="item">
                            选中背景
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.activeBackground" @change="(val) => handleChange({ activeBackground: val })"></el-color-picker>
                            <span class="show-text">{{ info.activeBackground }}</span>
                        </li>
                        <li class="item">
                            选中文字
                            <el-color-picker style="margin: 0 60px 0 32px" v-model="info.activeColor" @change="(val) => handleChange({ activeColor: val })"></el-color-picker>
                            <span class="show-text">{{ info.activeColor }}</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="选项卡颜色" class="label-line">
                    <el-color-picker style="margin: 0 60px 0 32px" v-model="info.cardBg" @change="(val) => handleChange({ cardBg: val })"></el-color-picker>
                </el-form-item>
                <el-form-item label="左右外边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="16"
                            :min="0"
                            :controls="false"
                            v-model="info.paddingRL"
                            @change="(val) => handleChange({paddingRL: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="圆角度">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="16"
                            :min="0"
                            :controls="false"
                            v-model="info.borderRa"
                            @change="(val) => handleChange({borderRa: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import { POINT_LIST } from '../commonEnum.js'
    import showColor from '../common/showColor'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'

    const NAME = '楼层锚点'
    export default {
        components: {
            showColor,
            multiLangFileUpload
        },
        props: {
            data: [Object, Array],
            handleNameChange: Function,
            currentComponentIndex: [String, Number]
        },
        data () {
            return {
                pointIndex: 0, // 选中的锚点样式,不需要传递过去
                nameLang: 'cn',
                name: [],
                ponitList: POINT_LIST,
                info: {
                    background: '#E02020',
                    color: '#fff',
                    activeBackground: '#fff',
                    activeColor: '#E02020',
                    cardBg: '#AE0000',
                    List: [],
                    type: 1,
                    paddingRL: 0,
                    borderRa: 0
                }
            }
        },
        watch: {
            data: {
                handler (val) {
                    let {info, name} = val
                    Object.assign(this.info, info)
                    this.name = name
                    this.initPointIndex(val.info || {})
                },
                deep: true
            }
        },
        computed: {
            ...mapState({
                languageList: state => state.dict.languageList,
                componentsData: state => state.pageEdit.componentsData,
                basicDetail: state => state.pageEdit.basicDetail
            })
        },
        created () {
            let {info, name} = this.data

            Object.assign(this.info, {
                background: '#E02020',
                color: '#fff',
                activeBackground: '#fff',
                activeColor: '#E02020',
                cardBg: '#AE0000',
                List: [],
                type: 1,
                paddingRL: 0,
                borderRa: 0
            }, info)
            this.name = name

            this.initPointIndex(this.data.info || {})
        },
        methods: {
            initPointIndex ({ name }) {
                if (!name) {
                    this.pointIndex = 0
                    return
                }
                let resIndex = this.ponitList.findIndex(item => item.name === name)

                this.pointIndex = resIndex
            },
            handlePointChange (val) {
                let res = this.ponitList[val]
                this.handleChange(res)
            },
            handleChange (obj) {
                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: obj
                })
            },
            handleSelect (data) {
                if (data.basicName === 'floorAnchor') return
                let res = this.getIsChecked(data)

                if (res !== -1) {
                    this.info.List.splice(res, 1)
                    this.$store.dispatch('updateInitParam', {
                        index: this.currentComponentIndex,
                        info: { List: this.info.List }
                    })
                } else {
                    const {name, moduleId} = data
                    this.info.List.push({name, moduleId})
                    this.$store.dispatch('updateInitParam', {
                        index: this.currentComponentIndex,
                        info: { List: this.info.List }
                    })
                }
            },
            getIsChecked (item) {
                let res = this.info.List.findIndex(subItem => subItem.moduleId === item.moduleId)
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
.page-floor-anchor {
    .head {
        p {
            line-height: 20px;
            color: #999;
            font-size: 14px;
        }
    }
    .name-input {
        width: 66%;
        display: inline-block;
    }

    .content {
        .pointer {
            cursor: pointer;
        }

        .point-wrapper {
            li {
                padding: 8px 10px;
            }
        }
        .common-box {
            .floor-is-checked {
                color: #409eff;
                border-color: #409eff;
                background-color: #ecf5ff;
            }
            .floor-is-disable {
                color: #c0c4cc;
                border-color: rgb(235, 238, 245);
                cursor: not-allowed;
            }
            li {
                background-color: #fff;
                padding-left: 8px;
                margin-bottom: 12px;
                border-radius: 4px;
                border: 1px solid transparent;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .show-text {
            border: 1px solid #eee;
            padding: 8px 16px 8px 12px;
        }
    }
}
</style>
