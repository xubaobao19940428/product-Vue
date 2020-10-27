<template>
    <div>
        <el-card class="basic-info-card">
            <div slot="header" class="clearfix">
                <span>基本信息</span>
            </div>
            <el-row>
                <el-col :span="4">
                    <div class="user-base-info">
                        <div class="user-avatar-box">
                            <img v-if="basicInfo.headImg" :src="dealShowFileSrc(basicInfo.headImg)">
                            <img v-else src="../../../assets/img/user-header.png">
                        </div>
                        <div class="user-name">{{ basicInfo.nickName}}</div>
                    </div>
                </el-col>
                <el-col :span="20">
                    <table class="user-info-table">
                        <tr>
                            <td>用户ID</td>
                            <td>
                               {{ basicInfo.userId || '-'}}
                            </td>
                            <td>会员等级</td>
                            <td>{{ memberLevel[basicInfo.memberLevel] }} {{  basicInfo.brandLevel > 0 ? '(Brand)' : '' }}</td>
                            <td>注册时间</td>
                            <td>{{ basicInfo.createTime | secondTimeFormat }}</td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td>{{ basicInfo.gender || '-' }}</td>
                            <td>绑定时间</td>
                            <td>{{ basicInfo.inviteTime | secondTimeFormat }}</td>
                            <td>会员类型</td>
                            <td>{{ memberType[basicInfo.memberType] }}</td>
                        </tr>
                        <tr>
                            <td>出生日期</td>
                            <td>{{ basicInfo.birthday || '-' }}</td>
                            <td>上级ID</td>
                            <td>{{ basicInfo.parentId || '-' }}</td>
                            <td>收货地址个数</td>
                            <td>{{ basicInfo.address || '-' }}</td>
                        </tr>
                        <tr>
                            <td>国家</td>
                            <td>{{ basicInfo.countryCode | countryFilter }}</td>
                            <td>上级等级</td>
                            <td>{{ basicInfo.parentLevel || '-' }}</td>
                            <td>Facebook账号</td>
                            <td>{{ basicInfo.facebook || '-' }}</td>
                        </tr>
                        <tr>
                            <td>电话</td>
                            <td>{{ basicInfo.mobile || '-' }}</td>
                            <td>成为PS时间</td>
                            <td>{{ basicInfo.memberTime | secondTimeFormat }}</td>
                            <td>Google账号</td>
                            <td>{{ basicInfo.googleplay || '-' }}</td>
                        </tr>
                        <tr>
                            <td>邮箱</td>
                            <td>{{ basicInfo.mail || '-' }}</td>
                            <td>成为AM时间</td>
                            <td>{{ basicInfo.upgradeAmTime | secondTimeFormat}}</td>
                            <td>微信号</td>
                            <td>{{ basicInfo.weixinAccount || '-' }}</td>
                        </tr>
                        <tr>
                            <td>邀请码</td>
                            <td>{{ basicInfo.inviteCode || '-' }}</td>
                            <td>成为AT时间</td>
                            <td v-if="basicInfo.memberLevel && basicInfo.memberLevel === 5">{{ basicInfo.upgradeAtTime | secondTimeFormat }}</td>
                            <td v-else>-</td>
                            <td>微信二维码</td>
                            <td v-if="basicInfo.wechat_qr"><span @click="showQrCode(basicInfo.wechat_qr)" class="link">查看二维码</span></td>
                            <td v-else>无</td>
                        </tr>
                        <tr>
                            <td>账号积分</td>
                            <td>{{ basicInfo.commissionAmount || '-' }}</td>
                            <td>会员签约时间</td>
                            <td v-if="basicInfo.signingAgreementTime ">{{ basicInfo.signingAgreementTime | secondTimeFormat }}</td>
                            <td v-else>未签约</td>
                            <td>line账号</td>
                            <td v-if="basicInfo.lineKey">{{ basicInfo.lineKey }}</td>
                            <td v-else>无</td>
                        </tr>
                    </table>
                </el-col>
            </el-row>
        </el-card>
        <image-preview
            v-show="image.show"
            :close="closePreview"
            :index="image.index"
            :list="image.list">
        </image-preview>
    </div>
</template>

<script>
    import imagePreview from '@/components/imagePreview'
    import { mapState } from 'vuex'
    export default {
        name: 'basicInfo',
        props: {
            basicInfo: {
                type: Object,
                default: function () {}
            }
        },
        components: {
            imagePreview
        },
        data() {
            return {
                image: {
                    show: false,
                    index: 0,
                    list: []
                },
                memberType: {
                    0: '普通会员',
                    1: '小礼包会员',
                    2: '大礼包会员',
                    5: '直播会员',
                    7: '断绑跃迁会员'
                }
            }
        },
        computed: {
            ...mapState({
                memberLevel: state => state.dict.memberLevel
            })
        },
        methods: {
            showQrCode(imgUrl) {
                this.image.list.push(imgUrl)
                this.image.show = true
            },
            closePreview () {
               this.image.index = 0
               this.image.show = false
               this.image.list = []
            }
        }

    }
</script>

<style lang="scss" scoped>

.user-base-info {
    width: 100%;
    margin-top: 80px;
    .user-avatar-box {
        width: 100px;
        height: 100px;
        border-radius: 100%;
        overflow: hidden;
        text-align: center;
        margin: 0 auto;
        img {
            width: 100px;
        }
    }
    .user-name {
        text-align: center;
        padding: 10px 0;
    }
}

.user-info-table {
    width: 100%;
    min-width: 850px;
    border-left: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    color: #444;
    font-size: 14px;
    border-spacing:0;
    overflow: auto;
    td {
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
        padding: 14px;
    }
    td:nth-child(2n+1) {
        background: #f5f7fa;
    }
    i {
        cursor: pointer;
    }
  }
</style>


