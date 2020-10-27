import { ErrorCode } from './errCode'
if (window.XDomainRequest) {
    XDomainRequest.prototype.oldsend = XDomainRequest.prototype.send
    XDomainRequest.prototype.send = function () {
        XDomainRequest.prototype.oldsend.apply(this, arguments)
        this.readyState = 2
    }
}
// 重新定义时间格式化
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        'S': this.getMilliseconds() // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}

var FingoIMBase = {}
let MAX_RECONNECT = 10
let reCoonectCount = 0
/**
 * 工具类
 *
 */
FingoIMBase.Util = {
    // 默认函数
    emptyFn: function () {
    },
    // 原生http请求
    doHttpRequest: function (options) {
        var dataType = options.dataType || 'text'
        var suc = options.success || FingoIMBase.Util.emptyFn
        var error = options.error || FingoIMBase.Util.emptyFn
        var xhr = createCORSResponse('post', options.url)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var status = xhr.status || 0
                if (status == 200) {
                    if (dataType == 'text') {
                        suc(xhr.responseText, xhr)
                        return
                    }
                    if (dataType == 'json') {
                        try {
                            var json = JSON.parse(xhr.responseText)
                            suc(json, xhr)
                        } catch (e) {
                            error(xhr.responseText, xhr, '错误的数据,无法转换为json')
                        }
                        return
                    }
                    if (dataType == 'xml') {
                        if (xhr.responseXML && xhr.responseXML.documentElement) {
                            suc(xhr.responseXML.documentElement, xhr)
                        } else {
                            error(xhr.responseText, xhr, '浏览器不支持ajax返回xml对象')
                        }
                        return
                    }
                    suc(xhr.response || xhr.responseText, xhr)
                    return
                } else {
                    if (dataType == 'json') {
                        try {
                            var json = JSON.parse(xhr.responseText)
                            error(json, xhr, '服务器返回错误信息')
                        } catch (e) {
                            error(xhr.responseText, xhr, '服务器返回错误信息')
                        }
                        return
                    }
                    if (dataType == 'xml') {
                        if (xhr.responseXML && xhr.responseXML.documentElement) {
                            error(xhr.responseXML.documentElement, xhr, '服务器返回错误信息')
                        } else {
                            error(xhr.responseText, xhr, '服务器返回错误信息')
                        }
                        return
                    }
                    error(xhr.responseText, xhr, '服务器返回错误信息')
                    return
                }
            }
            if (xhr.readyState === 0) {
                error(xhr.responseText, xhr, '服务器异常')
            }
        }

        if (options.responseType) {
            if (xhr.responseType) {
                xhr.responseType = options.responseType
            } else {
                error('', xhr, '当前浏览器不支持设置响应类型')
                return null
            }
        }
        if (options.mimeType) {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType)
            } else {
                error('', xhr, '当前浏览器不支持设置mimeType')
                return null
            }
        }

        var type = options.type || 'POST'
        xhr.open(type, options.url)

        var headers = options.headers || {}
        for (var key in headers) {
            if (xhr.setRequestHeader) {
                xhr.setRequestHeader(key, headers[key])
            } else {
                error('', xhr, '当前浏览器不支持设置header')
                return null
            }
        }

        var data = options.data || null
        // xhr.send(data);
        var formData = new FormData()
        formData.append('param', data)
        xhr.send(formData)
        // return xhr;
    },
    /**
     * 文件上传
     * @param (options)
     * (object)options.fileInfo：文件基本信息对象
     * (string)options.url:服务器地址
     * (func)options.onFileUploadProgress:文件上传进度回调
     * (func)options.onFileUploadComplete：文件上传完成回调
     * (func)options.onFileUploadError:文件上传失败回调
     * (func)options.onFileUploadCanceled:文件上传取消回调
     *  Returns:void
     */
    uploadFn: function (options) {
        options = options || {}
        options.onFileUploadProgress = options.onFileUploadProgress || FingoIMBase.Util.emptyFn
        options.onFileUploadComplete = options.onFileUploadComplete || FingoIMBase.Util.emptyFn
        options.onFileUploadError = options.onFileUploadError || FingoIMBase.Util.emptyFn
        options.onFileUploadCanceled = options.onFileUploadCanceled || FingoIMBase.Util.emptyFn
        // 文件服务器地址
        var uploadUrl = options.url
        // var xhr = new FingoIMBase.Xmlrequest();
        var xhr = createCORSResponse('post', uploadUrl)
        if (!xhr) {
            alert('CORS not supported')
            return
        }
        // 判断是否支持异步上传文件
        var isCanUploadFile = xhr.setRequestHeader && typeof FormData !== 'undefined'

        if (!isCanUploadFile) {
            options.onFileUploadError({
                ret: '50004',
                msg: ErrorCode['50004']
            })
            return
        }

        var onError = function (e) {
            options.onFileUploadError({
                ret: '50005',
                msg: ErrorCode['50005'] + e.message
            })
        }
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', options.onFileUploadProgress, false)
        }
        if (xhr.addEventListener) {
            xhr.addEventListener('abort', options.onFileUploadCanceled, false)
            xhr.addEventListener('load', function (e) {
                try {
                    var json = JSON.parse(xhr.responseText)
                    options.onFileUploadComplete(json)
                } catch (e) {
                    options.onFileUploadError({
                        ret: '50005',
                        msg: ErrorCode['50005'] + e.message
                    })
                }
            }, false)
            xhr.addEventListener('error', onError, false)
        } else if (xhr.onreadystatechange) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (ajax.status == 200) {
                        try {
                            var json = JSON.parse(xhr.responseText)
                            options.onFileUploadComplete(json)
                        } catch (e) {
                            options.onFileUploadError({
                                ret: '50005',
                                msg: ErrorCode['50005'] + e.message
                            })
                        }
                    } else {
                        options.onFileUploadError({
                            ret: '50005',
                            msg: ErrorCode['50005'] + '服务端返回异常'
                        })
                    }
                } else {
                    xhr.abort()
                    options.onFileUploadCanceled()
                }
            }
        }

        var formData = new FormData()
        formData.append('file', options.fileInfo.file)
        formData.append('param', options.fileInfo.param)
        xhr.send(formData)
    },
    // 获取cookies
    getCookie: function (name) {
        var arr; var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (arr = document.cookie.match(reg)) { return unescape(arr[2]) } else { return null }
    },
    // 删除cookies
    delCookie: function (name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = this.getCookie(name)
        if (cval != null) { document.cookie = name + '=' + escape(cval) + ';expires=' + exp.toGMTString() + ';path=/' }
    },
    // 写cookies
    setCookie: function (c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/'
    },
    // 服务器guid转换时间戳
    guidToTime: function (str) {
        if (str) {
            str = str.toString()
            var tmp = str.substring(0, str.length - 3)
            var x1 = Math.floor(tmp / 16)
            x1 = x1 * 1000
            x1 = Math.floor(x1 / (1 << 18))
            var twepoch = 1468976307657
            x1 = x1 + twepoch
            return x1
        }
        return ''
    },
    // 生成唯一id
    getUniqueId: function () {
        var num = ''
        for (var i = 0; i < 12; i++) {
            num += Math.floor(Math.random() * 10)
        }
        return 'FINGOIMWEB_' + num
    },
    // 对象扩展
    extend: function (destination, source) {
        for (let property in source) {
            destination[property] = source[property]
        }
        return destination
    },
    // 获取通知实例
    getNotifySessionInstance: function (sessionNotify) {
        var notifyType = sessionNotify.getType()
        var data = sessionNotify.getData()
        var sessionNotifyInstace = null

        switch (notifyType) {
            case proto.css.ntf.ENtfType.LOGIN_RESPONSE:
                break
            case proto.css.ntf.ENtfType.LOGOUT_RESPONSE:
                break
            case proto.css.ntf.ENtfType.KICK_NOTIFICATION:
                sessionNotifyInstace = proto.css.ntf.KickNotification.deserializeBinary(data)
                break
            case proto.css.ntf.ENtfType.STREAM_INIT_RESPONSE:
                break
            case proto.css.ntf.ENtfType.NEW_MSG:
                sessionNotifyInstace = sessionNotify
                break
            case proto.css.ntf.ENtfType.FRIEND_UPDATE_NOTIFICATION:
                sessionNotifyInstace = proto.css.ntf.FriendUpdateNotification.deserializeBinary(data)
                break
            case proto.css.ntf.ENtfType.RETRACT_NOTIFICATION:
                sessionNotifyInstace = proto.css.ntf.RetractNotification.deserializeBinary(data)
                break
            case proto.css.ntf.ENtfType.CARBON_MSG:
                sessionNotifyInstace = proto.css.ntf.CarbonMsgNotification.deserializeBinary(data)
                break
            default:
                break
        }
        return sessionNotifyInstace
    },
    // 生成请求体
    buildProxyRequest: function (service, method, data) {
        var requestId = FingoIMBase.Util.getUniqueId()
        var proxyRequest = new proto.css.websocket.ProxyRequest()
        proxyRequest.setServiceName(service)
        proxyRequest.setMethodName(method)
        proxyRequest.setData(data)
        proxyRequest.setRequestId(requestId)
        return proxyRequest
    }
}

