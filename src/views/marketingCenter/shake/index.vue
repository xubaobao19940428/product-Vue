<template>
    <div class="shake-page app-container">
        <el-tabs v-model="countryCode" @tab-click="handleCountryChange">
            <el-tab-pane v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :name="item.shortCode">
            </el-tab-pane>
        </el-tabs>
        <el-form inline>
            <el-form-item label="金币兑换：">
                <div class="flex">
                    <el-input v-model="shakeGoldExchange" style="width: 300px;"></el-input> <el-button class="mar-l-10"  @click="saveShakeGoldExchange">保存</el-button>
                </div>
            </el-form-item>
            <el-form-item label="">
                <el-button icon="el-icon-refresh"
                           :loading="updateLoading"
                           @click="updatePrizePool"
                           class="operator-item"
                           type="primary"
                           plain
                >
                    更新数据
                </el-button>
            </el-form-item>
        </el-form>
        <el-form inline>
            <el-form-item label="shop跳转：">
                <div class="flex">
                    <el-input v-model="pointsUrl" style="width: 300px;"></el-input> <el-button class="mar-l-10" @click="savePointsUrl">保存</el-button>
                </div>
            </el-form-item>
        </el-form>
        <el-form inline>
            <el-form-item label="withdraw跳转：">
                <div class="flex">
                    <el-input v-model="shakeWithdraw" style="width: 300px;"></el-input> <el-button class="mar-l-10"  @click="saveShakeWithdraw">保存</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="mar-b-10">
            <span>摇一摇开关：</span>
            <el-switch
                style="margin-right: 10px"
                v-model="switchStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="open"
                inactive-value="close"
                @change="changeSwitchState">
            </el-switch>
        </div>
        <el-tabs v-model="curView" type="card" @tab-click="handleTabChange">
            <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.name" :name="item.value"></el-tab-pane>
            <show-product v-if="curView == 'showProduct'" ref="showProduct" :countryCode="countryCode"></show-product>
            <gold-exchange v-else-if="curView == 'goldExchange'" ref="goldExchange" :countryCode="countryCode"></gold-exchange>
            <prize-product v-else-if="curView == 'prizeProduct'" ref="prizeProduct" :countryCode="countryCode"></prize-product>
            <result-setting v-else-if="curView == 'resultSetting'" ref="resultSetting" :countryCode="countryCode"></result-setting>
            <match-setting v-else-if="curView == 'matchSetting'" :countryCode="countryCode" ref="matchSetting"></match-setting>
            <diversion v-else :countryCode="countryCode" ref="diversion" :propShow="propShow"></diversion>
        </el-tabs>
    </div>
</template>

<script>
    import { addTriggerUrl, fetchTriggerUrl, bonusPoolsUpdate } from '@/api/shake.js'
    import showProduct from './showProduct'
    import resultSetting from './resultSetting'
    import prizeProduct from './prizeProduct'
    import matchSetting from './matchSetting'
    import goldExchange from './goldExchange'
    import diversion from './diversion'
    export default {
        data () {
            return {
                propShow:false,
                curView: 'showProduct',
                tabList: [{
                    value: 'showProduct',
                    name: '展示商品'
                }, {
                    value: 'goldExchange',
                    name: '商城设置'
                }, {
                    value: 'prizeProduct',
                    name: '中奖商品'
                }, {
                    value: 'resultSetting',
                    name: '奖励配置'
                }, {
                    value: 'matchSetting',
                    name: '比赛配置'
                },
                {
                    value: 'diversion',
                    name: '导流'
                }],
                countryCode: 'MY',
                updateLoading: false,
                pointsUrl: '',
                shakeGoldExchange: '',
                shakeWithdraw: '',
                switchStatus: 'close',
                threshold: 0
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        components: {
            showProduct,
            resultSetting,
            prizeProduct,
            matchSetting,
            goldExchange,
            diversion
        },
        mounted () {
            this.handleCountryChange()
        },
        created () {
            let query = this.$route.query || {}
            if (query.curTab) {
                this.curView = query.curTab
            }
        },
        methods: {
            // 国家切换
            handleCountryChange (val) {
                this.handleTabChange()
                this.getTriggerUrl()
                this.getGoldExchangeUrl()
                this.getShakeWithdraw()
                this.getSwitchState()
            },
            // 更新奖池
            updatePrizePool () {
                this.updateLoading = true
                bonusPoolsUpdate({
                    countryCode: this.countryCode
                }).then((res) => {
                    this.updateLoading = false
                    if (res.ret.errCode === 0) {
                        this.$message.success('更新成功')
                    }
                }).catch(() => {
                    this.updateLoading = false
                })
            },
            // 切换tab
            handleTabChange () {
                this.$nextTick(() => {
                    switch (this.curView) {
                        case 'showProduct':
                            this.$refs.showProduct.getList()
                            break
                        case 'goldExchange':
                            this.$refs.goldExchange.getList()
                            break
                        case 'prizeProduct':
                            this.$refs.prizeProduct.getList()
                            break
                        case 'resultSetting':
                            this.$refs.resultSetting.getList()
                            break
                        case 'matchSetting':
                            this.$refs.matchSetting.getList()
                            break
                        case 'diversion':
                             this.propShow = true
                             this.$refs.diversion.getData()
                    }
                })
            },
            // shop跳转
            getTriggerUrl () {
                this.pointsUrl = ''
                fetchTriggerUrl({
                    keyword: 'shakePointsUrl' + this.countryCode
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.pointsUrl = res.data.value
                    }
                })
            },
            savePointsUrl () {
                addTriggerUrl({
                    keyword: 'shakePointsUrl' + this.countryCode,
                    value: this.pointsUrl
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.$message.success('保存成功')
                    }
                })
            },
            // 金币兑换
            getGoldExchangeUrl () {
                this.shakeGoldExchange = ''
                fetchTriggerUrl({
                    keyword: 'shakeGoldExchange' + this.countryCode
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.shakeGoldExchange = res.data.value
                    }
                })
            },
            saveShakeGoldExchange () {
                addTriggerUrl({
                    keyword: 'shakeGoldExchange' + this.countryCode,
                    value: this.shakeGoldExchange
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.$message.success('保存成功')
                    }
                })
            },
            // 开关
            changeSwitchState () {
                addTriggerUrl({
                    keyword: 'shakeSwitch' + this.countryCode,
                    value: this.switchStatus
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.$message.success('保存成功')
                    }
                })
            },
            getSwitchState () {
                fetchTriggerUrl({
                    keyword: 'shakeSwitch' + this.countryCode
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.switchStatus = res.data.value
                    }
                })
            },
            // withdraw跳转
            getShakeWithdraw () {
                this.shakeWithdraw = ''
                fetchTriggerUrl({
                    keyword: 'shakeWithdraw' + this.countryCode
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.shakeWithdraw = res.data.value
                    }
                })
            },
            saveShakeWithdraw () {
                addTriggerUrl({
                    keyword: 'shakeWithdraw' + this.countryCode,
                    value: this.shakeWithdraw
                }).then((res) => {
                    if (res.ret.errCode === 0) {
                        this.$message.success('保存成功')
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
.shake-page {
    .use-point-box {
        display: flex;
        border: 1px solid #dedede;
        padding: 8px 0;
        align-items: center;
        justify-content: center;
    }
}
</style>
