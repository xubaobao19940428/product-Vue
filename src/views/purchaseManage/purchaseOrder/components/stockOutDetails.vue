<template>
    <el-dialog title="缺货详情页"
               :visible.sync="editDialog.stockOutDetails.show"
               width="900px"
               @close="editDialog.stockOutDetails.show = false"
               :close-on-click-modal="false" >
        <el-card style="margin-bottom: 20px">
            <el-form label-position="right" label-width="100px" :model="editDialog.param">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购单号：">
                            <span>{{ editDialog.param.purchaseOrderNo || '-'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <span>{{ editDialog.param.productName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="SkU图片：">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="dealShowFileSrc(editDialog.param.productCover)"
                                fit="contain">
                            </el-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="skuCode：">
                            <span>{{ editDialog.param.skuCode || '-'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购数量：">
                            <span>{{ editDialog.param.purchaseCount || '-'}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="SKU属性：">
                            <span>{{ editDialog.param.skuDesc || '-'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="已入库数：">
                            <span>{{ editDialog.param.incomeNum }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已取消数：">
                            <span>{{ editDialog.param.cancelCount}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="已缺货数：">
                            <span>{{ editDialog.param.stockoutNum}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-table :data="deliveryList"  border v-loading="loading">
            <el-table-column label="快递公司" min-width="200px" fixed="left" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.logiCompany}}</div>
                </template>
            </el-table-column>
            <el-table-column label="物流单号" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div> {{ scope.row.logiCode}}</div>
                </template>
            </el-table-column>
            <el-table-column label="签收状态" align="center" min-width="120px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.signStatus === 1" type="success" size="mini">已签收</el-tag>
                    <el-tag v-if="scope.row.signStatus === 2" size="mini">未签收</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="发货数" min-width="100px" align="center">
                <template slot-scope="scope">
                    <div> {{ scope.row.totalCount}}</div>
                </template>
            </el-table-column>
            <el-table-column label="入库数" min-width="100px" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.incomeCount}}</div>
                </template>
            </el-table-column>
            <el-table-column label="缺货数量" min-width="100px" align="center">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.signStatus === 2" v-model="scope.row.count" :min="0" tyle="width: 150px;" @blur="checkCount(scope.row,1)" size="mini" type="number"></el-input>
                    <el-input v-if="scope.row.signStatus === 1" v-model="scope.row.count" :min="0" tyle="width: 150px;" size="mini"  :disabled="true"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-left: 435px">
            <el-form >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="未发货数量：" style="margin-left: 100px">
                            <div style="font-size: 10px">{{this.unShipCount}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="width: 49.83333%;">
                        <el-form-item label="缺货数量："  style="margin-left: 33px">
                            <el-input v-if="this.unShipCount == 0" v-model="count" :min="0" size="mini"  style="width: 98px;"  :disabled="true"></el-input>
                            <el-input v-else v-model="count" :min="0" size="mini" @blur="checkCount(count,2)" style="width: 98px;" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div style="margin-left: 300px">
                <el-checkbox v-model="autoCancel" >同时取消采购</el-checkbox>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <div slot="footer" class="dialog-footer">
                <el-button @click="getCancelclose" size="small">取 消</el-button>
                <el-button type="primary" @click="onConfirmCancel" size="small">确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import common from '@/views/purchaseManage/common/common'
    import { GetStockoutData, PurchaseStockout } from '@/request/purchase'
    export default {
        name: 'stockOutDetails',
        props: {
            editDialog: {
                type: Object,
                default: function () {}
            }
        },
        mixins: [common],
        data () {
            return {
                autoCancel: false,
                loading: false,
                count: 0, // 整体缺货数量
                deliveryList: [],
                deliveryList1: [],
                unShipCount: '', // 未发货数量
                totalShipNum: '', // 总发货数
                totalSkuShipNum: 0, // 总缺货数
                totalIncomeNum: '' // 总入库数
            }
        },
        components: {},
        created () {
        },
        methods: {
            checkCount (data, type) {
                if (type === 1) {
                    if (data.count > data.totalCount - data.incomeCount || data.count === '') {
                        this.$alert('缺货输入框 <= 发货数-入库数或数据为空')
                        console.log(111)
                        data.count = 0
                        return false
                    }
                }
                if (type === 2) {
                    if (data > this.unShipCount || data === '') {
                        this.$alert('缺货输入框<=采购数-发货数（未发货数）或数据为空')
                        this.count = 0
                        return false
                    }
                }
                return true
            },
            getCancelclose () {
                this.editDialog.stockOutDetails.show = false
            },
            // 新缺货搜索操作
            confirmhandleStockout () {
                this.loading = true
                this.count = 0
                let params = {
                    purchaseOrderNo: this.editDialog.param.purchaseOrderNo,
                    skuCode: this.editDialog.param.skuCode
                }
                this.deliveryList = []
                GetStockoutData(params).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.deliveryList1 = res.delivery
                        // 拼接count
                        this.deliveryList1.map((item, index) => {
                            this.deliveryList.push(
                                Object.assign({}, item, { count: '0' })
                            )
                        })
                        console.log(this.deliveryList)
                        this.unShipCount = res.unShipCount
                        for (let i = 0; i < this.deliveryList.length; i++) {
                            this.totalShipNum += this.deliveryList[i].totalCount
                            this.totalIncomeNum += this.deliveryList[i].incomeCount
                        }
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            /**
             * 缺货数量
             */
            onConfirmCancel () {
                let canSubmit = true
                this.totalSkuShipNum = 0
                console.log(this.deliveryList)
                for (let i = 0; i < this.deliveryList.length; i++) {
                    if (this.deliveryList[i].signStatus === 2) {
                        if (!this.checkCount(this.deliveryList[i], 1)) {
                            canSubmit = false
                            return
                        }
                        console.log('缺货填写数：' + this.deliveryList[i].count)
                        this.totalSkuShipNum += parseInt(this.deliveryList[i].count)
                    }
                }
                if (this.unShipCount != 0) {
                    if (!this.checkCount(this.count, 2)) {
                        canSubmit = false
                        return
                    }
                }
                if (this.totalSkuShipNum > this.editDialog.param.purchaseCount - this.editDialog.param.incomeNum - this.editDialog.param.cancelCount - this.editDialog.param.stockoutNum) {
                    this.$alert('整单缺货数量<=实际采购数量-已入库数量-已取消数量-已缺货数量')
                    canSubmit = false
                    return
                }
                if (canSubmit) {
                    let params = {}
                    this.editDialog.stockOutDetails.show = true
                    if (this.deliveryList == []) {
                        params = {
                            purchaseOrderNo: this.editDialog.param.purchaseOrderNo,
                            skuCode: this.editDialog.param.skuCode,
                            count: this.count, // 未发货缺货数量
                            stockout: []
                        }
                    } else {
                        params = {
                            purchaseOrderNo: this.editDialog.param.purchaseOrderNo,
                            skuCode: this.editDialog.param.skuCode,
                            count: this.count, // 未发货缺货数量
                            stockout: []
                        }
                        for (let i = 0; i < this.deliveryList.length; i++) {
                            params.stockout.push({ incomeNo: this.deliveryList[i].incomeNo,
                                                   count: this.deliveryList[i].count })
                            // params.stockout.push(this.deliveryList[i].count)
                        }
                    }
                    console.log(params)
                    Object.assign(params, {
                        autoCancel: this.autoCancel ? '1' : '2'
                    })
                    PurchaseStockout(this.filterData(params)).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('缺货成功！')
                            this.editDialog.stockOutDetails.show = false
                            this.$emit('getList')
                        } else {
                            this.$message.error(res.ret.msg)
                        }
                    }).catch((err) => {
                        // this.editDialog.stockOutDetails.show = false
                        console.log(err)
                    })
                    this.count = 0
                    this.autoCancel = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
