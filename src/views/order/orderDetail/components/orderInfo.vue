<template>
    <div class="order-info-wrapper">
        <div>
            <div><span>订单编号：</span>{{ orderNo }}</div>
            <div><span>订单国家：</span>{{ orderInfo.countryCode | countryFilter }}</div>
            <div><span>订单状态：</span>{{ orderInfo.orderStatus | statusFilter }}</div>
            <div><span>订单类型：</span>{{ orderInfo.orderType | orderTypeFilter }}</div>
            <div><span>配送方式：</span>快递 <el-button class="mar-l-10" v-if="orderInfo.orderStatus == 1 && hasPermission('BTN_ORDER_LIST_CHANGE_DELIVERY')" @click="changeDelivery()" plain type="primary" size="mini">改为自提</el-button></div>
            <div><span>下单时间：</span>{{ orderInfo.createTime | formatTime }}</div>
            <div><span>支付时间：</span>{{ orderInfo.payTime | formatTime }}</div>
            <div><span>收货时间：</span>{{ orderInfo.receiveTime | formatTime }}</div>
        </div>
        <div>
            <div><span>订单总价：</span>{{ orderInfo.currency + ' ' + orderInfo.totalAmount }}</div>
            <div><span>积分抵扣：</span>{{ orderInfo.currency + ' ' + orderInfo.usePoints }}</div>
            <div><span>实付金额：</span>{{ orderInfo.paied ? (orderInfo.paiedCurrency + ' ' + orderInfo.paied) : '-'}}</div>
            <div><span>支付交易号：</span>{{ orderInfo.transCode || '-' }}</div>
            <div><span>支付方式：</span>{{ payWay[orderInfo.payWay] || '-' }}</div>
            <div><span>支付商户：</span>{{ orderInfo.paySupplier || '-'  }}</div>
        </div>
        <div>
            <div><span>买家账号：</span>{{ orderInfo.nickname }}({{ orderInfo.userId }})</div>
            <div><span>买家等级：</span>{{ userLevel[orderInfo.userLevel] }}</div>
            <div><span>上级账号：</span>{{ orderInfo.parentId ? ( orderInfo.parentNick  + '(' + orderInfo.parentId +  ') ') : '-'}}</div>
            <div><span>上级等级：</span>{{ orderInfo.parentLevel ? userLevel[orderInfo.parentLevel] : '-' }}</div>
        </div>
    </div>
</template>
<script>
    import { changeToBuyers } from '@/request/order.js'
    export default {
        props: {
            orderInfo: Object,
            orderNo: [String, Number],
            userLevel: Object
        },
        data () {
            return {
                payWay: {
                    1: 'molpay',
                    2: '积分支付',
                    3: '信用卡支付',
                    4: 'omise',
                    5: 'OnlineBanking',
                    6: 'COD',
                    7: '组合支付'
                }
            }
        },
        methods: {
            changeDelivery () {
                changeToBuyers({
                    orderId: this.orderNo
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('自提成功')
                        this.$emit('refresh')
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .order-info-wrapper{
        display: flex;
        >div{
            flex: 1;
            color: #555;
            font-size: 15px;
            span{
                width: 100px;
                text-align: right;
            }
            >div{
               margin-top: 20px;
                display: flex;
                align-items: center;
            }

        }
    }
</style>
