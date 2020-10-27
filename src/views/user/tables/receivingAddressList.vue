<template>
    <div class="app-container">
        <div class="table-list">
            <el-table v-loading="loading" border :data="dataList" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="addressId" label="收货地址ID" align="center" min-width="60px"></el-table-column>
                <el-table-column prop="countryCode" label="国家" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="detailAddress" label="地址详情" align="center" min-width="220px">
                    <template slot-scope="scope">
                        <span>{{scope.row.stateName}} {{scope.row.cityName}} {{scope.row.detailAddress}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="detailAddress" label="收货人" align="center" min-width="220px"></el-table-column>
                <el-table-column prop="mobile" label="收货手机号" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="postcode" label="邮编" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" min-width="120px"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { listAddress } from '@/request/user'
    export default {
        name: 'reveivingAddressList',
        data() {
            return {
                loading: false,
                userId: '',
                dataList: []
            }
        },
        computed: {
        },
        created() {
            if (this.$route.query.userId) {
                this.userId = this.$route.query.userId
            }
        },
        methods: {
            getUserAddressList() {
                this.loading = true
                let params = {}
                params.userId = this.userId
                listAddress(params).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.addressDo
                    }
                    console.log(res)
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
