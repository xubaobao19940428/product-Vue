<template>
    <div class="message-push-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="800px" @close="cancle" :close-on-click-modal="false">
            <el-card class="info-card">
                <div class='info-title mar-b-10'>
                    推送设置
                </div>
                <div>
                    <el-form ref="pushSettingForm" :model="pushSetting" :rules="ruleValidate" label-width="110px" size="mini" style="width:1000px">
                        <el-form-item prop="countryName" label="推送国家：">{{pushSetting.countryName}}</el-form-item>
                        <el-form-item prop="pushChannel" label="推送渠道：">
                            <el-select v-model="pushSetting.pushChannel" size="medium" clearable>
                                <el-option v-for="(item, index) in pushChannelList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="pushType" label="推送类型：">
                            <el-select v-model="pushSetting.pushType" size="medium" clearable>
                                <el-option v-for="(item, index) in pushTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="pushPic" label="推送图片：">
                            <div class="push-cover-image-wrapper" style="width: 120px; height: 120px;">
                                <div class="cover-image" v-if="pushSetting.pushPic">
                                    <el-image :src="dealShowFileSrc(pushSetting.pushPic)" fit="contain"></el-image>
                                    <div class="operate-area">
                                        <i class="el-icon-delete" @click="delPic()"></i>
                                    </div>
                                </div>
                                <el-upload
                                    v-else
                                    class="standard-img"
                                    :action="''"
                                    :limit="1"
                                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                                    :http-request="uploadPic"
                                    list-type="picture-card">
                                  <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item prop="redirect" label="跳转：">
                            <el-radio-group v-model="pushSetting.redirect">
                                <el-radio :label="3">不跳转</el-radio>
                                <el-radio :label="1">链接</el-radio>
                                <el-radio :label="2">应用内</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="pushSetting.redirect === 2" prop="actionType" label="跳转类型：">
                            <el-select v-model="pushSetting.actionType" size="medium" clearable>
                                <el-option v-for="(item, index) in actionTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="pushSetting.redirect === 1" prop="url" label="跳转链接：">
                            <el-input v-model="pushSetting.url" clearable placeholder="请输入内容" size="medium" style="width: 400px"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>推送内容<span> (标题和内容包含emoji等表情符号不要过多，避免超长)</span></div>
                <div class="user-category">
                    <el-form ref="pushLangSettingForm" :model="pushSetting" :rules="ruleValidate" label-width="120px" size="mini" style="width:1000px">
                        <span v-for="(item, index) in languageList" :key="index">
                            <el-form-item :prop="'title'+item.code" :label="'标题(' + item.desc +')：'">
                                <el-input v-model="pushSetting['title'+item.code]" clearable placeholder="请输入标题" size="medium"  maxlength="100" show-word-limit style="width:400px;"></el-input>
                            </el-form-item>
                            <el-form-item :prop="'content'+item.code" :label="'内容(' + item.desc + ')：'">
                                <el-input  v-model="pushSetting['content'+item.code]" type="textarea" :rows="3" placeholder="请输入内容" clearable size="medium"  maxlength="200" show-word-limit style="width: 400px;"></el-input>
                            </el-form-item>
                        </span>
                    </el-form>
                </div>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="editType === 'view'" @click="cancle" size="small">关 闭</el-button>
                <el-button v-if="editType != 'view'" @click="cancle" size="small">取 消</el-button>
                <el-button v-if="editType != 'view'" type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { uploadFileRequest } from '@/request/file'
    export default {
        props: {
            editType: {
                type: String,
                default: ''
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            pushSettingModel: {
                type: Object,
                default:  () => {return {}}
            }
        },
        data () {
            return {
                languageList: [],
                pushSetting: this.pushSettingModel,
                ruleValidate: {
                    countryName: [
                        { required: true, message: '', trigger: 'blur' }
                    ],
                    pushChannel: [
                        { required: true, message: '请选择推送渠道', trigger: 'change' },
                    ],
                    pushType: [
                        { required: true, message: '请选择推送类型', trigger: 'change' }
                    ],
                    pushPic: [
                        { required: true, message: '请上传推送图片', trigger: 'blur' }
                    ],
                    redirect: [
                        { required: true, message: '请选择跳转类型', trigger: 'change' }
                    ],
                    actionType: [
                        { required: true, message: '请选择跳转类型', trigger: 'change' }
                    ],
                    url: [
                        { required: true, message: '请输入跳转链接', trigger: 'blur' }
                    ],
                    sendType: [
                        { required: true, message: '请选择发送方式', trigger: 'change' }
                    ],
                    pushPlanTime: [
                        { required: true, message: '请选择发送时间', trigger: 'change' }
                    ],
                    titlecn: [
                        { required: true, message: '请输入标题（简体中文）', trigger: 'blur' }
                    ],
                    contentcn: [
                        { required: true, message: '请输入内容（简体中文）', trigger: 'blur' }
                    ],
                    titleen: [
                        { required: true, message: '请输入标题（英文）', trigger: 'blur' }
                    ],
                    contenten: [
                        { required: true, message: '请输入内容（英文）', trigger: 'blur' }
                    ]
                },
                options: [],
                productBaseData: [],
                skuTableData:[],
                createGroupRadio: null,
                joinGroupRadio: null,
                createGroupCheckList: [],
                joinGroupCheckList: [],
                createUserIdList: '',
                joinUserIdList: '',
                pushChannelList: [
                    {
                        value: 1,
                        label: '站外+应用内'
                    }, {
                        value: 2,
                        label: '应用内'
                    }, {
                        value: 3,
                        label: '站外'
                    }
                ],
                pushTypeList: [
                    {
                        value: 'PROMOTION_CODE_SALE',
                        label: '促销活动'
                    }, {
                        value: 'PROMOTION_CODE_COUPON',
                        label: '优惠券'
                    }, {
                        value: 'PROMOTION_CODE_MEMBER_ACTIVITY',
                        label: '会员活动'
                    }, {
                        value: 'ORDER_CODE_SEND_ORDER_REFUND_CASH',
                        label: '订单退款'
                    }
                ],
                memberLevel: [{
                    label: 'SH',
                    value: 'SH'
                }, {
                    label: 'PS',
                    value: 'PS'
                }, {
                    label: 'AM',
                    value: 'AM'
                }, {
                    label: 'AT',
                    value: 'AT'
                }],
                actionTypeList: [{
                    label: '我的收益',
                    value: 'MY_INCOME'
                }, {
                    label: '我的团队',
                    value: 'MY_TEAM'
                }, {
                    label: '我的优惠券',
                    value: 'MY_COUPON'
                }, {
                    label: '我的收藏',
                    value: 'MY_COLLECTION'
                }]
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            dialogTitle: {
                get: function() {
                    if (this.editType === 'add') {
                        return '新增消息推送'
                    } else if (this.editType === 'edit') {
                        return '编辑消息推送'
                    } else {
                        return '查看消息推送'
                    }
                },
                set: function() {}
            }
        },
        components: {
        },
        watch: {
        },
        created () {
            this.languageList = JSON.parse(this.getStore('languageList'))
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                let flag = true
                let langFlag = true
                this.$refs.pushSettingForm.validate(valid => {
                    if (valid) {
                        flag = true
                        let pushLang = []
                        _.forEach(this.languageList, language => {
                            let pushLangItem = {}
                            if (this.pushSetting['title'+language.code]) {
                                pushLangItem.language = language.code
                                pushLangItem.title = this.pushSetting['title'+language.code]
                                pushLangItem.content = this.pushSetting['content'+language.code]
                                pushLang.push(pushLangItem)
                            }
                        })
                        this.pushSetting.pushLang = pushLang
                        if (this.pushSetting.redirect === 2) {
                            this.pushSetting.redirectParam = this.pushSetting.actionType
                        } else if (this.pushSetting.redirect === 1){
                            this.pushSetting.redirectParam = this.pushSetting.url
                        }
                    } else {
                        flag = false
                    }
                })
                this.$refs.pushLangSettingForm.validate(valid => {
                    if (valid) {
                        langFlag = true
                    } else {
                        langFlag = false
                    }
                })
                if (flag && langFlag) {
                    this.$emit('on-confirm', this.pushSetting)
                    this.reset()
                }
            },
            reset() {
                this.pushSetting.pushType = ''
                this.pushSetting.actionType = null
                this.pushSetting.url = ''
                this.$refs.pushSettingForm.resetFields()
            },
            uploadPic(file) {
                let params = new FormData();
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'product'
                }
                params.append('file',file.file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    if (res.status === '600') {
                        console.log(res)
                        this.pushSetting.pushPic = res.original_link
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            delPic() {
                this.pushSetting.pushPic = ''
            }
        }
    }
</script>

<style lang="scss">
    .message-push-edit-dialog {
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
    }
    .push-cover-image-wrapper {
        display: inline-block;
        width: 110px;
        height: 110px;
        overflow: hidden;
        .el-upload--picture-card {
            width: 110px;
            height: 110px;
            line-height: 110px;
        }
        .cover-image {
            width: 110px;
            height: 110px;
            margin-left: 10px;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            padding: 4px;
            overflow: hidden;
            &:hover {
                .operate-area {
                    opacity: .5;
                    transition: opacity .3s;
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
        }
    .standard-img {
        margin-left: 10px;
    }
}
</style>

<style lang="scss" scoped>
    .message-push-edit-dialog {
        .info-title {
            color: #303133;
            span {
                font-size: 12px;
                color: #666;
            }
        }
    }
</style>
