<template>
    <div class="app-container">
        <el-tabs v-model="curView" type="card">
            <el-tab-pane v-for="item in countryList"
                :key="item.code"
                :label="item.nameCn"
                :name="item.nameEn"
            >
                <country-win-prize
                    v-if="curView === item.nameEn"
                    :nameCn="item.nameCn"
                    :countryCode="item.shortCode"
                    :currencyUnit="item.currencyUnit"
                ></country-win-prize>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import countryWinPrize from './countryWinPrize'
export default {
    data () {
        return {
            curView: 'Malaysia'
        }
    },
    components: {
        countryWinPrize
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        }
    }
}
</script>