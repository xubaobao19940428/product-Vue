<template>
    <el-dialog :title="editDialog.title" :visible.sync="editDialog.show" width="800px" @close="editDialog.show = false" :close-on-click-modal="false">
        <el-form label-position="right" label-width="130px" :model="editDialog.param" ref="addDialog">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="供应商：" prop="supplierId" class="filter-item">
                        <el-select v-model="supplierId" :disabled="editDialog.param.purchaseOrderStatus === 'WAIT_PURCHASE'"
                                   filterable clearable remote reserve-keyword :remote-method="getSupplierList" placeholder="请输入供应商" @change="dialogChange">
                            <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="skuCode：">
                        <span>{{ editDialog.param.skuCode || '-'}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收货仓库：">
                        <span>{{ editDialog.param.warehouseName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="系统数量：">
                        <span>{{ editDialog.param.systemCount }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已入库数量：" v-if="this.editDialog.type=='makeup'">
                        <span>{{ editDialog.param.incomeNum }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="已取消数量：" v-if="this.editDialog.type=='makeup'">
                        <span>{{ editDialog.param.cancelCount }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="最大可补数量：" v-if="this.editDialog.type=='makeup'">
                        <span>{{ editDialog.param.maxCount }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="采购数量：" prop="purchaseCount" v-if="this.editDialog.type=='makeup'">
                <el-input placeholder="请输入采购数量" @blur="checkPurchaseCount(editDialog.param.purchaseCount)" v-model="editDialog.param.purchaseCount"></el-input>
            </el-form-item>
            <el-form-item label="采购数量：" prop="purchaseCount" v-else>
                <el-input placeholder="请输入采购数量" v-model="editDialog.param.purchaseCount"></el-input>
            </el-form-item>
            <template v-if="editDialog.type != 'onemakeup'">
                <el-form-item label="商品采购单价：" prop="purchasePrice">
                    <el-input placeholder="请输入商品采购单价" v-model="editDialog.param.purchasePrice"></el-input>
                </el-form-item>
                <el-form-item label="第三方单号：" prop="thirdOrderNo">
                    <el-input placeholder="请输入第三方单号" v-model="editDialog.param.thirdOrderNo"></el-input>
                </el-form-item>
            </template>
            <el-form-item label="运费：" prop="freight">
                <el-input placeholder="请输入运费" v-model="editDialog.param.freight"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <div slot="footer" class="dialog-footer">
                <el-button @click="getPurchaseclose" size="small">取 消</el-button>
                <el-button v-if="this.editDialog.type=='edit'" type="primary" @click="onSingleEditConfirm" size="small">确 定</el-button>
                <el-button v-if="this.editDialog.type=='makeup'" type="primary" @click="onSingleMakeupConfirm" size="small">确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import common from '@/views/purchaseManage/common/common'
    import { supplierBasePage } from '@/request/supplier'

    export default {
        name: 'singleSkuEdit',
        props: {
            editDialog: {
                type: Object,
                default: function () {}
            },
            // propSupplierList: Array,
            propWmsWarehouseList: Array
        },
        mixins: [common],
        data () {
            return {
                supplierId: ''
            }
        },
        mounted () {
            if (this.editDialog.type === "edit") {
                console.log('===>')
                this.supplierId = this.editDialog.param.supplierId
                this.getSupplierList('',this.editDialog.param.supplierId)
            }
        },
        watch: {
            editDialog: {
                handler (val) {
                    console.log(val)
                    if (val.show) {
                        // this.supplierList = this.propSupplierList
                        this.supplierId = val.param.supplierId
                    }
                },
                deep: true
            }
        },
        components: {},
        methods: {
            getSupplierList (query,id) {
                let params = {
                    supplierName: query,
                    supplierId:id ? id:''
                }
                supplierBasePage(this.filterData(params)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.supplierList = res.list
                    }
                })
            },
            dialogChange (val) {
                // console.log('===>',val)
            },
            getPurchaseclose () {
                this.editDialog.show = false
                this.editDialog.param.productPurchasePrice = ''
                this.editDialog.param.content = ''
            },
            checkPurchaseCount (data) {
                if (data > this.editDialog.param.maxCount || data <= 0) {
                    this.$alert('采购数量不在允许范围内')
                    this.editDialog.param.purchaseCount = this.editDialog.param.maxCount
                }
            },
            onSingleEditConfirm () {
                this.$emit('on-confirm-edit', this.editDialog.param)
            },
            onSingleMakeupConfirm () {
                this.$emit('on-confirm-makeup', this.editDialog.param)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .delete-box {
        width: 100px;
        i {
            margin-left: 10px;
            cursor: pointer;
        }
    }
</style>
