<template>
    <div class="app-container">
        <div class="table-list">
            <el-table border :data="dataList" v-loading="loading" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="id" label="序号" align="center" min-width="60px"></el-table-column>
                <el-table-column prop="countryCode" label="国家" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="bankName" label="银行名称" align="center" min-width="150px"></el-table-column>
                <el-table-column prop="accountName" label="银行账户名" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="accountNo" label="银行账号" align="center" min-width="220px"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" min-width="120px"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { getUserBankList } from '@/request/polypay'
    export default {
        name: 'bankCardList',
        data() {
            return {
                loading: false,
                dataList: [],
                userId: ''
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
            getUserBankCardList() {
                let params = {}
                params.userId = this.userId
                this.loading = true
                getUserBankList(params).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.data
                    }
                    console.log(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
