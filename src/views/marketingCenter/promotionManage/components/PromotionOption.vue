<template>
    <div class="promotion-edit-rules">
        <el-form
            ref="promotionRules"
            label-position="right"
            label-width="110px"
            label-suffix="："
            :rules="rules"
            :model="param"
        >
            <el-form-item label="购买商品" prop="promotionProductInfo">
                <product-select-rules
                    :promotionProductInfo="param.promotionProductInfo"
                    @setData="setProductInfo"
                    :end="end"
                    ref="productSelectRules"
                ></product-select-rules>
            </el-form-item>
            <el-form-item label="达到条件" required>
                <div class="promotion-type-item">
                    <el-radio
                        class="radio"
                        :disabled="pageType == 'edit' || end"
                        v-model="promotionType"
                        label="1"
                    >满件</el-radio>
                    <el-input
                        placeholder="商品件数"
                        :disabled="start || promotionType == '2' || end"
                        v-model="param.pieceNumber"
                        style="width: 200px;"
                    >
                        <template slot="append">件</template>
                    </el-input>
                </div>
                <div class="promotion-type-item">
                    <el-radio
                        class="radio"
                        :disabled="pageType == 'edit' || end"
                        v-model="promotionType"
                        label="2"
                    >满额</el-radio>
                    <el-input
                        :disabled="start || promotionType == '1' || end"
                        placeholder="商品件数"
                        min="0"
                        v-model="param.priceNumber"
                        style="width: 200px;"
                    >
                        <template slot="prepend">{{ selectCountryCode | currencyUnitFilter }}</template>
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item label="赠送商品" required>
                <div class="search-sku">
                    <el-input
                        :disabled="end"
                        v-model="productIds"
                        placeholder="输入SKUID，多个以英文,隔开"
                        style="width: 400px;"
                        clearable
                    />
                    <el-button type="text" @click="checkProduct">添加</el-button>
                </div>
                <el-table border :data="giveawayList" style="width: 100%">
                    <el-table-column align="center" prop="skuId" label="SKUID"></el-table-column>
                    <el-table-column align="center" label="赠品" width="320">
                        <template slot-scope="scope">
                            <div class="giveaway">
                                <div class="giveaway-thumb">
                                    <img :src="dealShowFileSrc(scope.row.cover)" />
                                </div>
                                <div class="giveaway-info">
                                    <div class="giveaway-name">{{scope.row.title}}</div>
                                    <div class="giveaway-spec">{{scope.row.skuAttr}}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" prop="localInventory" label="本地仓可售库存"></el-table-column> -->
                    <el-table-column align="center" width="180" label="赠品数量">
                        <template slot-scope="scope">
                            <el-input-number
                                :disabled="end"
                                min="0"
                                style="width: 150px;"
                                v-model="scope.row.giveNum"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <span
                                :class="!end ? 'sku-del' : 'disable-btn'"
                                @click="delSku(scope.$index)"
                            >删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="规则文案" prop="promotionRuleDesc">
                <div class="flex form-content">
                    <el-select v-model="promotionDescLang" placeholder="请选择">
                        <el-option
                            v-for="(item, i) in languageList"
                            :key="i"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <el-form-item
                        v-for="(item, i) in param.promotionRuleDesc"
                        :key="i"
                        ref="promotionForm"
                        :prop="`promotionRuleDesc[${i}].name`"
                        :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'change' }"
                        v-show="promotionDescLang == item.languageCode"
                        class="flex1 mar-l-10"
                    >
                        <el-input
                            v-model="item.name"
                            :disabled="end"
                            show-word-limit
                            maxlength="200"
                            type="text"
                            placeholder="请输入"
                        ></el-input>
                    </el-form-item>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getSpuInfoBySku } from "@/request/product";
