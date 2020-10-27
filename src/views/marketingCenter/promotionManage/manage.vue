<template>
    <div class="app-container">
        <div class="action-btn-wrapper">
            <el-button size="small" @click="cancel">取 消</el-button>
            <el-button size="small" :loading="loading" type="primary" @click="confirm">确 定</el-button>
        </div>
        <div class="promotion-edit-wrapper">
            <el-card class="info-card">
                <div class="info-title mar-b-10">基本信息</div>
                <base-info
                    ref="baseInfoEl"
                    :pageType="pageType"
                    :languageList="languageList"
                    :countryList="countryList"
                    @changeCountry="changeSelectCountry"
                    :start="activityStart"
                    :end="activityEnd"
                    :value="baseInfoContent"
                />
            </el-card>
            <el-card class="info-card">
                <div class="info-title mar-b-10">买赠规则</div>
                <promotion-option
                    ref="optionEl"
                    :pageType="pageType"
                    :languageList="languageList"
                    :selectCountryCode="selectCountryCode"
                    :start="activityStart"
                    :end="activityEnd"
                />
            </el-card>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { updateGive, getGiveDetail } from "@/request/marketing.js";
import BaseInfo from "./components/BaseInfo";
import PromotionOption from "./components/PromotionOption";
export default {
    data() {
        return {
            pageType: "add", //页面编辑类型
            loading: false, //提交loading
            selectCountryCode: "MY",
            activityStart: false, //活动是否是开始状态
            activityEnd: false, //活动是否是结束状态
            baseInfoContent: {},
        };
    },
    computed: {
        countryList() {
            return this.$store.state.dict.countryList;
        },
        languageList() {
            return this.$store.state.dict.languageList;
        },
    },
    components: {
        BaseInfo,
        PromotionOption,
    },
    created() {
        this.pageType = this.$route.query.id ? "edit" : "add";
    },
    mounted() {
        if (this.$route.query.id) {
            this.queryDetail();
        }
    },
    methods: {
        // 查询详情
        queryDetail() {
            getGiveDetail({
                id: this.$route.query.id,
            }).then((res) => {
                if (res.ret.errcode === 1) {
                    const result = res.giveQuery;
                    this.selectCountryCode = result.countryCode;

                    const labelObject = result.label
                        ? JSON.parse(result.label)
                        : {};
                    const ruleObject = result.note
                        ? JSON.parse(result.note)
                        : {};
                    const labels = [];
                    const rules = [];

                    for (const label in labelObject) {
                        labels.push({
                            languageCode: label,
                            name: labelObject[label],
                        });
                    }

                    for (const rule in ruleObject) {
                        rules.push({
                            languageCode: rule,
                            name: ruleObject[rule],
                        });
                    }

                    // 数据回显
                    this.$refs.baseInfoEl.init(
                        {
                            countryCode: this.selectCountryCode,
                            name: result.name,
                            promotionLabel: labels,
                        },
                        [result.startTime, result.endTime]
                    );
                    this.$refs.optionEl.init({
                        promotionProductInfo: [
                            {
                                promotionProductType: "0",
                                bindsId: result.spuIds,
                            },
                        ],
                        ruleType: result.ruleType,
                        ruleContent: result.ruleContent,
                        skuList: result.giveProductInfo,
                        promotionRuleDesc: rules,
                        countryCode: this.selectCountryCode
                    });

                    const skuIds = [];
                    for (let i = 0; i < result.giveProductInfo.length; i++) {
                        const item = result.giveProductInfo[i];
                        skuIds.push(item.skuId);
                    }
                    if (skuIds.length > 0) {
                        this.$refs.optionEl.getSpuList(skuIds, this.selectCountryCode);
                    }

                    const nowDate = Date.now();
                    this.activityStart = nowDate >= result.startTime && nowDate <= result.endTime;
                    this.activityEnd = nowDate > result.endTime;
                }
            });
        },
        // 提交新增/编辑
        confirm() {
            const getBaseInfo = this.$refs.baseInfoEl.getData();
            const getOptions = this.$refs.optionEl.getData();
            getBaseInfo.then((baseInfo) => {
                getOptions.then((options) => {
                    let params = {};
                    if (this.$route.query.id) {
                        params = {
                            id: this.$route.query.id,
                            ...baseInfo,
                            ...options,
                            operation: this.$store.state.user.username,
                        };
                    } else {
                        params = {
                            ...baseInfo,
                            ...options,
                            operation: this.$store.state.user.username,
                        };
                    }

                    this.loading = true;
                    updateGive(this.filterData(params))
                        .then((res) => {
                            this.loading = false;
                            if (res.ret.errcode === 1) {
                                this.$message({
                                    message: this.$route.query.id
                                        ? "更新成功"
                                        : "新增成功",
                                    type: "success",
                                });

                                this.$router.go(-1);
                            }
                        })
                        .catch((err) => {
                            this.loading = false;
                        });
                });
            });
        },
        // 取消返回上级
        cancel() {
            this.$router.go(-1);
        },
        // 修改活动国家
        changeSelectCountry(countryCode) {
            this.selectCountryCode = countryCode;
        },
    },
};
</script>
<style lang="scss" scoped>
.title {
    margin: 10px 0 20px 0;
    font-size: 20px;
    font-weight: 600;
}
.action-btn-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 0 50px 10px;
    border-bottom: 1px solid #ebeef5;
}
.promotion-edit-wrapper {
    overflow: auto;
    flex: 1;
}
</style>
