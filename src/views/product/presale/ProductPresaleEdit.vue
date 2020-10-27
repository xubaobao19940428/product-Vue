<template>
    <div class="pre-sale-edit-dialog">
        <el-dialog
            :title="title"
            :visible.sync="toggle"
            :close-on-click-modal="false"
            :show-close="false"
            width="930px"
        >
            <div slot="title">{{title}}</div>
            <el-form
                ref="presaleEditForm"
                :model="presaleModel"
                :rules="ruleValidate"
                label-width="120px"
            >
                <el-form-item prop="productId" label="商品ID：" v-if="editType === 'add'">
                    <el-input
                        v-model="presaleModel.productId"
                        clearable
                        placeholder="请输入商品ID"
                        style="width: 220px"
                        size="medium"
                    ></el-input>
                    <el-button
                        type="text"
                        :disabled="!presaleModel.productId"
                        style="margin-left: 5px;"
                        @click="getAdvanceSaleSkuInfo"
                    >确定</el-button>
                </el-form-item>
                <el-form-item label="商品：" v-if="editType === 'edit'">
                    <div class="flex flex-item--center">
                        <img :src="dealShowFileSrc(presaleModel.cover)" class="previewImage" />
                        <span
                            class="block-right"
                            style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical"
                        >
                            <p class="blod-text">{{presaleModel.productId}}</p>
                            <p class="blod-text">{{presaleModel.name}}</p>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item prop="countryCode" label="预售国家：" v-if="editType === 'add'">
                    <el-select
                        v-model="presaleModel.countryCode"
                        size="medium"
                        style="width: 220px"
                    >
                        <el-option
                            v-for="(item, index) in filterCountryList"
                            :key="index"
                            :label="item.nameLocal"
                            :value="item.shortCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="countryCode" label="预售国家：" v-if="editType === 'edit'">
                    <p class="blod-text">{{presaleModel.countryCode | countryFilter}}</p>
                </el-form-item>
                <el-form-item prop="startTime" label="预售时间：">
                    <el-date-picker
                        v-if="editType === 'add' || presaleStatus === 1"
                        v-model="presaleModel.startTime"
                        type="datetime"
                        value-format="timestamp"
                        :picker-options="startDateDisabled"
                        placeholder="选择开始时间"
                        size="medium"
                    ></el-date-picker>
                    <span v-else class="blod-text">{{ presaleModel.startTime | secondTimeFormat }}</span>
                    ~
                    <el-date-picker
                        v-if="editType === 'add' || presaleStatus != 3"
                        v-model="presaleModel.endTime"
                        type="datetime"
                        value-format="timestamp"
                        :picker-options="startDateDisabled"
                        placeholder="选择结束时间"
                        size="medium"
                    ></el-date-picker>
                    <span v-else class="blod-text">{{ presaleModel.endTime | secondTimeFormat }}</span>
                </el-form-item>
                <el-form-item prop="deliveryDeadline" label="最迟发货时间：">
                    <p class="tips">向用户承诺的最迟发货时间，且将展示于预售商品详情页，请谨慎填写</p>
                    <el-date-picker
                        v-if="editType === 'add' || presaleStatus === 1"
                        v-model="presaleModel.deliveryDeadline"
                        type="datetime"
                        value-format="timestamp"
                        :picker-options="startDateDisabled"
                        placeholder="选择结束时间"
                        size="medium"
                    ></el-date-picker>
                    <p
                        v-else
                        class="blod-text"
                    >{{ presaleModel.deliveryDeadline | secondTimeFormat }}</p>
                </el-form-item>
                <el-form-item prop label="预售库存：">
                    <presale-stock-table
                        ref="presaleStockTable"
                        :tableData="skuTableData"
                        :presaleStatus="presaleStatus"
                        :editType="editType"
                    ></presale-stock-table>
                </el-form-item>
                <el-form-item prop="endConfig" label="预售期后：">
                    <el-radio-group
                        v-model="presaleModel.endConfig"
                        :disabled="presaleStatus === 3 && editType === 'edit'"
                    >
                        <div class="radio-item">
                            <el-radio :label="1">自动下架</el-radio>
                            <p>勾选后该商品将在预售期结束后被自动下架</p>
                        </div>
                        <div class="radio-item">
                            <el-radio :label="2">维持原样</el-radio>
                            <p>系统不对商品的销售状态进行任何自动修改</p>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="purchaseConfig" label="采购控制：">
                    <el-radio-group
                        v-model="presaleModel.purchaseConfig"
                        :disabled="presaleStatus != 1 && editType === 'edit'"
                    >
                        <div class="radio-item">
                            <el-radio :label="1">自动推单</el-radio>
                            <p>每日8时，系统自动对过去一天未生成采购单的有效订单生成采购单</p>
                        </div>
                        <div class="radio-item">
                            <el-radio :label="2">手动推单</el-radio>
                            <span v-if="presaleModel.purchaseConfig === 2">
                                最迟推单时间：
                                <el-date-picker
                                    v-if="editType === 'add' || presaleStatus === 1"
                                    v-model="presaleModel.purchaseDeadline"
                                    type="datetime"
                                    value-format="timestamp"
                                    :picker-options="startDateDisabled"
                                    placeholder="选择结束时间"
                                    size="medium"
                                ></el-date-picker>
                                <em
                                    v-else
                                    class="blod-text"
                                >{{ presaleModel.purchaseDeadline | secondTimeFormat }}</em>
                            </span>
                            <p>
                                人工手动在页面控制生成采购单，系统接到手动推单指令后，
                                <br />对预售期开始至昨日23:59:59未生成采购单的有效订单生成采购单；
                                <br />注意：选择此项需请在最迟退单时间前完成全部推单以免影响发货。
                            </p>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="warehouseNo" label="出库仓库：">
                    <el-select
                        v-if="editType === 'add' || presaleStatus === 1"
                        v-model="presaleModel.warehouseNo"
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in warehouseList"
                            :key="index"
                            :label="item.warehouseName"
                            :value="item.warehouseNo"
                        ></el-option>
                    </el-select>
                    <p v-else class="blod-text">{{presaleModel.warehouseName || '-'}}</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import _ from lodash
