<template>
    <el-card class="channel-item">
        <div slot="header" class="clearfix channel-header-title">
            <span>短信</span>
            <el-button
                icon="el-icon-delete"
                style="float: right; padding: 3px 0"
                type="text"
                @click="deleteCard"
            ></el-button>
        </div>
        <div class="channel-item-title">短信渠道</div>
        <div class="tip">注意：若推送的用户组内有包含印尼的用户，因成本问题，触达渠道最好不要配短信</div>
        <el-form inline :model="smsContentVOs" label-width="115px">
            <el-form-item required label="短信模板：" class="filter-item">
                <el-select
                    v-model="smsTemplateCode"
                    placeholder="请选择"
                    size="medium"
                    style="width: 200px"
                >
                    <el-option
                        v-for="item in smsTemplateCodeOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="内容（中文）：" class="filter-item">
                <el-input
                    v-model="smsContentVOs.cn.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    :maxlength="maxLength"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item required label="内容（英文）：" class="filter-item">
                <el-input
                    v-model="smsContentVOs.en.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    :maxlength="maxLength"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="内容（马来文）：" class="filter-item">
                <el-input
                    v-model="smsContentVOs.ms.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    :maxlength="maxLength"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="内容（泰文）：" class="filter-item">
                <el-input
                    v-model="smsContentVOs.th.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    :maxlength="maxLength"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="内容（印尼文）：" class="filter-item">
                <el-input
                    v-model="smsContentVOs.id.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    :maxlength="maxLength"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item class="filter-item">
                <el-checkbox style="width: 115px; text-align: right; font-weight: inherit;" v-model="redirectLinkShow">跳转链接&nbsp;&nbsp;</el-checkbox>
                <el-input
                    v-show="redirectLinkShow"
                    v-model="redirectLink"
                    placeholder="请输入"
                    size="medium"
                    style="width: 400px"
                    @input="handleChangeRedirectLink"
                ></el-input>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
export default {
    name: "messageCard",
    props: {
        datas: {
            type: Object,
            default: null
        },
        onDelete: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            smsTemplateCode: "", //短信模板
            redirectLink: "", //短信跳转链接
            maxLength: "500", //短信内容最大长度
            redirectLinkShow: false,    //是否
            smsContentVOs: {
                //短信内容表单数据
                cn: {
                    content: "" //中文内容
                },
                en: {
                    content: "" //英文内容
                },
                ms: {
                    content: "" //马来文内容
                },
                th: {
                    content: "" //泰文内容
                },
                id: {
                    content: "" //印尼文内容
                }
            },
            smsTemplateCodeOption: [{ id: 0, name: "自定义" }] //短信模板枚举数据
        };
    },
    watch: {
        datas: function(newVal) {
            if (newVal) {
                this.smsTemplateCode = newVal.smsTemplateCode;
                this.redirectLink = newVal.redirectLink;

                for (let i = 0; i < newVal.smsContentVOs.length; i++) {
                    const item = newVal.smsContentVOs[i];
                    this.smsContentVOs[item.language].content = item.content;
                }
            }
        }
    },
    methods: {
        //获得模块数据
        getChunkData() {
            const redirect = this.redirectLink ? 1 : 3;
            if (this.redirectLinkShow && !this.redirectLink) {
                this.$message.error("请填写短信跳转链接");
                return null;
            }
            return {
                smsTemplateCode: this.smsTemplateCode,
                smsContentVOs: this.smsContentVOs,
                redirectLink: this.redirectLink.trim(),
                redirect
            };
        },
        //删除模块
        deleteCard() {
            this.$confirm("是否删除此触达渠道？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.smsTemplateCode = "";
                    this.smsContentVOs = {
                        cn: {
                            content: ""
                        },
                        en: {
                            content: ""
                        },
                        ms: {
                            content: ""
                        },
                        th: {
                            content: ""
                        },
                        id: {
                            content: ""
                        }
                    };
                    this.onDelete();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 修改跳转链接
        handleChangeRedirectLink(val) {
            this.maxLength = val.length ? 460 : 500;
        }
    }
};
</script>
<style scoped lang="scss">
.channel-header-title {
    font-weight: 600;
}
.channel-item {
    width: 580px;
    float: left;
    margin: 0 10px;
    .channel-item-title {
        margin: 10px 0;
    }
}
.tip {
    font-size: 14px;
    opacity: 0.5;
    margin: 15px 0;
}
</style>