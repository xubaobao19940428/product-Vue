<template>
    <div>
        <!-- <el-button type="primary" @click="handleClick">组合商品</el-button>
        <el-button type="primary" @click="handleClick2">自动定价</el-button> -->
        <el-table :data="tableDataList" border :header-cell-style="{background:'#F5F7FA',color:'#606266'}" style="width: 100%">
            <el-table-column v-if="editType=== 'edit'" label="SKUID" width="120" fixed align="center" prop="skuId">
            </el-table-column>
            <el-table-column v-for="(item, index) in saleSpecType" :key="index" fixed :prop="item.attrId" :label="item.cn" width="120" align="center">
            </el-table-column>
            <el-table-column fixed label="规格图"  width="130" align="center">
                <template slot-scope="scope">
                    <div class="cover-image" v-if="scope.row.cover">
                        <el-image v-if="scope.row.cover && scope.row.cover.indexOf('http') === -1" :src="dealShowFileSrc(scope.row.cover)" fit="contain"></el-image>
                        <el-image v-else :src="scope.row.cover" fit="contain"></el-image>
                        <div class="operate-area">
                            <i class="el-icon-delete" @click="delCover(scope.$index)"></i>
                        </div>
                    </div>
                    <el-upload
                        v-else
                        class="standard-img"
                        :action="scope.$index+''"
                        :limit="1"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                        :http-request="uploadCoverPic"
                        list-type="picture-card">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column label="销售方式" width="120" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.saleWay" placeholder="请选择" size="mini">
                        <el-option v-for="item in saleWayOption" :key="item.saleWay" :label="item.name" :value="item.saleWay">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="发货方式" width="120" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.deliveryWay" filterable placeholder="请选择" size="mini">
						<el-option v-for="item in deliveryWayOption" :key="item.deliveryWay" :label="item.name" :value="item.deliveryWay">
                        </el-option>
					</el-select>
                </template>
            </el-table-column>
            <el-table-column label="重量(kg)" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.weight" :disabled="index>0" @blur="syncData('weight', scope.row.weight, scope.$index)" :controls="false" :min="0" :max="99999" :precision="2" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="单品规格" width="120" align="center">
                <template slot="header">
                    单品规格(cm)
                    <p>(长,宽,高)</p>
                </template>
                <template slot-scope="scope">
                    <el-input-number :disabled="index>0" @blur="calcVolume(scope.row.specification, scope.$index, 'specification');syncData('specification.l', scope.row.specification.l, scope.$index)"
                        v-model="scope.row.specification.l"
                        :controls="false" :min="0" :max="99999" size="mini" :precision="0" style="width: 100%"></el-input-number>
                    <el-input-number :disabled="index>0" @blur="calcVolume(scope.row.specification, scope.$index, 'specification');syncData('specification.w', scope.row.specification.w, scope.$index)"
                         v-model="scope.row.specification.w"
                        :controls="false" :min="0" :max="99999" size="mini" :precision="0" style="width: 100%"></el-input-number>
                    <el-input-number :disabled="index>0" @blur="calcVolume(scope.row.specification, scope.$index, 'specification');syncData('specification.h', scope.row.specification.h, scope.$index)"
                         v-model="scope.row.specification.h" :controls="false" :min="0" :max="99999" size="mini" :precision="0" style="width: 100%"></el-input-number>
                    <!-- <el-input-number :disabled="true"
                        v-model="scope.row.specification.v" :controls="false" :min="0"  size="mini" :precision="0" style="width: 100%"></el-input-number> -->
                </template>
            </el-table-column>
            <el-table-column label="箱体规格" width="120" align="center">
                <template slot="header">
                    箱体规格(cm)
                    <p>(长,宽,高)</p>
                </template>
                <template slot-scope="scope">
                    <el-input-number :disabled="index>0" @blur="calcVolume(scope.row.boxSpecification, scope.$index, 'box');syncData('boxSpecification.l', scope.row.boxSpecification.l, scope.$index)"
                        v-model="scope.row.boxSpecification.l" :controls="false" :min="0" :max="99999" size="mini" :precision="0" style="width: 100%"></el-input-number>
                    <el-input-number :disabled="index>0" @blur="calcVolume(scope.row.boxSpecification, scope.$index, 'box');syncData('boxSpecification.w', scope.row.boxSpecification.w, scope.$index)"
                         v-model="scope.row.boxSpecification.w" :controls="false" :min="0" :max="99999" size="mini" :precision="0" style="width: 100%"></el-input-number>
                    <el-input-number :disabled="index>0" @blur="calcVolume(scope.row.boxSpecification, scope.$index, 'box');syncData('boxSpecification.h', scope.row.boxSpecification.h, scope.$index)"
                        v-model="scope.row.boxSpecification.h" :controls="false" :min="0" :max="99999" size="mini" :precision="0" style="width: 100%"></el-input-number>
                    <!-- <el-input-number :disabled="true" v-model="scope.row.boxSpecification.v" :controls="false" :min="0"  size="mini" :precision="0" style="width: 100%"></el-input-number> -->
                </template>
            </el-table-column>
            <el-table-column label="供货价"  width="150" align="center">
                <template slot="header">
                    供货价
                    <el-select v-model="currency" @change="handleCurrencyChange" :disabled="index>0" size="mini" style="width: 120px;">
                        <el-option v-for="item in currencyOption" :key="item.currency" :label="item.name+item.unit" :value="item.currencyCode">
                        </el-option>
                    </el-select>
                </template>
                <template slot-scope="scope">
                <el-input-number @blur="syncData('supplyPrice', scope.row.supplyPrice, scope.$index)"
                    v-model="scope.row.supplyPrice" :disabled="!currency || index>0" :controls="false" :min="0" :precision="2" size="mini" style="width: 90%">
                </el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="佣金率%" width="100" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.commission" @focus="saveTempCommission(scope.row.commission)" @blur="verifyCommission(scope.row.commission, scope.$index)" :controls="false" :min="0" :max="60" :precision="2" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="'划线价(' + currencyCode +')'" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.price" :controls="false" :min="0" :precision="2" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="'VIP价('+ currencyCode +')'" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.priceVip" :controls="false" :min="0" :precision="2" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="'建议活动价('+ currencyCode +')'" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.activePrice" :controls="false" :min="0" :precision="2" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column>
            <!-- <el-table-column label="虚拟库存" width="100" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.stock" :controls="false" :min="0" :max="99999"  size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="活动库存" width="100" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.activeStock" :controls="false" :min="0" :max="99999" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </!-->
            <!-- <el-table-column label="所在仓库" width="100" align="center">
                <template slot-scope="scope">
                   <el-select v-model="scope.row.warehouse" filterable placeholder="请选择" size="mini">
						<el-option v-for="item in currencyOption" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
					</el-select>
                </template>
            </el-table-column> -->
            <el-table-column label="供应商商品编码" width="130" align="center">
                <template slot-scope="scope">
                    <el-input :disabled="index>0"  @blur="syncData('supplierCode', scope.row.supplierCode, scope.$index)"
                        v-model="scope.row.supplierCode" placeholder="请输入商品编码" :maxlength="50" size="mini" style="width:100%"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="skuCode" width="130" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.skuCode || '-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="Fingo商品固定编码" width="150" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.skuCodeKey || '-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="商品条形码" width="120" align="center">
                 <template slot-scope="scope">
                    <el-input :disabled="index>0" @blur="syncData('qrCode', scope.row.qrCode, scope.$index)"
                        v-model="scope.row.qrCode" placeholder="请输入商品条形码" :maxlength="50" size="mini" style="width:100%"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="商品组合" width="120" align="center">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" v-if="scope.row.compositeProduct" @click="viewCompositeProduct(scope.row, scope.$index)">查看组合</el-link>
                    <el-link type="primary" :underline="false"  v-else @click="addCompositeProduct(scope.row, scope.$index)">添加</el-link>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="销售状态" width="120" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.saleStatus" filterable placeholder="请选择" size="mini">
						<el-option v-for="item in saleStatusOption" :key="item.saleStatus" :label="item.name" :value="item.saleStatus">
                        </el-option>
					</el-select>
                </template>
            </el-table-column>
        </el-table>
        <composite-product-dialog :dialogVisible="compositeDialog" :productInfo="productInfo" :compositeProductData="compositeProductData"
            @on-cancle="cancleAddComposite" @on-confirm="submitAddComposite" @on-close="closeAddComposite"></composite-product-dialog>
        <auto-pricing-dialog :dialogVisible="pricingDialog" :countryList="countryList"></auto-pricing-dialog >
    </div>
