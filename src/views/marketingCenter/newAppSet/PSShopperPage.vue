<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="PS店铺banner" name="PSShopperBannerList"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import PSShopperBannerList from './components/PSShopperBannerList'

    export default {
        data () {
            return {
                currentView: 'PSShopperBannerList'
            }
        },
        props: {
            countryList: Array,
            langList: Array
        },
        components: {
            PSShopperBannerList
        },
        methods: {}
    }
</script>
