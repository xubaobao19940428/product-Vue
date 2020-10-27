<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="异常包裹" name="abnormalPackage"></el-tab-pane>
            <el-tab-pane label="异常商品" name="abnormalProduct"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView"></component>
        </keep-alive>
    </div>
</template>
<script>
    import abnormalPackage from './abnormalPackage'
    import abnormalProduct from './abnormalProduct'
    export default {
        data () {
            return {
                currentView: 'abnormalPackage'
            }
        },
        components: {
            abnormalPackage,
            abnormalProduct
        }
    }
</script>