FingoIMBase.Xmlrequest = function (crossDomain) {
    this.crossDomain = crossDomain || true
    var temp = this._createStandardXHR() || this._createActiveXHR()

    if ('withCredentials' in temp) {
        return temp
    }
    if (!crossDomain) {
        return temp
    }
    if (window.XDomainRequest === undefined) {
        return temp
    }
    var xhr = new XDomainRequest()
    xhr.readyState = 0
    xhr.status = 100
    xhr.onreadystatechange = FingoIMBase.Util.emptyFn
    xhr.onload = function () {
        xhr.readyState = 4
        xhr.status = 200

        var xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
        xmlDoc.async = 'false'
        xmlDoc.loadXML(xhr.responseText)
        xhr.responseXML = xmlDoc
        xhr.response = xhr.responseText
        xhr.onreadystatechange()
    }
    xhr.upload = function () {
        xhr.readyState = 4
        xhr.status = 200

        var xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
        xmlDoc.async = 'false'
        xmlDoc.loadXML(xhr.responseText)
        xhr.responseXML = xmlDoc
        xhr.response = xhr.responseText
        xhr.onreadystatechange()
    }
    xhr.ontimeout = xhr.onerror = function () {
        xhr.readyState = 4
        xhr.status = 500
        xhr.onreadystatechange()
    }
    return xhr
}
FingoIMBase.Xmlrequest.prototype = {
    _createStandardXHR: function () {
        try {
            return new window.XMLHttpRequest()
        } catch (e) {
            return false
        }
    },
    _createActiveXHR: function () {
        try {
            return new window.ActiveXObject('Microsoft.XMLHTTP')
        } catch (e) {
            return false
        }
    }
}

function createCORSResponse (method, url) {
    var xhr = new XMLHttpRequest()
    if ('withCredentials' in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true)
    } else if (typeof XDomainRequest !== 'undefined') {
        // XDomainRequest for IE.
        xhr = new XDomainRequest()
        xhr.open(method, url)
    } else {
        // CORS not supported.
        xhr = null
    }
    return xhr
}

/* ------------------------------------------------- */
/**
 * 日志
 *
 * @param (level,tagFilter,postFlag,postUrl)
 * (string)level：日志级别
 * (string)tagFilter：日志tag筛选,正则表达式字符串
 * (boolean)postFlag：提交到服务器标识
 * (string)postUrl：日志服务器地址
 * (boolean)isDev: 运行环境标识
 * (string)sUA : 运行浏览器
 *  Returns:
 *    A new FingoIMBase.Log object.
 */
FingoIMBase.Log = function (level, tagFilter, postFlag, postUrl, isDev, sUA) {
    this._level = level || 'debug'
    this._tagFilter = tagFilter || ''
    this._postFlag = postFlag || false
    this._postUrl = postUrl || ''
    this._isDev = isDev || true
    this._sUA = sUA || navigator.userAgent.toLowerCase()
}
/**
 * 日志级别,级别越高，输出的日志越少。比如：当前级别如果是WARN，则只输出ERROR,WARN的日志
 */
FingoIMBase.Log.Level = {
    'error': 4,
    'warn': 3,
    'info': 2,
    'log': 1,
    'debug': 0
}
FingoIMBase.Log.prototype = {
    error: function (msg, tag) {
        this._exec('error', msg, tag)
    },
    warn: function (msg, tag) {
        this._exec('warn', msg, tag)
    },
    info: function (msg, tag) {
        this._exec('info', msg, tag)
    },
    debug: function (msg, tag) {
        this._exec('debug', msg, tag)
    },
    _exec: function (level, msg, tag) {
        var _loglevel = FingoIMBase.Log.Level[this._level]
        if (_loglevel > FingoIMBase.Log.Level[level]) { return }
        var _needlog = false
        if (tag != undefined) {
            var reg = new RegExp(this._tagFilter)
            _needlog = reg.test(tag)
        } else {
            _needlog = true
        }
        if (_needlog) {
            var _dateStr = new Date().format('yyyy-MM-dd hh:mm:ss')
            msg = _dateStr + ' 【' + level + '】:' + msg + '\r\n';

            (typeof console !== 'undefined' && this._isDev) ? console[level](msg) : !0
            if (this._postFlag && this._postUrl) {
                // do post log
            }
            if (this._isDev) {
                var node
                if (level == 'debug') {
                    node = "<p style='color:blue;margin-bottom:5px'>" + msg + '</p>'
                } else if (level == 'info') {
                    node = "<p style='margin-bottom:5px'>" + msg + '</p>'
                } else if (level == 'warn') {
                    node = "<p style='color:#f9a60a;margin-bottom:5px'>" + msg + '</p>'
                } else if (level == 'error') {
                    node = "<p style='color:red;margin-bottom:5px'>" + msg + '</p>'
                } else {
                    node = "<p style='margin-bottom:5px'>" + msg + '</p>'
                }
                var div = document.createElement('div')
                div.id = 'mDiv'
                div.innerHTML = node
                if (document.getElementById('log')) {
                    document.getElementById('log').appendChild(div)
                }
                // $("#log").append(node);
            }
        }
    }
}

/** 回调函数注册类
 *  @param (handler,name,id,options)
 *  (Function) handler:回调函数.
 *  (String) service:服务名称
 *  (String) method:接口名称
 *  (String) id：回调函数id.
 *  (func) deserializeBinary: 数据流解析函数
 *  (Object) log:日志实例
 *  Returns:
 *    A new FingoIMBase.Handler object.
 */
FingoIMBase.Handler = function (handler, service, method, id, deserializeBinary, log) {
    this.handler = handler
    this.service = service
    this.method = method
    this.id = id
    // whether the handler is a user handler or a system handler
    this.user = true
    this.log = log
    this.deserializeBinary = deserializeBinary
}
FingoIMBase.Handler.prototype = {
    /** PrivateFunction: isMatch
     *  Tests if a message matches the FingoIMBase.Handler.
     *  @param (name,id)
     *
     *  Returns:
     *    true if the message matches and false otherwise.
     */
    isMatch: function (service, method, id) {
        return this.service == service && this.method == method && this.id == id
    },

    /** PrivateFunction: run
     *  Run the callback on a matching message.
     *  @param (proxyResponse)
     *  (Object) proxyResponse:响应类
     *  Returns:
     *    A boolean indicating if the handler should remain active.
     */
    run: function (proxyResponse) {
        if (this.deserializeBinary && proxyResponse) {
            try {
                var proxyResponseInstace = this.deserializeBinary(proxyResponse.getData())
                this.handler(proxyResponseInstace)
            } catch (e) {
                if (this.log && this.log instanceof FingoIMBase.Log) {
                    this.log.warn(e.sourceURL + ':' + e.line + ' - ' + e.name + ': ' + e.message)
                }
            }
        }
    },

    /** PrivateFunction: toString
     *  Get a String representation of the FingoIMBase.Handler object.
     *  Returns:
     *    A String.
     */
    toString: function () {
        return '{Handler: ' + this.handler + '(' + this.service + ',' + this.method + ','
        this.id + ')}'
    }
}

/** 通知回调函数注册类
 *  @param (handler,name,id,options)
 *  (Function) handler:回调函数.
 *  (String) service:服务名称
 *  (String) method:接口名称
 *  (String) id：回调函数id.
 *  (Object) log:日志实例
 *  Returns:
 *    A new FingoIMBase.Handler object.
 */
FingoIMBase.NotifyHandler = function (handler, notifyType, log) {
    this.handler = handler
    this.notifyType = notifyType
    // whether the handler is a user handler or a system handler
    this.user = false
    this.log = log
}
FingoIMBase.NotifyHandler.prototype = {
    /** PrivateFunction: isMatch
     *  Tests if a message matches the FingoIMBase.Handler.
     *  @param (name,id)
     *
     *  Returns:
     *    true if the message matches and false otherwise.
     */
    isMatch: function (notifyType) {
        return this.notifyType == notifyType
    },

    /** PrivateFunction: run
     *  Run the callback on a matching message.
     *  @param (sessionNotify)
     *  (Object) sessionNotify:通知类
     *  Returns:
     *    A boolean indicating if the handler should remain active.
     */
    run: function (sessionNotify) {
        var sessionNotifyInstace = FingoIMBase.Util.getNotifySessionInstance(sessionNotify)
        if (sessionNotifyInstace) {
            try {
                this.handler(sessionNotifyInstace.toObject())
            } catch (e) {
                if (this.log && this.log instanceof FingoIMBase.Log) {
                    this.log.warn(e.sourceURL + ':' + e.line + ' - ' + e.name + ': ' + e.message)
                }
            }
        }
    },

    /** PrivateFunction: toString
     *  Get a String representation of the FingoIMBase.Handler object.
     *  Returns:
     *    A String.
     */
    toString: function () {
        return '{Handler: ' + this.handler + '(' + this.notifyType + ')}'
    }
}

/** 超时回调函数注册类
 *  @param (period,handler)
 *  (Integer) period：注册类回调函数执行前等待的时间 The number of milliseconds to wait before the
 *  handler is called.
 *  (Function) handler：当handler释放的时候要执行的回调函数 The callback to run when the handler fires.  This
 *  Returns:
 *    A new FingoIMBase.TimedHandler object.
 */
FingoIMBase.TimedHandler = function (period, handler) {
    this.period = period
    this.handler = handler

    this.lastCalled = new Date().getTime()
    this.user = true
}

FingoIMBase.TimedHandler.prototype = {
    /** PrivateFunction: run
     *  Run the callback for the FingoIMBase.TimedHandler.
     *  Returns:
     *    true if the FingoIMBase.TimedHandler should be called again, and false
     *      otherwise.
     */
    run: function () {
        this.lastCalled = new Date().getTime()
        return this.handler()
    },

    /** PrivateFunction: reset
     *  Reset the last called time for the FingoIMBase.TimedHandler.
     */
    reset: function () {
        this.lastCalled = new Date().getTime()
    },
    /** PrivateFunction: toString
     *  Get a string representation of the FingoIMBase.TimedHandler object.
     *
     *  Returns:
     *    The string representation.
     */
    toString: function () {
        return '{TimedHandler: ' + this.handler + '(' + this.period + ')}'
    }
}

FingoIMBase.Services = {
    SERVICE_WEBSOCKET: 'littlec-websocket',
    SERVICE_CHAT: 'littlec-chat',
    SERVICE_HISTORY: 'littlec-history'
}

