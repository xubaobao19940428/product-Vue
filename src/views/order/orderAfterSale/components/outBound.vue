<template>
    <div class="out-bound">
        <el-dialog title="选择要取消的出库单" :visible.sync="toggle" width="850px" @close="cancle" :close-on-click-modal="false">
            <div class="out-order" v-for="(skuItem, index) in selectedSkuInfoList" :key="index">
                <div class='info-title'>{{skuItem.productName}}</div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            skuId: {{skuItem.skuId}}
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <div class="sku-text">sku图片：</div><img class="sku-img" :src="dealShowFileSrc(skuItem.skuCover)">
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            sku规格：{{skuItem.attr[0] && skuItem.attr[0].valueLabel}}
                        </div>
                    </el-col>
                </el-row>
                <el-divider content-position="left">关联出库单</el-divider>
                <div class="out-order-item" v-for="(item, index) in skuItem.skuOutOrderData" :key="index">
                    <p>待分配数量：{{item.skuCount}}</p>
                    <out-order-table :outOrderTableDataModel="item.outOrder"></out-order-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { outOrderList, createAfter} from '@/request/order'
    import OutOrderTable from './OutOrderTable'

    export default {
        props: {
            dialogVisible: Boolean,
            selectedSkuInfoList: Array,
            orderId: String
        },
        data () {
            return {
                selectedSkuInfo: [],
                outOrderTableDataModel: [
                    {
                        outId: '22434433',
                        outStatus: 1,
                        count: 1,
                        cancelCount: null
                    }
                ]
            }
        },
        components: {
            OutOrderTable
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            }
        },
        watch : {
            selectedSkuInfoList: {
                handler () {

                },
                deep: true
            }
        },
        mounted () {
            this.getOutOrderList()
        },
        methods: {
            cancle () {
                this.$emit('on-cancle')
            },
            // 校验待分配数量和分配数量是否相等
            verifyCancelCount() {
                console.log(this.selectedSkuInfoList)
                let flag = 0
                _.forEach(this.selectedSkuInfoList, selectedSkuInfoItem => {
                    _.forEach(selectedSkuInfoItem.skuOutOrderData, skuOutOrderItem => {
                        let total = 0
                        _.forEach(skuOutOrderItem.outOrder, outOrderItem => {
                            total += outOrderItem.cancelCount
                        })
                        if (skuOutOrderItem.skuCount !== total) {
                            flag ++
                        }
                    })
                })
                return flag > 0 ? false: true
            },
            confirm () {
                console.log(this.selectedSkuInfoList)
                if (!this.verifyCancelCount()) {
                    this.$message.warning('出库单中的取消数量总和必须等于待分配数量')
                    return
                }
                this.$emit('on-confirm',this.selectedSkuInfoList)
            },
            getOutOrderList() {
                let list = []
                for (const iterator of this.selectedSkuInfoList) {
                    list.push(iterator.skuId)
                }
                let params = {
                    orderId: this.orderId,
                    skuId: list
                }
                outOrderList(params).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        if (res.item.length === 0) {
                            this.$emit('stepReq')
                        } else {
                            let outOrderList = res.item
                            if (outOrderList.length < list.length) {
                                this.$confirm('特殊订单！！！暂不支持多spu同时售后，请选择单个spu，一个一个进行售后。', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$emit('on-cancle')
                                }).catch(() => {
                                    this.$emit('on-cancle')
                                })
                            }
                            _.forEach(this.selectedSkuInfoList, selectedSkuInfo => {
                                _.forEach(outOrderList, item => {
                                        if (selectedSkuInfo.skuId === item.superSkuId) {
                                            _.forEach(item.sku, sku => {
                                                sku.skuCount = sku.skuCount * selectedSkuInfo.num
                                                sku.superSkuId = item.superSkuId
                                            })
                                            _.forEach(item.sku, outOrderItem => {
                                                _.forEach(outOrderItem.outOrder, outOrder => {
                                                    this.$set(outOrder, 'cancelCount', 0)
                                                    this.$set(outOrder, 'skuId', outOrderItem.skuId)
                                                })
                                            })
                                            console.log(item.sku)
                                            this.$set(selectedSkuInfo, 'skuOutOrderData', item.sku)
                                        }
                                })
                            })
                        }
                       
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .out-bound{
        .out-order {
            padding: 20px 30px;
            .grid-content {
                display: flex;
                height: 100px;
                line-height: 100px;
            }
        }
        .info-title {
            border-left: 4px solid #409EFF;
            height: 28px;
            line-height: 28px;
            padding-left: 10px;
            color: #333333;
            font-weight: 700;
        }
        .sku-img {
            float: left;
            height: 100px;
            width: 100px;
        }
        .out-order-item {
            width: 100%;
            padding-bottom: 10px;
        }
    }
</style>