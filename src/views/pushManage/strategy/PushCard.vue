<template>
    <el-card class="channel-item">
        <div slot="header" class="clearfix channel-header-title">
            <span>PUSH</span>
            <el-button
                icon="el-icon-delete"
                style="float: right; padding: 3px 0"
                type="text"
                @click="deleteCard"
            ></el-button>
        </div>
        <div class="channel-item-title">PUSH配置</div>
        <el-form inline :model="optionFormData">
            <el-form-item required label="推送渠道：" class="filter-item">
                <el-select
                    v-model="optionFormData.pushChannel"
                    placeholder="请选择"
                    size="medium"
                    style="width: 180px"
                >
                    <el-option
                        v-for="item in pushChannelOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="消息分类：" class="filter-item">
                <el-select
                    v-model="optionFormData.pushType"
                    placeholder="请选择"
                    size="medium"
                    style="width: 180px"
                >
                    <el-option
                        v-for="item in pushTypeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <br />
            <el-form-item required label="跳转：" class="filter-item">
                <el-radio-group v-model="optionFormData.redirect" @change="changePushLinkType">
                    <el-radio :label="3">不跳转</el-radio>
                    <el-radio :label="1">链接</el-radio>
                    <el-radio :label="2">应用内页面</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                required
                label="跳转链接："
                class="filter-item"
                v-if="optionFormData.redirect == 1"
            >
                <el-input
                    v-model="optionFormData.redirectLink"
                    placeholder="请输入"
                    size="medium"
                    style="width: 300px"
                ></el-input>
            </el-form-item>
            <el-form-item
                required
                label="跳转链接："
                class="filter-item"
                v-if="optionFormData.redirect == 2"
            >
                <el-select
                    v-model="optionFormData.appLink"
                    placeholder="请选择"
                    size="medium"
                    style="width: 180px"
                >
                    <el-option
                        v-for="(item, index) in actionTypeList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <br />
            <el-form-item label="PUSH图片：" class="filter-item">
                <div class="upload-image-box" v-if="selectedPush">
                    <c-upload
                        accept="image/jpeg, image/jpg, image/png, image/gif"
                        :fileList="optionFormData.picUrl"
                        :limit="1"
                        @setData="setPushPic"
                    ></c-upload>
                    <div class="default-img">
                        <span>默认图片：</span>
                        <img :src="dealShowFileSrc(defaultImage)" />
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <div class="channel-item-title">PUSH内容</div>
        <el-form inline :model="pushContentVOS" label-width="115px">
            <el-form-item required label="PUSH模板：" class="filter-item">
                <el-select
                    v-model="optionFormData.pushTemplateCode"
                    placeholder="请选择"
                    size="medium"
                    style="width: 200px"
                >
                    <el-option
                        v-for="item in pushModelOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="标题（中文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.cn.title"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item required label="内容（中文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.cn.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item required label="标题（英文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.en.title"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item required label="内容（英文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.en.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="标题（马来文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.ms.title"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="内容（马来文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.ms.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="标题（泰文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.th.title"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="内容（泰文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.th.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="标题（印尼文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.id.title"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="内容（印尼文）：" class="filter-item">
                <el-input
                    v-model="pushContentVOS.id.content"
                    placeholder="请输入"
                    size="medium"
                    type="textarea"
                    style="width: 400px"
                    maxlength="500"
                    show-word-limit
                ></el-input>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
