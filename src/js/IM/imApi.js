import '@/imProto/css/base_pb.js'
import '@/imProto/css/chat_pb.js'
import '@/imProto/css/enum_pb.js'
import '@/imProto/css/errcode_pb.js'
import '@/imProto/css/connector_pb.js'
import '@/imProto/css/msg_pb.js'
import '@/imProto/css/ntf_pb.js'
import '@/imProto/css/websocket_pb.js'
import '@/imProto/css/push_pb.js'
import '@/imProto/css/grpc_pb.js'

import { ReconnectingWebSocket, FingoIMBase } from './imBase.js'
import { ErrorCode } from './errCode'
import { paramValid } from './validUtils'

const PROTOC = 'wss://'
const PAFS_SMALL_FILE_URL = '/file/rest/uploadservices/uploadfile'
const GET_URL_BY_MD5 = '/file/rest/uploadservices/geturlbymd5'

const config = {
    pcDomain: process.env.VUE_APP_IM_PC_DOMAIN,
    pafsDomain: process.env.VUE_APP_IM_PAFS_DOMAIN
}
let MEDIA_FILE_IMAGE_TYPE = 'image'
let MEDIA_FILE_GIF_TYPE = 'gif'
let MEDIA_FILE_AUDIO_TYPE = 'audio'
let MEDIA_FILE_VIDEO_TYPE = 'video'
let MEDIA_FILE_LOCATION_TYPE = 'location'
let MEDIA_FILE_OTHER_TYPE = 'other'

let globalApi = null

/**
 * 去除数组重复元素
 */
function uniqueArray (data) {
    data = data || []
    var a = {}
    for (var i = 0; i < data.length; i++) {
        var v = data[i]
        if (typeof (a[v]) === 'undefined') {
            a[v] = 1
        }
    }
    data.length = 0
    for (var i in a) {
        data[data.length] = i
    }
    return data
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '')
}

/* 接口类
 * @param {options}
 * string,options.appkey:申请的appkey
 * string,options.appkeyPassword:申请的appkey密码
 * string,options.service:websoket服务地址
 * Log,options.log:日志实例
 * func,options.onError:异常回调
 * func,options.onConnected:连接成功回调
 * func,options.onDisconnected:断开回调
 * func,options.onMessageRecivied:新消息监听回调
 * return void
 */
const FingoIMApi = function (options) {
    globalApi = this
    this._fromNick = ''
    this._sendGuid = options.sendGuid ? options.sendGuid : 0
    this._recvGuid = options.recvGuid ? options.recvGuid : 0
    this._log = options.log

    this._onError = options.onError || FingoIMBase.Util.emptyFn
    this._onConnected = options.onConnected || FingoIMBase.Util.emptyFn
    this._onDisconnected = options.onDisconnected || FingoIMBase.Util.emptyFn
    this._onMessageRecivied = options.onMessageRecivied || FingoIMBase.Util.emptyFn
    this._onMessageSent = options.onMessageSent || FingoIMBase.Util.emptyFn
    this._onFriendUpdated = options.onFriendUpdated || FingoIMBase.Util.emptyFn
    this._onGroupUpdated = options.onGroupUpdated || FingoIMBase.Util.emptyFn
    this._onKicked = options.onKicked || FingoIMBase.Util.emptyFn

    this._appkey = options.appkey.trim()
    this._appkeyPassword = options.appkeyPassword.trim()

    this._doInitConfig(config)
}
/* 获取配置后的初始化 private
 * @param {config}
 * return
 */
FingoIMApi.prototype._doInitConfig = function (config) {
    let that = this
    this._service = PROTOC + config.pcDomain
    this._pafsDomain = config.pafsDomain
    this._connection = new FingoIMBase.Connection(this._service, this._log)
    this._connection.onError = this._onError || FingoIMBase.Util.emptyFn
    this._connection.onConnected = this._onWebConnected || FingoIMBase.Util.emptyFn
    this._connection.onDisconnected = this._onWebDisconnected || FingoIMBase.Util.emptyFn
    this._onMessageRecivied = this._onMessageRecivied || FingoIMBase.Util.emptyFn
    this._wsInstance = new FingoIMBase.Websocket(this._connection, this._log)
    // 连接失败
    let conError = function (e) {
        that._onError({
            ret: '50001',
            msg: ErrorCode['50001']
        })
    }
    let conSuccess = function () {}
    this._wsInstance.connect(conSuccess, conError)

    this._connection.addNotifyHandler(that._handleLoginResphonse, proto.css.ntf.ENtfType.LOGIN_RESPONSE)
    this._connection.addNotifyHandler(that._handleLogoutResphonse, proto.css.ntf.ENtfType.LOGOUT_RESPONSE)
    this._connection.addNotifyHandler(that._handleKickNotification, proto.css.ntf.ENtfType.KICK_NOTIFICATION)
    this._connection.addNotifyHandler(that._handleStreanInit, proto.css.ntf.ENtfType.STREAM_INIT_RESPONSE)
    this._connection.addNotifyHandler(that._handleNewMessageNotify, proto.css.ntf.ENtfType.NEW_MSG)
    this._connection.addNotifyHandler(that._handleFriendUpdateNotify, proto.css.ntf.ENtfType.FRIEND_UPDATE_NOTIFICATION)
    this._connection.addNotifyHandler(that._handleGroupUpdateNotify, proto.css.ntf.ENtfType.GROUP_LIST_UPDATE_NOTIFICATION)
    this._connection.addNotifyHandler(that._handleRetractNotify, proto.css.ntf.ENtfType.RETRACT_NOTIFICATION)
    this._connection.addNotifyHandler(that._handleCarbonMsgNotify, proto.css.ntf.ENtfType.CARBON_MSG)
}

FingoIMApi.prototype._onWebConnected = function () {
    if (!globalApi._kicked) {
        globalApi._onConnected()
        if (typeof globalApi._userName !== 'undefined' && typeof globalApi._password !== 'undefined') {
            if (this.status == FingoIMBase.Connection.Status.LOGOUTING) {
                globalApi.logout({
                    success: function (ret) {
                    },
                    error: function (ret) {
                    }
                })
            }
            globalApi.login({
                userName: globalApi._userName,
                password: globalApi._password,
                isDigest: 'true',
                success: function (ret) {
                },
                error: function (ret) {
                }
            })
        }
    }
}

FingoIMApi.prototype._onWebDisconnected = function (msg) {
    var that = this
    that.status = FingoIMBase.Connection.Status.DISCONNECTED
    globalApi._onDisconnected()
}

/* 登录 public
 * @param {options}
 * string,options.userName:用户名
 * string,options.password:密码
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.login = function (options) {
    let that = this
    let digestPwd = null
    let errorStr = ''
    if (that.getConnStatus() === FingoIMBase.Connection.Status.LOGINING) {
        errorStr += '用户正在登录中'
    }
    if (that.getConnStatus() === FingoIMBase.Connection.Status.LOGINED) {
        errorStr += '用户已登录'
    }
    let error = options.error || FingoIMBase.Util.emptyFn
    let success = options.success || FingoIMBase.Util.emptyFn
    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (this._wsInstance && this.isConnected()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始登录...')
        }
        let loginRequest = new proto.css.websocket.LoginRequest()
        loginRequest.setAppkey(that._appkey)
        loginRequest.setUsername(options.userName.toString().trim().toLowerCase())
        loginRequest.setPhone(options.userName.toString().trim().toLowerCase())
        let loginProxyRequest = FingoIMBase.Util.buildProxyRequest(
            FingoIMBase.Services.SERVICE_WEBSOCKET,
            FingoIMBase.Methods.METHOD_LOGIN,
            loginRequest.serializeBinary()
        )
        that._connection.addRequestHandler(function (res) {
            res = res.toObject()
            if (res.ret == 0) {
                globalApi._kicked = false
                that._connection.status = FingoIMBase.Connection.Status.LOGINED
                that._userName = options.userName
                that._fromNick = res.userInfo.nick
                that._phone = res.userInfo.phone
                that._password = digestPwd
                success(res)
                // that.syncSendGUID()
            } else {
                res.msg = ErrorCode[res.ret]
                that._connection.status = FingoIMBase.Connection.Status.CONNECTED
                error(res)
            }
        }, FingoIMBase.Services.SERVICE_WEBSOCKET, FingoIMBase.Methods.METHOD_LOGIN, loginProxyRequest.getRequestId(),proto.css.websocket.LoginResponse.deserializeBinary)
        that._connection.status = FingoIMBase.Connection.Status.LOGINING
        that._wsInstance.send(loginProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('登录请求发送, 请求 id:' + loginProxyRequest.getRequestId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 客服登录
 * @param {options}
 * string,options.userName:客服ID
 * return void
 */
FingoIMApi.prototype.customerLogin = function (options) {
    var loginRequest = new proto.css.chat.CustomerServiceSignInReq()
    loginRequest.setCsName(options.userName)
    loginRequest.setCsId(options.csId)
    loginRequest.setCsMobile(options.phone)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_CUSTOMER_LOGIN
    var deserializeBinary = proto.css.chat.CustomerServiceSignInResp.deserializeBinary
    var LoginProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, loginRequest.serializeBinary())
    function handler (res) {
        res = res.toObject()
        console.log(res)
        if (res.ret == 1) {
            options.success && options.success(res)
        }
    }
    this._connection.addRequestHandler(handler, service, method, LoginProxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(LoginProxyRequest.serializeBinary())
}
/* 设置是否提交工单状态
 * @param {options}
 * string,options.userName:客服ID
 * return void
 */
FingoIMApi.prototype.submitWorkOrder = function (options) {
    var requestParam = new proto.css.chat.SetSessionTypeAfterSubmittedWorkOrderReq()
    requestParam.setCsId(options.csId)
    requestParam.setUserId(options.userId)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_SUBMIT_WORK_ORDER
    var deserializeBinary = proto.css.chat.SetSessionTypeAfterSubmittedWorkOrderResp.deserializeBinary
    var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestParam.serializeBinary())

    function handler (res) {
        res = res.toObject()
        if (res.ret == 1) {
            options.success && options.success(res)
        } else {
            options.error && options.error(res)
        }
    }
    this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(proxyRequest.serializeBinary())
}
/* 判断和用户绑定关系是否已经断开
 * @param {options}
 * string,options.userName:客服ID
 * return void
 */
