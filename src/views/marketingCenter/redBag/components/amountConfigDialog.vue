<template>
    <el-dialog class="amount-config-dialog" title="资金配置" :visible="configDialog.show" width="1000px" @close="handleClose">
        <el-form ref="amountConfigForm" label-width="100px" :model="param">
            <el-form-item label="国家：" class="is-required"><span class="country-msg">{{ nameCn }}</span></el-form-item>
            <el-form-item label="金额上限：" class="is-required">
                <span class="tip-content">该数值用以粗略控制每日红包支出成本：当今日已拆成红包的总金额超过上限时，所有用户无法再发起新的拆红包，但不影响进行中的事件；故一天的累计支出有可能会超过该数值。</span>
                <span class="country-msg">{{ currencyUnit }}</span>
                <el-input-number
                    style="display: inline-block; margin-left: 12px;"
                    :controls="false"
                    v-model="param.maxAmount"
                    :precision="2"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="阶梯设置：" class="is-required">
                <span class="tip-content">
                    以用户近30日拉新数为参照，区分不同用户的拉新能力从而制定不同的红包金额和拉新指标；最少1档，最多5档；若有用户的拉新数高于最高档，则以最高档计。
                </span>
                <el-table :data="param.configLadder" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                    <el-table-column label="阶梯" width="60" align="center">
                        <template slot-scope="scope">
                            {{ scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column label="近30日拉新数" align="center">
                        <template slot-scope="scope">
                            <div class="config-common">
                                <el-input-number v-model="scope.row.minInviteNum"
                                    :controls="false"
                                    class="config-common-input"
                                    :precision="0"
                                    disabled
                                    :min="0"
                                ></el-input-number>
                                 ~
                                <el-form-item :prop="'configLadder.' + scope.$index + '.maxInviteNum'" :rules="ruleValidate.num">
                                    <el-input-number v-model="scope.row.maxInviteNum"
                                        @change="handleMaxInviteChange(scope.row, scope.$index)"
                                        :controls="false"
                                        class="config-common-input"
                                        :precision="0"
                                        :min="0"
                                    ></el-input-number>
                                </el-form-item>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="'*红包金额(' + currencyUnit + ')'" align="center" min-width="120px">
                        <template slot-scope="scope">
                            <div class="config-common">
                                <el-form-item :prop="'configLadder.' + scope.$index + '.minAmount'" :rules="ruleValidate.num">
                                    <el-input-number v-model="scope.row.minAmount"
                                        class="config-common-input"
                                        :controls="false"
                                        :min="0"
                                        :precision="2"></el-input-number>
                                </el-form-item>
                                 ~
                                 <el-form-item :prop="'configLadder.' + scope.$index + '.maxAmount'" :rules="ruleValidate.num">
                                    <el-input-number v-model="scope.row.maxAmount"
                                        class="config-common-input"
                                        :controls="false"
                                        :min="0"
                                        :precision="2"></el-input-number>
                                 </el-form-item>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="*拉新指标" align="center">
                        <template slot-scope="scope">
                            <div class="config-common">
                                <el-form-item :prop="'configLadder.' + scope.$index + '.minIndicator'" :rules="ruleValidate.num">
                                    <el-input-number v-model="scope.row.minIndicator"
                                        class="config-common-input"
                                        :controls="false"
                                        :precision="0"
                                        :min="0"
                                    ></el-input-number>
                                </el-form-item>
                                 ~
                                <el-form-item :prop="'configLadder.' + scope.$index + '.maxIndicator'" :rules="ruleValidate.num">
                                    <el-input-number v-model="scope.row.maxIndicator"
                                        class="config-common-input"
                                        :controls="false"
                                        :precision="0"
                                        :min="1"
                                    ></el-input-number>
                                </el-form-item>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                        <template slot-scope="scope">
                            <el-button
                                v-if="scope.$index === param.configLadder.length - 1 && scope.$index"
                                type="text"
                                @click="handleDelete(scope.$index)"
                            >删除</el-button>
                            <el-button
                                v-if="scope.$index === param.configLadder.length - 1 && param.configLadder.length < 5"
                                type="text"
                                @click="handleAdd(scope.row, scope.$index)"
                            >新增</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose"
                    size="small">取 消</el-button>
            <el-button type="primary"
                    size="small"
                    @click="handleConfirm"
                    :loading="pending"
                    >确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { saveConfig } from '@/request/marketing'
    export default {
        props: {
            configDialog: {},
            currencyUnit: String,
            nameCn: String,
            countryCode: String
        },
        created () {
            this.param.configLadder = this.configDialog.configLadder
            this.param.maxAmount = this.configDialog.maxAmount
        },
        data () {
            return {
                ruleValidate: {
                    num: [{
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error('必填且>0'))
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }]
                },
                simpleLimit: {
                    'SG': 20,
                    'MY': 50,
                    'TH': 500
                },
                pending: false,
                param: {
                    maxAmount: 0,
                    configLadder: []
                }
            }
        },
        methods: {
            reset () {
                this.$refs['amountConfigForm'].resetFields()
            },
            handleClose () {
                this.reset()
                this.pending = false
                this.$emit('close')
            },
            handleDelete (index) {
                this.$confirm('确认删除该条阶梯设置吗？', '提示')
                    .then(() => {
                        this.param.configLadder.splice(index, 1)
                    })
                    .catch(() => {})
            },
            handleAdd (item, index) {
                let originVal = {
                    minInviteNum: item.maxInviteNum + 1,
                    maxInviteNum: 99,
                    minAmount: 0,
                    maxAmount: 0,
                    minIndicator: 0,
                    maxIndicator: 0
                }
                this.param.configLadder.push(originVal)
            },
            handleMaxInviteChange (item, index) {
                // 设置下一个近30日的拉新数
                let temp = [...this.param.configLadder]
                if (index + 1 >= temp.length) {
                    return
                }

                let tempItem = Object.assign(temp[index + 1], { minInviteNum: item.maxInviteNum + 1 })
                this.param.configLadder.splice(index + 1, 1, tempItem)
            },
            checkValue (list) {
                let flag = false
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    if (item.maxInviteNum < item.minInviteNum) {
                        this.$message.error(`第${i + 1}阶梯的【近30日拉新数】的右边数值须不小于左边数值`)
                        return false
                    } else if (item.maxAmount < item.minAmount) {
                        this.$message.error(`第${i + 1}阶梯的【红包金额】的右边数值须不小于左边数值`)
                        return false
                    } else if (item.maxIndicator < item.minIndicator) {
                        this.$message.error(`第${i + 1}阶梯的【拉新指标】的右边数值须不小于左边数值`)
                        return false
                    }
                }

                return true
            },
            onSave (resParam) {
                this.pending = true
                resParam.configLadder.map(item => {
                    item.maxAmount += ''
                    item.minAmount += ''
                })
                saveConfig(this.filterData(resParam)).then(res => {
                    this.pending = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('添加成功')
                        this.reset()
                        this.$emit('close')
                    }
                }).catch(err => {
                    console.error(err)
                    this.pending = false
                })
            },
            handleConfirm () {
                this.$refs.amountConfigForm.validate((valid) => {
                    if (valid) {
                        let resParam = {
                            countryCode: this.countryCode,
                            serialId: this.configDialog.serialId,
                            maxAmount: this.param.maxAmount.toString(),
                            configLadder: this.param.configLadder
                        }

                        let pass = this.checkValue(resParam.configLadder)

                        if (!pass) return

                        let overIndex = resParam.configLadder.findIndex(item => item.maxAmount > this.simpleLimit[this.countryCode])
                        if (overIndex !== -1) {
                            this.$confirm('已超最高金额，是否继续提交', '注意', {
                                confirmButtonText: '继续',
                                cancelButtonText: '取消'
                            })
                            .then(() => {
                                this.onSave(resParam)
                            })
                            .catch(() => {})
                        } else {
                            this.onSave(resParam)
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scope>
    .amount-config-dialog{
        .el-table td div {
            width: 100%;
        }
        .country-msg {
            font-weight: 500;
        }
        .tip-content {
            color: #888888;
            display: block;
            line-height: 30px;
            margin-bottom: 8px;
        }
        .config-common {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0 16px;
        }
    }
</style>
