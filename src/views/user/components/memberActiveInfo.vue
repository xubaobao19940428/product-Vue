<template>
    <el-card class="member-active-card">
        <div slot="header" class="clearfix">
            <span>用户活跃信息</span>
        </div>
        <el-table :data="memberActiveInfo" border style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
            <el-table-column prop="lastLoginTime" label="最近一次登录时间" align="center" header-align="center">
                <template slot-scope="scope">
                    {{ scope.row.lastLoginTime | secondTimeFormat }}
                </template>
            </el-table-column>
            <el-table-column prop="lastBuyTime" label="最近一次购买时间" align="center" header-align="center">
                <template slot-scope="scope">
                    {{ scope.row.lastBuyTime | secondTimeFormat }}
                </template>
            </el-table-column>
            <el-table-column prop="usedCoupon" label="已使用优惠券" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="hasCoupon" label="已领优惠券" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="invalidCoupon" label="失效优惠券" align="center" header-align="center">
            </el-table-column>
        </el-table>

    </el-card>
</template>

<script>
    export default {
        name: 'memberActiveInfo',
        props: {
            memberActiveInfo: {
                type: Array
            }
        }
    }
</script>

<style lang="scss" scoped>
    
</style>