FingoIMApi.prototype.checkBindWithUser = function (options) {
    var requestParam = new proto.css.chat.CheckBundleOverdueReq()
    requestParam.setCsId(options.csId)
    requestParam.setUserId(options.userId)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_CHECK_BUNDLE_OVERDUE
    var deserializeBinary = proto.css.chat.CheckBundleOverdueResp.deserializeBinary
    var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestParam.serializeBinary())

    function handler (res) {
        res = res.toObject()
        if (res.ret == 1) {
            options.success && options.success(res)
        } else {
            options.error && options.error(res)
        }
    }
    this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(proxyRequest.serializeBinary())
}
/* 登出 public
 * @param {options}
 * string,options.userName:用户名
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.logout = function (options) {
    var that = this
    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn
    if (this._wsInstance && this.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始登出...')
        }
        var logoutRequest = new proto.css.websocket.LogoutRequest()
        logoutRequest.setAppkey(this._appkey)
        logoutRequest.setUsername(this._userName)

        var logoutProxyRequest = FingoIMBase.Util.buildProxyRequest(
            FingoIMBase.Services.SERVICE_WEBSOCKET,
            FingoIMBase.Methods.METHOD_LOGOUT,
            logoutRequest.serializeBinary()
        )

        this._connection.addRequestHandler(function (res) {
            res = res.toObject()
            if (res.ret == 0) {
                that._connection.status = FingoIMBase.Connection.Status.CONNECTED
                success(res)
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }, FingoIMBase.Services.SERVICE_WEBSOCKET, FingoIMBase.Methods.METHOD_LOGOUT, logoutProxyRequest.getRequestId(), proto.css.websocket.LogoutResponse.deserializeBinary)
        this._connection.status = FingoIMBase.Connection.Status.LOGOUTING
        this._wsInstance.manualCloseSocket()
        this._wsInstance.send(logoutProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('登出请求发送, 请求 id:' + logoutProxyRequest.getRequestId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}
/* 客服结束对用户的服务
 * @param {options}
 * string,options.userName:用户名
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.stopServer = function (options) {
    var requestParam = new proto.css.chat.CSStopServiceReq()
    requestParam.setCsId(options.csId)
    requestParam.setUserId(options.userId)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_STOP_SERVICE
    var deserializeBinary = proto.css.chat.CSStopServiceResp.deserializeBinary
    var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestParam.serializeBinary())

    function handler (res) {
        res = res.toObject()
        if (res.ret == 1) {
            options.success && options.success(res)
        }
    }
    this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(proxyRequest.serializeBinary())
}

/* 客服退出
 * @param {options}
 * string,options.userName:客服ID
 * return void
 */
FingoIMApi.prototype.customerLogout = function (options) {
    var logoutRequest = new proto.css.chat.CustomerServiceSignOutReq()
    logoutRequest.setCsId(options.csId)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_CUSTOMER_LOGOUT
    var deserializeBinary = proto.css.chat.CustomerServiceSingOutResp.deserializeBinary
    var logoutProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, logoutRequest.serializeBinary())

    function handler (res) {
        res = res.toObject()
        console.log(res)
    }
    this._connection.addRequestHandler(handler, service, method, logoutProxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(logoutProxyRequest.serializeBinary())
}

/* 设置客服状态
 * @param {options}
 * string,options.userName:客服ID
 * return void
 */
FingoIMApi.prototype.setServiceStatus = function (options) {
    var requestParam = new proto.css.chat.SetServiceStatusReq()
    requestParam.setCsId(options.csId)
    requestParam.setStatus(options.status)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_SET_STATUS
    var deserializeBinary = proto.css.chat.SetServiceStatusResp.deserializeBinary
    var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestParam.serializeBinary())

    function handler (res) {
        res = res.toObject()
        if (res.ret == 1) {
            options.success && options.success(res)
        }
    }
    this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(proxyRequest.serializeBinary())
}

/* 获取历史会话
 * @param {options}
 * string,options.userName:客服ID
 * return void
 */
FingoIMApi.prototype.getNoticeHistory = function (options) {
    var requestParam = new proto.css.chat.GetSessionWithPageReq()
    requestParam.setCsId(options.csId)
    var messageObg = new proto.css.base.Pagination()
    messageObg.setPageNum(options.page.pageNum)
    messageObg.setPageSize(options.page.pageSize)
    messageObg.setPagingSwitch(options.page.pagingSwitch)
    requestParam.setPage(messageObg)
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_GET_SESSION
    var deserializeBinary = proto.css.chat.GetSessionWithPageResp.deserializeBinary
    var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestParam.serializeBinary())

    function handler (res) {
        res = res.toObject()
        console.log(res)
        if (res.ret == 1) {
            options.success && options.success(res)
        }
    }
    this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), deserializeBinary)
    this._wsInstance.send(proxyRequest.serializeBinary())
}