export default {
    props: {
        selectCountryCode: {
            type: String,
            default: "MY",
        },
        countryList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        languageList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        start: {
            type: Boolean,
            default: false,
        },
        end: {
            type: Boolean,
            default: false,
        },
        pageType: {
            type: String,
            default: "add",
        },
        skuIds: [],
    },
    data() {
        return {
            param: {
                promotionProductInfo: [], //购买商品
                pieceNumber: 0, //满件
                priceNumber: 0, //满减
                promotionRuleDesc: [], //规则文案
            },
            rules: {
                promotionProductInfo: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "change",
                    },
                ],
                promotionRuleDesc: [
                    { required: true, message: "不能为空", trigger: "change" },
                ],
            },
            promotionType: "1",
            giveawayList: [], //选中赠品列表
            promotionDescLang: "cn", //规则文案语言种类
            productIds: "",
            skuList: [],
            selectSkuList: [], //已选sku列表
        };
    },
    components: {
        ProductSelectRules: () => import("./ProductSelectRules"),
    },
    watch: {
        languageList() {
            this.initLangData();
        },
    },
    mounted() {
        this.initLangData();
    },
    methods: {
        init(info) {
            this.param.promotionProductInfo = info.promotionProductInfo;
            this.promotionType = info.ruleType.toString();
            if (info.ruleType == 1) {
                this.param.pieceNumber = info.ruleContent;
            } else {
                this.param.priceNumber = info.ruleContent;
            }

            this.skuList = info.skuList;

            this.param.promotionRuleDesc = info.promotionRuleDesc;
            this.initLangData();

            // TODO 根据skuId查询对应信息
        },
        setProductInfo() {
            this.param.promotionProductInfo = this.$refs.productSelectRules.getData();
            this.$refs["promotionRules"].validate();
        },
        getData() {
            return new Promise((resolve) => {
                this.$refs["promotionRules"].validate((valid) => {
                    if (valid) {
                        const hasSkuNum = this.giveawayList.every(
                            (item) => item.giveNum >= 0
                        );
                        if (this.giveawayList.length <= 0) {
                            this.$message.warning("请添加赠送商品");
                            return;
                        }
                        if (
                            this.promotionType == "1" &&
                            this.param.pieceNumber < 0
                        ) {
                            this.$message.warning("满件数量不正确");
                            return;
                        }
                        if (
                            this.promotionType == "2" &&
                            this.param.priceNumber < 0
                        ) {
                            this.$message.warning("满减金额不正确");
                            return;
                        }

                        if (!hasSkuNum) {
                            this.$message.warning("赠品数量不正确");
                            return;
                        }

                        // 规格描述
                        const desc = {};
                        this.param.promotionRuleDesc.forEach((item) => {
                            if (item.name) {
                                desc[item.languageCode] = item.name;
                            }
                        });

                        //  参加赠品活动的商品
                        const giveProductInfo = this.giveawayList.map(
                            (item) => {
                                return {
                                    skuId: item.skuId,
                                    spuId: item.spuId,
                                    stock: item.giveNum,
                                };
                            }
                        );

                        resolve({
                            spuIds: this.param.promotionProductInfo[0].bindsId.filter(item => item),
                            ruleType: this.promotionType,
                            ruleContent:
                                this.promotionType == 1
                                    ? Number(this.param.pieceNumber).toString()
                                    : Number(this.param.priceNumber).toString(),
                            note: JSON.stringify(desc),
                            giveProductInfo,
                        });
                    } else {
                        if (
                            !this.param.promotionRuleDesc[0].name ||
                            !this.param.promotionRuleDesc[1].name
                        ) {
                            this.$message.warning("规则文案：中英文为必填项");
                        } else {
                            this.$message.warning("请输入必填项");
                        }
                    }
                });
            });
        },
        initLangData() {
            for (let i = 0; i < this.languageList.length; i++) {
                let lang = this.languageList[i].code;
                let productCorner = this.param.promotionRuleDesc.find((val) => {
                    return val.languageCode == lang;
                });
                if (!productCorner) {
                    this.param.promotionRuleDesc.push({
                        languageCode: lang,
                        name: "",
                    });
                }
            }
        },
        delSku(index) {
            if (this.end) {
                return;
            }
            this.giveawayList.splice(index, 1);
            this.selectSkuList.splice(index, 1);
        },
        getSpuList(ids, countryCode) {
            let newIds = [];
            ids.forEach((item) => {
                if (this.selectSkuList.indexOf(item) < 0) {
                    newIds.push(item);
                }
            });
            if (newIds.length) {
                getSpuInfoBySku({
                    skuId: newIds,
                    countryCode: countryCode ? countryCode : this.selectCountryCode,
                    // filterStatus: true,
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        let giveawayList = [
                            ...this.giveawayList,
                            ...res.skuInfo,
                        ];

                        this.selectSkuList = [...this.selectSkuList, ...newIds];

                        if (this.skuList.length > 0) {
                            for (let i = 0; i < giveawayList.length; i++) {
                                if (this.skuList[i]) {
                                    Object.assign(giveawayList[i], {
                                        giveNum: this.skuList[i].stock,
                                    });
                                }
                            }
                        }
                        this.giveawayList = giveawayList;
                    }
                });
            }
        },
        // 查询活动商品
        checkProduct() {
            if (this.productIds) {
                const ids = this.productIds.split(",");
                this.getSpuList(ids);
            }
        },
    },
};
</script>
<style lang="scss">
.promotion-edit-rules {
    .el-input-group__prepend,
    .el-input-group__append {
        background-color: #fff;
    }
    .is-disabled {
        .el-input-group__prepend,
        .el-input-group__append {
            background-color: #f5f7fa;
        }
    }
    .el-table {
        th {
            background-color: #eef1f6;
            .cell {
                color: #1f2d3d;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.promotion-type-item {
    margin-bottom: 10px;
}
.search-sku {
    display: flex;
    margin-bottom: 10px;
    button {
        margin-left: 5px;
    }
}
.giveaway {
    display: flex;
    align-items: center;
    .giveaway-thumb {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .giveaway-info {
        width: 220px;
        text-align: left;
        margin-left: 5px;
        .giveaway-name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
.sku-del {
    cursor: pointer;
    color: #ff0000;
    font-weight: 500;
}
.disable-btn {
    color: #999;
}
</style>
