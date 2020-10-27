<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="banner列表" name="bannerList"></el-tab-pane>
            <el-tab-pane label="PS店铺banner" name="PSShopperBannerList"></el-tab-pane>
            <el-tab-pane label="会员中心banner" name="CustomCenterBannerList"></el-tab-pane>
            <el-tab-pane label="服务文案" name="serviceCopyList"></el-tab-pane>
            <el-tab-pane label="功能区" name="functionalAreaList"></el-tab-pane>
            <el-tab-pane label="腰封管理" name="girdleAdList"></el-tab-pane>
            <el-tab-pane label="营销Card" name="marketingCardList"></el-tab-pane>
            <el-tab-pane label="宫格" name="gongGeList"></el-tab-pane>
            <el-tab-pane label="平台广告位" name="platformAd"></el-tab-pane>
            <el-tab-pane label="广告Card" name="cardList"></el-tab-pane>
            <el-tab-pane label="首页商品列表" name="qyOptimization"></el-tab-pane>
            <el-tab-pane label="列表活动" name="productListAd"></el-tab-pane>
            <el-tab-pane label="类目运营" name="categoryOperation"></el-tab-pane>
            <el-tab-pane label="底部图标" name="bottomIcon"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import { getCountryList } from '@/request/i18n'
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
    import categoryOperation from './components/categoryOperation'
    import bottomIcon from './components/bottomIcon'
    import PSShopperBannerList from './components/PSShopperBannerList'
    import CustomCenterBannerList from './components/CustomCenterBannerList'
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
            categoryOperation,
            bottomIcon,
            PSShopperBannerList,
            CustomCenterBannerList
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            langList () {
                return this.$store.state.dict.languageList
            }
        },
        created() {
            this.getCountryList()
        },
        methods: {
            // 获取国家数据字典
            getCountryList() {
                let params = {
                    pageSize: 100,
                    pageNum: 1
                }
                getCountryList(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.setStore("countryList", res.countryInfo)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
        }
    }
</script>