/* 发送自定义消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendCustomMessage = function (options) {
    var that = this

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (that._wsInstance && that.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始发送自定义消息...')
        }
        options.msgContentType = proto.css.msg.EMsgContentType.CUSTOM
        var messageRequest, service, method, deserializeBinary
        messageRequest = new proto.css.chat.ChatMessageRequest()
        messageRequest.setToUsername(options.toUsername)
        messageRequest.setFromNick(options.fromNick)
        messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
        messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
        service = FingoIMBase.Services.SERVICE_CHAT
        method = FingoIMBase.Methods.METHOD_SENDCHAT
        deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
        messageRequest.setFromUsername(options.fromUsername)
        messageRequest.setAppkey(that._appkey)
        messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
        messageRequest.setMsgContentType(options.msgContentType)
        messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

        var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

        function handler (res) {
            console.log(res)
            res = res.toObject()
            if (res.ret == 0) {
                that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                res.guid = Long.fromValue(res.guid).toString()
                success(res)
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }
        that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
        that._wsInstance.send(messageProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('自定义消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送文本消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendTextMessage = function (options) {
    var that = this

    var errorStr = paramValid.validText('text', options.text)
    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }
    if (that._wsInstance && that.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始发送文本消息...')
        }

        options.msgContentType = proto.css.msg.EMsgContentType.TEXT
        var messageRequest, service, method, deserializeBinary
        messageRequest = new proto.css.chat.ChatMessageRequest()
        messageRequest.setToUsername(options.toUsername)
        messageRequest.setFromNick(options.fromNick)
        messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
        messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
        messageRequest.setFromUsername(options.fromUsername)
        messageRequest.setAppkey(that._appkey)
        messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
        messageRequest.setMsgContentType(paramValid.strTrim(options.msgContentType))
        messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))
        service = FingoIMBase.Services.SERVICE_CHAT
        method = FingoIMBase.Methods.METHOD_SENDCHAT
        deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary

        var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

        function handler (res) {
            res = res.toObject()
            console.log(res)
            if (res.ret == 0) {
                that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                res.guid = Long.fromValue(res.guid).toString()
                success(res)
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }

        that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
        that._wsInstance.send(messageProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('文本消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.text)
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送文件消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendFileMessage = function (options) {
    var that = this
    var errorStr = paramValid.validUserName('toUserName', options.toUserName)

    errorStr += paramValid.validRelay('relay', options.relay)
    if (paramValid.validRelay('relay', options.relay) == '' && paramValid.strTrim(options.relay) == 1) {
        errorStr += paramValid.validFileName('fileName', options.fileName)
        errorStr += paramValid.validFileLink('fileLink', options.fileLink)
        errorStr += paramValid.validLimit('fileLength', options.fileLength)
    } else {
        errorStr += paramValid.validFile('file', options.file)
    }

    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (that._wsInstance && that.isLogined()) {
        options.msgContentType = proto.css.msg.EMsgContentType.FILE

        if (paramValid.strTrim(options.relay) == 1) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('开始发送文件消息...')
            }

            var messageRequest, service, method, deserializeBinary
            messageRequest = new proto.css.chat.ChatMessageRequest()
            messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
            messageRequest.setFromNick(that._fromNick)
            messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
            service = FingoIMBase.Services.SERVICE_CHAT
            method = FingoIMBase.Methods.METHOD_SENDCHAT
            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
            messageRequest.setFromUsername(that._userName)
            messageRequest.setAppkey(that._appkey)
            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
            messageRequest.setMsgContentType(options.msgContentType)
            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

            function handler (res) {
                res = res.toObject()
                if (res.ret == 0) {
                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                    res.guid = Long.fromValue(res.guid).toString()
                    success(res)
                } else {
                    res.msg = ErrorCode[res.ret]
                    error(res)
                }
            }

            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
            that._wsInstance.send(messageProxyRequest.serializeBinary())
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('文件消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.fileName)
            }
        } else {
            browserMD5File(options.file, function (err, md5) {
                FingoIMBase.Util.doHttpRequest({
                    type: 'POST',
                    url: that._pafsDomain + GET_URL_BY_MD5 + '?md5=' + md5.toString(),
                    success: function (ret) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.debug('成功匹配MD5：' + ret)
                        }
                        ret = JSON.parse(ret)
                        if (ret.status == 600) {
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始发送文件消息...')
                            }
                            var messageRequest, service, method, deserializeBinary
                            messageRequest = new proto.css.chat.ChatMessageRequest()
                            messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
                            messageRequest.setFromNick(that._fromNick)
                            messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                            service = FingoIMBase.Services.SERVICE_CHAT
                            method = FingoIMBase.Methods.METHOD_SENDCHAT
                            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                            messageRequest.setFromUsername(that._userName)
                            messageRequest.setAppkey(that._appkey)
                            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                            messageRequest.setMsgContentType(options.msgContentType)

                            options.fileName = options.file.name
                            options.fileLink = ret.original_link
                            options.fileLength = options.file.size

                            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                            function handler (res) {
                                res = res.toObject()
                                if (res.ret == 0) {
                                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                    res.guid = Long.fromValue(res.guid).toString()
                                    success(res)
                                } else {
                                    res.msg = ErrorCode[res.ret]
                                    error(res)
                                }
                            }

                            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                            that._wsInstance.send(messageProxyRequest.serializeBinary())
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('文件消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                            }
                        } else {
                            var onFileUploadProgress = options.onFileUploadProgress || FingoIMBase.Util.emptyFn
                            var onFileUploadCanceled = options.onFileUploadCanceled || FingoIMBase.Util.emptyFn
                            // 文件上传
                            var fileOptions = {
                                fileInfo: {
                                    file: options.file,
                                    param: JSON.stringify({
                                        type: MEDIA_FILE_OTHER_TYPE,
                                        fileName: options.file.name
                                    })
                                },
                                url: that._pafsDomain + PAFS_SMALL_FILE_URL,
                                onFileUploadProgress: function (progress) {
                                    onFileUploadProgress(progress)
                                },
                                onFileUploadComplete: function (res) {
                                    doFileUploadComplete(res)
                                },
                                onFileUploadError: function (e) {
                                    error(e)
                                },
                                onFileUploadCanceled: function () {
                                    onFileUploadCanceled()
                                }
                            }

                            // 发送文件消息
                            function doFileUploadComplete (res) {
                                if (res.status != '600') {
                                    res.msg = ErrorCode['50' + res.status]
                                    error(res)
                                    return
                                }
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('开始发送文件消息...')
                                }

                                var messageRequest, service, method, deserializeBinary
                                messageRequest = new proto.css.chat.ChatMessageRequest()
                                messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
                                messageRequest.setFromNick(that._fromNick)
                                messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                                messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                                service = FingoIMBase.Services.SERVICE_CHAT
                                method = FingoIMBase.Methods.METHOD_SENDCHAT
                                deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                                messageRequest.setFromUsername(that._userName)
                                messageRequest.setAppkey(that._appkey)
                                messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                                messageRequest.setMsgContentType(options.msgContentType)

                                options.fileName = options.file.name
                                options.fileLink = res.original_link
                                options.fileLength = options.file.size

                                messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                                var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                                function handler (res) {
                                    res = res.toObject()
                                    if (res.ret == 0) {
                                        that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                        res.guid = Long.fromValue(res.guid).toString()
                                        success(res)
                                    } else {
                                        res.msg = ErrorCode[res.ret]
                                        error(res)
                                    }
                                }

                                that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                                that._wsInstance.send(messageProxyRequest.serializeBinary())
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('文件消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                                }
                            }

                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始上传文件...')
                            }

                            FingoIMBase.Util.uploadFn(fileOptions)
                        }
                    },
                    error: function (e) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.error('匹配MD5失败：' + JSON.stringify(e))
                        }
                    }
                })
            })
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送图片消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendPicMessage = function (options) {
    var that = this
    var errorStr = paramValid.validRelay('relay', options.relay)
    if (paramValid.validRelay('relay', options.relay) == '' && paramValid.strTrim(options.relay) == 1) {
        errorStr += paramValid.validFileName('picFileName', options.fileName)
        if (!errorStr) {
            var mime = options.fileName.toLowerCase().substr(options.fileName.lastIndexOf('.'))
            if (mime != '.gif') {
                errorStr += paramValid.validPicFileLink('bigLink', options.fileName)
                errorStr += paramValid.validPicFileLink('middleLink', options.fileName)
            }
        }
        errorStr += paramValid.validPicFileLink('originLink', options.fileName)
        errorStr += paramValid.validPicFileLink('smallLink', options.fileName)
        errorStr += paramValid.validLimit('fileLength', options.fileName)
    } else {
        errorStr += paramValid.validFile('picFile', options.file)
    }

    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)
    // errorStr += paramValid.validBoolean("isOriginal", options.isOriginal);

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (that._wsInstance && that.isLogined()) {
        options.msgContentType = proto.css.msg.EMsgContentType.IMAGE

        if (paramValid.strTrim(options.relay) == 1) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('开始发送图片消息...')
            }
            var messageRequest, service, method, deserializeBinary
            messageRequest = new proto.css.chat.ChatMessageRequest()
            messageRequest.setToUsername(options.toUsername)
            messageRequest.setFromNick(options.fromNick)
            messageRequest.setBurnAfterRead(options.burnAfterRead)
            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
            service = FingoIMBase.Services.SERVICE_CHAT
            method = FingoIMBase.Methods.METHOD_SENDCHAT
            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
            messageRequest.setFromUsername(options.fromUsername)
            messageRequest.setAppkey(that._appkey)
            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
            messageRequest.setMsgContentType(options.msgContentType)

            var re = new RegExp('(\\d+)x(\\d+)', 'g')
            var rel

            var mime = options.fileName.toLowerCase().substr(options.fileName.lastIndexOf('.'))
            options.mime = mime
            if (mime != '.gif') {
                while (rel = re.exec(options.middleLink)) {
                    options.middleWidth = rel[1]
                    options.middleHeight = rel[2]
                }
            }

            while (rel = re.exec(options.smallLink)) {
                options.smallWidth = rel[1]
                options.smallHeight = rel[2]
            }

            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

            function handler (res) {
                res = res.toObject()
                if (res.ret == 0) {
                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                    res.guid = Long.fromValue(res.guid).toString()
                    success(res)
                } else {
                    res.msg = ErrorCode[res.ret]
                    error(res)
                }
            }

            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
            that._wsInstance.send(messageProxyRequest.serializeBinary())
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('图片消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.fileName)
            }
        } else {
            browserMD5File(options.file, function (err, md5) {
                FingoIMBase.Util.doHttpRequest({
                    type: 'POST',
                    url: that._pafsDomain + GET_URL_BY_MD5 + '?md5=' + md5.toString(),
                    success: function (ret) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.debug('成功匹配MD5：' + ret)
                        }
                        ret = JSON.parse(ret)
                        if (ret.status == 600) {
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始发送图片消息...')
                            }

                            var messageRequest, service, method, deserializeBinary
                            messageRequest = new proto.css.chat.ChatMessageRequest()
                            messageRequest.setToUsername(options.toUsername)
                            messageRequest.setFromNick(options.fromNick)
                            messageRequest.setBurnAfterRead(options.burnAfterRead)
                            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                            service = FingoIMBase.Services.SERVICE_CHAT
                            method = FingoIMBase.Methods.METHOD_SENDCHAT
                            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                            messageRequest.setFromUsername(options.fromUsername)
                            messageRequest.setAppkey(that._appkey)
                            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                            messageRequest.setMsgContentType(options.msgContentType)

                            options.fileName = options.file.name
                            options.originLink = ret.original_link
                            options.smallLink = ret.small_link
                            options.fileLength = options.file.size

                            var re = new RegExp('(\\d+)x(\\d+)', 'g')
                            var rel

                            var mime = options.file.name.toLowerCase().substr(options.file.name.lastIndexOf('.'))
                            options.mime = mime

                            if (mime != '.gif') {
                                options.bigLink = ret.large_link
                                options.middleLink = ret.middle_link
                                while (rel = re.exec(ret.middle_link)) {
                                    options.middleWidth = rel[1]
                                    options.middleHeight = rel[2]
                                }
                            }

                            while (rel = re.exec(ret.small_link)) {
                                options.smallWidth = rel[1]
                                options.smallHeight = rel[2]
                            }

                            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                            function handler (res) {
                                res = res.toObject()
                                console.log(res)
                                console.log('22222222')
                                if (res.ret == 0) {
                                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                    res.guid = Long.fromValue(res.guid).toString()
                                    success(res)
                                } else {
                                    res.msg = ErrorCode[res.ret]
                                    error(res)
                                }
                            }

                            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                            that._wsInstance.send(messageProxyRequest.serializeBinary())
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('图片消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                            }
                        } else {
                            var onFileUploadProgress = options.onFileUploadProgress || FingoIMBase.Util.emptyFn
                            var onFileUploadCanceled = options.onFileUploadCanceled || FingoIMBase.Util.emptyFn
                            var mime = options.file.name.toLowerCase().substr(options.file.name.lastIndexOf('.'))
                            options.mime = mime
                            // 图片上传
                            var fileOptions = {
                                fileInfo: {
                                    file: options.file,
                                    param: JSON.stringify({
                                        type: (mime == '.gif') ? MEDIA_FILE_GIF_TYPE : MEDIA_FILE_IMAGE_TYPE,
                                        fileName: options.file.name
                                    })
                                },
                                url: that._pafsDomain + PAFS_SMALL_FILE_URL,
                                onFileUploadProgress: function (progress) {
                                    onFileUploadProgress(progress)
                                },
                                onFileUploadComplete: function (res) {
                                    doFileUploadComplete(res)
                                },
                                onFileUploadError: function (e) {
                                    error(e)
                                },
                                onFileUploadCanceled: function () {
                                    onFileUploadCanceled()
                                }
                            }

                            // 发送图片消息
                            function doFileUploadComplete (res) {
                                if (res.status != '600') {
                                    res.msg = ErrorCode['50' + res.status]
                                    error(res)
                                    return
                                }
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('开始发送图片消息...')
                                }

                                var messageRequest, service, method, deserializeBinary
                                messageRequest = new proto.css.chat.ChatMessageRequest()
                                messageRequest.setToUsername(options.toUsername)
                                messageRequest.setFromNick(options.fromNick)
                                messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                                messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                                service = FingoIMBase.Services.SERVICE_CHAT
                                method = FingoIMBase.Methods.METHOD_SENDCHAT
                                deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                                messageRequest.setFromUsername(options.fromUsername)
                                messageRequest.setAppkey(that._appkey)
                                messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                                messageRequest.setMsgContentType(options.msgContentType)

                                options.fileName = options.file.name
                                options.originLink = res.original_link
                                options.smallLink = res.small_link
                                options.fileLength = options.file.size

                                var re = new RegExp('(\\d+)x(\\d+)', 'g')
                                var rel

                                if (mime != '.gif') {
                                    options.bigLink = res.large_link
                                    options.middleLink = res.middle_link
                                    while (rel = re.exec(res.middle_link)) {
                                        options.middleWidth = rel[1]
                                        options.middleHeight = rel[2]
                                    }
                                }

                                while (rel = re.exec(res.small_link)) {
                                    options.smallWidth = rel[1]
                                    options.smallHeight = rel[2]
                                }

                                messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                                var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                                function handler (res) {
                                    res = res.toObject()
                                    if (res.ret == 0) {
                                        that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                        res.guid = Long.fromValue(res.guid).toString()
                                        success(res)
                                    } else {
                                        res.msg = ErrorCode[res.ret]
                                        error(res)
                                    }
                                }

                                that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                                that._wsInstance.send(messageProxyRequest.serializeBinary())
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('图片消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                                }
                            }

                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始上传图片...')
                            }

                            FingoIMBase.Util.uploadFn(fileOptions)
                        }
                    },
                    error: function (e) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.error('匹配MD5失败：' + JSON.stringify(e))
                        }
                    }
                })
            })
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送语音消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendAudMessage = function (options) {
    var that = this
    var errorStr = paramValid.validUserName('toUserName', options.toUserName)
    errorStr += paramValid.validRelay('relay', options.relay)
    if (paramValid.validRelay('relay', options.relay) == '' && paramValid.strTrim(options.relay) == 1) {
        errorStr += paramValid.validFileName('audFileName', options.fileName)
        errorStr += paramValid.validAudFileLink('audioLink', options.audioLink)
        errorStr += paramValid.validDuration('duration', options.duration)
        errorStr += paramValid.validLimit('fileLength', options.fileLength)
    } else {
        errorStr += paramValid.validFile('audFile', options.file)
    }

    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (that._wsInstance && that.isLogined()) {
        options.msgContentType = proto.css.msg.EMsgContentType.AUDIO

        if (paramValid.strTrim(options.relay) == 1) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('开始发送语音消息...')
            }

            var messageRequest, service, method, deserializeBinary
            messageRequest = new proto.css.chat.ChatMessageRequest()
            messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
            messageRequest.setFromNick(that._fromNick)
            messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
            service = FingoIMBase.Services.SERVICE_CHAT
            method = FingoIMBase.Methods.METHOD_SENDCHAT
            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
            messageRequest.setFromUsername(that._userName)
            messageRequest.setAppkey(that._appkey)
            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
            messageRequest.setMsgContentType(options.msgContentType)
            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

            function handler (res) {
                res = res.toObject()
                if (res.ret == 0) {
                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                    res.guid = Long.fromValue(res.guid).toString()
                    success(res)
                } else {
                    res.msg = ErrorCode[res.ret]
                    error(res)
                }
            }

            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
            that._wsInstance.send(messageProxyRequest.serializeBinary())
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('语音消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.fileName)
            }
        } else {
            browserMD5File(options.file, function (err, md5) {
                FingoIMBase.Util.doHttpRequest({
                    type: 'POST',
                    url: that._pafsDomain + GET_URL_BY_MD5 + '?md5=' + md5.toString(),
                    success: function (ret) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.debug('成功匹配MD5：' + ret)
                        }
                        ret = JSON.parse(ret)
                        if (ret.status == 600) {
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始发送语音消息...')
                            }
                            var messageRequest, service, method, deserializeBinary
                            messageRequest = new proto.css.chat.ChatMessageRequest()
                            messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
                            messageRequest.setFromNick(that._fromNick)
                            messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                            service = FingoIMBase.Services.SERVICE_CHAT
                            method = FingoIMBase.Methods.METHOD_SENDCHAT
                            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                            messageRequest.setFromUsername(that._userName)
                            messageRequest.setAppkey(that._appkey)
                            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                            messageRequest.setMsgContentType(options.msgContentType)
                            options.audioLink = ret.original_link
                            options.duration = ret.duration

                            if (options.duration > 180) {
                                error({
                                    ret: 50000,
                                    msg: '语音时长超过180s'
                                })
                                return
                            }

                            options.fileName = options.file.name
                            options.fileLength = options.file.size
                            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                            function handler (res) {
                                res = res.toObject()
                                if (res.ret == 0) {
                                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                    res.guid = Long.fromValue(res.guid).toString()
                                    success(res)
                                } else {
                                    res.msg = ErrorCode[res.ret]
                                    error(res)
                                }
                            }

                            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                            that._wsInstance.send(messageProxyRequest.serializeBinary())
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('语音消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                            }
                        } else {
                            var onFileUploadProgress = options.onFileUploadProgress || FingoIMBase.Util.emptyFn
                            var onFileUploadCanceled = options.onFileUploadCanceled || FingoIMBase.Util.emptyFn
                            // 语音文件上传
                            var fileOptions = {
                                fileInfo: {
                                    file: options.file,
                                    param: JSON.stringify({
                                        type: MEDIA_FILE_AUDIO_TYPE,
                                        fileName: options.file.name,
                                        needDur: true
                                    })
                                },
                                url: that._pafsDomain + PAFS_SMALL_FILE_URL,
                                onFileUploadProgress: function (progress) {
                                    onFileUploadProgress(progress)
                                },
                                onFileUploadComplete: function (res) {
                                    doFileUploadComplete(res)
                                },
                                onFileUploadError: function (e) {
                                    error(e)
                                },
                                onFileUploadCanceled: function () {
                                    onFileUploadCanceled()
                                }
                            }

                            // 发送语音消息
                            function doFileUploadComplete (res) {
                                if (res.status != '600') {
                                    res.msg = ErrorCode['50' + res.status]
                                    error(res)
                                    return
                                }
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('开始发送语音消息...')
                                }

                                var messageRequest, service, method, deserializeBinary
                                messageRequest = new proto.css.chat.ChatMessageRequest()
                                messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
                                messageRequest.setFromNick(that._fromNick)
                                messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                                messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                                service = FingoIMBase.Services.SERVICE_CHAT
                                method = FingoIMBase.Methods.METHOD_SENDCHAT
                                deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                                messageRequest.setFromUsername(that._userName)
                                messageRequest.setAppkey(that._appkey)
                                messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                                messageRequest.setMsgContentType(options.msgContentType)

                                options.fileName = options.file.name
                                options.audioLink = res.original_link
                                options.duration = res.duration
                                options.fileLength = options.file.size

                                if (options.duration > 180) {
                                    error({
                                        ret: 50000,
                                        msg: '语音时长超过180s'
                                    })
                                    return
                                }

                                messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                                var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                                function handler (res) {
                                    res = res.toObject()
                                    if (res.ret == 0) {
                                        that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                        res.guid = Long.fromValue(res.guid).toString()
                                        success(res)
                                    } else {
                                        res.msg = ErrorCode[res.ret]
                                        error(res)
                                    }
                                }

                                that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                                that._wsInstance.send(messageProxyRequest.serializeBinary())
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('语音消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                                }
                            }

                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始上传语音...')
                            }

                            FingoIMBase.Util.uploadFn(fileOptions)
                        }
                    },
                    error: function (e) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.error('匹配MD5失败：' + JSON.stringify(e))
                        }
                    }
                })
            })
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送视频消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendVdoMessage = function (options) {
    var that = this
    var errorStr = paramValid.validRelay('relay', options.relay)
    if (paramValid.validRelay('relay', options.relay) == '' && paramValid.strTrim(options.relay) == 1) {
        errorStr += paramValid.validFileName('vdoFileName', options.fileName)
        errorStr += paramValid.validVdoFileLink('videoLink', options.fileName)
        errorStr += paramValid.validPicFileLink('videoScreenShortLink', options.fileName)
        errorStr += paramValid.validLimit('fileLength', options.fileName)
        errorStr += paramValid.validLimit('duration', options.duration)
    } else {
        errorStr += paramValid.validFile('vdoFile', options.file)
    }

    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (that._wsInstance && that.isLogined()) {
        options.msgContentType = proto.css.msg.EMsgContentType.VIDEO

        if (paramValid.strTrim(options.relay) == 1) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('开始发送视频消息...')
            }

            var messageRequest, service, method, deserializeBinary
            messageRequest = new proto.css.chat.ChatMessageRequest()
            messageRequest.setToUsername(options.toUsername)
            messageRequest.setFromNick(options.fromNick)
            messageRequest.setBurnAfterRead(options.burnAfterRead)
            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
            service = FingoIMBase.Services.SERVICE_CHAT
            method = FingoIMBase.Methods.METHOD_SENDCHAT
            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
            messageRequest.setFromUsername(options.fromUsername)
            messageRequest.setAppkey(that._appkey)
            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
            messageRequest.setMsgContentType(options.msgContentType)

            var re = new RegExp('(\\d+)x(\\d+)', 'g')
            var rel
            while (rel = re.exec(paramValid.strTrim(options.videoScreenShortLink))) {
                options.width = rel[1]
                options.height = rel[2]
            }

            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

            function handler (res) {
                res = res.toObject()
                if (res.ret == 0) {
                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                    res.guid = Long.fromValue(res.guid).toString()
                    success(res)
                } else {
                    res.msg = ErrorCode[res.ret]
                    error(res)
                }
            }

            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
            that._wsInstance.send(messageProxyRequest.serializeBinary())
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('视频消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.fileName)
            }
        } else {
            browserMD5File(options.file, function (err, md5) {
                FingoIMBase.Util.doHttpRequest({
                    type: 'POST',
                    url: that._pafsDomain + GET_URL_BY_MD5 + '?md5=' + md5.toString(),
                    success: function (ret) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.debug('成功匹配MD5：' + ret)
                        }
                        ret = JSON.parse(ret)
                        if (ret.status == 600) {
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始发送视频消息...')
                            }
                            var messageRequest, service, method, deserializeBinary
                            messageRequest = new proto.css.chat.ChatMessageRequest()
                            messageRequest.setToUsername(options.toUsername)
                            messageRequest.setFromNick(options.fromNick)
                            messageRequest.setBurnAfterRead(options.burnAfterRead)
                            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                            service = FingoIMBase.Services.SERVICE_CHAT
                            method = FingoIMBase.Methods.METHOD_SENDCHAT
                            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                            messageRequest.setFromUsername(that.fromUsername)
                            messageRequest.setAppkey(that._appkey)
                            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                            messageRequest.setMsgContentType(options.msgContentType)

                            options.fileName = options.file.name
                            options.videoLink = ret.original_link
                            options.videoScreenShortLink = ret.cover_link
                            options.duration = ret.duration
                            options.fileLength = options.file.size
                            var re = new RegExp('(\\d+)x(\\d+)', 'g')
                            var rel
                            while (rel = re.exec(paramValid.strTrim(ret.cover_link))) {
                                options.width = rel[1]
                                options.height = rel[2]
                            }

                            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                            function handler (res) {
                                res = res.toObject()
                                if (res.ret == 0) {
                                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                    res.guid = Long.fromValue(res.guid).toString()
                                    success(res)
                                } else {
                                    res.msg = ErrorCode[res.ret]
                                    error(res)
                                }
                            }

                            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                            that._wsInstance.send(messageProxyRequest.serializeBinary())
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('视频消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                            }
                        } else {
                            var onFileUploadProgress = options.onFileUploadProgress || FingoIMBase.Util.emptyFn
                            var onFileUploadCanceled = options.onFileUploadCanceled || FingoIMBase.Util.emptyFn
                            // 视频文件上传
                            var fileOptions = {
                                fileInfo: {
                                    file: options.file,
                                    param: JSON.stringify({
                                        type: MEDIA_FILE_VIDEO_TYPE,
                                        fileName: options.file.name
                                    })
                                },
                                url: that._pafsDomain + PAFS_SMALL_FILE_URL,
                                onFileUploadProgress: function (progress) {
                                    onFileUploadProgress(progress)
                                },
                                onFileUploadComplete: function (res) {
                                    doFileUploadComplete(res)
                                },
                                onFileUploadError: function (e) {
                                    error(e)
                                },
                                onFileUploadCanceled: function () {
                                    onFileUploadCanceled()
                                }
                            }

                            // 发送视频消息
                            function doFileUploadComplete (res) {
                                if (res.status != '600') {
                                    res.msg = ErrorCode['50' + res.status]
                                    error(res)
                                    return
                                }
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('开始发送视频消息...')
                                }

                                var messageRequest, service, method, deserializeBinary
                                messageRequest = new proto.css.chat.ChatMessageRequest()
                                messageRequest.setToUsername(options.toUsername)
                                messageRequest.setFromNick(options.fromNick)
                                messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                                messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                                service = FingoIMBase.Services.SERVICE_CHAT
                                method = FingoIMBase.Methods.METHOD_SENDCHAT
                                deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                                messageRequest.setFromUsername(options.fromUsername)
                                messageRequest.setAppkey(that._appkey)
                                messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                                messageRequest.setMsgContentType(options.msgContentType)

                                options.fileName = options.file.name
                                options.videoLink = res.original_link
                                options.videoScreenShortLink = res.cover_link
                                options.duration = res.duration
                                options.fileLength = options.file.size
                                var re = new RegExp('(\\d+)x(\\d+)', 'g')
                                var rel
                                while (rel = re.exec(res.cover_link)) {
                                    options.width = rel[1]
                                    options.height = rel[2]
                                }

                                messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                                var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                                function handler (res) {
                                    res = res.toObject()
                                    if (res.ret == 0) {
                                        that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                        res.guid = Long.fromValue(res.guid).toString()
                                        success(res)
                                    } else {
                                        res.msg = ErrorCode[res.ret]
                                        error(res)
                                    }
                                }

                                that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                                that._wsInstance.send(messageProxyRequest.serializeBinary())
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('视频消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                                }
                            }

                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始上传视频...')
                            }

                            FingoIMBase.Util.uploadFn(fileOptions)
                        }
                    },
                    error: function (e) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.error('匹配MD5失败：' + JSON.stringify(e))
                        }
                    }
                })
            })
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送位置消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendLocMessage = function (options) {
    var that = this
    var errorStr = paramValid.validUserName('toUserName', options.toUserName)

    errorStr += paramValid.validRelay('relay', options.relay)
    if (paramValid.validRelay('relay', options.relay) == '' && paramValid.strTrim(options.relay) == 1) {
        errorStr += paramValid.validFileName('locFileName', options.fileName)
        errorStr += paramValid.validPicFileLink('locOriginLink', options.originLink)
        errorStr += paramValid.validLimit('fileLength', options.fileLength)
    } else {
        errorStr += paramValid.validFile('locFile', options.file)
    }

    errorStr += paramValid.validFloat('longitude', options.longitude)
    errorStr += paramValid.validFloat('latitude', options.latitude)
    errorStr += paramValid.validText('locationAddress', options.locationAddress)
    errorStr += paramValid.validText('locationDesc', options.locationDesc)
    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (that._wsInstance && that.isLogined()) {
        options.msgContentType = proto.css.msg.EMsgContentType.LOCATION

        if (paramValid.strTrim(options.relay) == 1) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('开始发送位置消息...')
            }

            var messageRequest, service, method, deserializeBinary
            messageRequest = new proto.css.chat.ChatMessageRequest()
            messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
            messageRequest.setFromNick(that._fromNick)
            messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
            service = FingoIMBase.Services.SERVICE_CHAT
            method = FingoIMBase.Methods.METHOD_SENDCHAT
            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
            messageRequest.setFromUsername(that._userName)
            messageRequest.setAppkey(that._appkey)
            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
            messageRequest.setMsgContentType(options.msgContentType)

            var re = new RegExp('(\\d+)x(\\d+)', 'g')
            var rel
            while (rel = re.exec(options.originLink)) {
                options.width = rel[1]
                options.height = rel[2]
            }

            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

            function handler (res) {
                res = res.toObject()
                if (res.ret == 0) {
                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                    res.guid = Long.fromValue(res.guid).toString()
                    success(res)
                } else {
                    res.msg = ErrorCode[res.ret]
                    error(res)
                }
            }

            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
            that._wsInstance.send(messageProxyRequest.serializeBinary())
            if (that._log && that._log instanceof FingoIMApi.Log) {
                that._log.debug('位置消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.fileName)
            }
        } else {
            browserMD5File(options.file, function (err, md5) {
                FingoIMBase.Util.doHttpRequest({
                    type: 'POST',
                    url: that._pafsDomain + GET_URL_BY_MD5 + '?md5=' + md5.toString(),
                    success: function (ret) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.debug('成功匹配MD5：' + ret)
                        }
                        ret = JSON.parse(ret)
                        if (ret.status == 600) {
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始发送位置消息...')
                            }
                            var messageRequest, service, method, deserializeBinary
                            messageRequest = new proto.css.chat.ChatMessageRequest()
                            messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
                            messageRequest.setFromNick(that._fromNick)
                            messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                            messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                            service = FingoIMBase.Services.SERVICE_CHAT
                            method = FingoIMBase.Methods.METHOD_SENDCHAT
                            deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                            messageRequest.setFromUsername(that._userName)
                            messageRequest.setAppkey(that._appkey)
                            messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                            messageRequest.setMsgContentType(paramValid.strTrim(options.msgContentType))

                            options.fileName = options.file.name
                            options.originLink = ret.small_link
                            options.fileLength = options.file.size
                            var re = new RegExp('(\\d+)x(\\d+)', 'g')
                            var rel
                            while (rel = re.exec(ret.small_link)) {
                                options.width = rel[1]
                                options.height = rel[2]
                            }

                            messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                            var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                            function handler (res) {
                                res = res.toObject()
                                if (res.ret == 0) {
                                    that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                    res.guid = Long.fromValue(res.guid).toString()
                                    success(res)
                                } else {
                                    res.msg = ErrorCode[res.ret]
                                    error(res)
                                }
                            }

                            that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                            that._wsInstance.send(messageProxyRequest.serializeBinary())
                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('位置消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                            }
                        } else {
                            var onFileUploadProgress = options.onFileUploadProgress || FingoIMBase.Util.emptyFn
                            var onFileUploadCanceled = options.onFileUploadCanceled || FingoIMBase.Util.emptyFn
                            // 位置图片上传
                            var fileOptions = {
                                fileInfo: {
                                    file: options.file,
                                    param: JSON.stringify({
                                        type: MEDIA_FILE_LOCATION_TYPE,
                                        fileName: options.file.name
                                    })
                                },
                                url: that._pafsDomain + PAFS_SMALL_FILE_URL,
                                onFileUploadProgress: function (progress) {
                                    onFileUploadProgress(progress)
                                },
                                onFileUploadComplete: function (res) {
                                    doFileUploadComplete(res)
                                },
                                onFileUploadError: function (e) {
                                    error(e)
                                },
                                onFileUploadCanceled: function () {
                                    onFileUploadCanceled()
                                }
                            }

                            // 发送位置消息
                            function doFileUploadComplete (res) {
                                if (res.status != '600') {
                                    res.msg = ErrorCode['50' + res.status]
                                    error(res)
                                    return
                                }
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('开始发送位置消息...')
                                }

                                var messageRequest, service, method, deserializeBinary
                                messageRequest = new proto.css.chat.ChatMessageRequest()
                                messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
                                messageRequest.setFromNick(that._fromNick)
                                messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                                messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
                                service = FingoIMBase.Services.SERVICE_CHAT
                                method = FingoIMBase.Methods.METHOD_SENDCHAT
                                deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
                                messageRequest.setFromUsername(that._userName)
                                messageRequest.setAppkey(that._appkey)
                                messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
                                messageRequest.setMsgContentType(paramValid.strTrim(options.msgContentType))

                                options.fileName = options.file.name
                                options.originLink = res.small_link
                                options.fileLength = options.file.size
                                var re = new RegExp('(\\d+)x(\\d+)', 'g')
                                var rel
                                while (rel = re.exec(res.small_link)) {
                                    options.width = rel[1]
                                    options.height = rel[2]
                                }

                                messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

                                var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

                                function handler (res) {
                                    res = res.toObject()
                                    if (res.ret == 0) {
                                        that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                                        res.guid = Long.fromValue(res.guid).toString()
                                        success(res)
                                    } else {
                                        res.msg = ErrorCode[res.ret]
                                        error(res)
                                    }
                                }

                                that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
                                that._wsInstance.send(messageProxyRequest.serializeBinary())
                                if (that._log && that._log instanceof FingoIMApi.Log) {
                                    that._log.debug('位置消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>消息内容：' + options.file.name)
                                }
                            }

                            if (that._log && that._log instanceof FingoIMApi.Log) {
                                that._log.debug('开始上传位置...')
                            }

                            FingoIMBase.Util.uploadFn(fileOptions)
                        }
                    },
                    error: function (e) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            that._log.error('匹配MD5失败：' + JSON.stringify(e))
                        }
                    }
                })
            })
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送已读回执消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendReadReceiptMessage = function (options) {
    var that = this

    var errorStr = paramValid.validGuid('receiptGuid', options.receiptGuid)
    errorStr += paramValid.validUserName('toUserName', options.toUserName)
    errorStr += paramValid.validBoolean('burnAfterRead', options.burnAfterRead)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }
    console.log('开始发送已读回执消息')
    if (that._wsInstance && that.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始发送已读回执消息...')
        }

        options.msgContentType = proto.css.msg.EMsgContentType.READ_RECEIPT
        var messageRequest, service, method, deserializeBinary
        messageRequest = new proto.css.chat.ChatMessageRequest()
        messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
        messageRequest.setFromNick(that._fromNick)
        messageRequest.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
        messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
        service = FingoIMBase.Services.SERVICE_CHAT
        method = FingoIMBase.Methods.METHOD_SENDCHAT
        deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
        messageRequest.setFromUsername(that._userName)
        messageRequest.setAppkey(that._appkey)
        messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
        messageRequest.setMsgContentType(options.msgContentType)
        messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

        var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

        function handler (res) {
            res = res.toObject()
            if (res.ret == 0) {
                that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                res.guid = Long.fromValue(res.guid).toString()
                success(res)
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }

        that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
        that._wsInstance.send(messageProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('已读回执消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息 id:' + messageRequest.getMsgId() + '<br>已读消息GUID：' + options.receiptGuid)
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 发送删除消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.removeMessage = function (options) {
    var that = this

    var errorStr = paramValid.validUserName('toUsername', options.toUsername)
    errorStr += paramValid.validBoolean('removeSession', options.removeSession)
    if (!errorStr && paramValid.strTrim(options.removeSession) == false) {
        errorStr += paramValid.validGuidList('guidList', options.guidList)
    }

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }
    if (that._wsInstance && that.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始删除历史消息...')
        }

        var messageRequest; var service; var method
        var deserializeBinary = proto.css.history.MessageRemoveResponse.deserializeBinary
        messageRequest = new proto.css.history.ChatMessageRemoveRequest()
        service = FingoIMBase.Services.SERVICE_HISTORY
        method = FingoIMBase.Methods.METHOD_CHATMESSAGEREMOVE
        messageRequest.setToUsername(paramValid.strTrim(options.toUsername).toLowerCase())
        messageRequest.setRemoveSession(paramValid.strTrim(options.removeSession))
        if (paramValid.strTrim(options.removeSession) == false) {
            messageRequest.setGuidList(options.guidList)
        }
        messageRequest.setFromUsername(that._userName)
        messageRequest.setAppkey(that._appkey)

        var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

        function handler (res) {
            res = res.toObject()
            if (res.ret == 0) {
                success(res)
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }

        that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
        that._wsInstance.send(messageProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('删除消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 获取历史消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.getHistoryMessage = function (options) {
    var that = this
    if (that._wsInstance && that.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始获取历史消息...')
        }
        var service = FingoIMBase.Services.SERVICE_CHAT
        var method = FingoIMBase.Methods.METHOD_CHATHISTORYMESSAGEGET
        var deserializeBinary = proto.css.chat.MsgGetResponse.deserializeBinary
        var messageRequest = new proto.css.chat.ChatHistoryMessageGetRequest()
        messageRequest.setToUsername(options.toUsername)
        messageRequest.setFromUsername(options.fromUsername)
        messageRequest.setAppkey(globalApi._appkey)
        messageRequest.setLimit(options.limit)
        messageRequest.setBeginGuid(options.beginGuid)
        var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

        var handler = function (proxyResponseInstace) {
            var res = proxyResponseInstace.toObject()
            if (res.ret == 0) {
                var dataList = proxyResponseInstace.getDataList()
                var dataListLen = dataList.length
                var messages = []
                for (var i = 0; i < dataListLen; i++) {
                    try {
                        var message = that._parseMessage(dataList[i])
                        if (Object.keys(message).length != 0) {
                            messages.push(message)
                        }
                    } catch (e) {
                        options.error({
                            ret: '50003',
                            msg: ErrorCode['50003'] + e.message
                        })
                    }
                }
                options.success(messages)
            } else {
                res.msg = ErrorCode[res.ret]
                options.error && options.error(res)
            }
        }
        globalApi._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
        globalApi._wsInstance.send(messageProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('获取历史消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>起始消息GUID:' + options.begin)
        }
    } else {
        options.error && options.error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 撤回消息 public
 * @param {options}
 * string,options.toUserName:对方用户名
 * ……
 * func,options.success:成功回调函数
 * func,options.error:失败回调函数
 * return void
 */
