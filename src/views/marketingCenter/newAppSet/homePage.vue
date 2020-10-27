<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="banner列表" name="bannerList"></el-tab-pane>
            <el-tab-pane label="服务文案" name="serviceCopyList"></el-tab-pane>
            <el-tab-pane label="功能区" name="functionalAreaList"></el-tab-pane>
            <el-tab-pane label="腰封" name="girdleAdList"></el-tab-pane>
            <el-tab-pane label="营销Card" name="marketingCardList"></el-tab-pane>
            <el-tab-pane label="宫格" name="gongGeList"></el-tab-pane>
            <el-tab-pane label="平台广告位" name="platformAd"></el-tab-pane>
            <el-tab-pane label="广告Card" name="cardList"></el-tab-pane>
            <el-tab-pane label="首页商品列表" name="qyOptimization"></el-tab-pane>
            <el-tab-pane label="列表活动" name="productListAd"></el-tab-pane>
            <el-tab-pane label="弹屏广告" name="bombScreen"></el-tab-pane>
            <el-tab-pane label="营销浮窗" name="activitySwitch"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import bannerList from './components/bannerList'
    import serviceCopyList from './components/serviceCopyList'
    import functionalAreaList from './components/functionalAreaList'
    import girdleAdList from './components/girdleAdList1'
    import marketingCardList from './components/marketingCardList1'
    import gongGeList from './components/gongGeList'
    import platformAd from './components/girdleAdList2'
    import cardList from './components/marketingCardList2'
    import productListAd from './components/productListAd'
    import qyOptimization from './components/qyOptimization'
    import bottomIcon from './components/bottomIcon'
    import PSShopperBannerList from './components/PSShopperBannerList'
    import CustomCenterBannerList from './components/CustomCenterBannerList'
    import bombScreen from './components/bombScreen'
    import activitySwitch from './components/activitySwitch'

    export default {
        data () {
            return {
                currentView: 'bannerList'
            }
        },
        components: {
            bannerList,
            girdleAdList,
            marketingCardList,
            serviceCopyList,
            functionalAreaList,
            platformAd,
            productListAd,
            cardList,
            gongGeList,
            qyOptimization,
            bottomIcon,
            PSShopperBannerList,
            CustomCenterBannerList,
            bombScreen,
            activitySwitch
        },
        props: {
            countryList: Array,
            langList: Array
        },
    }
</script>
