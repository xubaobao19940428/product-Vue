<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="底部图标" name="bottomIcon"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import bottomIcon from './components/bottomIcon'

    export default {
        data () {
            return {
                currentView: 'bottomIcon'
            }
        },
        components: {
            bottomIcon
        },
        props: {
            countryList: Array,
            langList: Array
        },
        methods: {}
    }
</script>