FingoIMApi.prototype.sendRetractMessage = function (options) {
    var that = this

    var errorStr = paramValid.validUserName('toUserName', options.toUserName)
    errorStr += paramValid.validGuid('retractGuid', options.retractGuid)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }
    if (that._wsInstance && that.isLogined()) {
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('开始撤回消息...')
        }

        options.msgContentType = proto.css.msg.EMsgContentType.RETRACT
        var messageRequest, service, method, deserializeBinary
        messageRequest = new proto.css.chat.ChatMessageRequest()
        messageRequest.setToUsername(options.toUserName.toString().trim().toLowerCase())
        messageRequest.setFromNick(that._fromNick)
        messageRequest.setFromClientType(proto.css.enum.EClientType.WEB)
        service = FingoIMBase.Services.SERVICE_CHAT
        method = FingoIMBase.Methods.METHOD_SENDCHAT
        deserializeBinary = proto.css.chat.ChatMessageResponse.deserializeBinary
        if (typeof options.begin !== 'undefined' && paramValid.strTrim(options.begin) != '') {
            messageRequest.setBegin(paramValid.strTrim(options.begin))
        }
        if (typeof options.end !== 'undefined' && paramValid.strTrim(options.end) != '') {
            messageRequest.setEnd(paramValid.strTrim(options.end))
        }
        messageRequest.setFromUsername(that._userName)
        messageRequest.setAppkey(that._appkey)
        messageRequest.setMsgId(FingoIMBase.Util.getUniqueId())
        messageRequest.setMsgContentType(options.msgContentType)
        messageRequest.setData(that._createConcreteMessage(options.msgContentType, options))

        var messageProxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, messageRequest.serializeBinary())

        function handler (res) {
            res = res.toObject()
            if (res.ret == 0) {
                that._sendGuid = Long.fromValue(res.guid).toString() ? Long.fromValue(res.guid).toString() : that._sendGuid
                res.guid = Long.fromValue(res.guid).toString()
                success(res)
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }

        that._connection.addRequestHandler(handler, service, method, messageProxyRequest.getRequestId(), deserializeBinary)
        that._wsInstance.send(messageProxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('撤回消息已经发送 <br>请求 id:' + messageProxyRequest.getRequestId() + '<br>消息id:' + messageRequest.getMsgId() + '<br>被撤消息GUID：' + options.retractGuid)
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* history */

/* 从接收列表同步历史消息 public
* @param {options}
* string,options.recvGuid:本地全局guid 可选
* func,options.success:成功回调函数
* func,options.error:失败回调函数
* retun,messages:消息列表
*/
FingoIMApi.prototype.syncReceivedMessage = function (options) {
    var that = this
    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn
    if (this._wsInstance && this.isLogined()) {
        var service = FingoIMBase.Services.SERVICE_CHAT
        var method = FingoIMBase.Methods.METHOD_MESSAGESYNC
        var requestInstace = new proto.css.chat.MessageSyncRequest()
        requestInstace.setGuid(Long.fromString(options.recvGuid ? options.recvGuid.toString() : this._recvGuid.toString(), true))
        requestInstace.setUsername(options.csId)
        requestInstace.setAppkey(this._appkey)
        requestInstace.setSor(false)
        requestInstace.setType(proto.css.chat.END_TYPE.WEB)

        var handler = function (proxyResponseInstace) {
            var res = proxyResponseInstace.toObject()
            if (res.ret == 0) {
                var dataList = proxyResponseInstace.getDataList()
                var dataListLen = dataList.length

                var messages = []
                for (var i = 0; i < dataListLen; i++) {
                    try {
                        var message = that._parseMessage(dataList[i])
                        if (Object.keys(message).length != 0) {
                            that._recvGuid = message.guid ? message.guid : that._recvGuid
                            messages.push(message)
                        }
                    } catch (e) {
                        error({
                            ret: '50003',
                            msg: ErrorCode['50003'] + e.message
                        })
                    }
                }

                that._onMessageRecivied(messages)
                success({ ret: 0 })
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }
        var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestInstace.serializeBinary())
        this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), proto.css.chat.MsgGetResponse.deserializeBinary)
        this._wsInstance.send(proxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('从接收列表同步消息, 请求 id:' + proxyRequest.getRequestId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 从发送列表同步历史消息 public
* @param {options}
* string,options.sendGuid:本地全局guid 可选
* func,options.success:成功回调函数
* func,options.error:失败回调函数
* retun,messages:消息列表
*/
FingoIMApi.prototype.syncSentMessage = function (options) {
    var that = this

    var errorStr = paramValid.validGuid('initGuid', options.sendGuid ? options.sendGuid : this._sendGuid)

    var error = options.error || FingoIMBase.Util.emptyFn
    var success = options.success || FingoIMBase.Util.emptyFn

    if (errorStr) {
        error({
            ret: 50000,
            msg: errorStr
        })
        return
    }

    if (this._wsInstance && this.isLogined()) {
        var service = FingoIMBase.Services.SERVICE_HISTORY
        var method = FingoIMBase.Methods.METHOD_MESSAGESYNC
        var requestInstace = new proto.css.history.MessageSyncRequest()
        requestInstace.setGuid(Long.fromString(options.sendGuid ? options.sendGuid.toString() : this._sendGuid.toString(), true))
        requestInstace.setUsername(this._userName)
        requestInstace.setAppkey(this._appkey)
        requestInstace.setSor(true)

        var handler = function (proxyResponseInstace) {
            var res = proxyResponseInstace.toObject()
            if (res.ret == 0) {
                var dataList = proxyResponseInstace.getDataList()
                var dataListLen = dataList.length

                var messages = []
                for (var i = 0; i < dataListLen; i++) {
                    try {
                        var message = that._parseMessage(dataList[i])
                        if (Object.keys(message).length != 0) {
                            that._sendGuid = message.guid ? message.guid : that._sendGuid
                            messages.push(message)
                        }
                    } catch (e) {
                        error({
                            ret: '50003',
                            msg: ErrorCode['50003'] + e.message
                        })
                    }
                }

                that._onMessageSent(messages)
                success({ ret: 0 })
            } else {
                res.msg = ErrorCode[res.ret]
                error(res)
            }
        }
        var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestInstace.serializeBinary())
        this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), proto.css.history.MsgGetResponse.deserializeBinary)
        this._wsInstance.send(proxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('从发送列表同步消息, 请求 id:' + proxyRequest.getRequestId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

/* 获取send_guid和recv_guid public
* @param {options}
* string,options.sendGuid:本地全局guid 可选
* func,options.success:成功回调函数
* func,options.error:失败回调函数
* retun,messages:消息列表
*/
FingoIMApi.prototype.syncSendGUID = function () {
    var that = this

    if (this._wsInstance && this.isLogined()) {
        var service = FingoIMBase.Services.SERVICE_HISTORY
        var method = FingoIMBase.Methods.METHOD_SYNCSENDGUID
        var requestInstace = new proto.css.history.SyncSendGUIDRequest()

        requestInstace.setUsername(this._userName)
        requestInstace.setAppkey(this._appkey)

        var handler = function (proxyResponseInstace) {
            var res = proxyResponseInstace.toObject()
            if (res.ret == 0) {
                that._recvGuid = '0'
                that._sendGuid = Long.fromValue(res.sendGuid).toString()
                if (that._log && that._log instanceof FingoIMApi.Log) {
                    that._log.debug('recvGuid:' + that._recvGuid + ',' + 'sendGuid:' + that._sendGuid)
                }
                that.syncReceivedMessage({
                    recvGuid: that._recvGuid,
                    success: function (success) {
                    },
                    error: function (error) {
                        if (that._log && that._log instanceof FingoIMApi.Log) {
                            error.msg = ErrorCode[error.ret]
                            that._log.debug('登录拉取历史消息' + JSON.stringify(error))
                        }
                    }
                })
            } else {
                res.msg = ErrorCode[res.ret]
                if (that._log && that._log instanceof FingoIMApi.Log) {
                    that._log.debug('获取guid失败返回：' + JSON.stringify(res))
                }
            }
        }
        var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestInstace.serializeBinary())
        this._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), proto.css.history.SyncSendGUIDResponse.deserializeBinary)
        this._wsInstance.send(proxyRequest.serializeBinary())
        if (that._log && that._log instanceof FingoIMApi.Log) {
            that._log.debug('获取guid, 请求 id:' + proxyRequest.getRequestId())
        }
    } else {
        error({
            ret: 50002,
            msg: ErrorCode[50002]
        })
    }
}

FingoIMApi.prototype.disconnect = function () {
    if (typeof this._wsInstance !== 'undefined') {
        return this._wsInstance.disconnect()
    }
}
FingoIMApi.prototype.getConnStatus = function () {
    if (typeof this._connection !== 'undefined') {
        return this._connection.status
    }
}
FingoIMApi.prototype.isConnected = function () {
    if (typeof this._connection !== 'undefined') {
        return this._connection.status == FingoIMBase.Connection.Status.CONNECTED || this._connection.status == FingoIMBase.Connection.Status.LOGINED
    } else {
        return FingoIMBase.Connection.Status.DISCONNECTED
    }
}
FingoIMApi.prototype.isLogined = function () {
    if (typeof this._connection !== 'undefined') {
        return this._connection.status == FingoIMBase.Connection.Status.LOGINED
    }
}
FingoIMApi.prototype.isClosed = function () {
    return this._connection.status != FingoIMBase.Connection.Status.LOGINED
}

/* 私有函数-start-------------------------------------------------- */

/* 踢出通知的回调处理 private
 * @param {sessionNotifyInstace}
 * object,sessionNotifyInstace:通知消息对象
 */
FingoIMApi.prototype._handleKickNotification = function (sessionNotifyInstace) {
    var that = this
    that._onKicked(sessionNotifyInstace)
    globalApi._kicked = true
}

/* 消息通知的回调处理 private
 * @param {sessionNotifyInstace}
 * object,sessionNotifyInstace:通知消息对象
 */
FingoIMApi.prototype._handleNewMessageNotify = function (sessionNotifyInstace) {
    var service = FingoIMBase.Services.SERVICE_CHAT
    var method = FingoIMBase.Methods.METHOD_MESSAGESYNC
    var requestInstace = new proto.css.chat.MessageSyncRequest()
    console.log('_handleNewMessageNotify')
    console.log(sessionNotifyInstace)
    requestInstace.setGuid(0)
    requestInstace.setUsername(sessionNotifyInstace.toUsername)
    requestInstace.setAppkey(sessionNotifyInstace.appkey)
    requestInstace.setSor(false)
    requestInstace.setType(proto.css.chat.END_TYPE.WEB)

    var handler = function (proxyResponseInstace) {
        var res = proxyResponseInstace.toObject()
        if (res.ret == 0) {
            var dataList = proxyResponseInstace.getDataList()
            var dataListLen = dataList.length
            var messages = []
            for (var i = 0; i < dataListLen; i++) {
                try {
                    var message = globalApi._parseMessage(dataList[i])
                    if (Object.keys(message).length != 0) {
                        globalApi._recvGuid = message.guid ? message.guid : globalApi._recvGuid
                        messages.push(message)
                    }
                } catch (e) {
                    globalApi._connection.onError({
                        ret: '50003',
                        msg: ErrorCode['50003'] + e.message
                    })
                }
            }
            globalApi._onMessageRecivied(messages)
        } else {
            if (res.ret != 2003) {
                res.msg = ErrorCode[res.ret]
                globalApi._connection.onError(res)
            }
        }
    }
    var proxyRequest = FingoIMBase.Util.buildProxyRequest(service, method, requestInstace.serializeBinary())
    globalApi._connection.addRequestHandler(handler, service, method, proxyRequest.getRequestId(), proto.css.chat.MsgGetResponse.deserializeBinary)
    globalApi._wsInstance.send(proxyRequest.serializeBinary())
}

/* 好友变更通知的回调处理 private
 * @param {sessionNotifyInstace}
 * object,sessionNotifyInstace:通知消息对象
 */
FingoIMApi.prototype._handleFriendUpdateNotify = function (sessionNotifyInstace) {
    var that = this
    that._onFriendUpdated(sessionNotifyInstace)
}

/* 群组静默通知的回调处理 private
 * @param {sessionNotifyInstace}
 * object,sessionNotifyInstace:通知消息对象
 */
FingoIMApi.prototype._handleGroupUpdateNotify = function (sessionNotifyInstace) {
    var that = this
    that._onGroupUpdated(sessionNotifyInstace)
}

/* 撤回消息通知的回调处理 private
 * @param {sessionNotifyInstace}
 * object,sessionNotifyInstace:通知消息对象
 */
FingoIMApi.prototype._handleRetractNotify = function (sessionNotifyInstace) {
    var that = this
    that.syncReceivedMessage({
        recvGuid: that._recvGuid,
        success: function (ret) {
        },
        error: function (error) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                error.msg = ErrorCode[error.ret]
                that._log.debug('拉取历史消息' + JSON.stringify(error))
            }
        }
    })
}

