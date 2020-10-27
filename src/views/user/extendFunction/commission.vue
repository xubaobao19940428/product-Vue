<template>
    <div>
        <el-card class="item-card" v-if="hasPermission('BTN_USER_MANAGE_ADD_MONEY')">
            <div slot="header" class="clearfix">
                <span>根据订单号，手动触发返佣</span>
            </div>
            <el-form label-width="80px">
                <el-form-item label="订单号：">
                    <el-input v-model="commissionParam.orderNo" size="small" style="width: 200px; margin-right: 20px;"></el-input>
                    <el-button type="primary" size="small" @click="commissionByOrderNo" :loading="orderNoLoading">确定</el-button>
                </el-form-item>
            </el-form>
<!--            <el-table border :data="commissionList" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">-->
<!--                <el-table-column type="index" width="50" align="center">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="orderNo"  min-width="180px" align="center" label="订单号">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div class="pointer" @click="triggerToOderList(scope.row.orderNo)">-->
<!--                            {{ scope.row.orderNo}}-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="buyerId" align="center" label="买家id">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div class="pointer" @click="clickToMemberInfo(scope.row.buyerId)">-->
<!--                            {{ scope.row.buyerId}}-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="orderSumYuan" align="center" label=" 订单金额">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="userId" min-width="130px" align="center" label="得钱用户id">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div class="pointer" @click="clickToMemberInfo(scope.row.userId)">-->
<!--                            {{ scope.row.userId}}</div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="memberLevel" align="center" label="会员等级">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="commissionAmountYuan" label="佣金" align="center">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="commissionStatusDesc" min-width="200px" align="center" label="返佣状态">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="commissionTypeDesc" min-width="150px" align="center" label="返佣类型">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="createTime" min-width="180px" align="center" label="创建时间">-->
<!--                </el-table-column>-->
<!--            </el-table>-->
        </el-card>

        <el-card class="item-card" v-if="hasPermission('BTN_USER_MANAGE_BIND_BEATMONEY')">
            <div slot="header" class="clearfix">
                <span>根据订单佣金记录打钱</span>
            </div>
            <el-form label-width="120px" ref="commissionMoney" :model="commissionMoney.param" :rules="commissionMoney.rules">
                <el-form-item label="订单号：" prop="orderNo" required>
                    <el-input style="width: 200px" v-model="commissionMoney.param.orderNo"></el-input>
                </el-form-item>
                <el-form-item label="返佣状态：">
                    <el-select v-model="commissionMoney.param.commissionStatus" size="medium">
                        <el-option v-for="(val, key) in commissionMoney.commissionStatus" :key="key" :label="val" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="返佣类型：">
                    <el-select v-model="commissionMoney.param.commissionType" size="medium">
                        <el-option v-for="(val, key) in commissionMoney.commissionType" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="confirmBackMoney" :loading="moneyLoading">确定</el-button>
                </el-form-item>
            </el-form>
        </el-card>
  </div>
</template>

<script>
    import { testCreateOrderCommission, addMoneyByOrderNo } from '@/request/user'
    export default {
        data () {
            return {
                commissionParam: {
                    orderNo: ''
                },
                orderNoLoading: false,
                commissionList: [],
                moneyLoading: false,
                commissionMoney: {
                    param: {
                        orderNo: '',
                        commissionStatus: null,
                        commissionType: null
                    },
                    rules: {
                        orderNo: [{
                            validator: (rule, value, callback) => {
                                if (!value.length) {
                                    callback(new Error('不能为空'))
                                } else {
                                    let trimVal = value.trim()

                                    if (!/^\d{1,}$/.test(trimVal)) {
                                        callback(new Error('订单号须为纯数字'))
                                    } else {
                                        callback()
                                    }
                                }
                            },
                            trigger: 'blur'
                        }],
                        commissionStatus: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }],
                        commissionType: [{
                            required: true,
                            message: '不能为空',
                            trigger: 'blur'
                        }]
                    },
                    commissionStatus: {
                        1: '付款完成，待返佣',
                        2: '已反佣',
                        3: '订单被取消，取消反佣',
                        // 4: '售后中',
                        5: '退款成功，取消返佣'
                    },
                    commissionType: {
                        1: '商品返利(自购返利)',
                        2: '介绍费(礼包奖励)',
                        4: 'Affiliate购买返利(粉丝购物奖励)',
                        5: '团队销售返利(团队销售奖励)',
                        6: '培训津贴(礼包伯乐奖)',
                        7: '介绍费+培训津贴(礼包团队管理奖励)',
                        8: '团队培训津贴(团队启动奖)',
                        // 9: '系统发放',
                        10: '销售培训津贴(普通商品伯乐奖)'
                        // 11: '大礼包奖励',
                        // 12: '大礼包团队启动奖',
                        // 13: '大礼包团队管理奖励',
                        // 14: '大礼包伯乐奖'
                    }
                }
            }
        },
        methods: {
            resetSearch () {
                Object.assign(this.commissionMoney.param, {
                    orderNo: '',
                    commissionStatus: null,
                    commissionType: null
                })
            },
            // Todo 根据订单号补钱
            commissionByOrderNo () {
                let temp = JSON.parse(JSON.stringify(this.commissionParam))
                temp.orderNo = temp.orderNo.trim()

                if (!temp.orderNo) {
                    return this.$message.warning('订单号不能为空')
                } else if (!/^\d{1,}$/.test(temp.orderNo)) {
                    return this.$message.warning('订单号须为纯数字组成')
                }
                this.orderNoLoading = true
                testCreateOrderCommission(temp).then((res) => {
                    console.log(res)
                    this.orderNoLoading = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('成功！')
                    } else {
                        this.$message.error(res.ret.errname)
                    }
                }).catch((err) => {
                    console.log(err)
                    this.orderNoLoading = false
                })
            },
            // Todo 根据订单佣金记录打钱
            confirmBackMoney () {
                this.$refs['commissionMoney'].validate((valid) => {
                    if (valid) {
                        this.moneyLoading = true

                        this.commissionMoney.param.orderNo = this.commissionMoney.param.orderNo.trim()
                        addMoneyByOrderNo(Object.assign(this.commissionMoney.param, {
                            commissionStatus: parseInt(this.commissionMoney.param.commissionStatus),
                            commissionType: parseInt(this.commissionMoney.param.commissionType)
                        })).then((res) => {
                            console.log(this.commissionMoney.param)
                            if (res.ret.errcode === 1) {
                                this.$message.success('成功')
                                this.moneyLoading = false
                                this.resetSearch()
                            } else {
                                Object.assign(this.commissionMoney.param, {
                                    commissionStatus: (this.commissionMoney.param.commissionStatus).toString(),
                                    commissionType: (this.commissionMoney.param.commissionType).toString()
                                })
                                this.moneyLoading = false
                            }
                        }).catch(err => {
                            console.log(err)
                            this.moneyLoading = false
                        })
                    }
                })
                // if (!this.commissionMoney.param.orderNo) {
                //     return this.$message.warning('用户ID不能为空')
                // }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-card {
        margin-bottom: 20px;
    }
</style>
