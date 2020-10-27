<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="平台地址" name="platformAddress"></el-tab-pane>
            <el-tab-pane label="物流公司地址" name="logisticsAddress"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import platformAddress from './components/platformAddress'
    import logisticsAddress from './components/logisticsAddress'
    export default {
        data () {
            return {
                currentView: 'platformAddress'
            }
        },
        components: {
            platformAddress,
            logisticsAddress
        },
        computed: {
            countryList () {
                let countryList = this.$store.state.dict.countryList
                let item = countryList.find((val) => {
                    return val.shortCode == 'CN'
                })
                if (!item) {
                    countryList.push({
                        nameCn: '中国',
                        nameLocal: '中国',
                        shortCode: 'CN'
                    })
                }
                return countryList
            },
            langList () {
                return this.$store.state.dict.languageList
            }
        },
        methods: {}
    }
</script>
