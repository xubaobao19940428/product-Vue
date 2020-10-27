import long from 'long'
import protobuf from 'protobufjs'
// import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import protoRoot from '@/proto/proto'
const md5 = require('js-md5')

// Todo 统一请求路径前缀
const BASE = process.env.VUE_APP_API + '/agent/back/proxystream'

const httpService = axios.create({
    timeout: 45000,
    method: 'post',
    responseType: 'arraybuffer'
})


// http response 拦截器
httpService.interceptors.response.use(response => {
    switch (response.data.ret.errcode) {
        case 704:
            if (localStorage.getItem('adminToken')) {
                Message.warning(`ErrorMsg: ${response.data.ret.msg ? response.data.ret.msg : response.data.ret.errname}, ErrorCode: ${response.data.ret.errcode}`)
            }
            localStorage.clear()
            router.push({
                name: 'login'
            })
            break
    default:
        return response
    }
})


// 请求体message
const PBMessageRequest = protoRoot.lookupType('agent.BackProxyRequest')
// 响应体的message
const PBMessageResponse = protoRoot.lookupType('agent.BackProxyResponse')

// 将请求数据encode成二进制，encode是proto.js提供的方法
function transformRequest (data) {
    return PBMessageRequest.encode(data).finish()
}
function stringToBytes (str) {
    let bytes = new Array()
    let len, c
    len = str.length
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0)
            bytes.push(((c >> 12) & 0x3F) | 0x80)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0)
            bytes.push((c & 0x3F) | 0x80)
        } else {
            bytes.push(c & 0xFF)
        }
    }
    return bytes
}

function isArrayBuffer (obj) {
    return Object.prototype.toString.call(obj) === '[object ArrayBuffer]'
}

function transformResponseFactory (responseType) {
    return function transformResponse (rawResponse) {
        // 判断response是否是arrayBuffer
        if (rawResponse == null || !isArrayBuffer(rawResponse)) {
            return rawResponse
        }
        try {
            const buf = protobuf.util.newBuffer(rawResponse)
            // decode响应体
            const decodedResponse = PBMessageResponse.decode(buf)
            if (decodedResponse.res && responseType) {
                const model = protoRoot.lookup(responseType)
                decodedResponse.res = model.decode(decodedResponse.res)
                decodedResponse.res = model.toObject(decodedResponse.res, {
                    longs: String,
                    defaults: true
                })
            }
            
            return decodedResponse
        } catch (err) {
            return err
        }
    }
}

/**
 * @param {*} serviceName 服务名称
 * @param {*} interfaceName 接口名称
 * @param {*} requestBody 请求体参数
 * @param {*} responseType 返回值
 */
function request (serviceName, interfaceName, requestBody, responseType, noTips) {
    // 构造公共请求体:PBMessageRequest
    const reqData = {
        serviceName: `littlec-${serviceName}`,
        interfaceName: `${interfaceName}`,
        data: requestBody
    }
    // 将对象序列化成请求体实例
    const req = PBMessageRequest.create(reqData)
    let encodeReq = PBMessageRequest.encode(req).finish()
    let userInfo = localStorage.adminUserInfo ? JSON.parse(localStorage.adminUserInfo) : null
    let token = []
    if (userInfo) {
        token = stringToBytes(userInfo.token)
    }
    let md5Req = md5(Int8Array.from([...encodeReq, ...token]))
    // 这里用到axios的配置项：transformRequest和transformResponse
    // transformRequest 发起请求时，调用transformRequest方法，目的是将req转换成二进制
    // transformResponse 对返回的数据进行处理，目的是将二进制转换成真正的json数据
    return httpService({
        url: BASE,
        data: req,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/octet-stream',
            'Operator-ID': userInfo ? userInfo.id : null,
            'Language-Code': 'cn',
            'Signature': md5Req
        },
        method: 'POST',
        transformRequest: transformRequest,
        transformResponse: transformResponseFactory(responseType)
    }).then(({ data, status }) => {
        // 对请求做处理
        if (status !== 200) {
            const err = new Error('服务器异常')
            throw err
        }
        console.log(interfaceName, data)
        if (data.res.ret.errcode === 1) {
            return data.res
        } else {
            if (!noTips) {
                Message.warning({
                    message: `ErrorMsg: ${data.res.ret.msg ? data.res.ret.msg : data.res.ret.errname}, ErrorCode: ${data.res.ret.errcode}`,
                    customClass: 'break-all'
                })
            }
        }
        return data.res
    }, (err) => {
        // if (err.message && !noTips) {
        //     Message({
        //         message: err.message,
        //         type: 'error',
        //         duration: 5 * 1000
        //     })
        // }
        throw err
    })
}

// 在request下添加一个方法，方便用于处理请求参数
request.create = function (protoName, obj) {
    console.log(protoName, obj)
    const pbConstruct = protoRoot.lookup(protoName)
    return pbConstruct.encode(obj).finish()
}

export default request
