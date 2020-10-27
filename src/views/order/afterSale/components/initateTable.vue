<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
            <el-table-column label="订单编号（order_id）" width="160" align="center">
                <template slot-scope="scope">
                    <div>
                        {{ scope.row.num}}
                        <!-- <img :src="getCountryImg(scope.row.countryCode)"> -->
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="出库单" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.num}}
                </template>
            </el-table-column>
            <el-table-column label="订单类型" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.num}}
                </template>
            </el-table-column>
            <el-table-column label="Product_id" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.num}}
                </template>
            </el-table-column>
            <el-table-column label="SKUID" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.num}}
                </template>
            </el-table-column>
            <el-table-column label="SKUCODE" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.num}}
                </template>
            </el-table-column>
            <el-table-column label="校验" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.num}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        data () {
            return {

            }
        },
        methods: {
            handleSelectionChange () {

            },
        }
    }
</script>
<style lang="scss" scoped>

</style>