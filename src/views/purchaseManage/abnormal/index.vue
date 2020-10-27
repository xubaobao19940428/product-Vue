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
    import { formatTime } from '@/js/common/filter'
    export default {
        data () {
            return {
                currentView: 'abnormalPackage',
                beginTime: '',
                endTime: ''
            }
        },
        created () {
            this.beginTime = this.$route.query.lastMonthDate===undefined?'':formatTime(this.$route.query.lastMonthDate)
            this.endTime = this.$route.query.nowEndDate===undefined?'':formatTime(this.$route.query.nowEndDate)
            if (this.beginTime !== '' || this.endTime !== '') {
                this.currentView = 'abnormalProduct'
            } else {
                this.currentView = 'abnormalPackage'
            }
        },
        components: {
            abnormalPackage,
            abnormalProduct
        }
    }
</script>
