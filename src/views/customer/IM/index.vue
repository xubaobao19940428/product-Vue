<template>
    <div class="notice-dialog">
        <div class="notice-wrapper">
            <div class="header-box">
                <div class="l">
                    <i class="iconfont pointer" @click="hiddenNoticeList">&#xe657;</i>
                    <span class="mar-l-10">消息列表</span>
                </div>
                <div class="r">
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="user-img-box">
                            <i class="iconfont header-img">&#xe69f;</i>
                            <span class="user-name">{{ userInfo.nickName || userInfo.mobile ||  'fingo' }}</span>
                            <div class="cus-online-status-wrapper">
                                <i v-if="stateCustomerStatus == 3" class="el-icon-success security status-icon"></i>
                                <i v-else-if="stateCustomerStatus == 1" class="el-icon-remove warning status-icon"></i>
                                <i v-else-if="stateCustomerStatus == 2" class="iconfont warning">&#xe602;</i>
                            </div>
                        </div>
                        <el-dropdown-menu class="user-dropdown" slot="dropdown">
                            <el-dropdown-item v-for="item in serviceStatus"
                                              :key="item.key"
                                              @click.native="setServerStatus(item.key)">
                                <div class="status-wrapper">
                                    <i v-if="item.key == 3" class="el-icon-success security status-icon"></i>
                                    <i v-else-if="item.key == 1" class="el-icon-remove warning status-icon"></i>
                                    <span>{{ item.name }}</span>
                                    <i class="el-icon-check" v-show="customerStatus == item.key"></i>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div class="logout-btn" @click="websocketLogout">
                        <i class="iconfont">&#xe6e2;</i>
                        <span>退出</span>
                    </div>
                </div>
            </div>
            <div class="notice-content">
                <div ref="historyScroll" class="l">
                    <!--message_type 1未处理 2已结束 3已提交-->
                    <ul>
                        <li v-for="(item, i) in sessionItemList"
                            @click="selectUser(item)"
                            :class="[item.userId == currAppUserInfo.userId ? 'selected' : '', item.messageType == 1 ? '': 'end-service']"
                            :key="i">
                            <div class="user-img">
                                <img v-if="item.headImg" :src="dealShowFileSrc(item.headImg)">
                                <i v-else class="iconfont">&#xe94a;</i>
                            </div>
                            <div class="user-info">
                                <div class="user-nick-name">
                                    <span>{{ item.userId }}</span>
                                    <em>{{ formatChatTime(item.lastChatTime) }}</em>
                                </div>
                                <div class="chat-time">
                                    {{ item.nickName }}
                                </div>
                                <div v-if="item.messageType == 3" class="order-has-submit">
                                    <i class="iconfont">&#xe616;</i>
                                </div>
                                <el-badge v-if="!item.hasRead"
                                          :value="item.count" class="not-read"></el-badge>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="r">
                    <div class="cur-user-nick-name">{{ currAppUserInfo.nickName }}</div>
                    <template v-if="currAppUserInfo.messageType == 2">
                        <div class="end-tips">服务已结束，请提交工单</div>
                    </template>
                    <div ref="chatRecord" class="chat-record-wrapper">
                        <ul>
                            <li v-for="(item, i) in currAppUserHistory"
                                :class="'notice_' + item.guid"
                                :key="i">
                                <div class="send-time">{{ formatChatTime(item.time) }}</div>
                                <div class="user-msg">
                                    <template v-if="item.toUsername == csId">
                                        <div class="user-img">
                                            <img v-if="currAppUserInfo.headImg" :src="currAppUserInfo.headImg">
                                            <i v-else class="iconfont">&#xe94a;</i>
                                        </div>
                                        <div class="notice-text">
                                            <div v-if="item.msgContentType == 0" class="text-wrapper">
                                                <span>{{ item.text }}</span>
                                            </div>
                                            <div v-else-if="item.msgContentType == 1">
                                                <img @click="previewAsset(item.bigLink, 'image', 0)"
                                                     :src="item.smallLink">
                                            </div>
                                            <div v-else-if="item.msgContentType == 2" class="video-wrapper"
                                                 @click="previewAsset(item.videoLink, 'video', 0)">
                                                <img :src="item.videoScreenShortLink">
                                                <i class="iconfont">&#xe646;</i>
                                            </div>
                                            <div v-else-if="item.msgContentType == 9" class="text-wrapper">
                                                <span>{{ item.notification }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="notice-text customer-wrapper">
                                            <div v-if="item.msgContentType == 0" class="text-wrapper">
                                                <span>{{ item.text }}</span>
                                            </div>
                                            <div v-else-if="item.msgContentType == 1">
                                                <img @click="previewAsset(item.bigLink, 'image', 0)"
                                                     :src="item.smallLink">
                                            </div>
                                            <div v-else-if="item.msgContentType == 2" class="video-wrapper"
                                                 @click="previewAsset(item.videoLink, 'video', 0)">
                                                <img :src="item.videoScreenShortLink">
                                                <i class="iconfont">&#xe646;</i>
                                            </div>
                                            <div v-else-if="item.msgContentType == 9" class="text-wrapper">
                                                <span>{{ item.notification }}</span>
                                            </div>
                                        </div>
                                        <div class="user-img">
                                            <i class="iconfont header-img">&#xe69f;</i>
                                        </div>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="input-wrapper">
                        <!--message_type 1未处理 2已结束 3已提交-->
                        <template v-if="currAppUserInfo.messageType == 1">
                            <div class="customer-btn-wrapper">
                                <div class="file-upload">
                                    <i class="iconfont">&#xe6ba;</i>
                                    <input type="file" multiple @change="sendFileMessage">
                                </div>
                                <span @click="stopUserService">
                                <i class="iconfont">&#xe7b8;</i>
                                结束服务
                            </span>
                            </div>
                            <textarea v-model="inputText" @keyup.enter="sendMessage"></textarea>
                        </template>
                        <template v-if="currAppUserInfo.messageType == 2">
                            <div class="has-end">
                                <el-button @click="submitWorkOrder" type="primary">提交工单</el-button>
                            </div>
                        </template>
                        <template v-if="currAppUserInfo.messageType == 3">
                            <div class="has-submit">
                                <div>
                                    <i class="el-icon-success security status-icon"></i>
                                    <span>该条咨询工单已提交</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <image-preview
            v-show="image.show"
            :notDealUrl="image.notDealUrl"
            :fileType="image.fileType"
            :close="closePreview"
            :index="image.index"
            :list="image.list">
        </image-preview>
        <!--新建工单-->
        <work-order-edit :showDialog="workOrder.show"
                         :propParam="workOrder.param"
                         @confirm="confirmAddWorkOrder"
                         @close="workOrder.show = false"></work-order-edit>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import { FingoIMApi } from '@/js/IM/imApi.js'
    import imagePreview from '@/components/imagePreview'
    import workOrderEdit from '../components/workOrderEdit'
    let moment = require('moment')

    export default {
        components: {
            imagePreview,
            workOrderEdit
        },
        data () {
            return {
                image: {
                    show: false,
                    index: 0,
                    fileType: 'image',
                    list: [],
                    notDealUrl: false
                },
                userInfo: {
                    nickName: '',
                    mobile: ''
                },
                workOrder: {
                    show: false,
                    param: {
                        workOrderSource: '6',
                        userId: ''
                    }
                },
                customerStatus: 3,
                sessionItemList: [],
                serviceStatus: [{
                    key: 3,
                    name: '在线'
                }, {
                    key: 1,
                    name: '忙碌'
                }],
                history: {
                    page: {
                        pageSize: 50,
                        pageNum: 1,
                        pagingSwitch: true
                    },
                    total: 0,
                    isPullUpLoad: false
                },
                userChatRecord: {
                    curGuid: 0,
                    hasData: true,
                    isPullDownLoad: false
                },
                fingoIM: null,
                reConnectTag: false,
                csId: '2',
                inputText: '',
                currAppUserInfo: {},
                currAppUserHistory: []
            }
        },
        computed: {
            ...mapState({
                showCustomerNotice: state => state.app.showCustomerNotice,
                stateCustomerStatus: state => state.app.customerStatus
            })
        },
        watch: {
            showCustomerNotice (val) {
                // 显示消息列表 退出 在线
                if (val && this.stateCustomerStatus == 2 && this.fingoIM) {
                    this.disconnect()
                    this.IMinit()
                }
                if (val && !this.fingoIM) {
                    this.IMinit()
                }
            }
        },
        created () {
            if (localStorage.adminUserInfo) {
                this.userInfo = JSON.parse(localStorage.adminUserInfo)
                this.csId = 'customer_' + this.userInfo.id
            }
        },
        mounted () {
            this.$refs.historyScroll.addEventListener('scroll', this.historyScrollHandle)
            this.$refs.chatRecord.addEventListener('scroll', this.recordScrollHandle)
            window.onbeforeunload = () => {
                this.websocketLogout()
            }
        },
        beforeDestroy () {
            this.websocketLogout()
            this.$refs.historyScroll.removeEventListener('scroll', this.historyScrollHandle)
            this.$refs.chatRecord.removeEventListener('scroll', this.recordScrollHandle)
        },
        methods: {
            historyScrollHandle (e) {
                let element = e.target
                // 滚动到底部
                if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                    if (!this.history.isPullUpLoad) {
                        this.history.isPullUpLoad = true
                        this.getHistory({})
                    }
                }
            },
            recordScrollHandle (e) {
                let element = e.target
                // 滚动到顶部
                if (element.scrollTop === 0 && this.currAppUserHistory.length > 0) {
                    console.log('滚动到顶部')
                    if (!this.userChatRecord.isPullDownLoad) {
                        this.userChatRecord.isPullDownLoad = true
                        this.getUserHistory()
                    }
                }
            },
            // 预览
            previewAsset (url, type, index) {
                console.log(url)
                this.image.fileType = type
                this.image.index = index
                this.image.list = [url]
                this.image.show = true
                this.image.notDealUrl = true
            },
            // 关闭预览
            closePreview () {
                this.image.show = false
            },
            // 隐藏消息列表
            hiddenNoticeList () {
                this.$store.dispatch('switchNoticeStatus', !this.showCustomerNotice)
            },
            formatChatTime (item) {
                if (moment().isSame(item, 'day')) {
                    return moment(item).format('HH:mm')
                }
                return moment(item).format('YY/MM/DD')
            },
            IMinit () {
                this.fingoIM = new FingoIMApi({
                    appkey: 'fingoo',
                    appkeyPassword: '88ece739356a00f5d0790a39374048ca',
                    log: (message) => {
                        console.log(message)
                    },
                    onError: (message) => {
                        console.log(message)
                    },
                    onConnected: () => {
                        console.log('连接成功')
                        this.websocketLogin()
                    },
                    onDisconnected: () => {
                        console.log('连接断开')
                        this.fingoIM = null
                        this.$message.warning('连接断开，请刷新重试')
                    },
                    onMessageRecivied: (msg) => {
                        console.log('接收到信息')
                        console.log(msg)
                        if (msg && msg.length > 0) {
                            if (!this.showCustomerNotice) {
                                this.$notify({
                                    title: '提示',
                                    message: '接收到信息，请到消息中查看',
                                    duration: 3000
                                })
                            }
                            let msgList = msg
                            this.history.page.pageNum = 1
                            let _this = this
                            this.getHistory({
                                clear: true,
                                resolve () {
                                    for (let i = 0; i < msgList.length; i++) {
                                        let itemI = _this.sessionItemList.findIndex((val) => {
                                            return val.userId == msgList[i].fromUserName
                                        })
                                        if (msgList[i].fromUserName == _this.currAppUserInfo.userId) {
                                            _this.currAppUserHistory.push(msgList[i])
                                            _this.$nextTick(() => {
                                                let $el = _this.$el.querySelector('.notice_' + msgList[i].guid)
                                                $el && $el.scrollIntoView(false)
                                            })
                                            _this.currAppUserInfo.messageType = 1
                                        } else {
                                            if (itemI != -1) {
                                                _this.sessionItemList[itemI].hasRead = false
                                                _this.sessionItemList[itemI].count ++
                                            }
                                        }
                                        if (itemI != -1) {
                                            _this.sessionItemList[itemI].messageType = 1
                                        }
                                    }
                                }
                            })
                        }
                    },
                    onMessageSent: (msg) => {
                        console.log('发送消息' + msg)
                    }
                })
            },
            submitWorkOrder () {
                this.workOrder.show = true
                this.workOrder.param.userId = this.currAppUserInfo.userId
            },
            confirmAddWorkOrder () {
                this.currAppUserInfo.messageType = 3
                this.workOrder.show = false
                if (this.fingoIM) {
                    this.fingoIM.submitWorkOrder({
                        userId: this.currAppUserInfo.userId,
                        csId: this.csId,
                        success: (res) => {
                            console.log(res)
                        },
                        error: (err) => {
                            console.log(err)
                        }
                    })
                }
            },
            websocketLogin () {
                if (this.fingoIM) {
                    this.fingoIM.login({
                        userName: 'customer_' + this.userInfo.id,
                        phone: 'customer_' + this.userInfo.id,
                        success: (res) => {
                            console.log('登录成功返回')
                            this.customerLogin()
                        }
                    })
                }
            },
            websocketLogout () {
                this.customerLogout()
                this.disconnect()
            },
            // 客服登录
            customerLogin () {
                console.log('customerLogin')
                this.fingoIM.customerLogin({
                    userName: this.userInfo.nickName,
                    phone: 'customer_' + this.userInfo.id,
                    csId: 'customer_' + this.userInfo.id,
                    success: (res) => {
                        console.log(res)
                        this.csId = res.csId
                        this.customerStatus = res.serviceStatus
                        this.$store.dispatch('setCustomerStatus', this.customerStatus)
                        this.getHistory({})
                        this.syncReceivedMessage()
                    }
                })
            },
            // 客服退出
            customerLogout () {
                if (this.fingoIM) {
                    this.fingoIM.customerLogout({
                        csId: this.csId
                    })
                    this.$store.dispatch('setCustomerStatus', 2)
                    this.hiddenNoticeList()
                }
            },
            // 断开链接
            disconnect () {
                if (this.fingoIM) {
                    if (this.fingoIM.isLogined()) {
                        this.fingoIM.logout({})
                    }
                    this.fingoIM.disconnect()
                    this.fingoIM = null
                }
            },
            // 获取消息列表
            getHistory ({ clear, resolve }) {
                if (this.sessionItemList.length <= this.history.total) {
                    if (this.fingoIM) {
                        console.log('getHistory')
                        this.fingoIM.getNoticeHistory({
                            csId: this.csId,
                            page: this.history.page,
                            success: (res) => {
                                let oldItemList = JSON.parse(JSON.stringify(this.sessionItemList))
                                if (clear) {
                                    this.sessionItemList = []
                                }
                                for (let i = 0; i < res.sessionItemList.length; i++) {
                                    let oldItem = oldItemList.find((val) => {
                                        return val.userId == res.sessionItemList[i].userId
                                    })
                                    res.sessionItemList[i]['hasRead'] = oldItem ? oldItem.hasRead : true
                                    res.sessionItemList[i]['count'] = oldItem ? oldItem.count : 0
                                    let item = this.sessionItemList.find((val) => {
                                        return val.userId == res.sessionItemList[i].userId
                                    })
                                    if (!item) {
                                        this.sessionItemList.push(res.sessionItemList[i])
                                    }
                                }
                                if (this.sessionItemList.length > 0 && Object.keys(this.currAppUserInfo).length == 0) {
                                    this.selectUser(this.sessionItemList[0])
                                    this.getUserHistory()
                                }
                                this.history.isPullUpLoad = false
                                this.history.page.pageNum += 1
                                this.history.total = res.total
                                resolve && resolve()
                                console.log(this.sessionItemList)
                            }
                        })
                    }
                }
            },
            // 获取历史记录
            getUserHistory () {
                if (this.fingoIM && this.userChatRecord.hasData && this.currAppUserInfo.userId) {
                    console.log('getUserHistory')
                    this.fingoIM.getHistoryMessage({
                        fromUsername: this.csId,
                        toUsername: this.currAppUserInfo.userId,
                        beginGuid: this.userChatRecord.curGuid,
                        limit: 20,
                        success: (res) => {
                            console.log(res)
                            let lastGuid = this.userChatRecord.curGuid
                            if (res.length === 0) {
                                this.userChatRecord.hasData = false
                            }
                            this.currAppUserHistory = res.reverse().concat(this.currAppUserHistory)
                            this.userChatRecord.curGuid = this.currAppUserHistory.length > 0 ? this.currAppUserHistory[0].guid : 0
                            this.userChatRecord.isPullDownLoad = false
                            this.$nextTick(() => {
                                if (lastGuid == 0) {
                                    lastGuid = this.currAppUserHistory.length > 0 ? this.currAppUserHistory[this.currAppUserHistory.length - 1].guid : 0
                                }
                                let $el = this.$el.querySelector('.notice_' + lastGuid)
                                $el && $el.scrollIntoView(false)
                            })
                        },
                        error: (err) => {
                            console.log(err)
                        }
                    })
                }
            },
            // 设置客服状态
            setServerStatus (status) {
                if (this.fingoIM) {
                    this.fingoIM.setServiceStatus({
                        csId: this.csId,
                        status: status,
                        success: (res) => {
                            this.customerStatus = status
                            this.$store.dispatch('setCustomerStatus', status)
                            console.log(res)
                        }
                    })
                }
            },
            initUserHistory () {
                this.userChatRecord.hasData = true
                this.userChatRecord.curGuid = 0
                this.currAppUserHistory = []
                this.userChatRecord.isPullDownLoad = false
            },
            selectUser (data) {
                if (this.currAppUserInfo.userId != data.userId) {
                    this.currAppUserInfo = data
                    data.hasRead = true
                    data.count = 0
                    this.initUserHistory()
                    this.getUserHistory()
                    if (this.fingoIM && this.currAppUserInfo.messageType == 1) {
                        this.fingoIM.checkBindWithUser({
                            userId: this.currAppUserInfo.userId,
                            csId: this.csId,
                            success: (res) => {},
                            error: (err) => {
                                if (err.ret == 505 || err.ret == 507) {
                                    this.sendStopMessage()
                                    this.$message.warning('和用户绑定关系已经超时断开，不可在发送消息')
                                }
                            }
                        })
                    }
                }
            },
            // 发送消息
            sendMessage (event) {
                if (event.keyCode === 13 && (event.shiftKey || event.altKey || event.ctrlKey)) {
                    return
                }
                if (this.fingoIM) {
                    console.log('开始发送消息')
                    this.fingoIM.sendTextMessage({
                        toUsername: this.currAppUserInfo.userId,
                        fromUsername: this.csId,
                        fromNick: this.userInfo.nickName,
                        burnAfterRead: false,
                        text: this.inputText,
                        success: (res) => {
                            this.inputText = ''
                            this.initUserHistory()
                            this.getUserHistory()
                            console.log(res)
                        },
                        error: (err) => {
                            if (err.ret == 505 || err.ret == 507) {
                                this.sendStopMessage()
                                this.$message.warning('和用户绑定关系已经超时断开，不可在发送消息')
                            }
                        }
                    })
                }
            },
            // 发送文件
            sendFileMessage (e) {
                let target = e.srcElement || e.target
                let files = target.files
                if (this.fingoIM) {
                    for (let i = 0; i < files.length; i++) {
                        console.log(files[i].type)
                        if (files[i].type == 'image/jpeg' || files[i].type == 'image/jpg' ||
                            files[i].type == 'image/png' || files[i].type == 'image/gif') {
                            this.fingoIM.sendPicMessage({
                                toUsername: this.currAppUserInfo.userId,
                                fromUsername: this.csId,
                                fromNick: this.userInfo.nickName,
                                file: files[i],
                                fileName: files[i].name,
                                relay: 0,
                                burnAfterRead: false,
                                msgContentType: 1,
                                success: (res) => {
                                    console.log(res)
                                    this.initUserHistory()
                                    this.getUserHistory()
                                },
                                error: (err) => {
                                    if (err.ret == 505 || err.ret == 507) {
                                        this.sendStopMessage()
                                        this.$message.warning('和用户绑定关系已经超时断开，不可在发送消息')
                                    }
                                }
                            })
                        } else if (files[i].type == 'video/mp4') {
                            this.fingoIM.sendVdoMessage({
                                toUsername: this.currAppUserInfo.userId,
                                fromUsername: this.csId,
                                fromNick: this.userInfo.nickName,
                                file: files[i],
                                fileName: files[i].name,
                                relay: 0,
                                burnAfterRead: false,
                                msgContentType: 2,
                                success: (res) => {
                                    console.log(res)
                                    this.initUserHistory()
                                    this.getUserHistory()
                                },
                                error: (err) => {
                                    if (err.ret == 505 || err.ret == 507) {
                                        this.sendStopMessage()
                                        this.$message.warning('和用户绑定关系已经超时断开，不可在发送消息')
                                    }
                                }
                            })
                        }
                    }
                }
                target.value = ''
            },
            syncReceivedMessage () {
                if (this.fingoIM) {
                    console.log('syncReceivedMessage')
                    this.fingoIM.syncSendGUID()
                }
            },
            sendStopMessage () {
                if (this.fingoIM) {
                    this.fingoIM.sendCustomMessage({
                        toUsername: this.currAppUserInfo.userId,
                        fromUsername: this.csId,
                        fromNick: this.userInfo.nickName,
                        burnAfterRead: false,
                        notification: '服务结束，请对本次服务进行评价',
                        customEntityList: [],
                        success: (res) => {
                            this.currAppUserInfo.messageType = 2
                        }
                    })
                }
            },
            // 结束服务
            stopUserService () {
                this.$confirm('确认要结束本次咨询服务么？结束服务后，将无法给用户发消息信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.fingoIM) {
                        this.sendStopMessage()
                        this.fingoIM.stopServer({
                            userId: this.currAppUserInfo.userId,
                            csId: this.csId,
                            success: (res) => {
                                console.log(res)
                            }
                        })
                    }
                }).catch(() => {})
            }
        }
    }
