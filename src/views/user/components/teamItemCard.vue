<template>
    <el-card shadow="hover" class="team-item-card">
        <div @click="jumpToDetail">
            <div class="icon">
                <el-popover
                    placement="right"
                    width="260"
                    trigger="hover">
                    <table class="member-card-table">
                        <tr>
                          <td>用户id</td>
                          <td>{{itemData.userId}}</td>
                        </tr>
                        <tr>
                          <td>电话</td>
                          <td>{{itemData.mobile}}</td>
                        </tr>
                        <tr>
                          <td>邀请码</td>
                          <td>{{itemData.inviteCode}}</td>
                        </tr>
                        <tr>
                          <td>注册时间</td>
                          <td>{{itemData.createTime | secondTimeFormat}}</td>
                        </tr>
                        <tr>
                          <td>绑定时间</td>
                          <td>{{itemData.inviteTime | secondTimeFormat}}</td>
                        </tr>
                    </table>
                    <i class="el-icon-warning-outline" slot="reference"></i>
                </el-popover>

            </div>
            <div class="user-avatar-box">
                <img v-if="itemData.headImg" :src="dealShowFileSrc(itemData.headImg)">
                <img v-else src="../../../assets/img/user-header.png">
            </div>
            <p>{{itemData.nickName}}</p>
            <button class="member-level">{{itemData.memberLevel}}</button>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: 'teamItemCard',
        props: {
            itemData: {
                type: Object,
                default: function () {}
            }
        },
        components: {
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
            jumpToDetail() {
                this.$router.push({
                    name: 'memberInfo',
                    query: {
                        userId: this.itemData.userId
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .team-item-card {
        width: 180px;
        height: 240px;
        text-align: center;
        .icon {
            text-align: right;
        }
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
        p {
            margin: 14px 0;
        }
        .member-level {
            color: #fff;
            padding: 4px 30px;
            background: #409eff;
            border: none;
            border-radius: 14px;
            outline: none;
        }
    }
    .member-card-table {
        width: 100%;
        border-left: 1px solid #ebeef5;
        border-top: 1px solid #ebeef5;
        color: #444;
        font-size: 14px;
        border-spacing:0;
        text-align: center;
        border: 1px solid #ebeef5;
        td {
            border-right: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
            box-sizing: border-box;
            padding: 4px;
        }
        td:nth-child(2n+1) {
            background: #f5f7fa;
        }
    }
</style>


