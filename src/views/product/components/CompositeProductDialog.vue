<template>
    <div class="composite-product-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="950px" @close="closeDialog" :close-on-click-modal="false">
            <el-form ref="compositeProductForm" :rules="ruleValidate">
                <el-form-item label="主商品：">
                    <p class="product-title">{{productInfo.title}}</p>
                    <p class="product-attr-value">{{productInfo.attrValueName}}</p>
                </el-form-item>
                <el-form-item label="子商品：">
                    <el-input type="textarea"
                        :autosize="{ minRows: 1, maxRows: 4}"
                        v-model="skuInput"
                        size="medium"
                    placeholder="请输入SKUID后点击添加，多个SKUID请用英文逗号隔开" style="width: 450px; margin-right: 10px;"></el-input>

                    <el-button type="text" :disabled="!skuInput" @click="addSub">添加</el-button>
                    <div class="sub-product-table">
                        <el-table border :data="skuTableData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                            <el-table-column prop="skuName" min-width="150px" label="商品名称" align="center">
                            </el-table-column>
                            <el-table-column width="130px" label="skuCode" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.skuCode}}
                                </template>
                            </el-table-column>
                            <el-table-column width="130px" label="skuId" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.slaveSkuId}}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column width="120px" label="规格ID" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.standardAttr | formatAttrValue}}
                                </template>
                            </!-->
                            <el-table-column  width="120px" label="规格" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.standardAttr | formatAttrName}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="deliveryNumber" width="160px" label="发货数量" align="center">
                                <template slot-scope="scope">
                                    <el-input-number v-model="scope.row.deliveryNumber" size="mini" controls-position="right" @change="handleChange" :min="1" :max="1000"></el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column width="80px" label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="removeSub(scope.row)"><i class="el-icon-close"></i></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-link :underline="false" type="primary" @click="test">查看数据</el-link> -->
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleDel" @on-confirm="confirmDel"></confirm-dialog>
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/ConfirmDialog'
    import { compositeSlaveSkuInfoQuery } from '@/request/product'

    export default {
        name: 'CompositeProductDialog',
        props: {
            editType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            // 主商品信息
            productInfo: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            compositeProductData: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                productInfoData: this.productInfo,
                // skuInput: '433444677828481024',
                skuInput: '',
                // skuTableData: this.compositeProductData,
                ruleValidate: {
                },
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                compositeProductDataTemp: {}
            }
        },
        watch:{
            dialogVisible: function (newValue, oldValue) {
                if (newValue) {
                    this.compositeProductDataTemp = _.cloneDeep(this.skuTableData)
                }
            }
        },
        components: {
            ConfirmDialog
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
            dialogTitle: {
                get: function () {
                    if (this.editType === 'add') {
                        return '组合商品'
                    } else {
                        return '组合商品'
                    }
                },
                set: function () {
                }
            },
            confirmDisable() {
                let disable = false
                if(this.skuTableData.length > 0) {
                    disable = false
                } else {
                    disable = true
                }
                return disable
            },
            skuTableData: {
                get: function () {
                    return this.compositeProductData
                },
                set: function () {
                }
            }
        },
        filters: {
            formatAttrName:  function (params) {
                let values = []
                _.forEach(params, standardAttr => {
                    values.push(standardAttr.valueName)
                })
                return values.join('、')
            },
            formatAttrValue: function (params) {
                let values = []
                _.forEach(params, standardAttr => {
                    values.push(standardAttr.valueId)
                })
                return values.join('、')
            }
        },
        methods: {
            cancle() {
                this.$emit('on-cancle', this.compositeProductDataTemp)
                this.skuTableData.length = 0
            },
            confirm() {
                this.$emit('on-confirm', this.skuTableData)
                this.skuTableData.length = 0
            },
            closeDialog() {
                this.$emit('on-close')
            },
            cancleDel() {
                this.confirmVisible = false
            },
            confirmDel() {
                this.confirmVisible = false
                this.confirmDelAttrValue()
            },

            delAttrValue(index) {
                let attrValue = '黑色'
                this.confirmVisible = true
                this.confirmDialogTitle = '确定删除该值？'
                this.confirmDialogText = `删除`
            },
            confirmDelAttrValue() {
                if (this.skuTableData.length <= 1) {
                    this.$message.warning('至少有一条属性值')
                    return
                }
            },
            handleChange() {
            },
            // 获取组合商品子sku信息查询
            getCompositeSlaveSkuInfo(skuId, countryCode) {
                let params = {
                    skuId: skuId,
                    countryCode: countryCode
                }
                compositeSlaveSkuInfoQuery(params).then((response) => {
                    let skuList = []
                    if (response.ret.errcode === 1) {
                        let compositeSlaveSku = response.compositeSlaveSku
                        if (compositeSlaveSku.length <= 0) {
                            this.$message.warning('未搜索到该商品！')
                        }
                        _.forEach(compositeSlaveSku, item => {
                            let skuItem = {}
                            skuItem.countryCode = item.countryCode
                            skuItem.productId = item.productId
                            skuItem.skuCode = item.skuCode
                            skuItem.skuId = item.skuId
                            skuItem.slaveSkuId = item.skuId
                            skuItem.productId = item.productId
                            skuItem.standardAttr = item.standardAttr
                            skuItem.skuName = item.title
                            skuItem.deliveryNumber = 1

                            skuList.push(skuItem)
                        })
                        _.forEach(skuList, sku => {
                            console.log(this.skuTableData)
                            if (_.find(this.skuTableData, {'skuId': sku.skuId}) === undefined) {
                                this.skuTableData.push(sku)
                            } else {
                                this.$message.warning('商品已存在！')
                            }
                        })
                        this.skuInput = ''
                    } else {
                        this.$message.error('未搜索到该商品！')
                    }

                }).catch((err) => {
                    console.error(err)
                })
            },
            addSub() {
                let skuIdList = this.skuInput.split(',')
                this.getCompositeSlaveSkuInfo(_.map(skuIdList, _.trim), this.productInfo.countryCode)
            },
            removeSub(subData) {
                let index = _.findIndex(this.skuTableData, {'slaveSkuId': subData.slaveSkuId});
                this.skuTableData.splice(index, 1)
            },
            test() {
                console.log(this.skuTableData)
            }
        }
    }
</script>

<style lang="scss">
.composite-product-dialog {
    .el-dialog__header {
        border-bottom: 1px solid #ebeef5;
    }
    .el-dialog__body {
        padding: 50px 40px;
    }
    .el-dialog__footer {
        border-top: 1px solid #ebeef5;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
}
.tips {
    color: #aaa;
    line-height: 20px;
}
.sub-product-table {
    padding: 10px 54px;
}
</style>
<style lang="scss" scoped>
    .product-title {
        font-weight: bold;
        font-size: 16px;
    }
    .product-attr-value {
        padding-left: 54px;
        color: #000
    }
</style>




