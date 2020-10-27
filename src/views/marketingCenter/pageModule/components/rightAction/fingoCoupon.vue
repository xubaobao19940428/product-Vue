<template>
    <div class="page-module-coupon">
        <div class="head">
            <h5>优惠券</h5>
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
                <el-form-item label="优惠券" class="label-line">
                    <ul class="coupon-list-wrapper">
                        <li v-for="(item, index) in allCouponData[data.moduleId]" :key="index" class="item">
                            <div class="left-box">
                                <i class="iconfont" style="fontSize: 14px;">&#xe6b3;</i>
                                {{ item.couponId }} - <span style="fontWeight: 600">{{ item.couponName }}</span>
                            </div>
                            <div class="right-box">
                                <i class="el-icon-edit icon-size" style="margin-right: 4px" @click="handleEditCoupon(index, item)"></i>
                                <i class="el-icon-close icon-size" @click="handelDel(index, item)"></i>
                            </div>
                        </li>
                    </ul>
                    <el-button @click="handleAddCoupon" plain type="primary" class="add-btn" icon="el-icon-plus">添加优惠券</el-button>
                </el-form-item>
                <el-form-item label="选择样式" class="label-line border-line">
                    <el-radio-group v-model="info.type" @change="handleStyleChange">
                        <el-radio-button v-for="val in couponStyleList" :key="val.key" :label="val.key">{{ val.name }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.topPadding"
                            @change="(val) => handleInitParamChange({topPadding: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="下边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="30"
                            :min="0"
                            :controls="false"
                            v-model="info.bottomPadding"
                            @change="(val) => handleInitParamChange({bottomPadding: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="左右边距">
                    <div class="margin-left">
                        <el-input-number
                            placeholder="允许0-16"
                            :max="16"
                            :min="0"
                            :controls="false"
                            v-model="info.padding"
                            @change="(val) => handleInitParamChange({padding: val})"
                        ></el-input-number>
                    </div>
                </el-form-item>
                <el-form-item label="颜色设置" class="label-line">
                    <ul class="common-box">
                        <li class="item">
                            主体颜色1
                            <el-color-picker class="color-picker" v-model="info.bgColor" @change="(val) => handleInitParamChange({ bgColor: val })"></el-color-picker>
                            <span class="show-text">{{ info.bgColor }}</span>
                        </li>
                        <li class="item">
                            主体颜色2
                            <el-color-picker class="color-picker" v-model="info.bgColor1" @change="(val) => handleInitParamChange({ bgColor1: val })"></el-color-picker>
                            <span class="show-text">{{ info.bgColor1 }}</span>
                        </li>
                        <li class="item">
                            按钮背景色
                            <el-color-picker class="color-picker" v-model="info.btnBgColor" @change="(val) => handleInitParamChange({ btnBgColor: val })"></el-color-picker>
                            <span class="show-text">{{ info.btnBgColor }}</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="优惠内容">
                    <div class="margin-left">
                        <el-color-picker class="color-picker" v-model="info.text1Color" @change="(val) => handleInitParamChange({ text1Color: val })"></el-color-picker>
                        <el-checkbox class="right" v-model="info.isShowText1" @change="(val) => handleInitParamChange({isShowText1: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="使用门槛">
                    <div class="margin-left">
                        <el-color-picker class="color-picker" v-model="info.text2Color" @change="(val) => handleInitParamChange({ text2Color: val })"></el-color-picker>
                        <el-checkbox class="right" v-model="info.isShowText2" @change="(val) => handleInitParamChange({isShowText2: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="说明文案">
                    <div class="margin-left">
                        <el-color-picker class="color-picker" v-model="info.text3Color" @change="(val) => handleInitParamChange({ text3Color: val })"></el-color-picker>
                        <el-checkbox class="right" v-model="info.isShowText3" @change="(val) => handleInitParamChange({isShowText3: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="领取按钮">
                    <div class="margin-left">
                        <el-color-picker class="color-picker" v-model="info.btnColor" @change="(val) => handleInitParamChange({ btnColor: val })"></el-color-picker>
                        <el-checkbox class="right" v-model="info.isShowBtn" @change="(val) => handleInitParamChange({isShowBtn: val})"></el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="分享领券">
                    <div class="margin-left-label">
                        <el-tooltip class="item" content="开启分享领券功能后，系统将引导用户先完成分享操作，随后才能领券。" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                        <el-checkbox class="right" v-model="info.isShouldShare" @change="(val) => handleInitParamChange({isShouldShare: val})"></el-checkbox>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <add-coupon-dialog
            v-if="showAddCoupon"
            :showAddCoupon="showAddCoupon"
            @close="showAddCoupon = false"
            :langList="langList"
            :editParam="editParam"
            :languageList="languageList"
            @confirm="handleCouponConfirm"></add-coupon-dialog>
    </div>
</template>

<script>
import { COUPON_LIST } from '../commonEnum'
import addCouponDialog from './components/addCouponDialog'
import initData from '@/utils/pageEditInitData.js'
import { mapState } from 'vuex'
import Sortable from 'sortablejs'

export default {
    props: {
        data: [Object, Array],
        handleNameChange: Function,
        currentComponentIndex: [Number, String]
    },
    data () {
        return {
            info: JSON.parse(JSON.stringify(initData.fingoCoupon)),
            name: [],
            couponStyleList: COUPON_LIST,
            showAddCoupon: false,
            sortable: null,
            editParam: {}, // 编辑的优惠券内容
            curEditIndex: null,
            nameLang: 'cn'
        }
    },
    created () {
        const { info, name } = this.data
        // 赋初值及设置后的值
        Object.assign(this.info, JSON.parse(JSON.stringify(initData.fingoCoupon)), info)

        this.name = name
    },
    watch: {
        data: {
            handler (newVal, oldVal) {
                const { info, name } = newVal
                // 赋初值及设置后的值
                Object.assign(this.info, JSON.parse(JSON.stringify(initData.fingoCoupon)), info)
                this.name = name
            },
            deep: true
        }
    },
    mounted () {
        let $el = this.$el.querySelector('.coupon-list-wrapper')
        this.sortable = Sortable.create($el, {
            group: {
                name: 'coupon-list-manage',
                pull: false,
                put: true
            },
            sort: true,
            ghostClass: 'components-class',
            onEnd: (e) => {
                let temp = { ...this.info }
                let tempList = temp.couponList.splice(e.oldIndex, 1)
                temp.couponList.splice(e.newIndex, 0, ...tempList)

                this.$store.dispatch('updateInitParam', {
                    index: this.currentComponentIndex,
                    info: { couponList: temp.couponList, isChange: true }
                })
            }
        })
    },
    components: {
        addCouponDialog
    },
    computed: {
        ...mapState({
            languageList: state => state.dict.languageList,
            componentsData: state => state.pageEdit.componentsData,
            allCouponData: state => state.pageEdit.allCouponData
        }),
        langList () {
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
    methods: {
        handleStyleChange (val) {
            let param = this.couponStyleList[val] ? this.couponStyleList[val].initData : {}
            this.handleInitParamChange({
                type: val,
                ...JSON.parse(JSON.stringify(param))
            })
        },
        handleAddCoupon () {
            this.curEditIndex = -1 // 如果是新增的话，就改为-1。便于判断
            this.editParam = {}
            this.showAddCoupon = true
        },
        handleEditCoupon (index, item) {
            this.curEditIndex = index // 当前正在编辑的项
            Object.assign(this.editParam, item)
            this.showAddCoupon = true
        },
        handelDel (index, item) {
            this.$confirm('确定删除优惠券?', '提示')
                .then(() => {
                    let temp = { ...this.info }
                    temp.couponList.splice(index, 1)
                    this.$store.dispatch('updateInitParam', {
                        index: this.currentComponentIndex,
                        info: { couponList: temp.couponList, isChange: true }
                    })
                })
        },
        handleInitParamChange (obj) {
            let newObj = Object.assign({ isChange: false }, obj)
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: newObj
            })
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
        },
        handleCouponConfirm (couponItem) {
            let index = this.info.couponList.findIndex(item => item.encryptionCouponId == couponItem.encryptionCouponId)
            if (this.curEditIndex == -1) {
                if (index == -1) {
                    this.info.couponList.push(couponItem)
                }
            } else {
                this.info.couponList.splice(this.curEditIndex, 1, couponItem)
            }
            this.showAddCoupon = false
            this.$store.dispatch('updateInitParam', {
                index: this.currentComponentIndex,
                info: { ...this.info, isChange: true }
            })
        }
    }
}
</script>

<style lang="scss">
.page-module-coupon {
    .content {
        .coupon-list-wrapper {
            .item {
                cursor: move;
                border: 1px solid #eee;
                padding: 6px 4px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 16px;
            }
            .icon-size {
                font-size: 16px;
                cursor: pointer;
            }
        }
        .add-btn {
            padding: 18px 0;
            width: 100%;
        }
        .color-picker {
            margin: 0 60px 0 32px;
            vertical-align: middle;
        }
        .name-input {
            width: 50%;
            display: inline-block;
        }
        .common-box {
            .show-text {
                border: 1px solid #f1f2f3;
                padding: 10px 12px;
            }
        }
        .margin-left-label {
            margin-left: 50px;
        }
    }
}
</style>