/* 伙伴终端消息通知的回调处理 private
 * @param {sessionNotifyInstace}
 * object,sessionNotifyInstace:通知消息对象
 */
FingoIMApi.prototype._handleCarbonMsgNotify = function (sessionNotifyInstace) {
    var that = this
    // that._onCarbonMsg(sessionNotifyInstace);
    that.syncSentMessage({
        sendGuid: that._sendGuid,
        success: function (ret) {
        },
        error: function (error) {
            if (that._log && that._log instanceof FingoIMApi.Log) {
                error.msg = ErrorCode[error.ret]
                that._log.debug('拉取伙伴终端发送的消息' + JSON.stringify(error))
            }
        }
    })
}

/* 消息解析 private
 * @param {data}
 * arrayBuffer,data:消息数据流
 */
FingoIMApi.prototype._parseMessage = function (data) {
    if (data) {
        var msgType = data.getMsgType()
        var tdata = data.getData()
        var message = {}
        switch (msgType) {
            case proto.css.msg.EMsgType.CHAT_MSG:
                var chatMessage = proto.css.chat.ChatMessage.deserializeBinary(tdata)
                message = this._parseChatMessage(chatMessage)
                message.msgType = proto.css.msg.EMsgType.CHAT_MSG
                break
            case proto.msg.EMsgType.MSGGW_MSG:
                var msggwMsg = proto.css.msg.MsggwMessage.deserializeBinary(tdata)
                message = this._parseMsggwMessage(msggwMsg)
                message.msgType = proto.css.msg.EMsgType.MSGGW_MSG
                break
            case proto.css.msg.EMsgType.SYSTEM_MSG:
                break
            default:
                break
        }
        return message
    } else {
        return {}
    }
}
/* 单聊消息解析 private
 * @param {chatMessage}new Date(FingoIMBase.Util.guidToTime(chatMessage.getGuid())).format("yyyy-MM-dd hh:mm:ss"
 * ChatMessage,chatMessage:单聊消息类
 */
