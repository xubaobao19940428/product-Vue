<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="会员中心banner" name="CustomCenterBannerList"></el-tab-pane>
            <el-tab-pane label="服务与工具" name="ServiceToolsList"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import CustomCenterBannerList from './components/CustomCenterBannerList'
    import ServiceToolsList from './components/ServiceToolsList'

    export default {
        data () {
            return {
                currentView: 'CustomCenterBannerList'
            }
        },
        components: {
            CustomCenterBannerList,
            ServiceToolsList
        },
        props: {
            countryList: Array,
            langList: Array
        },
        methods: {}
    }
</script>
