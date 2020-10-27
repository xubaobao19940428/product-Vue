<template>
    <div class="common-config-wrapper">
        <div class="red-tip">说明：1.老用户帮拆比例之和+分享挡+第1~6挡的所拆比例之和必须等于100%，2.各挡拉新指标人数之和不能超出总拉新指标，否则系统起冲突，不能保存！</div>
        <el-form :rules="commonRules" :model="curDataNum" ref="redCommonConfigForm">
            <div class="table-tip">分享档：（前x个分享比例配置）</div>
            <el-table :data="curDataNum.shareLevelUnit" border show-summary>
                <el-table-column label="序号" type="index" align="center" width="180px"></el-table-column>
                <el-table-column label="第x次分享" align="center" width="220px">
                    <template slot-scope="scope">{{ scope.row.number }}</template>
                </el-table-column>
                <el-table-column label="对应所拆比例（%）" prop="rate">
                    <template slot-scope="scope">
                        <div class="config-common-p">
                            <el-form-item :prop="'shareLevelUnit.' + scope.$index + '.rate'" :rules="commonRules.requiredNum">
                                <el-input-number v-model="scope.row.rate" :min="0" :precision="2" :controls="false"></el-input-number>（占首拆剩余金额比例）
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160px" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.$index === curDataNum.shareLevelUnit.length - 1 && curDataNum.shareLevelUnit.length < 5"
                            type="text"
                            @click="handleAdd(curDataNum.shareLevelUnit, {
                                rate: 0,
                                number: scope.$index + 2
                            })"
                        >新增</el-button>
                        <el-button
                            v-if="scope.$index === curDataNum.shareLevelUnit.length - 1 && scope.$index"
                            type="text"
                            @click="handleDel(curDataNum.shareLevelUnit, scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-tip">第1档 （前x个拉新比例配置）</div>
            <el-table :data="curDataNum.firstLevelUnit" border show-summary>
                <el-table-column label="序号" type="index" width="160px" align="center"></el-table-column>
                <el-table-column label="拉到第x人" align="center" width="200px">
                    <template slot-scope="scope">{{ scope.row.number }}</template>
                </el-table-column>
                <el-table-column label="对应所拆比例（%）" prop="rate">
                    <template slot-scope="scope">
                        <div class="config-common-p">
                            <el-form-item :prop="'firstLevelUnit.' + scope.$index + '.rate'" :rules="commonRules.requiredNum">
                                <el-input-number v-model="scope.row.rate" :min="0" :precision="2" :controls="false"></el-input-number>（占首拆剩余金额比例）
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.$index === curDataNum.firstLevelUnit.length - 1 && curDataNum.firstLevelUnit.length < 5"
                            type="text"
                            @click="handleAdd(curDataNum.firstLevelUnit, {
                                rate: 0,
                                number: scope.$index + 2
                            })"
                        >新增</el-button>
                        <el-button
                            v-if="scope.$index === curDataNum.firstLevelUnit.length - 1 && scope.$index"
                            type="text"
                            @click="handleDel(curDataNum.firstLevelUnit, scope.$index, false)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-tip">第2档</div>
            <el-form-item label="该档所拆比例总和：" prop="secondLevelTotalRate">
                <el-input-number :controls="false" v-model="curDataNum.secondLevelTotalRate" :min="0" :precision="2"></el-input-number>（%）（占首拆剩余金额比例）
            </el-form-item>
            <el-table :data="curDataNum.secondLevelUnit" border>
                <el-table-column label="阶梯" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="上一档拉新效率（x小时/人）">
                    <template slot-scope="scope">
                        <div class="config-common">
                            <el-form-item>
                                <el-input-number 
                                    :controls="false" 
                                    :min="0" 
                                    :precision="2" 
                                    disabled
                                    v-model="scope.row.minHour"
                                ></el-input-number> 
                            </el-form-item>
                            - 
                            <el-form-item :prop="`secondLevelUnit.${scope.$index}.maxHour`" :rules="commonRules.requiredNum">
                                <el-input-number 
                                    :controls="false" 
                                    :min="0" 
                                    v-model="scope.row.maxHour"
                                    @change="handleChange(curDataNum.secondLevelUnit, scope.row, scope.$index)"
                                    :precision="2" 
                                ></el-input-number> 小时/人
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="新增拉新指标（人）">
                    <template slot-scope="scope">
                        <el-form-item :prop="'secondLevelUnit.' + scope.$index + '.inviteNum'" :rules="commonRules.requiredNum">
                            <el-input-number 
                                v-model="scope.row.inviteNum" 
                                :min="1" :precision="0" 
                                :controls="false"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.$index === curDataNum.secondLevelUnit.length - 1 && curDataNum.secondLevelUnit.length < 5"
                            type="text"
                            @click="handleAdd(curDataNum.secondLevelUnit, {
                                minHour: scope.row.maxHour,
                                maxHour: 24,
                                inviteNum: 0
                            })"
                        >新增</el-button>
                        <el-button
                            v-if="scope.$index === curDataNum.secondLevelUnit.length - 1 && scope.$index"
                            type="text"
                            @click="handleDel(curDataNum.secondLevelUnit, scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-tip">第3档</div>
            <el-form-item label="该档所拆比例总和：" prop="thirdLevelTotalRate">
                <el-input-number :controls="false" v-model="curDataNum.thirdLevelTotalRate" :min="0" :precision="2"></el-input-number>（%）（占首拆剩余金额比例）
            </el-form-item>
            <el-table :data="curDataNum.thirdLevelUnit" border>
                <el-table-column label="阶梯" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="上一档拉新效率（x小时/人）">
                    <template slot-scope="scope">
                        <div class="config-common">
                            <el-form-item>
                                <el-input-number 
                                    :controls="false" 
                                    :min="0" 
                                    :precision="2"
                                    disabled
                                    v-model="scope.row.minHour"
                                ></el-input-number>
                            </el-form-item>
                             - 
                            <el-form-item :prop="'thirdLevelUnit.' + scope.$index + '.maxHour'" :rules="commonRules.requiredNum">
                                <el-input-number 
                                    :controls="false" 
                                    :min="0" 
                                    v-model="scope.row.maxHour"
                                    @change="handleChange(curDataNum.thirdLevelUnit, scope.row, scope.$index)"
                                    :precision="2" 
                                ></el-input-number> 小时/人
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="新增拉新指标（人）">
                    <template slot-scope="scope">
                        <el-form-item :prop="'thirdLevelUnit.' + scope.$index + '.inviteNum'" :rules="commonRules.requiredNum">
                            <el-input-number 
                                v-model="scope.row.inviteNum" 
                                :min="1" 
                                :precision="0" :controls="false"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px" align="center">
                    <template slot-scope="scope"> 
                        <el-button
                            v-if="scope.$index === curDataNum.thirdLevelUnit.length - 1 && curDataNum.thirdLevelUnit.length < 5"
                            type="text"
                            @click="handleAdd(curDataNum.thirdLevelUnit, {
                                minHour: scope.row.maxHour,
                                maxHour: 24,
                                inviteNum: 0
                            })"
                        >新增</el-button>
                        <el-button
                            v-if="scope.$index === curDataNum.thirdLevelUnit.length - 1 && scope.$index"
                            type="text"
                            @click="handleDel(curDataNum.thirdLevelUnit, scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-tip">第4档</div>
            <el-form-item label="该档所拆比例总和：" prop="fourthLevelTotalRate">
                <el-input-number :controls="false" v-model="curDataNum.fourthLevelTotalRate" :min="0" :precision="2"></el-input-number>（%）（占首拆剩余金额比例）
            </el-form-item>
            <el-table :data="curDataNum.fourthLevelUnit" border>
                <el-table-column label="阶梯" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="上一档拉新效率（x小时/人）">
                    <template slot-scope="scope">
                        <div class="config-common">
                            <el-form-item>
                                <el-input-number 
                                    :controls="false" 
                                    :min="0" 
                                    v-model="scope.row.minHour"
                                    disabled
                                    :precision="2"
                                ></el-input-number> 
                            </el-form-item>
                             - 
                            <el-form-item :prop="'fourthLevelUnit.' + scope.$index + '.maxHour'" :rules="commonRules.requiredNum">
                                <el-input-number 
                                    :controls="false" 
                                    :min="0" 
                                    v-model="scope.row.maxHour"
                                    @change="handleChange(curDataNum.fourthLevelUnit, scope.row, scope.$index)"
                                    :precision="2"
                                ></el-input-number> 小时/人
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="新增拉新指标（人）">
                    <template slot-scope="scope">
                        <el-form-item :prop="'fourthLevelUnit.' + scope.$index + '.inviteNum'" :rules="commonRules.requiredNum">
                            <el-input-number 
                                v-model="scope.row.inviteNum" 
                                :min="1" 
                                :precision="0" :controls="false"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="130px">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.$index === curDataNum.fourthLevelUnit.length - 1 && curDataNum.fourthLevelUnit.length < 5"
                            type="text"
                            @click="handleAdd(curDataNum.fourthLevelUnit, {
                                minHour: scope.row.maxHour,
                                maxHour: 24,
                                inviteNum: 0
                            })"
                        >新增</el-button>
                        <el-button
                            v-if="scope.$index === curDataNum.fourthLevelUnit.length - 1 && scope.$index"
                            type="text"
                            @click="handleDel(curDataNum.fourthLevelUnit, scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-tip">第5档（补数档）</div>
            <el-form-item label="拉新人数（人）：">该挡拉新指标 = 该用户总拉新指标 - 前几档已拉新总人数；（系统自动计算得出）</el-form-item>
            <el-form-item label="该挡所拆比例总和（%）：" prop="complementRate">
                <el-input-number 
                    :controls="false"
                    :min="0"
                    :precision="2"
                    v-model="curDataNum.complementRate"></el-input-number>（占首拆剩余金额比例）
            </el-form-item>
            <div class="table-tip">{{ `第6档（${type == 'new' ? '新玩家' : '老玩家'}应急档）` }}</div>
            <el-table :data="curDataNum.lastLevelUnitList" border>
                <el-table-column label="阶梯" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="拉新指标（人）">
                    <template slot-scope="scope">
                        <el-form-item :prop="'lastLevelUnitList.' + scope.$index + '.inviteNum'" :rules="commonRules.requiredNum">
                            <el-input-number :controls="false" v-model="scope.row.inviteNum" :min="1" :precision="0"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="该档所拆比例总和（%）">
                    <template slot-scope="scope">
                        <el-form-item :prop="'lastLevelUnitList.' + scope.$index + '.rate'" :rules="commonRules.requiredNum">
                            <el-input-number :controls="false" v-model="scope.row.rate" :min="0" :precision="2"></el-input-number>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
            <div class="foot-tip">
                说明：
                <p class="red-tip">1、拉新成本超出当日额度时，应急挡的指标才生效！</p>
                <p class="text">2、马来西亚，若按照首拆80~85%计算，应急挡填写1%时换算为0.075~0.1马币，可分配7.5~10个拉新指标!</p>
                <p class="text">3、泰国，若按照首拆80~85%计算，应急挡填写1%时换算为0.75~1泰铢，可分配75~100个拉新指标！</p>
                <p class="text">4、新加坡，若按照首拆80~85%计算，应急挡填写1%时换算为0.03~0.04新币，可分配3~4个拉新指标！</p>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        dataNum: Object,
        type: String
    },
    data () {
        return {
            curDataNum: {},
            commonRules: {
                requiredNum: [{
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('必填且>0'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }],
                fourthLevelTotalRate: [{
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('必填且>0'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }],
                secondLevelTotalRate: [{
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('必填且>0'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }],
                complementRate: [{
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('必填且>0'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }],
                thirdLevelTotalRate: [{
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('必填且>0'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }]
            }
        }
    },
    watch: {
        dataNum: {
            handler (val) {
                this.curDataNum = _.cloneDeep(val)
                this.curDataNum.lastLevelUnitList = [this.curDataNum.lastLevelUnit]
            },
            deep: true
        }
    },
    methods: {
        handleAdd (list, item) {
            list.push(item)
        },
        handleDel (data, index) {
            this.$confirm('确认删除该条设置吗？', '提示')
                .then(() => {
                    data.splice(index, 1)
                })
                .catch(() => {})
        },
        handleChange (list, item, index) {
            let temp = [...list]
            if (index + 1 >= temp.length) return

            let tempItem = Object.assign(temp[index + 1], { minHour: item.maxHour })
            list.splice(index + 1, 1, tempItem)
        },
        getData () {
            let data = _.cloneDeep(this.curDataNum)
            let self = this
            let secondLen = data.secondLevelUnit.length
            let thirdLen = data.thirdLevelUnit.length
            let fourthLen = data.fourthLevelUnit.length
            let text = this.type == 'new' ? '新玩家' : '老玩家'
            for (let i = 0; i < secondLen; i++) {
                let a = data.secondLevelUnit[i]
                if (a.maxHour <= a.minHour) {
                    this.$message.error(`${text}的第2挡的上一档拉新效率值${i+1}阶梯的右边界须大于左边界`)
                    return
                }
            }
            for (let i = 0; i < thirdLen; i++) {
                let a = data.thirdLevelUnit[i]
                if (a.maxHour <= a.minHour) {
                    this.$message.error(`${text}的第3挡的上一档拉新效率值${i+1}右边界须大于左边界`)
                    return
                }
            }
            for (let i = 0; i < fourthLen; i++) {
                let a = data.fourthLevelUnit[i]
                if (a.maxHour <= a.minHour) {
                    this.$message.error(`${text}的第4挡的上一档拉新效率值${i+1}右边界须大于左边界`)
                    return
                }
            }
            if (data.secondLevelUnit[secondLen - 1].maxHour != 24) {
                this.$message.error(`${text}的第2档的最后一阶梯拉新效率值的最大值须为24`)
                return
            }
            if (data.thirdLevelUnit[thirdLen - 1].maxHour != 24) {
                this.$message.error(`${text}的第3档的最后一阶梯拉新效率值的最大值须为24`)
                return
            }
            if (data.fourthLevelUnit[fourthLen - 1].maxHour != 24) {
                this.$message.error(`${text}的第4档的最后一阶梯拉新效率值的最大值须为24`)
                return
            }
            // 分享档
            data.shareLevelUnit = data.shareLevelUnit.map(item => {
                item.rate += ''
                return item
            })
            // 第1档
            data.firstLevelUnit = data.firstLevelUnit.map(item => {
                item.rate += ''
                return item
            })
            data.secondLevelUnit = data.secondLevelUnit.map(item => {
                item.minHour += ''
                item.maxHour += ''
                return item
            })            
            data.thirdLevelUnit = data.thirdLevelUnit.map(item => {
                item.minHour += ''
                item.maxHour += ''
                return item
            })
            data.fourthLevelUnit = data.fourthLevelUnit.map(item => {
                item.minHour += ''
                item.maxHour += ''
                return item
            })
            
            data.lastLevelUnit = data.lastLevelUnitList[0]
            delete data.lastLevelUnitList
            data.secondLevelTotalRate += ''
            data.thirdLevelTotalRate += ''
            data.fourthLevelTotalRate += ''
            data.lastLevelUnit.rate += ''
            data.complementRate += ''
            
            return new Promise((resolve) => {
                self.$refs['redCommonConfigForm'].validate((valid) => {
                    if (valid) {
                        resolve(data)
                    } else {
                        self.$message.warning('请输入必填项')
                        return
                    }
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.common-config-wrapper {
    .title {
        border-left: 4px solid #409EFF;
        height: 28px;
        line-height: 28px;
        padding-left: 10px;
    }
    .red-tip {
        color: #f56c6c;
        padding: 4px 0 8px 10px;
    }
    .foot-tip {
        padding: 8px 0 2px 0;
        .text {
            padding: 4px 0 8px 10px;
        }
    }
    .table-tip {
        color: #333;
        font-size: 16px;
        font-weight: 500;
        margin: 16px 0 10px 0;
    }
    .config-common {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 4px;
    }
    .config-common-p {
        padding-top: 4px;
    }
}
</style>