FingoIMBase.Methods = {
    METHOD_LOGIN: 'login',
    METHOD_LOGOUT: 'logout',
    METHOD_SENDCHAT: 'sendChat',
    METHOD_MESSAGESYNC: 'messageSync',
    METHOD_CHATHISTORYMESSAGEGET: 'chatHistoryMessageGet',
    METHOD_SYNCSENDGUID: 'syncSendGUID',
    METHOD_CHATMESSAGEREMOVE: 'chatMessageRemove',
    METHOD_CUSTOMER_LOGIN: 'customerServiceSignIn',
    METHOD_CUSTOMER_LOGOUT: 'customerServiceSingOut',
    METHOD_GET_SESSION: 'getSessionWithPage',
    METHOD_SET_STATUS: 'setServiceStatus',
    METHOD_STOP_SERVICE: 'cSStopService',
    METHOD_CHECK_BUNDLE_OVERDUE: 'checkBundleOverdue',
    METHOD_SUBMIT_WORK_ORDER: 'setSessionTypeAfterSubmittedWorkOrder'
}

FingoIMBase.Connection = function (service, log) {
    // The service URL
    this.service = service
    this.log = log
    this.timedHandlers = []
    this.handlers = []
    this.removeTimeds = []
    this.removeHandlers = []
    this.addTimeds = []
    this.addHandlers = []
    this.requestHandlers = []
    this.notifyHandlers = []
    this.messages = []
    this.paused = false
}

FingoIMBase.Connection.Status = {
    ERROR: 0,
    CONNECTING: 1,
    CONNFAIL: 2,
    CONNECTED: 3,
    LOGINING: 4,
    LOGINED: 5,
    DISCONNECTED: 6,
    DISCONNECTING: 7,
    LOGOUTING: 8,
    LOGOUTED: 9
}
FingoIMBase.Connection.prototype = {

    addMessageHandler: function (handler, name, id) {
        var hand = new FingoIMBase.Handler(handler, name, id, this.log)
        this.addHandlers.push(hand)
        return hand
    },
    deleteMessageHandler: function (handRef) {
        if (handRef) {
            this.removeHandlers.push(handRef)
        }
    },
    addRequestHandler: function (handler, service, method, id, deserializeBinary) {
        var hand = new FingoIMBase.Handler(handler, service, method, id, deserializeBinary, this.log)
        this.requestHandlers.push(hand)
        return hand
    },

    deleteRequestHandler: function (handRef, index) {
        if (handRef) {
            this.requestHandlers.splice(index, 1)
        }
    },

    addNotifyHandler: function (handler, notifyType) {
        var hand = new FingoIMBase.NotifyHandler(handler, notifyType, this.log)
        this.notifyHandlers.push(hand)
        return hand
    },

    deleteNotifyHandler: function (handRef, index) {
        if (handRef) {
            this.notifyHandlers.splice(index, 1)
        }
    },
    addTimedHandler: function (period, handler) {
        var thand = new FingoIMBase.TimedHandler(period, handler)
        this.addTimeds.push(thand)
        return thand
    },
    deleteTimedHandler: function (handRef) {
        this.removeTimeds.push(handRef)
    },
    connect: function () {
        // todo
    },
    _connect: function () {
        // todo
    },
    disconnect: function (reason) {
        // todo
    },
    _doDisconnect: function (reason) {
        // delete handlers
        this.handlers = []
        this.timedHandlers = []
        this.removeTimeds = []
        this.removeHandlers = []
        this.addTimeds = []
        this.addHandlers = []

        this.connected = false
    },
    _dataRecv: function (data) {
        var that = this
        if (data && data instanceof ArrayBuffer) {
            var arraybuffer = data
            var downStream = proto.css.websocket.DownStream.deserializeBinary(arraybuffer)
            var stream = downStream.getStream()
            var streamType = downStream.getDownStreamType()

            if (streamType == proto.css.websocket.EDownStreamType.PROXY_RESPONSE) {
                var proxyResponse = proto.css.websocket.ProxyResponse.deserializeBinary(stream)
                var serviceName = proxyResponse.getServiceName()
                var methodName = proxyResponse.getMethodName()
                var requestId = proxyResponse.getRequestId()
                for (var i = 0; i < that.requestHandlers.length; i++) {
                    if (that.requestHandlers[i].isMatch(serviceName, methodName, requestId)) {
                        that.requestHandlers[i].run(proxyResponse)
                        that.deleteRequestHandler(that.requestHandlers[i], i)
                    }
                }
            } else if (streamType == proto.css.websocket.EDownStreamType.SESSION_NOTIFY) {
                var sessionNotify = proto.css.websocket.SessionNotify.deserializeBinary(stream)
                var notifyType = sessionNotify.getType()
                for (var i = 0; i < that.notifyHandlers.length; i++) {
                    if (that.notifyHandlers[i].isMatch(notifyType)) {
                        that.notifyHandlers[i].run(sessionNotify)
                    }
                }
            }
        } else if (data instanceof Blob) {
            // 将Blob 对象转换成 ArrayBuffer
            var reader = new FileReader()
            reader.readAsArrayBuffer(data)
            reader.onload = function (e) {
                var arraybuffer = reader.result
                var downStream = proto.css.websocket.DownStream.deserializeBinary(arraybuffer)
                var stream = downStream.getStream()
                var streamType = downStream.getDownStreamType()

                if (streamType == proto.css.websocket.EDownStreamType.PROXY_RESPONSE) {
                    var proxyResponse = proto.css.websocket.ProxyResponse.deserializeBinary(stream)
                    var serviceName = proxyResponse.getServiceName()
                    var methodName = proxyResponse.getMethodName()
                    var requestId = proxyResponse.getRequestId()
                    for (var i = 0; i < that.requestHandlers.length; i++) {
                        if (that.requestHandlers[i].isMatch(serviceName, methodName, requestId)) {
                            that.requestHandlers[i].run(proxyResponse)
                            that.deleteRequestHandler(that.requestHandlers[i], i)
                        }
                    }
                } else if (streamType == proto.css.websocket.EDownStreamType.SESSION_NOTIFY) {
                    var sessionNotify = proto.css.websocket.SessionNotify.deserializeBinary(stream)
                    var notifyType = sessionNotify.getType()
                    for (var i = 0; i < that.notifyHandlers.length; i++) {
                        if (that.notifyHandlers[i].isMatch(notifyType)) {
                            that.notifyHandlers[i].run(sessionNotify)
                        }
                    }
                }
            }
        }
    },
    _onIdle: function () {
        var i, thand, since, newList
        // add timed handlers scheduled for addition
        // NOTE: we add before remove in the case a timed handler is
        // added and then deleted before the next _onIdle() call.
        while (this.addTimeds.length > 0) {
            this.timedHandlers.push(this.addTimeds.pop())
        }

        // remove timed handlers that have been scheduled for deletion
        while (this.removeTimeds.length > 0) {
            thand = this.removeTimeds.pop()
            i = this.timedHandlers.indexOf(thand)
            if (i >= 0) {
                this.timedHandlers.splice(i, 1)
            }
        }

        // call ready timed handlers
        var now = new Date().getTime()
        newList = []
        for (i = 0; i < this.timedHandlers.length; i++) {
            thand = this.timedHandlers[i]
            if (this.authenticated || !thand.user) {
                since = thand.lastCalled + thand.period
                if (since - now <= 0) {
                    if (thand.run()) {
                        newList.push(thand)
                    }
                } else {
                    newList.push(thand)
                }
            }
        }
        this.timedHandlers = newList

        clearTimeout(this._idleTimeout)

        this._proto._onIdle()

        // reactivate the timer only if connected
        if (this.connected) {
            this._idleTimeout = setTimeout(this._onIdle.bind(this), this.pollingTime)
        }
    }

}

