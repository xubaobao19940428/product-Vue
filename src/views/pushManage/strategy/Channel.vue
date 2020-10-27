<template>
    <div class="channel">
        <div class="title">触达渠道</div>
        <div class="add">
            <el-button
                type="primary"
                size="medium"
                :disabled="selectedPush"
                @click="() => { this.selectedPush = true;}"
            >
                <i class="iconfont">&#xe721;</i> 添加PUSH
            </el-button>
            <el-button
                type="primary"
                size="medium"
                :disabled="selectedMessage"
                @click="() => { this.selectedMessage = true;}"
            >
                <i class="iconfont">&#xe721;</i> 添加短信
            </el-button>
            <el-button
                type="primary"
                size="medium"
                :disabled="selectedEmail"
                @click="() => { this.selectedEmail = true;}"
            >
                <i class="iconfont">&#xe721;</i> 添加邮件
            </el-button>
        </div>
        <div class="channel-container">
            <div class="channel-wrap" :style="`width: ${countWidth()}px`">
                <push-card
                    v-show="selectedPush"
                    :selectedPush="selectedPush"
                    :onDelete="() => { this.selectedPush = false; }"
                    ref="pushCard"
                    :datas="pushData"
                />
                <message-card
                    v-show="selectedMessage"
                    :onDelete="() => { this.selectedMessage = false; }"
                    ref="messageCard"
                    :datas="messageData"
                />
                <email-card
                    v-show="selectedEmail"
                    :onDelete="() => { this.selectedEmail = false; }"
                    ref="emailCard"
                    :datas="emailData"
                ></email-card>
            </div>
        </div>
    </div>
