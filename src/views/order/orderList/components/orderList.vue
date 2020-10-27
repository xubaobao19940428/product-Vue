<template>
    <div class="main-content-wrapper order-list">
        <div class="order-item-wrapper" v-for="(order, orderI) in dataList" :key="orderI">
            <div class="order-header-wrapper">
                <div class="header-l-box">
                    <img :src="getCountryImg(order.countryCode)">
                    <span>NO: {{ order.orderId }}</span>
                </div>
                <div class="border-lr header-center-box">
                    <span>创建：{{ order.createTime | formatTime }}</span>
                    <span>支付：{{ order.payTime | formatTime }}</span>
                </div>
                <div class="header-r-box">{{ order.status | statusFilter }}</div>
            </div>
            <el-table :header-cell-style="{background:'#f2f2f2',color:'#606266'}"
                      :span-method="({ row, column, rowIndex, columnIndex }) => { return objectSpanMethod({ row, column, rowIndex, columnIndex, order }) }"
                      :data="order.productItem">
                <el-table-column label="商品信息" min-width="320px" header-align="center">
                    <template slot-scope="scope">
                        <div class="product-info">
                            <div class="flex">
                                <el-popover placement="top-start" trigger="hover">
                                    <img :src="dealShowFileSrc(scope.row.productSnap.skuCover)" class="previewImage">
                                    <img :src="dealShowFileSrc(scope.row.productSnap.skuCover)" class="thumbnail" slot="reference">
                                </el-popover>
                            </div>
                            <div class="product-detail">
                                <div class="product-id">
                                    <span>商品ID：{{ scope.row.productSnap.productId }}</span>
                                    <img v-for="(item, i) in scope.row.productSnap.activity"
                                         :key="orderI + '-' + scope.$index + '-activity' + i" :src="dealShowFileSrc(item.icon)"/>
                                </div>
                                <div class="product-name">{{ scope.row.productSnap.productName }}</div>
                                <!--服务模板-->
                                <el-tooltip placement="top" v-if="scope.row.productSnap.arrivalPledge.length > 0 || scope.row.productSnap.afterPledge.length > 0">
                                    <div slot="content">
                                        <div class="service-wrapper">
                                            <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.afterPledge" :key="orderI + '-' + scope.$index + '-afterPledge' + i">{{ item.label }}</span>
                                            <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.arrivalPledge" :key="orderI + '-' +scope.$index + '-arrivalPledge' + i">{{ item.label }}</span>
                                        </div>
                                    </div>
                                    <div class="service-wrapper">
                                        <span v-for="(item, i) in scope.row.productSnap.afterPledge" :key="orderI + '-' + scope.$index + '-afterPledge' + i">{{ item.label }}</span>
                                        <span v-for="(item, i) in scope.row.productSnap.arrivalPledge" :key="orderI + '-' +scope.$index + '-arrivalPledge' + i">{{ item.label }}</span>
                                    </div>
                                </el-tooltip>
                                <!--促销优惠券-->
                                <el-tooltip placement="top" v-if="scope.row.productSnap.promotion.length > 0 || scope.row.productSnap.coupon.length > 0">
                                    <div slot="content">
                                        <div class="promotion-coupon-wrapper">
                                            <div class="promotion" v-if="scope.row.productSnap.promotion.length > 0">
                                                <em>促销</em>
                                                <div>
                                                    <span class="mar-r-10 pointer" v-for="(item, i) in scope.row.productSnap.promotion" @click="triggerToPromotion(item.promotionId)" :key="orderI + '-' + scope.$index + '-promotion' + i">{{ item.label }}</span>
                                                </div>
                                            </div>
                                            <div class="coupon" v-if="scope.row.productSnap.coupon.length > 0">
                                                <em>用劵</em>
                                                <div>
                                                    <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.coupon" :key="orderI + '-' + scope.$index + '-coupon' + i">{{ item.label }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="promotion-coupon-wrapper">
                                        <div class="promotion" v-if="scope.row.productSnap.promotion.length > 0">
                                            <em>促销</em>
                                        </div>
                                        <div class="coupon" v-if="scope.row.productSnap.coupon.length > 0">
                                            <em>用劵</em>
                                        </div>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="规格" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <div>skuId：{{ scope.row.productSnap.skuId }}</div>
                        <div>
                               <span v-for="(attr, attrI) in scope.row.productSnap.attr"
                                     :key="orderI + '-' + attrI">{{ attr.attrLabel + '：' + attr.valueLabel }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.productSnap.num }}</div>
                    </template>
                </el-table-column>
                <el-table-column :label="'售价' + (order.payCurrency ? order.payCurrency : '')" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.productSnap.price }}</div>
                    </template>
                </el-table-column>
                <el-table-column :label="'实付单价' + (order.payCurrency ? order.payCurrency : '')" width="100px" align="center">
                    <template slot-scope="scope">
                        <div>{{ order.status ? scope.row.productSnap.payable : '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="子单编号" align="center">
                    <template slot-scope="scope">
                        <div v-for="(subOrder, subOrderI) in scope.row.suborderItem" :key="orderI + '-' + subOrderI" class="sub-order-wrapper">
                            <el-tooltip placement="top">
                                <div slot="content">
                                    <div>{{ subOrder.suborderId}}</div>
                                    <div v-if="subOrder.splitType === 'SHOP_DIRECT'">商家直邮</div>
                                    <div v-else>{{ subOrder.warehouseName}}</div>
                                </div>
                                <div>
                                    <div>{{ subOrder.suborderId}}</div>
                                    <div v-if="subOrder.splitType === 'SHOP_DIRECT'">商家直邮</div>
                                    <div v-else>{{ subOrder.warehouseName}}</div>
                                </div>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="子单状态" header-align="center">
                    <template slot-scope="scope">
                        <div v-for="(subOrder, subOrderI) in scope.row.suborderItem"
                             :key="orderI + '-' + subOrderI" class="sub-order-wrapper">{{ subOrder.status | statusFilter }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="售后状态" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.productSnap.dataVersion === 0">{{ scope.row.productSnap.afterStatus === -1 ? '无售后':'有售后' }}</div>
                            <div v-if="scope.row.productSnap.dataVersion === 1">
                                <div v-if="scope.row.productSnap.afterStatus === -1">无售后</div>
                                <router-link v-else  target="_blank" :to="{ name:'afterSale',query:{ refundId: scope.row.productSnap.afterId }}">
                                    <div class="have-after-sale">有售后</div>
                                </router-link>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                        <div class="table-action-btn-box">
                            <router-link target="_blank" v-if="hasPermission('BTN_ORDER_LIST_DETAIL')"
                                         :to="{ name:'orderDetail',query:{ orderNo: order.orderId }}">
                                <el-button plain type="primary" size="mini">订单详情</el-button>
                            </router-link>
                            <router-link target="_blank" v-if="hasPermission('BTN_ORDER_LIST_AFTER_SALE') && order.orderType !== 8"
                                         :to="{ name:'orderAfterSale',query:{ orderId: order.orderId }}">
                                <el-button plain type="primary" size="mini">发起售后</el-button>
                            </router-link>
                            <el-button v-if="order.status == 1 && hasPermission('BTN_ORDER_LIST_PURCHASE_DETAIL')" @click="triggerToTrackDetail(order)" plain type="primary" size="mini">采购追踪</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="order-bottom-wrapper">
                <div class="l-box">
                    <div><span>买家账号：</span><em>{{ (order.username ? ('昵称: ' + order.username) : '') + ' ID: ' + order.userId }}</em><i v-if="order.userLevel">{{ userLevel[order.userLevel] }}</i></div>
                    <div><span>上级账号：</span>
                        <template v-if="order.userParentId && order.userParentName">
                            <em>{{ (order.userParentName ? ('昵称: ' + order.userParentName) : '') + ' ID: ' + order.userParentId }}</em>
                            <i v-if="order.userParentLevel">{{ userLevel[order.userParentLevel] }}</i>
                        </template>
                    </div>
                </div>
                <div class="center-box border-lr">
                    <div><span>实付金额：</span><em>{{ (order.payCurrency ? order.payCurrency : '') + ' ' + order.paied }}</em></div>
                    <div><span>订单运费：</span><em>{{ (order.payCurrency ?  order.payCurrency : '') + ' ' + order.freight }}</em></div>
                    <div><span>促销优惠：</span><em>{{ getTotalDiscount(order, 'promotionInfo') }}</em></div>
                    <div><span>积分抵扣：</span><em>{{ (order.currency ? order.currency : '') + ' ' + order.usePoints }}</em></div>
                    <div><span>用券优惠：</span><em v-for="(item, i) in order.couponInfo" :key="i">{{ '[' + item.couponId + ']' + item.label }}</em></div>
                </div>
                <div class="r-box">
                    <div>
                        <span>收货信息：</span>
                        <el-tooltip placement="top" :content="order.receiverName + '/' + order.receiverPhone + '/' + order.receiverAddress + ', ' + order.cityCode + ', ' + order.stateCode + ', ' +  order.postcode">
                            <em>{{ order.receiverName + '/' + order.receiverPhone + '/' + order.receiverAddress  + ', ' + order.cityCode + ', ' + order.stateCode + ', ' +  order.postcode }}</em>
                        </el-tooltip>
                    </div>
                    <div><span>买家备注：</span><em>{{ order.remark }}</em></div>
                    <div>
                        <span>客服备注：</span>
                        <template v-if="hasPermission('BTN_ORDER_LIST_MARKS')">
                            <em v-if="!order.editFlg" @click="showInput(orderI)">{{ order.remarkBack ? order.remarkBack : '+ 备注' }}</em>
                            <el-input v-else class="input-new-tag flex1" ref="saveTagInput" size="small"
                                      v-model="inputValue"
                                      @keyup.enter.native="handleInputConfirm(orderI, 'enter')"
                                      @blur="handleInputConfirm(orderI)">
                            </el-input>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <purchase-track v-if="trackInfo.show" :trackInfo="trackInfo" :propShowDialog="trackInfo.show" @close="trackInfo.show = false"></purchase-track>
    </div>
</template>
<script>
    import { addOrderRemark } from '@/request/order.js'
    import purchaseTrack from '../../components/purchaseTrack'
    export default {
        props: {
            countryList: Array,
            userLevel: Object,
            propData: Array
        },
        data () {
            return {
                inputValue: '',
                dataList: this.propData,
                trackInfo: {
                    show: false,
                    orderNo: '',
                    receiverName: '',
                    receiverPhone: '',
                    status: '',
                    createTime: '',
                    payTime: ''
                }
            }
        },
        components: {
            purchaseTrack
        },
        watch: {
            propData: {
                handler (data) {
                    this.dataList = data
                },
                deep: true
            }
        },
        methods: {
            haveAfterSale (orderId,skuId) {
                this.$router.push({
                    name: 'afterSale',
                    query:{
                        orderId,
                        skuId
                    }
                })
            },
            getTotalDiscount (data, key) {
                let count = 0
                if (data[key]) {
                    for (let i = 0; i < data[key].length; i++) {
                        count += parseFloat(data[key][i].discountAmount)
                    }
                }
                return count.toFixed(2)
            },
            triggerToTrackDetail (data) {
                Object.assign(this.trackInfo, {
                    orderNo: data.orderId,
                    receiverName: data.receiverName,
                    receiverPhone: data.receiverPhone,
                    status: data.status,
                    createTime: data.createTime,
                    payTime: data.payTime,
                    show: true
                })
            },
            getCountryImg (code) {
                let item = this.countryList.find((val) => {
                    return val.shortCode == code
                })
                return item ? this.dealShowFileSrc(item.image) : ''
            },
            objectSpanMethod ({ row, column, rowIndex, columnIndex, order }) {
                if (columnIndex === 8) {
                    return {
                        rowspan: order.productItem.length,
                        colspan: 1
                    }
                }
            },
            triggerToPromotion (id) {
                this.$router.push({
                    name: 'promotionList',
                    query: {
                        promotionId: id
                    }
                })
            },
            handleInputConfirm (index, type) {
                if (type == 'enter') {
                    this.dataList[index].editFlg = false
                    return
                }
                addOrderRemark({
                    orderId: this.dataList[index].orderId,
                    remark: this.inputValue
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList[index].remarkBack = JSON.parse(JSON.stringify(this.inputValue))
                        this.dataList[index].editFlg = false
                        this.inputValue = ''
                    }
                })
            },
            showInput (index) {
                this.dataList[index].editFlg = true
                this.inputValue = JSON.parse(JSON.stringify(this.dataList[index].remarkBack))
            },
            triggerToOderDetail (order) {
                this.$router.push({
                    name: 'orderDetail',
                    query: {
                        orderNo: order.orderId
                    }
                })
            },
            triggerToOderAfterSale (order) {
                this.$router.push({
                    name: 'orderAfterSale',
                    query: {
                        orderId: order.orderId
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    .order-list{
        .order-search-param{
            .el-form-item{
                width: 50%!important;
            }
            .select-item{
                width: 150px!important;
                margin-right: 10px;
            }
            .el-input, .el-range-editor.el-input__inner{
                max-width: 300px;
            }
        }
        .hover-row {
            background: none !important;
            td:hover {
                background: none !important;
            }
            td {
                background: none !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .main-content-wrapper{
        background: #f0f2f5;
        overflow: auto;
    }
    .order-item-wrapper{
        border: 1px solid #EBEEF5;
        background: #fff;
        color: #666;
        margin-bottom: 10px;
        .have-after-sale{
            color: #409EFF;
            cursor: pointer;
        }
        .border-lr{
            border-left: 1px solid #EBEEF5;
            border-right: 1px solid #EBEEF5;
        }
        .order-header-wrapper{
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            >div{
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                padding: 0 10px;
                height: 100%;
                img{
                    height: 20px;
                    margin-right: 15px;
                }
                span{
                    margin-right: 20px;
                }
            }
            .header-l-box{
                flex: none;
                width: 300px;
            }
            .header-center-box{
                flex: 1.4;
            }
            .header-r-box{
                flex: 1;
            }
        }
        .gray{
            color: #666;
        }
        .sub-order-wrapper{
            border-top: 1px solid #EBEEF5;
            height: 46px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >div{
                width: 100%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .sub-order-wrapper:nth-child(1) {
            border-top: 0;
        }
        .product-info{
            width: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            font-size: 14px;
            box-sizing: border-box;
            padding: 10px 0;
            .product-detail{
                flex: 1;
                margin-left: 10px;
                overflow: hidden;
                line-height: 30px;
                .product-id{
                    display: flex;
                    align-items: center;
                    img{
                        width: 30px;
                        display: flex;
                        margin-left: 10px;
                    }
                }
                .product-name{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .service-wrapper{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #d9001bd8;
                    span{
                        margin-right: 10px;
                    }
                }
                .promotion-coupon-wrapper{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 30px;
                    .promotion, .coupon{
                        display: flex;
                        align-items: center;
                        flex: 1;
                        max-width: 150px;
                        height: 100%;
                        overflow: hidden;
                        em{
                            background: #fd9a38;
                            color: #fff;
                            box-sizing: border-box;
                            padding: 0 5px;
                            height: 100%;
                        }
                        >div{
                            flex: 1;
                            height: 100%;
                            display: inline-block;
                            vertical-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            border: 1px solid #fd9a38;
                            color: #fd9a38;
                        }
                        span{
                            margin-left: 4px;
                        }
                    }
                    .coupon{
                        margin-left: 10px;
                        >div{
                            border: 1px solid #e30326;
                            color: #e30326;
                        }
                        em{
                            background: #e30326;
                        }
                    }
                }
            }
        }
        .order-bottom-wrapper{
            width: 100%;
            display: flex;
            font-size: 14px;
            >div{
                box-sizing: border-box;
                padding: 10px 10px 0;
            }
            em{
                font-weight: normal;
                color: #606266;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            span{
                color: #999;
            }
            .l-box, .center-box, .r-box {
                overflow: hidden;
                >div{
                    margin-bottom: 10px;
                }
            }
            .l-box{
                flex: none;
                width: 300px;
                i{
                    display: inline-block;
                    font-size: 12px;
                    color: #A30014;
                    border: 1px solid #A30014;
                    border-radius: 10px;
                    box-sizing: border-box;
                    padding: 4px 10px;
                    margin-left: 10px;
                }
            }
            .center-box{
                flex: 1.4;
                display: flex;
                flex-wrap: wrap;
                >div{
                    min-width: 50%;
                }
            }
            .r-box{
                flex: 1;
                >div{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    em{
                        flex: 1;
                    }
                }
            }
        }
    }
</style>