FingoIMBase.Websocket = function (connection, log) {
    this._conn = connection
    this.log = log
}
let lockReconnect = false
let manualClose = false
FingoIMBase.Websocket.prototype = {
    timeout: 15000,
    timeoutObj: null,
    serverTimeoutObj: null,
    conSuccess: function () {},
    conError: function () {},
    reset: function () {
        let that = this
        clearTimeout(that.timeoutObj)
        clearTimeout(that.serverTimeoutObj)
        return this
    },
    start: function () {
        let self = this
        self.timeoutObj = setTimeout(function () {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            self.socket.send('ping')
            console.log('ping')
            self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
                self._closeSocket() // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, self.timeout)
    },
    reconnect: function () {
        if (lockReconnect) {
            return
        }
        lockReconnect = true
        let self = this
        setTimeout(function () {
            self.connect(self.conSuccess, self.conError)
            lockReconnect = false
        }, 2000)
    },
    connect: function (conSuccess, conError) {
        this._closeSocket()
        this.conSuccess = conSuccess
        this.conError = conError
        try {
            this._conn.status = FingoIMBase.Connection.Status.CONNECTING
            this.socket = new WebSocket(this._conn.service)
            // this.socket = new ReconnectingWebSocket(this._conn.service);
            this.socket.binaryType = 'arraybuffer'
        } catch (e) {
            this._conn.status = FingoIMBase.Connection.Status.ERROR
            this._conn.onError(e.message)
            if (this.log && this.log instanceof FingoIMBase.Log) {
                this.log.error(e.message)
            }
        }
        this._conn.status = FingoIMBase.Connection.Status.CONNECTED
        this.socket.onopen = this._onOpen.bind(this)
        this.socket.onerror = this._onError.bind(this)
        this.socket.onclose = this._onClose.bind(this)
        this.socket.onmessage = this._onMessage.bind(this)
    },
    send: function (data) {
        try {
            this.socket.send(data)
        } catch (e) {
            if (this.log && this.log instanceof FingoIMBase.Log) {
                this.log.error(e.message)
            }
        }
    },
    disconnect: function () {
        this._conn.status = FingoIMBase.Connection.Status.DISCONNECTING
        this._conn._doDisconnect()
        this._doDisconnect()
    },

    _doDisconnect: function () {
        if (this.log && this.log instanceof FingoIMBase.Log) {
            this.log.debug('WebSockets  was DISCONNECTING')
        }

        this._closeSocket()
    },
    manualCloseSocket: function () {
        this.reset()
        manualClose = true
    },
    _closeSocket: function () {
        if (this.socket) {
            try {
                this.socket.close()
            } catch (e) {
                this._conn.status = FingoIMBase.Connection.Status.DISCONNECTED
                this._conn.onError(e.message)
                if (this.log && this.log instanceof FingoIMBase.Log) {
                    this.log.error(e.message)
                }
            }
        }
    },
    _onClose: function (msg) {
        if (manualClose) {
            this._conn.status = FingoIMBase.Connection.Status.DISCONNECTED
            this._conn.onDisconnected(msg)
        } else {
            this.reconnect()
        }
    },
    _onError: function (error) {
        if (manualClose) {
            this._conn.status = FingoIMBase.Connection.Status.ERROR
        } else {
            this.reconnect()
        }
    },
    _onIdle: function () {
        var data = this._conn._data
        if (data.length > 0 && !this._conn.paused) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] !== null) {
                    var stanza = data[i]
                    this.socket.send(stanza)
                }
            }
            this._conn._data = []
        }
    },

    _onMessage: function (event) {
        this.reset().start()
        console.log(event)
        if (event.data != 'pong') {
            this._conn._dataRecv(event.data)
        }
    },
    _onOpen: function () {
        this._conn.status = FingoIMBase.Connection.Status.CONNECTED
        this.reset().start()
        this._conn.onConnected()
        if (this.conSuccess) {
            this.conSuccess()
            this.conSuccess = null
        }
    },
    _reset: function () {

    }
}
function ReconnectingWebSocket (url, protocols, options) {
    // Default settings
    var settings = {

        /** Whether this instance should log debug messages. */
        debug: false,

        /** Whether or not the websocket should attempt to connect immediately upon instantiation. */
        automaticOpen: true,

        /** The number of milliseconds to delay before attempting to reconnect. */
        reconnectInterval: 1000,
        /** The maximum number of milliseconds to delay a reconnection attempt. */
        maxReconnectInterval: 30000,
        /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
        reconnectDecay: 1.5,

        /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
        timeoutInterval: 2000,

        /** The maximum number of reconnection attempts to make. Unlimited if null. */
        maxReconnectAttempts: 10,

        /** The binary type, possible values 'blob' or 'arraybuffer', default 'blob'. */
        binaryType: 'arraybuffer'
    }
    if (!options) {
        options = {}
    }

    // Overwrite and define settings with options if they exist.
    for (var key in settings) {
        if (typeof options[key] !== 'undefined') {
            this[key] = options[key]
        } else {
            this[key] = settings[key]
        }
    }

    // These should be treated as read-only properties

    /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
    this.url = url

    /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
    this.reconnectAttempts = 0

    /**
     * The current state of the connection.
     * Can be one of: WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED
     * Read only.
     */
    this.readyState = WebSocket.CONNECTING

    /**
     * A string indicating the name of the sub-protocol the server selected; this will be one of
     * the strings specified in the protocols parameter when creating the WebSocket object.
     * Read only.
     */
    this.protocol = null

    // Private state variables

    var self = this
    var ws
    var forcedClose = false
    var timedOut = false
    var eventTarget = document.createElement('div')

    // Wire up "on*" properties as event handlers

    eventTarget.addEventListener('open', function (event) {
        self.onopen(event)
    })
    eventTarget.addEventListener('close', function (event) {
        self.onclose(event)
    })
    eventTarget.addEventListener('connecting', function (event) {
        self.onconnecting(event)
    })
    eventTarget.addEventListener('message', function (event) {
        self.onmessage(event)
    })
    eventTarget.addEventListener('error', function (event) {
        self.onerror(event)
    })

    // Expose the API required by EventTarget

    this.addEventListener = eventTarget.addEventListener.bind(eventTarget)
    this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget)
    this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget)

    /**
     * This function generates an event that is compatible with standard
     * compliant browsers and IE9 - IE11
     *
     * This will prevent the error:
     * Object doesn't support this action
     *
     * http://stackoverflow.com/questions/19345392/why-arent-my-parameters-getting-passed-through-to-a-dispatched-event/19345563#19345563
     * @param s String The name that the event should use
     * @param args Object an optional object that the event will use
     */
    function generateEvent (s, args) {
        var evt = document.createEvent('CustomEvent')
        evt.initCustomEvent(s, false, false, args)
        return evt
    };

    this.open = function (reconnectAttempt) {
        ws = new WebSocket(self.url, protocols || [])
        ws.binaryType = this.binaryType

        if (reconnectAttempt) {
            if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
                return
            }
        } else {
            eventTarget.dispatchEvent(generateEvent('connecting'))
            this.reconnectAttempts = 0
        }

        if (self.debug || ReconnectingWebSocket.debugAll) {
            if (typeof console !== 'undefined') {
                console.debug('ReconnectingWebSocket', 'attempt-connect', self.url)
            }
        }

        var localWs = ws
        var timeout = setTimeout(function () {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                if (typeof console !== 'undefined') {
                    console.debug('ReconnectingWebSocket', 'connection-timeout', self.url)
                }
            }
            timedOut = true
            localWs.close()
            timedOut = false
        }, self.timeoutInterval)

        ws.onopen = function (event) {
            clearTimeout(timeout)
            if (self.debug || ReconnectingWebSocket.debugAll) {
                if (typeof console !== 'undefined') {
                    console.debug('ReconnectingWebSocket', 'onopen', self.url)
                }
            }
            self.protocol = ws.protocol
            self.readyState = WebSocket.OPEN
            self.reconnectAttempts = 0
            var e = generateEvent('open')
            e.isReconnect = reconnectAttempt
            reconnectAttempt = false
            eventTarget.dispatchEvent(e)
        }

        ws.onclose = function (event) {
            clearTimeout(timeout)
            ws = null
            if (forcedClose) {
                self.readyState = WebSocket.CLOSED
                eventTarget.dispatchEvent(generateEvent('close'))
            } else {
                self.readyState = WebSocket.CONNECTING
                var e = generateEvent('connecting')
                e.code = event.code
                e.reason = event.reason
                e.wasClean = event.wasClean
                eventTarget.dispatchEvent(e)
                if (!reconnectAttempt && !timedOut) {
                    if (self.debug || ReconnectingWebSocket.debugAll) {
                        if (typeof console !== 'undefined') {
                            console.debug('ReconnectingWebSocket', 'onclose', self.url)
                        }
                    }
                    eventTarget.dispatchEvent(generateEvent('close'))
                }

                var timeout = self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts)
                setTimeout(function () {
                    self.reconnectAttempts++
                    self.open(true)
                }, timeout > self.maxReconnectInterval ? self.maxReconnectInterval : timeout)
            }
        }
        ws.onmessage = function (event) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                if (typeof console !== 'undefined') {
                    console.debug('ReconnectingWebSocket', 'onmessage', self.url, event.data)
                }
            }
            var e = generateEvent('message')
            e.data = event.data
            eventTarget.dispatchEvent(e)
        }
        ws.onerror = function (event) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                if (typeof console !== 'undefined') {
                    console.debug('ReconnectingWebSocket', 'onerror', self.url, event)
                }
            }
            eventTarget.dispatchEvent(generateEvent('error'))
        }
    }

    // Whether or not to create a websocket upon instantiation
    if (this.automaticOpen == true) {
        this.open(false)
    }

    /**
     * Transmits data to the server over the WebSocket connection.
     *
     * @param data a text string, ArrayBuffer or Blob to send to the server.
     */
    this.send = function (data) {
        if (ws) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                if (typeof console !== 'undefined') {
                    console.debug('ReconnectingWebSocket', 'send', self.url, data)
                }
            }
            return ws.send(data)
        } else {
            throw 'INVALID_STATE_ERR : Pausing to reconnect websocket'
        }
    }

    /**
     * Closes the WebSocket connection or connection attempt, if any.
     * If the connection is already CLOSED, this method does nothing.
     */
    this.close = function (code, reason) {
        // Default CLOSE_NORMAL code
        if (typeof code === 'undefined') {
            code = 1000
        }
        forcedClose = true
        if (ws) {
            ws.close(code, reason)
        }
    }

    /**
     * Additional public API method to refresh the connection if still open (close, re-open).
     * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
     */
    this.refresh = function () {
        if (ws) {
            ws.close()
        }
    }
}

/**
 * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
 * this indicates that the connection is ready to send and receive data.
 */
ReconnectingWebSocket.prototype.onopen = function (event) {
}
/** An event listener to be called when the WebSocket connection's readyState changes to CLOSED. */
ReconnectingWebSocket.prototype.onclose = function (event) {
}
/** An event listener to be called when a connection begins being attempted. */
ReconnectingWebSocket.prototype.onconnecting = function (event) {
}
/** An event listener to be called when a message is received from the server. */
ReconnectingWebSocket.prototype.onmessage = function (event) {
}
/** An event listener to be called when an error occurs. */
ReconnectingWebSocket.prototype.onerror = function (event) {
}

/**
 * Whether all instances of ReconnectingWebSocket should log debug messages.
 * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
 */
ReconnectingWebSocket.debugAll = false

ReconnectingWebSocket.CONNECTING = WebSocket.CONNECTING
ReconnectingWebSocket.OPEN = WebSocket.OPEN
ReconnectingWebSocket.CLOSING = WebSocket.CLOSING
ReconnectingWebSocket.CLOSED = WebSocket.CLOSED;

