<template>
    <div>
        <el-table :header-cell-style="{background:'#f2f2f2',color:'#606266'}"
                  border
                  :data="productInfo.productItem">
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
                                     :key="scope.$index + '-activity' + i" :src="dealShowFileSrc(item.icon)"/>
                            </div>
                            <div class="product-name">{{ scope.row.productSnap.productName }}</div>
                            <!--服务模板-->
                            <el-tooltip placement="top" v-if="scope.row.productSnap.afterPledge.length > 0 || scope.row.productSnap.arrivalPledge.length >0">
                                <div slot="content">
                                    <div class="service-wrapper">
                                        <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.afterPledge" :key="scope.$index + '-afterPledge' + i">{{ item.label }}</span>
                                        <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.arrivalPledge" :key="scope.$index + '-arrivalPledge' + i">{{ item.label }}</span>
                                    </div>
                                </div>
                                <div class="service-wrapper">
                                    <span v-for="(item, i) in scope.row.productSnap.afterPledge" :key="scope.$index + '-afterPledge' + i">{{ item.label }}</span>
                                    <span v-for="(item, i) in scope.row.productSnap.arrivalPledge" :key="scope.$index + '-arrivalPledge' + i">{{ item.label }}</span>
                                </div>
                            </el-tooltip>
                            <!--促销优惠券-->
                            <el-tooltip placement="top" v-if="scope.row.productSnap.promotion.length > 0 || scope.row.productSnap.coupon.length > 0">
                                <div slot="content">
                                    <div class="promotion-coupon-wrapper">
                                        <div class="promotion" v-if="scope.row.productSnap.promotion.length > 0">
                                            <em>促销</em>
                                            <div>
                                                <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.promotion" :key="scope.$index + '-promotion' + i">{{ item.label }}</span>
                                            </div>
                                        </div>
                                        <div class="coupon" v-if="scope.row.productSnap.coupon.length > 0">
                                            <em>用劵</em>
                                            <div>
                                                <span class="mar-r-10" v-for="(item, i) in scope.row.productSnap.coupon" :key="scope.$index + '-coupon' + i">{{ item.label }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="promotion-coupon-wrapper">
                                    <div class="promotion" v-if="scope.row.productSnap.promotion.length > 0">
                                        <em>促销</em>
                                        <div>
                                            <span v-for="(item, i) in scope.row.productSnap.promotion" :key="scope.$index + '-promotion' + i">{{ item.label }}</span>
                                        </div>
                                    </div>
                                    <div class="coupon" v-if="scope.row.productSnap.coupon.length > 0">
                                        <em>用劵</em>
                                        <div>
                                            <span v-for="(item, i) in scope.row.productSnap.coupon" :key="scope.$index + '-coupon' + i">{{ item.label }}</span>
                                        </div>
                                    </div>
                                </div>
                            </el-tooltip>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" min-width="100px" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.productSnap.skuId }}</div>
                    <div>
                               <span v-for="(attr, attrI) in scope.row.productSnap.attr"
                                     :key="attrI">{{ attr.attrLabel + '：' + attr.valueLabel }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="数量" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.productSnap.num }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="'销售单价' + orderInfo.currency" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.productSnap.price }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="'用劵优惠' + orderInfo.currency" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.productSnap.couponDiscount }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="'促销优惠' + orderInfo.currency" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.productSnap.promotionDiscount }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="'实付单价' + orderInfo.currency" width="100px" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.productSnap.payable }}</div>
                </template>
            </el-table-column>
            <el-table-column label="子单编号" align="center">
                <template slot-scope="scope">
                    <div v-for="(subOrder, subOrderI) in scope.row.suborderItem" :key="subOrderI" class="sub-order-wrapper">
                        <div>{{ subOrder.suborderId}}</div>
                        <div>{{ subOrder.warehouseName}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="子单状态" header-align="center">
                <template slot-scope="scope">
                    <div v-for="(subOrder, subOrderI) in scope.row.suborderItem"
                         :key="subOrderI" class="sub-order-wrapper">{{ subOrder.status | statusFilter }}</div>
                </template>
            </el-table-column>
            <el-table-column label="售后状态" align="center">
                <template slot-scope="scope">
                    <div>{{  scope.row.productSnap.afterStatus | afterStatusFilter }}</div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100px" align="center">
                <template slot-scope="scope">
                    <div class="table-action-btn-box">
                        <el-button @click="triggerToLogistics()" plain type="primary" size="mini">查看物流</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="product-footer">
            <div>商品总价：{{ orderInfo.currency + ' ' +  productInfo.totalPrice }}</div>
            <div>总用券优惠：{{ productInfo.coupon }}</div>
            <div>总促销优惠：{{ orderInfo.currency + ' ' +  productInfo.promotion }}</div>
            <div>实付金额：{{ orderInfo.paiedCurrency + ' ' + orderInfo.paied }}(含运费)</div>
            <div>{{ orderInfo.orderStatus | statusFilter }}</div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            productInfo: Object,
            orderInfo: Object
        },
        methods: {
            triggerToLogistics () {}
        }
    }
</script>
<style lang="scss" scoped>
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
    .product-footer{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border: 1px solid #EBEEF5;
        border-top: 0;
        >div{
            box-sizing: border-box;
            padding: 20px 40px;
            border-left: 1px solid #EBEEF5;
        }
    }
</style>
