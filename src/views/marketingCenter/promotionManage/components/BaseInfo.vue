<template>
    <el-form
        ref="baseInfo"
        label-position="right"
        label-width="110px"
        label-suffix="："
        :rules="rules"
        :model="param"
    >
        <el-form-item label="内部名称" prop="name">
            <el-input v-model="param.name" :disabled="end" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="APP标签" prop="promotionLabel">
            <div class="flex form-content">
                <el-select v-model="promotionLabelLang" placeholder="请选择">
                    <el-option
                        v-for="(item, i) in languageList"
                        :key="i"
                        :label="`${item.desc + item.code}`"
                        :value="item.code"
                    ></el-option>
                </el-select>
                <el-form-item
                    v-for="(item, i) in param.promotionLabel"
                    :key="i"
                    ref="promotionForm"
                    :prop="`promotionLabel[${i}].name`"
                    :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'change' }"
                    v-show="promotionLabelLang == item.languageCode"
                    class="flex1 mar-l-10"
                >
                    <el-input
                        :disabled="end"
                        v-model="item.name"
                        show-word-limit
                        maxlength="200"
                        placeholder="请输入"
                        class="input-area"
                    ></el-input>
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item label="活动国家" prop="countryCode">
            <el-select
                v-model="param.countryCode"
                :disabled="end || pageType == 'edit'"
                clearable
                placeholder="请选择"
                size="medium"
                @change="changeCountry"
            >
                <el-option
                    v-for="(item, index) in countryList"
                    :key="index"
                    :label="item.nameEn + '/' + item.nameCn "
                    :value="item.shortCode"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="startTime" required>
            <el-date-picker
                type="datetimerange"
                value-format="timestamp"
                :disabled="end"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                v-model="timeList"
                @change="setActivityTime"
                :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    props: {
        pageType: {
            type: String,
            default: "add",
        },
        languageList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        countryList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        end: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            param: {
                name: "", // 内部名称
                promotionLabel: [], // 多语言标签列表
                countryCode: "", //活动国家
                startTime: "", //开始时间
                endTime: "", //结束时间
            },
            promotionLabelLang: "cn", // 当前选择的app标签语言
            // 表单验证规则
            rules: {
                name: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "change",
                    },
                ],
                promotionLabel: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "change",
                    },
                ],
                countryCode: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "change",
                    },
                ],
                timeList: [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "change",
                    },
                ],
            },
            timeList: [],
        };
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
        init(info, timeList) {
            this.param.countryCode = info.countryCode;
            this.param.name = info.name;
            this.param.promotionLabel = info.promotionLabel;
            this.timeList = timeList;
            this.initLangData();

            this.setActivityTime();
        },
        // 获得基本信息数据
        getData() {
            return new Promise((resolve) => {
                this.$refs["baseInfo"].validate((valid) => {
                    if (valid) {
                        const label = {};
                        const param = { ...this.param };
                        delete param.promotionLabel;

                        this.param.promotionLabel.forEach((item) => {
                            if (item.name) {
                                label[item.languageCode] = item.name;
                            }
                        });
                        resolve({
                            label: JSON.stringify(label),
                            ...param,
                        });
                    } else {
                        if (
                            !this.param.promotionLabel[0].name ||
                            !this.param.promotionLabel[1].name
                        ) {
                            this.$message.warning("app标签：中英文为必填项");
                        } else {
                            this.$message.warning("请输入必填项");
                        }
                    }
                });
            });
        },
        initLangData() {
            const arr = [];
            for (let i = 0; i < this.languageList.length; i++) {
                let lang = this.languageList[i].code;
                let name = "";
                if (this.param.promotionLabel.length) {
                    this.param.promotionLabel.forEach((item) => {
                        if (item.languageCode == lang) {
                            name = item.name;
                        }
                    });
                }
                arr.push({
                    languageCode: lang,
                    name,
                });
            }
            this.param.promotionLabel = arr;
        },
        setActivityTime() {
            this.timeList = this.timeList ? this.timeList : [];
            this.param.startTime = !this.timeList[0] ? "" : this.timeList[0];
            this.param.endTime = !this.timeList[1] ? "" : this.timeList[1];
        },
        getSelectCountryCode() {
            return this.param.countryCode;
        },
        changeCountry() {
            this.$emit("changeCountry", this.param.countryCode);
        },
    },
};
</script>
<style lang="scss" scoped>
.form-tips {
    color: #666;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
}
.input-area {
    padding-right: 60px;
}
</style>
