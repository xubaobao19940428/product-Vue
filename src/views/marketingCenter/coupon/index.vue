<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="优惠券管理" name="couponManage"></el-tab-pane>
            <el-tab-pane label="优惠券包管理" name="couponPackageManage"></el-tab-pane>
            <el-tab-pane label="商品返券" name="returnTicket"></el-tab-pane>
            <el-tab-pane label="用券限制" name="couponLimit"></el-tab-pane>
            <el-tab-pane label="优惠券查询" name="couponSearch"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import couponManage from './components/couponManage'
    import couponPackageManage from './components/couponPackageManage'
    import couponSearch from './components/couponSearch'
    import returnTicket from './components/returnTicket'
    import couponLimit from './components/couponLimit'
    export default {
        data () {
            return {
                currentView: 'couponManage'
            }
        },
        components: {
            couponManage,
            couponPackageManage,
            couponSearch,
            returnTicket,
            couponLimit
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            langList () {
                return this.$store.state.dict.languageList
            }
        },
        methods: {}
    }
</script>
