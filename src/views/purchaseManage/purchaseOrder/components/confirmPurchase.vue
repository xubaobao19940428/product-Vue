<template>
    <el-dialog title="确认采购单"
               :visible.sync="editDialog.confirmPurchase.show"
               width="950px"
               @close="editDialog.confirmPurchase.show = false"
               :close-on-click-modal="false" >

            <el-form label-position="right" label-width="120px" :model="editDialogNew"  :rules="rules">
                <el-form-item label="发货方式：" prop="deliveWay">
                    <el-radio-group v-model="editDialogNew.deliveWay" @change="changeTransferList">
                        <el-radio :label="2">空运</el-radio>
                        <el-radio :label="1">海运</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="warehouseNo" label="供应商交货地：" class="filter-item">
                    <el-select v-model="editDialogNew.warehouseNo"  size="medium" placeholder="请选择交货地" @change="showMessage">
                        <el-option v-for="(val, key) in transferList" :key="key" :label="val.name" :value="val.transferId" >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="color: #E6A23C">
                    <span>{{ editDialogNew.country+editDialogNew.address+'('+editDialogNew.userName+' '+editDialogNew.mobile+')'}}</span>
                </el-form-item>
                <el-form-item label="收货仓库：">
                    <span>{{ editDialogNew.warehouseName || '-'}}</span>
                </el-form-item>
                <el-form-item label="供应商：">
                    <span>{{ editDialogNew.supplierName || '-'}}</span>
                </el-form-item>
                <el-form-item label="运费：">
                    <span>{{ editDialogNew.freight || '-'}}</span>
                </el-form-item>
                <el-form-item label="推送供应商：">
                    <span v-if="editDialogNew.isUseFingoSystem === 1">是</span>
                    <span v-else>否</span>
                </el-form-item>
            </el-form>

        <el-table :data="details"  border v-loading="loading" max-height="250">
            <el-table-column label="商品名称" min-width="180px" align="center" prop="productName">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                            <span
                                style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 2;-webkit-box-orient: vertical">
                                {{ scope.row.productName || '-' }}
                            </span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="SKU图片" align="center" min-width="120px">
                <template slot-scope="scope">
                    <el-popover placement="top-start" trigger="hover">
                        <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                        <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail image-box" slot="reference">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="skuCode" align="center" prop="skuCode" min-width="180px"></el-table-column>
            <el-table-column label="规格" prop="skuDesc" align="center" min-width="120px">
                <template slot-scope="scope">
                    <div>{{ scope.row.skuDesc }}</div>
                </template>
            </el-table-column>
            <el-table-column label="采购数量" align="center">
                <template slot-scope="scope">
                    {{ scope.row.purchaseCount || '0' }}
                </template>
            </el-table-column>
            <el-table-column label="采购单价（元）" align="center" min-width="120px">
                <template slot-scope="scope">
                    <div>{{ scope.row.purchasePrice || '-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="采购总价（元）" min-width="120" align="center">
                <template slot-scope="scope">
                    <div>{{ scope.row.totalPrice  || '-' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="第三方单号" align="center" :show-overflow-tooltip='true' prop="thirdOrderNo" min-width="180px">
                <template slot-scope="scope">
                    <div>{{ scope.row.thirdOrderNo || '-' }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <div slot="footer" class="dialog-footer">
                <el-button @click="getCancelclose" size="small">取 消</el-button>
                <el-button type="primary" @click="onConfirm" size="small">确认采购</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import common from '@/views/purchaseManage/common/common'
    import { ensurePurchase } from '@/request/purchase'
    export default {
        name: 'confirmPurchase',
        props: {
            editDialog: {
                type: Object,
                default: function () {}
            },
            purchaseList: {
                type: Array,
                default: function () {}
            },
            details: {
                type: Array,
                default: function () {}
            },
            transferList: {
                type: Array,
                default: function () {}
            }
        },
        mixins: [common],
        data () {
            return {
                loading: false,
                rules: {
                    deliveWay: [{ required: true, message: '不能为空', trigger: 'change' }],
                    warehouseNo: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                editDialogNew: {}

            }
        },
        components: {},
        created () {
            this.editDialogNew = JSON.parse(JSON.stringify(this.editDialog.param))
            let resItem = this.transferList.find(item => ( item.transferId == this.editDialogNew.warehouseNo ))
            if (resItem) {
                Object.assign(this.editDialogNew, {
                    warehouseNo: resItem.transferId,
                    country: resItem.country,
                    address: resItem.address,
                    userName: resItem.userName,
                    mobile: resItem.mobile
                })
            }
        },
        methods: {
            showMessage (val) {
                let resItem = this.transferList.find(item => (item.transferId == val))
                if (resItem) {
                    Object.assign(this.editDialogNew, {
                        warehouseNo: resItem.transferId,
                        country: resItem.country,
                        address: resItem.address,
                        userName: resItem.userName,
                        mobile: resItem.mobile
                    })
                }
            },
            getCancelclose () {
                this.editDialog.confirmPurchase.show = false
            },
            changeTransferList (val) {
                console.log('海空')
                // deliveWay 1海运 2空运
                let resItem = this.transferList.find(item => (item.isDefault == 1 && item.deliveWay == val))
                if (resItem) {
                    Object.assign(this.editDialogNew, {
                        warehouseNo: resItem.transferId,
                        country: resItem.country,
                        address: resItem.address,
                        userName: resItem.userName,
                        mobile: resItem.mobile
                    })
                }
            },
            /**
             * 确认采购
             */
            onConfirm () {
                let params = {
                    purchaseOrderNo: this.editDialogNew.purchaseOrderNo,
                    transferId: this.editDialogNew.warehouseNo
                }
                ensurePurchase(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('采购成功！')
                        this.editDialog.confirmPurchase.show = false
                        this.$emit('getList')
                    } else {
                        this.$message.error(res.ret.errname)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-form-item {
        margin-bottom: 0px;
    }
</style>
