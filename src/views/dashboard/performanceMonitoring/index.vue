<template>
    <div class="app-container">
        <div class="perfromce">
            <el-card class="item-card perfromce-component"><user-order></user-order></el-card>
            <el-card class="item-card perfromce-component"><outbound-order></outbound-order></el-card>
            <el-card class="item-card perfromce-component"><supplier-invoice></supplier-invoice></el-card>
            <el-card class="item-card perfromce-component"><purchase-tracke></purchase-tracke></el-card>
        </div>
    </div>
</template>
<script>
    import userOrder from './components/userOrder/userOrder'
    import outboundOrder from './components/outboundOrder/index'
    import supplierInvoice from './components/supplierInvoice/index'
    import purchaseTracke from './components/purchaseTracke/index'

    export default {
        data () {
            return {
                
            }
        },
        components: {
            userOrder,
            outboundOrder,
            supplierInvoice,
            purchaseTracke
        }
    }
</script>
<style lang="less" scoped>
    .perfromce{
        .perfromce-component{
            margin-bottom: 20px;
        }
    }
</style>