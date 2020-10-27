<template>
    <div class="app-container algo-config-wrapper">
        <div class="algo-config__header">
            <h5>{{ `拆红包算法配置中心 - ${nameCn}` }}</h5>
        </div>

        <div class="alog-config__content">
            <el-card class="card-common">
                <div class="title" slot="header">基础配置项：</div>
                <el-form :rules="rules" :model="redBagSystemConfig" ref="redBagSystemConfigForm">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="新用户拉新指标：" class="is-required">
                                <el-input-number :controls="false" :min="1" :precision="0" v-model="redBagSystemConfig.minInviteNumber" style="maxWidth: 160px;"></el-input-number> - 
                                <el-input-number :controls="false" :min="1" :precision="0" v-model="redBagSystemConfig.maxInviteNumber" style="maxWidth: 160px;"></el-input-number>(人)
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="红包金额：" prop="redBagAmount">
                                {{ currencyUnit + redBagSystemConfig.redBagAmount }}
                                <!-- {{ currencyUnit }} <el-input-number :controls="false" :min="1" v-model="redBagSystemConfig.redBagAmount" :precision="0" style="maxWidth: 160px;" disabled></el-input-number> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="每拆成功1次叠加指标：" prop="addInviteNumber">
                                <el-input-number :controls="false" :min="1" :precision="0" v-model="redBagSystemConfig.addInviteNumber" style="maxWidth: 160px;"></el-input-number>（人）
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="当日限额：" prop="maxAmount">
                                {{ currencyUnit }} <el-input-number :controls="false" :min="1" :precision="0" v-model="redBagSystemConfig.maxAmount" style="maxWidth: 160px;"></el-input-number>（超过上限后，当日无法再拆新红包）
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="老用户最高拉新指标：" prop="oldUserMaxInvite">
                                <el-input-number :controls="false" :min="1" :precision="0" v-model="redBagSystemConfig.oldUserMaxInvite" style="maxWidth: 160px;"></el-input-number>（人）
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                             <el-form-item label="红包首拆比例区间：" class="is-required">
                                <el-input-number :controls="false" :min="1" :precision="0" v-model="redBagSystemConfig.minFirstAmountRate" style="maxWidth: 160px;"></el-input-number> - 
                                <el-input-number :controls="false" :min="1" :precision="0" :max="100" v-model="redBagSystemConfig.maxFirstAmountRate" style="maxWidth: 160px;"></el-input-number>(%) (占总金额比例)
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="应急档时间分布1：">
                                <el-time-picker
                                    is-range
                                    v-model="timeList1"
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    value-format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:60',
                                        end: '23:00'
                                    }"
                                    placeholder="选择时间范围"
                                    >
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="老用户帮拆比例总和：" prop="oldUserMaxRate">
                                <el-input-number :controls="false" :min="0" :precision="2" :max="100" v-model="redBagSystemConfig.oldUserMaxRate" style="maxWidth: 160px;"></el-input-number>（%）（占首拆剩余金额比例）
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="应急档时间分布2：">
                                <el-time-picker
                                    is-range
                                    v-model="timeList2"
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    value-format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:60',
                                        end: '23:00'
                                    }"
                                    placeholder="选择时间范围">
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="">
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
            <el-card class="card-common">
                <div class="title" slot="header">动态配置项：</div>
                <el-tabs type="card" v-model="curView">
                    <el-tab-pane label="新玩家配置" name="new">
                        <common-config ref="newPlayerConfig" :dataNum="redBagSystemConfig.newPlayerConfig" type="new"></common-config>
                    </el-tab-pane>
                    <el-tab-pane label="老玩家配置" name="old">
                        <common-config ref="oldPlayerConfig" :dataNum="redBagSystemConfig.oldPlayerConfig" type="old"></common-config>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>

        <div class="algo-config__footer">
            <el-button @click="handleCancel" class="foot-btn">取消</el-button>
            <el-button type="primary" @click="handleSave" class="foot-btn" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import { 
    getRedBagSystemConfig,
    saveRedBagSystemConfig
} from '@/request/marketing'
import commonConfig from './components/commonConfig'
export default {
    components: {
        commonConfig
    },
    data () {
        return {
            countryCode: 'MY',
            currencyUnit: 'RM',
            nameCn: '马来西亚',
            redBagSystemConfig: {
                redBagAmount: 0, // 红包金额
                maxAmount: 0, // 金额上限
                addInviteNumber: 0, // 每拆成功一次加固定指标
                minInviteNumber: 0, // 最小指标
                maxInviteNumber: 0, // 最大指标
                oldUserMaxInvite: 0, // 老用户最高指标
                oldUserMaxRate: 0, // 老用户最高金额比率
                minFirstAmountRate: 0, // 最小首拆金额比率
                maxFirstAmountRate: 0, // 最大首拆金额比率
                newPlayerConfig: {}, // 新用户配置
                oldPlayerConfig: {}, // 老用户配置
                emergencyAStartTime: '', // 应急档时间a,开始时间 HH:mm
                emergencyAEndTime: '', // 应急档时间a,结束时间 HH:mm
                emergencyBStartTime: '', // 应急档时间b,开始时间 HH:mm
                emergencyBEndTime: '' // 应急档时间b,结束时间 HH:mm
            },
            curView: 'new',
            rules: {
                redBagAmount: [{ required: true, message: '红包金额必填', trigger: 'blur' }],
                oldUserMaxRate: [{ 
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('必填且>0'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                 }],
                maxAmount: [{ required: true, message: '当日限额必填', trigger: 'blur' }],
                oldUserMaxInvite: [{required: true, message: '当日限额必填', trigger: 'blur'}],
                addInviteNumber: [{ required: true, message: '每拆成功1次叠加指标必填', trigger: 'blur' }]
            },
            fullscreenLoading: false,
            timeList1: ['',''], // 应急时间1列表
            timeList2: ['',''] // 已经时间2列表
        }
    },
    created () {
        let query = this.$route.query || {}
        this.countryCode = query.countryCode
        this.nameCn = query.nameCn
        this.currencyUnit = this.getCurrencyUnit(query.countryCode, 'currencyUnit')
        this.getDetailData(query.countryCode)
    },
    methods: {
        getDetailData (countryCode) {
            getRedBagSystemConfig({
                countryCode
            }).then(res => {
                if (res.ret.errcode === 1) {
                    Object.assign(this.redBagSystemConfig, res.redBagSystemConfig)
                    if (res.redBagSystemConfig.emergencyAStartTime && res.redBagSystemConfig.emergencyAEndTime) {
                        this.timeList1 = [res.redBagSystemConfig.emergencyAStartTime, res.redBagSystemConfig.emergencyAEndTime]
                    }
                    if (res.redBagSystemConfig.emergencyBStartTime && res.redBagSystemConfig.emergencyBEndTime) {
                        this.timeList2 = [res.redBagSystemConfig.emergencyBStartTime, res.redBagSystemConfig.emergencyBEndTime]
                    }
                }
            })
        },
        handleSave () {
            let param = _.cloneDeep(this.redBagSystemConfig)

            if (!param.minInviteNumber || !param.maxInviteNumber) {
                this.$message.error('新用户拉新指标左右边界值必填')
                return
            } else if (param.minInviteNumber > param.maxInviteNumber) {
                // 新用户拉新指标左右边距大小值
                this.$message.error('新用户拉新指标右边界值须不小于左边界值')
                return
            } else if (param.oldUserMaxInvite <= param.maxInviteNumber) {
                // 老用户最高拉新指标需大于值
                this.$message.error('老用户最高拉新指标需高于新用户拉新指标最大值')
                return
            } else if (!param.minFirstAmountRate || !param.maxFirstAmountRate) {
                this.$message.error('红包首拆比例区间左右边界值必填')
                return
            }else if (param.minFirstAmountRate > param.maxFirstAmountRate) {
                this.$message.error('红包首拆比例区间右边界值须不小于左边界值')
                return
            }
            if (this.timeList1 && this.timeList1[0] && this.timeList2 && this.timeList2[0]) {
                // 两个应急时间都填写了，第二个区间的开始时间在第一区间的开始和结束之间，或第一个区间的开始时间在第二区间的开始和结束之间
                if ((this.timeList1[0] <= this.timeList2[0] && this.timeList1[1] >= this.timeList2[0]) || 
                    (this.timeList2[0] <= this.timeList1[0] && this.timeList2[1] >= this.timeList1[0])) 
                {
                    this.$message.error('应急档时间的两个分布当前存在重合')
                    return
                }
            }
            Object.assign(param, {
                emergencyAStartTime: this.timeList1 ? this.timeList1[0] : null,
                emergencyAEndTime: this.timeList1 ? this.timeList1[1] : null,
                emergencyBStartTime: this.timeList2 ? this.timeList2[0] : null,
                emergencyBEndTime: this.timeList2 ? this.timeList2[1] : null
            })

            this.$refs['redBagSystemConfigForm'].validate(valid => {
                if (valid) {
                    param.minFirstAmountRate += ''
                    param.maxFirstAmountRate += ''
                    param.oldUserMaxRate += ''
                    // 分一下提醒的顺序
                    if (this.curView == 'new') {
                        let newPlayerConfig = this.$refs.newPlayerConfig.getData()
                        if (!!newPlayerConfig) {
                            newPlayerConfig.then(newRes => {
                                let oldPlayerConfig = this.$refs.oldPlayerConfig.getData()
                                if (!!oldPlayerConfig) {
                                    oldPlayerConfig.then(oldRes => {
                                        param = Object.assign(param, {newPlayerConfig: newRes}, {oldPlayerConfig: oldRes})
                                        this.fullscreenLoading = true
                                        saveRedBagSystemConfig({ redBagSystemConfig: param }).then(res => {
                                            if (res.ret.errcode === 1) {
                                                this.$message.success('保存成功')
                                                this.handleCancel()
                                            }
                                            this.fullscreenLoading = false
                                        })
                                    })
                                }
                            })
                        }
                    } else {
                        let oldPlayerConfig = this.$refs.oldPlayerConfig.getData()
                        if (!!oldPlayerConfig) {
                            oldPlayerConfig.then(oldRes => {
                                let newPlayerConfig = this.$refs.newPlayerConfig.getData()
                                if (!!newPlayerConfig) {
                                    newPlayerConfig.then(newRes => {
                                        param = Object.assign(param, {newPlayerConfig: newRes}, {oldPlayerConfig: oldRes})
                                        this.fullscreenLoading = true
                                        saveRedBagSystemConfig({ redBagSystemConfig: param }).then(res => {
                                            if (res.ret.errcode === 1) {
                                                this.$message.success('保存成功')
                                                this.handleCancel()
                                            }
                                            this.fullscreenLoading = false
                                        })
                                    })
                                }
                            })
                        }
                    }
                }
            })
        },

        handleCancel () {
            this.$router.replace({
                name: 'redBag',
                query: {
                    currentView: this.countryCode
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.algo-config-wrapper {
    background-color: #F1F2F5;
    .algo-config__header {
        background-color: #fff;
        padding: 8px 32px 16px;
        h5 {
            font-size: 20px;
            font-weight: 500;
        }
    }
    .alog-config__content {
        margin: 20px;
        .card-common {
            background: #fff;
            border-radius: 6px;
            margin-bottom: 16px;
            padding-bottom: 18px;
        }
    }
    .algo-config__footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        padding: 16px 0;
        text-align: center;
        margin-left: -10px;
        background-color: #fff;
        border-top: 1px solid #eee;
        z-index: 1000;
        .foot-btn {
            padding: 12px 24px;
        }
    }
}
</style>