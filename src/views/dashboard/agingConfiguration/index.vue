<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="超时时效" name="timeout">
                <timeout-aging v-if="activeName === 'timeout'"></timeout-aging>
            </el-tab-pane>
            <el-tab-pane label="物流时效" name="logistics">
                <logistics-aging v-if="activeName === 'logistics'"></logistics-aging>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import logisticsAging from './components/logisticsAging'
    import timeoutAging from './components/timeoutAging'

    export default {
        data () {
            return {
                activeName: 'timeout'
            }
        },
        components: {
            logisticsAging,
            timeoutAging
        },
        methods: {
            handleClick (val) {
                console.log(val)
                this.activeName = val.name
            }
        }
    }
</script>
<style lang="less" scoped>

</style>