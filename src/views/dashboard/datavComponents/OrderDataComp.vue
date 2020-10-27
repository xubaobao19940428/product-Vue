<template>
    <div class="order-data-comp-wrapper">
        <div class="top_md">
            <ul>
                <li >
                    <p class="title">今日总计</p>
                    <p class="money" v-if="orderData.today.totalGmv">${{orderData.today.totalGmv}}</p>
                    <p class="money" v-else>$0</p>
                    <p class="total" v-if="orderData.today.totalOrderNum">支付订单数{{orderData.today.totalOrderNum}}</p>
                </li>
                <li>
                    <p class="title">礼包数据</p>
                    <p class="money" v-if="orderData.gift.totalGmv">${{orderData.gift.totalGmv}}</p>
                    <p class="money" v-else>$0</p>
                    <p class="total" v-if="orderData.gift.totalOrderNum">支付订单数{{orderData.gift.totalOrderNum}}</p>
                </li>
                <li>
                    <p class="title">普货数据</p>
                    <p class="money" v-if="orderData.normal.totalGmv">${{orderData.normal.totalGmv}}</p>
                    <p class="money" v-else>$0</p>
                    <p class="total" v-if="orderData.normal.totalOrderNum">支付订单数{{orderData.normal.totalOrderNum}} {{'($'+orderData.normal.totalPricePerOrder+')'}}</p>
                </li>
            </ul>
            <div class="order-data">
                <progress-item :barData="barData" ref="setProgressData"></progress-item>
            </div>
        </div>
        <div class="bottom_md">
            <div class="MY-bottom"></div>
            <span>马来西亚</span>
            <div class="TH-bottom"></div>
            <span>泰国</span>
            <div class="SG-bottom"></div>
            <span>新加坡</span>
        </div>
    </div>
</template>

<script>
    import ProgressItem from './ProgressItem.vue'
    import InfoItem from './InfoItem.vue'

    export default {
        props: {
            orderData: {
                type: Object,
                default: () => {
                    return {
                        today: {
                            totalGmv: '1',
                            totalOrderNum: ''
                        },
                        gift: {
                            totalGmv: '1',
                            totalOrderNum: ''
                        },
                        normal: {
                            totalGmv: '1',
                            totalOrderNum: '',
                            totalPricePerOrder: ''
                        }
                    }
                }
            },
            barData: {
                type: Object,
                default: () => {
                    return {
                        MYdata: [],
                        THdata: [],
                        SGdata: []
                    }
                }
            }
        },
        data () {
            return {

            }
        },
        components: {
            ProgressItem,
            InfoItem
        },
        watch: {
            // barData:{
            //     handler(newVal, oldVal) {

            //     },
            //     deep: true
            // }
        },
        methods: {
            // setOption(){
            //     this.$refs['setProgressData'].setOption()
            // }
        }
    }
</script>

<style lang="scss" scoped>
    .order-data-comp-wrapper {
        height: 100%;
        width: 100%;
        display:flex;
        flex-direction: column;
        font-size:14px;
        position:relative;
        .top_md{
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            ul{
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                margin-right: 0.15rem;
                li{
                    width:1.9rem;
                    height:1.13rem;
                    padding:.145rem 0 .145rem .115rem;
                    box-sizing: border-box;
                    background:url('../../../assets/images/header_left_banner.png');
                    background-size: 100% 100%;
                    p[class="title"]{
                        font-size:.18rem;
                    }
                    p[class="money"]{
                        font-size:.3rem;
                        margin:.115rem 0;
                        color:#00ebff;
                    }
                    p[class="total"]{
                        font-size:.18rem;
                        color:#00EBFF;
                    }
                }
            }
            .order-data{
                flex: 1;
                height: 100%;
            }
        }
        .bottom_md{
            box-sizing: border-box;
            padding: 0.25rem 0;
            display: flex;
            justify-content: center;
            align-items: center;
            .MY-bottom{
                width:.15rem;
                height:.15rem;
                background:#13ce8c;
                display:inline-block;
            }
            .TH-bottom{
                width:.15rem;
                height:.15rem;
                background:#fac167;
                display:inline-block;
            }
            .SG-bottom{
                width:.15rem;
                height:.15rem;
                background:#f17f88;
                display:inline-block;
            }
            span{
                font-size:.15rem;
                display:inline-block;
                margin:0 .1rem;
                vertical-align: top;
            }
        }

    }
</style>
