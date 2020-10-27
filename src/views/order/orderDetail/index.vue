<template>
    <div class="app-container">
        <div>
            <el-card class="info-card">
                <c-order-progress :orderNo="orderNo"></c-order-progress>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>订单信息</div>
                <c-order-info :orderInfo="orderInfo" :orderNo="orderNo" @refresh="getOrderDetail" :userLevel="userLevel"></c-order-info>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>商品信息</div>
                <c-product-info :productInfo="productInfo" :orderInfo="orderInfo"></c-product-info>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>子单信息</div>
                <c-order-sub :orderNo="orderNo"></c-order-sub>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>收货信息</div>
                <c-receiver-info @refresh="getOrderDetail" :receiverInfo="receiverInfo" :orderInfo="orderInfo" :orderNo="orderNo" ></c-receiver-info>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>积分信息</div>
                <c-points-info :pointsInfo="pointsInfo" :userLevel="userLevel"></c-points-info>
            </el-card>
        </div>
    </div>
</template>
<script>
    import { viewOrderDetail } from '@/request/order.js'
    import cOrderInfo from './components/orderInfo'
    import cProductInfo from './components/productInfo'
    import cReceiverInfo from './components/receiverInfo'
    import cPointsInfo from './components/pointsInfo'
    import cOrderProgress from './components/orderProgress'
    import cOrderSub from './components/orderSub'
    // import Vue from 'vue'
    Vue.filter('orderTypeFilter', function (status) {
        switch (status) {
            case 0: return '普通商品订单'
            case 1: return '小礼包商品订单'
            case 2: return '大礼包商品订单'
            case 4: return '拼团订单'
            case 5: return '直播订单'
            case 8: return '虚拟商品订单'
            case 9: return '批发商品订单'
            case 10: return '微商商品订单'
        }
        return ''
    })
    export default {
        components: { cOrderInfo, cProductInfo, cReceiverInfo, cPointsInfo, cOrderProgress, cOrderSub },
        data () {
            return {
                orderInfo: {
                    totalAmount: '',
                    usePoints: '',
                    nickname: '',
                    userId: '',
                    orderStatus: '',
                    paied: '',
                    userLevel: '',
                    orderType: '',
                    transCode: '',
                    parentNick: '',
                    parentId: '',
                    parentLevel: '',
                    payWay: '',
                    createTime: '',
                    paySupplier: '',
                    payTime: '',
                    receiveTime: '',
                    paiedCurrency: '',
                    currency: ''
                },
                productInfo: {
                    productItem: [],
                    totalPrice: '',
                    coupon: '',
                    promotion: '',
                    payable: ''
                },
                receiverInfo: {
                    receiverName: '',
                    receiverPhone: '',
                    receiverAddress: '',
                    remark: '',
                    cityCode: '',
                    stateCode: '',
                    postcode: ''
                },
                pointsInfo: {
                    title: [],
                    skuPointsInfo: [],
                    pointsVerticalSum: [],
                    pointsHorizontalSum: []
                },
                orderNo: ''
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            userLevel () {
                return this.$store.state.user.userLevel
            }
        },
        created () {
            this.orderNo = this.$route.query.orderNo ? this.$route.query.orderNo : ''
            this.getOrderDetail()
        },
        methods: {
            getOrderDetail () {
                viewOrderDetail({
                    orderId: this.orderNo
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        Object.assign(this.orderInfo, res.orderInfo)
                        Object.assign(this.productInfo, res.productInfo)
                        Object.assign(this.receiverInfo, res.receiverInfo)
                        Object.assign(this.pointsInfo, res.pointsInfo)
                    }
                })
            }
        }
    }
</script>