FingoIMApi.prototype._parseChatMessage = function (chatMessage) {
    if (chatMessage) {
        var message = {
            fromUserName: chatMessage.getFromUsername(),
            fromNick: chatMessage.getFromNick(),
            toUsername: chatMessage.getToUsername(),
            guid: Long.fromValue(chatMessage.getGuid()).toString(),
            time: FingoIMBase.Util.guidToTime(Long.fromValue(chatMessage.getGuid()).toString()),
            msgId: chatMessage.getMsgId(),
            msgContentType: chatMessage.getMsgContentType(),
            burnAfterRead: chatMessage.getBurnAfterRead(),
            appkey: chatMessage.getAppkey()
        }
        var data = chatMessage.getData()
        var tmessage = this._parseConcreteMessage(message.msgContentType, data)
        message = FingoIMBase.Util.extend(message, tmessage.toObject())
        if (message.msgContentType == proto.css.msg.EMsgContentType.READ_RECEIPT) {
            message.receiptGuid = Long.fromValue(tmessage.getReceiptGuid()).toString()
        }
        if (message.msgContentType == proto.css.msg.EMsgContentType.RETRACT) {
            message.retractGuid = Long.fromValue(tmessage.getRetractGuid()).toString()
        }
        return message
    } else {
        return {}
    }
}

