<template>
    <el-dialog
        title="批量助手"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="cancel"
        class="bulk-edit-dialog">
        <el-form inline label-width="90px" :model="queryData" :rules="rules">
            <div class="bulik-time">
                <div class="time-radio">
                    <el-form-item label="活动时间：" prop="spuPreheat">
                        <el-radio-group v-model="queryData.spuPreheat">
                            <el-radio :label="1">跟随活动</el-radio>
                            <el-radio :label="2">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="time-box">
                    <el-form-item v-if="preheat == 1" label="预热时间：" prop="spuPreheatTime">
                        <el-date-picker
                            v-model="queryData.spuPreheatTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :default-time="country==='TH'?'01:00:00':'00:00:00'">
                        </el-date-picker>
                    </el-form-item> 
                    <el-form-item label="开始时间：" prop="startTime">
                        <el-date-picker
                            v-model="queryData.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :default-time="country==='TH'?'01:00:00':'00:00:00'">
                        </el-date-picker>
                    </el-form-item> 
                    <el-form-item label="结束时间：" prop="endTime">
                        <el-date-picker
                            v-model="queryData.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :default-time="country==='TH'?'00:59:59':'23:59:59'">
                        </el-date-picker>
                    </el-form-item>  
                </div>
            </div>
            <el-form-item label="商品分组：" class="form-item">
                <el-select v-model="queryData.groupLabelId" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in activityLabel"
                                :key="index"
                                :label="getMultiLangShowInfo(item.name)"
                                :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品角标：" class="form-item">
                <div class="flex form-content">
                    <el-select v-model="productCornerLang" placeholder="请选择">
                        <el-option v-for="(item, i) in languageList"
                                    :key="i"
                                    :label="item.desc"
                                    :value="item.code">
                        </el-option>
                    </el-select>
                    <div v-for="(item, i) in productCorner" :key="i" v-show="productCornerLang == item.languageCode" class="flex1 mar-l-10">
                        <el-input v-model="item.name" show-word-limit maxlength="20" type="text" placeholder="请输入"></el-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="营销文案：" class="form-item">
                <div class="flex form-content">
                    <el-select v-model="promotionDescLang" placeholder="请选择">
                        <el-option v-for="(item, i) in languageList"
                                    :key="i"
                                    :label="item.desc"
                                    :value="item.code">
                        </el-option>
                    </el-select>
                    <div v-for="(item, i) in promotionDesc" :key="i" v-show="promotionDescLang == item.languageCode" class="flex1 mar-l-10">
                        <el-input v-model="item.name" show-word-limit maxlength="20" type="text" placeholder="请输入"></el-input>
                    </div>
                </div>
            </el-form-item>
        </el-form>    
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { BatchUpdateSignedProduct } from '@/request/activityReport'
    import { listActiveGroup } from '@/request/marketing'
    import common from '@/js/common/mixins'

    export default {
        props: {
            dialogVisible: Boolean,
            preheat: String,
            country: String,
            activeId: String,
            activeSpuInfo: Array
        },
        data () {
            return {
                queryData: {
                    spuPreheat: 0,
                    spuPreheatTime: '',
                    startTime: '',
                    endTime: '',
                    groupLabelId: '',
                    productCorner: '',
                    promotionDesc: ''
                },
                activityLabel: [],
                rules: {
                    spuPreheat: [{ required: true, message: '请选择日期时间', trigger: 'change' }],
                    spuPreheatTime: [{ required: true, message: '请选择日期时间', trigger: 'change' }],
                    startTime: [{ required: true, message: '请选择日期时间', trigger: 'change' }],
                    endTime: [{ required: true, message: '请选择日期时间', trigger: 'change' }]
                },
                productCornerLang: 'cn',
                promotionDescLang: 'cn',
                productCorner: [],
                promotionDesc: [],
            }
        },
        mixins: [common],
        created () {
            this.getActivityLabel()
            this.initLangData()
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
            languageList () {
                return this.$store.state.dict.languageList
            }
        },
        methods: {
            initLangData () {
                for (let i = 0; i < this.languageList.length; i++) {
                    let lang = this.languageList[i].code
                    let productCorner = this.productCorner.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!productCorner) {
                        this.productCorner.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                    let promotionDesc = this.promotionDesc.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!promotionDesc) {
                        this.promotionDesc.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            getActivityLabel () {
                listActiveGroup(this.filterData({
                    activeId: this.activeId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityLabel = res.groupInfo
                    }
                })
            },
            confirm () {
                if (this.queryData.spuPreheat === 0) {
                    this.$message.error('请选择活动时间！')
                    return
                }
                if (this.queryData.spuPreheat === 2) {
                    if (this.preheat == 1 && (this.queryData.spuPreheatTime == '' || this.queryData.startTime == '' || this.queryData.endTime == '')){
                        this.$message.error('请选择活动时间！')
                        return
                    }
                    if (this.preheat != 1 && (this.queryData.startTime == '' || this.queryData.endTime == '')){
                        this.$message.error('请选择活动时间！')
                        return    
                    }
                }
                if (this.queryData.spuPreheatTime != '' && this.queryData.spuPreheatTime > this.queryData.startTime) {
                    this.$message.error('商品的预热时间须不大于商品的开始时间')
                    return
                }
                
                if (this.queryData.startTime > this.queryData.endTime) {
                    this.$message.error('活动的结束时间须不小于活动的开始时间')
                    return
                }
                let item = this.activityLabel.find( val => {
                    return val.id =  this.queryData.groupLabelId
                })
                let params = {
                    activeId: this.activeId,
                    spuPreheat: this.queryData.spuPreheat,
                    spuPreheatTime: this.queryData.spuPreheatTime===''?'':(moment(moment(this.queryData.spuPreheatTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()).toString(),
                    startTime: this.queryData.startTime===''?'':(moment(moment(this.queryData.startTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()).toString(),
                    endTime: this.queryData.endTime===''?'':(moment(moment(this.queryData.endTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()).toString(),
                    productCorner: this.productCorner,
                    promotionDesc: this.promotionDesc,
                    activeSpuInfo: this.activeSpuInfo,
                    groupLabelId: this.queryData.groupLabelId,
                    groupLabel: this.queryData.groupLabelId===''?[]:item.name
                }
                BatchUpdateSignedProduct(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$emit('on-confirm')
                        this.$message.success('批量操作成功！')
                    }
                })
            },
            cancel () {
                this.$emit('on-cancel')
            }
        },
    }
</script>
<style lang="scss">
    .bulk-edit-dialog{
        .el-radio-group{
            display: flex;
            flex-direction: column;
            margin-left: 20px;
        }
        .el-radio{
            margin-bottom: 30px;
        }
    }
</style>
<style lang="scss" scoped>
    .bulk-edit-dialog {
        .bulik-time{
            display: flex;
            margin-top: 10px;
        }
        .time-radio{
            width: 300px;
        }
        .time-box{
            display: flex;
            flex-direction: column;
            margin-top: 35px;
        }
        .form-item{
            width: 100%;
        }
        .content-box{
            display: flex;
            .input-box{
                margin-left: 10px;
            }
        }
        .form-content{
            width: 400px;
        }
    }
</style>