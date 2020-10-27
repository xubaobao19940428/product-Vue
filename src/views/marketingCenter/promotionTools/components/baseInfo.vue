<template>
    <el-form ref="baseInfo" label-position="right" label-width="110px" label-suffix="："
             :rules="rules"
             :model="param">
        <el-form-item label="促销名称" prop="promotionName">
            <el-input v-model="param.promotionName" :disabled="hasEnd" type="text" show-word-limit maxlength="50" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="促销标签" prop="promotionLabel">
            <div class="flex form-content">
                <el-select v-model="promotionLabelLang" placeholder="请选择">
                    <el-option v-for="(item, i) in languageList"
                               :key="i"
                               :label="item.desc"
                               :value="item.code">
                    </el-option>
                </el-select>
                <el-form-item v-for="(item, i) in param.promotionLabel" :key="i"
                              ref="promotionForm"
                              :prop="`promotionLabel[${i}].name`"
                              :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'change' }"
                              v-show="promotionLabelLang == item.languageCode" class="flex1 mar-l-10">
                    <el-input :disabled="hasStart || hasEnd" v-model="item.name" show-word-limit maxlength="30" type="text" placeholder="请输入"></el-input>
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item label="活动国家" prop="countryCode">
            <el-select v-model="param.countryCode" :disabled="hasStart || hasEnd" clearable placeholder="请选择" @change="countryCodeChange" size="medium">
                <el-option v-for="(item, index) in countryList"
                           :key="index"
                           :label="item.nameEn + '/' + item.nameCn "
                           :value="item.shortCode"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="促销时间：" prop="startTime">
            <el-date-picker type="datetimerange" value-format="timestamp"
                            @change="setActivityTime"
                            :disabled="hasEnd"
                            start-placeholder="开始时间" end-placeholder="结束时间"
                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="活动预热" prop="preheat">
            <p class="form-tips mar-t-10">指预热开始后，在搜索列表、商品详情页、购物车等处为所有参与该活动的商品打上活动图标，并在商品详情页显示活动价</p>
            <el-radio-group v-model="param.preheat" :disabled="hasEnd">
                <el-radio label="0">不预热<span class="form-tips mar-l-10">有买贵风险和活动造势不足风险</span></el-radio>
                <el-radio label="1">预热<span class="form-tips mar-l-10">预热期间活动商品骤降的可能</span></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="预热时间" prop="preheatTime" v-if="param.preheat == 1">
            <el-date-picker type="datetime" value-format="timestamp"
                            :disabled="hasEnd"
                            v-model="param.preheatTime">
            </el-date-picker>
        </el-form-item>
    </el-form>
</template>
<script>
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
            hasStart: Boolean,
            hasEnd: Boolean
        },
        data () {
            return {
                param: {
                    promotionName: '',
                    countryCode: '',
                    promotionLabel: [],
                    startTime: '',
                    endTime: '',
                    preheatTime: '',
                    preheat: '0'
                },
                promotionLabelLang: 'cn',
                timeList: []
            }
        },
        watch: {
            languageList () {
                this.initLangData()
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
                if (this.param.startTime && this.param.endTime) {
                    this.timeList = [this.param.startTime, this.param.endTime]
                }
            },
            initLangData () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let productCorner = this.param.promotionLabel.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!productCorner) {
                        this.param.promotionLabel.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            setActivityTime () {
                this.timeList = this.timeList ? this.timeList : []
                this.param.startTime = !this.timeList[0] ? '' : this.timeList[0]
                this.param.endTime = !this.timeList[1] ? '' : this.timeList[1]
            },
            getData () {
                let self = this
                return new Promise((resolve) => {
                    self.$refs['baseInfo'].validate((valid) => {
                        if (valid) {
                            resolve(self.param)
                        } else {
                            this.$message.warning('请输入必填项')
                        }
                    })
                })
            },
            countryCodeChange () {
                this.$emit('setData', this.param)
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