/* 网关消息解析 private
 * @param {groupMessage}
 * GroupMessage,groupMessage:群聊消息类
 */
FingoIMApi.prototype._parseMsggwMessage = function (msggwMessage) {
    if (msggwMessage) {
        var message = {
            from: msggwMessage.getFrom(),
            appkey: msggwMessage.getAppkey(),
            content: msggwMessage.getContent(),
            guid: Long.fromValue(msggwMessage.getGuid()).toString(),
            time: FingoIMBase.Util.guidToTime(Long.fromValue(msggwMessage.getGuid()).toString()),
            notification: msggwMessage.getNotification()
        }
        return message
    } else {
        return {}
    }
}

/* 具体消息解析 private
 * @param {msgContentType,data}
 * string,msgContentType：消息类型
 * arrayBuffer,data:消息流
 */
FingoIMApi.prototype._parseConcreteMessage = function (msgContentType, data) {
    if (data) {
        var messageObg = {}
        switch (msgContentType) {
            case proto.css.msg.EMsgContentType.TEXT:
                messageObg = proto.css.msg.TextMessage.deserializeBinary(data)
                break
            case proto.css.msg.EMsgContentType.IMAGE:
                messageObg = proto.css.msg.ImageMessage.deserializeBinary(data)
                messageObg.setOriginLink(this._pafsDomain + messageObg.getOriginLink())
                messageObg.setBigLink(this._pafsDomain + messageObg.getBigLink())
                messageObg.setMiddleLink(this._pafsDomain + messageObg.getMiddleLink())
                messageObg.setSmallLink(this._pafsDomain + messageObg.getSmallLink())
                break
            case proto.css.msg.EMsgContentType.VIDEO:
                messageObg = proto.css.msg.VideoMessage.deserializeBinary(data)
                messageObg.setVideoLink(this._pafsDomain + messageObg.getVideoLink())
                messageObg.setVideoScreenShortLink(this._pafsDomain + messageObg.getVideoScreenShortLink())
                break
            case proto.css.msg.EMsgContentType.AUDIO:
                messageObg = proto.css.msg.AudioMessage.deserializeBinary(data)
                messageObg.setAudioLink(this._pafsDomain + messageObg.getAudioLink())
                break
            case proto.css.msg.EMsgContentType.LOCATION:
                messageObg = proto.css.msg.LocationMessage.deserializeBinary(data)
                messageObg.setOriginLink(this._pafsDomain + messageObg.getOriginLink())
                break
            case proto.css.msg.EMsgContentType.AT:
                messageObg = proto.css.msg.AtMessage.deserializeBinary(data)
                break
            case proto.css.msg.EMsgContentType.READ_RECEIPT:
                messageObg = proto.css.msg.ReadReceiptMessage.deserializeBinary(data)
                break
            case proto.css.msg.EMsgContentType.FILE:
                messageObg = proto.css.msg.FileMessage.deserializeBinary(data)
                messageObg.setFileLink(this._pafsDomain + messageObg.getFileLink())
                break
            case proto.css.msg.EMsgContentType.RETRACT:
                messageObg = proto.css.msg.RetractMessage.deserializeBinary(data)
                break
            case proto.css.msg.EMsgContentType.CUSTOM:
                messageObg = proto.css.msg.CustomMessage.deserializeBinary(data)
                break
            default:
                break
        }
        return messageObg
    } else {
        return {}
    }
}

