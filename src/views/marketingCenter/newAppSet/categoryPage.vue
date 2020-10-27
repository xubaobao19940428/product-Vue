<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="类目运营" name="categoryOperation"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import categoryOperation from './components/categoryOperation'

    export default {
        data () {
            return {
                currentView: 'categoryOperation'
            }
        },
        components: {
            categoryOperation
        },
        props: {
            countryList: Array,
            langList: Array
        },
        methods: {}
    }
</script>
