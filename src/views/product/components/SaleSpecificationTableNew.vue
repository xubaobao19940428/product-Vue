<template>
    <div style="width: 100%">
        <el-table :data="currentTableData">
            <el-table-column
                v-if="editType=== 'edit'"
                label="SKUID"
                align="center"
                fixed
                prop="skuId"
                width="120"
            ></el-table-column>
            <el-table-column
                v-for="(item, index) in saleSpecType"
                :key="index"
                :prop="item.attrId"
                :label="item.cn"
                align="center"
                fixed
                width="120"
            ></el-table-column>
            <el-table-column label="规格图" align="center" width="130">
                <template slot-scope="scope">
                    <div class="cover-image" v-if="scope.row.cover">
                        <el-image
                            v-if="scope.row.cover && scope.row.cover.indexOf('http') === -1"
                            :src="dealShowFileSrc(scope.row.cover)"
                            fit="contain"
                        ></el-image>
                        <el-image v-else :src="scope.row.cover" fit="contain"></el-image>
                        <div class="operate-area">
                            <i class="el-icon-delete" @click="delCover(scope.$index)"></i>
                        </div>
                    </div>
                    <div class="cover-image" v-else>
                        <i class="el-icon-plus add-cover" @click="addCover(scope.$index)"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="销售方式" align="center" width="120">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.saleWay"
                        placeholder="请选择"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || (productSourceInfo.source === 6 && productSourceInfo.deliveryWay===2)"
                        @change="handleSkuChange(scope.row)"
                        size="mini"
                    >
                        <el-option
                            v-for="item in saleWayOption"
                            :key="item.saleWay"
                            :label="item.name"
                            :value="item.saleWay"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="发货方式" align="center" width="120">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.deliveryWay"
                        filterable
                        placeholder="请选择"
                        size="mini"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || ((productSourceInfo.source === 6 && productSourceInfo.deliveryWay === 2) || (productSourceInfo.source === 6 && productSourceInfo.deliveryWay === 1))"
                        @change="handleSkuChange(scope.row)"
                    >
                        <el-option
                            v-for="item in deliveryWayOption"
                            :key="item.deliveryWay"
                            :label="item.name"
                            :value="item.deliveryWay"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="入货仓库" width="120" align="center">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.warehouse"
                        placeholder="入货仓库"
                        size="mini"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        @change="handleSkuChange(scope.row)"
                    >
                        <el-option
                            v-for="item in wareHouseList"
                            :key="item.warehouseNo"
                            :label="item.warehouseName"
                            :value="item.warehouseNo"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="重量(kg)" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number
                        v-model="scope.row.weight"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="syncData('weight', scope.row.weight, scope.$index)"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        :precision="2"
                        size="mini"
                        style="width: 90%"
                        @change="handleSkuChange(scope.row)"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="单品规格" width="120" align="center">
                <template slot="header" slot-scope="scope">
                    单品规格(cm)
                    <p>(长,宽,高)</p>
                </template>
                <template slot-scope="scope">
                    <el-input-number
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="calcVolume(scope.row.specification, scope.$index, 'specification');syncData('specification.l', scope.row.specification.l, scope.$index)"
                        v-model="scope.row.specification.l"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        size="mini"
                        :precision="0"
                        style="width: 100%"
                    ></el-input-number>
                    <el-input-number
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="calcVolume(scope.row.specification, scope.$index, 'specification');syncData('specification.w', scope.row.specification.w, scope.$index)"
                        v-model="scope.row.specification.w"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        size="mini"
                        :precision="0"
                        style="width: 100%"
                    ></el-input-number>
                    <el-input-number
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="calcVolume(scope.row.specification, scope.$index, 'specification');syncData('specification.h', scope.row.specification.h, scope.$index)"
                        v-model="scope.row.specification.h"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        size="mini"
                        :precision="0"
                        style="width: 100%"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="箱体规格" width="120" align="center">
                <template slot="header" slot-scope="scope">
                    箱体规格(cm)
                    <p>(长,宽,高)</p>
                </template>
                <template slot-scope="scope">
                    <el-input-number
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="calcVolume(scope.row.boxSpecification, scope.$index, 'box');syncData('boxSpecification.l', scope.row.boxSpecification.l, scope.$index)"
                        v-model="scope.row.boxSpecification.l"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        size="mini"
                        :precision="0"
                        style="width: 100%"
                    ></el-input-number>
                    <el-input-number
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="calcVolume(scope.row.boxSpecification, scope.$index, 'box');syncData('boxSpecification.w', scope.row.boxSpecification.w, scope.$index)"
                        v-model="scope.row.boxSpecification.w"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        size="mini"
                        :precision="0"
                        style="width: 100%"
                    ></el-input-number>
                    <el-input-number
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="calcVolume(scope.row.boxSpecification, scope.$index, 'box');syncData('boxSpecification.h', scope.row.boxSpecification.h, scope.$index)"
                        v-model="scope.row.boxSpecification.h"
                        :controls="false"
                        :min="0"
                        :max="99999"
                        size="mini"
                        :precision="0"
                        style="width: 100%"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="供货价" width="150" align="center">
                <template slot="header" slot-scope="scope">
                    供货价
                    <el-select
                        v-model="currency"
                        @change="handleCurrencyChange"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        size="mini"
                        style="width: 120px;"
                    >
                        <el-option
                            v-for="item in currencyOption"
                            :key="item.currency"
                            :label="item.name+item.unit"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </template>
                <template slot-scope="scope">
                    <el-input-number
                        @blur="syncData('supplyPrice', scope.row.supplyPrice, scope.$index)"
                        v-model="scope.row.supplyPrice"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || !currency || index>0"
                        :controls="false"
                        :min="0"
                        :precision="2"
                        size="mini"
                        style="width: 90%"
                        @change="handleSkuChange(scope.row)"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="`${country === 'TH' ? '总': ''}佣金率%`" width="100" align="center">
                <template slot-scope="scope">
                    <el-input-number
                        v-model="scope.row.commission"
                        @focus="saveTempCommission(scope.row.commission)"
                        @blur="verifyCommission(scope.row.commission, scope.$index)"
                        :controls="false"
                        :min="0"
                        :max="60"
                        :precision="2"
                        size="mini"
                        style="width: 90%"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="'划线价(' + currencyCode +')'" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number
                        v-model="scope.row.price"
                        :controls="false"
                        :min="0"
                        :precision="2"
                        size="mini"
                        style="width: 90%"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        @change="handleSkuChange(scope.row)"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="'VIP价('+ currencyCode +')'" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number
                        v-model="scope.row.priceVip"
                        :controls="false"
                        :min="0"
                        :precision="2"
                        size="mini"
                        style="width: 90%"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        @change="handleSkuChange(scope.row)"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="'建议活动价('+ currencyCode +')'" width="120" align="center">
                <template slot-scope="scope">
                    <el-input-number
                        v-model="scope.row.activePrice"
                        :controls="false"
                        :min="0"
                        :precision="2"
                        size="mini"
                        style="width: 90%"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        @change="handleSkuChange(scope.row)"
                    ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="供应商商品编码" width="130" align="center">
                <template slot-scope="scope">
                    <el-input
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="syncData('supplierCode', scope.row.supplierCode, scope.$index)"
                        v-model="scope.row.supplierCode"
                        placeholder="请输入商品编码"
                        :maxlength="50"
                        size="mini"
                        style="width:100%"
                        @change="handleSkuChange(scope.row)"
                    ></el-input>
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
                    <el-input
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || index>0"
                        @blur="syncData('qrCode', scope.row.qrCode, scope.$index)"
                        v-model="scope.row.qrCode"
                        placeholder="请输入商品条形码"
                        :maxlength="50"
                        size="mini"
                        style="width:100%"
                        @change="handleSkuChange(scope.row)"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="商品组合" width="120" align="center">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        :underline="false"
                        v-if="scope.row.compositeProduct"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        @click="viewCompositeProduct(scope.row, scope.$index)"
                    >查看组合</el-link>
                    <el-link
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        type="primary"
                        :underline="false"
                        v-else
                        @click="addCompositeProduct(scope.row, scope.$index)"
                    >添加</el-link>
                </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
                <template slot-scope="scope">
                    <div v-if="editType=='check'">{{scope.row.inventory}}</div>
                    <div v-else>
                       {{scope.row.inventory||'-'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="销售状态" width="120" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.saleStatus"
                        filterable
                        placeholder="请选择"
                        size="mini"
                        :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                        @change="handleSkuChange(scope.row)"
                    >
                        <el-option
                            v-for="item in saleStatusOption"
                            :key="item.saleStatus"
                            :label="item.name"
                            :value="item.saleStatus"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :current-page="pageNum"
                :page-size="pageSize"
                @current-change="handlePageClick"
            ></el-pagination>
        </div>
        <composite-product-dialog
            :dialogVisible="compositeDialog"
            :productInfo="productInfo"
            :compositeProductData="compositeProductData"
            @on-cancle="cancleAddComposite"
            @on-confirm="submitAddComposite"
            @on-close="closeAddComposite"
        ></composite-product-dialog>
        <auto-pricing-dialog :dialogVisible="pricingDialog" :countryList="countryList"></auto-pricing-dialog>
        <sku-cover-select-dialog
            ref="skuCouverSelectDialog"
            :dialogVisible="skuCoverSelectVisible"
            @on-cancle="hanldeCancleSkuCoverSelect"
            @on-confirm="hanldeConfirmSkuCoverSelect"
        ></sku-cover-select-dialog>
    </div>
</template>

<script>
import CompositeProductDialog from "./CompositeProductDialog";
import AutoPricingDialog from "./AutoPricingDialog";
import SkuCoverSelectDialog from "./SkuCoverSelectDialog";
import { getProductEnumInfo } from "@/request/product";
import { uploadFileRequest } from "@/request/file";
import { warehousePage } from "@/request/warehouse";
// import plTable from "pl-table";
// import "pl-table/themes/index.css";
// Vue.use(plTable);

export default {
    // 销售规格
    name: "SaleSpecificationTable",
    props: {
        editType: {
            type: String,
            default: ""
        },
        productTitle: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        // 供货价货币类型
        supplyCurrency: {
            type: String
        },
        currencyCode: {
            type: String,
            default: ""
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
        },
        tableHeight: {
            type: Number,
            default: 0
        },
        productSourceInfo: {
            type: Object,
            default: () => {}
        },
        queryParams: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            compositeDialog: false,
            pricingDialog: false,
            model: "",
            saleWayOption: [], // 销售方式
            saleStatusOption: [], // 销售状态
            deliveryWayOption: [], // 发货方式
            wareHouseList: [], // 入货仓库
            currencyOption: [], // 货币类型
            productInfo: {
                title: this.productTitle
            },
            rowIndex: null,
            compositeProductData: [],
            tempCommission: null,
            skuCoverSelectVisible: false,
            rowIndex: null,
            updateDateMap: new Map(), //更变数据map
            pageNum: 1,
            pageSize: 5,
            total: 0,
            currentTableData: [], //当前表格数据
            queryTable: {
                attrId: null,
                value: null
            }, //表格查询参数
            queryTableData: [] //参数查询结果数据
        };
    },
    computed: {
        countryList() {
            return this.$store.state.dict.countryList;
        },
        tableDataList: {
            get: function() {
                return this.tableData;
            },
            set: function() {}
        },
        saleSpecType() {
            return this.saleSpecTypeModel;
        },
        currency: {
            get: function() {
                return this.supplyCurrency;
            },
            set: function() {}
        },
        tableHeightVal() {
            return this.tableHeight;
        }
    },
    components: {
        CompositeProductDialog,
        AutoPricingDialog,
        SkuCoverSelectDialog
    },
    watch: {
        tableData: function(newVal) {
            this.total = newVal.length;
            this.getCurrentTableData(newVal);
        }
    },
    mounted() {
        this.getProductEnumInfo();
        this.getWarehouseList();
        this.total = this.tableDataList.length;

        this.total = this.tableData.length;
        this.getCurrentTableData(this.tableData);

        this.$EventBus.$on("queryTableData", data => {
            this.pageNum = 1;
            if (data) {
                if (this.queryTable.value != data.value) {
                    this.queryTable = data;
                    const currentList = []; //当前显示列表
                    for (let i = 0; i < this.tableData.length; i++) {
                        const item = this.tableData[i];
                        if (item[data.attrId] == data.value) {
                            currentList.push(item);
                        }
                    }
                    this.total = currentList.length;
                    this.queryTableData = currentList;
                    this.getCurrentTableData(this.queryTableData);
                }
            } else {
                this.queryTableData = [];
                this.total = this.tableData.length;
                this.getCurrentTableData(this.tableData);
            }
        });
    },
    methods: {
        // 翻页
        handlePageClick(page) {
            this.pageNum = page;
            if (this.queryTableData.length > 0) {
                this.getCurrentTableData(this.queryTableData);
            } else {
                this.getCurrentTableData(this.tableData);
            }
        },
        //获得当前表格显示数据
        getCurrentTableData(data) {
            const startIndex = (this.pageNum - 1) * this.pageSize;
            const endIndex =
                startIndex + this.pageSize >= this.total
                    ? this.total
                    : startIndex + this.pageSize;
            this.currentTableData = data.slice(startIndex, endIndex);
            console.log('表格数据',this.currentTableData)
        },
        handleSkuChange(data) {
            this.updateDateMap.set(data.skuId, data);
            this.getUpdateSku();
        },
        getUpdateSku() {
            //获得更新数据
            return Array.from(this.updateDateMap.values());
        },
        handleClick() {
            console.log("currency:", this.currency);
            console.log(this.tableDataList);
        },
        handleClick2() {
            console.log(this.saleSpecType);
            console.log(this.tableDataList);
            this.$forceUpdate();
        },
        calcVolume(data, index, type) {
            index = index + (this.pageNum - 1) * this.pageSize;
            if (!_.isNumber(data.l)) {
                data.l = 0;
            }
            if (!_.isNumber(data.w)) {
                data.w = 0;
            }
            if (!_.isNumber(data.h)) {
                data.h = 0;
            }
            let volume = data.l * data.w * data.h;
            data.v = volume;
            if (type === "box") {
                this.tableData[index].boxSpecification = data;
            } else {
                this.tableData[index].specification = data;
            }

            //记录更变
            this.updateDateMap.set(
                this.tableData[index].skuId,
                this.tableData[index]
            );
        },
        getProductEnumInfo() {
            let params = {};
            getProductEnumInfo(this.filterData(params)).then(response => {
                console.log(response);
                if (response.ret.errcode === 1) {
                    this.saleWayOption = response.saleWay;
                    this.saleStatusOption = response.saleStatus;
                    this.deliveryWayOption = response.deliveryWay;
                    this.currencyOption = response.currency;
                }
            });
        },
        getWarehouseList() {
            let params = {
                page: {
                    pageSize: 10,
                    pageNum: 1
                }
            };
            warehousePage(this.filterData(params))
                .then(res => {
                    if (res.ret.errcode === 1) {
                        this.wareHouseList = res.list;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        uploadCoverPic(file) {
            let params = new FormData();
            let fileInfo = {
                fileName: file.file.name,
                type: "product"
            };
            params.append("file", file.file);
            params.append("param", JSON.stringify(fileInfo));
            let url = "/file/rest/uploadservices/uploadfile";
            uploadFileRequest(url, params)
                .then(res => {
                    if (res.status === "600") {
                        console.log(res);
                        let rowIndex = parseInt(file.action);
                        this.tableDataList[rowIndex].cover = res.original_link;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        delCover(index) {
            index = index + (this.pageNum - 1) * this.pageSize;
            this.tableDataList[index].cover = "";
            //记录更变
            this.updateDateMap.set(
                this.tableDataList[index].skuId,
                this.tableDataList[index]
            );
        },
        addCover(index) {
            index = index + (this.pageNum - 1) * this.pageSize;
            this.$emit("on-get-media-data");
            this.rowIndex = index;
            this.skuCoverSelectVisible = true;
        },
        uploadCoverSuccess(index) {
            console.log(index);
        },
        removeCoverPic(index) {
            console.log(index);
        },
        // 强制刷新
        reload() {
            this.$forceUpdate();
        },
        // 数据同步
        syncData(field, value, rowIndex) {
            let data = {
                field: field,
                value: value,
                rowIndex: rowIndex
            };
            this.$emit("on-sync-data", data);
        },
        handleChange(data) {
            console.log(data);
        },
        handleCurrencyChange(data) {
            this.$emit("on-sync-currency", data);
        },
        addCompositeProduct(rowData, rowIndex) {
            let attrValueNameList = [];
            _.forEach(this.saleSpecTypeModel, specType => {
                if (rowData[specType.attrId]) {
                    attrValueNameList.push(rowData[specType.attrId]);
                }
            });
            this.productInfo.attrValueName = attrValueNameList.join("、");
            this.productInfo.countryCode = this.country;
            this.compositeDialog = true;
            this.rowIndex = (this.pageNum - 1) * this.pageSize + rowIndex;
            this.compositeProductData = [];

            // if (rowData.composite && rowData.composite.length > 0) {
            //     this.compositeProductData = _.cloneDeep(rowData.composite)
            // }
        },
        viewCompositeProduct(rowData, rowIndex) {
            let attrValueNameList = [];
            _.forEach(this.saleSpecTypeModel, specType => {
                if (rowData[specType.attrId]) {
                    attrValueNameList.push(rowData[specType.attrId]);
                }
            });
            this.productInfo.attrValueName = attrValueNameList.join("、");
            this.productInfo.countryCode = this.country;
            this.compositeDialog = true;
            this.rowIndex = (this.pageNum - 1) * this.pageSize + rowIndex;
            let subSkuData = []; //
            _.forEach(rowData.compositeProduct.slaveSku, slaveSku => {
                let subSkuItem = {};
                subSkuItem.countryCode = rowData.compositeProduct.countryCode;
                subSkuItem.productId = rowData.compositeProduct.productId;
                subSkuItem.skuId = slaveSku.skuId;
                subSkuItem.skuCode = slaveSku.skuCode;
                subSkuItem.slaveSkuId = slaveSku.slaveSkuId;
                subSkuItem.deliveryNumber = slaveSku.deliveryNumber;
                subSkuItem.standardAttr = slaveSku.skuAttrValue;
                subSkuItem.skuName = slaveSku.skuName;
                subSkuData.push(subSkuItem);
            });
            this.compositeProductData = subSkuData;
        },
        cancleAddComposite(data) {
            this.$set(
                this.tableDataList[this.rowIndex],
                "composite",
                _.cloneDeep(data)
            );
            if (data.length > 0) {
                let compositeProduct = {};
                compositeProduct.countryCode = data[0].countryCode;
                compositeProduct.productId = data[0].productId;
                let slaveSku = [];
                _.forEach(data, composite => {
                    let slaveSkuItem = {};
                    slaveSkuItem.deliveryNumber = composite.deliveryNumber;
                    slaveSkuItem.skuAttrValue = composite.standardAttr;
                    slaveSkuItem.skuId = composite.skuId;
                    slaveSkuItem.skuCode = composite.skuCode;
                    slaveSkuItem.skuName = composite.skuName;
                    slaveSkuItem.slaveSkuId = composite.slaveSkuId;
                    slaveSku.push(slaveSkuItem);
                });
                compositeProduct.slaveSku = slaveSku;
                this.$set(
                    this.tableDataList[this.rowIndex],
                    "compositeProduct",
                    compositeProduct
                );
            } else {
                this.$delete(
                    this.tableDataList[this.rowIndex],
                    "compositeProduct"
                );
            }
            this.compositeDialog = false;
        },
        submitAddComposite(data) {
            this.$set(
                this.tableDataList[this.rowIndex],
                "composite",
                _.cloneDeep(data)
            );
            if (data.length > 0) {
                let compositeProduct = {};
                compositeProduct.countryCode = data[0].countryCode;
                compositeProduct.productId = data[0].productId;
                let slaveSku = [];
                _.forEach(data, composite => {
                    let slaveSkuItem = {};
                    slaveSkuItem.deliveryNumber = composite.deliveryNumber;
                    slaveSkuItem.skuAttrValue = composite.standardAttr;
                    slaveSkuItem.skuId = composite.skuId;
                    slaveSkuItem.skuCode = composite.skuCode;
                    slaveSkuItem.skuName = composite.skuName;
                    slaveSkuItem.slaveSkuId = composite.slaveSkuId;
                    slaveSku.push(slaveSkuItem);
                });
                compositeProduct.slaveSku = slaveSku;
                this.$set(
                    this.tableDataList[this.rowIndex],
                    "compositeProduct",
                    compositeProduct
                );
            } else {
                this.$delete(
                    this.tableDataList[this.rowIndex],
                    "compositeProduct"
                );
            }

            //更新数据
            this.updateDateMap.set(
                this.tableDataList[this.rowIndex].skuId,
                this.tableDataList[this.rowIndex]
            );

            this.compositeDialog = false;
        },
        closeAddComposite() {
            this.compositeDialog = false;
        },
        saveTempCommission(data) {
            this.tempCommission = data;
        },
        verifyCommission(data, index) {
            index = index + (this.pageNum - 1) * this.pageSize;
            if (data > 30) {
                this.$confirm("你输入的佣金率可能过高, 仍要保存吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "不保存",
                    type: "warning"
                })
                    .then(() => {
                        // 保存更新数据
                        this.updateDateMap.set(
                            this.tableDataList[index].skuId,
                            this.tableDataList[index]
                        );
                    })
                    .catch(() => {
                        this.tableDataList[
                            index
                        ].commission = this.tempCommission;
                        this.$message({
                            type: "info",
                            message: "已取消"
                        });
                    });
            }
        },
        hanldeCancleSkuCoverSelect() {
            this.skuCoverSelectVisible = false;
        },
        hanldeConfirmSkuCoverSelect(cover) {
            this.skuCoverSelectVisible = false;
            // this.syncTempData.cover = cover
            this.tableDataList[this.rowIndex].cover = cover;
            //记录更变
            this.updateDateMap.set(
                this.tableDataList[this.rowIndex].skuId,
                this.tableDataList[this.rowIndex]
            );
        }
    }
};
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
.el-table .pl-table-beyond {
    white-space: normal !important;
}
</style>
<style lang="scss" scoped>
.cover-image {
    position: relative;
    width: 110px;
    height: 110px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    padding: 4px;
    margin: 0 auto;
    &:hover {
        .operate-area {
            opacity: 0.5;
            transition: opacity 0.3s;
            border-radius: 6px;
        }
    }
    .operate-area {
        position: absolute;
        opacity: 0;
        background: #000000;
        height: 110px;
        line-height: 110px;
        // bottom: 0;
        top: 0;
        // left: 10px;
        left: 0;
        width: 110px;
        box-sizing: border-box;
        color: #fff;
        font-size: 16px;
        text-align: center;
        i {
            cursor: pointer;
        }
    }
    .add-cover {
        color: #8c939d;
        font-size: 30px;
        padding: 36px;
        cursor: pointer;
    }
}
.table-item-label {
    width: 30%;
    float: left;
    text-align: right;
}
.table-item-value {
    width: 70%;
    float: left;
    .table-mini-input {
        width: 70%;
        margin-bottom: 10px;
    }
    .table-input {
        width: 70%;
    }
}

.pagination {
    width: 100%;
    margin-top: 30px;
    text-align: center;
}
</style>