import cUpload from "@/components/fileUpload/";
export default {
    name: "pushCard",
    components: {
        cUpload
    },
    props: {
        datas: {
            type: Object,
            default: null
        },
        onDelete: {
            type: Function,
            default: () => {}
        },
        showUpload: {
            type: Boolean,
            default: false
        },
        selectedPush: Boolean
    },
    data() {
        return {
            //PUSH配置表单数据
            optionFormData: {
                pushChannel: "", //推送渠道
                pushType: "", //消息分类
                redirect: "", //跳转
                redirectLink: "", //跳转链接
                appLink: "", //应用内链接
                picUrl: "", //图片地址
                pushTemplateCode: "" //推送模板
            },
            pushContentVOS: {
                //推送内容表单数据
                cn: {
                    title: "", //中文标题
                    content: "" //中文内容
                },
                en: {
                    title: "", //英文标题
                    content: "" //英文内容
                },
                ms: {
                    title: "", //马来文标题
                    content: "" //马来文内容
                },
                th: {
                    title: "", //泰文标题
                    content: "" //泰文内容
                },
                id: {
                    title: "", //印尼文标题
                    content: "" //印尼文内容
                }
            },
            pushChannelOption: [
                { id: 1, name: "站内和站外" },
                { id: 2, name: "站内" },
                { id: 3, name: "站外" }
            ], //推送渠道枚举数据
            pushTypeOption: [
                {
                    value: "PROMOTION_CODE_SALE",
                    label: "促销活动"
                },
                {
                    value: "PROMOTION_CODE_COUPON",
                    label: "优惠券"
                },
                {
                    value: "PROMOTION_CODE_MEMBER_ACTIVITY",
                    label: "会员活动"
                }
            ], //推送类型枚举数据,
            actionTypeList: [
                {
                    label: "我的收益",
                    value: "MY_INCOME"
                },
                {
                    label: "我的团队",
                    value: "MY_TEAM"
                },
                {
                    label: "我的优惠券",
                    value: "MY_COUPON"
                },
                {
                    label: "我的收藏",
                    value: "MY_COLLECTION"
                }
            ], // 应用内跳转枚举
            pushModelOption: [{ id: 0, name: "自定义" }], //推送模板枚举数据
            defaultImage:
                "https://file.fingo.shop/upload/picture/2020-06/29/original/18442521870559353503744_original_6666x6666.png",
            isShowUpload: true
        };
    },
    watch: {
        datas: function(newVal) {
            if (newVal) {
                this.optionFormData.picUrl = newVal.picUrl;
                this.optionFormData.pushChannel = newVal.pushChannel;
                this.optionFormData.pushTemplateCode = newVal.pushTemplateCode;
                this.optionFormData.pushType = newVal.pushType;
                this.optionFormData.redirect = newVal.redirect;
                if (newVal.redirect == 1) {
                    this.optionFormData.redirectLink = newVal.redirectLink;
                } else if (newVal.redirect == 2) {
                    this.optionFormData.appLink = newVal.redirectLink;
                }

                for (let i = 0; i < newVal.pushContentVOS.length; i++) {
                    const item = newVal.pushContentVOS[i];
                    this.pushContentVOS[item.language].title = item.title;
                    this.pushContentVOS[item.language].content = item.content;
                }
            }
        },
        showUpload: function(newVal) {
            this.isShowUpload = newVal;
        }
    },
    methods: {
        //获得模块数据
        getChunkData() {
            // 根据跳转类型设置字段值
            let redirectLink = "";
            if (this.optionFormData.redirect == 1) {
                redirectLink = this.optionFormData.redirectLink.trim();
            } else if (this.optionFormData.redirect == 2) {
                redirectLink = this.optionFormData.appLink;
            }

            return {
                ...this.optionFormData,
                pushContentVOS: this.pushContentVOS,
                picUrl: this.optionFormData.picUrl
                    ? this.optionFormData.picUrl
                    : this.defaultImage,
                redirectLink
            };
        },
        //图片修改回调
        setPushPic(res) {
            // this.optionFormData.picUrl = this.dealShowFileSrc(res.data);
            this.optionFormData.picUrl = res.data;
        },
        //删除模块
        deleteCard() {
            this.$confirm("是否删除此触达渠道？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.optionFormData = {
                        pushChannel: "", //推送渠道
                        pushType: "", //消息分类
                        redirect: "", //跳转
                        redirectLink: "", //跳转链接
                        picUrl: "", //图片地址
                        pushTemplateCode: "" //推送模板
                    };
                    this.pushContentVOS = {
                        cn: {
                            title: "",
                            content: ""
                        },
                        en: {
                            title: "",
                            content: ""
                        },
                        ms: {
                            title: "",
                            content: ""
                        },
                        th: {
                            title: "",
                            content: ""
                        },
                        id: {
                            title: "",
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
    .upload-image-box {
        display: flex;
        .default-img {
            margin-left: 20px;
            img {
                width: 100px;
                height: 100px;
            }
        }
    }
}
</style>