(function (factory) {
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory)
    } else {
        // Browser globals (with support for web workers)
        var glob

        try {
            glob = window
        } catch (e) {
            glob = self
        }

        glob.Long = factory()
    }
}(function (undefined) {
    'use strict'

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */
    function Long (low, high, unsigned) {
        /**
         * The low 32 bits as a signed value.
         * @type {number}
         */
        this.low = low | 0

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         */
        this.high = high | 0

        /**
         * Whether unsigned or not.
         * @type {boolean}
         */
        this.unsigned = !!unsigned
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @private
     */
    Long.prototype.__isLong__

    Object.defineProperty(Long.prototype, '__isLong__', {
        value: true,
        enumerable: false,
        configurable: false
    })

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong (obj) {
        return (obj && obj['__isLong__']) === true
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     */
    Long.isLong = isLong

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {}

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {}

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt (value, unsigned) {
        var obj, cachedObj, cache
        if (unsigned) {
            value >>>= 0
            if (cache = (value >= 0 && value < 256)) {
                cachedObj = UINT_CACHE[value]
                if (cachedObj) { return cachedObj }
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true)
            if (cache) { UINT_CACHE[value] = obj }
            return obj
        } else {
            value |= 0
            if (cache = (value >= -128 && value < 128)) {
                cachedObj = INT_CACHE[value]
                if (cachedObj) { return cachedObj }
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false)
            if (cache) { INT_CACHE[value] = obj }
            return obj
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromInt = fromInt

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber (value, unsigned) {
        if (isNaN(value) || !isFinite(value)) { return unsigned ? UZERO : ZERO }
        if (unsigned) {
            if (value < 0) { return UZERO }
            if (value >= TWO_PWR_64_DBL) { return MAX_UNSIGNED_VALUE }
        } else {
            if (value <= -TWO_PWR_63_DBL) { return MIN_VALUE }
            if (value + 1 >= TWO_PWR_63_DBL) { return MAX_VALUE }
        }
        if (value < 0) { return fromNumber(-value, unsigned).neg() }
        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned)
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromNumber = fromNumber

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits (lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned)
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromBits = fromBits

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString (str, unsigned, radix) {
        if (str.length === 0) { throw Error('empty string') }
        if (str === 'NaN' || str === 'Infinity' || str === '+Infinity' || str === '-Infinity') { return ZERO }
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned,
                unsigned = false
        } else {
            unsigned = !!unsigned
        }
        radix = radix || 10
        if (radix < 2 || radix > 36) { throw RangeError('radix') }

        var p
        if ((p = str.indexOf('-')) > 0) { throw Error('interior hyphen') } else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg()
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8))

        var result = ZERO
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i)
            var value = parseInt(str.substring(i, i + size), radix)
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size))
                result = result.mul(power).add(fromNumber(value))
            } else {
                result = result.mul(radixToPower)
                result = result.add(fromNumber(value))
            }
        }
        result.unsigned = unsigned
        return result
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     */
    Long.fromString = fromString

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue (val) {
        if (val /* is compatible */ instanceof Long) { return val }
        if (typeof val === 'number') { return fromNumber(val) }
        if (typeof val === 'string') { return fromString(val) }
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned)
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     */
    Long.fromValue = fromValue

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL)

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0)

    /**
     * Signed zero.
     * @type {!Long}
     */
    Long.ZERO = ZERO

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true)

    /**
     * Unsigned zero.
     * @type {!Long}
     */
    Long.UZERO = UZERO

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1)

    /**
     * Signed one.
     * @type {!Long}
     */
    Long.ONE = ONE

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true)

    /**
     * Unsigned one.
     * @type {!Long}
     */
    Long.UONE = UONE

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1)

    /**
     * Signed negative one.
     * @type {!Long}
     */
    Long.NEG_ONE = NEG_ONE

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false)

    /**
     * Maximum signed value.
     * @type {!Long}
     */
    Long.MAX_VALUE = MAX_VALUE

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true)

    /**
     * Maximum unsigned value.
     * @type {!Long}
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000 | 0, false)

    /**
     * Minimum signed value.
     * @type {!Long}
     */
    Long.MIN_VALUE = MIN_VALUE

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     */
    LongPrototype.toInt = function toInt () {
        return this.unsigned ? this.low >>> 0 : this.low
    }

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     */
    LongPrototype.toNumber = function toNumber () {
        if (this.unsigned) { return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0) }
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0)
    }

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     */
    LongPrototype.toString = function toString (radix) {
        radix = radix || 10
        if (radix < 2 || radix > 36) { throw RangeError('radix') }
        if (this.isZero()) { return '0' }
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix)
                var div = this.div(radixLong)
                var rem1 = div.mul(radixLong).sub(this)
                return div.toString(radix) + rem1.toInt().toString(radix)
            } else { return '-' + this.neg().toString(radix) }
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned)
        var rem = this
        var result = ''
        while (true) {
            var remDiv = rem.div(radixToPower)
            var intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0
            var digits = intval.toString(radix)
            rem = remDiv
            if (rem.isZero()) { return digits + result } else {
                while (digits.length < 6) { digits = '0' + digits }
                result = '' + digits + result
            }
        }
    }

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     */
    LongPrototype.getHighBits = function getHighBits () {
        return this.high
    }

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned () {
        return this.high >>> 0
    }

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     */
    LongPrototype.getLowBits = function getLowBits () {
        return this.low
    }

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned () {
        return this.low >>> 0
    }

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs () {
        if (this.isNegative()) // Unsigned Longs are never negative
        { return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs() }
        var val = this.high != 0 ? this.high : this.low
        for (var bit = 31; bit > 0; bit--) {
            if ((val & (1 << bit)) != 0) { break }
        }
        return this.high != 0 ? bit + 33 : bit + 1
    }

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     */
    LongPrototype.isZero = function isZero () {
        return this.high === 0 && this.low === 0
    }

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     */
    LongPrototype.isNegative = function isNegative () {
        return !this.unsigned && this.high < 0
    }

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     */
    LongPrototype.isPositive = function isPositive () {
        return this.unsigned || this.high >= 0
    }

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     */
    LongPrototype.isOdd = function isOdd () {
        return (this.low & 1) === 1
    }

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     */
    LongPrototype.isEven = function isEven () {
        return (this.low & 1) === 0
    }

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.equals = function equals (other) {
        if (!isLong(other)) { other = fromValue(other) }
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1) { return false }
        return this.high === other.high && this.low === other.low
    }

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.eq = LongPrototype.equals

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.notEquals = function notEquals (other) {
        return !this.eq(/* validates */ other)
    }

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.neq = LongPrototype.notEquals

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThan = function lessThan (other) {
        return this.comp(/* validates */ other) < 0
    }

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lt = LongPrototype.lessThan

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual (other) {
        return this.comp(/* validates */ other) <= 0
    }

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThan = function greaterThan (other) {
        return this.comp(/* validates */ other) > 0
    }

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gt = LongPrototype.greaterThan

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual (other) {
        return this.comp(/* validates */ other) >= 0
    }

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.compare = function compare (other) {
        if (!isLong(other)) { other = fromValue(other) }
        if (this.eq(other)) { return 0 }
        var thisNeg = this.isNegative()
        var otherNeg = other.isNegative()
        if (thisNeg && !otherNeg) { return -1 }
        if (!thisNeg && otherNeg) { return 1 }
        // At this point the sign bits are the same
        if (!this.unsigned) { return this.sub(other).isNegative() ? -1 : 1 }
        // Both are positive if at least one is unsigned
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1
    }

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.comp = LongPrototype.compare

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     */
    LongPrototype.negate = function negate () {
        if (!this.unsigned && this.eq(MIN_VALUE)) { return MIN_VALUE }
        return this.not().add(ONE)
    }

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     */
    LongPrototype.neg = LongPrototype.negate

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     */
    LongPrototype.add = function add (addend) {
        if (!isLong(addend)) { addend = fromValue(addend) }

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16
        var a32 = this.high & 0xFFFF
        var a16 = this.low >>> 16
        var a00 = this.low & 0xFFFF

        var b48 = addend.high >>> 16
        var b32 = addend.high & 0xFFFF
        var b16 = addend.low >>> 16
        var b00 = addend.low & 0xFFFF

        var c48 = 0; var c32 = 0; var c16 = 0; var c00 = 0
        c00 += a00 + b00
        c16 += c00 >>> 16
        c00 &= 0xFFFF
        c16 += a16 + b16
        c32 += c16 >>> 16
        c16 &= 0xFFFF
        c32 += a32 + b32
        c48 += c32 >>> 16
        c32 &= 0xFFFF
        c48 += a48 + b48
        c48 &= 0xFFFF
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned)
    }

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.subtract = function subtract (subtrahend) {
        if (!isLong(subtrahend)) { subtrahend = fromValue(subtrahend) }
        return this.add(subtrahend.neg())
    }

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.sub = LongPrototype.subtract

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.multiply = function multiply (multiplier) {
        if (this.isZero()) { return ZERO }
        if (!isLong(multiplier)) { multiplier = fromValue(multiplier) }
        if (multiplier.isZero()) { return ZERO }
        if (this.eq(MIN_VALUE)) { return multiplier.isOdd() ? MIN_VALUE : ZERO }
        if (multiplier.eq(MIN_VALUE)) { return this.isOdd() ? MIN_VALUE : ZERO }

        if (this.isNegative()) {
            if (multiplier.isNegative()) { return this.neg().mul(multiplier.neg()) } else { return this.neg().mul(multiplier).neg() }
        } else if (multiplier.isNegative()) { return this.mul(multiplier.neg()).neg() }

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) { return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned) }

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16
        var a32 = this.high & 0xFFFF
        var a16 = this.low >>> 16
        var a00 = this.low & 0xFFFF

        var b48 = multiplier.high >>> 16
        var b32 = multiplier.high & 0xFFFF
        var b16 = multiplier.low >>> 16
        var b00 = multiplier.low & 0xFFFF

        var c48 = 0; var c32 = 0; var c16 = 0; var c00 = 0
        c00 += a00 * b00
        c16 += c00 >>> 16
        c00 &= 0xFFFF
        c16 += a16 * b00
        c32 += c16 >>> 16
        c16 &= 0xFFFF
        c16 += a00 * b16
        c32 += c16 >>> 16
        c16 &= 0xFFFF
        c32 += a32 * b00
        c48 += c32 >>> 16
        c32 &= 0xFFFF
        c32 += a16 * b16
        c48 += c32 >>> 16
        c32 &= 0xFFFF
        c32 += a00 * b32
        c48 += c32 >>> 16
        c32 &= 0xFFFF
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48
        c48 &= 0xFFFF
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned)
    }

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.mul = LongPrototype.multiply

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.divide = function divide (divisor) {
        if (!isLong(divisor)) { divisor = fromValue(divisor) }
        if (divisor.isZero()) { throw Error('division by zero') }
        if (this.isZero()) { return this.unsigned ? UZERO : ZERO }
        var approx, rem, res
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) { return MIN_VALUE } // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE)) { return ONE } else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1)
                    approx = halfThis.div(divisor).shl(1)
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE
                    } else {
                        rem = this.sub(divisor.mul(approx))
                        res = approx.add(rem.div(divisor))
                        return res
                    }
                }
            } else if (divisor.eq(MIN_VALUE)) { return this.unsigned ? UZERO : ZERO }
            if (this.isNegative()) {
                if (divisor.isNegative()) { return this.neg().div(divisor.neg()) }
                return this.neg().div(divisor).neg()
            } else if (divisor.isNegative()) { return this.div(divisor.neg()).neg() }
            res = ZERO
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned) { divisor = divisor.toUnsigned() }
            if (divisor.gt(this)) { return UZERO }
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            { return UONE }
            res = UZERO
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()))

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2)
            var delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48)

            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            var approxRes = fromNumber(approx)
            var approxRem = approxRes.mul(divisor)
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta
                approxRes = fromNumber(approx, this.unsigned)
                approxRem = approxRes.mul(divisor)
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) { approxRes = ONE }

            res = res.add(approxRes)
            rem = rem.sub(approxRem)
        }
        return res
    }

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.div = LongPrototype.divide

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.modulo = function modulo (divisor) {
        if (!isLong(divisor)) { divisor = fromValue(divisor) }
        return this.sub(this.div(divisor).mul(divisor))
    }

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.mod = LongPrototype.modulo

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     */
    LongPrototype.not = function not () {
        return fromBits(~this.low, ~this.high, this.unsigned)
    }

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.and = function and (other) {
        if (!isLong(other)) { other = fromValue(other) }
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned)
    }

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.or = function or (other) {
        if (!isLong(other)) { other = fromValue(other) }
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned)
    }

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.xor = function xor (other) {
        if (!isLong(other)) { other = fromValue(other) }
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned)
    }

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftLeft = function shiftLeft (numBits) {
        if (isLong(numBits)) { numBits = numBits.toInt() }
        if ((numBits &= 63) === 0) { return this } else if (numBits < 32) { return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned) } else { return fromBits(0, this.low << (numBits - 32), this.unsigned) }
    }

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shl = LongPrototype.shiftLeft

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRight = function shiftRight (numBits) {
        if (isLong(numBits)) { numBits = numBits.toInt() }
        if ((numBits &= 63) === 0) { return this } else if (numBits < 32) { return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned) } else { return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned) }
    }

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shr = LongPrototype.shiftRight

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned (numBits) {
        if (isLong(numBits)) { numBits = numBits.toInt() }
        numBits &= 63
        if (numBits === 0) { return this } else {
            var high = this.high
            if (numBits < 32) {
                var low = this.low
                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned)
            } else if (numBits === 32) { return fromBits(high, 0, this.unsigned) } else { return fromBits(high >>> (numBits - 32), 0, this.unsigned) }
        }
    }

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     */
    LongPrototype.toSigned = function toSigned () {
        if (!this.unsigned) { return this }
        return fromBits(this.low, this.high, false)
    }

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     */
    LongPrototype.toUnsigned = function toUnsigned () {
        if (this.unsigned) { return this }
        return fromBits(this.low, this.high, true)
    }

    /**
     * Converts this Long to its byte representation.
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @returns {!Array.<number>} Byte representation
     */
    LongPrototype.toBytes = function (le) {
        return le ? this.toBytesLE() : this.toBytesBE()
    }

    /**
     * Converts this Long to its little endian byte representation.
     * @returns {!Array.<number>} Little endian byte representation
     */
    LongPrototype.toBytesLE = function () {
        var hi = this.high
        var lo = this.low
        return [
            lo & 0xff,
            (lo >>> 8) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 24) & 0xff,
            hi & 0xff,
            (hi >>> 8) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 24) & 0xff
        ]
    }

    /**
     * Converts this Long to its big endian byte representation.
     * @returns {!Array.<number>} Big endian byte representation
     */
    LongPrototype.toBytesBE = function () {
        var hi = this.high
        var lo = this.low
        return [
            (hi >>> 24) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 8) & 0xff,
            hi & 0xff,
            (lo >>> 24) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 8) & 0xff,
            lo & 0xff
        ]
    }

    return Long
}));

