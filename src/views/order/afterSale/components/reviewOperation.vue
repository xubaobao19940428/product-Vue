<template>
    <el-container class="review-operate">
        <el-container>
            <el-aside width="500px">
                <div class="aside-title">售后单</div>
                <div class="aside-top">
                    <div class="module"><div class="top-name">售后单号：</div><div>{{ refundId }}</div></div>
                    <div class="module"><div class="top-name">售后类型：</div><div>{{ afterType[refundData.afterType] }}</div></div>
                    <div class="module"><div class="top-name">发货状态：</div><div>{{ suborderStatus[(refundData.orderStatus)] }}</div></div>
                    <div class="module"><div class="top-name">退款金额：</div><div class="pricess">{{refundData.currency}}{{ refundData.refundAmount }}（含运费{{refundData.refundFreight}}）</div></div>
                    <div class="module"><div class="top-name">退款原因：</div><div>{{ refundData.refundReason }}</div></div>
                    <div class="module"><div class="top-name">申请时间：</div><div>{{ refundData.applyTime }}</div></div>
                </div>
                <div class="aside-mid">
                    <div class="aside-mid-top">
                        <img :src="refundData.afterSaleProduct && dealShowFileSrc(refundData.afterSaleProduct.picture)" />
                        <div class="product-content">
                            <div class="product-id">商品ID：{{ refundData.afterSaleProduct && refundData.afterSaleProduct.productId }}</div>
                            <div class="profuct-name">{{ refundData.afterSaleProduct && refundData.afterSaleProduct.title }}</div>
                            <div class="product-attr">
                                <div v-if="refundData.afterSaleProduct && refundData.afterSaleProduct.attr && refundData.afterSaleProduct.attr.length !== 0">{{ refundData.afterSaleProduct.attr[0].valueLabel}}</div>
                                <div class="product-num">售后数量：{{refundData.afterSaleProduct && refundData.afterSaleProduct.refundNum}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="aside-mid-bottom">
                        <div>
                            <span class="top-name">销售单价：</span><span>{{ refundData.afterSaleProduct && refundData.afterSaleProduct.saleCurrency }}{{refundData.afterSaleProduct && refundData.afterSaleProduct.salePrice}}</span>
                        </div>
                        <div>
                            <span class="top-name">实付单价：</span><span>{{ refundData.afterSaleProduct && refundData.afterSaleProduct.paidCurrency }}{{refundData.afterSaleProduct && refundData.afterSaleProduct.price}}</span>
                        </div>
                    </div>
                </div>
                <div class="aside-bottom">
                    <div class="module"><div class="top-name">子单状态：</div><div>{{ suborderStatus[refundData.suborderStatus] }}</div></div>
                    <div class="module"><div class="top-name">子单编号：</div><div>{{ refundData.suborderId }}</div></div>
                    <div class="module"><div class="top-name">订单编号：</div><div>{{ refundData.orderId }}</div></div>
                    <div class="module"><div class="top-name">支付时间：</div><div>{{ refundData.payTime || '-' }}</div></div>
                    <div class="module"><div class="top-name">发货时间：</div><div>{{ refundData.deliveryTime || '-' }}</div></div>
                    <div class="module"><div class="top-name">物流公司：</div><div>{{ refundData.expressName || '-' }}</div></div>
                    <div class="module"><div class="top-name">物流单号：</div><div>{{ refundData.expressNo || '-'}}</div></div>
                </div>
            </el-aside>
            <el-container>
            <el-main>
                <after-sale-status v-if="refund" :refund="refund" @on-comfirm="onConfirm"></after-sale-status>
            </el-main>
            <el-footer class="footer">
                <div class="footer-title">协商历史</div>
                <div class="footer-content">
                    <div v-for="(item,index) in refundData.historyItem" :key="index" class="history">
                        <div class="item-title">
                            <div class="item-mark">{{ refundData.historyItem.length - index  }}</div>
                            <div>{{ item.title }}</div>
                        </div>
                        <div v-if="item.operateTime" class="operate-time">{{ item.operateTime | secondTimeFormat }}</div>
                        <div v-for="(val,index) in item.historyEntry" :key="index" class="entry">
                            {{val}}
                        </div>
                        <div v-if="item.picture.length!==0" class="certificate">
                            <div class="entry">售后凭证：</div>
                            <div v-for="(pic,index) in item.picture" :key="index">
                                <img :src="dealShowFileSrc(pic)" />
                            </div>
                        </div>   
                    </div>
                </div>
            </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
    import { AfterSaleInfo } from '@/request/afterSale'
    import afterSaleStatus from './afterSaleStatus'
    import moment from 'moment'

    export default {
        data () {
            return{
                refundId:'',
                afterType: {
                    7: '仅退款',
                    1: '退货退款'
                },
                refundStatus: {
                    1: '待审核',
                    2: '审核中',
                    3: '待退款',
                    4: '已退款',
                    5: '已取消',
                    6: '已驳回'
                },
                suborderStatus: {
                    0: '待支付',
                    1: '待发货',
                    2: '待收货',
                    3: '交易成功',
                    4: '交易关闭',
                    5: '部分发货'
                },
                refundData: {},
                refund: {
                    refundType: '',
                    refundAmount: '',
                    refundFreight: '',
                    refundBankName: '',
                    refundCardNo: '',
                    refundCardholder: '',
                    userId: '',
                    currency: '',
                    status: '',
                    suborderId: '',
                    skuId: '',
                    refundProductAmount: '',
                    mobile: '',
                    email: ''
                }
            }
        },
        components: {
            afterSaleStatus
        },
        created() {
            this.refundId = this.$route.query.refundId
            
        },
        mounted() {
            // this.refundId = this.$route.query.refundId
            this.getAfterSaleInfo()
        },
        methods: {
            getAfterSaleInfo () {
                let params = {
                    refundId: this.refundId
                }
                // debugger
                AfterSaleInfo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.refundData = Object.assign(res,{
                            applyTime: moment(Number(res.applyTime)).format('YYYY-MM-DD HH:mm:ss'),
                            payTime: moment(Number(res.payTime)).format('YYYY-MM-DD HH:mm:ss'),
                            deliveryTime: moment(Number(res.deliveryTime)).format('YYYY-MM-DD HH:mm:ss')
                        })
                        // this.refundData = res
                        console.log(this.refundData)
                        Object.assign(this.refund,{
                            refundType: res.refundType,
                            refundAmount: res.refundAmount,
                            refundFreight: res.refundFreight,
                            refundBankName: res.refundBankName,
                            refundCardNo: res.refundCardNo,
                            refundCardholder: res.refundCardholder,
                            userId: res.userId,
                            currency: res.currency,
                            refundId: this.refundId,
                            status: this.refundStatus[res.refundStatus],
                            refundStatus: res.refundStatus,
                            suborderId: res.suborderId,
                            orderId: res.orderId,
                            skuId: res.afterSaleProduct.skuId,
                            currency:res.currency,
                            refundProductAmount: res.refundProductAmount,
                            mobile: res.mobile,
                            email: res.email
                        })
                        console.log(this.refund)
                    }
                })
            },
            onConfirm () {
                this.getAfterSaleInfo()
                // location.reload()
            }
        }
    }
