<template>
    <el-dialog title="活动编辑" width="900px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                     :rules="rules"
                     :model="param">
                <el-form-item label="活动名称" prop="activeName">
                    <el-input v-model="param.activeName" type="text" maxlength="20" placeholder="请输入20字符以内"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="活动国家" prop="countryCode">
                            <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in countryList"
                                        :key="index"
                                        :label="item.nameEn + '/' + item.nameCn "
                                        :value="item.shortCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动类型" prop="activeType">
                            <el-select v-model="param.activeType" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in activeTypeArray"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="活动人群" prop="activeCrowdType" class="is-required">
                    <el-radio-group v-model="param.activeCrowdType" size="medium" :disabled="propParam.activeId">
                        <el-radio 
                            v-for="item in activeCrowdTypeArray" :key="item.key" 
                            :label="item.key">{{ item.name }}
                            <el-tooltip class="item-icon" effect="dark"
                                v-if="item.key == 1"
                                content="指除礼包订单外未完成首单的用户" placement="top"
                            >
                                <i class="el-icon-question"></i>
                            </el-tooltip>    
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="preheat">
                    <template slot="label">
                        活动预热 
                        <el-tooltip class="item-icon" effect="dark" content="指预热中的商品不可被购买；且搜索列表、商品详情页、购物车等处为所有参与该活动的商品打上活动标签，营销活动氛围；" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                        ：
                    </template>
                    <el-radio-group v-model="param.preheat">
                        <el-radio :label="0">不预热</el-radio>
                        <el-radio :label="1">预热，预热期不可购买</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="label-line">
                    <div slot="label">活动效期：<span class="tip">按照UTC+8时区填写</span></div>
                    <el-form-item label="预热时间" v-if="param.preheat == 1" prop="preheatTime" class="is-required no-line">
                        <el-date-picker type="datetime" value-format="timestamp"
                                    :default-time="param.countryCode == 'TH' ? '01:00:00' : '00:00:00'"
                                    v-model="param.preheatTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime" class="is-required mt8 no-line">
                        <el-date-picker type="datetime" value-format="timestamp"
                                        :default-time="param.countryCode == 'TH' ? '01:00:00' : '00:00:00'"
                                        v-model="param.startTime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime" class="is-required mt8 no-line">
                       <el-date-picker type="datetime" value-format="timestamp"
                                        :default-time="param.countryCode == 'TH' ? '00:59:59' : '23:59:59'"
                                        v-model="param.endTime">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                
                <el-form-item label="活动图标">
                    <multi-lang-file-upload v-if="propShowDialog" :propFileList="param.activeIcon" @setData="setActiveIcon" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="价格底图" prop="activeBaseCoverType">
                    <el-radio-group v-model="param.activeBaseCoverType">
                        <el-radio :label="1">含价格</el-radio>
                        <el-radio :label="0">不含价格</el-radio>
                    </el-radio-group> 
                </el-form-item>
                <el-form-item label=" " prop="activeBaseCover">
                    <multi-lang-file-upload v-if="propShowDialog" :propFileList="param.activeBaseCover" @setData="setActiveBaseCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="活动广告" prop="activeCover">
                    <multi-lang-file-upload v-if="propShowDialog" :propFileList="param.activeCover" @setData="setActiveCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="活动链接" prop="activeBcUrl">
                    <el-input v-model="param.activeBcUrl" type="text"></el-input>
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
    import { insertActive, updateActive } from '@/request/marketing.js'
    export default {
        props: {
            propShowDialog: Boolean,
            activeTypeArray: Array,
            activeCrowdTypeArray: Array,
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        components: {
            multiLangFileUpload
        },
        data () {
            return {
                param: {
                    activeId: '',
                    activeName: '',
                    countryCode: '',
                    activeStatus: '1',
                    preheat: null, // 默认不勾选
                    activeIcon: [],
                    activeBaseCover: [],
                    activeCover: [],
                    preheatTime: null,
                    activeType: 0,
                    activeCrowdType: 0,
                    startTime: '',
                    endTime: '',
                    activeBcUrl: '',
                    activeBaseCoverType:1//是否包含价格
                },
                rules: {
                    activeName: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    activeType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    activeBaseCover: [{ required: true, message: '不能为空', trigger: 'change' }],
                    activeCrowdType: [{
                        validator: (rule, value, callback) => {
                            // 手动限制为只能选择0 1 3 因为之前有选中2的，所以为了能够限制住，就需要先限制住
                            if (value.length === 0 || ![0, 1, 3].includes(value)) {
                                callback(new Error('必选'))
                            } else {
                                callback()
                            }
                        }
                    }],
                    preheat: [{ required: true, message: '不能为空', trigger: 'change' }],
                    preheatTime: [{required: true, message: '不能为空', trigger: 'change'}],
                    startTime: [{required: true, message: '不能为空', trigger: 'change'}],
                    endTime: [{required: true, message: '不能为空', trigger: 'change'}],
                    activeBaseCoverType:[{required: true, message: '不能为空', trigger: 'change'}],
                },
                loading: false,
                startTimeList: ''
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        watch: {
            propShowDialog (val) {
                if (val) {
                    if (!this.propParam.preheat) {
                        // 不预热的时候，预热时间设置为null。避免回显为1970时间
                        this.propParam.preheatTime = null
                    }
                    Object.assign(this.param, this.propParam)
                    console.log(this.param)
                }
            }
        },
        methods: {
            confirmAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        if (this.param.preheat == 1 && this.param.preheatTime > this.param.startTime) {
                            this.$message.error('活动的预热时间须不大于活动的开始时间')
                            return
                        }
                        if (this.param.startTime > this.param.endTime) {
                            this.$message.error('活动的结束时间须不小于活动的开始时间')
                            return
                        }
                        let fetchUrl = insertActive
                        if (this.param.activeId) {
                            fetchUrl = updateActive
                        }
                        this.loading = true
                        fetchUrl({ activeInfo: this.filterData(this.param) }).then((res) => {
                            this.loading = false
                            if (res.ret.errcode === 1) {
                                this.reset()
                                this.$emit('confirm')
                                if (res.message) {
                                    this.$message.warning(`操作成功，${res.message}`)
                                } else {
                                    this.$message.success('操作成功')
                                }
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                })
            },
            setActiveIcon (data) {
                console.log(data)
                this.param.activeIcon = data
            },
            setActiveBaseCover (data) {
                console.log(data)
                this.param.activeBaseCover = data
            },
            setActiveCover (data) {
                this.param.activeCover = data
            },
            reset () {
                this.param = {
                    activeId: '',
                    activeName: '',
                    countryCode: '',
                    activeStatus: '',
                    preheat: null,
                    activeIcon: [],
                    activeBaseCover: [],
                    activeCover: [],
                    preheatTime: null,
                    activeType: 0,
                    activeCrowdType: 0,
                    startTime: '',
                    endTime: '',
                    activeBcUrl: '',
                    activeBaseCoverType:1,
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
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
        width: 100%!important;
        text-align: left;
    }
}
.no-line {
    .el-form-item__label {
        width: 110px!important;
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
 .mt8 {
     margin-top: 16px;
 }
 .tip {
     font-size: 12px;
     color: #999;
 }
 .label-line {
     width: 100% !important;
 }
</style>