(function e (t, n, r) {
    function s (o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require === 'function' && require
                if (!u && a) return a(o, !0)
                if (i) return i(o, !0)
                var f = new Error("Cannot find module '" + o + "'")
                throw f.code = 'MODULE_NOT_FOUND', f
            }
            var l = n[o] = { exports: {} }
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e]
                return s(n || e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require === 'function' && require
    for (var o = 0; o < r.length; o++) s(r[o])
    return s
})({
    1: [function (require, module, exports) {
        (function (factory) {
            if (typeof exports === 'object') {
                // Node/CommonJS
                module.exports = factory()
            } else if (typeof define === 'function' && define.amd) {
                // AMD
                define(factory)
            } else {
                // Browser globals (with support for web workers)
                var glob

                try {
                    glob = window
                } catch (e) {
                    glob = self
                }

                glob.SparkMD5 = factory()
            }
        }(function (undefined) {
            'use strict'

            var add32 = function (a, b) {
                return (a + b) & 0xFFFFFFFF
            }
            var hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

            function cmn (q, a, b, x, s, t) {
                a = add32(add32(a, q), add32(x, t))
                return add32((a << s) | (a >>> (32 - s)), b)
            }

            function ff (a, b, c, d, x, s, t) {
                return cmn((b & c) | ((~b) & d), a, b, x, s, t)
            }

            function gg (a, b, c, d, x, s, t) {
                return cmn((b & d) | (c & (~d)), a, b, x, s, t)
            }

            function hh (a, b, c, d, x, s, t) {
                return cmn(b ^ c ^ d, a, b, x, s, t)
            }

            function ii (a, b, c, d, x, s, t) {
                return cmn(c ^ (b | (~d)), a, b, x, s, t)
            }

            function md5cycle (x, k) {
                var a = x[0]
                var b = x[1]
                var c = x[2]
                var d = x[3]

                a = ff(a, b, c, d, k[0], 7, -680876936)
                d = ff(d, a, b, c, k[1], 12, -389564586)
                c = ff(c, d, a, b, k[2], 17, 606105819)
                b = ff(b, c, d, a, k[3], 22, -1044525330)
                a = ff(a, b, c, d, k[4], 7, -176418897)
                d = ff(d, a, b, c, k[5], 12, 1200080426)
                c = ff(c, d, a, b, k[6], 17, -1473231341)
                b = ff(b, c, d, a, k[7], 22, -45705983)
                a = ff(a, b, c, d, k[8], 7, 1770035416)
                d = ff(d, a, b, c, k[9], 12, -1958414417)
                c = ff(c, d, a, b, k[10], 17, -42063)
                b = ff(b, c, d, a, k[11], 22, -1990404162)
                a = ff(a, b, c, d, k[12], 7, 1804603682)
                d = ff(d, a, b, c, k[13], 12, -40341101)
                c = ff(c, d, a, b, k[14], 17, -1502002290)
                b = ff(b, c, d, a, k[15], 22, 1236535329)

                a = gg(a, b, c, d, k[1], 5, -165796510)
                d = gg(d, a, b, c, k[6], 9, -1069501632)
                c = gg(c, d, a, b, k[11], 14, 643717713)
                b = gg(b, c, d, a, k[0], 20, -373897302)
                a = gg(a, b, c, d, k[5], 5, -701558691)
                d = gg(d, a, b, c, k[10], 9, 38016083)
                c = gg(c, d, a, b, k[15], 14, -660478335)
                b = gg(b, c, d, a, k[4], 20, -405537848)
                a = gg(a, b, c, d, k[9], 5, 568446438)
                d = gg(d, a, b, c, k[14], 9, -1019803690)
                c = gg(c, d, a, b, k[3], 14, -187363961)
                b = gg(b, c, d, a, k[8], 20, 1163531501)
                a = gg(a, b, c, d, k[13], 5, -1444681467)
                d = gg(d, a, b, c, k[2], 9, -51403784)
                c = gg(c, d, a, b, k[7], 14, 1735328473)
                b = gg(b, c, d, a, k[12], 20, -1926607734)

                a = hh(a, b, c, d, k[5], 4, -378558)
                d = hh(d, a, b, c, k[8], 11, -2022574463)
                c = hh(c, d, a, b, k[11], 16, 1839030562)
                b = hh(b, c, d, a, k[14], 23, -35309556)
                a = hh(a, b, c, d, k[1], 4, -1530992060)
                d = hh(d, a, b, c, k[4], 11, 1272893353)
                c = hh(c, d, a, b, k[7], 16, -155497632)
                b = hh(b, c, d, a, k[10], 23, -1094730640)
                a = hh(a, b, c, d, k[13], 4, 681279174)
                d = hh(d, a, b, c, k[0], 11, -358537222)
                c = hh(c, d, a, b, k[3], 16, -722521979)
                b = hh(b, c, d, a, k[6], 23, 76029189)
                a = hh(a, b, c, d, k[9], 4, -640364487)
                d = hh(d, a, b, c, k[12], 11, -421815835)
                c = hh(c, d, a, b, k[15], 16, 530742520)
                b = hh(b, c, d, a, k[2], 23, -995338651)

                a = ii(a, b, c, d, k[0], 6, -198630844)
                d = ii(d, a, b, c, k[7], 10, 1126891415)
                c = ii(c, d, a, b, k[14], 15, -1416354905)
                b = ii(b, c, d, a, k[5], 21, -57434055)
                a = ii(a, b, c, d, k[12], 6, 1700485571)
                d = ii(d, a, b, c, k[3], 10, -1894986606)
                c = ii(c, d, a, b, k[10], 15, -1051523)
                b = ii(b, c, d, a, k[1], 21, -2054922799)
                a = ii(a, b, c, d, k[8], 6, 1873313359)
                d = ii(d, a, b, c, k[15], 10, -30611744)
                c = ii(c, d, a, b, k[6], 15, -1560198380)
                b = ii(b, c, d, a, k[13], 21, 1309151649)
                a = ii(a, b, c, d, k[4], 6, -145523070)
                d = ii(d, a, b, c, k[11], 10, -1120210379)
                c = ii(c, d, a, b, k[2], 15, 718787259)
                b = ii(b, c, d, a, k[9], 21, -343485551)

                x[0] = add32(a, x[0])
                x[1] = add32(b, x[1])
                x[2] = add32(c, x[2])
                x[3] = add32(d, x[3])
            }

            function md5blk (s) {
                var md5blks = []
                var i /* Andy King said do it this way. */

                for (i = 0; i < 64; i += 4) {
                    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24)
                }
                return md5blks
            }

            function md5blk_array (a) {
                var md5blks = []
                var i /* Andy King said do it this way. */

                for (i = 0; i < 64; i += 4) {
                    md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24)
                }
                return md5blks
            }

            function md51 (s) {
                var n = s.length
                var state = [1732584193, -271733879, -1732584194, 271733878]
                var i
                var length
                var tail
                var tmp
                var lo
                var hi

                for (i = 64; i <= n; i += 64) {
                    md5cycle(state, md5blk(s.substring(i - 64, i)))
                }
                s = s.substring(i - 64)
                length = s.length
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
                }
                tail[i >> 2] |= 0x80 << ((i % 4) << 3)
                if (i > 55) {
                    md5cycle(state, tail)
                    for (i = 0; i < 16; i += 1) {
                        tail[i] = 0
                    }
                }

                // Beware that the final length might not fit in 32 bits so we take care of that
                tmp = n * 8
                tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/)
                lo = parseInt(tmp[2], 16)
                hi = parseInt(tmp[1], 16) || 0

                tail[14] = lo
                tail[15] = hi

                md5cycle(state, tail)
                return state
            }

            function md51_array (a) {
                var n = a.length
                var state = [1732584193, -271733879, -1732584194, 271733878]
                var i
                var length
                var tail
                var tmp
                var lo
                var hi

                for (i = 64; i <= n; i += 64) {
                    md5cycle(state, md5blk_array(a.subarray(i - 64, i)))
                }

                // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
                // containing the last element of the parent array if the sub array specified starts
                // beyond the length of the parent array - weird.
                // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
                a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0)

                length = a.length
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= a[i] << ((i % 4) << 3)
                }

                tail[i >> 2] |= 0x80 << ((i % 4) << 3)
                if (i > 55) {
                    md5cycle(state, tail)
                    for (i = 0; i < 16; i += 1) {
                        tail[i] = 0
                    }
                }

                // Beware that the final length might not fit in 32 bits so we take care of that
                tmp = n * 8
                tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/)
                lo = parseInt(tmp[2], 16)
                hi = parseInt(tmp[1], 16) || 0

                tail[14] = lo
                tail[15] = hi

                md5cycle(state, tail)

                return state
            }

            function rhex (n) {
                var s = ''
                var j
                for (j = 0; j < 4; j += 1) {
                    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F]
                }
                return s
            }

            function hex (x) {
                var i
                for (i = 0; i < x.length; i += 1) {
                    x[i] = rhex(x[i])
                }
                return x.join('')
            }

            // In some cases the fast add32 function cannot be used..
            if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
                add32 = function (x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
                    return (msw << 16) | (lsw & 0xFFFF)
                }
            }

            if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
                (function () {
                    function clamp (val, length) {
                        val = (val | 0) || 0

                        if (val < 0) {
                            return Math.max(val + length, 0)
                        }

                        return Math.min(val, length)
                    }

                    ArrayBuffer.prototype.slice = function (from, to) {
                        var length = this.byteLength
                        var begin = clamp(from, length)
                        var end = length
                        var num
                        var target
                        var targetArray
                        var sourceArray

                        if (to !== undefined) {
                            end = clamp(to, length)
                        }

                        if (begin > end) {
                            return new ArrayBuffer(0)
                        }

                        num = end - begin
                        target = new ArrayBuffer(num)
                        targetArray = new Uint8Array(target)

                        sourceArray = new Uint8Array(this, begin, num)
                        targetArray.set(sourceArray)

                        return target
                    }
                })()
            }

            function toUtf8 (str) {
                if (/[\u0080-\uFFFF]/.test(str)) {
                    str = unescape(encodeURIComponent(str))
                }

                return str
            }

            function utf8Str2ArrayBuffer (str, returnUInt8Array) {
                var length = str.length
                var buff = new ArrayBuffer(length)
                var arr = new Uint8Array(buff)
                var i

                for (i = 0; i < length; i += 1) {
                    arr[i] = str.charCodeAt(i)
                }

                return returnUInt8Array ? arr : buff
            }

            function arrayBuffer2Utf8Str (buff) {
                return String.fromCharCode.apply(null, new Uint8Array(buff))
            }

            function concatenateArrayBuffers (first, second, returnUInt8Array) {
                var result = new Uint8Array(first.byteLength + second.byteLength)

                result.set(new Uint8Array(first))
                result.set(new Uint8Array(second), first.byteLength)

                return returnUInt8Array ? result : result.buffer
            }

            function hexToBinaryString (hex) {
                var bytes = []
                var length = hex.length
                var x

                for (x = 0; x < length - 1; x += 2) {
                    bytes.push(parseInt(hex.substr(x, 2), 16))
                }

                return String.fromCharCode.apply(String, bytes)
            }

            // ---------------------------------------------------

            /**
             * SparkMD5 OOP implementation.
             *
             * Use this class to perform an incremental md5, otherwise use the
             * static methods instead.
             */

            function SparkMD5 () {
                // call reset to init the instance
                this.reset()
            }

            /**
             * Appends a string.
             * A conversion will be applied if an utf8 string is detected.
             *
             * @param {String} str The string to be appended
             *
             * @return {SparkMD5} The instance itself
             */
            SparkMD5.prototype.append = function (str) {
                // Converts the string to utf8 bytes if necessary
                // Then append as binary
                this.appendBinary(toUtf8(str))

                return this
            }

            /**
             * Appends a binary string.
             *
             * @param {String} contents The binary string to be appended
             *
             * @return {SparkMD5} The instance itself
             */
            SparkMD5.prototype.appendBinary = function (contents) {
                this._buff += contents
                this._length += contents.length

                var length = this._buff.length
                var i

                for (i = 64; i <= length; i += 64) {
                    md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)))
                }

                this._buff = this._buff.substring(i - 64)

                return this
            }

            /**
             * Finishes the incremental computation, reseting the internal state and
             * returning the result.
             *
             * @param {Boolean} raw True to get the raw string, false to get the hex string
             *
             * @return {String} The result
             */
            SparkMD5.prototype.end = function (raw) {
                var buff = this._buff
                var length = buff.length
                var i
                var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                var ret

                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3)
                }

                this._finish(tail, length)
                ret = hex(this._hash)

                if (raw) {
                    ret = hexToBinaryString(ret)
                }

                this.reset()

                return ret
            }

            /**
             * Resets the internal state of the computation.
             *
             * @return {SparkMD5} The instance itself
             */
            SparkMD5.prototype.reset = function () {
                this._buff = ''
                this._length = 0
                this._hash = [1732584193, -271733879, -1732584194, 271733878]

                return this
            }

            /**
             * Gets the internal state of the computation.
             *
             * @return {Object} The state
             */
            SparkMD5.prototype.getState = function () {
                return {
                    buff: this._buff,
                    length: this._length,
                    hash: this._hash
                }
            }

            /**
             * Gets the internal state of the computation.
             *
             * @param {Object} state The state
             *
             * @return {SparkMD5} The instance itself
             */
            SparkMD5.prototype.setState = function (state) {
                this._buff = state.buff
                this._length = state.length
                this._hash = state.hash

                return this
            }

            /**
             * Releases memory used by the incremental buffer and other additional
             * resources. If you plan to use the instance again, use reset instead.
             */
            SparkMD5.prototype.destroy = function () {
                delete this._hash
                delete this._buff
                delete this._length
            }

            /**
             * Finish the final calculation based on the tail.
             *
             * @param {Array}  tail   The tail (will be modified)
             * @param {Number} length The length of the remaining buffer
             */
            SparkMD5.prototype._finish = function (tail, length) {
                var i = length
                var tmp
                var lo
                var hi

                tail[i >> 2] |= 0x80 << ((i % 4) << 3)
                if (i > 55) {
                    md5cycle(this._hash, tail)
                    for (i = 0; i < 16; i += 1) {
                        tail[i] = 0
                    }
                }

                // Do the final computation based on the tail and length
                // Beware that the final length may not fit in 32 bits so we take care of that
                tmp = this._length * 8
                tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/)
                lo = parseInt(tmp[2], 16)
                hi = parseInt(tmp[1], 16) || 0

                tail[14] = lo
                tail[15] = hi
                md5cycle(this._hash, tail)
            }

            /**
             * Performs the md5 hash on a string.
             * A conversion will be applied if utf8 string is detected.
             *
             * @param {String}  str The string
             * @param {Boolean} raw True to get the raw string, false to get the hex string
             *
             * @return {String} The result
             */
            SparkMD5.hash = function (str, raw) {
                // Converts the string to utf8 bytes if necessary
                // Then compute it using the binary function
                return SparkMD5.hashBinary(toUtf8(str), raw)
            }

            /**
             * Performs the md5 hash on a binary string.
             *
             * @param {String}  content The binary string
             * @param {Boolean} raw     True to get the raw string, false to get the hex string
             *
             * @return {String} The result
             */
            SparkMD5.hashBinary = function (content, raw) {
                var hash = md51(content)
                var ret = hex(hash)

                return raw ? hexToBinaryString(ret) : ret
            }

            // ---------------------------------------------------

            /**
             * SparkMD5 OOP implementation for array buffers.
             *
             * Use this class to perform an incremental md5 ONLY for array buffers.
             */
            SparkMD5.ArrayBuffer = function () {
                // call reset to init the instance
                this.reset()
            }

            /**
             * Appends an array buffer.
             *
             * @param {ArrayBuffer} arr The array to be appended
             *
             * @return {SparkMD5.ArrayBuffer} The instance itself
             */
            SparkMD5.ArrayBuffer.prototype.append = function (arr) {
                var buff = concatenateArrayBuffers(this._buff.buffer, arr, true)
                var length = buff.length
                var i

                this._length += arr.byteLength

                for (i = 64; i <= length; i += 64) {
                    md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)))
                }

                this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0)

                return this
            }

            /**
             * Finishes the incremental computation, reseting the internal state and
             * returning the result.
             *
             * @param {Boolean} raw True to get the raw string, false to get the hex string
             *
             * @return {String} The result
             */
            SparkMD5.ArrayBuffer.prototype.end = function (raw) {
                var buff = this._buff
                var length = buff.length
                var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                var i
                var ret

                for (i = 0; i < length; i += 1) {
                    tail[i >> 2] |= buff[i] << ((i % 4) << 3)
                }

                this._finish(tail, length)
                ret = hex(this._hash)

                if (raw) {
                    ret = hexToBinaryString(ret)
                }

                this.reset()

                return ret
            }

            /**
             * Resets the internal state of the computation.
             *
             * @return {SparkMD5.ArrayBuffer} The instance itself
             */
            SparkMD5.ArrayBuffer.prototype.reset = function () {
                this._buff = new Uint8Array(0)
                this._length = 0
                this._hash = [1732584193, -271733879, -1732584194, 271733878]

                return this
            }

            /**
             * Gets the internal state of the computation.
             *
             * @return {Object} The state
             */
            SparkMD5.ArrayBuffer.prototype.getState = function () {
                var state = SparkMD5.prototype.getState.call(this)

                // Convert buffer to a string
                state.buff = arrayBuffer2Utf8Str(state.buff)

                return state
            }

            /**
             * Gets the internal state of the computation.
             *
             * @param {Object} state The state
             *
             * @return {SparkMD5.ArrayBuffer} The instance itself
             */
            SparkMD5.ArrayBuffer.prototype.setState = function (state) {
                // Convert string to buffer
                state.buff = utf8Str2ArrayBuffer(state.buff, true)

                return SparkMD5.prototype.setState.call(this, state)
            }

            SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy

            SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish

            /**
             * Performs the md5 hash on an array buffer.
             *
             * @param {ArrayBuffer} arr The array buffer
             * @param {Boolean}     raw True to get the raw string, false to get the hex one
             *
             * @return {String} The result
             */
            SparkMD5.ArrayBuffer.hash = function (arr, raw) {
                var hash = md51_array(new Uint8Array(arr))
                var ret = hex(hash)

                return raw ? hexToBinaryString(ret) : ret
            }

            return SparkMD5
        }))
    }, {}],
    2: [function (require, module, exports) {
        'use strict'

        function _typeof (obj) {
            return obj && typeof Symbol !== 'undefined' && obj.constructor === Symbol ? 'symbol' : typeof obj
        }

        var browserMD5File = require('./browser-md5-file');

        (function (factory) {
            if (typeof define === 'function' && define.amd) {
                define([], factory)
            } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
                window.browserMD5File = factory()
            }
        })(function () {
            return browserMD5File
        })
    }, { './browser-md5-file': 3 }],
    3: [function (require, module, exports) {
        'use strict'

        var SparkMD5 = require('spark-md5')

        module.exports = function (file, callback) {
            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
            var chunkSize = 2097152
            var chunks = Math.ceil(file.size / chunkSize)
            var currentChunk = 0
            var spark = new SparkMD5.ArrayBuffer()
            var reader = new FileReader()

            loadNext()

            reader.onloadend = function (e) {
                spark.append(e.target.result) // Append array buffer
                currentChunk++

                if (currentChunk < chunks) {
                    loadNext()
                } else {
                    callback(null, spark.end())
                }
            }

            reader.onerror = function () {
                callback('oops, something went wrong.')
            }

            function loadNext () {
                var start = currentChunk * chunkSize
                var end = start + chunkSize >= file.size ? file.size : start + chunkSize

                reader.readAsArrayBuffer(blobSlice.call(file, start, end))
            }
        }
    }, { 'spark-md5': 1 }]
}, {}, [2])

