<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="返佣" name="commission" v-if="hasPermission('TAB_USER_MANAGE_RAKE_BACK')">
                <commission></commission>
            </el-tab-pane>
<!--            <el-tab-pane label="分佣查询" name="commissionRecord" v-if="hasPermission('TAB_USER_MANAGE_SUB_COMMISSION')" >-->
<!--                <commission-record ref="commissionRecord"></commission-record>-->
<!--            </el-tab-pane>-->
<!--            <el-tab-pane label="收支记录" name="userIncomeRecord" v-if="hasPermission('TAB_USER_MANAGE_SUB_USER_INCOME')">-->
<!--                <user-income-record ref="userIncomeRecord"></user-income-record>-->
<!--            </el-tab-pane>-->
<!--            <el-tab-pane label="支付信息" name="payInfoSearch" v-if="hasPermission('TAB_USER_MANAGE_PAY_INFO')">-->
<!--                <pay-info-search></pay-info-search>-->
<!--            </el-tab-pane>-->
<!--            v-if="hasPermission('BTN_USER_CHANGE_COUNTRY')"-->
            <el-tab-pane label="补积分" name="addPoint" v-if="hasPermission('TAB_USER_MANAGE_ADD_POINT')">
                <add-point ref="addPoint" @on-submit="addMoney"></add-point>
            </el-tab-pane>
            <el-tab-pane label="绑定关系" name="bind">
                <unbind-relation ref="unbindRelation" @on-submit="bindDisconnect" v-if="hasPermission('BTN_USER_MANAGE_DISCONNECT')" class="card-item"></unbind-relation>
                <bind-relation  ref="bindRelation" @on-submit="bindChange" v-if="hasPermission('BTN_USER_MANAGE_BIND')"></bind-relation>
            </el-tab-pane>
            <el-tab-pane label="预设等级" name="setUserLevel">
                <set-user-level v-if="hasPermission('BTN_USER_MANAGE_SET_USER_LEVEL')" ref="setUserLevel" @on-submit="setUserLevel" class="card-item"></set-user-level>
            </el-tab-pane>
            <el-tab-pane label="触发升级" name="upLevel" v-if="hasPermission('TAB_USER_MANAGE_UPLEVEL')">
                <div>
                    <el-form label-width="80px">
                        <el-form-item label="注意:">
                            <span style="color: red">只触发升AM、AT失败的用户!!!</span>
                         </el-form-item>
                        <el-form-item label="用户ID：">
                            <el-input style="width: 200px; margin-right: 20px;" v-model="pushUpLevel.userId" size="medium"></el-input>
                            <el-button type="primary" @click="publishUplevelEvent" size="medium" :loading="upLevelLoading">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="注销手机号" name="userMobile">
                <remove-mobile @on-submit="removeUserMobile" ref="removeMobile" v-if="hasPermission('BTN_USER_MANAGE_REMOVE_MOBILE')" class="card-item"></remove-mobile>
                <resetMobile @on-submit="setUserMobile" ref="resetMobile" v-if="hasPermission('BTN_USER_MANAGE_RESET_MOBILE')"></resetMobile>
            </el-tab-pane>
            <el-tab-pane label="发送验证码" name="sendCode" v-if="hasPermission('TAB_USER_MANAGE_SEND_CODE')">
                <send-code></send-code>
            </el-tab-pane>
            <el-tab-pane label="批量注册" name="batchRegister" v-if="hasPermission('TAB_USER_MANAGE_BATCH_REGISTER')">
                <batch-register ref="batchRegister"></batch-register>
            </el-tab-pane>
            <el-tab-pane label="修改用户国家" name="changeCountry" v-if="hasPermission('BTN_USER_CHANGE_COUNTRY')">
                <change-country  ref="changeCountry" @on-submit="changeCountry" class="card-item" ></change-country>
            </el-tab-pane>
            <!-- <el-tab-pane label="修改fingoMaster" name="modifyMentorInfo">
               <modify-mentor-info v-if="hasPermission('BTN_USER_MANAGE_UPDATE_FINGO_INFO')"
                    ref="modifyMentorInfo"
                    @on-submit="confirmUpdateFingoInfo"></modify-mentor-info>
            </el-tab-pane> -->
            <el-tab-pane label="下载团队统计" name="downloadTeamStatistics" v-if="hasPermission('BTN_DOWNLOAD_TEAM_STATISTICS')">
                <download-team-statistics   class="card-item" ></download-team-statistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getStore } from '@/utils/storage'
    import { removeUserMobile, updateUserMobile, publishUpgradeEvent, bindDisconnect, bindChange, addMoney, uplevel, updateFingoMasterInfo, ChangeUserCountry } from '@/request/user'
    import list from '@/mixins/List'
    import { multiply } from '@/js/common/filter'
    import commission from './extendFunction/commission'
    import commissionRecord from './extendFunction/commissionRecord'
    import userIncomeRecord from './extendFunction/userIncomeRecord'
    import payInfoSearch from './extendFunction/payInfoSearch'
    import removeMobile from './extendFunction/removeMobile'
    import resetMobile from './extendFunction/resetMobile'
    import unbindRelation from './extendFunction/unbindRelation'
    import bindRelation from './extendFunction/bindRelation'
    import addPoint from './extendFunction/addPoint'
    import setUserLevel from './extendFunction/setUserLevel'
    import changeCountry from './extendFunction/changeCountry'
    import modifyMentorInfo from './extendFunction/modifyMentorInfo'
    import BatchRegister from './extendFunction/BatchRegister'
    import downloadTeamStatistics from './extendFunction/downloadTeamStatistics'
    import SendCode from './sendCode'

    export default {
        data () {
            return {
                activeTab: 'commission',
                upLevelLoading: false,
                addPoint: {
                    userId: '',
                    amount: 0,
                    memo: ''
                },
                addPointRules: {
                    userId: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                    amount: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                    memo: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }]
                },
                pushUpLevel: {
                    userId: ''
                }
            }
        },
        components: {
            commission,
            commissionRecord,
            userIncomeRecord,
            payInfoSearch,
            removeMobile,
            resetMobile,
            unbindRelation,
            bindRelation,
            addPoint,
            setUserLevel,
            changeCountry,
            modifyMentorInfo,
            BatchRegister,
            SendCode,
            downloadTeamStatistics
        },
        methods: {
            handleTabClick (tab) {
                let tabName = tab.name
                switch (tabName) {
                    case 'commissionRecord':
                        this.$refs.commissionRecord.orderCommissionQuery()
                        break
                    case 'userIncomeRecord':
                        this.$refs.userIncomeRecord.getUserIncomeList()
                        break
                }
            },
            // 断绑
            bindDisconnect (user) {
                let param = {
                    userId: user.userId,
                    operator: this.account
                }
                bindDisconnect(param).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('断绑成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.$refs.unbindRelation.setEnable()
                }, (err) => {
                    this.$refs.unbindRelation.setEnable()
                })
            },
            // 绑定
            bindChange (data) {
                data.account = this.account
                let param = data
                bindChange(param).then((response) => {
                    this.$refs.bindRelation.setEnable()
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('绑定成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                }, (err) => {
                    this.$refs.bindRelation.setEnable()
                })
            },
            // 注销手机号
            removeUserMobile (param) {
                let params = {
                    mobile: param.mobile,
                    countryAreaCode: param.countryAreaCode,
                    operator: this.account
                }
                removeUserMobile(params).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('注销成功')
                    }
                    this.$refs.removeMobile.confirmLoading = false
                }).catch((err) => {
                    this.$refs.removeMobile.confirmLoading = false
                    console.error(err)
                })
            },
            // 重新设置手机号
            setUserMobile (param) {
                updateUserMobile(param).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('绑定成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.$refs.resetMobile.confirmLoading = false
                }).catch((err) => {
                    console.error(err)
                    this.$refs.resetMobile.confirmLoading = false
                })
            },
            // 手动触发升级
            publishUplevelEvent () {
                if (!this.pushUpLevel.userId) {
                    return this.$message.warning('用户ID不能为空')
                }
                this.upLevelLoading = true
                let params = {
                    userId: this.pushUpLevel.userId,
                    operator: this.account
                }
                publishUpgradeEvent(params).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('升级成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.upLevelLoading = false
                }).catch((err) => {
                    this.upLevelLoading = false
                    console.log(err)
                })
            },
            // 补积分
            addMoney (param) {
                param.amount = param.amount + ''
                param.operator = this.account
                addMoney(param).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('补积分成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.$refs.addPoint.setEnable()
                }).catch((err) => {
                    console.log(err)
                    this.$refs.addPoint.setEnable()
                })
            },
            // 预设等级
            setUserLevel (param) {
                uplevel(param).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('预设等级成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.$refs.setUserLevel.setLoading()
                }).catch((err) => {
                    console.log(err)
                    this.$refs.setUserLevel.setLoading()
                })
            },
            // 修改国家
            changeCountry (param) {
                ChangeUserCountry(param).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('修改用户国家成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.$refs.changeCountry.setLoading()
                }).catch((err) => {
                    console.log(err)
                    this.$refs.changeCountry.setLoading()
                })
            },
            // 修改导师信息
            confirmUpdateFingoInfo (info) {
                let params = {
                    fingoMasterInfo: info
                }
                updateFingoMasterInfo(params).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('修改导师信息成功')
                    } else {
                        this.$message.error('ErrorCode:' + res.ret)
                    }
                    this.$refs.modifyMentorInfo.setLoading()
                }).catch((err) => {
                    console.log(err)
                    this.$refs.modifyMentorInfo.setLoading()
                })
            }
        },
        created () {
            let userInfo = JSON.parse(getStore('adminUserInfo'))
            this.account = userInfo.account
        }
    }
</script>

<style lang="scss" scoped>
    .card-item {
        margin-bottom: 20px
    }
    .page-wrapper {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
</style>