import { uploadFileRequest } from "@/request/file";
import {
    advanceSaleSkuInfoGet,
    advanceSaleAdd,
    advanceSaleGet,
    advanceSaleUpdate
} from "@/request/product";
import { warehousePage } from "@/request/warehouse";
import PresaleStockTable from "./components/PresaleStockTable";
export default {
    data() {
        return {
            loading: false,
            presaleStatus: 1, // 1 未开始， 2 进行中， 3 已结束
            presaleModel: {
                productId: "",
                startTime: "",
                endTime: "",
                deliveryDeadline: "",
                endConfig: null,
                purchaseConfig: null,
                purchaseDeadline: "",
                warehouseNo: "",
                countryCode: "",
                advanceProduct: []
            },
            ruleValidate: {
                productId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "商品ID不能为空"
                    }
                ],
                countryCode: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择预售国家"
                    }
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "change"
                    },
                    {
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (value >= this.presaleModel.endTime) {
                                callback(new Error("开始时间不能大于结束时间"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "change"
                    },
                    {
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (value <= this.presaleModel.startTime) {
                                callback(new Error("结束时间不能小于开始时间"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                deliveryDeadline: [
                    {
                        required: true,
                        trigger: "change",
                        message: "最迟发货时间"
                    }
                ],
                endConfig: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请设置预售期后状态"
                    }
                ],
                purchaseConfig: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请设置采购控制"
                    }
                ],
                warehouseNo: [
                    {
                        required: true,
                        trigger: "change",
                        message: "请选择出库仓库"
                    }
                ]
            },
            filterCountryList: [],
            warehouseList: [],
            skuTableData: [],
            startDateDisabled: {}
        };
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        editType: {
            type: String,
            default: ""
        },
        presaleData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        toggle: {
            get: function() {
                if (this.editType === "edit") {
                    this.getAdvanceSaleById();
                } else {
                    this.$nextTick(() => {
                        this.reset();
                    });
                }
                return this.dialogVisible;
            },
            set: function() {}
        },
        countryList() {
            return this.$store.state.dict.countryList;
        }
    },
    components: {
        PresaleStockTable
    },
    created() {
        this.getWarehouseList();
        // 限制开始日期不能早于当前日期
        this.startDateDisabled.disabledDate = function(time) {
            return time.getTime() <= Date.now() - 24 * 3600 * 1000;
        };
    },
    methods: {
        cancle() {
            this.reset();
            this.$emit("on-cancle");
        },
        comfirm() {
            // this.loading = true;
            console.log(this.presaleData);
            console.log(this.presaleModel);
            console.log(this.$refs.presaleStockTable.getTableDataList());

            /**
             * 国家对应仓库规则
             * 马来西亚(MY)：深圳云仓(0001)、海外马来京东仓(0004)；
             * 新加坡(SG)：深圳云仓、海外马来京东仓；
             * 泰国(TH)：深圳云仓、泰国中通仓(0003)；
             */

            const warehouseRules = {
                MY: ["0001", "0004"],
                SG: ["0001", "0004"],
                TH: ["0001", "0003"]
            };

            this.$refs.presaleEditForm.validate(valid => {
                if (valid) {
                    if (
                        this.presaleModel.purchaseConfig === 2 &&
                        !this.presaleModel.purchaseDeadline
                    ) {
                        this.$message.warning("请设置最迟推单时间");
                        return;
                    }

                    this.presaleModel.startTime =
                        this.presaleModel.startTime + "";
                    this.presaleModel.endTime = this.presaleModel.endTime + "";
                    this.presaleModel.deliveryDeadline =
                        this.presaleModel.deliveryDeadline + "";
                    this.presaleModel.purchaseDeadline =
                        this.presaleModel.purchaseDeadline + "";
                    this.presaleModel.advanceProduct = this.$refs.presaleStockTable.getTableDataList();

                    if (this.editType === "add") {
                        // if (
                        //     warehouseRules[this.presaleModel.countryCode] &&
                        //     warehouseRules[
                        //         this.presaleModel.countryCode
                        //     ].indexOf(this.presaleModel.warehouseNo) < 0
                        // ) {
                        //     this.$message.error(
                        //         "预售国家和出库仓库不匹配，请重新选择"
                        //     );
                        // }
                        this.advanceSaleAddRequest(this.presaleModel);
                    } else {
                        this.advanceSaleUpdateRequest(this.presaleModel);
                    }
                } else {
                    this.loading = false;
                }
            });
        },
        reset() {
            this.presaleModel = {
                productId: "",
                startTime: "",
                endTime: "",
                deliveryDeadline: "",
                endConfig: null,
                purchaseConfig: null,
                purchaseDeadline: "",
                warehouseNo: "",
                countryCode: "",
                advanceProduct: []
            };
            this.skuTableData = [];
            this.$nextTick(() => {
                if (this.$refs.presaleEditForm) {
                    this.$refs.presaleEditForm.resetFields();
                }
                if (this.$refs.presaleStockTable) {
                    this.$refs.presaleStockTable.reset();
                }
            });
        },
        /**
         * 获取仓库列表
         */
        getWarehouseList() {
            let params = {
                page: {
                    pageSize: 100,
                    pageNum: 1
                }
            };
            warehousePage(this.filterData(params))
                .then(res => {
                    if (res.ret.errcode === 1) {
                        this.warehouseList = res.list.filter((val)=>{
                            return val.warehouseNo=='0005'
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getAdvanceSaleSkuInfo() {
            let params = {
                productId: [this.presaleModel.productId]
            };
            this.filterCountryList = [];
            this.skuTableData = [];
            advanceSaleSkuInfoGet(params)
                .then(res => {
                    if (res.ret.errcode === 1) {
                        let countryCodeList = [];
                        _.forEach(res.advanceProduct, advanceProductItem => {
                            countryCodeList.push(
                                advanceProductItem.countryCode
                            );
                        });
                        _.forEach(_.uniq(countryCodeList), countryCode => {
                            _.forEach(this.countryList, country => {
                                if (country.shortCode === countryCode) {
                                    this.filterCountryList.push(country);
                                }
                            });
                        });
                        if (countryCodeList.length > 0) {
                            _.forEach(
                                res.advanceProduct,
                                advanceProductItem => {
                                    if (
                                        advanceProductItem.countryCode ===
                                        countryCodeList[0]
                                    ) {
                                        this.skuTableData.push(
                                            advanceProductItem
                                        );
                                    }
                                }
                            );
                        }
                        console.log(this.skuTableData);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        advanceSaleAddRequest(params) {
            advanceSaleAdd(this.filterData(params))
                .then(res => {
                    this.loading = false;
                    if (res.ret.errcode === 1) {
                        this.$message.success("新增预售商品成功");
                        this.$emit("on-confirm");
                    }
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getAdvanceSaleById() {
            let params = this.presaleData;
            advanceSaleGet(this.filterData(params))
                .then(res => {
                    if (res.ret.errcode === 1) {
                        let skuInfo = res.advanceProduct[0];

                        let now = new Date().getTime();
                        if (now > Number(res.endTime)) {
                            this.presaleStatus = 3;
                        } else if (
                            now < Number(res.endTime) &&
                            now > Number(res.startTime)
                        ) {
                            this.presaleStatus = 2;
                        } else {
                            this.presaleStatus = 1;
                        }
                        console.log(this.presaleStatus);
                        this.presaleModel.advanceId = this.presaleData.advanceId;
                        this.presaleModel.productId = skuInfo.productId;
                        this.presaleModel.countryCode = skuInfo.countryCode;
                        this.presaleModel.name = skuInfo.name;
                        this.presaleModel.cover = skuInfo.cover;
                        this.presaleModel.startTime = res.startTime;
                        this.presaleModel.endTime = res.endTime;
                        this.presaleModel.deliveryDeadline =
                            res.deliveryDeadline;
                        this.presaleModel.endConfig = res.endConfig;
                        this.presaleModel.purchaseConfig = res.purchaseConfig;
                        this.presaleModel.purchaseDeadline =
                            res.purchaseDeadline;
                        this.presaleModel.warehouseNo = res.warehouseNo;
                        this.presaleModel.warehouseName = res.warehouseName;
                        this.skuTableData = res.advanceProduct;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        advanceSaleUpdateRequest(params) {
            advanceSaleUpdate(this.filterData(params))
                .then(res => {
                    this.loading = false;
                    if (res.ret.errcode === 1) {
                        this.$message.success("预售商品更新成功");
                        this.$emit("on-confirm");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss">
.pre-sale-edit-dialog {
    .el-dialog__body {
        padding: 30px 40px;
    }
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
    .limit-num-tip {
        color: #000;
    }
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
}
</style>

<style lang="scss" scoped>
.pre-sale-edit-dialog {
    .tips {
        padding: 6px 0;
        font-size: 14px;
        line-height: 18px;
        color: #aaa;
    }
    .radio-item {
        padding: 10px 0;
        span {
            font-size: 14px;
            line-height: 16px;
            color: #606266;
            &:before {
                content: "*";
                color: #f56c6c;
                margin-right: 4px;
            }
        }
        p {
            padding: 6px 0;
            font-size: 14px;
            line-height: 18px;
            color: #aaa;
        }
    }
    .blod-text {
        color: #606266;
        font-size: 14px;
        font-weight: 500;
    }
    .previewImage {
        height: 80px;
        width: 80px;
    }
}
</style>