/* SHA256 logical functions */
function rotateRight (n, x) {
    return ((x >>> n) | (x << (32 - n)))
}

function choice (x, y, z) {
    return ((x & y) ^ (~x & z))
}

function majority (x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z))
}

function sha256_Sigma0 (x) {
    return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x))
}

function sha256_Sigma1 (x) {
    return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x))
}

function sha256_sigma0 (x) {
    return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3))
}

function sha256_sigma1 (x) {
    return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10))
}

function sha256_expand (W, j) {
    return (W[j & 0x0f] += sha256_sigma1(W[(j + 14) & 0x0f]) + W[(j + 9) & 0x0f] +
        sha256_sigma0(W[(j + 1) & 0x0f]))
}

/* Hash constant words K: */
var K256 = new Array(
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
)

/* global arrays */
var ihash, count, buffer
var sha256_hex_digits = '0123456789abcdef'

/* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters:
overflow) */
function safe_add (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
}

/* Initialise the SHA256 computation */
function sha256_init () {
    ihash = new Array(8)
    count = new Array(2)
    buffer = new Array(64)
    count[0] = count[1] = 0
    ihash[0] = 0x6a09e667
    ihash[1] = 0xbb67ae85
    ihash[2] = 0x3c6ef372
    ihash[3] = 0xa54ff53a
    ihash[4] = 0x510e527f
    ihash[5] = 0x9b05688c
    ihash[6] = 0x1f83d9ab
    ihash[7] = 0x5be0cd19
}

