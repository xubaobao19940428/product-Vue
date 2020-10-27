<template>
    <el-card class="channel-item">
        <div slot="header" class="clearfix channel-header-title">
            <span>邮件</span>
            <el-button
                icon="el-icon-delete"
                style="float: right; padding: 3px 0"
                type="text"
                @click="deleteCard"
            ></el-button>
        </div>
        <div class="channel-item-title">邮件渠道</div>
        <div class="tip">说明：内容样式需要先去三方后台配置，完成配置后将模版ID输入下方输入框点击测试模版，会发一条邮件到操作员的企业邮箱中，可验证发送内容</div>
        <el-form inline :model="queryData" ref="emailForm" label-width="115px">
            <el-form-item required label="邮件模板ID：" class="filter-item">
                <el-input v-model="queryData.id" placeholder="请输入模版ID"></el-input>
            </el-form-item>
            <el-form-item required label="测试接收地址：" class="filter-item">
                <el-input v-model="queryData.email" @input="handleInput" placeholder="填写接收的邮件地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="testClick" v-if="!showBtn">测试模版</el-button>
                <div class="diabel-test" v-if="showBtn">
                    <el-button type="info" disabled>测试模版</el-button>
                    <div class="disable-time">{{ time }}&nbsp;&nbsp;{{'S'}}</div>
                </div>
            </el-form-item>
        </el-form>
        <div>
            <div>测试结果：<span :style="testSuccess ? 'color: #70B603;' : 'color: #D9001B;'">{{testResult}}</span></div>
        </div>
    </el-card>
</template>
<script>
import { emailTest } from "@/request/strategy";

export default {
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
            queryData: {
                id: "",
                emial: ""
            },
            time: 30,
            showBtn: false,
            testResult: "",
            testSuccess: true
        };
    },
    watch: {
        datas: function(newVal) {
            if (newVal) {
                this.queryData.id = newVal.templateId;
                this.queryData.emailAddress = newVal.emailAddress;
            }
        }
    },
    methods: {
        //获得模块数据
        getChunkData() {
            return {
                templateId: this.queryData.id ? this.queryData.id.trim() : "",
                emailAddress: this.queryData.emailAddress ? this.queryData.emailAddress.trim() : ""
            };
        },
        sendEmail: function() {
            let regEmail = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
            if (
                this.queryData.email != "" &&
                !regEmail.test(this.queryData.email.trim())
            ) {
                this.$message({
                    message: "邮箱格式不正确",
                    type: "error"
                });
                this.queryData.email = "";
                return false;
            }
            return true;
        },
        testClick() {
            if (!this.queryData.id) {
                this.$message.error("请填写邮件模板ID");
                return;
            }
            if (!this.queryData.email) {
                this.$message.error("请填写测试接收地址");
                return;
            }
            if (!this.sendEmail()) {
                return;
            }
            this.showBtn = true;
            let self = this;
            let timer = setInterval(() => {
                self.time--;
                if (this.time == 0) {
                    clearInterval(timer);
                    this.time = 30;
                    this.showBtn = false;
                }
            }, 1000);
            emailTest({
                emailAddress: this.queryData.email,
                templateId: this.queryData.id
            }).then(res => {
                clearInterval(timer);
                if (res.code == 1009) {
                    this.testSuccess = false;
                    this.testResult = res.msg;
                } else {
                    this.testSuccess = true;
                    this.testResult = "successful"
                }
                this.time = 30;
                this.showBtn = false;
            });
        },
        //删除模块
        deleteCard() {
            this.$confirm("是否删除此触达渠道？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.queryData.id = "";
                    this.queryData.emailAddress = "";
                    this.onDelete();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        handleInput() {
            this.testResult = "";
        }
    }
};
</script>
<style lang="scss" scoped>
.channel-item {
    width: 580px;
    float: left;
    margin: 0 10px;
    .channel-header-title {
        font-weight: 600;
    }
    .channel-item-title {
        margin: 10px 0;
    }
    .tip {
        font-size: 14px;
        opacity: 0.5;
        margin: 15px 0;
    }
    .diabel-test {
        display: flex;
    }
    .disable-time {
        margin-left: 5px;
        font-size: 18px;
        color: rgb(153, 153, 153);
    }
}
</style>