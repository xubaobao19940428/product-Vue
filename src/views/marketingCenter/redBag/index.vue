<template>
    <div class="app-container">
        <el-tabs v-model="currentView" type="card">
            <el-tab-pane 
                v-for="item in countryList"
                :key="item.code"
                :label="item.nameCn"
                :name="item.shortCode"
            >   
                <country-red-bag 
                    v-if="currentView === item.shortCode"
                    :nameCn="item.nameCn"
                    :countryCode="item.shortCode" :currencyUnit="item.currencyUnit"></country-red-bag>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import countryRedBag from './components/countryRedBag.vue'
export default {
    components: {
        countryRedBag
    },
    data () {
        return {
            currentView: 'MY'
        }
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        }
    },
    created () {
        let query = this.$route.query || {}
        this.currentView = query.currentView || 'MY'

    }
}
</script>