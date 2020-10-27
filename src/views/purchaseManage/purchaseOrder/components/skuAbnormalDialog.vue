<template>
    <el-dialog
        title="SKU异常详情"
        :visible.sync="toggle"
        width="60%"
        :append-to-body="true"
        :before-close="closeDialog"
        class="abnormal-dialog">
        <div class="abnormal-item">
            <img :src="dealShowFileSrc(abnormalItemData.productCover)" class="thumbnail"/>
            <div class="abnormal-desc">
                {{abnormalItemData.productName}}
            </div>
            <div class="abnormal-skudesc">{{abnormalItemData.skuDesc}}</div>
            <div>采购数量：{{abnormalItemData.purchaseCount}}</div>
        </div>
        <el-table :data="abnormalData" style="width: 100%; font-size: 10px">
            <el-table-column label="异常单号" min-width="140px" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.abnormalNo}}</div>
                </template>
            </el-table-column>
            <el-table-column label="异常类型" min-width="140px" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.abnormalType}}</div>
                </template>
            </el-table-column>
            <el-table-column label="异常数量" min-width="140px" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.abnormalNum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="异常状态" min-width="140px" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.abnormalStatus===1?"处理中":scope.row.abnormalStatus===2?"待处理":"已完结"}}</div>
                </template>
            </el-table-column>
            <el-table-column label="异常发起时间" min-width="140px" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.abnormalCreateTime}}</div>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeDialog">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
    export default {
        data () {
            return {
                
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            abnormalData: Array,
            abnormalItemData: {
                type: Object,
                default: {}
            },
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
        },
        methods: {
            closeDialog () {
                this.$emit('closeDialog')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .abnormal-dialog{
        .abnormal-item{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 12px;
            .abnormal-desc{
                width: 300px;
                margin-left: 30px;
            }
            .abnormal-skudesc{
                margin-right: 30px;
            }    
        }
    }
</style>