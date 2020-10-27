<template>
    <!-- 未选择销售国家时不显示 -->
    <div class="standard-attr-wrapper" v-if="saleCountryList.length > 0">
        <el-form ref="productStandrdAttrForm" label-width="80px">
            <el-form-item label="选择规格：">
                <p class="tips">请确保所选规格正确完整！一旦创建好商品，无法再修改规格</p>
                <el-select
                    v-model="productStandrdAttr"
                    :disabled="editType==='edit'"
                    size="medium"
                    :multiple-limit="3"
                    multiple
                    filterable
                    default-first-option
                    placeholder="请选择"
                    style="width: 400px"
                    @change="handleStandardChange"
                >
                    <el-option
                        v-for="item in standardAttrs"
                        :key="item.attrId"
                        :label="item.cn + '/' + item.en"
                        :value="item.attrId"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form label-width="80px" v-for="(item, index) in selectedStandard" :key="index">
            <standard-item
                :ref="'standardItem'+item.attrId"
                :editType="editType"
                :standardInfo="item"
                :attrValueModel="attrValueModelList[index]"
                @on-standard-change="handleStandardValueChange"
                @on-standard-change-index="selectIndex=index"
                @on-standard-update="handleStandardValueUpdate"
                @on-attr-remove="handleAttrRemove"
            ></standard-item>
        </el-form>
        <el-form label-width="80px">
            <el-form-item label="销售规格：">
                <div class="sell-tips">
                    <p
                        class="tips"
                    >1. 纵向同步数据：如果商品规格较多，且同规格下某字段值相同，可在批量填充栏选择需同步的规格并在右侧目标字段中输入目标值，最后点击同步该列；</p>
                    <p class="tips">2. 横向同步数据：如果商品适用多国，且某字段值在各国都相同，可在相应的输入框输入内容，最后并点击同步国家；</p>
                    <p
                        class="tips"
                    >3. 自动定价：输入各规格重量、单品体积、箱体体积、供货价、佣金率，选择自动定价，选择需要自动定价的国家和价格项，即可完成定价，自动定价不会覆盖已录入的价格；</p>
                    <p class="tips">4. 销售信息至关重要，保存前请仔细检查每个国家每一项信息。</p>
                </div>
            </el-form-item>
            <div class="sync-options">
                <el-button
                    :loading="syncColumnLoading"
                    type="primary"
                    size="mini"
                    plain
                    @click="syncColumnData"
                >同步该列</el-button>
                <el-button
                    :loading="syncCountryLoading"
                    type="primary"
                    size="mini"
                    plain
                    @click="syncCountryData"
                >同步至其他国家</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="showAutoPricing"
                    v-if="editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))"
                >自动定价</el-button>
                <!-- <el-button type="primary" size="mini" plain @click="autoPricing">自动定价</el-button> -->
            </div>
            <div class="spec-table">
                <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <div class="sync-option-wrapper">
                        <div class="left" :style="{width: tableLeftWidth + 'px'}">
                            <div
                                class="param-item-wrapper"
                                style="padding: 0px"
                                :style="{width: (tableLeftWidth - saleSpecInfoList.length * 120 - 130)+ 'px'}"
                            ></div>
                            <div
                                class="param-item-wrapper"
                                style="margin-top: 70px"
                                v-for="(item, index) in saleSpecInfoList"
                                :key="index"
                            >
                                <el-select
                                    v-if="item"
                                    v-model="syncTempData['attr'+item.standardInfo.attrId]"
                                    clearable
                                    placeholder="请选择"
                                    size="mini"
                                    class="param-item"
                                    @change="(data) => { handleChangeProp(data, item, index);}"
                                >
                                    <el-option
                                        v-for="item in item.standardValueList"
                                        :key="item.saleWay"
                                        :label="item.cn"
                                        :value="item.attrId"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="cover-image-wrapper" style="width: 120px;">
                                <div class="cover-image" v-if="syncTempData.cover">
                                    <el-image
                                        :src="dealShowFileSrc(syncTempData.cover)"
                                        fit="contain"
                                    ></el-image>
                                    <div class="operate-area">
                                        <i class="el-icon-delete" @click="delCover()"></i>
                                    </div>
                                </div>
                                <div class="cover-image" v-else>
                                    <i class="el-icon-plus add-cover" @click="addCover()"></i>
                                </div>
                            </div>
                        </div>
                        <div class="center">
                            <div class="param-item-wrapper">
                                <el-select
                                    v-model="syncTempData.saleWay"
                                    clearable
                                    placeholder="销售方式"
                                    size="mini"
                                    class="param-item"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                >
                                    <el-option
                                        v-for="item in saleWayOption"
                                        :key="item.saleWay"
                                        :label="item.name"
                                        :value="item.saleWay"
                                    ></el-option>
                                </el-select>
                            </div>
                            <span class="param-item-wrapper">
                                <el-select
                                    v-model="syncTempData.deliveryWay"
                                    clearable
                                    placeholder="发货方式"
                                    size="mini"
                                    class="param-item"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                >
                                    <el-option
                                        v-for="item in deliveryWayOption"
                                        :key="item.deliveryWay"
                                        :label="item.name"
                                        :value="item.deliveryWay"
                                    ></el-option>
                                </el-select>
                            </span>
                            <span class="param-item-wrapper">
                                <el-select
                                    v-model="syncTempData.warehouse"
                                    placeholder="入货仓库"
                                    size="mini"
                                    class="param-item"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                >
                                    <el-option
                                        v-for="item in wareHouseList"
                                        :key="item.warehouseNo"
                                        :label="item.warehouseName"
                                        :value="item.warehouseNo"
                                    ></el-option>
                                </el-select>
                            </span>
                            <span class="param-item-wrapper">
                                <el-input
                                    v-model="syncTempData.weight"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    :precision="2"
                                    size="mini"
                                    placeholder="重量(KG)"
                                    class="param-item"
                                ></el-input>
                            </span>
                            <div class="param-item-wrapper">
                                <div class="param-item-title">单品规格(cm)</div>
                                <el-input-number
                                    v-model="syncTempData.specification.l"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    @blur="calcVolume(syncTempData.specification, 'specification')"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    placeholder="长"
                                    size="mini"
                                    class="param-item-block"
                                ></el-input-number>
                                <el-input-number
                                    v-model="syncTempData.specification.w"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    @blur="calcVolume(syncTempData.specification, 'specification')"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    placeholder="宽"
                                    size="mini"
                                    class="param-item-block"
                                ></el-input-number>
                                <el-input-number
                                    v-model="syncTempData.specification.h"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    @blur="calcVolume(syncTempData.specification, 'specification')"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    placeholder="高"
                                    size="mini"
                                    class="param-item-block"
                                ></el-input-number>
                            </div>
                            <div class="param-item-wrapper">
                                <div class="param-item-title">箱体规格(cm)</div>
                                <el-input-number
                                    v-model="syncTempData.boxSpecification.l"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    @blur="calcVolume(syncTempData.boxSpecification, 'box')"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    placeholder="长"
                                    size="mini"
                                    class="param-item-block"
                                ></el-input-number>
                                <el-input-number
                                    v-model="syncTempData.boxSpecification.w"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    @blur="calcVolume(syncTempData.boxSpecification, 'box')"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    placeholder="宽"
                                    size="mini"
                                    class="param-item-block"
                                ></el-input-number>
                                <el-input-number
                                    v-model="syncTempData.boxSpecification.h"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    @blur="calcVolume(syncTempData.boxSpecification, 'box')"
                                    :controls="false"
                                    :min="0"
                                    :max="99999"
                                    placeholder="高"
                                    size="mini"
                                    class="param-item-block"
                                ></el-input-number>
                            </div>
                            <span style="padding: 0 10px">
                                <el-input
                                    v-model="syncTempData.supplyPrice"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0' || currencyType == ''"
                                    :controls="false"
                                    :min="0"
                                    :precision="2"
                                    size="mini"
                                    placeholder="供货价"
                                    style="width: 130px;"
                                ></el-input>
                            </span>
                            <span style="padding: 0 10px">
                                <el-input
                                    v-model="syncTempData.commission"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                    :controls="false"
                                    :min="0"
                                    :max="60"
                                    :precision="2"
                                    size="mini"
                                    :placeholder="`${saleCountryList[activeIndex].shortCode === 'TH' ? '总' : ''}佣金率`"
                                    style="width: 80px;"
                                ></el-input>
                            </span>
                            <span class="param-item-wrapper">
                                <el-input
                                    v-model="syncTempData.price"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                    :controls="false"
                                    :min="0"
                                    :precision="2"
                                    size="mini"
                                    placeholder="划线价"
                                    class="param-item"
                                ></el-input>
                            </span>
                            <span class="param-item-wrapper">
                                <el-input
                                    v-model="syncTempData.priceVip"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                    :controls="false"
                                    :min="0"
                                    :precision="2"
                                    size="mini"
                                    placeholder="VIP价"
                                    class="param-item"
                                ></el-input>
                            </span>
                            <span class="param-item-wrapper">
                                <el-input
                                    v-model="syncTempData.activePrice"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                    :controls="false"
                                    :min="0"
                                    :precision="2"
                                    size="mini"
                                    placeholder="建议活动价"
                                    class="param-item"
                                ></el-input>
                            </span>
                            <span class="param-item-wrapper">
                                <el-input
                                    v-model="syncTempData.supplierCode"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    :maxlength="50"
                                    size="mini"
                                    placeholder="请输入商品编码"
                                    class="param-item"
                                ></el-input>
                            </span>
                            <div class="param-item-wrapper" style="width: 280px"></div>
                            <span class="param-item-wrapper">
                                <el-input
                                    v-model="syncTempData.qrCode"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))) || activeIndex != '0'"
                                    :maxlength="50"
                                    size="mini"
                                    placeholder="请输入商品条形码"
                                    class="param-item"
                                ></el-input>
                            </span>
                            <div class="param-item-wrapper"></div>
                        </div>
                        <div class="right">
                            <div class="param-item-wrapper" style="margin-top: 70px">
                                <el-select
                                    v-model="syncTempData.saleStatus"
                                    clearable
                                    placeholder="销售状态"
                                    size="mini"
                                    class="param-item"
                                    :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))"
                                >
                                    <el-option
                                        v-for="item in saleStatusOption"
                                        :key="item.saleStatus"
                                        :label="item.name"
                                        :value="item.saleStatus"
                                    ></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <el-tab-pane
                        v-for="(item, index) in saleCountryList"
                        :key="index"
                        :label="item.nameLocal"
                        :name="item.nameLocal"
                    >
                        <sale-specification-table-new
                            :ref="'saleSpecificationTable' + item.shortCode"
                            :editType="editType"
                            :country="item.shortCode"
                            :productTitle="productTitle"
                            :supplyCurrency="supplyCurrencyObj[item.shortCode]"
                            :currencyCode="item.currencyCode"
                            :saleSpecTypeModel="selectedStandard"
                            :tableHeight="allCountryTableData[item.shortCode] ? (allCountryTableData[item.shortCode].length * 140 + 120) : 120"
                            :tableData="allCountryTableData[item.shortCode]"
                            :index="index"
                            :productSourceInfo="productSourceInfo"
                            @on-sync-data="syncData"
                            @on-sync-currency="syncCurrency"
                            @on-get-media-data="handleGetMediaData"
                        ></sale-specification-table-new>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-form>
        <auto-pricing-dialog
            ref="autoPricingDialog"
            :dialogVisible="pricingDialog"
            :category="category"
            :autoPricingModel="autoPricingModel"
            @on-cancle="hanldeCancleAutoPricing"
            @on-confirm="hanldeConfirmAutoPricing"
        ></auto-pricing-dialog>
        <sku-cover-select-dialog
            ref="skuCouverSelectDialog"
            :dialogVisible="skuCoverSelectVisible"
            @on-cancle="hanldeCancleSkuCoverSelect"
            @on-confirm="hanldeConfirmSkuCoverSelect"
        ></sku-cover-select-dialog>
        <!-- <el-button type="success" size="mini" @click="getSKUData">当前模块数据</el-button> -->
    </div>
