<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="闪屏广告" name="screenAdList"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import screenAdList from './components/screenAdList'
    export default {
        data () {
            return {
                currentView: 'screenAdList'
            }
        },
        components: {
            screenAdList
        },
        props: {
            countryList: Array,
            langList: Array
        },
        methods: {}
    }
</script>