</script>
<style lang="scss">
    .review-operate{
        .el-main{
            padding: 0px;
            margin-left: 10px;
            margin-bottom: 10px;
            background-color: #fff;
        }
        .el-aside{
            background-color: #fff;
        }
        .el-footer{
            padding: 0px;
            background-color: #fff;
        }
    }
</style>
<style lang="scss" scoped>
    .review-operate{
        background-color: rgb(237,239,242);
        .aside-title{
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 16px;
            background-color: rgb(214,214,214);
        }
        .aside-top,.aside-bottom{
            border-bottom: 1px dashed rgb(239,239,239);
            .module{
                display: flex;
                width: 400px;
                margin: 15px 0 15px 50px;
            }
            .top-name{
                width: 85px;
                font-weight: 300;
            }
            .pricess{
                color: rgb(207,38,67);
            }
        }
        .aside-mid{
            border-bottom: 1px dashed rgb(239,239,239);
            .aside-mid-top{
                display: flex;
                margin-top: 20px;
                img{
                    width: 100px;
                    margin-left: 50px;
                }
                .product-content{
                    margin-left: 10px;
                    margin-right: 50px;
                }
                .product-id,.profuct-name{
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: rgb(82,82,82);
                }
                .product-attr{
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                }
                .product-num{
                    color: rgb(82,82,82);
                }
            }
            .aside-mid-bottom{
                width: 400px;
                margin-left: 50px;
                margin-top: 20px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                color: rgb(82,82,82);
                font-size: 14px;
            }
        }
        .history{
            padding: 20px 0px 0px 40px;
            border-bottom: 1px dashed rgb(239,239,239);
        }
        .item-title{
            display: flex;
            margin-bottom: 10px;
        }
        .item-mark{
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 50%;
            text-align: center;
            background-color: black;
            color: #fff;
        }
        .operate-time,.entry{
            min-width: 80px;
            margin: 10px 0px 10px 20px;
        }
        .certificate{
            display: flex;
            width: 100%;
            overflow-x: scroll;
            img{
                width: 50px;
                margin-right: 20px;
            }
        }
        .footer{
            position: relative;
            height: 300px !important;
            margin-left: 10px;
            overflow: scroll;
            .footer-title{
                position: fixed;
                width: calc(100% - 698px);
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 16px;
                background-color: rgb(214,214,214);
            }
            .footer-content{
                height: 370px;
                margin-top: 30px;
                font-weight: 300;
            }
        }
        
    }
</style>