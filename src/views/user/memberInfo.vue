<template>
    <div class="app-container">
        <div class="filter-container">
            <el-tabs value="memberInfo" v-model="currentTab" @tab-click="handleTabClick">
                <el-tab-pane label="会员详情" name="memberInfo">
                    <basic-info :basicInfo="userInfo"></basic-info>
                    <member-active-info :memberActiveInfo="memberActiveInfo" class="active-info"></member-active-info>
                    <!-- <member-value-info></member-value-info> -->
                    <team-info :teamInfo="teamInfo" :chainList="chainList" class="active-info"></team-info>
                    <!-- <member-income-info></member-income-info> -->
                </el-tab-pane>
                <el-tab-pane label="团队成员列表" name="teamMemberList">
                    <team-member-list ref="teamMemberList"></team-member-list>
                </el-tab-pane>
                <el-tab-pane label="团队订单列表" name="teamOrderList">
                    <team-order-list ref="teamOrderList"></team-order-list>
                </el-tab-pane>
                <el-tab-pane label="收货地址列表" name="receivingAddressList">
                    <receiving-address-list ref="receivingAddressList"></receiving-address-list>
                </el-tab-pane>
                <el-tab-pane label="订单列表" name="orderList">
                    <order-list ref="orderList"></order-list>
                </el-tab-pane>
                <el-tab-pane label="银行卡信息列表" name="bankCardList">
                    <bank-card-list ref="bankCardList"></bank-card-list>
                </el-tab-pane>
                <el-tab-pane label="优惠券列表" name="couponList">
                    <coupon-list ref="couponList"></coupon-list>
                </el-tab-pane>
                <el-tab-pane label="收藏列表" name="favoriteList">
                    <favorite-list ref="favoriteList"></favorite-list>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { getUserManageInfo, getFatherChain } from '@/request/user'
    import basicInfo from './components/basicInfo'
    import memberActiveInfo from './components/memberActiveInfo'
    import memberValueInfo from './components/memberValueInfo'
    import teamInfo from './components/teamInfo'
    import memberIncomeInfo from './components/memberIncomeInfo'
    import teamMemberList from './tables/teamMemberList'
    import teamOrderList from './tables/teamOrderList'
    import receivingAddressList from './tables/receivingAddressList'
    import orderList from './tables/orderList'
    import bankCardList from './tables/bankCardList'
    import couponList from './tables/couponList'
    import favoriteList from './tables/favoriteList'

    export default {
        name: 'memberInfo',
        components: {
            basicInfo,
            memberActiveInfo,
            memberValueInfo,
            teamInfo,
            memberIncomeInfo,
            teamMemberList,
            teamOrderList,
            receivingAddressList,
            orderList,
            bankCardList,
            couponList,
            favoriteList
        },
        data() {
            return {
                currentTab: 'memberInfo',
                userInfo: {},
                userId: null,
                memberActiveInfo: [{
                    lastLoginTime: '-',
                    lastBuyTime: '-',
                    usedCoupon: '-',
                    hasCoupon: '-',
                    invalidCoupon: '-'
                }],
                teamInfo: {},
                chainList: []
            }
        },
        computed: {
            memberLevel() {
                return this.$store.state.dict.memberLevel
            }
        },
        created() {
            if (this.$route.query.userId) {
                this.userId = this.$route.query.userId
                this.getUserDetail()
                this.getFatherChainList()
            }
        },
        methods: {
            handleTabClick(tab) {
                switch (tab.name) {
                    case 'teamMemberList':
                        this.$refs['teamMemberList'].getTeamMemberList()
                        break
                    case 'receivingAddressList':
                        this.$refs['receivingAddressList'].getUserAddressList()
                        break
                    case 'orderList':
                        this.$refs['orderList'].getUserOrderList()
                        break
                    case 'bankCardList':
                        this.$refs['bankCardList'].getUserBankCardList()
                        break
                    case 'couponList':
                        this.$refs['couponList'].getUserCouponList()
                        break
                    case 'favoriteList':
                        this.$refs['favoriteList'].getUserProductCollectList()
                        break
                    default:
                        break
                }
            },
            // 获取用户信息
            getUserDetail() {
                let params = {
                    userId: this.userId
                }
                getUserManageInfo(params).then((response) => {
                    let res = response
                    this.userInfo = res.userManagePb
                    this.memberActiveInfo[0].lastLoginTime = res.userManagePb.lastLoginTime
                    this.memberActiveInfo[0].lastBuyTime = res.userManagePb.lastBuyTime
                    console.log(this.memberActiveInfo)
                }).catch((err) => {
                    console.error(err)
                })
            },
            getFatherChainList() {
                let params = {
                    userId: this.userId
                }
                getFatherChain(params).then((response) => {
                    let res = response
                    console.log(res)
                    this.chainList = res.userFatherPb
                    _.forEach(this.chainList, item => {
                        item.memberLevel = this.memberLevel[item.memberLevel]
                    })
                }).catch((err) => {
                    console.error(err)
                })
            }

        }
    }
</script>

<style lang="scss">
.el-tab-pane {
    padding: 10px;
}
</style>

<style lang="scss" scoped>
    .active-info {
        margin: 20px 0;
    }
</style>

