<template>
    <el-dialog
        title="商品详情"
        :visible.sync="toggle"
        width="60%"
        :before-close="handleClose"
        class="outbound-details">
        <el-table :data="tableData" border class="sku-table">
            <el-table-column label="出库单相关商品信息" min-width="350px" >
                <template slot-scope="scope">
                    <div class="flex flex-item--center split-order-item" style="height: 100%">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                            <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
                        </el-popover>
                        <div class="block-right">
                            <div>
                                <div class="pointer">商品名称：{{scope.row.nameCn}}</div>
                                <div>skuCode：{{ scope.row.skuCode }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div>{{ scope.row.standardAttr }}</div>
                </template>
            </el-table-column>
            <el-table-column label="品类" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.cateName">
                            <div v-for="(item,index) in scope.row.cateName" :key="index">
                                <div v-if="index === scope.row.cateName.length -1">{{ item }}</div>
                                <div v-else>{{ item }}></div>
                            </div>
                        </div>
                        <div v-else>-</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="出库数量" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div>数量：{{ scope.row.count }}</div>
                </template>
            </el-table-column>
            <el-table-column label="配货数量" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div :class="{prompt:scope.row.count !== scope.row.matchCount}">数量：{{ scope.row.matchCount }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-pagination
                @size-change="handleSizeChanges"
                @current-change="handleCurrentChanges"
                :current-page="page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totals">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
</template>
<script>
    import { OutOrderNewDetail } from '@/request/warehouse'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            outId: String
        },
        data () {
            return{
                tableData: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                totals: 0
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        }, 
        mounted () {
            this.getOutOrderNewDetail()
        },
        methods: {
            handleClose () {
                this.$emit('on-cancle')
            },
            handleSizeChanges (val) {
                this.page.pageSize = val
                this.getOutOrderNewDetail()
            },
            handleCurrentChanges (val) {
                this.page.pageNum = val
                this.getOutOrderNewDetail()
            },
            getOutOrderNewDetail(){
                let params = {
                    outNo: this.outId,
                    page: this.page
                }
                OutOrderNewDetail(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.sku
                        this.totals = res.total
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .outbound-details{
        .block-right {
            flex: 1;
            height: 150px;
            display: flex;
            align-items: center; /*定义body的元素垂直居中*/
        }
        .sku-table{
            margin-bottom: 20px;
        }
        .prompt{
            color: red;
        }
    }
</style>