</template>

<script>
    import CompositeProductDialog from './CompositeProductDialog'
    import AutoPricingDialog from './AutoPricingDialog'
    import { getProductEnumInfo } from '@/request/product'
    import { uploadFileRequest } from '@/request/file'

    export default {
        // 销售规格
        name: 'SaleSpecificationTable',
        props: {
            editType: {
                type: String,
                default: ''
            },
            productTitle: {
                type: String,
                default: ''
            },
            country: {
                type: String,
                default: ''
            },
            // 供货价货币类型
            supplyCurrency: {
                type: String,
            },
            currencyCode: {
                type: String,
                default: ''
            },
            saleSpecTypeModel: {
                type: Array,
                default: () => []
            },
            tableData: {
                type: Array,
                default: () => []
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                compositeDialog: false,
                pricingDialog: false,
                model: '',
                saleWayOption: [], // 销售方式
                saleStatusOption: [], // 销售状态
                deliveryWayOption: [], // 发货方式
                currencyOption: [], // 货币类型
                productInfo: {
                    title: this.productTitle
                },
                rowIndex: null,
                compositeProductData: [],
                tempCommission: null
            }
        },
        computed: {
            countryList() {
                return this.$store.state.dict.countryList
            },
            tableDataList: {
                get: function() {
                    return this.tableData;
                },
                set: function() {}
            },
            saleSpecType() {
                return this.saleSpecTypeModel
            },
            currency: {
                get: function() {
                    return this.supplyCurrency
                },
                set: function() {}
            }
        },
        watch: {
        },
        components: {
            CompositeProductDialog,
            AutoPricingDialog
        },
        mounted() {
            this.getProductEnumInfo()
        },
        methods: {
            handleClick() {
                console.log('currency:', this.currency)
                console.log(this.tableDataList)
            },
            handleClick2() {
                console.log(this.saleSpecType)
                console.log(this.tableDataList)
                this.$forceUpdate()
            },
            calcVolume (data, index, type) {
                let volume = data.l * data.w * data.h
                data.v = volume
                if (type === 'box') {
                    this.tableData[index].boxSpecification = data
                } else {
                    this.tableData[index].specification = data
                }
            },
            getProductEnumInfo() {
                let params = {}
                getProductEnumInfo(this.filterData(params)).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        this.saleWayOption = response.saleWay
                        this.saleStatusOption = response.saleStatus
                        this.deliveryWayOption = response.deliveryWay
                        this.currencyOption = response.currency
                    }
                })
            },
            uploadCoverPic(file) {
                let params = new FormData();
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'product'
                }
                params.append('file',file.file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        console.log(res)
                        let rowIndex = parseInt(file.action)
                        this.tableDataList[rowIndex].cover = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delCover(index) {
                this.tableDataList[index].cover = ''
            },
            uploadCoverSuccess(index) {
                 console.log(index)
            },
            removeCoverPic(index) {
                console.log(index)
            },
            // 强制刷新
            reload() {
                this.$forceUpdate()
            },
            // 数据同步
            syncData(field, value, rowIndex) {
                let data = {
                    field: field,
                    value: value,
                    rowIndex: rowIndex
                }
                this.$emit('on-sync-data', data)
            },
            handleChange(data) {
                console.log(data)
            },
            handleCurrencyChange(data) {
                this.$emit('on-sync-currency', data)
            },
            addCompositeProduct(rowData, rowIndex) {
                console.log(this.saleSpecTypeModel)
                let attrValueNameList = []
                _.forEach(this.saleSpecTypeModel, specType => {
                    if (rowData[specType.attrId]) {
                        attrValueNameList.push(rowData[specType.attrId])
                    }
                })
                this.productInfo.attrValueName = attrValueNameList.join('、')
                this.productInfo.countryCode = this.country
                this.compositeDialog = true
                this.rowIndex = rowIndex
                this.compositeProductData = []

                // if (rowData.composite && rowData.composite.length > 0) {
                //     this.compositeProductData = _.cloneDeep(rowData.composite)
                // }
            },
            viewCompositeProduct(rowData, rowIndex) {
                let attrValueNameList = []
                _.forEach(this.saleSpecTypeModel, specType => {
                    if (rowData[specType.attrId]) {
                        attrValueNameList.push(rowData[specType.attrId])
                    }
                })
                this.productInfo.attrValueName = attrValueNameList.join('、')
                this.productInfo.countryCode = this.country
                this.compositeDialog = true
                this.rowIndex = rowIndex
                let subSkuData = [] //
                _.forEach(rowData.compositeProduct.slaveSku, slaveSku => {
                    let subSkuItem = {}
                    subSkuItem.countryCode = rowData.compositeProduct.countryCode
                    subSkuItem.productId = rowData.compositeProduct.productId
                    subSkuItem.skuId = slaveSku.skuId
                    subSkuItem.skuCode = slaveSku.skuCode
                    subSkuItem.slaveSkuId = slaveSku.slaveSkuId
                    subSkuItem.deliveryNumber = slaveSku.deliveryNumber
                    subSkuItem.standardAttr = slaveSku.skuAttrValue
                    subSkuItem.skuName = slaveSku.skuName
                    subSkuData.push(subSkuItem)
                })
                this.compositeProductData = subSkuData
            },
            cancleAddComposite(data) {
                this.$set(this.tableDataList[this.rowIndex], 'composite', _.cloneDeep(data))
                if (data.length > 0) {
                    let compositeProduct = {}
                    compositeProduct.countryCode = data[0].countryCode
                    compositeProduct.productId = data[0].productId
                    let slaveSku = []
                    _.forEach(data, composite => {
                        let slaveSkuItem = {}
                        slaveSkuItem.deliveryNumber = composite.deliveryNumber
                        slaveSkuItem.skuAttrValue = composite.standardAttr
                        slaveSkuItem.skuId = composite.skuId
                        slaveSkuItem.skuCode = composite.skuCode
                        slaveSkuItem.skuName = composite.skuName
                        slaveSkuItem.slaveSkuId = composite.slaveSkuId
                        slaveSku.push(slaveSkuItem)
                    })
                    compositeProduct.slaveSku = slaveSku
                    this.$set(this.tableDataList[this.rowIndex], 'compositeProduct', compositeProduct)
                } else {
                    this.$delete(this.tableDataList[this.rowIndex], 'compositeProduct')
                }
                this.compositeDialog = false
            },
            submitAddComposite(data) {
                this.$set(this.tableDataList[this.rowIndex], 'composite', _.cloneDeep(data))
                if (data.length > 0) {
                    let compositeProduct = {}
                    compositeProduct.countryCode = data[0].countryCode
                    compositeProduct.productId = data[0].productId
                    let slaveSku = []
                    _.forEach(data, composite => {
                        let slaveSkuItem = {}
                        slaveSkuItem.deliveryNumber = composite.deliveryNumber
                        slaveSkuItem.skuAttrValue = composite.standardAttr
                        slaveSkuItem.skuId = composite.skuId
                        slaveSkuItem.skuCode = composite.skuCode
                        slaveSkuItem.skuName = composite.skuName
                        slaveSkuItem.slaveSkuId = composite.slaveSkuId
                        slaveSku.push(slaveSkuItem)
                    })
                    compositeProduct.slaveSku = slaveSku
                    this.$set(this.tableDataList[this.rowIndex], 'compositeProduct', compositeProduct)
                } else {
                    this.$delete(this.tableDataList[this.rowIndex], 'compositeProduct')
                }

                this.compositeDialog = false
            },
            closeAddComposite() {
                this.compositeDialog = false
            },
            saveTempCommission(data) {
                this.tempCommission = data
            },
            verifyCommission(data, index) {
                if (data > 30) {
                    this.$confirm('你输入的佣金率可能过高, 仍要保存吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '不保存',
                        type: 'warning'
                    }).then(
                    ).catch(() => {
                        this.tableDataList[index].commission = this.tempCommission
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                }

            }
        }
    }
</script>
<style lang="scss">
    .standard-img {
        width: 110px;
        height: 110px;
        .el-upload--picture-card {
            width: 110px;
            height: 110px;
            line-height: 120px;

        }
        .el-upload-list--picture-card .el-upload-list__item {
            width: 110px;
            height: 110px;
        }
    }

</style>
<style lang="scss" scoped>
    .cover-image {
        width: 110px;
        height: 110px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        padding: 4px;
        &:hover {
            .operate-area {
                opacity: .5;
                transition: opacity .3s;
                border-radius: 6px;
            }
        }
        .operate-area {
            position: absolute;
            opacity: 0;
            background: #000000;
            height: 110px;
            line-height: 110px;
            bottom: 0;
            left: 10px;
            width: 110px;
            box-sizing: border-box;
            color: #fff;
            font-size: 16px;
        }
    }
</style>
