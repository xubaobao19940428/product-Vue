<template>
    <div>
        <el-table ref="" :data="outOrderTableData" fit highlight-current-row style="width: 620px; margin-top:16px;" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
            <el-table-column label="出库单编号" align="center"  width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.outId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出库单状态" align="center"  width="150">
                <template slot-scope="scope">
                    <span v-if="scope.row.outStatus === 1">已出库</span>
                    <span v-if="scope.row.outStatus === 2">未出库</span>
                    <span v-if="scope.row.outStatus === 3">已取消</span>
                </template>
            </el-table-column>
            <el-table-column label="sku数量" align="center"  width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.count }}</span>
                </template>
            </el-table-column>
            <el-table-column label="取消数量" align="center"  width="150">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.cancelCount" :controls="false" :min="0" :max="scope.row.count" size="mini" ></el-input-number>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        outOrderTableDataModel: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    computed: {
        outOrderTableData: {
            get: function () {
                return this.outOrderTableDataModel;
            },
            set: function () {
            }
        },
    },
    data() {
        return {
        }
    }
}
</script>

