<template>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="board-tab">
        <!-- <el-tab-pane label="拼团订单数据" name="order"></el-tab-pane> -->
        <el-tab-pane label="拼团数据看板" name="board">
            <data-board :dataHouseCrux="dataHouseCrux" :dataHouseProduct="dataHouseProduct" :dataHouseCountry="dataHouseCountry"></data-board>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import dataBoard from './components/dataBoard'
    import { GetDataCenterTypeData } from '@/request/dataBoard'
    export default {
        data() {
            return {
                activeName:'board',
                dataHouseCrux: [],
                dataHouseCountry: [],
                dataHouseProduct: []
            }
        },
        components: {
            dataBoard
        },
        mounted() {
            this.getDataCenterTypeData()
        },
        methods: {
            handleClick (val) {
                console.log(val)
            },
            getDataCenterTypeData () {
                let params = {}
                GetDataCenterTypeData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.dataHouseCrux = res.dataHouseConfig[0].dataHouseComponent[0].dataHouseItemConfig[1].dataHouseItemConfig
                        this.dataHouseCountry = res.dataHouseConfig[0].dataHouseComponent[0].dataHouseItemConfig[0].dataHouseItemConfig
                        this.dataHouseProduct = res.dataHouseConfig[0].dataHouseComponent[0].dataHouseItemConfig[0].dataHouseItemConfig
                        console.log(this.dataHouseCrux,this.dataHouseProduct)
                    }
                })
            }
        },
    }
</script>
<style lang="scss" scoped>
    .board-tab{
        overflow: scroll;
    }
</style>