/* Transform a 512-bit message block */
function sha256_transform () {
    var a, b, c, d, e, f, g, h, T1, T2
    var W = new Array(16)

    /* Initialize registers with the previous intermediate value */
    a = ihash[0]
    b = ihash[1]
    c = ihash[2]
    d = ihash[3]
    e = ihash[4]
    f = ihash[5]
    g = ihash[6]
    h = ihash[7]

    /* make 32-bit words */
    for (var i = 0; i < 16; i++) {
        W[i] = ((buffer[(i << 2) + 3]) | (buffer[(i << 2) + 2] << 8) | (buffer[(i << 2) + 1] <<
            16) | (buffer[i << 2] << 24))
    }

    for (var j = 0; j < 64; j++) {
        T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j]
        if (j < 16) T1 += W[j]
        else T1 += sha256_expand(W, j)
        T2 = sha256_Sigma0(a) + majority(a, b, c)
        h = g
        g = f
        f = e
        e = safe_add(d, T1)
        d = c
        c = b
        b = a
        a = safe_add(T1, T2)
    }

    /* Compute the current intermediate hash value */
    ihash[0] += a
    ihash[1] += b
    ihash[2] += c
    ihash[3] += d
    ihash[4] += e
    ihash[5] += f
    ihash[6] += g
    ihash[7] += h
}

/* Read the next chunk of data and update the SHA256 computation */
function sha256_update (data, inputLen) {
    var i; var index; var curpos = 0
    /* Compute number of bytes mod 64 */
    index = ((count[0] >> 3) & 0x3f)
    var remainder = (inputLen & 0x3f)

    /* Update number of bits */
    if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++
    count[1] += (inputLen >> 29)

    /* Transform as many times as possible */
    for (i = 0; i + 63 < inputLen; i += 64) {
        for (var j = index; j < 64; j++) { buffer[j] = data.charCodeAt(curpos++) }
        sha256_transform()
        index = 0
    }

    /* Buffer remaining input */
    for (var j = 0; j < remainder; j++) { buffer[j] = data.charCodeAt(curpos++) }
}

/* Finish the computation by operations such as padding */
function sha256_final () {
    var index = ((count[0] >> 3) & 0x3f)
    buffer[index++] = 0x80
    if (index <= 56) {
        for (var i = index; i < 56; i++) { buffer[i] = 0 }
    } else {
        for (var i = index; i < 64; i++) { buffer[i] = 0 }
        sha256_transform()
        for (var i = 0; i < 56; i++) { buffer[i] = 0 }
    }
    buffer[56] = (count[1] >>> 24) & 0xff
    buffer[57] = (count[1] >>> 16) & 0xff
    buffer[58] = (count[1] >>> 8) & 0xff
    buffer[59] = count[1] & 0xff
    buffer[60] = (count[0] >>> 24) & 0xff
    buffer[61] = (count[0] >>> 16) & 0xff
    buffer[62] = (count[0] >>> 8) & 0xff
    buffer[63] = count[0] & 0xff
    sha256_transform()
}

/* Split the internal hash values into an array of bytes */
function sha256_encode_bytes () {
    var j = 0
    var output = new Array(32)
    for (var i = 0; i < 8; i++) {
        output[j++] = ((ihash[i] >>> 24) & 0xff)
        output[j++] = ((ihash[i] >>> 16) & 0xff)
        output[j++] = ((ihash[i] >>> 8) & 0xff)
        output[j++] = (ihash[i] & 0xff)
    }
    return output
}

/* Get the internal hash as a hex string */
function sha256_encode_hex () {
    var output = new String()
    for (var i = 0; i < 8; i++) {
        for (var j = 28; j >= 0; j -= 4) { output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f) }
    }
    return output
}

/* Main function: returns a hex string representing the SHA256 value of the
given data */
function sha256_digest (data) {
    sha256_init()
    sha256_update(data, data.length)
    sha256_final()
    return sha256_encode_hex()
}

/* test if the JS-interpreter is working properly */
function sha256_self_test () {
    return sha256_digest('message digest') ==
        'f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650'
}
export { ReconnectingWebSocket, FingoIMBase }
