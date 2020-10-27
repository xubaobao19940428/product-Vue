<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="闪屏广告" name="screenAdList"></el-tab-pane>
            <el-tab-pane label="弹屏广告" name="bombScreen"></el-tab-pane>
            <el-tab-pane label="营销浮窗" name="activitySwitch"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import screenAdList from './components/screenAdList'
    import bombScreen from './components/bombScreen'
    import activitySwitch from './components/activitySwitch'
    export default {
        data () {
            return {
                currentView: 'screenAdList'
            }
        },
        components: {
            screenAdList,
            bombScreen,
            activitySwitch
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
