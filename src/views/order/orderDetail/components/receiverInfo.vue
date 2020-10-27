<template>
    <div>
        <el-form label-width="120px">
            <el-form-item label="收货人姓名：">{{ receiverInfo.receiverName }}</el-form-item>
            <el-form-item label="收货人电话：">{{ receiverInfo.receiverPhone }}</el-form-item>
            <el-form-item label="收货地址：">{{ receiverInfo.receiverAddress + ', ' + receiverInfo.cityCode + ', ' + receiverInfo.stateCode + ', ' + receiverInfo.postcode }}</el-form-item>
            <el-form-item label="用户备注：">{{receiverInfo.remark }}</el-form-item>
            <el-form-item>
                <el-button v-if="(orderInfo.orderStatus == 1 || orderInfo.orderStatus == 2) && hasPermission('BTN_ORDER_LIST_CHANGE_ADDRESS')"
                           @click="address.show = true" plain type="primary" size="mini">修改收货信息</el-button>
            </el-form-item>
        </el-form>
        <app-address v-if="address.show" :propParam="receiverInfo" :propShowDialog="address.show" @close="address.show = false"
                     :countryCode="orderInfo.countryCode" :orderNo="orderNo" @confirm="updateAddress"></app-address>
    </div>
</template>
<script>
    import { updateReceiverAddress } from '@/request/order.js'
    import appAddress from '@/components/addressSelect/appAddress'
    export default {
        props: {
            receiverInfo: Object,
            orderInfo: Object,
            orderNo: [String, Number]
        },
        components: {
            appAddress
        },
        data () {
            return {
                countryCode: 'MY',
                address: {
                    show: false
                }
            }
        },
        methods: {
            updateAddress (param) {
                updateReceiverAddress(Object.assign(param, {
                    orderId: this.orderNo
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.address.show = false
                        this.$emit('refresh')
                    }
                })
            }
        }
    }
</script>
