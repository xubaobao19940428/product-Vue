<template>
    <el-dialog
        title="奖品管理"
        width="650px"
        :visible="dialogVisible"
        :close-on-click-modal="false"
        @close="handleClose"
        class="award-manage-dialog">
        <el-form label-width="130px"
            label-position="right"
            :model="param"
            ref="awardManageForm"
            :rules="rules"
        >
            <el-form-item label="选择类型：" class="is-required">
                <el-select v-model="param.luckPrizeType" style="width: 90%" :disabled="awardType === 'edit'">
                    <el-option v-for="item in luckPrizeTypeList" :key="item.key" :value="item.key" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <template>
                <!-- 保险栓是没有这写的 -->
                <el-form-item label="奖品名称：" class="is-required">
                    <el-select v-model="nameLang" style="width: 24%">
                        <el-option v-for="(item) in languageList"
                            :key="item.code"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <el-form-item
                        v-for="(item, index) in param.luckPrizeName"
                        v-show="nameLang === item.languageCode"
                        :key="item.languageCode"
                        class="name-input"
                        :prop="`luckPrizeName[${index}].name`"
                        :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                    >
                        <el-input v-model="item.name" type="text" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="奖品图片：">
                    <c-upload
                        v-if="dialogVisible"
                        :fileList="param.image"
                        @setData="setCoverImg"
                        :limit="1"
                    ></c-upload>
                </el-form-item>
                <!-- 只有优惠券是这个 -->
                <el-form-item label="奖品内容：" class="is-required" v-if="param.luckPrizeType === 1">
                    <el-table :data="param.dataList" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" :style="{width: '90%'}">
                        <el-table-column label="优惠券" width="240" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'dataList.' + scope.$index + '.coupon'" :rules="rules.requireInput">
                                    <el-input v-model="scope.row.coupon"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" align="center">
                            <template slot-scope="scope">
                                <el-input-number v-model="scope.row.num"
                                    class="config-common-input"
                                    :controls="false"
                                    :precision="0"
                                    :min="1"
                                ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="96" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="scope.$index === param.dataList.length - 1 && scope.$index"
                                    type="text"
                                    size="small"
                                    @click="handleDelete(scope.$index)"
                                >删除</el-button>
                                <el-button
                                    v-if="scope.$index === param.dataList.length - 1"
                                    type="text"
                                    size="small"
                                    @click="handleAdd(scope.row)"
                                >新增</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <!-- 积分的部分 -->
                <template v-if="param.luckPrizeType == 5">
                    <el-form-item label="积分金额：" class="is-required">
                        {{ getCurrencyUnit(countryCode, 'currencyUnit') }}
                        <el-input-number
                            :min="pointLimit[countryCode].min"
                            :controls="false"
                            :precision="pointLimit[countryCode].precision"
                            v-model="param.pointsMin"
                        ></el-input-number> ~
                        <el-input-number :min="pointLimit[countryCode].min" :precision="pointLimit[countryCode].precision"
                            v-model="param.pointsMax"
                            :controls="false"
                        ></el-input-number>
                    </el-form-item>
                    <el-form-item label="单次投放量：" class="is-required">
                        <el-input-number :controls="false" :min="0" :precision="0" v-model="param.onceNumber"></el-input-number>
                    </el-form-item>
                </template>
                <!-- 金币的部分 -->
                <template v-if="param.luckPrizeType == 6">
                    <el-form-item label="金币：" class="is-required">
                        <el-input-number
                            :min="pointLimit[countryCode].min"
                            :controls="false"
                            :precision="0"
                            v-model="param.pointsMin"
                        ></el-input-number> ~
                        <el-input-number :min="pointLimit[countryCode].min" :precision="0"
                                         v-model="param.pointsMax"
                                         :controls="false"
                        ></el-input-number>
                    </el-form-item>
                    <el-form-item label="单次投放量：" class="is-required">
                        <el-input-number :controls="false" :min="0" :precision="0" v-model="param.onceNumber"></el-input-number>
                    </el-form-item>
                </template>
                <!-- 其他 -->
                <el-form-item label="单次投放量：" class="is-required" v-else-if="param.luckPrizeType !== 4">
                    <el-input-number
                        :controls="false"
                        :min="0"
                        :precision="0"
                        :max="numLimit[param.luckPrizeType]" v-model="param.onceNumber"></el-input-number>
                    <div class="tip">注意：单次投放量 * 投放次数 = 活动期间的总投放量，请合理计算避免超出运营计划成本</div>
                </el-form-item>

                <el-form-item label="抽中概率：" class="is-required" v-show="param.luckPrizeType !== 4">
                    <el-input-number
                        :controls="false"
                        :min="0"
                        :max="100"
                        :precision="4"
                        size="medium"
                        v-model="param.winningProbability"
                    ></el-input-number>%
                </el-form-item>
            </template>

            <el-form-item label="抽中反馈：" class="is-required">
                <el-radio-group v-model="param.winningTipsType">
                    <el-radio class="radio-line" :label="1">弹窗</el-radio>
                    <el-form-item label="图片：" class="special-item" label-width="80px" prop="winningList1">
                        <multi-lang-file-upload
                            @setData="setImg"
                            :propFileList="param.winningList1"
                            accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                    </el-form-item>
                    <el-form-item label="链接：" class="special-item" label-width="80px">
                        <el-input v-model="param.winningTipsUrl"></el-input>
                    </el-form-item>
                    <el-radio class="radio-line" :label="2">文案：
                        <el-select v-model="descLang" style="width: 26%">
                            <el-option v-for="(item) in languageList"
                                :key="item.code"
                                :label="item.desc"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                        <el-form-item
                            v-for="(item, index) in param.winningList2"
                            v-show="descLang === item.languageCode"
                            :key="item.languageCode"
                            :rules="{ required: (item.languageCode == 'cn' || item.languageCode == 'en') && param.winningTipsType === 2 ? true : false, message: '中英文必填', trigger: 'blur' }"
                            :prop="`winningList2[${index}].name`"
                            class="small-width">
                            <el-input v-model="item.name" type="text" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose"
                    size="small">取 消</el-button>
            <el-button type="primary"
                    size="small"
                    :loading="pending"
                    @click="handleConfirm"
                    >确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import multiLangFileUpload from '@/components/multiLangFileUpload/'
