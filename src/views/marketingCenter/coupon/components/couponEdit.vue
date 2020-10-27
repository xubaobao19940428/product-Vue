<template>
    <div class="app-container coupon-create">
        <div class="coupon-create__header">
            <h5>{{ type === 'add' ? '新增优惠券' : '编辑优惠券'}}</h5>
        </div>

        <div class="coupon-created__content">
            <el-form label-position="right"
                    label-width="180px"
                    :rules="rules"
                    :model="param"
                    ref="couponForm">
            <h5>基本信息</h5>
            <el-form-item label="适用国家：" prop="countryCode">
                <template v-if="type === 'add'">
                    <el-select v-model="param.countryCode" filterable @change="handleCountrySelect">
                        <el-option v-for="item in countryList"
                                :key="item.shortCode"
                                :label="item.nameLocal"
                                :value="item.shortCode">
                        </el-option>
                    </el-select>
                </template>
                <span v-else>{{ getCountryName(param.countryCode) }}</span>
            </el-form-item>
            <el-form-item label="优惠券类型："
                            prop="couponType">
                <template v-if="type === 'add'">
                    <el-select v-model="param.couponType"
                            @change="handleTypeChange"
                            size="medium">
                        <el-option v-for="(val, key) in couponTypeList"
                                    :key="key"
                                    :label="val.desc"
                                    :value="val.id">
                        </el-option>
                    </el-select>
                </template>
                <span v-else>{{ getCouponTypeName(param.couponType) }}</span>
            </el-form-item>
            <el-form-item label="优惠券名称：" prop="name" class="is-required">
                <span class="country-tip">中文：</span><el-input
                    placeholder="中文优惠券名称必填"
                    v-model="inputName.cn"
                    style="width: 60%"
                    size="medium"
                ></el-input><br/>
                <span class="country-tip">英文：</span><el-input
                    placeholder="英文优惠券名称必填"
                    v-model="inputName.en"
                    style="width: 60%"
                    size="medium"
                ></el-input><br/>
                <div v-show="dropName">
                    <span v-for="item in simpleLanguageList" :key="item.code">
                        <span class="country-tip">{{ item.desc }}：</span><el-input
                            placeholder="请输入优惠券名"
                            v-model="inputName[item.code]"
                            style="width: 60%"
                            size="medium"
                        ></el-input><br/>
                    </span>
                </div>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{ dropName ? '收起' : '展开' }}
                    <i :class="dropName ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-link>
            </el-form-item>
            <el-form-item :label="type === 'add' ? '总发行量：' : '剩余总发行量：'"
                            prop="quantity">
                <template v-if="type === 'add'">
                    <el-input-number v-model="param.quantity"
                                    placeholder="只能输入正整数，输入9999999为无限制"
                                    :min="1"
                                    :max="9999999"
                                    size="medium"
                                    :precision="0"></el-input-number>
                </template>
                <template v-else>{{ param.quantity }}</template>
                张
            </el-form-item>
            <el-form-item label="每日发行量："
                            prop="dailyLimit">
                <template v-if="type === 'add'">
                    <el-input-number v-model="param.dailyLimit"
                                    placeholder="只能输入正整数，输入9999999为无限制"
                                    :min="0"
                                    :max="9999999"
                                    size="medium"
                                    :precision="0"></el-input-number>
                </template>
                <template v-else>{{ param.dailyLimit }}</template>
                张
            </el-form-item>
            <el-form-item label="适用商品："
                            prop="couponScope">
                <el-radio-group v-model="param.couponScope" @change="handleScopeChange">
                <el-radio v-for="(val, key) in couponScope"
                            :key="key"
                            :label="key">{{val}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="categoryId"
                            v-if="param.couponScope == 2"
                            label="添加品类：">
                <div>
                    <el-tag v-for="(tag, i) in couponScopeDetails"
                            :key="tag.id"
                            @close="removeCategory(tag, i)"
                            closable>{{tag.name}}
                    </el-tag>
                </div>
                <el-cascader
                    clearable
                    filterable
                    @visible-change="clearSelectCategory"
                    :props="{label: 'cateName', children: 'levelValue', value: 'prop', multiple: true, lazy: true, lazyLoad: getSubCategory}"
                    :options="frontCategoryOptions"
                    v-model="selectedOptionsFront"
                    @change="categoryChange($event, 1)">
                </el-cascader>
            </el-form-item>
            <el-form-item prop="productId"
                        v-if="param.couponScope == 1">
                <el-input
                    v-model="param.productId"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    style="width: 60%"
                    placeholder="填写商品SPUID，多个商品时请用英文逗号,隔开"
                ></el-input>
            </el-form-item>
            <el-form-item label="与其他券同时使用：" class="required">
                <el-radio-group v-model="param.level">
                <el-radio :label="1">不可以</el-radio>
                <el-radio :label="0">可以</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="使用门槛：" prop="fullAmt" class="is-required">
                <!-- 满减券 邮费券 -->
                <template v-if="param.couponType == '1' || param.couponType == '5'">
                    满 <span class="currency-unit">{{ curCurrencyUnit }}</span>
                    <template v-if="type === 'add'">
                        <el-input-number v-model="param.fullAmt"
                                :min="0"
                                :max="9999999"
                                size="medium"
                                :precision="2"></el-input-number>
                    </template>
                    <template v-else>{{ param.fullAmt }}</template>
                </template>
                <!-- 立减券，折扣券，包邮券 -->
                <template v-else>
                    满 <span class="currency-unit">{{ curCurrencyUnit }}</span>0
                </template>
            </el-form-item>

            <el-form-item label="优惠内容：" prop="couponContent" class="is-required">
                <!-- 包邮券 -->
                <template v-if="param.couponType == '4'">免运费</template>

                <!-- 折扣券 -->
                <template v-else-if="param.couponType == '2'">
                    优惠 <template v-if="type === 'add'">
                            <el-input v-model="param.discount"
                                placeholder="0为无折扣"
                                style="width: 40%"
                                size="medium">
                            </el-input>
                        </template>
                        <template v-else>{{ param.discount }}</template>%
                    <span class="discount-tip">如：82折填18，9折填10</span>
                </template>

                <!-- 满减券 立减券 邮费券 -->
                <template v-else>
                    减 <span class="currency-unit">{{ curCurrencyUnit }}</span>
                        <template v-if="type === 'add'">
                            <el-input-number v-model="param.amount"
                                    :min="0"
                                    :max="9999999"
                                    size="medium"
                                    :precision="2"></el-input-number>
                        </template>
                        <template v-else>{{ param.amount || 0 }}</template>
                </template>
            </el-form-item>


            <h5>领用规则</h5>
            <el-form-item label="用户范围："
                            class="is-required"
                            prop="memberLevel" style="min-height: 62px">
                <el-radio-group v-model="isAll" :disabled="type === 'edit'">
                    <el-radio :label="1">所有用户</el-radio><br/>

                    <el-radio :label="0" style="margin-top: 8px">特定用户
                        <div class="member-box" v-show="!isAll">
                            <el-checkbox-group v-model="param.memberLevel" :disabled="type === 'edit'">
                                <el-checkbox v-for="(item, key) in userLevel"
                                            :label="key"
                                            :key="key">{{ item }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="限领规则："
                            prop="personLimit">
                每人限领 <el-input-number v-model="param.personLimit"
                                placeholder="只能输入正整数，输入9999999为无限制"
                                :min="1"
                                :max="9999999"
                                size="medium"
                                :precision="0"></el-input-number> 张
            </el-form-item>
            <el-form-item label="优惠券有效期："
                            class="is-required"
                            prop="timeRange">
                <el-radio-group v-model="timeRange" :style="{marginTop: '-10px'}">
                <el-radio :label="1">
                    日期范围
                    <el-date-picker v-model="timeList"
                                    style="width: 380px"
                                    type="datetimerange"
                                    start-placeholder="生效时间"
                                    value-format="timestamp"
                                    end-placeholder="失效时间"
                                    :default-time="['00:00:00']">
                    </el-date-picker>
                </el-radio>
                <el-radio :label="2">
                    自发放之日起
                    <el-input-number v-model="param.effectiveDays"
                                    style="margin-top: 10px"
                                    placeholder="只能输入正整数，输入9999999为无限制"
                                    :min="1"
                                    :max="9999999"
                                    size="medium"
                                    :precision="0"></el-input-number> 天
                </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="公开领取：" class="is-required">
                <p class="desc">谨慎操作：设置优惠券为公开领取，则券会出现在商品详情页；特殊用途的优惠券（如无门槛补偿券）请切勿公开领取</p>
                <el-radio-group v-model="param.allowPublicity">
                    <el-radio :label="2">不公开领取</el-radio>
                    <el-radio :label="1">公开领取时间
                        <el-date-picker v-model="publicityTimeList"
                            style="width: 380px"
                            type="datetimerange"
                            value-format="timestamp"
                            :default-time="['00:00:00']">
                        </el-date-picker>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="转赠设置：">
                <el-checkbox
                    v-model="param.giftGivingPermitted"
                    :true-label="1" :false-label="0">允许转赠</el-checkbox>
            </el-form-item>
            <el-form-item label="使用说明：" prop="descript" class="is-required">
                <span class="country-tip">中文：</span><el-input
                    placeholder="中文使用说明必填"
                    v-model="descript.cn"
                    style="width: 60%"
                    size="medium"
                ></el-input><br/>

                <span class="country-tip">英文：</span><el-input
                    placeholder="英文使用说明必填"
                    v-model="descript.en"
                    style="width: 60%"
                    size="medium"
                ></el-input><br/>

                <div v-show="dropDes">
                    <span v-for="item in simpleLanguageList" :key="item.code">
                        <span class="country-tip">{{ item.desc }}：</span><el-input
                            placeholder="请输入使用说明"
                            v-model="descript[item.code]"
                            style="width: 60%"
                            size="medium"
                        ></el-input><br/>
                    </span>
                </div>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown('dropDes')">
                    {{ dropDes ? '收起' : '展开' }}
                    <i :class="dropDes ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-link>
            </el-form-item>
            </el-form>
        </div>
        <div class="coupon-create__footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleSave" type="primary" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
        </div>
    </div>
</template>

<script>
import { addCoupon, queryCouponType, queryCouponDetails, updateCoupon } from '@/request/coupon.js'
import { mapState } from 'vuex'
import { multiply } from '@/js/common/filter'
import productCommon from '@/views/product/common/common'
import { categoryListGet } from '@/request/product'
import moment from 'moment'

export default {
    mixins: [productCommon],
    data () {
        return {
            type: 'add', // 默认为新增
            cateType: 1,
            showProDialog: false,
            curCurrencyUnit: 'RM',
            isAll: 1,
            timeList: [],
            publicityTimeList: [], // 转赠时间
            timeRange: 1,
            couponScopeDetails: [],
            couponId: '',
            frontCategoryOptions: [],
            selectedOptionsFront: [],
            productList: [], // 商品列表
            couponScope: { // 优惠券范围
                1: '指定商品',
                2: '指定品类',
                3: '全品券'
            },
            couponTypeList: [],
            inputName: {},
            selectLanguage: 'cn',
            descript: {},
            selectDescriptCode: 'cn',
            fullscreenLoading: false,
            dropName: false,
            dropDes: false,
            param: {
                categoryId: [],
                memberLevel: [],
                countryCode: 'MY',
                productId: '',
                personLimit: '',
                effectiveDays: '',
                dailyLimit: 9999999,
                publicityStartTime: null,
                publicityEndTime: null,
                discount: '',
                amount: '',
                fullAmt: '',
                quantity: 9999999,
                level: 1,
                status: 0,
                couponType: '1',
                couponScope: '3',
                allowPublicity: 2, // 默认不公开领取
                giftGivingPermitted: 0, // 默认不能转赠
                scopeDetails: '' // 必须传输，不会被过滤掉
            },
            rules: {
                personLimit: [{ required: true, message: '请输入', trigger: 'change' }],
                quantity: [{ required: true, message: '请输入数量', trigger: 'change' }],
                dailyLimit: [{ required: true, message: '每日发行量必填', trigger: 'change'} ],
                couponType: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
                fullAmt: [{validator: (rule, value, callback) => {
                    if ((this.param.couponType == '1') && (!value || value <= 0)) {
                        callback(new Error('满减券的使用门槛需大于0'))
                    } else if ((this.param.couponType == '5' && isNaN(value))) {
                        callback(new Error('必填'))
                    } else {
                        callback()
                    }
                }}],
                countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
                couponScope: [{ required: true, message: '请选择优惠券使用范围 ', trigger: 'change' }],
                productId: [{ required: true, message: '对应的商品SPUID必填', trigger: 'change' }],
                couponContent: [{ validator: (rule, value, callback) => {
                    if (this.param.couponType == '1' || this.param.couponType == '3') {
                        if (!this.param.amount) {
                            callback(new Error('优惠内容需大于0'))
                        } else {
                            callback()
                        }
                    } else if (this.param.couponType == '2') {
                        // 折扣券的校验规则，
                        let value = this.param.discount
                        if (!value) {
                            callback(new Error('必填'))
                        } else if (isNaN(value) || value >= 100 || value <= 0) {
                            callback(new Error('请输入正确的折扣值'))
                        } else if (value > 60) {
                            callback(new Error('您设置的优惠让利过高'))
                        } else {
                            callback()
                        }
                    } else {
                        callback()
                    }
                }}]
            }
        }
    },
    computed: {
        ...mapState({
            countryList: state => state.dict.countryList,
            languageList: state => state.dict.languageList,
            userLevel: state => state.user.userLevel
        }),
        simpleLanguageList () {
            // 用于去除中文和英文部分
            let delList = ['cn', 'en']
            let res = this.languageList.filter(item => delList.indexOf(item.code) === -1)

            return res
        }
    },
    async created () {
        let query = this.$route.query || {}
        this.couponId = query.couponId
        this.type = query.type
        await this.getCouponType()
        await this.fetchCategory({
            level: 1,
            cateType: 1,
            resolve: (data) => {
                this.frontCategoryOptions = data
            }
        })

        if (this.couponId) {
            this.getCouponDetail()
        }
    },

    methods: {
        // 取消即返回
        handleCancel () {
            this.$router.go(-1)
        },
        handleChange (type, val) {
            this.inputName[type] = this.changeDoubleQuo(val)
        },
        removeCategory (tag, i) {
            let temp = { ...this.param }
            this.couponScopeDetails.splice(i, 1)
            let index = temp.categoryId.indexOf(tag.id)
            this.param.categoryId.splice(index, 1)
        },
        dropDown(type) {
            if (type === 'dropDes') {
                this.dropDes = !this.dropDes
            } else {
                this.dropName = !this.dropName
            }
        },
        getCountryName (data) {
            let item = this.countryList.find(item => item.shortCode === data)

            return item ? item.nameLocal : ' '
        },
        getCouponTypeName (type) {
            let item = this.couponTypeList.find((val) => {
                return type == val.id
            })

            return item ? item.desc : ''
        },
        // 获取以特定形式展示的优惠券详情
        getCouponDetail () {
            queryCouponDetails({
                couponDetailsId: this.couponId,
                type: 2
            }).then(res => {
                if (res.ret.errcode === 1) {
                    let temp = { ...res.couponQueryResultPb }
                    let inputName = {}
                    let descript = {}
                    let param = {
                        memberLevel: temp.memberLevel.map(item => item + ''),
                        level: parseInt(JSON.parse(temp.rule).level),
                        couponType: temp.couponType,
                        couponScope: temp.couponScope,
                        countryCode: temp.countryCode,
                        effectiveDays: temp.effectiveDays,
                        dailyLimit: temp.dailyLimit,
                        personLimit: temp.personLimit,
                        discount: temp.discount,
                        giftGivingPermitted: temp.giftGivingPermitted,
                        allowPublicity: temp.allowPublicity,
                        amount: temp.amount || 0,
                        fullAmt: temp.fullAmt,
                        quantity: temp.quantity,
                        status: temp.status,
                        scopeDetails: '',
                        productId: '',
                        categoryId: []
                    }

                    this.handleCountrySelect(param.countryCode)

                    if (temp.couponScopeDetails && temp.couponScopeDetails.length) { // 用于回显指定类和指定商品
                        this.couponScopeDetails = temp.couponScopeDetails

                        if (temp.couponScope == 1) {
                            // 指定商品
                            param.productId = temp.couponScopeDetails.map(item => item.id).join(',')
                        } else if (temp.couponScope == 2) {
                            // 指定品类
                            param.categoryId = temp.couponScopeDetails.map(item => item.id)
                        }
                    }

                    temp.name.forEach(item => {
                        inputName[item.languageCode] = item.name
                    })

                    temp.description.forEach(item => {
                        descript[item.languageCode] = item.name
                    })

                    this.descript = descript
                    this.inputName = inputName
                    this.publicityTimeList = temp.allowPublicity == 1 ? [temp.publicityStartTime, temp.publicityEndTime] : []
                    this.isAll = temp.memberLevel.length === Object.keys(this.userLevel).length ? 1 : 0

                    // this.timeList = []
                    this.timeRange = param.effectiveDays === -1 ? 1 : 2
                    if (parseInt(temp.startTime) && parseInt(temp.endTime)) {
                        this.timeList = [temp.startTime, temp.endTime]
                    } else {
                        this.timeList = []
                    }

                    Object.assign(this.param, param)
                }
            })
        },
        getLanguage (data, type) {
            let res = ''
            if (data && data.length) {
                let item = data.find(item => item.languageCode === type)

                res = item ? item.name : ' '
            }
            return res
        },
        handleCountrySelect (val) {
            let res = this.countryList.find(item => item.shortCode === val)

            this.curCurrencyUnit = res ? res.currencyUnit : ' '
        },
        getCouponType() {
            queryCouponType({}).then(res => {
                if (res.ret.errcode === 1) {
                    this.couponTypeList = res.couponTypeResult
                }
            })
        },
        handleScopeChange () {
            this.$refs['couponForm'].clearValidate(['productId', 'categoryId'])
        },
        handleTypeChange () {
            // 优惠券类型修改，清除优惠内容和门槛的校验结果
            this.$refs['couponForm'].clearValidate(['fullAmt', 'couponContent'])
        },
        clearSelectCategory (show) {
            if (!show) {
                this.selectedOptionsFront = []
            }
        },
        categoryChange (selectList) {
            for (let i = 0; i < this.selectedOptionsFront.length; i++) {
                let item = JSON.parse(this.selectedOptionsFront[i][1]) // 取二级的数据
                let existItem = this.couponScopeDetails.find(i => i.id === item.cateId)

                if (!existItem) {
                    this.couponScopeDetails.push({
                        id: item.cateId,
                        name: item.cateName
                    })
                }
            }
        },
        normalizeParam () {
            let param = JSON.parse(JSON.stringify(this.param))
            //  = this.timeRange != 2 ? -1 : param.effectiveDays
            if (this.timeRange === 2) {
                // 2 表示 自发送之日起
                param.startTime = null
                param.endTime = null
            } else {
                param.effectiveDays = -1
            }
            let res = {}

            param.productId = param.productId ? param.productId.split(',') : []
            param.description = []
            param.categoryId = this.couponScopeDetails.map(item => item.id)
            param.name = Object.keys(this.inputName).map(key => ({
                languageCode: key,
                name: this.inputName[key]
            }))

            // 非 满减券 邮费券 则清空门槛值
            if (!(param.couponType == '1' || param.couponType == '5')) {
                param.fullAmt = '0'
            } else {
                param.fullAmt = param.fullAmt ? param.fullAmt + '' : '0'
            }

            param.description = Object.keys(this.descript).map(key => {
                let name = this.descript[key]

                return {
                    languageCode: key,
                    name
                }
            })

            if (this.type === 'add') {
                if (this.isAll) {
                    param.memberLevel = Object.keys(this.userLevel)
                }
                param.amount += ''

                param.memberLevel = param.memberLevel.map(item => parseInt(item))

                res = {record: param}
            } else {
                res = this.filterData({
                    couponId: this.couponId,
                    couponScope: param.couponScope,
                    scopeDetails: param.scopeDetails,
                    productId: param.productId,
                    categoryId: param.categoryId,
                    name: param.name,
                    level: param.level,
                    dailyLimit: param.dailyLimit,
                    personLimit: param.personLimit,
                    description: param.description,
                    startTime: param.startTime,
                    endTime: param.endTime,
                    effectiveDays: param.effectiveDays,
                    allowPublicity: param.allowPublicity,
                    publicityStartTime: param.publicityStartTime,
                    publicityEndTime: param.publicityEndTime,
                    giftGivingPermitted: param.giftGivingPermitted
                })
            }

            return res
        },
        saveData (resParam) {
            this.fullscreenLoading = true
            addCoupon(this.filterData(resParam)).then((res) => {
                if (res.ret.errcode === 1) {
                    this.$message.success('添加成功')
                    this.$router.push({
                        name: 'mcoupon'
                    })
                }
                this.fullscreenLoading = false
            }).catch(err => {
                console.error(err)
                this.fullscreenLoading = false
            })
        },
        updateCoupon (resParam) {
            this.fullscreenLoading = true
            updateCoupon(this.filterData(resParam)).then((res) => {
                if (res.ret.errcode === 1) {
                    this.$message.success('编辑成功')
                    this.$router.push({
                        name: 'mcoupon'
                    })
                }
                this.fullscreenLoading = false
            }).catch(err => {
                console.error(err)
                this.fullscreenLoading = false
            })
        },
        handleSave () {
            this.$refs['couponForm'].validate((valid) => {
                if (valid) {
                    let temp = { ...this.param }
                    if (this.timeList && this.timeList.length === 2) {
                        Object.assign(this.param, {
                            startTime: this.timeList[0],
                            endTime: this.timeList[1]
                        })
                    }

                    if (temp.allowPublicity == 1) {
                        if (this.publicityTimeList && this.publicityTimeList.length == 2) {
                            Object.assign(this.param, {
                                publicityStartTime: this.publicityTimeList[0] + '',
                                publicityEndTime: this.publicityTimeList[1] + ''
                            })
                        } else {
                            this.$message.error('公开领取时间必填')
                            return
                        }
                    }

                    if (!this.inputName.cn || !this.inputName.en) {
                        this.$message.error('中英文的优惠券名称必填')
                        return
                    }
                    if (temp.couponType == '1') { // 选择了优惠券
                        if (Number(temp.amount) > Number(temp.fullAmt)) {
                            this.$message.error(`使用门槛为${temp.fullAmt}，满减金额应低于使用门槛`)
                            return
                        }
                    }
                    if (!this.isAll) {
                        if (!temp.memberLevel.length) {
                            this.$message.error('特定用户需要选择对象')
                            return
                        }
                    }
                    if (this.timeRange === 1) {
                        if (!this.timeList || this.timeList.length < 2) {
                            this.$message.error('有效期的日期范围必选')
                            return
                        }
                    }
                    if (!this.descript.cn || !this.descript.en) {
                        this.$message.error('中英文的使用说明必填')
                        return
                    }
                    let resParam = this.normalizeParam()

                    // 编辑的时候不能修改使用门槛和优惠内容，所以不用判断优惠力度
                    if (this.type === 'edit') {
                        this.updateCoupon(resParam)
                        return
                    }

                    if (!temp.dailyLimit || temp.dailyLimit > temp.quantity) {
                        this.$message.error('每日发行量须大于0，且须小于或等于总发行量')
                        return
                    }

                    if (temp.couponType == '2') { // 选择了折扣券
                        if (temp.discount > 30) {
                            this.$confirm('您设置的优惠让利超过了30%，这可能导致财务损失，仍要保存吗？', '安全校验', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                            .then(() => {
                                this.saveData(resParam)
                                // this.fullscreenLoading = true
                                // addCoupon(this.filterData(resParam)).then((res) => {
                                //     if (res.ret.errcode === 1) {
                                //         this.$message.success('添加成功')
                                //         this.fullscreenLoading = false
                                //         this.$router.push({
                                //             name: 'mcoupon'
                                //         })
                                //     }
                                // })
                            })
                        } else {
                            this.saveData(resParam)
                            // this.fullscreenLoading = true
                            // addCoupon(this.filterData(resParam)).then((res) => {
                            //     if (res.ret.errcode === 1) {
                            //         this.$message.success('添加成功')
                            //         this.fullscreenLoading = false
                            //         this.$router.push({
                            //             name: 'mcoupon'
                            //         })
                            //     }
                            // })
                        }
                    } else {
                        this.saveData(resParam)
                        // this.fullscreenLoading = true
                        // addCoupon(this.filterData(resParam)).then((res) => {
                        //     if (res.ret.errcode === 1) {
                        //         this.$message.success('添加成功')
                        //         this.fullscreenLoading = false
                        //         this.$router.push({
                        //             name: 'mcoupon'
                        //         })
                        //     }
                        // })
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .coupon-create {
        background-color: #F1F2F5;
        .coupon-create__header {
            background-color: #fff;
            padding: 8px 32px 16px;
            h5 {
                font-size: 20px;
                font-weight: 500;
            }
        }

        .coupon-created__content {
            margin: 24px;
            border-radius: 8px;
            padding-bottom: 40px;
            background-color: #fff;
            h5 {
                margin-top: 16px;
                padding-left: 16px;
                border-left: 4px solid #409EFF;
                font-size: 18px;
                line-height: 26px;
                margin-bottom: 32px;
            }
            .country-tip {
                display: inline-block;
                min-width: 60px;
            }

            .currency-unit {
                margin: 0 8px 0 4px;
            }
            .member-box {
                margin-left: 8px;
            }
            .discount-tip {
                color: #aaa;
                font-size: 14px;
                margin-left: 8px;
            }
            .desc {
                color: #999;
            }
        }

        .coupon-create__footer {
            position: fixed;
            width: 100%;
            text-align: center;
            padding: 16px 0;
            margin-left: -10px;
            bottom: 0;
            background-color: #fff;
            border-top: 1px solid #eee;
            z-index: 1000;
        }
    }
</style>
