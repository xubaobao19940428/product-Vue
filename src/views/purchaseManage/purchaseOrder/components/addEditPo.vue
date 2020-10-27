<template>
    <!--新增采购单-->
    <el-dialog :title="addDialog.title" :visible.sync="addDialog.show" width="950px" :close-on-click-modal="false" @close="addDialog.show = false">
        <el-form label-position="right" label-width="130px" :rules="addDialog.rules" :model="addDialog.param" ref="addDialog">
            <el-form-item label="商品信息：" class="filter-item">
                <div class="product-info-wrapper">
                    <div v-for="(item, i) in addDialog.param.purchaseOrderProductAddInfos" class="flex mar-b-10 product-info-item" :key="i">
                        <el-input placeholder="请输入商品编码" v-model="item.skuCode"></el-input>
                        <el-input type="number"  placeholder="请输入采购数量" class="mar-l-10" v-model="item.purchaseCount" @blur="checkNum(item.purchaseCount)">
                        </el-input>
                        <el-input  type="number" placeholder="请输入采购价格" class="mar-l-10" v-model="item.purchasePrice"></el-input>
                        <el-input placeholder="请输入第三方单号" class="mar-l-10" v-model="item.thirdOrderNo"></el-input>
                        <div class="delete-box" v-if="addDialog.param.purchaseSource != 'SYSTEM' " @click="deleteProducts(i)">
                            <i class="el-icon-circle-close"></i>
                        </div>
                    </div>
                    <el-button @click="addProducts()" size="small">+ 新 增</el-button>
                    <el-button type="primary" @click="SyncNowRelationN" size="small">一键同步第三方单号</el-button>
                </div>
            </el-form-item>
            <el-form-item label="发货方式：" prop="deliveWay" v-if="addDialog.param.purchaseSource != 'SYSTEM' " class="filter-item">
                <el-select v-model="addDialog.param.deliveWay" :disabled="addDialog.param.purchaseOrderStatus === 'WAIT_PURCHASE'" filterable clearable @change="changeWareHouse(addDialog.param.deliveWay)" size="medium">
                    <el-option v-for="item in deliveWayList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收货仓库：" class="filter-item" prop="warehouseNo" v-if="addDialog.param.deliveWay=='1'">
                <el-select v-if="this.addDialog.type=='add'" v-model="addDialog.param.warehouseNo" filterable clearable  size="medium" placeholder="请选择仓库">
                    <el-option v-for="(val, key) in wmsWarehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo" :disabled="val.warehouseNo === '0001'||val.warehouseNo==='0005'"></el-option>
                </el-select>
                <span v-else>{{ addDialog.param.warehouseName}}</span>
            </el-form-item>
            <el-form-item label="收货仓库：" class="filter-item" prop="warehouseNo" v-else>
                <el-select v-if="this.addDialog.type=='add'" v-model="addDialog.param.warehouseNo" :disabled="addDialog.param.purchaseOrderStatus === 'WAIT_PURCHASE'"
                    filterable clearable size="medium" placeholder="请选择仓库">
                    <el-option v-for="(val, key) in wmsWarehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                </el-select>
                <span v-else>{{ addDialog.param.warehouseName}}</span>
            </el-form-item>
            <el-form-item label="供应商：" prop="supplierId" class="filter-item">
                <el-select v-model="addDialog.param.supplierId" :remote-method="getSupplierList"
                                filterable clearable remote reserve-keyword size="medium">
                    <el-option v-for="(item, index) in supplierList" :key="index" :label="item.supplierName" :value="item.supplierId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运费：" prop="freight">
                <el-input type="number" placeholder="请输入运费" v-model="addDialog.param.freight" size="medium" style="width: 196px;"></el-input>
            </el-form-item>
            <el-form-item label="推送供应商：" prop="isUse">
                <el-radio-group v-model="addDialog.param.isUse">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click="addPurchase" size="small">确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import { savePo } from '@/request/purchase'
    import { supplierBasePage } from '@/request/supplier'
    import common from '@/views/purchaseManage/common/common'
    export default {
        name: 'addEditPo',
        props: {
            addDialog: {
                type: Object,
                default: function () {}
            },
            // propSupplierList: Array,
            propWmsWarehouseList: Array
        },
        mixins: [common],
        data () {
            return {
                addLoading: false,
                deliveWayList: [
                    {
                        value: 1,
                        label: '海运'
                    }, {
                        value: 2,
                        label: '空运'
                    }
                ],
                supplierList: []
            }
        },
        mounted () {
            this.wmsWarehouseList = this.propWmsWarehouseList
            if (this.addDialog.param.type === "editEntireOrder") {
                console.log('===>')
                this.getSupplierList('',this.addDialog.param.supplierId)
            }
            // this.supplierList = this.propSupplierList
            // if (this.wmsWarehouseList[0]) {
            //     this.addDialog.param.warehouseNo = this.wmsWarehouseList[0].warehouseNo
            // }
        },
        components: {},
        methods: {
            // 获取供应商列表
            getSupplierList (query,id) {
                let params = {
                    supplierName: query,
                    supplierId:id ? id:''
                }
                supplierBasePage(this.filterData(params)).then(res => {
                    console.log('111111',res)
                    if (res.ret.errcode === 1) {
                        this.supplierList = res.list
                    }
                })
            },
            // 限制输入格式
            checkNum (data) {
                if (data <= 0) {
                    this.$alert('采购数量不能为小于等于零')
                }
            },
            deleteProducts (i) {
                this.addDialog.param.purchaseOrderProductAddInfos.splice(i, 1)
            },
            addProducts () {
                this.addDialog.param.purchaseOrderProductAddInfos.push({
                    skuCode: '',
                    purchaseCount: '',
                    purchasePrice: '',
                    thirdOrderNo: ''
                })
            },
            isRepeat (arr) {
                let hash = {}
                for (let i in arr) {
                    if (hash[arr[i].skuCode]) {
                        return true
                    }
                    // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
                    hash[arr[i].skuCode] = true
                }
                return false
            },
            addPurchase () {
                this.$refs['addDialog'].validate(async (valid) => {
                    if (valid) {
                        let purchaseOrderProductAddInfos = this.addDialog.param.purchaseOrderProductAddInfos.filter((val) => {
                            return val.skuCode && val.purchaseCount != '' && val.purchasePrice != ''
                        })
                        if (purchaseOrderProductAddInfos.length > 0) {
                            for (let i = 0; i < this.addDialog.param.purchaseOrderProductAddInfos.length; i++) {
                                if (this.addDialog.param.purchaseOrderProductAddInfos[i].purchaseCount < 0) {
                                    this.$message.warning('采购数量异常')
                                }
                            }
                            if (this.isRepeat(purchaseOrderProductAddInfos)) {
                                this.$message.warning('skuCode不能相同')
                            } else {
                                let param = this.addDialog.param
                                let purchaseOrder = {}
                                purchaseOrder.purchaseOrderNo = param.purchaseOrderNo
                                purchaseOrder.warehouseNo = param.warehouseNo
                                purchaseOrder.supplierId = param.supplierId
                                purchaseOrder.deliveWay = param.deliveWay
                                purchaseOrder.freight = param.freight
                                purchaseOrder.isUse = param.isUse
                                purchaseOrder.detailInfo = param.purchaseOrderProductAddInfos
                                this.savePurchaseOrder(purchaseOrder)
                            }
                        } else {
                            this.$message.warning('商品信息不能为空')
                        }
                    } else {
                        return false
                    }
                })
            },
            // 一键同步第三方单号
            SyncNowRelationN () {
                for (let i = 0; i < this.addDialog.param.purchaseOrderProductAddInfos.length; i++) {
                    this.addDialog.param.purchaseOrderProductAddInfos[i].thirdOrderNo = this.addDialog.param.purchaseOrderProductAddInfos[0].thirdOrderNo
                }
                // }
            },
            changeWareHouse (data) {
                if (data == 1) {
                    // this.addDialog.param.warehouseNo = '0002'
                }
            },
            savePurchaseOrder (params) {
                this.addLoading = true
                savePo(this.filterData(params)).then((response) => {
                    this.addLoading = false
                    if (response.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        this.addDialog.show = false
                        this.$emit('getList')
                        this.reset()
                    } else {
                        this.$message.error(response.message)
                    }
                }).catch((err) => {
                    this.addLoading = false
                    console.log(err)
                })
            },
            cancle () {
                this.addDialog.show = false
                this.reset()
            },
            reset () {
                this.$refs.addDialog.resetFields()
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
