<template>
    <el-form ref="promotionRules" label-position="right" label-width="110px" label-suffix="："
             :rules="rules"
             :model="param">
        <el-form-item label="选择商品" prop="promotionProductInfo">
            <product-select-rules :hasEnd="hasEnd" :promotionProductInfo="param.promotionProductInfo" @setData="setProductInfo" ref="productSelectRules"></product-select-rules>
        </el-form-item>
        <el-form-item label="促销类型" prop="promotionType">
            <div v-if="$route.query.type == '2'">{{ promotionType[param.promotionType] }}</div>
            <el-select v-else v-model="param.promotionType" @change="promotionTypeChange()" clearable placeholder="请选择" size="medium">
                <el-option v-for="(item, index) in promotionType"
                           :key="index"
                           :label="item"
                           :value="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="促销规则" prop="promotionRuleInfo">
            <product-rules-info :hasEnd="hasEnd" :hasStart="hasStart" ref="ruleDetail" :countryCode="param.countryCode" :promotionRuleInfo="param.promotionRuleInfo" :promotionType="param.promotionType"></product-rules-info>
            <div></div>
        </el-form-item>
        <el-form-item label="优惠互斥" prop="discountMutexType">
            <el-checkbox-group :disabled="hasStart" v-model="param.discountMutexType">
                <el-checkbox :disabled="param.promotionType != 6" :label="1">促销活动互斥 <span class="form-tips">指商品参与本优惠活动时，不允许再参与其他的优惠活动（禁止录入）</span></el-checkbox>
                <el-checkbox :label="2">优惠券互斥 <span class="form-tips">商品参与本优惠活动且用户下单成功享受优惠时，不可再使用任何优惠券</span></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="规则文案" prop="promotionRuleDesc">
            <div class="flex form-content">
                <el-select v-model="promotionDescLang" placeholder="请选择">
                    <el-option v-for="(item, i) in languageList"
                               :key="i"
                               :label="item.desc"
                               :value="item.code">
                    </el-option>
                </el-select>
                <el-form-item v-for="(item, i) in param.promotionRuleDesc" :key="i"
                              ref="promotionForm"
                              :prop="`promotionRuleDesc[${i}].name`"
                              :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'change' }"
                              v-show="promotionDescLang == item.languageCode" class="flex1 mar-l-10">
                    <el-input v-model="item.name" :disabled="hasEnd" show-word-limit maxlength="200" type="text" placeholder="请输入"></el-input>
                </el-form-item>
            </div>
        </el-form-item>
    </el-form>
</template>
<script>
    import productSelectRules from './productSelectRules'
    import productRulesInfo from './promotionRuleInfo'
    import common from '../../common/common'
    export default {
        props: {
            rules: {
                type: Object,
                default: () => { return {} }
            },
            countryList: {
                type: Array,
                default: () => { return [] }
            },
            languageList: {
                type: Array,
                default: () => { return [] }
            },
            propParam: {
                type: Object,
                default: () => { return {} }
            },
            curCountryCode: String,
            hasStart: Boolean,
            hasEnd: Boolean
        },
        components: {
            productSelectRules,
            productRulesInfo
        },
        data () {
            return {
                param: {
                    countryCode: '',
                    promotionType: '0',
                    promotionRuleDesc: [],
                    discountMutexType: [1],
                    promotionProductInfo: [],
                    promotionRuleInfo: []
                },
                promotionDescLang: 'cn',
                timeList: []
            }
        },
        mixins: [common],
        watch: {
            languageList () {
                this.initLangData()
            },
            curCountryCode () {
                this.param.countryCode = this.curCountryCode
            }
        },
        methods: {
            initParamData (val) {
                for (let item in this.param) {
                    if (val[item]) {
                        this.param[item] = val[item]
                    }
                }
                this.initLangData()
            },
            initLangData () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let productCorner = this.param.promotionRuleDesc.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!productCorner) {
                        this.param.promotionRuleDesc.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            promotionTypeChange () {
                this.param.promotionRuleInfo = []
                if (this.param.promotionType == '6') {
                    this.param.discountMutexType = [1]
                }
            },
            setProductInfo () {
                this.param.promotionProductInfo = this.$refs.productSelectRules.getData()
                this.$refs['promotionRules'].validate()
            },
            getData () {
                let self = this
                if (self.param.discountMutexType.length == 0) {
                    self.param.discountMutexType = [0]
                }
                if (self.param.discountMutexType.length == 2) {
                    self.param.discountMutexType = [3]
                }
                self.param.promotionProductInfo = self.$refs.productSelectRules.getData()
                self.param.promotionRuleInfo = self.$refs.ruleDetail ? self.$refs.ruleDetail.getData() : []
                return new Promise((resolve) => {
                    self.$refs['promotionRules'].validate((valid) => {
                        if (valid) {
                            resolve(self.param)
                        } else {
                            this.$message.warning('请输入必填项')
                        }
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .form-tips{
        color: #666;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
    }
</style>