</template>

<script>
import _ from "lodash";
import StandardItem from "./StandardItem";
import SaleSpecificationTable from "./SaleSpecificationTable";
import SaleSpecificationTableNew from "./SaleSpecificationTableNew";
import AutoPricingDialog from "./AutoPricingDialog";
import SkuCoverSelectDialog from "./SkuCoverSelectDialog";
import {
    getProductEnumInfo,
    productAttrGetByIdBatch,
    exchangeGetRecentRateTemplate,
    exchangeGetRate
} from "@/request/product";
import { uploadFileRequest } from "@/request/file";
import { warehousePage } from "@/request/warehouse";

export default {
    // 商品规格属性
    name: "ProductStandrdAttrForm",
    props: {
        editType: {
            type: String,
            default: ""
        },
        productTitle: {
            type: String,
            default: ""
        },
        // 已选类目下的全部规格属性
        standardAttrs: {
            type: Array,
            default: () => []
        },
        //已选规格集合
        selectedStandardModel: {
            type: Array,
            default: () => []
        },
        allCountryTableDataModel: {
            type: Object,
            default: () => {}
        },
        // 已选规格属性对应的属性值（二维数组）
        attrValueModelList: {
            type: Array,
            default: () => []
        },
        supplyCurrencyObj: {
            type: Object,
            default: () => {}
        },
        categoryLink: {
            type: Array,
            default: () => []
        },
        category: {
            type: String,
            default: ""
        },
        productSourceInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            syncColumnLoading: false,
            syncCountryLoading: false,
            standardOptions: [
                {
                    value: 1,
                    label: "颜色"
                },
                {
                    value: 2,
                    label: "尺寸"
                },
                {
                    value: 3,
                    label: "重量"
                }
            ],
            value: "",
            options: [],
            selectIndex: 1,
            saleAttr: [], // 已选的规格属性值集合
            tableData: [],
            tableItem: {},
            standardAttrData: null,
            testArr: [
                "黑色_183,小_112",
                "黑色_183,大_111",
                "红色_184,小_112",
                "红色_184,大_111"
            ],
            tableItmeData: {
                cover: null,
                saleWay: null,
                deliveryWay: null,
                weight: null,
                supplyPrice: null,
                commission: null,
                price: null,
                priceVip: null,
                activePrice: null,
                stock: null,
                activeStock: null,
                warehouse: null,
                supplierCode: null,
                qrCode: null,
                saleStatus: null,
                specification: {
                    h: 0,
                    l: 0,
                    v: 0,
                    w: 0
                },
                boxSpecification: {
                    h: 0,
                    l: 0,
                    v: 0,
                    w: 0
                }
            },
            AttrValueInfo: [],
            pricingDialog: false,
            syncTempData: {
                cover: "",
                saleWay: "",
                deliveryWay: "",
                warehouse: "",
                weight: "",
                supplyPrice: "",
                commission: "",
                price: "",
                priceVip: "",
                activePrice: "",
                supplierCode: "",
                skuCode: "",
                skuCodeKey: "",
                qrCode: "",
                compositeProduct: "",
                saleStatus: "",
                specification: {
                    h: 0,
                    l: 0,
                    v: 0,
                    w: 0
                },
                boxSpecification: {
                    h: 0,
                    l: 0,
                    v: 0,
                    w: 0
                }
            },
            activeCountryShortCode: "",
            saleWayOption: [], // 销售方式
            saleStatusOption: [], // 销售状态
            deliveryWayOption: [], // 发货方式
            wareHouseList: [], // 入货仓库
            activeIndex: "0",
            saleSpecInfoList: [],
            currencyType: "",
            exchangeRateList: {},
            reversRateMap: {},
            skuCoverSelectVisible: false,
            priceTemp: {
                // MY: {
                //     domesticExpressFee: '2.00',
                //     domesticWarehousingFee: '1.30',
                //     airVolumePrice: '17.00',
                //     airVolumeUnit: '60000.00',
                //     airWeightPrice: '17.00',
                //     airWeightUnit: '1.00',
                //     oceanVolumeUnit: '800.00',
                //     oceanVolumePrice: '1000000.00',
                //     internationalWarehousingFee: '4.30',
                //     paymentPassageFee: '1.60',
                //     grossInterestRate: '60.00',
                //     cashServiceFee: '0.00',
                //     vipGrossInterestRate: '25.00',
                //     operatingFee: '13.00',
                //     activeGrossInterestRate: '10.00'
                // },
                // TH: {
                //     domesticExpressFee: '3.00',
                //     domesticWarehousingFee: '1.40',
                //     airVolumePrice: '18.00',
                //     airVolumeUnit: '70000.00',
                //     airWeightPrice: '18.00',
                //     airWeightUnit: '1.00',
                //     oceanVolumeUnit: '700.00',
                //     oceanVolumePrice: '1000000.00',
                //     internationalWarehousingFee: '5.30',
                //     paymentPassageFee: '1.60',
                //     grossInterestRate: '60.00',
                //     cashServiceFee: '0.00',
                //     vipGrossInterestRate: '25.00',
                //     operatingFee: '13.00',
                //     activeGrossInterestRate: '10.00'
                // }
            },
            // 人民币对其他币种汇率
            exchangeRateCNY: {},
            //其他币种对人民币汇率
            exchangeRateOther: 1,
            currentRatetemplateCode: "",
            autoPricingModel: {
                checkedCountry: [],
                template: {},
                transport: 2
            }
        };
    },
    components: {
        StandardItem,
        SaleSpecificationTable,
        AutoPricingDialog,
        SaleSpecificationTableNew,
        SkuCoverSelectDialog
    },
    computed: {
        saleCountryList() {
            let saleCountryList = this.$store.state.dict.saleCountryList;
            _.forEach(saleCountryList, country => {
                this.$set(
                    this.autoPricingModel.template,
                    country.shortCode,
                    ""
                );
            });
            return saleCountryList;
        },
        firstSaleCountry() {
            let shortCode = "";
            if (this.saleCountryList.length > 0) {
                shortCode = this.saleCountryList[0].shortCode;
            }
            return shortCode;
        },
        activeName: {
            get: function() {
                let activeName = "";
                if (this.saleCountryList.length > 0) {
                    activeName = this.saleCountryList[0].nameLocal;
                    this.activeCountryShortCode = this.saleCountryList[0].shortCode;
                }
                return activeName;
            },
            set: function() {}
        },
        selectedStandard() {
            return this.selectedStandardModel;
        },
        allCountryTableData() {
            let firstAttr = this.getFirst(this.allCountryTableDataModel);
            if (firstAttr && firstAttr[0]) {
                this.currencyType = firstAttr[0].currencyCode;
            }
            return this.allCountryTableDataModel;
        },
        productStandrdAttr: {
            get: function() {
                let standardAttrId = [];
                _.forEach(this.selectedStandardModel, standard => {
                    standardAttrId.push(standard.attrId);
                });
                return standardAttrId;
            },
            set: function() {}
        },
        tableLeftWidth() {
            let leftWidth = 130;
            leftWidth = leftWidth + this.selectedStandard.length * 120;
            if (this.editType === "edit") {
                leftWidth += 120;
            }
            return leftWidth;
        }
    },
    watch: {
        saleCountryList: function(newValue, oldValue) {
            if (this.editType === "add") {
                if (newValue.length === 1 && oldValue.length === 0) {
                    this.initSkuTableData();
                } else if (newValue.length > 1) {
                    // 新增国家时，直接复制第一个国家的SKU数据
                    let firstCountryData = _.cloneDeep(
                        this.allCountryTableDataModel[newValue[0].shortCode]
                    );
                    // 组合商品不复制，避免该商品未在该国家上架
                    _.forEach(firstCountryData, row => {
                        row.compositeProduct = null;
                    });
                    _.forEach(firstCountryData, item => {
                        item.countryCode =
                            newValue[newValue.length - 1].shortCode;
                    });
                    this.allCountryTableDataModel[
                        newValue[newValue.length - 1].shortCode
                    ] = firstCountryData;
                }
            } else {
                if (oldValue.length === 0) {
                    this.allCountryTableDataModel = this.allCountryTableData;
                } else if (
                    newValue.length != oldValue.length &&
                    newValue.length > 1 &&
                    oldValue.length > 0
                ) {
                    // 新增国家时，直接复制第一个国家的SKU数据
                    let firstCountryData = _.cloneDeep(
                        this.allCountryTableDataModel[newValue[0].shortCode]
                    );
                    _.forEach(firstCountryData, item => {
                        item.countryCode =
                            newValue[newValue.length - 1].shortCode;
                    });
                    // 组合商品不复制，避免该商品未在该国家上架
                    _.forEach(firstCountryData, row => {
                        row.compositeProduct = null;
                    });
                    this.allCountryTableDataModel[
                        newValue[newValue.length - 1].shortCode
                    ] = firstCountryData;
                }
            }
        }
    },
    mounted() {
        this.getProductEnumInfo();
        this.getWarehouseList();
        this.getExchangeRecentRateTemplate();
    },
    methods: {
        //监听查询项修改事件
        handleChangeProp(data, item, index) {
            if (index != 0) {
                return;
            }

            let queryParams = null;
            if (data) {
                let val = "";
                const arr = item.standardValueList || [];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].attrId == data) {
                        val = arr[i].cn;
                        break;
                    }
                }
                queryParams = {
                    attrId: item.standardInfo.attrId,
                    value: val
                };
            } else {
                queryParams = null;
            }

            this.$EventBus.$emit("queryTableData", queryParams);
        },
        /**
         * 监听规格更改, 发生变化清空全部tableData
         */
        handleStandardChange(data) {
            // 清空已选规格
            this.selectedStandard.length = 0;
            this.productStandrdAttr = data;
            if (data.length === 0) {
                this.$delete(this.selectedStandard, 0);
            }
            // _.forEach(this.saleCountryList, country => {
            //     this.$delete(this.allCountryTableData, country.shortCode)
            //     // this.$refs['saleSpecificationTable' + country.shortCode][0].reload()
            // })
            // console.log(this.allCountryTableData)
            if (data.length > 0) {
                // 遍历添加已选规格
                _.forEach(data, value => {
                    _.forEach(this.standardAttrs, (item, index) => {
                        if (value === item.attrId) {
                            this.$set(
                                this.selectedStandard,
                                this.selectedStandard.length,
                                item
                            );
                        }
                    });
                });
            } else {
                // 强制刷新子组件
                // _.forEach(this.saleCountryList, country => {
                // this.$refs['saleSpecificationTable' + country.shortCode][0].reload()
                // })
                this.initSkuTableData();
                // console.log(this.allCountryTableData)
            }
        },
        getProductAttrById(attrId) {
            let params = {
                attrId: attrId
            }(params).then(response => {
                if (response.ret.errcode === 1) {
                    let optionList = [];
                    _.forEach(response.attrValue, item => {
                        let optionItem = {
                            label: "",
                            value: ""
                        };
                        optionItem.label = item.valueName[0].name;
                        optionItem.value = item.valueId;
                        optionList.push(optionItem);
                        this.$set(
                            this.paramAttrOption,
                            response.attrId,
                            optionList
                        );
                    });
                    // console.log(this.paramAttrOption)
                }
            });
        },
        getAllAttrOpions(paramAttrs) {
            _.forEach(paramAttrs, item => {
                this.getProductAttrById(item.attrId);
            });
        },
        // 未选择规格时，默认初始化一条sku table数据
        initSkuTableData() {
            let tableItemData = {
                countryCode: "",
                cover: null,
                saleWay: null,
                deliveryWay: null,
                weight: null,
                supplyPrice: null,
                commission: null,
                price: null,
                priceVip: null,
                activePrice: null,
                stock: null,
                activeStock: null,
                warehouse: null,
                supplierCode: null,
                qrCode: null,
                saleStatus: null,
                specification: {
                    h: 0,
                    l: 0,
                    v: 0,
                    w: 0
                },
                boxSpecification: {
                    h: 0,
                    l: 0,
                    v: 0,
                    w: 0
                }
            };
            _.forEach(this.saleCountryList, (item, key) => {
                tableItemData.countryCode = item.shortCode;
                this.$set(this.allCountryTableData, item.shortCode, [
                    _.cloneDeep(tableItemData)
                ]);
            });
        },
        /**
         * 监听规格属性值更改
         */
        handleStandardValueChange(data) {
            this.saleAttr[this.selectIndex] = data;
            let attrArr = [];
            _.forEach(this.saleAttr, item => {
                let sub = [];
                _.forEach(item, subItem => {
                    sub.push(subItem.cn + "_" + subItem.attrId);
                });
                attrArr.push(sub);
            });
            let noEmptyArr = [];
            _.forEach(attrArr, item => {
                if (item.length > 0) {
                    noEmptyArr.push(item);
                }
            });
            let result = this.combination(noEmptyArr);

            let tempData = [];
            let tempAttrValueData = [];
            _.forEach(result, item => {
                let rowData = {};
                let rowValueData = {};
                _.forEach(this.selectedStandard, (satandard, index) => {
                    if (item.split(",").length > 1) {
                        rowData[satandard.attrId] = item
                            .split(",")
                            [index].split("_")[0];
                        rowValueData[satandard.attrId + "_value"] = item
                            .split(",")
                            [index].split("_")[1];
                    } else {
                        rowData[satandard.attrId] = item.split("_")[0];
                        rowValueData[satandard.attrId + "_value"] = item.split(
                            "_"
                        )[1];
                    }
                });
                tempData.push(rowData);
                tempAttrValueData.push(rowValueData);
            });
            if (result) {
                this.verifyData(
                    this.selectedStandard,
                    result,
                    tempData,
                    tempAttrValueData
                );
            }

            // let AttrValueInfoList = []
            // _.forEach(result, item => {
            //     let list = []
            //     _.forEach(this.selectedStandard, (satandard , index)=> {
            //         let attrValue = {}
            //         attrValue.attrId = satandard.attrId
            //         if (item.split(',') > 1) {
            //             attrValue.valueId = (item.split(',')[index]).split('_')[1]
            //         } else {
            //             attrValue.valueId = item.split('_')[1]
            //         }
            //         list.push(attrValue)
            //     })
            //     AttrValueInfoList.push(list)
            // })

            // this.AttrValueInfo = _.uniqWith(_.flattenDeep(AttrValueInfoList), _.isEqual)

            // console.log(tempData)
            // console.log(this.AttrValueInfo)
        },
        // 选择规格 并且 各个规格具体属性值后
        verifyData(standard, standardValue, tempData, tempAttrValueData) {
            if (standard.length === standardValue[0].split(",").length) {
                // console.log('满足排列组合')
                // console.log(tempData)
                // console.log(this.allCountryTableData)

                _.forEach(this.saleCountryList, country => {
                    let tempTabelData = [];
                    _.forEach(tempData, (temp, index) => {
                        let dataIndex = _.findIndex(
                            this.allCountryTableData[country.shortCode],
                            temp
                        );
                        let dataObj = {};
                        if (dataIndex > -1) {
                            dataObj = _.find(
                                this.allCountryTableData[country.shortCode],
                                temp
                            );
                        } else {
                            dataObj = this.createTempData(temp);
                            dataObj.countryCode = country.shortCode;
                        }
                        dataObj = Object.assign(
                            dataObj,
                            tempAttrValueData[index]
                        );
                        tempTabelData.push(dataObj);
                    });
                    this.$set(
                        this.allCountryTableData,
                        country.shortCode,
                        tempTabelData
                    );
                    // this.allCountryTableData[country.shortCode] = tempTabelData
                });
                // console.log("this.allCountryTableData", this.allCountryTableData)
            }
        },
        createTempData(temp) {
            let tableItemData = {
                countryCode: null,
                cover: null,
                saleWay: null,
                deliveryWay: null,
                weight: null,
                supplyPrice: null,
                commission: null,
                price: null,
                priceVip: null,
                activePrice: null,
                stock: null,
                activeStock: null,
                warehouse: null,
                supplierCode: null,
                qrCode: null,
                saleStatus: null,
                boxSpecification: {
                    l: 0,
                    w: 0,
                    h: 0,
                    v: 0
                },
                specification: {
                    l: 0,
                    w: 0,
                    h: 0,
                    v: 0
                }
            };
            let tempResult = Object.assign(tableItemData, temp);
            return tempResult;
        },

        /**
         * 根据所选规格属性，生成排列组合
         */
        combination(originalData) {
            var length = originalData.length;
            if (length < 2) {
                return originalData[0];
            }
            var firstArrayLength = originalData[0].length;
            var secondArrayLength = originalData[1].length;
            var result = [];
            for (
                var firstIndex = 0;
                firstIndex < firstArrayLength;
                firstIndex++
            ) {
                for (
                    var secondIndex = 0;
                    secondIndex < secondArrayLength;
                    secondIndex++
                ) {
                    result[result.length] =
                        originalData[0][firstIndex] +
                        "," +
                        originalData[1][secondIndex];
                }
            }
            var tmpResult = [];
            for (var i = 2; i < originalData.length; i++) {
                tmpResult[i - 1] = originalData[i];
            }
            tmpResult[0] = result;
            return this.combination(tmpResult);
        },
        getSKUData() {
            // console.log('productTitle', this.productTitle)
            // console.log('selectedStandard', this.selectedStandard)
            // console.log("standardAttrs:", this.standardAttrs)
            // console.log("attrValueModelList:", this.attrValueModelList)
            let standardItemTableData = this.getStandardItemTableData(
                this.selectedStandard
            );

            // 所有国家SKU源table数据
            let allCountrySkuOriginTabeData = {};

            _.forEach(this.saleCountryList, country => {
                allCountrySkuOriginTabeData[country.shortCode] = this.$refs[
                    "saleSpecificationTable" + country.shortCode
                ][0].tableData;
                // allCountrySkuOriginTabeData[country.shortCode] = this.$refs['saleSpecificationTable' + country.shortCode][0].getUpdateSku()
            });

            // 公共数据 以第一个国家为准
            let commonSkuTableData = null;
            if (this.saleCountryList.length > 0) {
                commonSkuTableData = this.$refs[
                    "saleSpecificationTable" + this.firstSaleCountry
                ][0].tableData;
            }

            let productSkuBaseInfoList = [];

            _.forEach(commonSkuTableData, (item, index) => {
                let skuBaseItem = {};
                item = item || {};

                let specificationStr = "";
                let boxSpecificationStr = "";
                specificationStr = `${item.specification.l},${item.specification.w},${item.specification.h},${item.specification.v}`;
                boxSpecificationStr = `${item.boxSpecification.l},${item.boxSpecification.w},${item.boxSpecification.h},${item.boxSpecification.v}`;
                if (item.skuId) {
                    skuBaseItem.skuId = item.skuId;
                }
                skuBaseItem.specification = specificationStr;
                skuBaseItem.boxSpecification = boxSpecificationStr;
                skuBaseItem.weight = item.weight * 1000;
                skuBaseItem.supplyPrice = item.supplyPrice + "";
                if (item.supplierSkuId) {
                    skuBaseItem.supplierSkuId = item.supplierSkuId;
                }
                let currencyCode = null;
                _.forEach(this.supplyCurrencyObj, (item, key) => {
                    if (item) {
                        currencyCode = item;
                    }
                });
                skuBaseItem.currencyCode = currencyCode + "";
                skuBaseItem.supplierCode = item.supplierCode;
                skuBaseItem.qrCode = item.qrCode;
                // 通过tale数据构造SKU的属性值组合信息
                // console.log(this.getAttrValueInfo(item))
                skuBaseItem.skuAttrValue = this.getAttrValueInfo(item);
                if (item.inventory) {
                    skuBaseItem.inventory = item.inventory;
                }
                productSkuBaseInfoList.push(skuBaseItem);
            });

            _.forEach(productSkuBaseInfoList, productSkuBaseInfo => {
                _.forEach(productSkuBaseInfo.skuAttrValue, skuAttr => {
                    // console.log(skuAttr)
                    let tableData = standardItemTableData[skuAttr.attrId];
                    _.forEach(tableData, (item, index) => {
                        if (skuAttr.valueId === item.attrId) {
                            skuAttr.sort = index + 1;
                        }
                    });
                });
            });

            //sku 分国家相关信息
            let allSkuCountryItemList = [];
            _.forEach(allCountrySkuOriginTabeData, (value, key) => {
                let skuCountryItemList = [];
                _.forEach(allCountrySkuOriginTabeData[key], item => {
                    let skuCountryItem = {};
                    item = item || {};
                    if (item.skuId) {
                        skuCountryItem.skuId = item.skuId;
                    }
                    skuCountryItem.countryCode = key;
                    skuCountryItem.cover = item.cover;
                    skuCountryItem.saleWay = item.saleWay;
                    skuCountryItem.deliveryWay = item.deliveryWay;
                    skuCountryItem.stock = item.stock;
                    skuCountryItem.activeStock = item.activeStock;
                    skuCountryItem.price = item.price + "";
                    skuCountryItem.priceVip = item.priceVip + "";
                    skuCountryItem.activePrice = item.activePrice + "";
                    skuCountryItem.commission = item.commission + "";

                    // skuCountryItem.warehouse = '1'
                    skuCountryItem.warehouse = item.warehouse;
                    skuCountryItem.saleStatus = item.saleStatus;

                    let compositeProduct = {};
                    if (item.composite && item.composite.length > 0) {
                        if (item.skuId) {
                            compositeProduct.masterSkuId = item.skuId;
                        }
                        compositeProduct.countryCode =
                            item.composite[0].countryCode;
                        let slaveSkuInfoList = [];
                        _.forEach(item.composite, composite => {
                            let slaveSkuInfo = {};
                            if (composite.slaveSkuId) {
                                slaveSkuInfo.slaveSkuId = composite.slaveSkuId;
                            } else {
                                slaveSkuInfo.slaveSkuId = composite.skuId;
                            }

                            slaveSkuInfo.deliveryNumber =
                                composite.deliveryNumber;
                            slaveSkuInfo.skuCode = composite.skuCode;
                            let skuAttrValue = [];
                            _.forEach(composite.standardAttr, standardAttr => {
                                let skuAttrValueItem = {};
                                skuAttrValueItem.attrId = standardAttr.attrId;
                                skuAttrValueItem.valueId = standardAttr.valueId;
                                skuAttrValue.push(skuAttrValueItem);
                            });
                            slaveSkuInfo.skuAttrValue = skuAttrValue;
                            slaveSkuInfoList.push(slaveSkuInfo);
                        });
                        compositeProduct.slaveSku = slaveSkuInfoList;
                        skuCountryItem.compositeProduct = compositeProduct;
                    } else {
                        skuCountryItem.compositeProduct = item.compositeProduct;
                    }
                    skuCountryItemList.push(skuCountryItem);
                });
                allSkuCountryItemList.push(skuCountryItemList);
            });

            // 构造ProductSkuList
            let productSkuList = [];
            _.forEach(productSkuBaseInfoList, (item, index) => {
                let productSku = {
                    skuBase: null,
                    skuCountry: null
                };

                let skuCountryList = [];
                _.forEach(allSkuCountryItemList, skuCountryItem => {
                    if (skuCountryItem[index]) {
                        skuCountryList.push(skuCountryItem[index]);
                    }
                });

                productSku.skuBase = item;
                productSku.skuCountry = skuCountryList;

                productSkuList.push(productSku);
            });

            this.standardAttrData = productSkuList;
        },
        // 构造SKU 的属性值组合信息
        getAttrValueInfo(tableRowData) {
            let attrValueList = [];
            _.forEach(tableRowData, (item, key) => {
                let attrValue = {};
                if (key.includes("_value")) {
                    attrValue.attrId = key.split("_")[0];
                    attrValue.valueId = item;
                    attrValueList.push(attrValue);
                }
            });
            return attrValueList;
        },
        /**
         * 自动同步至其他国家
         */
        syncData(data) {
            _.forEach(this.allCountryTableData, countryTableData => {
                if (data.field.indexOf(".") != -1) {
                    let attrArr = data.field.split(".");
                    countryTableData[data.rowIndex][attrArr[0]][attrArr[1]] =
                        data.value;
                } else {
                    countryTableData[data.rowIndex][data.field] = data.value;
                }
            });
        },
        syncCurrency(data) {
            this.currencyType = data;
            _.forEach(this.supplyCurrencyObj, (item, key) => {
                this.$set(this.supplyCurrencyObj, key, data);
            });
            // this.calculateRateToCNY(this.currencyType)
        },
        getStandardItemTableData(standardAttrs) {
            let tableDataMap = {};
            _.forEach(standardAttrs, attr => {
                tableDataMap[attr.attrId] = this.$refs[
                    "standardItem" + attr.attrId
                ][0].tableDataList;
            });
            return tableDataMap;
        },
        showAutoPricing() {
            this.pricingDialog = true;
            this.$refs.autoPricingDialog.getPriceTemplateByCategoryId();
            this.calculateRate("CNY");
            this.calculateRateToCNY(this.currencyType);
        },
        hanldeCancleAutoPricing() {
            this.pricingDialog = false;
        },
        hanldeConfirmAutoPricing(autoPricingData) {
            this.pricingDialog = false;
            this.priceTemp = autoPricingData;
            // 增加一层数据校验，对所选国家 全部 划线价 VIP价 建议活动价均要设置为空或0
            if (this.verifySkuData()) {
                this.autoPricing();
            } else {
                this.$message.warning(
                    "请将所选国家全部SKU的（划线价、VIP价、建议活动价）均要设置为空或0，才能使用【自动定价】功能"
                );
            }
        },
        getProductEnumInfo() {
            let params = {};
            getProductEnumInfo(this.filterData(params)).then(response => {
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
        /**
         * 同步该列
         */
        syncColumnData() {
            // console.log(this.syncTempData)
            // console.log(this.allCountryTableData, 'allCountryTableData')

            this.syncColumnLoading = true;
            let filterCondition = {}; // 过滤条件
            let filterList = [];
            _.forEach(this.syncTempData, (value, key) => {
                if (key.indexOf("attr") != -1) {
                    filterCondition[key.substring(4) + "_value"] = value;
                }
            });
            // console.log(filterCondition)
            let commonData = this.filterData(this.syncTempData);

            if (this.activeIndex != "0") {
                commonData = _.pick(commonData, [
                    "cover",
                    "saleWay",
                    "deliveryWay",
                    "commission",
                    "price",
                    "priceVip",
                    "activePrice",
                    "saleStatus"
                ]);
            }
            _.forEach(commonData, (value, key) => {
                _.forEach(
                    this.allCountryTableData[this.activeCountryShortCode],
                    row => {
                        if (
                            this.isSameSku(
                                row,
                                this.filterData(filterCondition)
                            )
                        ) {
                            if (key === "weight") {
                                if (value != "0") {
                                    this.$set(row, key, value);
                                }
                            } else if (key === "specification") {
                                if (
                                    value.h != 0 &&
                                    value.l != 0 &&
                                    value.v != 0 &&
                                    value.h != 0
                                ) {
                                    this.$set(row, key, value);
                                }
                            } else if (key === "boxSpecification") {
                                if (
                                    value.h != 0 &&
                                    value.l != 0 &&
                                    value.v != 0 &&
                                    value.h != 0
                                ) {
                                    this.$set(row, key, value);
                                }
                            } else {
                                this.$set(row, key, value);
                            }
                        }
                    }
                );
            });
            let partCommonData = _.pick(commonData, [
                "weight",
                "specification",
                "boxSpecification",
                "supplyPrice",
                "supplierCode",
                "qrCode"
            ]);
            _.forEach(this.filterData(partCommonData), (value, key) => {
                _.forEach(this.saleCountryList, saleCountry => {
                    _.forEach(
                        this.allCountryTableData[saleCountry.shortCode],
                        row => {
                            if (
                                this.isSameSku(
                                    row,
                                    this.filterData(filterCondition)
                                )
                            ) {
                                if (key === "weight") {
                                    if (value != "0") {
                                        this.$set(row, key, value);
                                    }
                                } else if (key === "specification") {
                                    if (
                                        value.h != 0 &&
                                        value.l != 0 &&
                                        value.v != 0 &&
                                        value.h != 0
                                    ) {
                                        this.$set(row, key, value);
                                    }
                                } else if (key === "boxSpecification") {
                                    if (
                                        value.h != 0 &&
                                        value.l != 0 &&
                                        value.v != 0 &&
                                        value.h != 0
                                    ) {
                                        this.$set(row, key, value);
                                    }
                                } else {
                                    this.$set(row, key, value);
                                }
                            }
                        }
                    );
                });
            });
            this.syncColumnLoading = false;
            this.$message.success("同步成功！");
        },
        /**
         * 同步至其他国家
         */
        syncCountryData() {
            this.syncCountryLoading = true;
            let commonData = this.filterData(this.syncTempData);
            if (this.activeIndex != "0") {
                commonData = _.pick(commonData, [
                    "cover",
                    "saleWay",
                    "deliveryWay",
                    "commission",
                    "saleStatus"
                ]);
            }

            let filterCondition = {}; // 过滤条件
            _.forEach(this.syncTempData, (value, key) => {
                if (key.indexOf("attr") != -1) {
                    filterCondition[key.substring(4) + "_value"] = value;
                }
            });

            _.forEach(commonData, (value, key) => {
                _.forEach(this.saleCountryList, saleCountry => {
                    _.forEach(
                        this.allCountryTableData[saleCountry.shortCode],
                        row => {
                            if (
                                _.indexOf(
                                    ["price", "priceVip", "activePrice"],
                                    key
                                ) != -1
                            ) {
                                // if (this.isSameSku(row, this.filterData(filterCondition))) {
                                //     // 同步到泰国时需要乘以消费税
                                //     if (saleCountry.shortCode === 'TH') {
                                //         this.$set(row, key, this.formatPrice(value * this.reversRateMap[saleCountry.shortCode] * 1.07))
                                //     } else if (saleCountry.shortCode === 'MY') {
                                //         this.$set(row, key, value)
                                //     } else {
                                //         this.$set(row, key, this.formatPrice(value * this.reversRateMap[saleCountry.shortCode]))
                                //     }
                                // }
                            } else {
                                if (
                                    this.isSameSku(
                                        row,
                                        this.filterData(filterCondition)
                                    )
                                ) {
                                    //当前选中国家是泰国
                                    if (
                                        this.saleCountryList[this.activeIndex]
                                            .shortCode === "TH"
                                    ) {
                                        // 同步泰国佣金率，排除其他国家佣金率
                                        if (saleCountry.shortCode === "TH") {
                                            this.$set(row, key, value);
                                        } else if (key !== "commission") {
                                            this.$set(row, key, value);
                                        }
                                    } else {
                                        // 排除泰国佣金率同步
                                        if (saleCountry.shortCode !== "TH" || key !== "commission") {
                                            this.$set(row, key, value);
                                        }
                                    }

                                    //同步列国家是不是泰国
                                    // if (saleCountry.shortCode !== "TH") {
                                    // }
                                }
                            }
                        }
                    );
                });
            });
            this.syncCountryLoading = false;
            this.$message.success("同步至其他国家成功！");
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
                        this.syncTempData.cover = res.original_link;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        delCover() {
            this.syncTempData.cover = "";
        },
        addCover() {
            this.$emit("on-get-media-data");
            this.skuCoverSelectVisible = true;
        },
        calcVolume(data, type) {
            let volume = data.l * data.w * data.h;
            data.v = volume;
            if (type === "box") {
                this.syncTempData.boxSpecification = data;
            } else {
                this.syncTempData.specification = data;
            }
        },
        handleTabClick(event) {
            this.activeIndex = event.index;
            _.forEach(this.saleCountryList, saleCountry => {
                if (event.name === saleCountry.nameLocal) {
                    this.activeCountryShortCode = saleCountry.shortCode;
                    this.calculateRate(saleCountry.currencyCode);
                }
            });
        },
        handleStandardValueUpdate(saleSpecInfo) {
            this.saleSpecInfoList[this.selectIndex] = saleSpecInfo;
            _.forEach(this.saleSpecInfoList, item => {
                if (item) {
                    this.$set(
                        this.syncTempData,
                        "attr" + item.standardInfo.attrId,
                        ""
                    );
                }
            });
            this.$forceUpdate();
        },
        isSameSku(row, filterCondition) {
            let flag = true;
            _.forEach(filterCondition, (value, key) => {
                if (row[key]) {
                    if (row[key] != value) {
                        flag = false;
                    }
                } else {
                    flag = false;
                }
            });
            return flag;
        },
        getExchangeRate() {
            let params = {
                fromCurrencyCode: "CNY ",
                toCurrencyCode: "USD",
                templateCode: "10000"
            };
            exchangeGetRate(params)
                .then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getExchangeRecentRateTemplate() {
            let params = {};
            exchangeGetRecentRateTemplate(this.filterData(params))
                .then(res => {
                    if (res.ret.errcode === 1) {
                        this.exchangeRateList = res.exchangeRate;
                        this.currentRatetemplateCode = res.templateCode;
                        this.calculateRate("MYR");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        calculateRate(currencyType) {
            let reversRate = 0;
            _.forEach(this.exchangeRateList, exchangeRate => {
                if (exchangeRate.currencyCode === currencyType) {
                    reversRate = (1 / Number(exchangeRate.rate)).toFixed(6);
                }
            });
            this.reversRateMap = {
                MY: 0,
                SG: 0,
                TH: 0,
                ID: 0
            };
            _.forEach(this.exchangeRateList, exchangeRate => {
                if (exchangeRate.currencyCode === "MYR") {
                    this.reversRateMap.MY = (
                        reversRate * exchangeRate.rate
                    ).toFixed(6);
                } else if (exchangeRate.currencyCode === "SGD") {
                    this.reversRateMap.SG = (
                        reversRate * exchangeRate.rate
                    ).toFixed(6);
                } else if (exchangeRate.currencyCode === "THB") {
                    this.reversRateMap.TH = (
                        reversRate * exchangeRate.rate
                    ).toFixed(6);
                } else if (exchangeRate.currencyCode === "IDR") {
                    this.reversRateMap.ID = (
                        reversRate * exchangeRate.rate
                    ).toFixed(6);
                }
            });
            // console.log(this.reversRateMap)
            if (currencyType === "CNY") {
                this.exchangeRateCNY = this.reversRateMap;
            }
        },
        calculateRateToCNY(currencyCode) {
            let reversRate = 1;
            let CNY = "";
            _.forEach(this.exchangeRateList, exchangeRate => {
                if (exchangeRate.currencyCode === "CNY") {
                    CNY = exchangeRate.rate;
                }
            });
            _.forEach(this.exchangeRateList, exchangeRate => {
                if (exchangeRate.currencyCode === currencyCode) {
                    reversRate = (
                        Number(CNY) / Number(exchangeRate.rate)
                    ).toFixed(6);
                }
            });
            if (currencyCode != "CNY") {
                this.exchangeRateOther = reversRate;
            } else {
                this.exchangeRateOther = 1;
            }
            // console.log(this.exchangeRateOther)
        },
        handleAttrRemove(attrId) {
            // console.log(attrId)
            // console.log(this.allCountryTableData)
            let delIndex = [];
            _.forEach(this.allCountryTableData, (countryTableData, country) => {
                _.forEach(countryTableData, (tableRowData, index) => {
                    _.forEach(tableRowData, (value, key) => {
                        if (key.indexOf("_value") != -1 && value == attrId[0]) {
                            delIndex.push(index);
                        }
                    });
                });
            });
            _.forEach(_.uniq(delIndex), (item, index) => {
                _.forEach(
                    this.allCountryTableData,
                    (countryTableData, country) => {
                        this.$delete(
                            this.allCountryTableData[country],
                            item - index
                        );
                    }
                );
            });
        },
        // 计算出的价格小数点第二位特殊处理： 0~4取0，5~9取9）
        formatPrice(price) {
            let priceVal = parseInt(Number(price).toFixed(2) * 100).toString();
            let lastNum = priceVal.substring(priceVal.length - 1);
            if (Number(lastNum) >= 5) {
                lastNum = "9";
            } else {
                lastNum = "0";
            }
            let result = priceVal.substring(0, priceVal.length - 1) + lastNum;
            return (result / 100).toFixed(2);
        },
        hanldeCancleSkuCoverSelect() {
            this.skuCoverSelectVisible = false;
        },
        hanldeConfirmSkuCoverSelect(cover) {
            this.skuCoverSelectVisible = false;
            this.syncTempData.cover = cover;
        },
        handleGetMediaData() {
            this.$emit("on-get-media-data");
        },
        autoPricing() {
            // console.log(this.priceTemp)
            // console.log('this.allCountryTableData', this.allCountryTableData)
            // 基准价(元/CNY)  =  ( 供货价  +  国内运费  +  国内仓储费  +  国际运费  +  国际仓储费 ）  /  （ 1 - 最大分佣率  -  支付通道费率  -  提现手续费率  -  运营开支费率 - 消费税 ）
            // 空运运费 = max(重量* 价格 ， 单品体积/ 单位体积* 单位体积价格) + 清关操作费（泰国独有，固定值2.5CNY）
            // 海运运费 = 箱体体积 / 10000000 * 600
            // 最大分佣率 = 佣金率 * 1.95
            // 消费税： 泰国独有 固定值7%
            // 各国划线价 = 基准价 * 汇率 / (1-划线价毛利率)
            // 各国VIP价 = 基准价 * 汇率 / (1-VIP毛利率)

            // let basePrice = this.priceTemp[TH].
            _.forEach(this.allCountryTableData, (countryTableData, country) => {
                let autoPriceCountry = _.keys(this.priceTemp);
                _.forEach(countryTableData, skuRow => {
                    if (_.indexOf(autoPriceCountry, skuRow.countryCode) != -1) {
                        if (!skuRow.supplyPrice || skuRow.supplyPrice === 0) {
                            return;
                        }
                        let basePrice = this.caclBasePrice(skuRow);
                        let price = this.calcPrice(
                            skuRow,
                            basePrice,
                            this.exchangeRateCNY[skuRow.countryCode]
                        );
                        let vipPrice = this.calcVipPrice(
                            skuRow,
                            basePrice,
                            this.exchangeRateCNY[skuRow.countryCode]
                        );
                        let activePrice = this.calcActivePrice(
                            skuRow,
                            basePrice,
                            this.exchangeRateCNY[skuRow.countryCode]
                        );
                        if (
                            skuRow.price === "" ||
                            skuRow.price === 0 ||
                            !skuRow.price ||
                            skuRow.price === "null" ||
                            skuRow.price === "0" ||
                            skuRow.price === "0.0" ||
                            skuRow.price === "0.00"
                        ) {
                            this.$set(
                                skuRow,
                                "price",
                                this.formatPriceNew(price, skuRow.countryCode)
                            );
                        }
                        if (
                            skuRow.priceVip === "" ||
                            skuRow.priceVip === 0 ||
                            !skuRow.priceVip ||
                            skuRow.priceVip === "null" ||
                            skuRow.priceVip === "0" ||
                            skuRow.priceVip === "0.0" ||
                            skuRow.priceVip === "0.00"
                        ) {
                            this.$set(
                                skuRow,
                                "priceVip",
                                this.formatPriceNew(
                                    vipPrice,
                                    skuRow.countryCode
                                )
                            );
                        }
                        if (
                            skuRow.activePrice === "" ||
                            skuRow.activePrice === 0 ||
                            !skuRow.activePrice ||
                            skuRow.activePrice === "null" ||
                            skuRow.activePrice === "0" ||
                            skuRow.activePrice === "0.0" ||
                            skuRow.activePrice === "0.00"
                        ) {
                            this.$set(
                                skuRow,
                                "activePrice",
                                this.formatPriceNew(
                                    activePrice,
                                    skuRow.countryCode
                                )
                            );
                        }
                    }
                });
            });
            this.$message.success("自动定价操作成功");
        },
        /**
         * 空运运费 = max(重量* 价格 ， 单品体积/ 单位体积* 单位体积价格) + 清关操作费（泰国独有，固定值2.5CNY）
         */
        caleAirFreight(skuData) {
            // console.log(this.priceTemp)
            let airWeightFreight = 0;
            let airVolumeFreight = 0;
            airWeightFreight =
                skuData.weight *
                (Number(this.priceTemp[skuData.countryCode].airWeightPrice) /
                    Number(this.priceTemp[skuData.countryCode].airWeightUnit));
            airVolumeFreight =
                Number(skuData.specification.v) *
                (Number(this.priceTemp[skuData.countryCode].airVolumePrice) /
                    Number(this.priceTemp[skuData.countryCode].airVolumeUnit));
            if (skuData.countryCode === "TH") {
                airVolumeFreight += 2.5;
                airWeightFreight += 2.5;
            }
            return Math.max(airWeightFreight, airVolumeFreight);
        },
        /**
         * 海运运费 = 箱体体积 / 1000000 * 600
         */
        caclOceanFreight(skuData) {
            let oceanFreight = 0;
            oceanFreight =
                Number(skuData.specification.v) *
                (Number(this.priceTemp[skuData.countryCode].oceanVolumePrice) /
                    Number(
                        this.priceTemp[skuData.countryCode].oceanVolumeUnit
                    ));
            return oceanFreight;
        },
        /**
         * 基准价 (元/CNY)  =  ( 供货价  +  国内运费  +  仓储费（国内或国际）  +  国际运费 ）  /  （ 1 - 最大分佣率  -  支付通道费率  -  提现手续费率  -  运营开支费率 - 消费税 ）
         */
        caclBasePrice(skuData) {
            let basePrice = 0;
            const domesticExpressFee = Number(
                this.priceTemp[skuData.countryCode].domesticExpressFee
            );
            const domesticWarehousingFee = Number(
                this.priceTemp[skuData.countryCode].domesticWarehousingFee
            );
            const internationalWarehousingFee = Number(
                this.priceTemp[skuData.countryCode].internationalWarehousingFee
            );
            const maxCommission = skuData.commission * 1.95;
            const paymentPassageFee = Number(
                this.priceTemp[skuData.countryCode].paymentPassageFee
            );
            const cashServiceFee = Number(
                this.priceTemp[skuData.countryCode].cashServiceFee
            );
            const operatingFee = Number(
                this.priceTemp[skuData.countryCode].operatingFee
            );
            let salesTax = 0; // 泰国专有 固定值7%
            if (skuData.countryCode === "TH") {
                salesTax = 7;
            }
            let internationalFreight = 0;
            let firstAttr = this.getFirst(this.priceTemp);
            if (firstAttr.transport === 1) {
                internationalFreight = this.caclOceanFreight(skuData);
            } else {
                internationalFreight = this.caleAirFreight(skuData);
            }
            let warehousingFee = 0;

            if (skuData.warehouse === "0001") {
                warehousingFee = domesticWarehousingFee;
            } else {
                warehousingFee = internationalWarehousingFee;
            }
            let denominator =
                1 -
                (maxCommission +
                    paymentPassageFee +
                    cashServiceFee +
                    operatingFee +
                    salesTax) /
                    100;
            basePrice =
                (skuData.supplyPrice * Number(this.exchangeRateOther) +
                    domesticExpressFee +
                    internationalFreight +
                    warehousingFee) /
                denominator;
            // console.log(basePrice)
            return basePrice;
        },
        getFirst(obj) {
            for (var key in obj) {
                return obj[key];
            }
        },
        /**
         * 各国划线价 = 基准价 * 汇率 / (1-划线价毛利率)
         */
        calcPrice(skuData, basePrice, exchangeRate) {
            let price = 0;
            price =
                (basePrice * Number(exchangeRate)) /
                (1 -
                    Number(
                        this.priceTemp[skuData.countryCode].grossInterestRate
                    ) /
                        100);
            return price;
        },
        /**
         * 各国VIP价 = 基准价 * 汇率 / (1-VIP毛利率)
         */
        calcVipPrice(skuData, basePrice, exchangeRate) {
            let vipPrice = 0;
            vipPrice =
                (basePrice * Number(exchangeRate)) /
                (1 -
                    Number(
                        this.priceTemp[skuData.countryCode].vipGrossInterestRate
                    ) /
                        100);
            return vipPrice;
        },
        /**
         * 各国参考活动价价 = 基准价 * 汇率 / (1-参考活动价毛利率)
         */
        calcActivePrice(skuData, basePrice, exchangeRate) {
            let activePrice = 0;
            activePrice =
                (basePrice * Number(exchangeRate)) /
                (1 -
                    Number(
                        this.priceTemp[skuData.countryCode]
                            .activeGrossInterestRate
                    ) /
                        100);
            return activePrice;
        },
        // 计算出的价格小数点特殊处理： 0~4取0，5~9取9）
        formatPriceNew(price, countryCode) {
            let priceVal = null;
            if (countryCode === "TH" || countryCode === "ID") {
                priceVal = parseInt(price);
                let lastNum = priceVal % 10;
                if (lastNum < 5) {
                    priceVal = priceVal - lastNum;
                } else priceVal = priceVal + (9 - lastNum);
                return priceVal;
            } else {
                priceVal = parseInt(Number(price).toFixed(1) * 10).toString();
                let lastNum = priceVal.substring(priceVal.length - 1);
                if (Number(lastNum) >= 5) {
                    lastNum = "9";
                } else {
                    lastNum = "0";
                }
                let result =
                    priceVal.substring(0, priceVal.length - 1) + lastNum;
                return (result / 10).toFixed(1);
            }
        },
        verifySkuData() {
            let flag = true;
            let autoPriceCountry = _.keys(this.priceTemp);
            _.forEach(this.allCountryTableData, (countryTableData, country) => {
                _.forEach(countryTableData, skuRow => {
                    if (_.indexOf(autoPriceCountry, skuRow.countryCode) != -1) {
                        if (
                            !(
                                skuRow.price === "" ||
                                skuRow.price === 0 ||
                                !skuRow.price ||
                                skuRow.price === "null" ||
                                skuRow.price === "0" ||
                                skuRow.price === "0.0" ||
                                skuRow.price === "0.00"
                            )
                        ) {
                            flag = false;
                            return flag;
                        }
                        if (
                            !(
                                skuRow.priceVip === "" ||
                                skuRow.priceVip === 0 ||
                                !skuRow.priceVip ||
                                skuRow.priceVip === "null" ||
                                skuRow.priceVip === "0" ||
                                skuRow.priceVip === "0.0" ||
                                skuRow.priceVip === "0.00"
                            )
                        ) {
                            flag = false;
                            return flag;
                        }
                        if (
                            !(
                                skuRow.activePrice === "" ||
                                skuRow.activePrice === 0 ||
                                !skuRow.activePrice ||
                                skuRow.activePrice === "null" ||
                                skuRow.activePrice === "0" ||
                                skuRow.activePrice === "0.0" ||
                                skuRow.activePrice === "0.00"
                            )
                        ) {
                            flag = false;
                            return flag;
                        }
                    }
                });
            });
            return flag;
        }
    }
};
</script>

<style lang="scss">
.cover-image-wrapper {
    display: inline-block;
    position: absolute;
    width: 120px;
    height: 120px;
    overflow: hidden;
    .cover-image {
        width: 110px;
        height: 110px;
        margin-left: 10px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        padding: 4px;
        text-align: center;
        &:hover {
            .operate-area {
                opacity: 0.5;
                transition: opacity 0.3s;
                border-radius: 6px;
            }
        }
        .operate-area {
            text-align: center;
            position: absolute;
            opacity: 0;
            background: #000000;
            height: 110px;
            line-height: 110px;
            top: -1px;
            left: 10px;
            width: 110px;
            box-sizing: border-box;
            color: #fff;
            font-size: 16px;
        }
        .add-cover {
            color: #8c939d;
            font-size: 30px;
            padding: 36px;
            cursor: pointer;
        }
    }
    .standard-img {
        margin-left: 10px;
    }
}
</style>


<style lang="scss" scoped>
.standard-attr-wrapper {
    padding: 10px;
    .sell-tips {
        padding-top: 10px;
        p {
            line-height: 22px;
        }
    }
    .spec-table {
        padding: 0 60px;
        .sync-option-wrapper {
            display: flex;
            height: 130px;
            .left {
                width: 350px;
            }
            .right {
                width: 120px;
                text-align: center;
            }
            .center {
                flex: 1;
                white-space: nowrap;
                overflow-x: auto;
            }
            .param-item-wrapper {
                width: 120px;
                padding: 0 10px;
                display: inline-block;
                .param-item {
                    width: 100px;
                }
                .param-item-title {
                    font-size: 14px;
                    text-align: center;
                    color: #666;
                }
                .param-item-block {
                    width: 100px;
                    display: block;
                }
            }
        }
    }
    .sync-options {
        padding-right: 50px;
        text-align: right;
    }
}
</style>
