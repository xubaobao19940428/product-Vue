<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane label="对接发货" name="dockingShipment"></el-tab-pane>
            <el-tab-pane label="普通发货" name="ordinaryDelivery"></el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component v-bind:is="currentView" :countryList="countryList" :langList="langList"></component>
        </keep-alive>
    </div>
</template>
<script>
    import dockingShipment from './components/dockingShipment'
    import ordinaryDelivery from './components/ordinaryDelivery'
    export default {
        data () {
            return {
                currentView: 'dockingShipment'
            }
        },
        components: {
            dockingShipment,
            ordinaryDelivery
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
