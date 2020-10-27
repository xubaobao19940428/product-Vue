<template>
    <div class="app-container">
        <el-tabs v-model="curView" type="card">
            <el-tab-pane v-for="item in countryList"
                :key="item.code"
                :label="item.nameCn"
                :name="item.nameEn"
            >
                <country-prize-order
                    v-if="curView === item.nameEn"
                    :nameCn="item.nameCn"
                    :countryCode="item.shortCode"
                ></country-prize-order>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import countryPrizeOrder from './countryPrizeOrder'
export default {
    data () {
        return {
            curView: 'Malaysia'
        }
    },
    components: {
        countryPrizeOrder
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        }
    }
}
</script>