</template>
<script>
import PushCard from "./PushCard";
import MessageCard from "./MessageCard";
import EmailCard from "./EmailCard";
import { validateURL } from "@/utils/validate";
export default {
    name: "channel",
    components: {
        PushCard,
        MessageCard,
        EmailCard
    },
    props: {
        pushData: {
            //推送数据
            type: Object,
            default: null
        },
        messageData: {
            //短信数据
            type: Object,
            default: null
        },
        emailData: {
            //email数据
            type: Object,
            default: null
        },
        check: {
            //检查数据方法
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            selectedPush: false,
            selectedMessage: false,
            selectedEmail: false,
            messageData: null
        };
    },
    watch: {
        pushData: function(newVal) {
            if (newVal) {
                this.selectedPush = true;
            }
        },
        messageData: function(newVal) {
            if (newVal) {
                this.selectedMessage = true;
            }
        },
        emailData: function(newVal) {
            if (newVal) {
                this.selectedEmail = true;
            }
        }
    },
    methods: {
        //获得模块数据
        getChunkData() {
            const isEmpty = value => !value && value !== 0; //是否为空
            // const validateSmsUrl = value => value && !validateURL(value); //验证短信跳转链接是否合法

            let pashData = this.selectedPush
                ? this.$refs.pushCard.getChunkData()
                : {};
            let messageData = this.selectedMessage
                ? this.$refs.messageCard.getChunkData()
                : {};
            let emailData = this.selectedEmail
                ? this.$refs.emailCard.getChunkData()
                : null;
            if (
                !this.selectedPush &&
                !this.selectedMessage &&
                !this.selectedEmail
            ) {
                this.$message.error("请选择触达渠道");
                return null;
            } else {
                //触达渠道，1:推送 2:短信 3:email
                let channel = [];
                if (this.selectedPush) {
                    channel.push(1);
                }
                if (this.selectedMessage) {
                    channel.push(2);
                }
                if (this.selectedEmail) {
                    channel.push(3);
                }

                let res = Object.assign(
                    {},
                    { pushSetting: pashData },
                    { smsSetting: messageData },
                    { emailSetting: emailData }
                );

                let pass = true;

                // res.channel = channel;

                const noPush = channel.indexOf(1) < 0;
                const noMsg = channel.indexOf(2) < 0;
                const noEmail = channel.indexOf(3) < 0;

                //删除多余元素
                if (noPush) {
                    delete res.pushSetting;
                }
                if (noMsg) {
                    delete res.smsSetting;
                }
                if (noEmail) {
                    delete res.emailSetting;
                }

                //push触达模块校验规则
                const pushRules = {
                    pushChannel: [
                        {
                            test: isEmpty,
                            errMsg: "请选择push推送渠道"
                        }
                    ],
                    pushType: [
                        {
                            test: isEmpty,
                            errMsg: "请选择push消息分类"
                        }
                    ],
                    redirect: [
                        {
                            test: isEmpty,
                            errMsg: "请选择push跳转方式"
                        }
                    ],
                    pushTemplateCode: [
                        {
                            test: isEmpty,
                            errMsg: "请选择push模版"
                        }
                    ]
                };

                // 校验email内容填写
                const emailRules = {
                    templateId: [
                        {
                            test: isEmpty,
                            errMsg: "请填写邮件模板ID"
                        }
                    ]
                };

                //短信触达模块校验规则
                const checkMessage = () => {
                    const smsContentVOs = res.smsSetting.smsContentVOs;
                    const smsTemplateCode = res.smsSetting.smsTemplateCode;
                    const redirectLink = res.smsSetting.redirectLink;

                    if (!smsTemplateCode && smsTemplateCode !== 0) {
                        this.$message.error("请选择短信模板");
                        return false;
                    }
                    // if (validateSmsUrl(redirectLink)) {
                    //     this.$message.error("跳转链接格式不正确");
                    //     return false;
                    // }
                    if (!smsContentVOs.cn.content) {
                        this.$message.error("请输入短信内容（中文）");
                        return false;
                    }
                    if (!smsContentVOs.en.content) {
                        this.$message.error("请输入短信内容（英文）");
                        return false;
                    }
                    return true;
                };

                //校验push推送标题内容
                const checkPush = () => {
                    const pushContentVOS = res.pushSetting.pushContentVOS;
                    if (!pushContentVOS.cn.title) {
                        this.$message.error("请输入push标题（中文）");
                        return false;
                    }
                    if (!pushContentVOS.cn.content) {
                        this.$message.error("请输入push内容（中文）");
                        return false;
                    }
                    if (!pushContentVOS.en.title) {
                        this.$message.error("请输入push内容（英文）");
                        return false;
                    }
                    if (!pushContentVOS.en.content) {
                        this.$message.error("请输入push内容（英文）");
                        return false;
                    }
                    if (pushContentVOS.ms.title && !pushContentVOS.ms.content) {
                        this.$message.error("请输入push内容（马来文）");
                        return false;
                    }
                    if (!pushContentVOS.ms.title && pushContentVOS.ms.content) {
                        this.$message.error("请输入push标题（马来文）");
                        return false;
                    }
                    if (pushContentVOS.th.title && !pushContentVOS.th.content) {
                        this.$message.error("请输入push内容（泰文）");
                        return false;
                    }
                    if (!pushContentVOS.th.title && pushContentVOS.th.content) {
                        this.$message.error("请输入push标题（泰文）");
                        return false;
                    }
                    if (pushContentVOS.id.title && !pushContentVOS.id.content) {
                        this.$message.error("请输入push内容（印尼文）");
                        return false;
                    }
                    if (!pushContentVOS.id.title && pushContentVOS.id.content) {
                        this.$message.error("请输入push标题（印尼文）");
                        return false;
                    }
                    return true;
                };

                //将push内容对象转为数组
                const changePushVOS = () => {
                    const pushContentVOS = [];
                    const pushVOS = res.pushSetting.pushContentVOS;
                    for (const language in pushVOS) {
                        if (
                            pushVOS[language].title &&
                            pushVOS[language].content
                        ) {
                            pushContentVOS.push({
                                language: language,
                                title: pushVOS[language].title,
                                content: pushVOS[language].content
                            });
                        }
                    }

                    res.pushSetting.pushContentVOS = pushContentVOS;
                };

                //将短信内容对象转为数组
                const changeMessageVOS = () => {
                    const smsContentVOs = [];
                    const smsVOS = res.smsSetting.smsContentVOs;
                    for (const language in smsVOS) {
                        if (smsVOS[language].content) {
                            smsContentVOs.push({
                                language: language,
                                content: smsVOS[language].content
                            });
                        }
                    }

                    res.smsSetting.smsContentVOs = smsContentVOs;
                };

                // TODO 待优化
                if (!noPush && noMsg && noEmail) {
                    //只选中push渠道
                    pass =
                        this.check(res.pushSetting, pushRules) && checkPush();
                    changePushVOS();
                } else if (noPush && !noMsg && noEmail) {
                    //只选中短信渠道
                    pass = checkMessage();
                    changeMessageVOS();
                } else if (noPush && noMsg && !noEmail) {
                    // 只选中email
                    pass = this.check(res.emailSetting, emailRules);
                } else if (!noPush && !noMsg && noEmail) {
                    //同时选中push渠道、短信渠道
                    pass =
                        this.check(res.pushSetting, pushRules) &&
                        checkPush() &&
                        checkMessage();
                    changePushVOS();
                    changeMessageVOS();
                } else if (!noPush && !noEmail && noMsg) {
                    //同时选中push渠道、email渠道
                    pass =
                        this.check(res.pushSetting, pushRules) &&
                        checkPush() &&
                        this.check(res.emailSetting, emailRules);
                    changePushVOS();
                } else if (noPush && !noEmail && !noMsg) {
                    //同时选中短信渠道、email渠道
                    pass =
                        checkMessage() &&
                        this.check(res.emailSetting, emailRules);
                    changeMessageVOS();
                } else {
                    // 选中所有
                    pass =
                        this.check(res.pushSetting, pushRules) &&
                        checkPush() &&
                        checkMessage() &&
                        this.check(res.emailSetting, emailRules);
                    changePushVOS();
                    changeMessageVOS();
                }
                if (
                    this.selectedPush &&
                    pass &&
                    res.pushSetting.redirect != 3 &&
                    !res.pushSetting.redirectLink
                ) {
                    pass = false;
                    this.$message.error("请输入push跳转链接");
                }

                //如果校验通过返回模块数据，否则返回空
                if (pass) {
                    return res;
                } else {
                    return null;
                }
            }
        },
        // 计算触达渠道容器宽度
        countWidth() {
            const elements = [];
            if (this.selectedPush) {
                elements.push(1);
            }
            if (this.selectedMessage) {
                elements.push(2);
            }
            if (this.selectedEmail) {
                elements.push(3);
            }

            return elements.length * 610;
        }
    }
};
</script>
<style scoped lang="scss">
.title {
    margin: 10px 0 20px 0;
    font-size: 16px;
    font-weight: 600;
}
.channel-container {
    margin-top: 20px;
    overflow-x: scroll;
    width: 100%;
}
</style>
