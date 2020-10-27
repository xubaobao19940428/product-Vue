<template>
    <div class="app-container">
        <div class="action-btn-wrapper">
            <el-button size="small" @click="cancel">取 消</el-button>
            <el-button size="small" :loading="loading" type="primary" @click="confirm">确 定</el-button>
        </div>
        <div class="promotion-edit-wrapper">
            <el-card class="info-card">
                <div class='info-title mar-b-10'>基本信息</div>
                <base-info ref="baseInfoEl" :hasStart="hasStart" :hasEnd="hasEnd" :rules="rules" :propParam="param" :languageList="languageList" :countryList="countryList" @setData="setCountryCode"></base-info>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>促销规则</div>
                <promotion-rule ref="ruleInfoEl" :hasStart="hasStart" :curCountryCode="curCountryCode" :hasEnd="hasEnd"  :rules="rules" :propParam="param" :languageList="languageList" :countryList="countryList"></promotion-rule>
            </el-card>
        </div>
    </div>
</template>
<script>
    import baseInfo from './components/baseInfo'
    import promotionRule from './components/promotionRule'
    import { getPromotionById, insertPromotion, updatePromotion } from '@/request/marketing.js'
    let moment = require('moment')
    export default {
        data () {
            return {
                rules: {
                    promotionName: [{ required: true, message: '不能为空', trigger: 'change' }],
                    promotionLabel: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    startTime: [{ required: true, message: '不能为空', trigger: 'change' }],
                    preheat: [{ required: true, message: '不能为空', trigger: 'change' }],
                    preheatTime: [{ required: true, message: '不能为空', trigger: 'change' }],
                    promotionRuleDesc: [{ required: true, message: '不能为空', trigger: 'change' }],
                    discountMutexType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    promotionType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    promotionRuleInfo: [{ required: true, message: '不能为空', trigger: 'change' }],
                    promotionProductInfo: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                param: {},
                hasStart: false,
                hasEnd: false,
                loading: false,
                curCountryCode: ''
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
        components: {
            baseInfo,
            promotionRule
        },
        mounted () {
            let query = this.$route.query
            if (query.promotionId) {
                this.getDetail(query)
            } else {
                this.$refs.baseInfoEl.initParamData(this.param)
                this.$refs.ruleInfoEl.initParamData(this.param)
            }
        },
        methods: {
            getDetail ({ promotionId, type }) {
                getPromotionById({
                    promotionId
                }).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        Object.assign(this.param, res.promotionInfo)
                        if (type === '2') {
                            this.curCountryCode = this.param.countryCode
                            if (moment().isAfter(parseInt(this.param.startTime)) && moment().isBefore(parseInt(this.param.endTime))) {
                                this.hasStart = true
                            }
                            if (this.param.preheat == 1 && moment().isAfter(parseInt(this.param.preheatTime)) && moment().isBefore(parseInt(this.param.endTime))) {
                                this.hasStart = true
                            }
                            if (moment().isAfter(parseInt(this.param.endTime))) {
                                this.hasEnd = true
                            }
                        } else if (type === '3') {
                            // 清除活动国家，促销类型和促销规则的值
                            // 复制改为整个复制过去
                            // Object.assign(this.param, {
                            //     countryCode: '',
                            //     promotionRuleInfo: [],
                            //     promotionType: '0'
                            // })
                        } else {
                            this.curCountryCode = this.param.countryCode
                        }
                        this.$refs.baseInfoEl.initParamData(this.param)
                        this.$refs.ruleInfoEl.initParamData(this.param)
                    }
                })
            },
            setCountryCode (data) {
                this.curCountryCode = data.countryCode
            },
            cancel () {
                this.$router.push({
                    name: 'promotionList'
                })
            },
            confirm () {
                let baseInfo = this.$refs.baseInfoEl.getData()
                let ruleInfo = this.$refs.ruleInfoEl.getData()
                let self = this
                Promise.all([baseInfo, ruleInfo]).then((values) => {
                    console.log(values)
                    let param = values[0]
                    Object.assign(param, values[1])
                    let fetchUrl = insertPromotion
                    if (self.$route.query.promotionId && self.$route.query.type == 2) {
                        fetchUrl = updatePromotion
                        Object.assign(param, {
                            promotionId: self.$route.query.promotionId
                        })
                    }
                    self.loading = true
                    fetchUrl({ promotionInfo: self.filterData(param) }).then((res) => {
                        self.loading = false
                        if (res.ret.errcode === 1) {
                            self.$message.success('成功')
                            self.$router.push({
                                name: 'promotionList'
                            })
                        }
                    }).catch(() => {
                        self.loading = false
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .action-btn-wrapper{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        padding: 0 50px 10px;
        border-bottom: 1px solid #EBEEF5;
    }
    .promotion-edit-wrapper{
        overflow: auto;
        flex: 1;
    }
</style>