</script>
<style lang="scss" scoped>
    .notice-dialog{
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        .notice-wrapper{
            width: 60%;
            height: 80%;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,.3);
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            .header-box{
                width: 100%;
                height: 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding: 0 10px;
                border-bottom: 1px solid #eaeefb;
                .r{
                    display: flex;
                    align-items: center;
                    .user-img-box{
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        position: relative;
                        .header-img{
                            font-size: 30px;
                        }
                        .cus-online-status-wrapper{
                            position: absolute;
                            bottom: 0;
                            left: 18px;
                        }
                    }
                    .user-name{
                        color: #333;
                        margin-left: 5px;
                    }
                    .logout-btn{
                        margin-left: 10px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        color: #444;
                        font-size: 14px;
                        i{
                            font-size: 20px;
                            margin-right: 5px;
                        }
                    }
                }
            }
            .notice-content{
                width: 100%;
                flex: 1;
                display: flex;
                overflow: hidden;
                .l{
                    width: 30%;
                    height: 100%;
                    border-right: 1px solid #eee;
                    overflow: auto;
                    li{
                        box-sizing: border-box;
                        padding: 10px;
                        border-bottom: 1px solid #eee;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        .user-img{
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 10px;
                            position: relative;
                            img{
                                width: 100%;
                                height: 100%;
                                display: flex;
                            }
                            i{
                                font-size: 25px;
                                color: #575e73;
                            }
                        }
                        .user-info{
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            overflow: hidden;
                            position: relative;
                            .user-nick-name{
                                width: 100%;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                color: #222;
                                font-size: 14px;
                                margin-bottom: 10px;
                                span{
                                    margin-right: 10px;
                                }
                                em{
                                    flex: 1;
                                    color: #666;
                                    font-weight: normal;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    text-align: right;
                                }
                            }
                            .chat-time{
                                color: #666;
                                font-size: 12px;
                                width: 100%;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                position: relative;
                                .has-read-status{
                                    width: 8px;
                                    height: 8px;
                                    background: #ff051d;
                                    border-radius: 100%;
                                    position: absolute;
                                    right: -5px;
                                    top: -5px;
                                }
                            }
                            .order-has-submit{
                                position: absolute;
                                right: 5px;
                                bottom: 0;
                                i{
                                    font-size: 14px;
                                    color: #666;
                                }
                            }
                            .not-read{
                                position: absolute;
                                right: 5px;
                                bottom: 0;
                            }
                        }
                        &.selected{
                            background: #ecf5ff;
                        }
                    }
                    .end-service{
                        background: #eee;
                    }
                }
                .r{
                    flex: 1;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f3f3f3;
                    overflow: hidden;
                    .cur-user-nick-name{
                        height: 40px;
                        line-height: 40px;
                        border-bottom: 1px solid #eee;
                        box-sizing: border-box;
                        padding: 0 10px;
                        font-size: 14px;
                        background: #fff;
                    }
                    .end-tips{
                        width: 100%;
                        height: 40px;
                        background: #fffada;
                        color: #FE7642;
                        font-size: 14px;
                        line-height: 40px;
                        box-sizing: border-box;
                        padding: 0 10px;
                    }
                    .chat-record-wrapper{
                        flex: 1;
                        box-sizing: border-box;
                        padding: 10px;
                        overflow: auto;
                        ul{
                            width: 100%;
                            li{
                                width: 100%;
                                .send-time{
                                    width: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    margin-bottom: 10px;
                                    color: #333;
                                    font-size: 12px;
                                }
                                .user-msg{
                                    display: flex;
                                    width: 100%;
                                    .user-img{
                                        width: 30px;
                                        height: 30px;
                                        border-radius: 100%;
                                        overflow: hidden;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin-right: 10px;
                                        img{
                                            width: 100%;
                                            height: 100%;
                                            display: flex;
                                        }
                                        i{
                                            font-size: 25px;
                                            color: #575e73;
                                        }
                                    }
                                    .notice-text{
                                        flex: 1;
                                        font-size: 14px;
                                        margin-bottom: 20px;
                                        overflow: hidden;
                                        .text-wrapper{
                                            display: flex;
                                            box-sizing: border-box;
                                            padding: 0 100px 0 0;
                                            span{
                                                word-wrap: break-word;
                                                word-break: break-all;
                                                text-align: left;
                                                background: #fff;
                                                box-sizing: border-box;
                                                padding: 10px;
                                                border-radius: 4px;
                                            }
                                        }
                                        .flex-end{
                                            display: flex;
                                            justify-content: flex-end;
                                        }
                                        img{
                                            width: 200px;
                                            cursor: pointer;
                                        }
                                        .video-wrapper{
                                            width: 200px;
                                            position: relative;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            cursor: pointer;
                                            video{
                                                width: 100%;
                                            }
                                            i{
                                                position: absolute;
                                                font-size: 40px;
                                                color: #fff;
                                            }
                                        }
                                    }
                                    .customer-wrapper{
                                        text-align: right;
                                        margin-right: 10px;
                                        display: flex;
                                        justify-content: flex-end;
                                        .text-wrapper {
                                            justify-content: flex-end;
                                            box-sizing: border-box;
                                            padding: 0 0 0 100px;
                                            span{
                                                background: #b0e56e;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .input-wrapper{
                        border-top: 1px solid #eee;
                        height: 134px;
                        background: #fff;
                        .customer-btn-wrapper{
                            background: #fefefe;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            box-sizing: border-box;
                            padding: 10px;
                            font-size: 14px;
                            .file-upload{
                                position: relative;
                                input{
                                    opacity: 0;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    height: 100%;
                                }
                            }
                            i, span{
                                cursor: pointer;
                            }
                        }
                        textarea{
                            background: #fefefe;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            padding: 10px;
                            border: 0;
                            box-shadow: none;
                            outline: none;
                        }
                        .has-end{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            box-sizing: border-box;
                            padding: 10px;
                        }
                        .has-submit{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            >div{
                                width: 194px;
                                height: 34px;
                                box-sizing: border-box;
                                padding: 10px;
                                background: #edf8e8;
                                border: 1px solid #daf0d0;
                                border-radius: 4px;
                                display: flex;
                                align-items: center;
                                span{
                                    color: #666;
                                    font-size: 12px;
                                    margin-left: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .status-wrapper{
        width: 100%;
        display: flex;
        align-items: center;
        .status-icon{
            font-size: 20px;
        }
        span{
            margin-right: 5px;
        }
    }
</style>
