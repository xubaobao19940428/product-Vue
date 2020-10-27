<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="售后政策" name="afterSale"></el-tab-pane>
            <el-tab-pane label="到货承诺" name="arrivalPromise"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :showType="showType"></component>
        </keep-alive>
    </div>
</template>
<script>
    import afterSale from './components/afterSale'
    import arrivalPromise from './components/arrivalPromise'
    export default {
        data () {
            return {
                currentView: 'afterSale',
                showType: {
                    1: '只外显于商品详情页',
                    2: '全部外显',
                    3: '不外显'
                },
                address: {
                    show: true,
                    countryCode: 'MY'
                }
            }
        },
        components: {
            afterSale,
            arrivalPromise
        },
        methods: {}
    }
</script>
