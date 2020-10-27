<template>
    <div class="shake-page app-container">
        <el-tabs v-model="countryCode" @tab-click="handleCountryChange">
            <el-tab-pane v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :name="item.shortCode">
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="curView" type="card" @tab-click="handleTabChange">
            <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.name" :name="item.value"></el-tab-pane>
            <gold-exchange v-if="curView == 'goldExchange'" ref="goldExchange" :countryCode="countryCode"></gold-exchange>
        </el-tabs>
    </div>
</template>

<script>
    import goldExchange from './goldExchange'
    export default {
        data () {
            return {
                propShow: false,
                curView: 'goldExchange',
                tabList: [{
                    value: 'goldExchange',
                    name: '商城设置'
                }],
                countryCode: 'MY',
                updateLoading: false,
                pointsUrl: '',
                shakeGoldExchange: '',
                shakeWithdraw: '',
                switchStatus: 'close',
                threshold: 0
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        components: {
            goldExchange
        },
        mounted () {
            this.handleCountryChange()
        },
        methods: {
            // 国家切换
            handleCountryChange (val) {
                this.handleTabChange()
            },
            // 切换tab
            handleTabChange () {
                this.$nextTick(() => {
                    switch (this.curView) {
                        case 'goldExchange':
                            this.$refs.goldExchange.getList()
                            break
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
.shake-page {
    .use-point-box {
        display: flex;
        border: 1px solid #dedede;
        padding: 8px 0;
        align-items: center;
        justify-content: center;
    }
}
</style>
