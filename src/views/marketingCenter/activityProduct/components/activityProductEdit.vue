<template>
    <el-dialog title="活动商品" width="1000px"
               append-to-body
               :close-on-click-modal="false"
               :visible="propShowDialog"
               @close="close">
        <div>
            <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                     :rules="rules"
                     :model="param">
                <el-form-item label="选择活动" prop="activeId">
                    <el-select class="form-content" v-model="param.activeId" @change="setActivityCountry" clearable filterable placeholder="请选择" size="medium"
                        :disabled="curType == 'edit'"
                    >
                        <el-option v-for="(item, index) in activityList"
                                   :key="index"
                                   :label="item.activeName"
                                   :value="item.activeId"></el-option>
                    </el-select>
                    <span class="mar-l-20">活动国家：{{ param.countryCode | countryFilter }}</span>
                </el-form-item>
                <el-form-item label="商品ID" prop="productId">
                    <div class="flex align-center form-content">
                        <el-input v-model="param.productId" type="text" placeholder="请输入" :disabled="curType == 'edit'"></el-input>
                        <el-button class="mar-l-10" size="small" @click="confirmSearchProduct">确 定</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="开始时间" class="is-required">
                    <el-radio-group v-model="param.spuPreheat">
                        <el-radio :label="1" class="radio-line">跟随活动</el-radio>
                        <el-radio :label="2" class="radio-line">自定义</el-radio>
                    </el-radio-group>
                    <div v-if="param.spuPreheat == 2">
                        <!-- 只有活动预热了，商品才能预热 -->
                        <el-form-item label="预热时间" prop="spuPreheatTime" v-if="preheat">
                            <el-date-picker type="datetime" value-format="timestamp"
                                            class="mar-l-10"
                                            :default-time="param.countryCode == 'TH' ? '01:00:00' : '00:00:00'"
                                            v-model="param.spuPreheatTime">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="startTime" class="mt8">
                            <el-date-picker type="datetime" value-format="timestamp"
                                            class="mar-l-10"
                                            :default-time="param.countryCode == 'TH' ? '01:00:00' : '00:00:00'"
                                            v-model="param.startTime">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endTime" class="mt8">
                            <el-date-picker type="datetime" value-format="timestamp"
                                            class="mar-l-10"
                                            :default-time="param.countryCode == 'TH' ? '00:59:59' : '23:59:59'"
                                            v-model="param.endTime">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="活动价格设置" prop="productId" class="label-line">
                    <product-sku-edit ref="skuList" :defaultSkuList="defaultSkuList" :propSkuList="productListSku" :countryCode="param.countryCode"></product-sku-edit>
                </el-form-item>
                <el-form-item label="商品分组" prop="groupLabelId">
                    <div class="flex form-content">
                        <el-select v-model="param.groupLabelId" placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in activityLabel"
                                       :key="index"
                                       :label="getMultiLangShowInfo(item.name)"
                                       :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="商品角标">
                    <div class="flex form-content">
                        <el-select v-model="productCornerLang" placeholder="请选择">
                            <el-option v-for="(item, i) in languageList"
                                       :key="i"
                                       :label="item.desc"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                        <div v-for="(item, i) in param.productCorner" :key="i" v-show="productCornerLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="20" type="text" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="营销文案">
                    <div class="flex form-content">
                        <el-select v-model="promotionDescLang" placeholder="请选择">
                            <el-option v-for="(item, i) in languageList"
                                       :key="i"
                                       :label="item.desc"
                                       :value="item.code">
                            </el-option>
                        </el-select>
                        <div v-for="(item, i) in param.promotionDesc" :key="i" v-show="promotionDescLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="100" type="text" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="营销主图">
                    <multi-lang-file-upload :propFileList="param.promotionCover" @setData="setPromotionCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="confirmAddItem">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import productSkuEdit from './productSkuEdit'
    import { insertActiveProduct, updateActiveProduct, listActiveGroup } from '@/request/marketing.js'
    import { getProductSku } from '@/request/product.js'
    import common from '@/js/common/mixins'
    export default {
        props: {
            propShowDialog: Boolean,
            activityList: {
                type: Array,
                default: () => { return [] }
            },
            propParam: {
                type: Object,
                default: () => { return {} }
            },
            defaultSkuList: {
                type: Array,
                default: () => { return [] }
            },
            curType: String
        },
        mixins: [common],
        components: {
            multiLangFileUpload,
            productSkuEdit
        },
        created () {
            let temp = { ...this.propParam }
            if (temp.spuPreheat == 1) {
                // 跟随活动，把时间清掉
                temp = Object.assign(temp, {
                    startTime: null,
                    endTime: null,
                    preheatTime: 0
                })
            }
            this.param = Object.assign(this.param, temp)
            this.initLangData()
            
            this.param.spuPreheatTime = parseInt(temp.spuPreheatTime) || null // 刚开始预热会有
            
            // 活动自身会修改预热情况，所以需要重新赋值
            if (this.param.activeId) {
                this.setActivityCountry('start-copy')
            }
        },
        data () {
            return {
                param: {
                    id: null,
                    activeId: '',
                    productId: '',
                    productCorner: [],
                    promotionCover: [],
                    promotionDesc: [],
                    skuInfo: [],
                    groupLabelId: '',
                    countryCode: '',
                    status: '',
                    startTime: '',
                    endTime: '',
                    spuPreheat: 1, // 1 跟随 2 自定义
                    spuPreheatTime: ''
                },
                preheat: 0, // 活动自身是否预热. 0 - 不预热 1 - 预热
                loading: false,
                rules: {
                    activeId: [{ required: true, message: '不能为空', trigger: 'change' }],
                    productId: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    startTime: [{required: true, message: '不能为空', trigger: 'change'}],
                    endTime: [{required: true, message: '不能为空', trigger: 'change'}],
                    spuPreheatTime: [{required: true, message: '不能为空', trigger: 'change'}]
                },
                productListSku: [],
                productCornerLang: 'cn',
                promotionDescLang: 'cn',
                productLabelLang: 'cn',
                activityLabel: []
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        methods: {
            initLangData () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let productCorner = this.param.productCorner.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!productCorner) {
                        this.param.productCorner.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                    let promotionDesc = this.param.promotionDesc.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!promotionDesc) {
                        this.param.promotionDesc.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            setSkuInfo (skuList) {
                this.param.skuInfo = skuList
                this.$refs['addDialog'].validate()
            },
            getActivityLabel () {
                listActiveGroup(this.filterData({
                    activeId: this.param.activeId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityLabel = res.groupInfo
                    }
                })
            },
            confirmAddItem () {
                let skuList = this.$refs.skuList.getSkuList()
                Promise.all([skuList]).then((values) => {
                    let list = values[0]
                    this.param.skuInfo = list
                    this.$refs['addDialog'].validate((valid) => {
                        if (valid) {
                            if (this.param.spuPreheat == 2) { // 自定义
                                if (!this.preheat) { // 活动没有预热
                                    this.param.spuPreheatTime = null
                                } else {
                                    if (this.param.spuPreheatTime && this.param.spuPreheatTime > this.param.startTime) {
                                        this.$message.error('商品的预热时间须不大于商品的开始时间')
                                        return
                                    }
                                }
                                if (this.param.startTime > this.param.endTime) {
                                    this.$message.error('活动的结束时间须不小于活动的开始时间')
                                    return
                                }

                            } else {
                                // 跟随活动
                                Object.assign(this.param, {
                                    startTime: '',
                                    endTime: '',
                                    spuPreheatTime: ''
                                })
                            }

                            let activityTipItems = ''
                            let activityErrorItems = ''
                            let rateTipItems = ''
                            let rateErrorItems = ''
                            let rateLowTipItems = ''
                            for(let i = 0; i < list.length; i++) {
                                let item = list[i]
                                if (item.activeCommissionRate >= 100) {
                                    rateErrorItems += `${item.skuId} `
                                } else if (item.activeCommissionRate < 100 && item.activeCommissionRate >= 20) {
                                    rateTipItems += `${item.skuId} `
                                } else if (item.activeCommissionRate < 1) {
                                    rateLowTipItems += `${item.skuId} `
                                }

                                let activePrice = parseFloat(item.activePrice)
                                if (activePrice > item.priceVip) {
                                    activityErrorItems += `${item.skuId} `
                                } else if (activePrice < item.adviseActivePrice) {
                                    activityTipItems += `${item.skuId} `
                                }

                                // 在这里再做处理，为了便于提醒出来
                                item.activeCommissionRate = item.activeCommissionRate ? this.divideFilter(item.activeCommissionRate) : ''
                            }
                            if (rateErrorItems) {
                                this.$message.error(rateErrorItems + '的活动佣金率设置异常，保存失败')
                                return
                            } else if (activityErrorItems) {
                                this.$message.error(activityErrorItems + '的活动价设置过高，保存失败')
                                return
                            } else if (activityTipItems || rateTipItems || rateLowTipItems) {
                                let text = activityTipItems ? activityTipItems + '的活动价过低，' : ''
                                text += rateTipItems ? rateTipItems + '的活动佣金率过高，' : ''
                                text += rateLowTipItems ? rateLowTipItems + '的活动佣金率过低，' : ''

                                this.$confirm( text + '确认要保存吗？', '提醒', {
                                    confirmButtonText: '保存',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.goConfirm()
                                }).catch(() => {
                                    return
                                })
                            } else {
                                this.goConfirm()
                            }
                        }
                    })
                })
            },
            divideFilter (value) {
                let float = parseFloat(value || 0)
                return (float / 100).toFixed(2)
            },
            goConfirm () {
                let fetchUrl = insertActiveProduct
                if (this.param.id) {
                    fetchUrl = updateActiveProduct
                }
                this.loading = true
                fetchUrl({ activeProductInfo: this.filterData(this.param) }).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功')
                        this.reset()
                        this.$emit('confirm')
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            confirmSearchProduct () {
                if (!this.param.countryCode) {
                    return this.$message.warning('请先选择活动')
                }
                getProductSku(this.filterData({
                    countryCode: this.param.countryCode,
                    productId: this.param.productId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.productListSku = res.sku
                    }
                })
            },
            setActivityCountry (type) {
                let item = this.activityList.find((val) => {
                    return val.activeId == this.param.activeId
                })
                if (item) {
                    this.preheat = item.preheat
                    Object.assign(
                        this.param, {
                            countryCode: item.countryCode
                        }
                    )
                    // 重新选择活动的时候，分组信息清空。最开始赋值时则不处理
                    if (type != 'start-copy') {
                        this.param.groupLabelId = ''
                        this.productListSku = []
                    }
                }
                this.getActivityLabel()
            },
            setPromotionCover (data) {
                this.param.promotionCover = data
            },
            reset () {
                this.param = {
                    id: null,
                    activeId: '',
                    productId: '',
                    productCorner: [],
                    promotionCover: [],
                    promotionDesc: [],
                    groupLabelId: '',
                    countryCode: '',
                    status: '',
                    startTime: '',
                    endTime: '',
                    spuPreheat: 1,
                    spuPreheatTime: ''
                }
                this.productListSku = []
            },
            close () {
                this.reset()
                this.$emit('close')
            }
        }
    }
</script>
<style lang="scss">
    .label-line {
        .el-form-item__label {
            width: 100%;
            text-align: left;
        }
    }
</style>
<style lang="scss" scoped>
    .form-tips{
        color: #666;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
    }
    .form-content{
        width: 400px;
    }
    .radio-line {
        display: block;
        line-height: 40px;
    }
    .mt8 {
        margin-top: 16px;
    }
</style>
