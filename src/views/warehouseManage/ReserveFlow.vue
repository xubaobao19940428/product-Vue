<template>
    <div class="reserve-flow">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="平台库存" name="platform"></el-tab-pane>
            <el-tab-pane label="商家库存" name="merchant"></el-tab-pane>
        </el-tabs>
        <inventory-flow v-if="activeName === 'platform'"></inventory-flow>
        <stock-flow v-if="activeName === 'merchant'"></stock-flow>
    </div>
</template>
<script>
    import InventoryFlow from './InventoryFlow'
    import StockFlow from './StockFlow'

    export default {
        data () {
            return {
                activeName: 'platform'
            }
        },
        components: {
            InventoryFlow,
            StockFlow
        },
        created() {
            console.log(this.$route.params)
            if (this.$route.params.activeName) {
                this.activeName = this.$route.params.activeName
            }
        },
        methods: {
            handleClick () {

            }
        }
    }
</script>
<style lang="scss" scoped>
    .reserve-flow{
        height: 100%;
        overflow: scroll;
    }
</style>