import cUpload from '@/components/fileUpload'


export default {
    props: {
        dialogVisible: Boolean,
        awardData: Object,
        langTemplateList: Array,
        awardType: String,
        countryCode: String
    },
    components: {
        multiLangFileUpload,
        cUpload
    },
    data () {
        return {
            typeList: {},
            pending: false,
            param: {
                id: '',
                luckDrawId: '', //抽奖活动ID
                luckPrizeId: '', //奖品ID
                luckPrizeType: 1,
                luckPrizeName: [],
                dataList: [],
                pointsMin: 0, // 积分最小值
                pointsMax: 0, // 积分最大值
                onceNumber: 0, // 单次投放量
                winningProbability: 0, // 抽中概率
                winningTipsType: 1, // 1 - 弹窗 2 - 文案
                winningTipsUrl: '', // 弹窗链接
                winningList1: [], // 弹窗的图片
                winningList2: [], // 文案内容
                image: '' // 奖品图片
            },
            rules: {
                requireInput: [{required: true, message: '必填', trigger: 'change'}],
                winningList1: [{
                    validator: (rule, value, callback) => {
                        let curType = this.param.winningTipsType
                        if (curType == 1) {
                            let exist = value.find(item => {
                                if (item.languageCode === 'cn' || item.languageCode === 'en') {
                                    return item.name
                                }
                            })
                            if (!exist) {
                                return callback(new Error('不能为空'))
                            } else {
                                return callback()
                            }
                        } else {
                            return callback()
                        }
                    },
                    trigger: 'blur'
                }]
            },
            nameLang: 'cn',
            descLang: 'cn',
            numLimit: {
                1: 9999, // 优惠券类自定义限制
                2: 999999, // 文案类也就是自定义的，最高限制
                3: 999999, // 文案类也就是自定义的，最高限制
                4: Infinity // 兜底 - 保险栓 - 无最高限制
            },
            pointLimit: {
                'MY': {
                    'min': 0.01,
                    'max': 10000,
                    'precision': 2,
                    'onceNumberTotal': 30000,
                    'twoTipNum': 150
                }, // 最小积分 和 小数位 投放量可比的最大值 还有二次确认提示的积分值
                'SG': {
                    'min': 0.01,
                    'max': 1000,
                    'precision': 2,
                    'onceNumberTotal': 10000,
                    'twoTipNum': 50
                },
                'TH': {
                    'min': 1,
                    'max': 50000,
                    'precision': 0,
                    'onceNumberTotal': 200000,
                    'twoTipNum': 1000
                }
            },
            luckPrizeTypeList: [{
                key: 1,
                name: '优惠券'
            }, {
                key: 2,
                name: '奖品'
            }, {
                key: 3,
                name: '非奖品'
            }, {
                key: 4,
                name: '保险栓'
            }, {
                key: 5,
                name: '积分'
            }, {
                key: 6,
                name: '金币'
            }]
        }
    },
    watch: {
        awardData: {
            handler (val) {
                let temp = JSON.parse(JSON.stringify(val))
                if (this.awardType !== 'edit') {
                    temp.winningList2 = JSON.parse(JSON.stringify(this.langTemplateList))
                    temp.winningList1 = JSON.parse(JSON.stringify(this.langTemplateList))
                    temp.luckPrizeName = JSON.parse(JSON.stringify(this.langTemplateList))
                    Object.assign(this.param, temp)

                    if (!temp.dataList || !temp.dataList.length) {
                        this.handleAdd()
                    }
                } else {
                    temp.dataList = temp.couponList ? JSON.parse(temp.couponList) : []
                    let tempWinningList = this.onFillList(temp.winningTipsDesc)
                    temp.winningList1 = temp.winningTipsType === 1 ? tempWinningList : JSON.parse(JSON.stringify(this.langTemplateList))
                    temp.winningList2 = temp.winningTipsType === 2 ? tempWinningList : JSON.parse(JSON.stringify(this.langTemplateList))

                    let luckPrizeName = this.onFillList(temp.luckPrizeName)
                    temp.luckPrizeName = luckPrizeName
                    if (!temp.dataList || !temp.dataList.length) {
                        let tempItem = {
                            coupon: '',
                            num: 1
                        }
                        temp.dataList.push(tempItem)
                    }
                    delete temp.couponList
                    delete temp.winningTipsDesc

                    Object.assign(this.param, temp)
                }
            },
            deep: true
        }
    },
    computed: {
        languageList () {
            return this.$store.state.dict.languageList
        }
    },
    methods: {
        onFillList (data) {
            const len = this.languageList.length
            if (data.length === len) return data

            let tempData = JSON.parse(JSON.stringify(data))
            for (let i = 0; i < len; i++) {
                let temp = this.languageList[i]
                let index = tempData.findIndex(item => item.languageCode === temp.code)
                if (index === -1) {
                    tempData.push({
                        languageCode: temp.code,
                        name: ''
                    })
                }
            }
            return tempData
        },
        setCoverImg (res) {
            this.param.image = res.data
        },
        handleDelete (index) {
            this.$confirm('确认删除该条记录吗？', '提示')
                .then(() => {
                    this.param.dataList.splice(index, 1)
                })
                .catch(() => {})
        },
        handleAdd () {
            let tempItem = {
                coupon: '',
                num: 1
            }
            this.param.dataList.push(tempItem)
        },
        handleOnceNumChange (val) {
            if (val > 100 ) {
                this.$message({
                    type: 'warning',
                    message: `上限${this.numLimit[this.param.luckPrizeType]}`
                })
            }
        },
        setImg (data) {
            this.param.winningList1 = data
        },
        reset () {
            this.nameLang = 'cn'
            this.descLang = 'cn'
            this.$refs['awardManageForm'].clearValidate()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        normalizeParam () {
            let temp = JSON.parse(JSON.stringify(this.param))
            temp.winningTipsDesc = temp['winningList' + temp.winningTipsType]
            if (temp.luckPrizeType === 1) {
                temp.dataList = temp.dataList.map(item => {
                    item.num = item.num + ''
                    return item
                })
                temp.couponList = JSON.stringify(temp.dataList)
            }
            delete temp.dataList
            delete temp.winningList1
            delete temp.winningList2
            temp.pointsMax += ''
            temp.pointsMin += ''
            temp.winningProbability = temp.winningProbability ? temp.winningProbability + '' : '0'
            temp.onceNumber = temp.onceNumber || 0

            return temp
        },
        isRepeat (arr) {
            let hash = {}
            for (let i in arr) {
                if (hash[arr[i].coupon]) {
                    return true
                }
                hash[arr[i].coupon] = true
            }
            return false
        },
        onSave (subFlag) {
            if (this.awardType === 'edit' && subFlag) {
                // 这样保证是在最后提交的时候进行的名字判断，就不用每次修改都提示了
                this.$confirm('您确定要修改奖品名称吗？这会导致用户已获得的奖品名称也将同步更新，请谨慎操作!', '提示', {
                    type: 'warning'
                }).then(() => {
                    // 确定修改
                    this.$refs['awardManageForm'].validate((valid) => {
                        if (valid) {
                            this.pending = true
                            let resParam = this.normalizeParam()
                            this.$emit('save', {luckItem: resParam})
                            this.pending = false
                            this.reset()
                        } else {
                            this.$message.error('提示：请确认中英文已填写')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已撤销更改'
                    })
                    let luckPrizeName = this.onFillList(this.awardData.luckPrizeName)
                    this.param.luckPrizeName = luckPrizeName
                })
            } else {
                // 确定修改
                this.$refs['awardManageForm'].validate((valid) => {
                    if (valid) {
                        this.pending = true
                        let resParam = this.normalizeParam()
                        this.$emit('save', {luckItem: resParam})
                        this.pending = false
                        this.reset()
                    } else {
                        this.$message.error('提示：请确认中英文已填写')
                    }
                })
            }
        },
        handleConfirm () {
            let subFlag = false
            let paramLuckPrizeName = [ ...this.param.luckPrizeName ]
            let tempParam = JSON.parse(JSON.stringify(this.param))
            for (let i = 0; i < paramLuckPrizeName.length; i++) {
                let item = paramLuckPrizeName[i]
                subFlag = this.awardData.luckPrizeName.find(a => {
                    if (a.languageCode === item.languageCode && a.name !== item.name) {
                        return true
                    } else {
                        return false
                    }
                })
                if (subFlag) {
                    // 为true表示有不一样的
                    break;
                }
            }
            let flag = this.isRepeat(tempParam.dataList)
            if (flag) {
                this.$message.error('优惠券ID不能重复')
                return
            }
            if (tempParam.luckPrizeType == 5 || tempParam.luckPrizeType == 6) {
                if (!tempParam.pointsMin || !tempParam.pointsMax) {
                    this.$message.error('金额必填')
                    return
                }
                // 校验积分金额最大值（超过则禁止提交）和区间两边的比较
                if (tempParam.pointsMax < tempParam.pointsMin) {
                    this.$message.error('金额左边需小于或等于右边的值')
                    return
                }
                if (tempParam.pointsMax > this.pointLimit[this.countryCode].max) {
                    this.$message.error('金额过大，无法提交')
                    return
                }
                if (tempParam.pointsMax >= this.pointLimit[this.countryCode].twoTipNum) {
                    this.$confirm('你设定的金额较大，确认要保存吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let maxOnceNum = Math.round(this.pointLimit[this.countryCode].onceNumberTotal / tempParam.pointsMax)

                        if (tempParam.onceNumber > maxOnceNum) {
                            this.$message.error('单次投放量过高，无法提交')
                        } else {
                            this.onSave(subFlag)
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                } else {
                    let maxOnceNum = Math.round(this.pointLimit[this.countryCode].onceNumberTotal / tempParam.pointsMax)

                    if (tempParam.onceNumber > maxOnceNum) {
                        this.$message.error('单次投放量过高，无法提交')
                    } else {
                        this.onSave(subFlag)
                    }
                }
            } else {
                if (tempParam.onceNumber > 100 && tempParam.luckPrizeType !== 4) {
                    this.$confirm('当前设置的单次投放量过高，请确认是否修改', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.onSave(subFlag)
                    })
                } else {
                    this.onSave(subFlag)
                }
            }
        }
    }

}
</script>

<style scoped lang="scss">
.award-manage-dialog {
    .tip {
        color: #999999;
        line-height: 24px;
    }
    .mtb10 {
        margin: 10px 0;
    }
    .name-input {
        width: 66%;
        display: inline-block;
    }
    .small-width {
        width: 60%;
        display: inline-block;
    }
    .special-item {
        margin-bottom: 10px;
    }
    .radio-line {
        display: block;
        line-height: 40px;
    }
    .config-common-input {
        width: 100%;
    }
}
</style>