/* 具体消息生成 private
 * @param {msgContentType,data}
 * string,msgContentType：消息类型
 * object,options:具体消息内容
 * return data
 */
FingoIMApi.prototype._createConcreteMessage = function (msgContentType, options) {
    if (options) {
        var messageObg = null
        switch (msgContentType) {
            case proto.css.msg.EMsgContentType.TEXT:
                messageObg = new proto.css.msg.TextMessage()
                if (typeof options.text !== 'undefined' && options.text != null && typeof options.text === 'string') {
                    messageObg.setText(paramValid.strTrim(options.text))
                }
                messageObg.setBurnAfterRead(!!paramValid.strTrim(options.burnAfterRead))
                break
            case proto.css.msg.EMsgContentType.IMAGE:
                messageObg = new proto.css.msg.ImageMessage()
                messageObg.setFileName(paramValid.strTrim(options.fileName))
                messageObg.setOriginLink(paramValid.strTrim(options.originLink))
                messageObg.setSmallLink(paramValid.strTrim(options.smallLink))
                messageObg.setFileLength(paramValid.strTrim(options.fileLength))
                messageObg.setSmallWidth(paramValid.strTrim(options.smallWidth))
                messageObg.setSmallHeight(paramValid.strTrim(options.smallHeight))
                if (options.mime != '.gif') {
                    messageObg.setBigLink(paramValid.strTrim(options.bigLink))
                    messageObg.setMiddleLink(paramValid.strTrim(options.middleLink))
                    messageObg.setMiddleWidth(paramValid.strTrim(options.middleWidth))
                    messageObg.setMiddleHeight(paramValid.strTrim(options.middleHeight))
                }
                break
            case proto.css.msg.EMsgContentType.VIDEO:
                messageObg = new proto.css.msg.VideoMessage()
                messageObg.setFileName(paramValid.strTrim(options.fileName))
                messageObg.setVideoLink(paramValid.strTrim(options.videoLink))
                messageObg.setVideoScreenShortLink(paramValid.strTrim(options.videoScreenShortLink))
                messageObg.setFileLength(paramValid.strTrim(options.fileLength))
                messageObg.setDuration(paramValid.strTrim(options.duration))
                messageObg.setWidth(paramValid.strTrim(options.width))
                messageObg.setHeight(paramValid.strTrim(options.height))
                break
            case proto.css.msg.EMsgContentType.AUDIO:
                messageObg = new proto.css.msg.AudioMessage()
                messageObg.setFileName(paramValid.strTrim(options.fileName))
                messageObg.setAudioLink(paramValid.strTrim(options.audioLink))
                messageObg.setFileLength(paramValid.strTrim(options.fileLength))
                messageObg.setDuration(paramValid.strTrim(options.duration))
                break
            case proto.css.msg.EMsgContentType.LOCATION:
                messageObg = new proto.css.msg.LocationMessage()
                messageObg.setFileName(paramValid.strTrim(options.fileName))
                messageObg.setOriginLink(paramValid.strTrim(options.originLink))
                messageObg.setFileLength(paramValid.strTrim(options.fileLength))
                messageObg.setWidth(paramValid.strTrim(options.width))
                messageObg.setHeight(paramValid.strTrim(options.height))
                messageObg.setLongitude(paramValid.strTrim(options.longitude))
                messageObg.setLatitude(paramValid.strTrim(options.latitude))
                messageObg.setLocationDesc(paramValid.strTrim(options.locationDesc))
                messageObg.setLocationAddress(paramValid.strTrim(options.locationAddress))
                break
            case proto.css.msg.EMsgContentType.AT:
                messageObg = new proto.css.msg.AtMessage()
                if (options.atAll) {
                    messageObg.setAtAll(options.atAll)
                } else {
                    messageObg.setAtMemberList(uniqueArray(options.atMemberList).map(function makeLowerCase (v) {
                        return v.toLowerCase()
                    }))
                }
                if (typeof options.text !== 'undefined' && options.text != null && typeof options.text === 'string' && options.text.toString().trim().length != 0) {
                    messageObg.setText(paramValid.strTrim(options.text))
                }
                break
            case proto.css.msg.EMsgContentType.READ_RECEIPT:
                messageObg = new proto.css.msg.ReadReceiptMessage()
                messageObg.setReceiptGuid(Long.fromString(paramValid.strTrim(options.receiptGuid).toString(), true))
                break
            case proto.css.msg.EMsgContentType.FILE:
                messageObg = new proto.css.msg.FileMessage()
                messageObg.setFileName(paramValid.strTrim(options.fileName))
                messageObg.setFileLink(paramValid.strTrim(options.fileLink))
                messageObg.setFileLength(paramValid.strTrim(options.fileLength))
                break
            case proto.css.msg.EMsgContentType.RETRACT:
                messageObg = new proto.css.msg.RetractMessage()
                messageObg.setRetractGuid(Long.fromString(paramValid.strTrim(options.retractGuid).toString(), true))
                break
            case proto.css.msg.EMsgContentType.CUSTOM:
                messageObg = new proto.css.msg.CustomMessage()
                if (typeof options.notification !== 'undefined' && options.notification != null && paramValid.strTrim(options.notification) != '') {
                    messageObg.setNotification(paramValid.strTrim(options.notification))
                }
                if (options.customEntityList) {
                    for (var i = 0; i < options.customEntityList.length; i++) {
                        var customEntity = new proto.css.msg.CustomEntity()
                        customEntity.setKey(paramValid.strTrim(options.customEntityList[i].key))
                        customEntity.setValue(paramValid.strTrim(options.customEntityList[i].value))
                        messageObg.getCustomEntityList().push(customEntity)
                    }
                }
                break
            default:
                break
        }
        return messageObg.serializeBinary()
    } else {
        return ''
    }
}

FingoIMApi.Log = FingoIMBase.Log
FingoIMApi.Util = FingoIMBase.Util

export { FingoIMApi }
